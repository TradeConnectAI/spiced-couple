import type { RoomMode } from './room'

const KEY = 'spiced-couple-session-v1'

export type SavedSession = {
  v: 1
  role: 'host' | 'guest'
  mode: RoomMode
  /** Empty when using the private fixed room (no code). */
  code: string
  fixed: boolean
  hostName: string
  guestName: string
  myName: string
  partnerName: string
  state: unknown
  screen: 'waiting' | 'game'
  connected: boolean
}

export function saveSession(s: SavedSession) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* private mode / quota */
  }
}

export function loadSession(): SavedSession | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as SavedSession
    if (!s || s.v !== 1) return null
    if (s.mode !== 'full' && s.mode !== 'apart') return null
    if (s.role !== 'host' && s.role !== 'guest') return null
    if (s.screen !== 'waiting' && s.screen !== 'game') return null
    if (!s.myName || !s.partnerName) return null
    return s
  } catch {
    return null
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* */
  }
}
