import Peer, { type DataConnection, type PeerError } from 'peerjs'
import type { PeerMsg } from '../types'
import { fixedPeerId, peerIdFromCode, type RoomMode } from '../lib/room'

export type SyncHandlers<TState = unknown> = {
  onState: (state: TState) => void
  onMiniAction: (action: string, payload?: unknown) => void
  onGuestJoined: (name: string) => void
  onStatus: (status: string) => void
  onError: (err: string) => void
  onReconnecting?: (active: boolean) => void
}

const ICE = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function errType(e: unknown): string {
  if (e && typeof e === 'object' && 'type' in e) return String((e as { type?: string }).type || '')
  return ''
}

function errMsg(e: unknown): string {
  if (e instanceof Error && e.message) return e.message
  if (e && typeof e === 'object' && 'message' in e && (e as { message?: string }).message) {
    return String((e as { message?: string }).message)
  }
  return 'Connection error'
}

export class RoomSync<TState = unknown> {
  peer: Peer | null = null
  conn: DataConnection | null = null
  role: 'host' | 'guest' | null = null
  handlers: SyncHandlers<TState>
  mode: RoomMode = 'full'
  code = ''
  fixed = false
  peerId = ''
  myName = ''
  partnerName = ''
  guestName = ''
  private lastState: TState | null = null
  private reconnecting = false
  private generation = 0
  private ended = false
  /** True while we are deliberately opening/closing a peer. Disconnects must not destroy the session. */
  private suppress = false
  private hostBound = new WeakSet<Peer>()
  private guestBound = new WeakSet<Peer>()

  constructor(handlers: SyncHandlers<TState>) {
    this.handlers = handlers
  }

  setHandlers(handlers: Partial<SyncHandlers<TState>>) {
    this.handlers = { ...this.handlers, ...handlers }
  }

  rememberState(state: TState) {
    this.lastState = state
  }

  /**
   * Signaling socket up, and (guest) an open data channel.
   * Host is healthy with no guest yet — the room stays open.
   */
  isHealthy(): boolean {
    const p = this.peer
    if (!p || p.destroyed || p.disconnected || !p.open) return false
    if (!this.socketLikelyOpen(p)) return false
    if (this.role === 'guest') return Boolean(this.conn?.open)
    return true
  }

  /** Restore identity after a reload without creating a peer yet. */
  adopt(opts: {
    role: 'host' | 'guest'
    mode: RoomMode
    code: string
    fixed: boolean
    myName: string
    partnerName: string
  }) {
    this.ended = false
    this.suppress = false
    this.role = opts.role
    this.mode = opts.mode
    this.code = (opts.code || '').toUpperCase()
    this.fixed = opts.fixed
    this.myName = opts.myName
    this.partnerName = opts.partnerName
    this.guestName = opts.role === 'guest' ? opts.myName : ''
    this.peerId = opts.fixed ? fixedPeerId(opts.mode) : peerIdFromCode(this.code, opts.mode)
  }

  async host(code: string, mode: RoomMode = 'full'): Promise<void> {
    this.ended = false
    this.fixed = false
    this.mode = mode
    this.code = code.toUpperCase()
    this.peerId = peerIdFromCode(this.code, mode)
    this.role = 'host'
    await this.openAsHost(this.peerId, 'Room open — share the code', { quiet: false, openTimeout: 15000 })
  }

  async join(code: string, guestName: string, mode: RoomMode = 'full'): Promise<void> {
    this.ended = false
    this.fixed = false
    this.mode = mode
    this.code = code.toUpperCase()
    this.peerId = peerIdFromCode(this.code, mode)
    this.role = 'guest'
    this.myName = guestName
    this.guestName = guestName
    await this.openAsGuest(this.peerId, guestName, { quiet: false, dialTimeout: 12000 })
  }

