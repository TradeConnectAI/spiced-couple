import type { ApartState } from '../types'
import { fillNames } from '../types'
import { Button } from '../../components/ui/Button'
import { sfx } from '../../lib/audio'

const LETTERS = ['A', 'B', 'C', 'D']

export function ApartQuiz({
  state,
  myRole,
  solo,
  onSetSecret,
  onGuess,
  onJudge,
  onContinueReveal,
}: {
  state: ApartState
  myRole: 'host' | 'guest'
  solo: boolean
  onSetSecret: (index: number) => void
  onGuess: (index: number) => void
  onJudge: (correct: boolean) => void
  onContinueReveal: () => void
}) {
  const q = state.currentQuestion
  if (!q) return null

  const askerName = state.asker === 'host' ? state.hostName : state.guestName
  const answererName = state.answerer === 'host' ? state.hostName : state.guestName
  const prompt = fillNames(q.prompt, askerName, answererName)
  const iAmAsker = myRole === state.asker || solo
  const iAmAnswerer = myRole === state.answerer || solo

  if (state.phase === 'quiz-set') {
    return (
      <div className="animate-reveal space-y-5">
        <div className="text-center space-y-1">
          <p className="text-xs uppercase tracking-[0.25em] text-rose">Secret answer</p>
          <p className="text-sm text-muted">
            Only {askerName} picks the real answer — {answererName} mustn’t peek.
          </p>
        </div>
        <div className="rounded-3xl border border-gold/35 bg-ink-card p-5">
          <h3 className="font-display text-center text-2xl text-cream leading-snug">{prompt}</h3>
        </div>
        {iAmAsker ? (
          <div className="space-y-2">
            <p className="text-center text-xs text-gold-soft">Tap the correct answer secretly</p>
            {q.options.map((opt, i) => (
              <Button
                key={i}
                variant="soft"
                className="w-full text-left justify-start"
                onClick={() => {
                  sfx.tap()
                  onSetSecret(i)
                }}
              >
                <span className="text-gold-soft font-mono mr-2">{LETTERS[i]}.</span> {opt}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted text-sm animate-heartbeat">
            Waiting for {askerName} to lock the secret answer…
          </p>
        )}
      </div>
    )
  }

  if (state.phase === 'quiz-guess') {
    return (
      <div className="animate-reveal space-y-5">
        <div className="text-center space-y-1">
          <p className="text-xs uppercase tracking-[0.25em] text-gold/80">
            {q.kind === 'partner-judges' ? 'Partner judges' : 'Guess'}
          </p>
          <p className="text-sm text-muted">{answererName} answers</p>
        </div>
        <div className="rounded-3xl border border-crimson/40 bg-ink-card p-5 glow-crimson">
          <h3 className="font-display text-center text-2xl text-cream leading-snug">{prompt}</h3>
        </div>
        {iAmAnswerer ? (
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <Button
                key={i}
                variant="primary"
                className="w-full text-left justify-start"
                onClick={() => onGuess(i)}
              >
                <span className="text-gold-soft font-mono mr-2">{LETTERS[i]}.</span> {opt}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted text-sm animate-heartbeat">
            Waiting for {answererName} to answer…
          </p>
        )}
      </div>
    )
  }

  if (state.phase === 'quiz-judge') {
    return (
      <div className="animate-reveal space-y-5">
        <div className="rounded-3xl border border-gold/35 bg-ink-card p-5 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold/80 mb-2">Judge</p>
          <h3 className="font-display text-2xl text-cream">{prompt}</h3>
          <p className="mt-4 text-cream/90">
            {answererName} picked:{' '}
            <span className="text-gold-soft font-semibold">
              {state.guessIndex != null ? q.options[state.guessIndex] : '—'}
            </span>
          </p>
        </div>
        {iAmAsker ? (
          <div className="grid grid-cols-2 gap-3">
            <Button variant="gold" className="w-full py-4" onClick={() => onJudge(true)}>
              Right ✓
            </Button>
            <Button variant="danger" className="w-full py-4" onClick={() => onJudge(false)}>
              Wrong → forfeit
            </Button>
          </div>
        ) : (
          <p className="text-center text-muted text-sm animate-heartbeat">
            {askerName} is judging…
          </p>
        )}
      </div>
    )
  }

  if (state.phase === 'quiz-reveal') {
    const correct = state.lastCorrect
    const correctIdx = state.secretCorrectIndex
    return (
      <div className="animate-reveal space-y-5 text-center">
        <div
          className={`rounded-3xl border p-6 ${
            correct
              ? 'border-gold/50 bg-gold/10 glow-gold'
              : 'border-crimson/50 bg-blood/30 glow-crimson'
          }`}
        >
          <p className="text-xs uppercase tracking-[0.3em] mb-2">
            {correct ? 'Correct' : 'Wrong'}
          </p>
          <h3 className="font-display text-4xl font-bold text-cream">
            {correct ? '🔥 Nailed it' : '😈 Forfeit time'}
          </h3>
          <p className="mt-3 text-sm text-muted">
            {answererName} chose:{' '}
            <span className="text-cream">
              {state.guessIndex != null ? q.options[state.guessIndex] : '—'}
            </span>
          </p>
          {correctIdx != null && q.kind !== 'partner-judges' && (
            <p className="mt-1 text-sm text-gold-soft">
              Answer: {q.options[correctIdx]}
            </p>
          )}
          {correct && (
            <p className="mt-3 text-gold-soft text-sm">+{10} Spice Coins to {answererName}</p>
          )}
        </div>
        {(myRole === 'host' || solo) && (
          <Button variant="gold" className="w-full py-4" onClick={onContinueReveal}>
            {correct ? 'Continue' : 'See the forfeit'}
          </Button>
        )}
        {myRole === 'guest' && !solo && (
          <p className="text-muted text-sm animate-heartbeat">Host continuing…</p>
        )}
      </div>
    )
  }

  return null
}
