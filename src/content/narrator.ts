import type { Intensity } from '../types'
import { arcPhaseForRound } from '../types'

const ARC: Record<number, string[]> = {
  // —— Talk (apart, rounds 1–3) ——
  1: [
    'Two rooms. One ache. Start with words — filthy, curious, hungry.',
    'Distance is the first tease. Ask what turns them on. Mean it.',
    'You\'re apart — and that\'s the point. Talk dirty. Want louder.',
  ],
  2: [
    'Still separate. Still starving. Keep the Q&A filthy.',
    'Texts and breath and nothing else — yet. Make them confess.',
    'The walls feel thinner when you ask the right questions.',
  ],
  3: [
    'Last stretch of naughty talk. Make the wanting unbearable.',
    'One more round of filthy conversation. Then the photos begin.',
    'Desperate rooms. Desperate answers. Almost time to show, not tell.',
  ],
  // —— Photos (apart, rounds 4–5) ——
  4: [
    'Words aren\'t enough anymore. Show them. Photo dares — send via your own messages.',
    'Still apart. The camera is the tease. No uploads here — just instructions.',
    'Prove the ache. Snap it. Send it yourselves. Stay in your rooms.',
  ],
  5: [
    'One more photo stretch. Make them need the real thing.',
    'Lens only. Hands off each other. Hunger on full display.',
    'Last still frames before the clips. Stay apart. Stay starving.',
  ],
  // —— Clips (apart, rounds 6–7) ——
  6: [
    'Short clips now — 5 to 15 seconds. Motion is a promise.',
    'Still apart. A few filthy seconds on video. Send it yourselves.',
    'Moving pictures. Moving blood. The meetup is coming.',
  ],
  7: [
    'Last apart round. Make the clip so good they walk to you.',
    'One more short film of wanting. Then: same room. No excuses.',
    'Final stretch of solitude. After this — you go find each other.',
  ],
  // —— Filth (together, rounds 8–10) ——
  8: [
    'Same room. Same heat. Mini-games, coins, Act Shop — gloves off.',
    'Together at last. Compete. Forfeit. Buy acts. Filth welcome.',
    'Bodies in the same space — finally. Earn Spice Coins. Spend them.',
  ],
  9: [
    'No more pretending you\'re civilized. Deeper. Louder. Hungrier.',
    'Round nine. Shop open. Forfeits real. Reputation: ruined (consensually).',
    'You know what you want. Win it. Buy it. Take it carefully and completely.',
  ],
  10: [
    'Finale. Spend the coins. Spend yourselves.',
    'Last round of the arc — then free play forever.',
    'End the story the way filthy love stories end: together, wrecked, smiling.',
  ],
}

const HARD_SPICE: Partial<Record<number, string>> = {
  3: 'Hard mode reminder: safewords stay on. Enthusiasm stays louder.',
  7: 'You chose Hard. After meetup, deep throat energy unlocks. Consent still wears the crown.',
  8: 'Anal, spit, rough — only if both of you are grinning about it.',
  10: 'Go as filthy as you paid for. Then aftercare like champions.',
}

const PHASE_LABEL: Record<string, string> = {
  talk: 'Apart · Naughty talk',
  photo: 'Apart · Photos',
  clip: 'Apart · Short clips',
  meetup: 'Meetup',
  filth: 'Together · Games & filth',
}

export function arcLabelForRound(round: number): string {
  return PHASE_LABEL[arcPhaseForRound(round)] ?? PHASE_LABEL.talk
}

export function narratorFor(round: number, intensity: Intensity): string {
  const lines = ARC[round] ?? ARC[1]
  const base = lines[round % lines.length]
  if (intensity === 'hard' && HARD_SPICE[round]) {
    return `${base} ${HARD_SPICE[round]}`
  }
  return base
}
