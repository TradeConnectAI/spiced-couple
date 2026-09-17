import { useMemo, useState } from 'react'
import { shopFor } from '../content/shop'
import type { GameState, ShopItem } from '../types'
import { Button } from './ui/Button'
import { RarityBadge } from './ui/Badge'
import { sfx } from '../lib/audio'
import { vibe } from '../lib/haptics'

const CATS = ['all', 'tease', 'oral', 'penetration', 'anal', 'toys', 'domination'] as const

export function ActShop({
  state,
  myRole,
  isHost,
  onBuy,
  onDoneAct,
  onContinue,
}: {
  state: GameState
  myRole: 'host' | 'guest'
  isHost: boolean
  onBuy: (item: ShopItem, buyer: 'host' | 'guest') => string | void
  onDoneAct: () => void
  onContinue: () => void
}) {
  const [cat, setCat] = useState<(typeof CATS)[number]>('all')
  const [err, setErr] = useState('')
  const items = useMemo(() => {
    const list = shopFor(state.intensity, state.round)
    return cat === 'all' ? list : list.filter((i) => i.category === cat)
  }, [state.intensity, state.round, cat])

  const myCoins = myRole === 'host' ? state.hostCoins : state.guestCoins
  const sellerName =
    state.pendingActBuyer === 'host' ? state.guestName : state.hostName
  const buyerName =
    state.pendingActBuyer === 'host' ? state.hostName : state.guestName

  if (state.pendingAct) {
    return (
      <div className="animate-reveal space-y-5 rounded-3xl border border-crimson/40 bg-ink-card p-5 glow-crimson">
        <p className="text-xs uppercase tracking-widest text-rose">Act purchased</p>
        <h3 className="font-display text-3xl font-bold text-cream">{state.pendingAct.title}</h3>
        <p className="text-cream/85 leading-relaxed">{state.pendingAct.description}</p>
        <p className="text-sm text-gold-soft">
          {buyerName} paid 🌶️ {state.pendingAct.price} — {sellerName} performs.
        </p>
        <Button variant="gold" className="w-full py-4" onClick={onDoneAct}>
          We did it ✓
        </Button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div className="text-center">
        <h3 className="font-display text-2xl font-bold text-glow-gold">Act Shop</h3>
        <p className="text-sm text-muted">Spend Spice Coins. They perform.</p>
        <p className="mt-1 text-gold-soft text-sm">Your balance: 🌶️ {myCoins}</p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs capitalize border ${
              cat === c ? 'border-gold bg-gold/20 text-gold-soft' : 'border-white/10 text-muted'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
        {items.map((item) => (
          <ShopCard
            key={item.id}
            item={item}
            canAfford={myCoins >= item.price}
            onBuy={() => {
              const e = onBuy(item, myRole)
              if (e) {
                setErr(e)
                sfx.lose()
              } else {
                setErr('')
                sfx.purchase()
                vibe([10, 30, 10])
              }
            }}
          />
        ))}
        {items.length === 0 && (
          <p className="text-center text-muted text-sm py-8">
            Nothing unlocked in this category yet — keep playing rounds.
          </p>
        )}
      </div>

      {err && <p className="text-center text-rose text-sm">{err}</p>}

      {(isHost || true) && (
        <Button variant="ghost" className="w-full" onClick={onContinue}>
          Skip shop → Challenge
        </Button>
      )}
    </div>
  )
}

function ShopCard({
  item,
  canAfford,
  onBuy,
}: {
  item: ShopItem
  canAfford: boolean
  onBuy: () => void
}) {
  const border =
    item.rarity === 'depraved'
      ? 'border-crimson/50'
      : item.rarity === 'filthy'
        ? 'border-rose/35'
        : 'border-gold/25'

  return (
    <div className={`card-tilt rounded-2xl border ${border} bg-gradient-to-br from-ink-soft to-ink p-4`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-cream">{item.title}</h4>
            <RarityBadge rarity={item.rarity} />
          </div>
          <p className="mt-1.5 text-sm text-muted leading-snug">{item.description}</p>
          <p className="mt-2 text-[10px] uppercase tracking-wider text-muted/70">{item.category}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-gold-soft font-semibold">🌶️ {item.price}</div>
          <Button
            variant={item.rarity === 'depraved' ? 'danger' : 'primary'}
            className="mt-2 !px-3 !py-2 text-sm"
            disabled={!canAfford}
            onClick={onBuy}
          >
            Buy
          </Button>
        </div>
      </div>
    </div>
  )
}
