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
