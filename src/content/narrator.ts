import type { Intensity } from '../types'

const ARC: Record<number, string[]> = {
  1: [
    'Two rooms. One ache. The night is just waking up.',
    'Distance is the first tease. Feel it.',
    'You\'re apart — and that\'s the point. Want louder.',
  ],
  2: [
    'The walls feel thinner. Your pulse doesn\'t care about doors.',
    'Still separate. Still starving. Good.',
    'Texts and breath and nothing else — yet.',
  ],
  3: [
    'Last stretch of solitude. Make the wanting unbearable.',
    'One more round apart. Then the orbit pulls tighter.',
    'Desperate rooms. Desperate hands. Almost time.',
  ],
  4: [
    'Hallways exist for a reason. Use them.',
    'Closer now. Doorways. Almost-touching.',
    'The house is shrinking. So is your patience.',
  ],
  5: [
    'Same air. Different skin. Crossing paths on purpose.',
    'Approaching. The gravity is rude and perfect.',
    'You can smell each other. Don\'t rush the ruin.',
  ],
  6: [
    'Threshold energy. One more tease before you collide.',
    'Door frames were invented for pinning people.',
    'Almost together. The tension is doing overtime.',
  ],
  7: [
    'Same room. Same heat. The gloves are off.',
    'Together at last. Make it count.',
    'Bodies in the same space — finally. Filth welcome.',
  ],
  8: [
    'No more pretending you\'re civilized.',
    'Deeper. Louder. Hungrier.',
    'The night owns you both now.',
  ],
  9: [
    'Near the edge of the arc. Leave nothing unsaid. Or undone.',
    'Round nine. Reputation: ruined (consensually).',
    'You know what you want. Take it carefully and completely.',
  ],
  10: [
    'Finale. Spend the coins. Spend yourselves.',
    'Last round of the arc — then free play forever.',
    'End the story the way filthy love stories end: together, wrecked, smiling.',
  ],
}

const HARD_SPICE: Partial<Record<number, string>> = {
  3: 'Hard mode reminder: safewords stay on. Enthusiasm stays louder.',
  6: 'You chose Hard. Deep throat energy is unlocked. Consent still wears the crown.',
  8: 'Anal, spit, rough — only if both of you are grinning about it.',
  10: 'Go as filthy as you paid for. Then aftercare like champions.',
}

export function narratorFor(round: number, intensity: Intensity): string {
  const lines = ARC[round] ?? ARC[1]
  const base = lines[round % lines.length]
  if (intensity === 'hard' && HARD_SPICE[round]) {
    return `${base} ${HARD_SPICE[round]}`
  }
  return base
}
