import { Button } from './ui/Button'
import { HouseRulesBanner } from './HouseRules'

export function WaitingRoom({
  code,
  hostName,
  guestName,
  intensity,
  connected,
  isHost,
  onStart,
  onCopy,
}: {
  code: string
  hostName: string
  guestName: string
  intensity: string
  connected: boolean
  isHost: boolean
  onStart: () => void
  onCopy: () => void
}) {
  return (
    <div className="bg-heat min-h-dvh safe-pad flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md space-y-6 text-center animate-fade-in">
        <p className="text-xs uppercase tracking-[0.3em] text-gold/80">Room ready</p>
        <h2 className="font-display text-3xl font-bold text-cream">
          {hostName} <span className="text-muted">&</span> {guestName}
        </h2>
        <div className="rounded-3xl border border-gold/40 bg-ink-card p-6 glow-gold">
          <p className="text-xs text-muted mb-2">Share this code</p>
          <p className="font-mono text-4xl tracking-[0.35em] text-gold-soft text-glow-gold">{code}</p>
          <Button variant="ghost" className="mt-4 w-full" onClick={onCopy}>
            Copy code
          </Button>
        </div>
        <p className="text-sm text-muted capitalize">
          Intensity: <span className="text-rose font-semibold">{intensity}</span>
        </p>
        <HouseRulesBanner compact />
        {!connected ? (
          <div className="space-y-2">
            <div className="mx-auto h-10 w-10 rounded-full border-2 border-gold/40 border-t-gold animate-[spin-slow_1s_linear_infinite]" />
            <p className="text-muted text-sm animate-heartbeat">
              {isHost ? 'Waiting for your partner to join…' : 'Connecting…'}
            </p>
            <p className="text-xs text-muted/70">
              Partner opens the same link, taps Join, enters the code.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gold-soft font-medium">✦ Both connected ✦</p>
            {isHost ? (
              <Button variant="gold" className="w-full py-4 text-lg" onClick={onStart}>
                Start the night
              </Button>
            ) : (
              <p className="text-muted text-sm animate-heartbeat">Host will start when ready…</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
