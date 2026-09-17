import { useState, type ReactNode } from 'react'
import type { GameState } from '../types'
import { isApartArc } from '../types'
import { CoinPill } from './ui/CoinPill'
import { ProgressDots } from './ui/ProgressDots'
import { isMuted, setMuted, sfx } from '../lib/audio'
import { arcLabelForRound } from '../content/narrator'
import { ReconnectBanner } from './ReconnectBanner'

export function GameShell({
  state,
  myRole,
  status,
  children,
  onPause,
  onEnd,
  reconnecting,
}: {
  state: GameState
  myRole: 'host' | 'guest'
  status?: string
  children: ReactNode
  onPause: () => void
  onEnd: () => void
  reconnecting?: boolean
}) {
  const [mute, setMute] = useState(isMuted())
  const pop = state.phase === 'result'
  const apart = isApartArc(state.arcPhase)
  const phaseLabel =
    state.arcPhase === 'meetup' ? 'Meetup' : arcLabelForRound(state.round)

  return (
    <div className={`bg-heat min-h-dvh safe-pad flex flex-col ${state.phase === 'result' && state.lastWinner === myRole ? 'animate-flash-win' : state.phase === 'result' && state.lastWinner && state.lastWinner !== 'tie' && state.lastWinner !== myRole ? 'animate-flash-lose' : ''}`}>
      <ReconnectBanner show={Boolean(reconnecting)} />
      <header className="mx-auto w-full max-w-md pt-4 pb-2 px-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="font-display text-lg font-bold text-gold-soft">Spiced Couple</div>
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
          <span
            className={`rounded-full border px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${
              apart
                ? 'border-rose/40 text-rose bg-rose/10'
                : 'border-gold/50 text-gold-soft bg-gold/15'
            }`}
          >
            {apart ? 'Apart' : 'Together'}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted truncate max-w-[14rem]">
            {phaseLabel}
          </span>
        </div>
        <ProgressDots round={state.round} />
        <div className="mt-3 flex justify-between gap-2">
          <CoinPill
            name={state.hostName}
            coins={state.hostCoins}
            highlight={myRole === 'host'}
            pop={pop && state.lastWinner === 'host'}
          />
          <CoinPill
            name={state.guestName}
            coins={state.guestCoins}
            highlight={myRole === 'guest'}
            pop={pop && state.lastWinner === 'guest'}
          />
        </div>
        {status && (
          <p className="mt-2 text-center text-[11px] text-muted truncate">{status}</p>
        )}
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-8 pt-4">{children}</main>
    </div>
  )
}
