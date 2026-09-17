import type { GameState } from '../types'
import { Button } from './ui/Button'
import { MediaBadge } from './ui/Badge'
import { sfx } from '../lib/audio'

export function ForfeitView({
  state,
  myRole,
  onDone,
  onSkip,
}: {
  state: GameState
  myRole: 'host' | 'guest'
  onDone: () => void
  onSkip: () => void
}) {
  const f = state.currentForfeit
  if (!f) return null
  const targetName = state.forfeitTarget === 'host' ? state.hostName : state.guestName
  const isMe = state.forfeitTarget === myRole
  const skipUsed = myRole === 'host' ? state.hostSkipUsed : state.guestSkipUsed

  return (
    <div className="animate-reveal space-y-5">
      <div className="rounded-3xl border border-crimson/50 bg-gradient-to-b from-blood/40 to-ink-card p-6 glow-crimson text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-rose mb-2">Forfeit</p>
        <p className="text-sm text-gold-soft mb-3">
          {isMe ? 'You lost — perform this' : `${targetName} performs`}
        </p>
        <div className="mb-3 flex justify-center">
          <MediaBadge type={f.media} />
        </div>
        <h3 className="font-display text-3xl font-bold text-cream text-glow-crimson">{f.title}</h3>
        <p className="mt-4 text-cream/90 leading-relaxed">{f.description}</p>
      </div>

      {isMe ? (
        <div className="space-y-2">
          <Button
            variant="gold"
            className="w-full py-4"
            onClick={() => {
              sfx.coin()
              onDone()
            }}
          >
            I did it ✓
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            disabled={skipUsed}
            onClick={onSkip}
          >
            {skipUsed ? 'Skip already used' : 'Skip once (session)'}
          </Button>
        </div>
      ) : (
        <p className="text-center text-muted text-sm animate-heartbeat">
          Waiting for {targetName} to complete…
        </p>
      )}
    </div>
  )
}
