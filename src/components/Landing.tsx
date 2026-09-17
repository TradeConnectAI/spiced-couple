import { Button } from './ui/Button'
import { HouseRulesBanner } from './HouseRules'

export function Landing({
  onFullNight,
  onApartNight,
}: {
  onFullNight: () => void
  onApartNight: () => void
}) {
  return (
    <div className="bg-heat relative flex min-h-dvh flex-col items-center justify-center overflow-hidden safe-pad px-6 py-12">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-crimson/20 blur-3xl animate-[pulse-glow_4s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute bottom-10 right-0 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />

      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-gold/80 animate-fade-in">
        For two consenting adults
      </p>
      <h1 className="font-display text-center text-5xl font-bold leading-tight sm:text-6xl animate-fade-in">
        <span className="shimmer-text">Spiced</span>
        <br />
        <span className="text-cream text-glow-crimson">Couple</span>
      </h1>
      <p
        className="mt-4 max-w-sm text-center text-muted leading-relaxed animate-fade-in"
        style={{ animationDelay: '0.1s' }}
      >
        Pick your night: the full arc (talk → photos → clips → meetup → filth), or stay apart with
        quizzes, quests & video forfeits.
      </p>

      <div className="mt-10 w-full max-w-sm space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <Button variant="gold" className="w-full py-4 text-lg" onClick={onFullNight}>
          Full Night
          <span className="block text-xs font-normal opacity-80 mt-0.5">
            Talk · photos · clips · meetup · games
          </span>
        </Button>
        <Button variant="primary" className="w-full py-4 text-lg" onClick={onApartNight}>
          Apart Night
          <span className="block text-xs font-normal opacity-80 mt-0.5">
            Quiz & quests · different rooms · forfeits
          </span>
        </Button>
        <p className="text-center text-xs text-muted leading-relaxed px-2">
          Peer-to-peer via your phones — nothing is stored on a server once you close the session.
          No accounts. No uploads. 18+ only.
        </p>
        <div className="pt-2">
          <HouseRulesBanner compact />
        </div>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-2 text-[10px] uppercase tracking-widest text-muted/80">
        <span className="rounded-full border border-white/10 px-3 py-1">Talk</span>
        <span className="rounded-full border border-white/10 px-3 py-1">Photos</span>
        <span className="rounded-full border border-white/10 px-3 py-1">Clips</span>
        <span className="rounded-full border border-rose/30 px-3 py-1 text-rose">Meetup</span>
        <span className="rounded-full border border-gold/30 px-3 py-1 text-gold-soft">Filth</span>
        <span className="rounded-full border border-crimson/40 px-3 py-1 text-rose">Apart Night</span>
      </div>
    </div>
  )
}
