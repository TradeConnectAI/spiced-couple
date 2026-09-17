import { useCallback, useEffect, useRef, useState } from 'react'
import { Landing } from './components/Landing'
import { Lobby } from './components/Lobby'
import { WaitingRoom } from './components/WaitingRoom'
import { GameShell } from './components/GameShell'
import { Narrator } from './components/Narrator'
import { ResultBanner } from './components/ResultBanner'
import { ForfeitView } from './components/ForfeitView'
import { ActShop } from './components/ActShop'
import { ChallengeView } from './components/ChallengeView'
import { MeetupGate } from './components/MeetupGate'
import { HouseRulesBanner } from './components/HouseRules'
import { Dobble } from './components/MiniGames/Dobble'
import { CardWar } from './components/MiniGames/CardWar'
import { ReactionDuel } from './components/MiniGames/ReactionDuel'
import { HotPotato } from './components/MiniGames/HotPotato'
import { Button } from './components/ui/Button'
import { ReconnectBanner } from './components/ReconnectBanner'
import { RoomSync } from './peer/sync'
import { SHOP_ITEMS } from './content/shop'
import {
  applyWin,
  buyAct,
  clearPendingAct,
  completeChallenge,
  completeForfeit,
  continueFromNarrator,
  goToForfeit,
  markTogether,
  skipForfeit,
  startChallenge,
  startSession,
} from './lib/gameLogic'
import { emptyState, type GameState, type Intensity, type ShopItem } from './types'
import { sfx } from './lib/audio'
import { ApartNightApp } from './apart/ApartNightApp'
import { useRoomKeepAlive } from './lib/keepAlive'
import { clearSession, loadSession, saveSession, type SavedSession } from './lib/session'
import { readLaunchParams } from './lib/room'

type Screen = 'landing' | 'lobby' | 'waiting' | 'game'
type Mode = 'pick' | 'full' | 'apart'

function readBoot() {
  return { saved: loadSession(), launch: readLaunchParams() }
}

