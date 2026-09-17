import { pickApartForfeit } from './content/forfeits'
import { pickApartQuiz } from './content/quizzes'
import { pickApartQuest } from './content/quests'
import type { ApartState } from './types'
import {
  APART_QUEST_COINS,
  APART_RIGHT_COINS,
  APART_STARTING_COINS,
  APART_TOTAL_ROUNDS,
  emptyApartState,
} from './types'

/** Every 3rd round is a quest; others are quizzes. */
export function roundKindFor(round: number): 'quiz' | 'quest' {
  return round % 3 === 0 ? 'quest' : 'quiz'
}

export function startApartSession(state: ApartState): ApartState {
  const asker: 'host' | 'guest' = 'host'
  const answerer: 'host' | 'guest' = 'guest'
  const kind = roundKindFor(1)
  return beginRound({
    ...state,
    started: true,
    round: 1,
    hostCoins: APART_STARTING_COINS,
    guestCoins: APART_STARTING_COINS,
    hostSkipUsed: false,
    guestSkipUsed: false,
    usedQuestionIds: [],
    usedForfeitIds: [],
    usedQuestIds: [],
    asker,
    answerer,
    roundKind: kind,
    secretCorrectIndex: null,
    guessIndex: null,
    lastCorrect: null,
    currentForfeit: null,
    forfeitTarget: null,
    currentQuest: null,
    questTarget: null,
  })
}

export function beginRound(state: ApartState): ApartState {
  const kind = roundKindFor(state.round)
  const askerName = state.asker === 'host' ? state.hostName : state.guestName
  const answererName = state.answerer === 'host' ? state.hostName : state.guestName

  if (kind === 'quest') {
    const quest = pickApartQuest(
      state.intensity,
      state.usedQuestIds,
      state.seed + state.round * 41,
    )
    return {
      ...state,
      roundKind: 'quest',
      phase: 'intro',
      currentQuest: quest,
      questTarget: 'both',
      currentQuestion: null,
      secretCorrectIndex: null,
      guessIndex: null,
      lastCorrect: null,
      currentForfeit: null,
      forfeitTarget: null,
      usedQuestIds: [...state.usedQuestIds, quest.id],
      narratorLine: `Quest round — stay apart. ${askerName} & ${answererName}: complete the dare via your own messages.`,
    }
  }

  const question = pickApartQuiz(
    state.intensity,
    state.usedQuestionIds,
    state.seed + state.round * 37,
  )
  return {
    ...state,
    roundKind: 'quiz',
    phase: 'intro',
    currentQuestion: question,
    secretCorrectIndex: question.kind === 'fixed' ? (question.correctIndex ?? 0) : null,
    guessIndex: null,
    lastCorrect: null,
    currentForfeit: null,
    forfeitTarget: null,
    currentQuest: null,
    questTarget: null,
    usedQuestionIds: [...state.usedQuestionIds, question.id],
    narratorLine:
      question.kind === 'asker-sets'
        ? `${askerName} sets the secret answer. ${answererName} tries to guess.`
        : question.kind === 'partner-judges'
          ? `${answererName} answers. ${askerName} judges right or wrong.`
          : `${answererName} answers the filthy trivia. Wrong = forfeit.`,
  }
}

/** From intro → actual quiz/quest phase */
export function continueApartIntro(state: ApartState): ApartState {
  if (state.roundKind === 'quest') {
    return { ...state, phase: 'quest' }
  }
  const q = state.currentQuestion
  if (!q) return advanceApartRound(state)
  if (q.kind === 'asker-sets') return { ...state, phase: 'quiz-set' }
  return { ...state, phase: 'quiz-guess' }
}

export function setSecretAnswer(state: ApartState, index: number): ApartState {
  if (state.phase !== 'quiz-set') return state
  return {
    ...state,
    secretCorrectIndex: index,
    phase: 'quiz-guess',
  }
}