  /**
   * Both phones call this. Winner claims the fixed id and hosts; the other joins.
   * If the host isn't up yet (or a stale id is still reserved), keep trying for ~30s.
   */
  async playTogether(opts: {
    mode: RoomMode
    myName: string
    partnerName: string
  }): Promise<'host' | 'guest'> {
    this.ended = false
    this.fixed = true
    this.mode = opts.mode
    this.myName = opts.myName
    this.partnerName = opts.partnerName
    this.code = ''
    this.peerId = fixedPeerId(opts.mode)
    this.guestName = opts.myName

    const deadline = Date.now() + 30_000
    let last: unknown = new Error(`Couldn't reach ${opts.partnerName}`)

    while (Date.now() < deadline && !this.ended) {
      this.handlers.onStatus(`Waiting for ${opts.partnerName}…`)
      try {
        await this.openAsHost(this.peerId, `Waiting for ${opts.partnerName}…`, {
          quiet: true,
          openTimeout: 8000,
        })
        this.role = 'host'
        this.handlers.onStatus(`Waiting for ${opts.partnerName}…`)
        return 'host'
      } catch (e) {
        if (this.ended) throw e
        if (errType(e) !== 'unavailable-id') {
          last = e
          await sleep(2000)
          continue
        }
      }

      this.role = 'guest'
      this.handlers.onStatus(`Waiting for ${opts.partnerName}…`)
      try {
        await this.openAsGuest(this.peerId, opts.myName, { quiet: true, dialTimeout: 5000 })
        this.role = 'guest'
        this.handlers.onStatus('Connected')
        return 'guest'
      } catch (e) {
        last = e
        if (this.ended) throw e
        await sleep(2000)
      }
    }

    throw last instanceof Error ? last : new Error(errMsg(last))
  }

  /** Reclaim the same peer id (host) or redial (guest). Never ends the session. */
  async ensureConnected(): Promise<void> {
    if (this.ended || this.suppress || !this.role || !this.peerId) return
    if (this.reconnecting) return
    if (this.isHealthy()) {
      this.handlers.onReconnecting?.(false)
      return
    }

    this.reconnecting = true
    this.handlers.onReconnecting?.(true)
    this.handlers.onStatus('Reconnecting…')
    const gen = ++this.generation

    try {
      if (this.role === 'host') await this.reclaimHost()
      else await this.redialGuest()
      if (gen !== this.generation || this.ended) return
      if (this.role === 'host') {
        this.handlers.onStatus(
          this.conn?.open
            ? 'Reconnected'
            : this.fixed
              ? `Waiting for ${this.partnerName || 'your partner'}…`
              : 'Room open — share the code',
        )
      } else {
        this.handlers.onStatus('Connected')
      }
      this.handlers.onReconnecting?.(false)
    } catch {
      if (gen !== this.generation || this.ended) return
      this.handlers.onStatus('Reconnecting…')
      this.handlers.onReconnecting?.(true)
    } finally {
      if (gen === this.generation) {
        this.reconnecting = false
        if (!this.ended && this.role && !this.suppress && !this.isHealthy()) {
          window.setTimeout(() => {
            if (!this.ended && !this.isHealthy()) void this.ensureConnected()
          }, 2000)
        }
      }
    }
  }

  private async reclaimHost() {
    if (this.peer && !this.peer.destroyed && this.peer.disconnected) {
      const ok = await this.tryBrokerReconnect()
      if (ok && this.peer && !this.peer.destroyed && this.peer.open) {
        this.bindHost(this.peer)
        return
      }
    }
    let last: unknown
    for (let i = 0; i < 8 && !this.ended; i++) {
      try {
        await this.openAsHost(this.peerId, 'Reconnecting…', { quiet: true, openTimeout: 8000 })
        return
      } catch (e) {
        last = e
        if (this.ended) throw e
        await sleep(1500)
      }
    }
    throw last ?? new Error('Could not reclaim room')
  }

  private async redialGuest() {
    const name = this.guestName || this.myName || 'Guest'
    if (
      this.peer &&
      !this.peer.destroyed &&
      this.peer.open &&
      !this.peer.disconnected &&
      this.socketLikelyOpen(this.peer)
    ) {
      try {
        await this.dial(this.peerId, name, 8000)
        return
      } catch {
        /* fall through to a full reopen */
      }
    }
    if (this.peer && !this.peer.destroyed && this.peer.disconnected) {
      const ok = await this.tryBrokerReconnect()
      if (ok && this.peer && this.peer.open) {
        try {
          await this.dial(this.peerId, name, 8000)
          return
        } catch {
          /* reopen */
        }
      }
    }
    await this.openAsGuest(this.peerId, name, { quiet: true, dialTimeout: 8000 })
  }

