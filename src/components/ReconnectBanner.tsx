export function ReconnectBanner({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
      <div className="rounded-full border border-gold/40 bg-ink/90 px-4 py-1.5 text-xs font-medium tracking-wide text-gold-soft shadow-lg backdrop-blur">
        Reconnecting…
      </div>
    </div>
  )
}
