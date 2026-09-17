import { HOUSE_RULES, HOUSE_RULES_SHORT } from '../content/houseRules'

export function HouseRulesBanner({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-center text-[10px] leading-relaxed text-muted/80 px-2">
        {HOUSE_RULES_SHORT}
      </p>
    )
  }
  return (
    <div className="rounded-2xl border border-white/10 bg-ink/60 p-4 space-y-2">
      <p className="text-[10px] uppercase tracking-[0.25em] text-gold/70 text-center">House rules</p>
      <ul className="space-y-1.5">
        {HOUSE_RULES.map((r) => (
          <li key={r} className="text-xs text-cream/75 leading-snug flex gap-2">
            <span className="text-gold shrink-0">✦</span>
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
