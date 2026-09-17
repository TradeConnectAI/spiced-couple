import { useEffect, useRef, useState } from 'react'
import { sfx } from '../../lib/audio'
import { vibe } from '../../lib/haptics'

type Stage = 'wait' | 'go' | 'done' | 'early'

export function ReactionDuel({
  seed,
  myRole,
  onWin,
  remoteWinner,
  disabled,
}: {
  seed: number
  myRole: 'host' | 'guest'
  onWin: (winner: 'host' | 'guest') => void
  remoteWinner?: 'host' | 'guest' | null
  disabled?: boolean
}) {
  const [stage, setStage] = useState<Stage>('wait')
  const goAt = useRef(0)
  const finished = useRef(false)
  const delay = 1800 + (seed % 2200)

  useEffect(() => {
    finished.current = false
    setStage('wait')
    const t = setTimeout(() => {
      goAt.current = performance.now()
      setStage('go')
      sfx.go()
      vibe(25)
    }, delay)
    return () => clearTimeout(t)
  }, [seed, delay])

  useEffect(() => {
    if (remoteWinner && !finished.current) {
      finished.current = true
      setStage('done')
    }
  }, [remoteWinner])

  const tap = () => {
    if (finished.current || disabled) return
    if (stage === 'wait') {
      setStage('early')
      sfx.lose()
      vibe(40)
      // early tap = other player wins after brief flash
      setTimeout(() => {
        if (!finished.current) {
          finished.current = true
          onWin(myRole === 'host' ? 'guest' : 'host')
          setStage('done')
        }
      }, 400)
      return
    }
    if (stage === 'go') {
      finished.current = true
      setStage('done')
      sfx.win()
      vibe([15, 30, 15])
      onWin(myRole)
    }
  }

  return (
    <div className="animate-fade-in space-y-4">
      <p className="text-center text-sm text-muted">Wait for GO — first tap wins. Early tap loses.</p>
      <button
        type="button"
        onClick={tap}
        disabled={stage === 'done' || disabled}
        className={`btn-press flex h-56 w-full flex-col items-center justify-center rounded-3xl border-2 text-4xl font-display font-bold transition-colors ${
          stage === 'wait'
            ? 'border-white/20 bg-ink-card text-muted'
            : stage === 'go'
              ? 'border-gold bg-crimson glow-crimson text-cream animate-heartbeat'
              : stage === 'early'
                ? 'border-rose bg-blood text-cream animate-shake'
                : 'border-gold/40 bg-ink-soft text-gold-soft'
        }`}
      >
        {stage === 'wait' && 'Wait…'}
        {stage === 'go' && 'GO!'}
        {stage === 'early' && 'Too early!'}
        {stage === 'done' && (remoteWinner && remoteWinner !== myRole ? 'They were faster' : 'Locked in')}
      </button>
    </div>
  )
}
