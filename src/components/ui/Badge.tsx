const mediaColor: Record<string, string> = {
  text: 'bg-gold/20 text-gold-soft border-gold/30',
  audio: 'bg-rose/20 text-rose border-rose/30',
  photo: 'bg-crimson/20 text-cream border-crimson/30',
  video: 'bg-blood/40 text-cream border-rose/40',
  touch: 'bg-gold/30 text-ink border-gold',
}

export function MediaBadge({ type }: { type: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${mediaColor[type] ?? mediaColor.text}`}
    >
      {type}
    </span>
  )
}

export function RarityBadge({ rarity }: { rarity: string }) {
  const map: Record<string, string> = {
    tease: 'bg-gold/15 text-gold-soft border-gold/25',
    filthy: 'bg-rose/20 text-rose border-rose/35',
    depraved: 'bg-crimson/30 text-cream border-crimson/50 glow-crimson',
  }
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${map[rarity] ?? map.tease}`}>
      {rarity}
    </span>
  )
}
