export type Intensity = 'romantic' | 'spicy' | 'fire' | 'hard'

/** High-level session arc (strict order). */
export type ArcPhase = 'talk' | 'photo' | 'clip' | 'meetup' | 'filth'

export type Phase =
  | 'landing'
  | 'lobby'
  | 'waiting'
  | 'narrator'
  | 'minigame'
  | 'result'
  | 'forfeit'
  | 'shop'
  | 'challenge'
  | 'meetup'
  | 'paused'
  | 'ended'

export type MiniGameKind = 'dobble' | 'cardwar' | 'reaction' | 'hotpotato'
export type MediaBadge = 'text' | 'audio' | 'photo' | 'video' | 'touch'
export type ShopCategory = 'tease' | 'oral' | 'penetration' | 'anal' | 'toys' | 'domination'
export type Rarity = 'tease' | 'filthy' | 'depraved'

export interface PlayerInfo {
  name: string
  role: 'host' | 'guest'
}

export interface ShopItem {
  id: string
  title: string
  description: string
  price: number
  category: ShopCategory
  rarity: Rarity
  intensities: Intensity[]
  unlockRound: number
}

export interface ForfeitCard {
  id: string
  title: string
  description: string
  intensities: Intensity[]
  media: MediaBadge
}

export interface ChallengeCard {
  id: string
  title: string
  description: string
  roundMin: number
  roundMax: number
  intensities: Intensity[]
  media: MediaBadge
}

export interface GameState {
  phase: Phase
  /** Session arc phase — drives locked features & copy. */
  arcPhase: ArcPhase
  intensity: Intensity
  round: number // 1-10
  hostName: string
  guestName: string
  hostCoins: number
  guestCoins: number
  hostSkipUsed: boolean
  guestSkipUsed: boolean
  currentMiniGame: MiniGameKind | null
  lastWinner: 'host' | 'guest' | 'tie' | null
  lastCoinDelta: number
  currentForfeit: ForfeitCard | null
  forfeitTarget: 'host' | 'guest' | null
  currentChallenge: ChallengeCard | null
  shopOpen: boolean
  pendingAct: ShopItem | null
  pendingActBuyer: 'host' | 'guest' | null
  narratorLine: string
  seed: number
  usedForfeitIds: string[]
  usedChallengeIds: string[]
  purchasedIds: string[]
  consent: boolean
  started: boolean
  /** Meetup gate sync flags */
  hostTogether: boolean
  guestTogether: boolean
}

export type PeerMsg =
  | { type: 'hello'; role: 'guest'; name: string }
  | { type: 'welcome'; state: GameState; guestName: string }
  | { type: 'state'; state: GameState }
  | { type: 'minigame-action'; action: string; payload?: unknown }
  | { type: 'ping' }
  | { type: 'pong' }

export const STARTING_COINS = 50
export const TOTAL_ROUNDS = 10
export const ROOM_CODE_LEN = 6

/** Round → arc phase mapping (meetup is a gate between clip and filth). */
export function arcPhaseForRound(round: number): ArcPhase {
  if (round <= 3) return 'talk'
  if (round <= 5) return 'photo'
  if (round <= 7) return 'clip'
  return 'filth'
}

export function isApartArc(arc: ArcPhase): boolean {
  return arc === 'talk' || arc === 'photo' || arc === 'clip' || arc === 'meetup'
}

export function emptyState(partial?: Partial<GameState>): GameState {
  return {
    phase: 'lobby',
    arcPhase: 'talk',
    intensity: 'spicy',
    round: 1,
    hostName: 'Steve',
    guestName: 'Laura',
    hostCoins: STARTING_COINS,
    guestCoins: STARTING_COINS,
    hostSkipUsed: false,
    guestSkipUsed: false,
    currentMiniGame: null,
    lastWinner: null,
    lastCoinDelta: 0,
    currentForfeit: null,
    forfeitTarget: null,
    currentChallenge: null,
    shopOpen: false,
    pendingAct: null,
    pendingActBuyer: null,
    narratorLine: '',
    seed: Date.now() % 1_000_000,
    usedForfeitIds: [],
    usedChallengeIds: [],
    purchasedIds: [],
    consent: false,
    started: false,
    hostTogether: false,
    guestTogether: false,
    ...partial,
  }
}