  private tryBrokerReconnect(): Promise<boolean> {
    const p = this.peer
    if (!p || p.destroyed || !p.disconnected) return Promise.resolve(false)
    return new Promise((resolve) => {
      let done = false
      const finish = (ok: boolean) => {
        if (done) return
        done = true
        clearTimeout(timer)
        resolve(ok)
      }
      const timer = setTimeout(() => finish(Boolean(p.open && !p.disconnected && !p.destroyed)), 7000)
      p.once('open', () => finish(true))
      p.once('error', () => finish(false))
      try {
        p.reconnect()
      } catch {
        finish(false)
      }
    })
  }

  private socketLikelyOpen(p: Peer): boolean {
    const ws = (p.socket as unknown as { _socket?: WebSocket } | undefined)?._socket
    if (!ws) return p.open && !p.disconnected
    return ws.readyState === WebSocket.OPEN
  }

  private killPeer() {
    const p = this.peer
    const c = this.conn
    this.peer = null
    this.conn = null
    try {
      c?.close()
    } catch {
      /* */
    }
    try {
      p?.destroy()
    } catch {
      /* */
    }
  }

  private onLiveError(e: PeerError<string>) {
    if (this.ended || this.suppress) return
    const t = e?.type || ''
    if (
      t === 'unavailable-id' ||
      t === 'peer-unavailable' ||
      t === 'network' ||
      t === 'disconnected' ||
      t === 'server-error' ||
      t === 'socket-error' ||
      t === 'webrtc' ||
      t === 'browser-incompatible'
    ) {
      this.handlers.onStatus('Reconnecting…')
      this.handlers.onReconnecting?.(true)
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        void this.ensureConnected()
      }
      return
    }
    this.handlers.onStatus('Reconnecting…')
    this.handlers.onReconnecting?.(true)
  }

  private async openAsHost(
    id: string,
    readyStatus: string,
    opts: { quiet: boolean; openTimeout: number },
  ) {
    this.suppress = true
    try {
      this.killPeer()
      this.role = 'host'
      this.peerId = id
      if (!opts.quiet) this.handlers.onStatus('Opening room…')

      const peer = new Peer(id, { debug: 0, config: ICE })
      this.peer = peer
      let opened = false

      await new Promise<void>((resolve, reject) => {
        let settled = false
        const fail = (e: unknown) => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          reject(e)
        }
        const ok = () => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          resolve()
        }
        const timer = setTimeout(() => fail(new Error('PeerJS timeout — try again')), opts.openTimeout)
        peer.on('open', () => {
          opened = true
          this.handlers.onStatus(readyStatus)
          ok()
        })
        peer.on('error', (e) => {
          if (!opened) {
            if (!opts.quiet) {
              const msg =
                e.type === 'unavailable-id' ? 'Code taken — generate a new one' : e.message || 'Connection error'
              this.handlers.onError(msg)
            }
            fail(e)
          } else {
            this.onLiveError(e)
          }
        })
      })

      this.bindHost(peer)
      this.suppress = false
    } catch (e) {
      this.suppress = false
      this.killPeer()
      throw e
    }
  }

  private bindHost(peer: Peer) {
    if (this.hostBound.has(peer)) return
    this.hostBound.add(peer)
    peer.on('connection', (c) => {
      if (this.peer !== peer || this.ended) return
      const prev = this.conn
      this.conn = c
      if (prev && prev !== c) {
        try {
          prev.close()
        } catch {
          /* */
        }
      }
      this.wire(c)
      const push = () => {
        if (this.conn !== c || !this.lastState) return
        this.send({ type: 'state', state: this.lastState })
      }
      if (c.open) push()
      else c.on('open', push)
      this.handlers.onStatus('Partner connecting…')
    })
    peer.on('disconnected', () => {
      if (this.peer !== peer || this.ended || this.suppress) return
      this.handlers.onStatus('Reconnecting…')
      this.handlers.onReconnecting?.(true)
      if (document.visibilityState === 'visible') void this.ensureConnected()
    })
  }

  private async openAsGuest(
    hostId: string,
    guestName: string,
    opts: { quiet: boolean; dialTimeout: number },
  ) {
    this.suppress = true
    try {
      this.killPeer()
      this.role = 'guest'
      this.peerId = hostId
      this.guestName = guestName
      this.myName = guestName
      if (!opts.quiet) this.handlers.onStatus('Connecting…')

      const peer = new Peer({ debug: 0, config: ICE })
      this.peer = peer
      let opened = false

      await new Promise<void>((resolve, reject) => {
        let settled = false
        const fail = (e: unknown) => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          reject(e)
        }
        const ok = () => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          resolve()
        }
        const timer = setTimeout(() => fail(new Error('Could not reach PeerJS')), 12000)
        peer.on('open', () => {
          opened = true
          ok()
        })
        peer.on('error', (e) => {
          if (!opened) {
            if (!opts.quiet) this.handlers.onError(e.message || 'Connection error')
            fail(e)
          } else {
            this.onLiveError(e)
          }
        })
      })

      await this.dial(hostId, guestName, opts.dialTimeout)
      this.bindGuest(peer)
      this.suppress = false
    } catch (e) {
      this.suppress = false
      this.killPeer()
      throw e
    }
  }

  private bindGuest(peer: Peer) {
    if (this.guestBound.has(peer)) return
    this.guestBound.add(peer)
    peer.on('disconnected', () => {
      if (this.peer !== peer || this.ended || this.suppress) return
      this.handlers.onStatus('Reconnecting…')
      this.handlers.onReconnecting?.(true)
      if (document.visibilityState === 'visible') void this.ensureConnected()
    })
  }

  private dial(hostId: string, guestName: string, timeoutMs: number) {
    const peer = this.peer
    if (!peer) return Promise.reject(new Error('No peer'))
    const prev = this.conn
    this.conn = null
    if (prev) {
      try {
        prev.close()
      } catch {
        /* */
      }
    }
    const c = peer.connect(hostId, { reliable: true })
    this.conn = c
    return new Promise<void>((resolve, reject) => {
      let settled = false
      const fail = (e: unknown) => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        reject(e instanceof Error ? e : new Error(errMsg(e)))
      }
      const ok = () => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        this.handlers.onStatus('Connected')
        this.send({ type: 'hello', role: 'guest', name: guestName })
        this.wire(c)
        resolve()
      }
      const timer = setTimeout(() => fail(new Error('Host not found — check code')), timeoutMs)
      c.on('open', ok)
      c.on('error', (e) => fail(e))
    })
  }

  private wire(c: DataConnection) {
    c.on('data', (raw) => {
      try {
        const msg = raw as PeerMsg
        if (msg.type === 'hello' && this.role === 'host') {
          this.handlers.onGuestJoined(msg.name)
        } else if (msg.type === 'welcome') {
          this.handlers.onState(msg.state as TState)
        } else if (msg.type === 'state') {
          this.handlers.onState(msg.state as TState)
        } else if (msg.type === 'minigame-action') {
          this.handlers.onMiniAction(msg.action, msg.payload)
        }
      } catch {
        /* ignore */
      }
    })
    c.on('close', () => {
      if (this.conn !== c) return
      this.conn = null
      if (this.ended || this.suppress) return
      if (this.role === 'guest') {
        this.handlers.onStatus('Reconnecting…')
        this.handlers.onReconnecting?.(true)
        if (document.visibilityState === 'visible') void this.ensureConnected()
      } else {
        this.handlers.onStatus('Holding the room…')
      }
    })
    c.on('error', () => {
      if (this.ended || this.suppress) return
      this.handlers.onStatus('Reconnecting…')
      this.handlers.onReconnecting?.(true)
      if (this.role === 'guest' && document.visibilityState === 'visible') void this.ensureConnected()
    })
  }

  send(msg: PeerMsg) {
    if (this.conn?.open) this.conn.send(msg)
  }

  broadcastState(state: TState) {
    this.lastState = state
    this.send({ type: 'state', state })
  }

  sendWelcome(state: TState, guestName: string) {
    const next = { ...(state as object), guestName } as TState
    this.lastState = next
    this.send({
      type: 'welcome',
      state: next,
      guestName,
    })
  }

  sendMiniAction(action: string, payload?: unknown) {
    this.send({ type: 'minigame-action', action, payload })
  }

  destroy() {
    this.ended = true
    this.generation++
    this.suppress = true
    this.reconnecting = false
    this.killPeer()
    this.role = null
    this.handlers.onReconnecting?.(false)
  }
}
