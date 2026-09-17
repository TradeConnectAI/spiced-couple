import { TOTAL_ROUNDS } from '../../types'

export function ProgressDots({ round }: { round: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: TOTAL_ROUNDS }, (_, i) => {
        const n = i + 1
        const done = n < round
        const cur = n === round
        return (
          <div
            key={n}
            title={`Round ${n}`}
            className={`h-2 rounded-full transition-all ${
              cur ? 'w-6 bg-gold glow-gold' : done ? 'w-2 bg-crimson' : 'w-2 bg-white/15'
            }`}
          />
        )
      })}
    </div>
  )
}
