import type { GameState } from '../types'
import { Button } from './ui/Button'
import { MediaBadge } from './ui/Badge'
import { TOTAL_ROUNDS } from '../types'
import { arcLabelForRound } from '../content/narrator'

export function ChallengeView({
  state,
  isHost,
  onComplete,
}: {
  state: GameState
  isHost: boolean
  onComplete: () => void
}) {
  const c = state.currentChallenge
  if (!c) return null
  const arc = arcLabelForRound(state.round)
  const apart = state.arcPhase !== 'filth'
  const mediaNote =
    c.media === 'photo' || c.media === 'video' || c.media === 'audio'
      ? 'Send via your own messages — this app never uploads media.'
      : null

  return (
    <div className="animate-reveal space-y-5">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/80">{arc}</p>
        <div className="flex justify-center">
          <span
            className={`rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-[0.2em] ${
              apart
                ? 'border-rose/40 text-rose bg-rose/10'
                : 'border-gold/50 text-gold-soft bg-gold/15'
            }`}
          >
            {apart ? 'Apart' : 'Together'}
          </span>
        </div>
        <p className="text-sm text-muted">
          Round {state.round} / {TOTAL_ROUNDS}
        </p>
      </div>
      <div className="rounded-3xl border border-gold/35 bg-ink-card p-6 glow-gold">
        <div className="mb-3 flex justify-center">
          <MediaBadge type={c.media} />
        </div>
        <h3 className="font-display text-center text-3xl font-bold text-cream">{c.title}</h3>
        <p className="mt-4 text-center text-cream/90 leading-relaxed">{c.description}</p>
        {mediaNote && (
          <p className="mt-4 text-center text-xs text-muted border-t border-white/10 pt-3">
            {mediaNote}
          </p>
        )}
      </div>
      {apart && (
        <p className="text-center text-xs text-gold-soft">
          +8 Spice Coins each when done · Shop & games still locked
        </p>
      )}
      {isHost ? (
        <Button variant="primary" className="w-full py-4" onClick={onComplete}>
          {state.round === 7 && state.arcPhase === 'clip'
            ? 'Clip done → Meetup gate'
            : 'Challenge done → Next'}
        </Button>
      ) : (
        <p className="text-center text-muted text-sm">Host advances when you're both ready</p>
      )}
    </div>
  )
}
