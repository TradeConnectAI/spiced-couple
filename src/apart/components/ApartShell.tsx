import { useState, type ReactNode } from 'react'
import type { ApartState } from '../types'
import { CoinPill } from '../../components/ui/CoinPill'
import { isMuted, setMuted, sfx } from '../../lib/audio'
import { ReconnectBanner } from '../../components/ReconnectBanner'

export function ApartShell({
  state,
  myRole,
  status,
  children,
  onPause,
  onEnd,
  reconnecting,
}: {
  state: ApartState
  myRole: 'host' | 'guest'
  status?: string
  children: ReactNode
  onPause: () => void
  onEnd: () => void
  reconnecting?: boolean
}) {
  const [mute, setMute] = useState(isMuted())
  const pop = state.phase === 'quiz-reveal'

  return (
    <div className="bg-heat min-h-dvh safe-pad flex flex-col">
      <ReconnectBanner show={Boolean(reconnecting)} />
      <header className="mx-auto w-full max-w-md pt-4 pb-2 px-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="font-display text-lg font-bold text-rose">Apart Night</div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-muted"
              onClick={() => {
                const m = !mute
                setMute(m)
                setMuted(m)
                if (!m) sfx.tap()
              }}
            >
              {mute ? '🔇' : '🔊'}
            </button>
            <button
              type="button"
              className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-muted"
              onClick={onPause}
            >
              Pause
            </button>
            <button
              type="button"
              className="rounded-full border border-rose/30 px-2.5 py-1 text-xs text-rose"
              onClick={onEnd}
            >
              End
            </button>
          </div>
        </div>
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="rounded-full border border-rose/40 text-rose bg-rose/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]">
            Stay apart
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted">
            Round {state.round}/{state.totalRounds} · {state.roundKind}
          </span>
        </div>
        <div className="flex items-center justify-center gap-1.5 mb-3">
          {Array.from({ length: state.totalRounds }, (_, i) => {
            const n = i + 1
            const done = n < state.round
            const cur = n === state.round
            return (
              <div
                key={n}
                className={`h-2 rounded-full transition-all ${
                  cur ? 'w-6 bg-rose glow-crimson' : done ? 'w-2 bg-crimson' : 'w-2 bg-white/15'
                }`}
              />
            )
          })}
        </div>
        <div className="flex justify-between gap-2">
          <CoinPill
            name={state.hostName}
            coins={state.hostCoins}
            highlight={myRole === 'host'}
            pop={pop && state.lastCorrect === true && state.answerer === 'host'}
          />
          <CoinPill
            name={state.guestName}
            coins={state.guestCoins}
            highlight={myRole === 'guest'}
            pop={pop && state.lastCorrect === true && state.answerer === 'guest'}
          />
        </div>
        {status && <p className="mt-2 text-center text-[11px] text-muted truncate">{status}</p>}
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-8 pt-4">{children}</main>
    </div>
  )
}
