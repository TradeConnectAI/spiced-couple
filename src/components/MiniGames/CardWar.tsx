import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../ui/Button'
import { sfx } from '../../lib/audio'
import { vibe } from '../../lib/haptics'

const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
const SUITS = ['♥', '♠', '♦', '♣']

function cardFromSeed(seed: number, offset: number) {
  const r = RANKS[(seed + offset * 7) % RANKS.length]
  const s = SUITS[(seed + offset * 3) % SUITS.length]
  return { rank: r, suit: s, red: s === '♥' || s === '♦' }
}

function label(rank: number) {
  if (rank === 11) return 'J'
  if (rank === 12) return 'Q'
  if (rank === 13) return 'K'
  if (rank === 14) return 'A'
  return String(rank)
}

function Face({
  card,
  dealDelay,
  hidden,
}: {
  card: { rank: number; suit: string; red: boolean }
  dealDelay: number
  hidden?: boolean
}) {
  return (
    <div
      className="animate-deal relative h-40 w-28 rounded-2xl border-2 shadow-2xl"
      style={{ animationDelay: `${dealDelay}s` }}
    >
      {hidden ? (
        <div className="flex h-full w-full items-center justify-center rounded-2xl border border-gold/30 bg-gradient-to-br from-blood to-ink-card">
          <span className="text-3xl">🌶️</span>
        </div>
      ) : (
        <div
          className={`flex h-full w-full flex-col justify-between rounded-2xl bg-cream p-3 ${
            card.red ? 'text-crimson' : 'text-ink'
          }`}
        >
          <div className="text-left font-display text-2xl font-bold leading-none">
            {label(card.rank)}
            <div className="text-lg">{card.suit}</div>
          </div>
          <div className="text-center text-4xl">{card.suit}</div>
          <div className="rotate-180 text-left font-display text-2xl font-bold leading-none">
            {label(card.rank)}
            <div className="text-lg">{card.suit}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export function CardWar({
  seed,
  hostName,
  guestName,
  isHost,
  onResolve,
  remoteRevealed,
  onHostReveal,
}: {
  seed: number
  hostName: string
  guestName: string
  isHost: boolean
  onResolve: (winner: 'host' | 'guest' | 'tie') => void
  remoteRevealed?: boolean
  onHostReveal?: () => void
}) {
  const hostCard = useMemo(() => cardFromSeed(seed, 1), [seed])
  const guestCard = useMemo(() => cardFromSeed(seed, 2), [seed])
  const [revealed, setRevealed] = useState(false)
  const done = useRef(false)

  const doReveal = () => {
    if (done.current) return
    done.current = true
    setRevealed(true)
    sfx.reveal()
    vibe(15)
    setTimeout(() => {
      let winner: 'host' | 'guest' | 'tie' = 'tie'
      if (hostCard.rank > guestCard.rank) winner = 'host'
      else if (guestCard.rank > hostCard.rank) winner = 'guest'
      if (winner !== 'tie') sfx.win()
      else sfx.tick()
      onResolve(winner)
    }, 900)
  }

  const reveal = () => {
    if (revealed || done.current) return
    onHostReveal?.()
    doReveal()
  }

  useEffect(() => {
    if (!isHost && remoteRevealed && !done.current) doReveal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteRevealed, isHost])

  return (
    <div className="animate-fade-in space-y-5">
      <p className="text-center text-sm text-muted">Higher card wins coins. Ace high.</p>
      <div className="flex items-end justify-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted">{hostName}</span>
          <Face card={hostCard} dealDelay={0.05} hidden={!revealed} />
        </div>
        <span className="pb-16 font-display text-2xl text-gold italic">vs</span>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted">{guestName}</span>
          <Face card={guestCard} dealDelay={0.15} hidden={!revealed} />
        </div>
      </div>
      {isHost && !revealed && (
        <Button variant="gold" className="w-full" onClick={reveal}>
          Deal & Reveal
        </Button>
      )}
      {!isHost && !revealed && (
        <p className="text-center text-muted text-sm animate-heartbeat">Waiting for host to deal…</p>
      )}
    </div>
  )
}
