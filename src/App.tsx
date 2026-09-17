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
import { HouseRulesBanner } from './components/HouseRules'
import { Dobble } from './components/MiniGames/Dobble'
import { CardWar } from './components/MiniGames/CardWar'
import { ReactionDuel } from './components/MiniGames/ReactionDuel'
import { HotPotato } from './components/MiniGames/HotPotato'
import { Button } from './components/ui/Button'
import { RoomSync } from './peer/sync'
import { SHOP_ITEMS } from './content/shop'
import {
  applyWin,
  beginMiniGame,
  buyAct,
  clearPendingAct,
  completeForfeit,
  goToForfeit,
  skipForfeit,
  startChallenge,
  startSession,
  advanceRound,
} from './lib/gameLogic'
import { emptyState, type GameState, type Intensity, type ShopItem } from './types'
import { sfx } from './lib/audio'

type Screen = 'landing' | 'lobby' | 'waiting' | 'game'

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [role, setRole] = useState<'host' | 'guest'>('host')
  const [roomCode, setRoomCode] = useState('')
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

  const syncRef = useRef<RoomSync | null>(null)
  const stateRef = useRef(state)
  const roleRef = useRef(role)
  const soloRef = useRef(solo)
  const miniResolvedRef = useRef(miniResolved)
  stateRef.current = state
  roleRef.current = role
  soloRef.current = solo
  miniResolvedRef.current = miniResolved

  const pushState = useCallback((next: GameState) => {
    setState(next)
    stateRef.current = next
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
      }
    },
    [pushState],
  )

  const ensureSync = useCallback(() => {
    if (syncRef.current) {
      syncRef.current.setHandlers({ onMiniAction: handleMiniAction })
      return syncRef.current
    }
    const sync = new RoomSync({
      onState: (s) => {
        setState(s)
        stateRef.current = s
        setConnected(true)
        if (s.started) setScreen('game')
        else setScreen('waiting')
      },
      onMiniAction: handleMiniAction,
      onGuestJoined: (name) => {
        setConnected(true)
        setStatus(`${name} joined`)
        const next = { ...stateRef.current, guestName: name }
        setState(next)
        stateRef.current = next
        syncRef.current?.sendWelcome(next, name)
      },
      onStatus: setStatus,
      onError: setError,
    })
    syncRef.current = sync
    return sync
  }, [handleMiniAction])

  useEffect(() => () => syncRef.current?.destroy(), [])

  useEffect(() => {
    syncRef.current?.setHandlers({ onMiniAction: handleMiniAction })
  }, [handleMiniAction])

  const handleHost = async (opts: {
    code: string
    hostName: string
    guestName: string
    intensity: Intensity
  }) => {
    setError('')
    setRole('host')
    setRoomCode(opts.code)
    const next = emptyState({
      hostName: opts.hostName || 'Steve',
      guestName: opts.guestName || 'Laura',
      intensity: opts.intensity,
      consent: true,
    })
    setState(next)
    stateRef.current = next
    try {
      await ensureSync().host(opts.code)
      setScreen('waiting')
      setSolo(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to host')
    }
  }

  const handleJoin = async (opts: { code: string; guestName: string }) => {
    setError('')
    setRole('guest')
    setRoomCode(opts.code)
    setState((s) => ({ ...s, guestName: opts.guestName || 'Laura', consent: true }))
    try {
      await ensureSync().join(opts.code, opts.guestName || 'Laura')
      setConnected(true)
      setScreen('waiting')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to join')
    }
  }

  const playSoloPreview = (intensity: Intensity = 'hard') => {
    setSolo(true)
    setRole('host')
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
    setScreen('game')
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
              onClick={() => pushState({ ...state, phase: 'narrator' })}
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
              pushState({ ...state, phase: 'shop', shopOpen: true, round: 10 })
            }
          >
            Free-play Act Shop
          </Button>
        </div>
      )
    }

    if (state.phase === 'narrator') {
      return (
        <Narrator
          line={state.narratorLine}
          round={state.round}
          isHost={isHost}
          onContinue={() => {
            resetMiniEphemeral()
            pushState(beginMiniGame(stateRef.current))
          }}
        />
      )
    }

    if (state.phase === 'minigame') {
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
                // Host can always advance; if guest is target they send action
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
              pushState(advanceRound(stateRef.current))
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

  if (screen === 'landing') {
    return (
      <Landing
        onEnter={() => {
          sfx.tap()
          setScreen('lobby')
        }}
      />
    )
  }

  if (screen === 'lobby') {
    return (
      <div>
        <Lobby onHost={handleHost} onJoin={handleJoin} status={status} error={error} />
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
        hostName={state.hostName}
        guestName={state.guestName}
        intensity={state.intensity}
        connected={connected || solo}
        isHost={role === 'host'}
        onStart={startNight}
        onCopy={() => {
          void navigator.clipboard?.writeText(roomCode)
          setStatus('Code copied')
          sfx.coin()
        }}
      />
    )
  }

  return (
    <GameShell
      state={state}
      myRole={role}
      status={status}
      onPause={() => {
        if (isHost) pushState({ ...state, phase: 'paused' })
      }}
      onEnd={() => {
        if (confirm('End this session?')) {
          syncRef.current?.destroy()
          setScreen('landing')
          setConnected(false)
          setSolo(false)
          setState(emptyState())
        }
      }}
    >
      {renderGameBody()}
    </GameShell>
  )
}
