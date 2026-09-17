import { useMemo, useState } from 'react'
import { shuffle } from '../../lib/rng'
import { sfx } from '../../lib/audio'
import { vibe } from '../../lib/haptics'

const SYMBOLS = [
  '🔥', '💋', '🌶️', '😈', '🍑', '🍒', '💦', '🖤',
  '🌹', '✨', '🍷', '🕯️', '👅', '💔', '🍾', '🔮',
  '🌙', '💎', '🎯', '⚡', '🍀', '🦋', '🎭', '🧿',
]

function makePair(seed: number) {
  const pool = shuffle(SYMBOLS, seed)
  const shared = pool[0]
  const cardA = shuffle([shared, ...pool.slice(1, 8)], seed + 1)
  const cardB = shuffle([shared, ...pool.slice(8, 15)], seed + 2)
  return { shared, cardA, cardB }
}

export function Dobble({
  seed,
  myRole,
  onWin,
  disabled,
}: {
  seed: number
  myRole: 'host' | 'guest'
  onWin: (winner: 'host' | 'guest') => void
  disabled?: boolean
}) {
  const { shared, cardA, cardB } = useMemo(() => makePair(seed), [seed])
  const [locked, setLocked] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)

  const tap = (sym: string) => {
    if (locked || disabled) return
    if (sym === shared) {
      setLocked(true)
      setFlash(sym)
      sfx.win()
      vibe([20, 40, 20])
      onWin(myRole)
    } else {
      sfx.lose()
      vibe(30)
      setFlash('wrong')
      setTimeout(() => setFlash(null), 300)
    }
  }

  return (
    <div className="animate-fade-in space-y-4">
      <p className="text-center text-sm text-muted">
        Tap the <span className="text-gold-soft font-semibold">one matching symbol</span> on either card
      </p>
      <div className="grid grid-cols-2 gap-3">
        {[cardA, cardB].map((card, ci) => (
          <div
            key={ci}
            className="animate-deal relative aspect-square rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-ink-card to-ink-soft p-2 shadow-xl"
            style={{ animationDelay: `${ci * 0.1}s` }}
          >
            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.12),transparent)]" />
            <div className="relative grid h-full grid-cols-3 grid-rows-3 gap-0.5 place-items-center">
              {card.map((sym, i) => (
                <button
                  key={`${ci}-${i}`}
                  type="button"
                  disabled={locked || disabled}
                  onClick={() => tap(sym)}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition active:scale-90 sm:h-14 sm:w-14 sm:text-3xl ${
                    flash === sym ? 'bg-gold/40 scale-110' : flash === 'wrong' ? '' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {locked && (
        <p className="text-center text-gold-soft font-display text-xl italic">Match found!</p>
      )}
    </div>
  )
}
