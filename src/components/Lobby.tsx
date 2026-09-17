import { useEffect, useRef, useState } from 'react'
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
  onPlayTogether,
  onBack,
  status,
  error,
  initialJoinCode,
}: {
  onHost: (opts: {
    code: string
    hostName: string
    guestName: string
    intensity: Intensity
  }) => void
  onJoin: (opts: { code: string; guestName: string }) => void
  onPlayTogether: (opts: { myName: string; partnerName: string; intensity: Intensity }) => void
  onBack?: () => void
  status?: string
  error?: string
  initialJoinCode?: string
}) {
  const [mode, setMode] = useState<'together' | 'code-pick' | 'create' | 'join'>(
    initialJoinCode ? 'join' : 'together',
  )
  const [hostName, setHostName] = useState('Steve')
  const [guestName, setGuestName] = useState('Laura')
  const [intensity, setIntensity] = useState<Intensity>('spicy')
  const [consent, setConsent] = useState(false)
  const [code, setCode] = useState(initialJoinCode ?? '')
  const [busy, setBusy] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialJoinCode) nameRef.current?.focus()
  }, [initialJoinCode])

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

  const together = async () => {
    if (!consent) return
    setBusy(true)
    await onPlayTogether({
      myName: hostName.trim() || 'Steve',
      partnerName: guestName.trim() || 'Laura',
      intensity,
    })
    setBusy(false)
  }

  return (
    <div className="bg-heat min-h-dvh safe-pad px-5 py-8">
      <div className="mx-auto max-w-md space-y-6">
        <header className="text-center">
          {onBack && (
            <button type="button" className="text-xs text-muted underline mb-3" onClick={onBack}>
              ← All modes
            </button>
          )}
          <h2 className="font-display text-3xl font-bold text-glow-gold">Full Night lobby</h2>
          <p className="mt-1 text-sm text-muted">
            {mode === 'together' ? 'Both phones tap the same button. No code.' : 'Or use a code if you prefer'}
          </p>
        </header>

        {mode === 'code-pick' && (
          <div className="grid gap-3 animate-fade-in">
            <Button variant="gold" className="w-full py-4" onClick={() => setMode('create')}>
              Create room (Host)
            </Button>
            <Button variant="primary" className="w-full py-4" onClick={() => setMode('join')}>
              Join room
            </Button>
            <button
              type="button"
              className="text-xs text-muted underline py-1"
              onClick={() => setMode('together')}
            >
              ← Back to Play together
            </button>
            <HouseRulesBanner />
          </div>
        )}

        {mode !== 'code-pick' && (
          <div className="space-y-5 animate-fade-in rounded-3xl border border-white/10 bg-ink-card/80 p-5 backdrop-blur">
            {mode !== 'together' && (
              <button
                type="button"
                className="text-xs text-muted underline"
                onClick={() => setMode('code-pick')}
              >
                ← Back
              </button>
            )}

            {mode === 'together' && (
              <>
                <p className="text-center text-xs uppercase tracking-[0.28em] text-gold/80">Play together</p>
                <p className="text-center text-[11px] leading-snug text-muted">On Laura's phone, put Laura first and Steve as partner.</p>
              </>
            )}

            <label className="block space-y-1.5">
              <span className="text-xs uppercase tracking-wider text-muted">Your name</span>
              <input
                ref={mode === 'join' || mode === 'together' ? nameRef : undefined}
                className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-cream outline-none focus:border-gold/50"
                value={mode === 'join' ? guestName : hostName}
                autoFocus={Boolean(initialJoinCode) && mode === 'join'}
                onChange={(e) =>
                  mode === 'join' ? setGuestName(e.target.value) : setHostName(e.target.value)
                }
              />
            </label>

            {(mode === 'create' || mode === 'together') && (
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

            {mode === 'together' ? (
              <Button
                variant="gold"
                className="w-full py-5 text-lg"
                disabled={!consent || busy}
                onClick={() => void together()}
              >
                {busy ? 'Finding each other…' : "We're both here"}
              </Button>
            ) : mode === 'create' ? (
              <Button
                variant="gold"
                className="w-full py-4"
                disabled={!consent || busy}
                onClick={() => void create()}
              >
                {busy ? 'Opening…' : 'Create & get code'}
              </Button>
            ) : (
              <Button
                variant="primary"
                className="w-full py-4"
                disabled={!consent || busy || code.length < 4}
                onClick={() => void join()}
              >
                {busy ? 'Connecting…' : 'Join room'}
              </Button>
            )}

            {mode === 'together' && (
              <button
                type="button"
                className="w-full text-center text-xs text-muted underline py-1"
                onClick={() => setMode('code-pick')}
              >
                Use a code instead
              </button>
            )}

            {status && <p className="text-center text-sm text-gold-soft">{status}</p>}
            {error && <p className="text-center text-sm text-rose">{error}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
