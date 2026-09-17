import { Button } from './ui/Button'
import { TOTAL_ROUNDS } from '../types'

export function Narrator({
  line,
  round,
  isHost,
  onContinue,
}: {
  line: string
  round: number
  isHost: boolean
  onContinue: () => void
}) {
  const arc =
    round <= 3 ? 'Desperate rooms' : round <= 6 ? 'Approaching' : 'Together'

  return (
    <div className="animate-reveal flex flex-col items-center text-center space-y-6 py-6">
      <div className="rounded-full border border-gold/30 px-4 py-1 text-xs uppercase tracking-[0.3em] text-gold">
        Round {round} · {arc}
      </div>
      <p className="font-display text-2xl sm:text-3xl italic text-cream leading-snug text-glow-gold max-w-sm">
        “{line}”
      </p>
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
      {isHost ? (
        <Button variant="gold" className="w-full max-w-xs py-4" onClick={onContinue}>
          Begin mini-game
        </Button>
      ) : (
        <p className="text-muted text-sm animate-heartbeat">Waiting for host…</p>
      )}
      <p className="text-[11px] text-muted">
        {round} of {TOTAL_ROUNDS}
      </p>
    </div>
  )
}
