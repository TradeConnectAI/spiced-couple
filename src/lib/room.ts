const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function makeRoomCode(len = 6): string {
  const arr = new Uint8Array(len)
  crypto.getRandomValues(arr)
  return Array.from(arr, (b) => ALPHABET[b % ALPHABET.length]).join('')
}

export type RoomMode = 'full' | 'apart'

/** PeerJS id derived from room code so guest can dial host. */
export function peerIdFromCode(code: string, mode: RoomMode = 'full'): string {
  const c = code.trim().toUpperCase()
  return mode === 'apart' ? `spiced-apart-${c}` : `spiced-${c}`
}

export const SITE_URL = 'https://tradeconnectai.github.io/spiced-couple/'

/** Stable private rooms so Steve & Laura never have to leave the page to share a code. */
export function fixedPeerId(mode: RoomMode): string {
  return mode === 'apart' ? 'spiced-steve-laura-apart' : 'spiced-steve-laura-full'
}

export function shareUrl(mode: RoomMode, code: string): string {
  const u = new URL(SITE_URL)
  u.searchParams.set('mode', mode)
  u.searchParams.set('code', code.trim().toUpperCase())
  return u.toString()
}

export type LaunchParams = { mode: RoomMode; code: string }

/** Deep link from a QR / shared URL. Consent is still required — never auto-joins. */
export function readLaunchParams(): LaunchParams | null {
  if (typeof window === 'undefined') return null
  const q = new URLSearchParams(window.location.search)
  const raw = q.get('mode')
  const mode: RoomMode | null = raw === 'apart' ? 'apart' : raw === 'full' ? 'full' : null
  const code = (q.get('code') || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6)
  if (!mode || code.length < 4) return null
  return { mode, code }
}
