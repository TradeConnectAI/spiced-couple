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
import { useRoomKeepAlive } from '../lib/keepAlive'
import { clearSession, saveSession, type SavedSession } from '../lib/session'

type Screen = 'lobby' | 'waiting' | 'game'

export function ApartNightApp({
  onExit,
  initialJoinCode,
  resume,
}: {
  onExit: () => void
  initialJoinCode?: string
  resume?: SavedSession | null
}) {
  const [screen, setScreen] = useState<Screen>(resume ? (resume.screen === 'game' ? 'game' : 'waiting') : 'lobby')
  const [role, setRole] = useState<'host' | 'guest'>(resume?.role ?? 'host')
  const [roomCode, setRoomCode] = useState(resume?.code ?? '')
  const [fixedRoom, setFixedRoom] = useState(Boolean(resume?.fixed))
  const [reconnecting, setReconnecting] = useState(false)
  const [state, setState] = useState<ApartState>(() =>
    resume?.state ? (resume.state as ApartState) : emptyApartState(),
  )
  const [status, setStatus] = useState(resume ? 'Reconnecting…' : '')
  const [error, setError] = useState('')
  const [connected, setConnected] = useState(Boolean(resume?.connected))
  const [solo, setSolo] = useState(false)

  const syncRef = useRef<RoomSync<ApartState> | null>(null)
  const stateRef = useRef(state)
  const roleRef = useRef(role)
  const soloRef = useRef(solo)
  const screenRef = useRef<Screen>(screen)
  const codeRef = useRef(roomCode)
  const connectedRef = useRef(connected)
  const remoteRef = useRef(false)
  const resumedRef = useRef(false)
  stateRef.current = state
  roleRef.current = role
  soloRef.current = solo
  screenRef.current = screen
  codeRef.current = roomCode
  connectedRef.current = connected

  const pushState = useCallback((next: ApartState) => {
    setState(next)
    stateRef.current = next
    syncRef.current?.rememberState(next)
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
      onMiniAction: handleAction,
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
        if (scr === 'lobby') setError(msg)
        else {
          setReconnecting(true)
          setStatus('Reconnecting…')
        }
      },
      onReconnecting: setReconnecting,
    })
    syncRef.current = sync
    return sync
  }, [handleAction])

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
      mode: 'apart',
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
    syncRef.current?.setHandlers({ onMiniAction: handleAction })
  }, [handleAction])
  useEffect(() => {
    persistSession()
  }, [state, screen, role, roomCode, connected, solo, persistSession])

  const inRoom = !solo && (screen === 'waiting' || screen === 'game')
  useRoomKeepAlive(inRoom, syncRef, persistSession)

  useEffect(() => {
    if (!resume || resumedRef.current) return
    resumedRef.current = true
    const sync = ensureSync()
    sync.adopt({
      role: resume.role,
      mode: 'apart',
      code: resume.code,
      fixed: resume.fixed,
      myName: resume.myName,
      partnerName: resume.partnerName,
    })
    sync.rememberState(stateRef.current)
    setReconnecting(true)
    setStatus('Reconnecting…')
    void sync.ensureConnected()
  }, [resume, ensureSync])

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
    const next = emptyApartState({
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
      await sync.host(opts.code, 'apart')
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
      await sync.join(opts.code, opts.guestName || 'Laura', 'apart')
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
    const next = emptyApartState({
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
        mode: 'apart',
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
      setError(e instanceof Error ? e.message : "Could not find your partner — both tap We're both here")
    }
  }

  const playSolo = (intensity: Intensity = 'fire') => {
    clearSession()
    setSolo(true)
    soloRef.current = true
    setRole('host')
    setFixedRoom(false)
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
    screenRef.current = 'game'
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
          onPlayTogether={handlePlayTogether}
          onBack={onExit}
          status={status}
          error={error}
          initialJoinCode={initialJoinCode}
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
        mode="apart"
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

  return (
    <ApartShell
      state={state}
      myRole={role}
      status={status}
      reconnecting={reconnecting}
      onPause={() => {
        if (isHost) pushState({ ...state, phase: 'paused' })
      }}
      onEnd={() => {
        if (confirm('End Apart Night?')) {
          syncRef.current?.destroy()
          syncRef.current = null
          clearSession()
          onExit()
        }
      }}
    >
      {renderBody()}
    </ApartShell>
  )
}
