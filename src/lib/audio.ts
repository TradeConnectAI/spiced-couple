let ctx: AudioContext | null = null
let muted = false

function getCtx(): AudioContext | null {
  if (muted) return null
  try {
    if (!ctx) ctx = new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

export function setMuted(m: boolean) {
  muted = m
}

export function isMuted() {
  return muted
}

function beep(freq: number, dur: number, type: OscillatorType = 'sine', gain = 0.08, when = 0) {
  const c = getCtx()
  if (!c) return
  const t0 = c.currentTime + when
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(gain, t0)
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
  o.connect(g)
  g.connect(c.destination)
  o.start(t0)
  o.stop(t0 + dur + 0.02)
}

export const sfx = {
  tap: () => beep(520, 0.04, 'triangle', 0.05),
  win: () => {
    beep(523, 0.1, 'sine', 0.09)
    beep(659, 0.1, 'sine', 0.09, 0.1)
    beep(784, 0.18, 'sine', 0.1, 0.2)
  },
  lose: () => {
    beep(300, 0.15, 'sawtooth', 0.05)
    beep(200, 0.25, 'sawtooth', 0.05, 0.12)
  },
  coin: () => {
    beep(880, 0.06, 'square', 0.04)
    beep(1320, 0.1, 'square', 0.04, 0.06)
  },
  purchase: () => {
    beep(440, 0.08, 'triangle', 0.07)
    beep(554, 0.08, 'triangle', 0.07, 0.08)
    beep(659, 0.16, 'triangle', 0.08, 0.16)
  },
  reveal: () => {
    beep(180, 0.2, 'sine', 0.06)
    beep(240, 0.3, 'sine', 0.05, 0.15)
  },
  go: () => beep(880, 0.12, 'square', 0.08),
  tick: () => beep(600, 0.03, 'square', 0.03),
}
