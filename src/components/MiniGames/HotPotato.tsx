import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/Button'
import { sfx } from '../../lib/audio'
import { vibe } from '../../lib/haptics'

export function HotPotato({
  seed,
  hostName,
  guestName,
  isHost,
  myRole,
  onLose,
  remoteHolder,
  remoteBoom,
  onPass,
  onStart,
  remoteStarted,
}: {
  seed: number
  hostName: string
  guestName: string
  isHost: boolean
  myRole: 'host' | 'guest'
  onLose: (loser: 'host' | 'guest') => void
  remoteHolder?: 'host' | 'guest'
  remoteBoom?: boolean
  onPass: (next: 'host' | 'guest') => void
  onStart: () => void
  remoteStarted?: boolean
}) {
  const duration = 4000 + (seed % 5000)
  const [holder, setHolder] = useState<'host' | 'guest'>('host')
  const [started, setStarted] = useState(false)
  const [left, setLeft] = useState(duration)
  const [boom, setBoom] = useState(false)
  const ended = useRef(false)
  const holderRef = useRef(holder)
  holderRef.current = holder

  useEffect(() => {
    if (remoteHolder) setHolder(remoteHolder)
  }, [remoteHolder])

  useEffect(() => {
    if (remoteStarted && !started) setStarted(true)
  }, [remoteStarted, started])

  useEffect(() => {
    if (remoteBoom && !ended.current) {
      ended.current = true
      setBoom(true)
      sfx.lose()
    }
  }, [remoteBoom])

  useEffect(() => {
    if (!started || ended.current) return
    const startAt = performance.now()
    const tick = setInterval(() => {
      const remain = Math.max(0, duration - (performance.now() - startAt))
      setLeft(remain)
      if (remain < 1500 && remain > 0) {
        sfx.tick()
        vibe(5)
      }
      if (remain <= 0 && !ended.current) {
        ended.current = true
        setBoom(true)
        sfx.lose()
        vibe([40, 60, 40, 60, 80])
        if (isHost) onLose(holderRef.current)
        clearInterval(tick)
      }
    }, 80)
    return () => clearInterval(tick)
  }, [started, duration, isHost, onLose])

  const pass = () => {
    if (!started || boom || myRole !== holder) return
    const next = holder === 'host' ? 'guest' : 'host'
    setHolder(next)
    sfx.tap()
    vibe(10)
    onPass(next)
  }

  const start = () => {
    setStarted(true)
    onStart()
    sfx.go()
  }

  const pct = Math.max(0, left / duration)

  return (
    <div className="animate-fade-in space-y-5">
      <p className="text-center text-sm text-muted">
        Pass before it explodes. Whoever holds it loses.
      </p>
      <div
        className={`relative mx-auto flex h-48 w-48 flex-col items-center justify-center rounded-full border-4 ${
          boom ? 'border-crimson bg-blood animate-shake glow-crimson' : 'border-gold/50 bg-ink-card glow-gold'
        }`}
      >
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: `conic-gradient(#c41e3a ${Math.round((1 - pct) * 360)}deg, transparent 0)`,
          }}
        />
        <span className="relative text-5xl">{boom ? '💥' : '🥔'}</span>
        <span className="relative mt-2 text-sm text-gold-soft">
          {boom ? 'BOOM' : started ? `${(left / 1000).toFixed(1)}s` : 'Ready'}
        </span>
      </div>
      <p className="text-center font-display text-xl text-cream">
        Holding: <span className="text-gold">{holder === 'host' ? hostName : guestName}</span>
      </p>
      {!started && isHost && (
        <Button variant="gold" className="w-full" onClick={start}>
          Light the fuse
        </Button>
      )}
      {!started && !isHost && (
        <p className="text-center text-muted text-sm animate-heartbeat">Waiting for host…</p>
      )}
      {started && !boom && (
        <Button
          variant={myRole === holder ? 'primary' : 'ghost'}
          className="w-full text-lg py-5"
          disabled={myRole !== holder}
          onClick={pass}
        >
          {myRole === holder ? 'PASS IT! ✋' : 'Waiting for pass…'}
        </Button>
      )}
    </div>
  )
}
