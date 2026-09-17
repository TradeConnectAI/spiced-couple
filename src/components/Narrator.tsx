import { Button } from './ui/Button'
import { TOTAL_ROUNDS, type ArcPhase } from '../types'
import { arcLabelForRound } from '../content/narrator'

export function Narrator({
  line,
  round,
  arcPhase,
  isHost,
  onContinue,
}: {
  line: string
  round: number
  arcPhase: ArcPhase
  isHost: boolean
  onContinue: () => void
}) {
  const label = arcLabelForRound(round)
  const cta =
    arcPhase === 'filth'
      ? 'Begin mini-game'
      : arcPhase === 'talk'
        ? 'Start naughty talk'
        : arcPhase === 'photo'
          ? 'Reveal photo dare'
          : arcPhase === 'clip'
            ? 'Reveal clip dare'
            : 'Continue'

  const apart = arcPhase !== 'filth'

  return (
    <div className="animate-reveal flex flex-col items-center text-center space-y-6 py-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="rounded-full border border-gold/30 px-4 py-1 text-xs uppercase tracking-[0.3em] text-gold">
          Round {round} · {label}
        </div>
        <div
          className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
            apart
              ? 'border-rose/40 text-rose bg-rose/10'
              : 'border-gold/50 text-gold-soft bg-gold/15'
          }`}
        >
          {apart ? 'Apart' : 'Together'}
        </div>
      </div>
      <p className="font-display text-2xl sm:text-3xl italic text-cream leading-snug text-glow-gold max-w-sm">
        “{line}”
      </p>
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
      {isHost ? (
        <Button variant="gold" className="w-full max-w-xs py-4" onClick={onContinue}>
          {cta}
        </Button>
      ) : (
        <p className="text-muted text-sm animate-heartbeat">Waiting for host…</p>
      )}
      <p className="text-[11px] text-muted">
        {round} of {TOTAL_ROUNDS}
        {apart && ' · Mini-games & Act Shop unlock after meetup'}
      </p>
    </div>
  )
}
