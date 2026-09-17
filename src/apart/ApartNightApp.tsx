import { useCallback, useEffect, useRef, useState } from 'react'
import { ApartLobby } from './components/ApartLobby'
import { ApartShell } from './components/ApartShell'
import { ApartQuiz } from './components/ApartQuiz'
import { ApartForfeitView } from './components/ApartForfeitView'
import { ApartQuestView } from './components/ApartQuestView'
import { WaitingRoom } from '../components/WaitingRoom'
import { HouseRulesBanner } from '../components/HouseRules'
import { Button } from '../components/ui/Button'
import { RoomSync } from '../peer/sync'
import {
  completeApartForfeit,
  completeApartQuest,
  continueApartIntro,
  continueFromReveal,
  judgeGuess,
  setSecretAnswer,
  skipApartForfeit,
  startApartSession,
  submitGuess,
} from './logic'
import { emptyApartState, type ApartState } from './types'
import type { Intensity } from '../types'
import { sfx } from '../lib/audio'

type Screen = 'lobby' | 'waiting' | 'game'

export function ApartNightApp({ onExit }: { onExit: () => void }) {
  const [screen, setScreen] = useState<Screen>('lobby')
  const [role, setRole] = useState<'host' | 'guest'>('host')
  const [roomCode, setRoomCode] = useState('')
  const [state, setState] = useState<ApartState>(() => emptyApartState())
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [connected, setConnected] = useState(false)
  const [solo, setSolo] = useState(false)

  const syncRef = useRef<RoomSync<ApartState> | null>(null)
  const stateRef = useRef(state)
  const roleRef = useRef(role)
  const soloRef = useRef(solo)
  stateRef.current = state
  roleRef.current = role
  soloRef.current = solo

  const pushState = useCallback((next: ApartState) => {
    setState(next)
    stateRef.current = next
    if (roleRef.current === 'host' && syncRef.current) {
      syncRef.current.broadcastState(next)
    }
  }, [])

  const handleAction = useCallback(
    (action: string, payload?: unknown) => {
      const isHost = roleRef.current === 'host'
      if (!isHost) return

      if (action === 'apart-secret') {
        pushState(setSecretAnswer(stateRef.current, (payload as { index: number }).index))
      } else if (action === 'apart-guess') {
        pushState(submitGuess(stateRef.current, (payload as { index: number }).index))
      } else if (action === 'apart-judge') {
        pushState(judgeGuess(stateRef.current, (payload as { correct: boolean }).correct))
      } else if (action === 'apart-forfeit-done') {
        pushState(completeApartForfeit(stateRef.current))
      } else if (action === 'apart-forfeit-skip') {
        const who = (payload as { who: 'host' | 'guest' }).who
        const next = skipApartForfeit(stateRef.current, who)
        if (next) pushState(next)
      } else if (action === 'apart-quest-done') {
        pushState(completeApartQuest(stateRef.current))
      } else if (action === 'apart-continue-intro') {
        pushState(continueApartIntro(stateRef.current))
      } else if (action === 'apart-continue-reveal') {
        pushState(continueFromReveal(stateRef.current))
      }
    },
    [pushState],
  )

  const ensureSync = useCallback(() => {
    if (syncRef.current) {
      syncRef.current.setHandlers({ onMiniAction: handleAction })
      return syncRef.current
    }
    const sync = new RoomSync<ApartState>({
      onState: (s) => {
        setState(s)
        stateRef.current = s
        setConnected(true)
        if (s.started) setScreen('game')
        else setScreen('waiting')
      },
      onMiniAction: handleAction,
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
  }, [handleAction])

  useEffect(() => () => syncRef.current?.destroy(), [])
  useEffect(() => {
    syncRef.current?.setHandlers({ onMiniAction: handleAction })
  }, [handleAction])

  const handleHost = async (opts: {
    code: string
    hostName: string
    guestName: string
    intensity: Intensity
  }) => {
    setError('')
    setRole('host')
    setRoomCode(opts.code)
    const next = emptyApartState({
      hostName: opts.hostName || 'Steve',
      guestName: opts.guestName || 'Laura',
      intensity: opts.intensity,
      consent: true,
    })
    setState(next)
    stateRef.current = next
    try {
      await ensureSync().host(opts.code, 'apart')
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
      await ensureSync().join(opts.code, opts.guestName || 'Laura', 'apart')
      setConnected(true)
      setScreen('waiting')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to join')
    }
  }

  const playSolo = (intensity: Intensity = 'fire') => {
    setSolo(true)
    setRole('host')
    setConnected(true)
    setRoomCode('SOLOAN')
    const next = startApartSession(
      emptyApartState({
        hostName: 'Steve',
        guestName: 'Laura',
        intensity,
        consent: true,
      }),
    )
    setState(next)
    stateRef.current = next
    setScreen('game')
  }

  const startNight = () => {
    if (role !== 'host') return
    pushState(startApartSession(stateRef.current))
    setScreen('game')
  }

  const isHost = role === 'host' || solo

  const sendOrDo = (action: string, payload: unknown, hostFn: () => void) => {
    if (solo || role === 'host') hostFn()
    else syncRef.current?.sendMiniAction(action, payload)
  }

  const renderBody = () => {
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
                  phase: state.roundKind === 'quest' ? 'quest' : 'intro',
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
          <h3 className="font-display text-4xl text-glow-gold">Apart Night complete</h3>
          <p className="text-muted">{state.narratorLine}</p>
          <p className="text-gold-soft">
            Final: {state.hostName} 🌶️ {state.hostCoins} · {state.guestName} 🌶️ {state.guestCoins}
          </p>
          {isHost && (
            <Button
              variant="primary"
              className="w-full"
              onClick={() => pushState(startApartSession(stateRef.current))}
            >
              Play another Apart Night
            </Button>
          )}
          <Button variant="ghost" className="w-full" onClick={onExit}>
            Back to mode select
          </Button>
        </div>
      )
    }

    if (state.phase === 'intro') {
      return (
        <div className="animate-reveal space-y-5 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-rose">
            Round {state.round} · {state.roundKind}
          </p>
          <h3 className="font-display text-3xl text-cream">{state.narratorLine}</h3>
          <HouseRulesBanner compact />
          {isHost ? (
            <Button
              variant="gold"
              className="w-full py-4"
              onClick={() => {
                if (solo || role === 'host') pushState(continueApartIntro(stateRef.current))
                else syncRef.current?.sendMiniAction('apart-continue-intro')
              }}
            >
              Let’s go
            </Button>
          ) : (
            <p className="text-muted text-sm animate-heartbeat">Host starting the round…</p>
          )}
        </div>
      )
    }

    if (
      state.phase === 'quiz-set' ||
      state.phase === 'quiz-guess' ||
      state.phase === 'quiz-judge' ||
      state.phase === 'quiz-reveal'
    ) {
      return (
        <ApartQuiz
          state={state}
          myRole={role}
          solo={solo}
          onSetSecret={(index) => {
            sendOrDo('apart-secret', { index }, () =>
              pushState(setSecretAnswer(stateRef.current, index)),
            )
          }}
          onGuess={(index) => {
            sendOrDo('apart-guess', { index }, () =>
              pushState(submitGuess(stateRef.current, index)),
            )
          }}
          onJudge={(correct) => {
            sendOrDo('apart-judge', { correct }, () =>
              pushState(judgeGuess(stateRef.current, correct)),
            )
          }}
          onContinueReveal={() => {
            if (isHost) pushState(continueFromReveal(stateRef.current))
            else syncRef.current?.sendMiniAction('apart-continue-reveal')
          }}
        />
      )
    }

    if (state.phase === 'forfeit') {
      return (
        <div className="space-y-4">
          <HouseRulesBanner compact />
          <ApartForfeitView
            state={state}
            myRole={role}
            solo={solo}
            onDone={() => {
              if (solo || role === 'host') {
                if (role === state.forfeitTarget || solo || role === 'host') {
                  pushState(completeApartForfeit(stateRef.current))
                }
              } else {
                syncRef.current?.sendMiniAction('apart-forfeit-done')
              }
            }}
            onSkip={() => {
              if (solo || role === 'host') {
                const next = skipApartForfeit(stateRef.current, role)
                if (next) pushState(next)
              } else {
                syncRef.current?.sendMiniAction('apart-forfeit-skip', { who: role })
              }
            }}
          />
        </div>
      )
    }

    if (state.phase === 'quest') {
      return (
        <ApartQuestView
          state={state}
          isHost={isHost}
          onComplete={() => {
            if (isHost) pushState(completeApartQuest(stateRef.current))
            else syncRef.current?.sendMiniAction('apart-quest-done')
          }}
        />
      )
    }

    return (
      <div className="text-center text-muted py-10">
        <p>Syncing…</p>
      </div>
    )
  }

  if (screen === 'lobby') {
    return (
      <div>
        <ApartLobby
          onHost={handleHost}
          onJoin={handleJoin}
          onBack={onExit}
          status={status}
          error={error}
        />
        <div className="mx-auto max-w-md px-5 pb-8 -mt-4">
          <button
            type="button"
            className="w-full text-center text-xs text-muted underline py-2"
            onClick={() => playSolo('fire')}
          >
            Preview Apart Night solo (no PeerJS)
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
    <ApartShell
      state={state}
      myRole={role}
      status={status}
      onPause={() => {
        if (isHost) pushState({ ...state, phase: 'paused' })
      }}
      onEnd={() => {
        if (confirm('End Apart Night?')) {
          syncRef.current?.destroy()
          onExit()
        }
      }}
    >
      {renderBody()}
    </ApartShell>
  )
}
