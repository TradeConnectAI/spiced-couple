import type { Intensity, MediaBadge } from '../types'

export type ApartPhase =
  | 'waiting'
  | 'intro'
  | 'quiz-set'
  | 'quiz-guess'
  | 'quiz-judge'
  | 'quiz-reveal'
  | 'forfeit'
  | 'quest'
  | 'paused'
  | 'ended'

export type QuizKind = 'asker-sets' | 'fixed' | 'partner-judges'

/** host = male (Steve), guest = female (Laura) by default naming */
export type GenderedTarget = 'male' | 'female'

export interface ApartQuizQuestion {
  id: string
  kind: QuizKind
  /** Use {asker} and {answerer} placeholders */
  prompt: string
  options: string[]
  /** Only for kind === 'fixed' */
  correctIndex?: number
  intensities: Intensity[]
}

export interface ApartForfeitCard {
  id: string
  title: string
  description: string
  target: GenderedTarget
  media: MediaBadge
  intensities: Intensity[]
}

export interface ApartQuestCard {
  id: string
  title: string
  description: string
  media: MediaBadge
  intensities: Intensity[]
  /** Who performs — usually both or the one who got it right assigns */
  who: 'answerer' | 'asker' | 'both' | 'either'
}

export interface ApartState {
  phase: ApartPhase
  intensity: Intensity
  round: number
  totalRounds: number
  hostName: string
  guestName: string
  hostCoins: number
  guestCoins: number
  hostSkipUsed: boolean
  guestSkipUsed: boolean
  asker: 'host' | 'guest'
  answerer: 'host' | 'guest'
  roundKind: 'quiz' | 'quest'
  currentQuestion: ApartQuizQuestion | null
  /** Asker's secretly chosen correct option index (asker-sets) */
  secretCorrectIndex: number | null
  guessIndex: number | null
  lastCorrect: boolean | null
  currentForfeit: ApartForfeitCard | null
  forfeitTarget: 'host' | 'guest' | null
  currentQuest: ApartQuestCard | null
  questTarget: 'host' | 'guest' | 'both' | null
  usedQuestionIds: string[]
  usedForfeitIds: string[]
  usedQuestIds: string[]
  narratorLine: string
  seed: number
  consent: boolean
  started: boolean
}

export const APART_STARTING_COINS = 40
export const APART_TOTAL_ROUNDS = 12
export const APART_RIGHT_COINS = 10
export const APART_QUEST_COINS = 6

export function emptyApartState(partial?: Partial<ApartState>): ApartState {
  return {
    phase: 'waiting',
    intensity: 'spicy',
    round: 1,
    totalRounds: APART_TOTAL_ROUNDS,
    hostName: 'Steve',
    guestName: 'Laura',
    hostCoins: APART_STARTING_COINS,
    guestCoins: APART_STARTING_COINS,
    hostSkipUsed: false,
    guestSkipUsed: false,
    asker: 'host',
    answerer: 'guest',
    roundKind: 'quiz',
    currentQuestion: null,
    secretCorrectIndex: null,
    guessIndex: null,
    lastCorrect: null,
    currentForfeit: null,
    forfeitTarget: null,
    currentQuest: null,
    questTarget: null,
    usedQuestionIds: [],
    usedForfeitIds: [],
    usedQuestIds: [],
    narratorLine: '',
    seed: Date.now() % 1_000_000,
    consent: false,
    started: false,
    ...partial,
  }
}

export function fillNames(text: string, asker: string, answerer: string): string {
  return text.replaceAll('{asker}', asker).replaceAll('{answerer}', answerer)
}
