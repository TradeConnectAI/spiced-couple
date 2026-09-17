import { useEffect, useState } from 'react'
import { Button } from './ui/Button'
import { HouseRulesBanner } from './HouseRules'
import { RoomQr } from './RoomQr'
import { ReconnectBanner } from './ReconnectBanner'
import { shareUrl, type RoomMode } from '../lib/room'
import { sfx } from '../lib/audio'

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
      return true
    } catch {
      return false
    }
  }
}

export function WaitingRoom({
  code,
  mode,
  showCode,
  hostName,
  guestName,
  intensity,
  connected,
  isHost,
  partnerName,
  reconnecting,
  status,
  onStart,
}: {
  code: string
  mode: RoomMode
  showCode: boolean
  hostName: string
  guestName: string
  intensity: string
  connected: boolean
  isHost: boolean
  partnerName: string
  reconnecting?: boolean
  status?: string
  onStart: () => void
}) {
  const [note, setNote] = useState('')
  const [canShare, setCanShare] = useState(false)
  const link = showCode && code ? shareUrl(mode, code) : ''

  useEffect(() => {
    setCanShare(typeof navigator.share === 'function')
  }, [])

  const copyCode = async () => {
    const ok = await copyText(code)
    setNote(ok ? 'Code copied' : 'Could not copy')
    if (ok) sfx.coin()
  }

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Spiced Couple',
          text: `Join me on Spiced Couple — room ${code}\n${link}`,
          url: link,
        })
        return
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return
      }
    }
    const ok = await copyText(link)
    setNote(ok ? 'Link copied' : 'Could not copy')
    if (ok) sfx.coin()
  }

  const waitingLine = isHost
    ? `Waiting for ${partnerName || 'your partner'}…`
    : 'Connecting…'

  return (
    <div className="bg-heat min-h-dvh safe-pad flex flex-col items-center justify-center px-6 py-10">
      <ReconnectBanner show={Boolean(reconnecting)} />
      <div className="w-full max-w-md space-y-6 text-center animate-fade-in">
        <p className="text-xs uppercase tracking-[0.3em] text-gold/80">
          {showCode ? 'Room ready' : 'Play together'}
        </p>
        <h2 className="font-display text-3xl font-bold text-cream">
          {hostName} <span className="text-muted">&</span> {guestName}
        </h2>

        {showCode ? (
          <div className="rounded-3xl border border-gold/40 bg-ink-card p-6 glow-gold space-y-4">
            <p className="text-xs text-muted">Show this — no need to leave the page</p>
            <p className="font-mono text-5xl font-bold leading-none tracking-[0.18em] text-gold-soft text-glow-gold sm:text-6xl">
              {code}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="ghost" className="w-full" onClick={() => void copyCode()}>
                Copy code
              </Button>
              {canShare ? (
                <Button variant="primary" className="w-full" onClick={() => void share()}>
                  Share
                </Button>
              ) : (
                <Button variant="primary" className="w-full" onClick={() => void share()}>
                  Copy link
                </Button>
              )}
            </div>
            {note && <p className="text-xs text-gold-soft">{note}</p>}
            <div className="pt-1">
              <RoomQr text={link} />
              <p className="mt-2 text-xs text-muted">Laura scans this with her camera</p>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-gold/40 bg-ink-card p-6 glow-gold">
            <p className="font-display text-3xl text-gold-soft">{waitingLine}</p>
            <p className="mt-2 text-sm text-muted">
              Both stay on this page. {partnerName || 'Your partner'} taps We’re both here too.
            </p>
          </div>
        )}

        <p className="text-sm text-muted capitalize">
          Intensity: <span className="text-rose font-semibold">{intensity}</span>
        </p>
        <HouseRulesBanner compact />
        {!connected ? (
          <div className="space-y-2">
            <div className="mx-auto h-10 w-10 rounded-full border-2 border-gold/40 border-t-gold animate-[spin-slow_1s_linear_infinite]" />
            <p className="text-muted text-sm animate-heartbeat">{status || waitingLine}</p>
            {showCode && (
              <p className="text-xs text-muted/70">
                Or they open the same link, tap Use a code instead, and join.
              </p>
            )}
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
