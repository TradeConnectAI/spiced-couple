import type { ApartState } from '../types'
import { Button } from '../../components/ui/Button'
import { MediaBadge } from '../../components/ui/Badge'
import { sfx } from '../../lib/audio'

export function ApartForfeitView({
  state,
  myRole,
  solo,
  onDone,
  onSkip,
}: {
  state: ApartState
  myRole: 'host' | 'guest'
  solo?: boolean
  onDone: () => void
  onSkip: () => void
}) {
  const f = state.currentForfeit
  if (!f) return null
  const targetName = state.forfeitTarget === 'host' ? state.hostName : state.guestName
  const isMe = state.forfeitTarget === myRole || !!solo
  const skipUsed = myRole === 'host' ? state.hostSkipUsed : state.guestSkipUsed

  return (
    <div className="animate-reveal space-y-5">
      <div className="rounded-3xl border border-crimson/50 bg-gradient-to-b from-blood/40 to-ink-card p-6 glow-crimson text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-rose mb-2">Apart forfeit</p>
        <p className="text-sm text-gold-soft mb-3">
          {isMe && !solo ? 'You got it wrong — perform this' : `${targetName} performs`}
        </p>
        <div className="mb-3 flex justify-center">
          <MediaBadge type={f.media} />
        </div>
        <h3 className="font-display text-3xl font-bold text-cream text-glow-crimson">{f.title}</h3>
        <p className="mt-4 text-cream/90 leading-relaxed">{f.description}</p>
        <p className="mt-4 text-xs text-muted border-t border-white/10 pt-3">
          Stay in different rooms. Use video call / your own messages — this app never uploads.
        </p>
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
          <Button variant="ghost" className="w-full" disabled={skipUsed && !solo} onClick={onSkip}>
            {skipUsed && !solo ? 'Skip already used' : 'Skip once (session)'}
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