export function submitGuess(state: ApartState, index: number): ApartState {
  if (state.phase !== 'quiz-guess') return state
  const q = state.currentQuestion
  if (!q) return state

  if (q.kind === 'partner-judges') {
    return {
      ...state,
      guessIndex: index,
      phase: 'quiz-judge',
    }
  }

  const correctIdx =
    q.kind === 'fixed' ? (q.correctIndex ?? 0) : (state.secretCorrectIndex ?? 0)
  const correct = index === correctIdx
  return applyQuizResult({ ...state, guessIndex: index }, correct)
}

export function judgeGuess(state: ApartState, correct: boolean): ApartState {
  if (state.phase !== 'quiz-judge') return state
  return applyQuizResult(state, correct)
}

function applyQuizResult(state: ApartState, correct: boolean): ApartState {
  let s: ApartState = {
    ...state,
    lastCorrect: correct,
    phase: 'quiz-reveal',
  }
  if (correct) {
    if (s.answerer === 'host') s.hostCoins += APART_RIGHT_COINS
    else s.guestCoins += APART_RIGHT_COINS
    // Mild reward: asker also gets a small drip
    if (s.asker === 'host') s.hostCoins += 3
    else s.guestCoins += 3
  } else {
    const target = s.answerer
    const gender = target === 'host' ? 'male' : 'female'
    const forfeit = pickApartForfeit(
      s.intensity,
      gender,
      s.usedForfeitIds,
      s.seed + s.round * 53,
    )
    s.currentForfeit = forfeit
    s.forfeitTarget = target
    s.usedForfeitIds = [...s.usedForfeitIds, forfeit.id]
  }
  return s
}

export function continueFromReveal(state: ApartState): ApartState {
  if (state.lastCorrect === false && state.currentForfeit) {
    return { ...state, phase: 'forfeit' }
  }
  // Right answer: optionally assign a mild quest to the asker (light)
  if (state.lastCorrect === true && state.round % 4 === 0) {
    const quest = pickApartQuest(
      state.intensity,
      state.usedQuestIds,
      state.seed + state.round * 71,
    )
    return {
      ...state,
      phase: 'quest',
      roundKind: 'quest',
      currentQuest: quest,
      questTarget: state.asker,
      usedQuestIds: [...state.usedQuestIds, quest.id],
      narratorLine: `Nice guess — ${state.asker === 'host' ? state.hostName : state.guestName} gets a mild quest.`,
    }
  }
  return advanceApartRound(state)
}

export function completeApartForfeit(state: ApartState): ApartState {
  return advanceApartRound({
    ...state,
    currentForfeit: null,
    forfeitTarget: null,
  })
}

export function skipApartForfeit(state: ApartState, who: 'host' | 'guest'): ApartState | null {
  if (who === 'host' && state.hostSkipUsed) return null
  if (who === 'guest' && state.guestSkipUsed) return null
  return advanceApartRound({
    ...state,
    currentForfeit: null,
    forfeitTarget: null,
    hostSkipUsed: who === 'host' ? true : state.hostSkipUsed,
    guestSkipUsed: who === 'guest' ? true : state.guestSkipUsed,
  })
}

export function completeApartQuest(state: ApartState): ApartState {
  let s = { ...state }
  s.hostCoins += APART_QUEST_COINS
  s.guestCoins += APART_QUEST_COINS
  s.currentQuest = null
  s.questTarget = null
  return advanceApartRound(s)
}

export function advanceApartRound(state: ApartState): ApartState {
  if (state.round >= APART_TOTAL_ROUNDS) {
    return {
      ...state,
      phase: 'ended',
      narratorLine:
        'Apart Night complete. Stay filthy. Meetup whenever you want — or play again.',
      currentQuestion: null,
      currentForfeit: null,
      currentQuest: null,
    }
  }
  const round = state.round + 1
  // Alternate who asks each quiz round
  const asker: 'host' | 'guest' = round % 2 === 1 ? 'host' : 'guest'
  const answerer: 'host' | 'guest' = asker === 'host' ? 'guest' : 'host'
  return beginRound({
    ...state,
    round,
    seed: state.seed + round * 99,
    asker,
    answerer,
  })
}

export function resetApart(partial?: Partial<ApartState>): ApartState {
  return emptyApartState(partial)
}
