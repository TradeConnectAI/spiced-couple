import { pickForfeit } from '../content/forfeits'
import { pickChallenge } from '../content/challenges'
import { narratorFor } from '../content/narrator'
import type { GameState, MiniGameKind, ShopItem } from '../types'
import { TOTAL_ROUNDS, arcPhaseForRound } from '../types'

const GAMES: MiniGameKind[] = ['dobble', 'cardwar', 'reaction', 'hotpotato']

/** Small coin drip during apart challenges so the Act Shop has fuel later. */
const APART_CHALLENGE_COINS = 8

export function nextMiniGame(round: number, seed: number): MiniGameKind {
  return GAMES[(round + seed) % GAMES.length]
}

export function applyWin(
  state: GameState,
  winner: 'host' | 'guest' | 'tie',
  coinReward = 12,
): GameState {
  const s = { ...state, lastWinner: winner, lastCoinDelta: 0 }
  if (winner === 'tie') {
    s.phase = 'result'
    s.lastCoinDelta = 5
    s.hostCoins += 5
    s.guestCoins += 5
    return s
  }
  const loser = winner === 'host' ? 'guest' : 'host'
  s.phase = 'result'
  s.lastCoinDelta = coinReward
  if (winner === 'host') s.hostCoins += coinReward
  else s.guestCoins += coinReward

  const forfeit = pickForfeit(s.intensity, s.usedForfeitIds, s.seed + s.round * 17)
  s.currentForfeit = forfeit
  s.forfeitTarget = loser
  s.usedForfeitIds = [...s.usedForfeitIds, forfeit.id]
  return s
}

export function goToForfeit(state: GameState): GameState {
  if (!state.currentForfeit) return goToShopOrChallenge(state)
  return { ...state, phase: 'forfeit' }
}

export function completeForfeit(state: GameState): GameState {
  return goToShopOrChallenge({ ...state, currentForfeit: null, forfeitTarget: null })
}

export function skipForfeit(state: GameState, who: 'host' | 'guest'): GameState | null {
  if (who === 'host' && state.hostSkipUsed) return null
  if (who === 'guest' && state.guestSkipUsed) return null
  const next = {
    ...state,
    currentForfeit: null,
    forfeitTarget: null,
    hostSkipUsed: who === 'host' ? true : state.hostSkipUsed,
    guestSkipUsed: who === 'guest' ? true : state.guestSkipUsed,
  }
  return goToShopOrChallenge(next)
}

/** Act Shop is locked until filth phase. */
export function goToShopOrChallenge(state: GameState): GameState {
  if (state.arcPhase !== 'filth') {
    return startChallenge(state)
  }
  return { ...state, phase: 'shop', shopOpen: true, pendingAct: null, pendingActBuyer: null }
}

export function buyAct(
  state: GameState,
  item: ShopItem,
  buyer: 'host' | 'guest',
): GameState | { error: string } {
  if (state.arcPhase !== 'filth') return { error: 'Act Shop unlocks after you meet up' }
  const bal = buyer === 'host' ? state.hostCoins : state.guestCoins
  if (bal < item.price) return { error: 'Not enough Spice Coins' }
  const next = { ...state }
  if (buyer === 'host') next.hostCoins -= item.price
  else next.guestCoins -= item.price
  next.pendingAct = item
  next.pendingActBuyer = buyer
  next.purchasedIds = [...next.purchasedIds, item.id]
  return next
}

export function clearPendingAct(state: GameState): GameState {
  return { ...state, pendingAct: null, pendingActBuyer: null }
}

export function startChallenge(state: GameState): GameState {
  const challenge = pickChallenge(
    state.intensity,
    state.round,
    state.usedChallengeIds,
    state.seed + state.round * 31,
  )
  return {
    ...state,
    phase: 'challenge',
    shopOpen: false,
    currentChallenge: challenge,
    usedChallengeIds: [...state.usedChallengeIds, challenge.id],
  }
}

/** After a challenge: drip coins in apart phases, then advance or open meetup. */
export function completeChallenge(state: GameState): GameState {
  let s = { ...state }
  if (s.arcPhase === 'talk' || s.arcPhase === 'photo' || s.arcPhase === 'clip') {
    s.hostCoins += APART_CHALLENGE_COINS
    s.guestCoins += APART_CHALLENGE_COINS
    s.lastCoinDelta = APART_CHALLENGE_COINS
  }

  // Finished last clip round → meetup gate before filth
  if (s.round === 7 && s.arcPhase === 'clip') {
    return {
      ...s,
      phase: 'meetup',
      arcPhase: 'meetup',
      hostTogether: false,
      guestTogether: false,
      currentChallenge: null,
      currentMiniGame: null,
      narratorLine: 'Go to the same room now. The teasing ends when you\'re face to face.',
    }
  }

  return advanceRound(s)
}

export function markTogether(
  state: GameState,
  who: 'host' | 'guest',
  solo = false,
): GameState {
  const next = {
    ...state,
    hostTogether: who === 'host' || solo ? true : state.hostTogether,
    guestTogether: who === 'guest' || solo ? true : state.guestTogether,
  }
  if (solo) {
    next.hostTogether = true
    next.guestTogether = true
  }
  if (next.hostTogether && next.guestTogether) {
    return enterFilth(next)
  }
  return next
}

export function enterFilth(state: GameState): GameState {
  const round = 8
  return {
    ...state,
    round,
    arcPhase: 'filth',
    phase: 'narrator',
    seed: state.seed + round * 99,
    narratorLine: narratorFor(round, state.intensity),
    currentMiniGame: null,
    currentChallenge: null,
    currentForfeit: null,
    forfeitTarget: null,
    lastWinner: null,
    shopOpen: false,
    pendingAct: null,
    hostTogether: true,
    guestTogether: true,
  }
}

export function advanceRound(state: GameState): GameState {
  if (state.round >= TOTAL_ROUNDS) {
    return {
      ...state,
      phase: 'ended',
      narratorLine:
        'Arc complete. Free shop & play whenever you want — or start a new night.',
      currentMiniGame: null,
      currentChallenge: null,
    }
  }
  const round = state.round + 1
  const seed = state.seed + round * 99
  const arcPhase = arcPhaseForRound(round)
  return {
    ...state,
    round,
    seed,
    arcPhase,
    phase: 'narrator',
    narratorLine: narratorFor(round, state.intensity),
    currentMiniGame: null,
    currentChallenge: null,
    currentForfeit: null,
    forfeitTarget: null,
    lastWinner: null,
    shopOpen: false,
    pendingAct: null,
  }
}

export function beginMiniGame(state: GameState): GameState {
  if (state.arcPhase !== 'filth') {
    // Safety: never start mini-games before filth
    return startChallenge(state)
  }
  const game = nextMiniGame(state.round, state.seed)
  return {
    ...state,
    phase: 'minigame',
    currentMiniGame: game,
    lastWinner: null,
  }
}

/** From narrator: apart → challenge; filth → mini-game. */
export function continueFromNarrator(state: GameState): GameState {
  if (state.arcPhase === 'filth') return beginMiniGame(state)
  return startChallenge(state)
}

export function startSession(state: GameState): GameState {
  return {
    ...state,
    started: true,
    round: 1,
    arcPhase: 'talk',
    phase: 'narrator',
    narratorLine: narratorFor(1, state.intensity),
    hostCoins: 50,
    guestCoins: 50,
    hostTogether: false,
    guestTogether: false,
  }
}
