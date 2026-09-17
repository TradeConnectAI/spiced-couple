import type { GameState } from '../types'
import { Button } from './ui/Button'
import { MediaBadge } from './ui/Badge'
import { TOTAL_ROUNDS } from '../types'

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
  const arc =
    state.round <= 3 ? 'Apart · Desperate rooms' : state.round <= 6 ? 'Approaching' : 'Together · Filthy'

  return (
    <div className="animate-reveal space-y-5">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/80">{arc}</p>
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
      </div>
      {isHost ? (
        <Button variant="primary" className="w-full py-4" onClick={onComplete}>
          Challenge done → Next round
        </Button>
      ) : (
        <p className="text-center text-muted text-sm">Host advances when you're both ready</p>
      )}
    </div>
  )
}
