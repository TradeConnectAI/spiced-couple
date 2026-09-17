import { Button } from './ui/Button'

export function MeetupGate({
  hostName,
  guestName,
  hostTogether,
  guestTogether,
  myRole,
  solo,
  onReady,
}: {
  hostName: string
  guestName: string
  hostTogether: boolean
  guestTogether: boolean
  myRole: 'host' | 'guest'
  solo: boolean
  onReady: () => void
}) {
  const iAmReady = myRole === 'host' ? hostTogether : guestTogether
  const both = hostTogether && guestTogether

  return (
    <div className="animate-reveal fixed inset-0 z-40 flex flex-col items-center justify-center bg-heat px-6 safe-pad">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,30,58,0.35),transparent_70%)]" />
      <div className="relative z-10 mx-auto w-full max-w-md space-y-8 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">Meetup gate</p>
        <h2 className="font-display text-4xl font-bold text-glow-gold leading-tight sm:text-5xl">
          Go to the same room now.
        </h2>
        <p className="text-cream/85 leading-relaxed">
          The apart teasing is over. Find each other. When you&apos;re face to face, both tap
          below — mini-games, Spice Coins, and the Act Shop unlock next.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div
            className={`rounded-2xl border p-4 ${
              hostTogether
                ? 'border-gold/50 bg-gold/15 text-gold-soft'
                : 'border-white/10 bg-ink-card text-muted'
            }`}
          >
            <p className="text-xs uppercase tracking-widest mb-1">{hostName}</p>
            <p className="font-display text-xl">{hostTogether ? 'Together ✓' : 'Still apart…'}</p>
          </div>
          <div
            className={`rounded-2xl border p-4 ${
              guestTogether
                ? 'border-gold/50 bg-gold/15 text-gold-soft'
                : 'border-white/10 bg-ink-card text-muted'
            }`}
          >
            <p className="text-xs uppercase tracking-widest mb-1">{guestName}</p>
            <p className="font-display text-xl">{guestTogether ? 'Together ✓' : 'Still apart…'}</p>
          </div>
        </div>

        {!both && (
          <Button
            variant="gold"
            className="w-full py-5 text-lg"
            disabled={iAmReady && !solo}
            onClick={onReady}
          >
            {solo
              ? "We're together (solo)"
              : iAmReady
                ? 'Waiting for partner…'
                : "We're together"}
          </Button>
        )}

        {both && (
          <p className="text-gold-soft animate-heartbeat text-sm">Unlocking together mode…</p>
        )}

        <p className="text-[11px] text-muted">
          Synced over PeerJS. No media uploads — just the two of you in one room.
        </p>
      </div>
    </div>
  )
}
