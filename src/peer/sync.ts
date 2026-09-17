import Peer, { type DataConnection } from 'peerjs'
import type { GameState, PeerMsg } from '../types'
import { peerIdFromCode } from '../lib/room'

export type SyncHandlers = {
  onState: (state: GameState) => void
  onMiniAction: (action: string, payload?: unknown) => void
  onGuestJoined: (name: string) => void
  onStatus: (status: string) => void
  onError: (err: string) => void
}

export class RoomSync {
  peer: Peer | null = null
  conn: DataConnection | null = null
  role: 'host' | 'guest' | null = null
  handlers: SyncHandlers
  private code = ''

  constructor(handlers: SyncHandlers) {
    this.handlers = handlers
  }

  setHandlers(handlers: Partial<SyncHandlers>) {
    this.handlers = { ...this.handlers, ...handlers }
  }

  async host(code: string): Promise<void> {
    this.destroy()
    this.role = 'host'
    this.code = code.toUpperCase()
    const id = peerIdFromCode(this.code)
    this.handlers.onStatus('Opening room…')

    this.peer = new Peer(id, {
      debug: 0,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      },
    })

    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('PeerJS timeout — try a new code')), 15000)
      this.peer!.on('open', () => {
        clearTimeout(t)
        this.handlers.onStatus('Room open — share the code')
        resolve()
      })
      this.peer!.on('error', (e) => {
        clearTimeout(t)
        const msg =
          e?.type === 'unavailable-id'
            ? 'Code taken — generate a new one'
            : e?.message || String(e)
        this.handlers.onError(msg)
        reject(e)
      })
    })

    this.peer.on('connection', (c) => {
      this.conn = c
      this.wire(c)
      this.handlers.onStatus('Partner connecting…')
    })
  }

  async join(code: string, guestName: string): Promise<void> {
    this.destroy()
    this.role = 'guest'
    this.code = code.toUpperCase()
    const hostId = peerIdFromCode(this.code)
    this.handlers.onStatus('Connecting…')

    this.peer = new Peer({
      debug: 0,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      },
    })

    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('Could not reach PeerJS')), 15000)
      this.peer!.on('open', () => {
        clearTimeout(t)
        resolve()
      })
      this.peer!.on('error', (e) => {
        clearTimeout(t)
        this.handlers.onError(e?.message || String(e))
        reject(e)
      })
    })

    const c = this.peer.connect(hostId, { reliable: true })
    this.conn = c

    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('Host not found — check code')), 12000)
      c.on('open', () => {
        clearTimeout(t)
        this.handlers.onStatus('Connected')
        this.send({ type: 'hello', role: 'guest', name: guestName })
        resolve()
      })
      c.on('error', (e) => {
        clearTimeout(t)
        reject(e)
      })
    })

    this.wire(c)
  }

  private wire(c: DataConnection) {
    c.on('data', (raw) => {
      try {
        const msg = raw as PeerMsg
        if (msg.type === 'hello' && this.role === 'host') {
          this.handlers.onGuestJoined(msg.name)
        } else if (msg.type === 'welcome') {
          this.handlers.onState(msg.state)
        } else if (msg.type === 'state') {
          this.handlers.onState(msg.state)
        } else if (msg.type === 'minigame-action') {
          this.handlers.onMiniAction(msg.action, msg.payload)
        }
      } catch {
        /* ignore */
      }
    })
    c.on('close', () => this.handlers.onStatus('Partner disconnected'))
    c.on('error', (e) => this.handlers.onError(e?.message || 'Connection error'))
  }

  send(msg: PeerMsg) {
    if (this.conn?.open) this.conn.send(msg)
  }

  broadcastState(state: GameState) {
    this.send({ type: 'state', state })
  }

  sendWelcome(state: GameState, guestName: string) {
    this.send({ type: 'welcome', state: { ...state, guestName }, guestName })
  }

  sendMiniAction(action: string, payload?: unknown) {
    this.send({ type: 'minigame-action', action, payload })
  }

  destroy() {
    try {
      this.conn?.close()
    } catch {
      /* */
    }
    try {
      this.peer?.destroy()
    } catch {
      /* */
    }
    this.conn = null
    this.peer = null
  }
}
