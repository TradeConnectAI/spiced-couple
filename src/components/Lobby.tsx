import { useState } from 'react'
import type { Intensity } from '../types'
import { Button } from './ui/Button'
import { makeRoomCode } from '../lib/room'
import { HouseRulesBanner } from './HouseRules'

const INTENSITIES: { id: Intensity; label: string; blurb: string }[] = [
  { id: 'romantic', label: 'Romantic', blurb: 'Soft heat & longing' },
  { id: 'spicy', label: 'Spicy', blurb: 'Flirty & handsy' },
  { id: 'fire', label: 'Fire', blurb: 'Explicit & hungry' },
  { id: 'hard', label: 'Hard', blurb: 'Absolute filth' },
]

export function Lobby({
  onHost,
  onJoin,
  status,
  error,
}: {
  onHost: (opts: {
    code: string
    hostName: string
    guestName: string
    intensity: Intensity
  }) => void
  onJoin: (opts: { code: string; guestName: string }) => void
  status?: string
  error?: string
}) {
  const [mode, setMode] = useState<'pick' | 'create' | 'join'>('pick')
  const [hostName, setHostName] = useState('Steve')
  const [guestName, setGuestName] = useState('Laura')
  const [intensity, setIntensity] = useState<Intensity>('spicy')
  const [consent, setConsent] = useState(false)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)

  const create = async () => {
    if (!consent) return
    setBusy(true)
    const c = makeRoomCode()
    setCode(c)
    await onHost({ code: c, hostName, guestName, intensity })
    setBusy(false)
  }

  const join = async () => {
    if (!consent || code.trim().length < 4) return
    setBusy(true)
    await onJoin({ code: code.trim().toUpperCase(), guestName })
    setBusy(false)
  }

  return (
    <div className="bg-heat min-h-dvh safe-pad px-5 py-8">
      <div className="mx-auto max-w-md space-y-6">
        <header className="text-center">
          <h2 className="font-display text-3xl font-bold text-glow-gold">Lobby</h2>
          <p className="mt-1 text-sm text-muted">Create a room or join with a code</p>
        </header>

        {mode === 'pick' && (
          <div className="grid gap-3 animate-fade-in">
            <Button variant="gold" className="w-full py-4" onClick={() => setMode('create')}>
              Create room (Host)
            </Button>
            <Button variant="primary" className="w-full py-4" onClick={() => setMode('join')}>
              Join room
            </Button>
            <HouseRulesBanner />
          </div>
        )}

        {mode !== 'pick' && (
          <div className="space-y-5 animate-fade-in rounded-3xl border border-white/10 bg-ink-card/80 p-5 backdrop-blur">
            <button
              type="button"
              className="text-xs text-muted underline"
              onClick={() => setMode('pick')}
            >
              ← Back
            </button>

            <label className="block space-y-1.5">
              <span className="text-xs uppercase tracking-wider text-muted">Your name</span>
              <input
                className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-cream outline-none focus:border-gold/50"
                value={mode === 'create' ? hostName : guestName}
                onChange={(e) =>
                  mode === 'create' ? setHostName(e.target.value) : setGuestName(e.target.value)
                }
              />
            </label>

            {mode === 'create' && (
              <>
                <label className="block space-y-1.5">
                  <span className="text-xs uppercase tracking-wider text-muted">Partner name</span>
                  <input
                    className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-cream outline-none focus:border-gold/50"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                </label>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider text-muted">Intensity</span>
                  <div className="grid grid-cols-2 gap-2">
                    {INTENSITIES.map((i) => (
                      <button
                        key={i.id}
                        type="button"
                        onClick={() => setIntensity(i.id)}
                        className={`rounded-2xl border px-3 py-3 text-left transition ${
                          intensity === i.id
                            ? i.id === 'hard'
                              ? 'border-crimson bg-crimson/30 glow-crimson'
                              : 'border-gold bg-gold/15'
                            : 'border-white/10 bg-white/5'
                        }`}
                      >
                        <div className="font-semibold text-sm">{i.label}</div>
                        <div className="text-[11px] text-muted">{i.blurb}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {mode === 'join' && (
              <label className="block space-y-1.5">
                <span className="text-xs uppercase tracking-wider text-muted">Room code</span>
                <input
                  className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-center font-mono text-2xl tracking-[0.3em] text-gold-soft outline-none focus:border-gold/50 uppercase"
                  value={code}
                  maxLength={6}
                  placeholder="ABC123"
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
              </label>
            )}

            <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-ink/50 p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-5 w-5 accent-crimson"
              />
              <span className="text-sm text-cream/90 leading-snug">
                We are both 18+ consenting adults. Enthusiastic consent only — safewords always on.
                No non-consent / CNC noncon content.
              </span>
            </label>

            {mode === 'create' ? (
              <Button
                variant="gold"
                className="w-full py-4"
                disabled={!consent || busy}
                onClick={create}
              >
                {busy ? 'Opening…' : 'Create & get code'}
              </Button>
            ) : (
              <Button
                variant="primary"
                className="w-full py-4"
                disabled={!consent || busy || code.length < 4}
                onClick={join}
              >
                {busy ? 'Connecting…' : 'Join room'}
              </Button>
            )}

            {status && <p className="text-center text-sm text-gold-soft">{status}</p>}
            {error && <p className="text-center text-sm text-rose">{error}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
