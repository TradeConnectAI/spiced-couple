export function CoinPill({
  name,
  coins,
  highlight,
  pop,
}: {
  name: string
  coins: number
  highlight?: boolean
  pop?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${
        highlight ? 'border-gold/50 bg-gold/10' : 'border-white/10 bg-white/5'
      }`}
    >
      <span className="text-xs text-muted truncate max-w-[4.5rem]">{name}</span>
      <span className={`text-sm font-semibold text-gold-soft ${pop ? 'animate-coin' : ''}`}>
        🌶️ {coins}
      </span>
    </div>
  )
}
