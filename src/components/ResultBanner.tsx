import type { GameState } from '../types'
import { Button } from './ui/Button'

export function ResultBanner({
  state,
  isHost,
  onContinue,
}: {
  state: GameState
  isHost: boolean
  onContinue: () => void
}) {
  const name =
    state.lastWinner === 'host'
      ? state.hostName
      : state.lastWinner === 'guest'
        ? state.guestName
        : null

  return (
    <div className="animate-reveal space-y-5 text-center py-4">
      {state.lastWinner === 'tie' ? (
        <>
          <p className="font-display text-3xl text-gold-soft">It's a tie</p>
          <p className="text-muted">You both earn 🌶️ 5</p>
        </>
      ) : (
        <>
          <p className="font-display text-4xl font-bold text-glow-gold">{name} wins!</p>
          <p className="text-gold-soft text-lg">+🌶️ {state.lastCoinDelta} Spice Coins</p>
          {state.currentForfeit && (
            <p className="text-sm text-rose">
              {(state.forfeitTarget === 'host' ? state.hostName : state.guestName)} owes a forfeit…
            </p>
          )}
        </>
      )}
      {isHost ? (
        <Button variant="primary" className="w-full py-4" onClick={onContinue}>
          {state.currentForfeit ? 'Reveal forfeit' : 'Continue'}
        </Button>
      ) : (
        <p className="text-muted text-sm animate-heartbeat">Waiting for host…</p>
      )}
    </div>
  )
}
