type WakeLockLike = {
  released: boolean
  release: () => Promise<void>
  addEventListener: (type: string, cb: () => void) => void
}

let lock: WakeLockLike | null = null

export async function acquireWakeLock() {
  try {
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<WakeLockLike> }
    }
    if (!nav.wakeLock) return
    if (lock && !lock.released) return
    lock = await nav.wakeLock.request('screen')
    lock.addEventListener('release', () => {
      lock = null
    })
  } catch {
    /* unsupported, denied, or page hidden */
  }
}

export async function releaseWakeLock() {
  const current = lock
  lock = null
  try {
    await current?.release()
  } catch {
    /* already released */
  }
}