export default function App() {
  const [boot] = useState(readBoot)
  const [resumeOffer, setResumeOffer] = useState<SavedSession | null>(boot.saved)
  const [apartResume, setApartResume] = useState<SavedSession | null>(null)
  const [mode, setMode] = useState<Mode>(boot.saved ? 'pick' : (boot.launch?.mode ?? 'pick'))
  const [screen, setScreen] = useState<Screen>(
    boot.saved ? 'landing' : boot.launch?.mode === 'full' ? 'lobby' : 'landing',
  )
  const [role, setRole] = useState<'host' | 'guest'>('host')
  const [roomCode, setRoomCode] = useState('')
  const [fixedRoom, setFixedRoom] = useState(false)
  const [reconnecting, setReconnecting] = useState(false)
  const [state, setState] = useState<GameState>(() => emptyState())
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [connected, setConnected] = useState(false)
  const [solo, setSolo] = useState(false)

  const [cardRevealed, setCardRevealed] = useState(false)
  const [reactionWinner, setReactionWinner] = useState<'host' | 'guest' | null>(null)
  const [potatoHolder, setPotatoHolder] = useState<'host' | 'guest'>('host')
  const [potatoStarted, setPotatoStarted] = useState(false)
  const [potatoBoom, setPotatoBoom] = useState(false)
  const [miniResolved, setMiniResolved] = useState(false)

  const syncRef = useRef<RoomSync<GameState> | null>(null)
  const stateRef = useRef(state)
  const roleRef = useRef(role)
  const soloRef = useRef(solo)
  const miniResolvedRef = useRef(miniResolved)
  const screenRef = useRef(screen)
  const codeRef = useRef(roomCode)
  const connectedRef = useRef(connected)
  const remoteRef = useRef(false)
  stateRef.current = state
  roleRef.current = role
  soloRef.current = solo
  miniResolvedRef.current = miniResolved
  screenRef.current = screen
  codeRef.current = roomCode
  connectedRef.current = connected

  const pushState = useCallback((next: GameState) => {
    setState(next)
    stateRef.current = next
    syncRef.current?.rememberState(next)
    if (roleRef.current === 'host' && syncRef.current) {
      syncRef.current.broadcastState(next)
    }
  }, [])

  const resetMiniEphemeral = () => {
    setCardRevealed(false)
    setReactionWinner(null)
    setPotatoHolder('host')
    setPotatoStarted(false)
    setPotatoBoom(false)
    setMiniResolved(false)
    miniResolvedRef.current = false
  }

  const handleMiniAction = useCallback(
    (action: string, payload?: unknown) => {
      const isHost = roleRef.current === 'host'

      if (action === 'card-reveal') setCardRevealed(true)
      else if (action === 'potato-pass') setPotatoHolder(payload as 'host' | 'guest')
      else if (action === 'potato-start') setPotatoStarted(true)
      else if (action === 'potato-boom') setPotatoBoom(true)
      else if (action === 'reaction-win' || action === 'dobble-win') {
        const w = (payload as { winner: 'host' | 'guest' }).winner
        if (action === 'reaction-win') setReactionWinner(w)
        if (isHost && !miniResolvedRef.current) {
          miniResolvedRef.current = true
          setMiniResolved(true)
          pushState(applyWin(stateRef.current, w))
        }
      } else if (action === 'forfeit-done' && isHost) {
        pushState(completeForfeit(stateRef.current))
      } else if (action === 'forfeit-skip' && isHost) {
        const who = (payload as { who: 'host' | 'guest' }).who
        const next = skipForfeit(stateRef.current, who)
        if (next) pushState(next)
      } else if (action === 'shop-buy' && isHost) {
        const { itemId, buyer } = payload as { itemId: string; buyer: 'host' | 'guest' }
        const item = SHOP_ITEMS.find((i) => i.id === itemId)
        if (!item) return
        const res = buyAct(stateRef.current, item, buyer)
        if (!('error' in res)) pushState(res)
      } else if (action === 'act-done' && isHost) {
        pushState(clearPendingAct(stateRef.current))
      } else if (action === 'shop-continue' && isHost) {
        pushState(startChallenge(stateRef.current))
      } else if (action === 'meetup-ready' && isHost) {
        const who = (payload as { who: 'host' | 'guest' }).who
        pushState(markTogether(stateRef.current, who, false))
      }
    },
    [pushState],
  )

  const ensureSync = useCallback(() => {
    if (syncRef.current) {
      syncRef.current.setHandlers({ onMiniAction: handleMiniAction })
      return syncRef.current
    }
    const sync = new RoomSync<GameState>({
      onState: (s) => {
        remoteRef.current = true
        setState(s)
        stateRef.current = s
        syncRef.current?.rememberState(s)
        setConnected(true)
        setReconnecting(false)
        if (s.started) {
          setScreen('game')
          screenRef.current = 'game'
        } else {
          setScreen('waiting')
          screenRef.current = 'waiting'
        }
      },
      onMiniAction: handleMiniAction,
      onGuestJoined: (name) => {
        setConnected(true)
        setReconnecting(false)
        setStatus(`${name} joined`)
        const next = { ...stateRef.current, guestName: name }
        setState(next)
        stateRef.current = next
        syncRef.current?.sendWelcome(next, name)
      },
      onStatus: setStatus,
      onError: (msg) => {
        if (!msg) {
          setError('')
          return
        }
        const scr = screenRef.current
        if (scr === 'lobby' || scr === 'landing') setError(msg)
        else {
          setReconnecting(true)
          setStatus('Reconnecting…')
        }
      },
      onReconnecting: setReconnecting,
    })
    syncRef.current = sync
    return sync
  }, [handleMiniAction])

  const persistSession = useCallback(() => {
    if (soloRef.current) return
    const scr = screenRef.current
    if (scr !== 'waiting' && scr !== 'game') return
    const sync = syncRef.current
    if (!sync?.role) return
    const st = stateRef.current
    const myName = (sync.role === 'host' ? st.hostName : st.guestName) || sync.myName || 'Steve'
    const partnerName = (sync.role === 'host' ? st.guestName : st.hostName) || sync.partnerName || 'Laura'
    saveSession({
      v: 1,
      role: sync.role,
      mode: 'full',
      code: sync.fixed ? '' : codeRef.current,
      fixed: sync.fixed,
      hostName: st.hostName || 'Steve',
      guestName: st.guestName || 'Laura',
      myName,
      partnerName,
      state: st,
      screen: scr,
      connected: connectedRef.current,
    })
  }, [])

  useEffect(() => () => syncRef.current?.destroy(), [])
  useEffect(() => {
    syncRef.current?.setHandlers({ onMiniAction: handleMiniAction })
  }, [handleMiniAction])
  useEffect(() => {
    persistSession()
  }, [state, screen, role, roomCode, connected, mode, solo, persistSession])

  const inRoom = mode === 'full' && !solo && (screen === 'waiting' || screen === 'game')
  useRoomKeepAlive(inRoom, syncRef, persistSession)

  const leaveToLanding = () => {
    syncRef.current?.destroy()
    syncRef.current = null
    clearSession()
    setReconnecting(false)
    setConnected(false)
    setSolo(false)
    soloRef.current = false
    setFixedRoom(false)
    setMode('pick')
    setScreen('landing')
    screenRef.current = 'landing'
    setState(emptyState())
    stateRef.current = emptyState()
    setError('')
    setStatus('')
  }

  const resumeFull = (saved: SavedSession) => {
    setSolo(false)
    soloRef.current = false
    setRole(saved.role)
    roleRef.current = saved.role
    setRoomCode(saved.code)
    codeRef.current = saved.code
    setFixedRoom(saved.fixed)
    const st = (saved.state as GameState) || emptyState()
    setState(st)
    stateRef.current = st
    const scr: Screen = saved.screen === 'game' ? 'game' : 'waiting'
    setScreen(scr)
    screenRef.current = scr
    setConnected(Boolean(saved.connected))
    connectedRef.current = Boolean(saved.connected)
    setMode('full')
    setStatus('Reconnecting…')
    setReconnecting(true)
    const sync = ensureSync()
    sync.adopt({
      role: saved.role,
      mode: 'full',
      code: saved.code,
      fixed: saved.fixed,
      myName: saved.myName,
      partnerName: saved.partnerName,
    })
    sync.rememberState(st)
    void sync.ensureConnected()
  }

  const handleHost = async (opts: {
    code: string
    hostName: string
    guestName: string
    intensity: Intensity
  }) => {
    setError('')
    setRole('host')
    roleRef.current = 'host'
    setFixedRoom(false)
    setRoomCode(opts.code)
    codeRef.current = opts.code
    remoteRef.current = false
    const next = emptyState({
      hostName: opts.hostName || 'Steve',
      guestName: opts.guestName || 'Laura',
      intensity: opts.intensity,
      consent: true,
    })
    setState(next)
    stateRef.current = next
    try {
      const sync = ensureSync()
      sync.myName = opts.hostName || 'Steve'
      sync.partnerName = opts.guestName || 'Laura'
      sync.rememberState(next)
      await sync.host(opts.code, 'full')
      setScreen('waiting')
      screenRef.current = 'waiting'
      setSolo(false)
      soloRef.current = false
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to host')
    }
  }

  const handleJoin = async (opts: { code: string; guestName: string }) => {
    setError('')
    setRole('guest')
    roleRef.current = 'guest'
    setFixedRoom(false)
    setRoomCode(opts.code)
    codeRef.current = opts.code
    remoteRef.current = false
    setState((s) => {
      const next = { ...s, guestName: opts.guestName || 'Laura', consent: true }
      stateRef.current = next
      return next
    })
    try {
      const sync = ensureSync()
      sync.myName = opts.guestName || 'Laura'
      sync.partnerName = stateRef.current.hostName || 'Steve'
      await sync.join(opts.code, opts.guestName || 'Laura', 'full')
      setConnected(true)
      setScreen('waiting')
      screenRef.current = 'waiting'
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to join')
    }
  }

  const handlePlayTogether = async (opts: {
    myName: string
    partnerName: string
    intensity: Intensity
  }) => {
    setError('')
    setSolo(false)
    soloRef.current = false
    setFixedRoom(true)
    setRoomCode('')
    codeRef.current = ''
    setRole('host')
    roleRef.current = 'host'
    remoteRef.current = false
    const next = emptyState({
      hostName: opts.myName || 'Steve',
      guestName: opts.partnerName || 'Laura',
      intensity: opts.intensity,
      consent: true,
    })
    setState(next)
    stateRef.current = next
    setConnected(false)
    setScreen('waiting')
    screenRef.current = 'waiting'
    setStatus(`Waiting for ${opts.partnerName || 'Laura'}…`)
    setReconnecting(false)
    try {
      const sync = ensureSync()
      sync.rememberState(next)
      const won = await sync.playTogether({
        mode: 'full',
        myName: opts.myName || 'Steve',
        partnerName: opts.partnerName || 'Laura',
      })
      setRole(won)
      roleRef.current = won
      if (won === 'guest') {
        setConnected(true)
        if (!remoteRef.current) {
          setState((s) => {
            const n = {
              ...s,
              hostName: opts.partnerName || 'Steve',
              guestName: opts.myName || 'Laura',
              consent: true,
            }
            stateRef.current = n
            return n
          })
        }
      }
      persistSession()
    } catch (e) {
      clearSession()
      syncRef.current?.destroy()
      syncRef.current = null
      setFixedRoom(false)
      setScreen('lobby')
      screenRef.current = 'lobby'
      setStatus('')
      setError(e instanceof Error ? e.message : 'Could not find your partner — both tap We\'re both here')
    }
  }

  const playSoloPreview = (intensity: Intensity = 'hard') => {
    clearSession()
    setSolo(true)
    soloRef.current = true
    setRole('host')
    setFixedRoom(false)
    setConnected(true)
    setRoomCode('SOLO01')
    const next = startSession(
      emptyState({
        hostName: 'Steve',
        guestName: 'Laura',
        intensity,
        consent: true,
      }),
    )
    setState(next)
    stateRef.current = next
    setScreen('game')
    screenRef.current = 'game'
  }

  const startNight = () => {
    if (role !== 'host') return
    resetMiniEphemeral()
    pushState(startSession(stateRef.current))
    setScreen('game')
  }

  const markResolved = () => {
    miniResolvedRef.current = true
    setMiniResolved(true)
  }

  const onDobbleWin = (winner: 'host' | 'guest') => {
    if (miniResolvedRef.current) return
    markResolved()
    syncRef.current?.sendMiniAction('dobble-win', { winner })
    if (role === 'host' || solo) pushState(applyWin(stateRef.current, winner))
  }

  const onReactionWin = (winner: 'host' | 'guest') => {
    if (miniResolvedRef.current) return
    setReactionWinner(winner)
    syncRef.current?.sendMiniAction('reaction-win', { winner })
    if (role === 'host' || solo) {
      markResolved()
      pushState(applyWin(stateRef.current, winner))
    }
  }

  const onCardResolve = (winner: 'host' | 'guest' | 'tie') => {
    if (miniResolvedRef.current) return
    markResolved()
    if (role === 'host' || solo) pushState(applyWin(stateRef.current, winner))
  }

  const onPotatoLose = (loser: 'host' | 'guest') => {
    if (miniResolvedRef.current) return
    markResolved()
    setPotatoBoom(true)
    syncRef.current?.sendMiniAction('potato-boom')
    const winner = loser === 'host' ? 'guest' : 'host'
    if (role === 'host' || solo) pushState(applyWin(stateRef.current, winner))
  }

  const onMeetupReady = () => {
    if (solo || role === 'host') {
      pushState(markTogether(stateRef.current, role, solo))
    } else {
      syncRef.current?.sendMiniAction('meetup-ready', { who: 'guest' })
      // Optimistic local flag until host state arrives
      setState((s) => ({ ...s, guestTogether: true }))
    }
  }

  const isHost = role === 'host' || solo

  const renderGameBody = () => {
    if (state.phase === 'paused') {
      return (
        <div className="text-center space-y-4 py-10 animate-fade-in">
          <h3 className="font-display text-3xl text-gold-soft">Paused</h3>
          <HouseRulesBanner compact />
          {isHost && (
            <Button
              variant="gold"
              className="w-full"
              onClick={() =>
                pushState({
                  ...state,
                  phase: state.arcPhase === 'meetup' ? 'meetup' : 'narrator',
                })
              }
            >
              Resume
            </Button>
          )}
        </div>
      )
    }

    if (state.phase === 'ended') {
      return (
        <div className="text-center space-y-5 py-8 animate-reveal">
          <h3 className="font-display text-4xl text-glow-gold">Night complete</h3>
          <p className="text-muted">{state.narratorLine}</p>
          <p className="text-gold-soft">
            Final: {state.hostName} 🌶️ {state.hostCoins} · {state.guestName} 🌶️{' '}
            {state.guestCoins}
          </p>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              resetMiniEphemeral()
              pushState(
                startSession({
                  ...state,
                  purchasedIds: [],
                  usedForfeitIds: [],
                  usedChallengeIds: [],
                  hostSkipUsed: false,
                  guestSkipUsed: false,
                }),
              )
            }}
          >
            Play another arc
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() =>
              pushState({
                ...state,
                phase: 'shop',
                shopOpen: true,
                round: 10,
                arcPhase: 'filth',
              })
            }
          >
            Free-play Act Shop
          </Button>
        </div>
      )
    }

    if (state.phase === 'meetup' || state.arcPhase === 'meetup') {
      return (
        <MeetupGate
          hostName={state.hostName}
          guestName={state.guestName}
          hostTogether={state.hostTogether}
          guestTogether={state.guestTogether}
          myRole={role}
          solo={solo}
          onReady={onMeetupReady}
        />
      )
    }

    if (state.phase === 'narrator') {
      return (
        <Narrator
          line={state.narratorLine}
          round={state.round}
          arcPhase={state.arcPhase}
          isHost={isHost}
          onContinue={() => {
            resetMiniEphemeral()
            pushState(continueFromNarrator(stateRef.current))
          }}
        />
      )
    }

    if (state.phase === 'minigame') {
      // Guard: should only happen in filth
      if (state.arcPhase !== 'filth') {
        return (
          <div className="text-center space-y-4">
            <p className="text-muted">Mini-games unlock after meetup.</p>
            {isHost && (
              <Button
                variant="gold"
                className="w-full"
                onClick={() => pushState(startChallenge(stateRef.current))}
              >
                Continue to challenge
              </Button>
            )}
          </div>
        )
      }
      const seed = state.seed + state.round * 13
      return (
        <div className="space-y-4">
          <h3 className="text-center font-display text-2xl text-cream capitalize">
            {state.currentMiniGame === 'dobble' && 'Symbol Match'}
            {state.currentMiniGame === 'cardwar' && 'Card War'}
            {state.currentMiniGame === 'reaction' && 'Reaction Duel'}
            {state.currentMiniGame === 'hotpotato' && 'Hot Potato Dare'}
          </h3>
          {state.currentMiniGame === 'dobble' && (
            <Dobble seed={seed} myRole={role} onWin={onDobbleWin} disabled={miniResolved} />
          )}
          {state.currentMiniGame === 'cardwar' && (
            <CardWar
              seed={seed}
              hostName={state.hostName}
              guestName={state.guestName}
              isHost={isHost}
              onResolve={onCardResolve}
              remoteRevealed={cardRevealed}
              onHostReveal={() => {
                setCardRevealed(true)
                syncRef.current?.sendMiniAction('card-reveal')
              }}
            />
          )}
          {state.currentMiniGame === 'reaction' && (
            <ReactionDuel
              seed={seed}
              myRole={role}
              onWin={onReactionWin}
              remoteWinner={reactionWinner}
              disabled={miniResolved}
            />
          )}
          {state.currentMiniGame === 'hotpotato' && (
            <HotPotato
              seed={seed}
              hostName={state.hostName}
              guestName={state.guestName}
              isHost={isHost}
              myRole={role}
              onLose={onPotatoLose}
              remoteHolder={potatoHolder}
              remoteBoom={potatoBoom}
              remoteStarted={potatoStarted}
              onPass={(next) => {
                setPotatoHolder(next)
                syncRef.current?.sendMiniAction('potato-pass', next)
              }}
              onStart={() => {
                setPotatoStarted(true)
                syncRef.current?.sendMiniAction('potato-start')
              }}
            />
          )}
        </div>
      )
    }

    if (state.phase === 'result') {
      return (
        <ResultBanner
          state={state}
          isHost={isHost}
          onContinue={() => pushState(goToForfeit(stateRef.current))}
        />
      )
    }

    if (state.phase === 'forfeit') {
      return (
        <div className="space-y-4">
          <HouseRulesBanner compact />
          <ForfeitView
            state={state}
            myRole={role}
            onDone={() => {
              if (solo || role === 'host') {
                if (role === state.forfeitTarget || solo || role === 'host') {
                  if (role === 'guest' && state.forfeitTarget === 'guest') {
                    syncRef.current?.sendMiniAction('forfeit-done')
                  } else {
                    pushState(completeForfeit(stateRef.current))
                  }
                }
              } else {
                syncRef.current?.sendMiniAction('forfeit-done')
              }
            }}
            onSkip={() => {
              if (solo || role === 'host') {
                const next = skipForfeit(stateRef.current, role)
                if (next) pushState(next)
              } else {
                syncRef.current?.sendMiniAction('forfeit-skip', { who: role })
              }
            }}
          />
        </div>
      )
    }

    if (state.phase === 'shop') {
      if (state.arcPhase !== 'filth') {
        return (
          <div className="text-center space-y-4 py-8">
            <p className="text-muted">Act Shop unlocks after you meet up.</p>
            {isHost && (
              <Button
                variant="gold"
                className="w-full"
                onClick={() => pushState(startChallenge(stateRef.current))}
              >
                Skip to challenge
              </Button>
            )}
          </div>
        )
      }
      return (
        <div className="space-y-3">
          <HouseRulesBanner compact />
          <ActShop
            state={state}
            myRole={role}
            isHost={isHost}
            onBuy={(item: ShopItem, buyer) => {
              if (role === 'guest' && !solo) {
                syncRef.current?.sendMiniAction('shop-buy', { itemId: item.id, buyer })
                return
              }
              const res = buyAct(stateRef.current, item, buyer)
              if ('error' in res) return res.error
              pushState(res)
            }}
            onDoneAct={() => {
              if (isHost) pushState(clearPendingAct(stateRef.current))
              else syncRef.current?.sendMiniAction('act-done')
            }}
            onContinue={() => {
              if (isHost) pushState(startChallenge(stateRef.current))
              else syncRef.current?.sendMiniAction('shop-continue')
            }}
          />
        </div>
      )
    }

    if (state.phase === 'challenge') {
      return (
        <div className="space-y-3">
          <HouseRulesBanner compact />
          <ChallengeView
            state={state}
            isHost={isHost}
            onComplete={() => {
              resetMiniEphemeral()
              pushState(completeChallenge(stateRef.current))
            }}
          />
        </div>
      )
    }

    return (
      <div className="text-center text-muted py-10">
        <p>Syncing…</p>
      </div>
    )
  }

  const rejoinLabel = resumeOffer
    ? `${resumeOffer.mode === 'apart' ? 'Apart Night' : 'Full Night'}${
        resumeOffer.fixed ? '' : resumeOffer.code ? ` · ${resumeOffer.code}` : ''
      }`
    : undefined

  if (mode === 'apart') {
    return (
      <ApartNightApp
        resume={apartResume}
        initialJoinCode={
          apartResume ? undefined : boot.launch?.mode === 'apart' ? boot.launch.code : undefined
        }
        onExit={leaveToLanding}
      />
    )
  }

  if (mode === 'pick' || screen === 'landing') {
    return (
      <Landing
        rejoinLabel={rejoinLabel}
        onRejoin={
          resumeOffer
            ? () => {
                const saved = resumeOffer
                setResumeOffer(null)
                if (saved.mode === 'apart') {
                  setApartResume(saved)
                  setMode('apart')
                } else {
                  resumeFull(saved)
                }
              }
            : undefined
        }
        onDismissRejoin={
          resumeOffer
            ? () => {
                clearSession()
                setResumeOffer(null)
                if (boot.launch?.mode === 'apart') setMode('apart')
                else if (boot.launch?.mode === 'full') {
                  setMode('full')
                  setScreen('lobby')
                }
              }
            : undefined
        }
        onFullNight={() => {
          sfx.tap()
          setMode('full')
          setScreen('lobby')
        }}
        onApartNight={() => {
          sfx.tap()
          setMode('apart')
        }}
      />
    )
  }

  if (screen === 'lobby') {
    return (
      <div>
        <Lobby
          onHost={handleHost}
          onJoin={handleJoin}
          onPlayTogether={handlePlayTogether}
          initialJoinCode={boot.launch?.mode === 'full' ? boot.launch.code : undefined}
          onBack={() => {
            setMode('pick')
            setScreen('landing')
          }}
          status={status}
          error={error}
        />
        <div className="mx-auto max-w-md px-5 pb-8 -mt-4">
          <button
            type="button"
            className="w-full text-center text-xs text-muted underline py-2"
            onClick={() => playSoloPreview('hard')}
          >
            Preview solo on this phone (no PeerJS)
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'waiting') {
    return (
      <WaitingRoom
        code={roomCode}
        mode="full"
        showCode={!fixedRoom && Boolean(roomCode)}
        hostName={state.hostName}
        guestName={state.guestName}
        intensity={state.intensity}
        connected={connected || solo}
        isHost={role === 'host'}
        partnerName={role === 'host' ? state.guestName : state.hostName}
        reconnecting={reconnecting}
        status={status}
        onStart={startNight}
      />
    )
  }

  if (state.phase === 'meetup' || state.arcPhase === 'meetup') {
    return (
      <>
        <ReconnectBanner show={reconnecting} />
        {renderGameBody()}
      </>
    )
  }

  return (
    <GameShell
      state={state}
      myRole={role}
      status={status}
      reconnecting={reconnecting}
      onPause={() => {
        if (isHost) pushState({ ...state, phase: 'paused' })
      }}
      onEnd={() => {
        if (confirm('End this session?')) leaveToLanding()
      }}
    >
      {renderGameBody()}
    </GameShell>
  )
}
