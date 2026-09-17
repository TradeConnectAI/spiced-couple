import type { ApartState } from '../types'
import { Button } from '../../components/ui/Button'
import { MediaBadge } from '../../components/ui/Badge'
import { HouseRulesBanner } from '../../components/HouseRules'

export function ApartQuestView({
  state,
  isHost,
  onComplete,
}: {
  state: ApartState
  isHost: boolean
  onComplete: () => void
}) {
  const q = state.currentQuest
  if (!q) return null

  const targetLabel =
    state.questTarget === 'both'
      ? 'Both of you'
      : state.questTarget === 'host'
        ? state.hostName
        : state.questTarget === 'guest'
          ? state.guestName
          : 'Someone'

  return (
    <div className="animate-reveal space-y-5">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/80">Apart quest</p>
        <p className="text-sm text-muted">{targetLabel}</p>
      </div>
      <div className="rounded-3xl border border-gold/35 bg-ink-card p-6 glow-gold">
        <div className="mb-3 flex justify-center">
          <MediaBadge type={q.media} />
        </div>
        <h3 className="font-display text-center text-3xl font-bold text-cream">{q.title}</h3>
        <p className="mt-4 text-center text-cream/90 leading-relaxed">{q.description}</p>
        <p className="mt-4 text-center text-xs text-muted border-t border-white/10 pt-3">
          Send via your own messages — this app never uploads media.
        </p>
      </div>
      <HouseRulesBanner compact />
      <p className="text-center text-xs text-gold-soft">+6 Spice Coins each when done</p>
      {isHost ? (
        <Button variant="gold" className="w-full py-4" onClick={onComplete}>
          Quest done ✓
        </Button>
      ) : (
        <p className="text-center text-muted text-sm animate-heartbeat">Host marks it complete…</p>
      )}
    </div>
  )
}
