import { useEffect, useRef } from 'react'
import { acquireWakeLock, releaseWakeLock } from './wakeLock'

type KeepAliveSync = {
  role: 'host' | 'guest' | null
  isHealthy: () => boolean
  ensureConnected: () => Promise<void>
}

/**
 * Hold a screen wake lock while a room is open, and reconnect when the tab
 * comes back. Hiding the page must NOT destroy the peer.
 */
export function useRoomKeepAlive(
  active: boolean,
  syncRef: { current: KeepAliveSync | null },
  persist: () => void,
) {
  const persistRef = useRef(persist)
  persistRef.current = persist

  useEffect(() => {
    if (!active) {
      void releaseWakeLock()
      return
    }
    void acquireWakeLock()

    const kick = () => {
      if (document.visibilityState !== 'visible') return
      void acquireWakeLock()
      const sync = syncRef.current
      if (sync?.role && !sync.isHealthy()) void sync.ensureConnected()
    }

    const onVis = () => {
      if (document.visibilityState === 'hidden') persistRef.current()
      else kick()
    }
    const onHide = () => {
      persistRef.current()
    }
    const onShow = () => kick()

    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pagehide', onHide)
    window.addEventListener('pageshow', onShow)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pagehide', onHide)
      window.removeEventListener('pageshow', onShow)
      void releaseWakeLock()
    }
  }, [active, syncRef])
}
