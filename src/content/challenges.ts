import type { ChallengeCard, Intensity } from '../types'
import { DARE_CHALLENGES } from './darePack'

const BASE_CHALLENGES: ChallengeCard[] = [
  // Rounds 1-3: apart / desperate rooms
  { id: 'c1', title: 'Apartment Ache', description: 'You\'re in different rooms. Text them one filthy thing you\'d do if the door opened right now.', roundMin: 1, roundMax: 3, intensities: ['romantic', 'spicy', 'fire', 'hard'], media: 'text' },
  { id: 'c2', title: 'Voice Across the Wall', description: 'Send a 15-second voice note of your breathing getting heavier — no words required.', roundMin: 1, roundMax: 3, intensities: ['romantic', 'spicy', 'fire', 'hard'], media: 'audio' },
  { id: 'c3', title: 'Doorway Tease Photo', description: 'Photo: just your hand on the doorframe / doorknob, captioned like you\'re about to walk in.', roundMin: 1, roundMax: 3, intensities: ['romantic', 'spicy', 'fire', 'hard'], media: 'photo' },
  { id: 'c4', title: 'Countdown Text', description: 'Text: "I\'m touching myself for 60 seconds thinking of you. Starting now." Then do it.', roundMin: 1, roundMax: 3, intensities: ['spicy', 'fire', 'hard'], media: 'text' },
  { id: 'c5', title: 'Mirror Confession', description: 'Voice note while looking in a mirror: tell them what you look like turned on.', roundMin: 1, roundMax: 3, intensities: ['spicy', 'fire', 'hard'], media: 'audio' },
  { id: 'c6', title: 'Undress Relay', description: 'Each of you removes one item. Send proof photo. Stay apart.', roundMin: 1, roundMax: 3, intensities: ['spicy', 'fire', 'hard'], media: 'photo' },
  { id: 'c7', title: 'Filthy Forecast', description: 'Text a play-by-play of what happens when you\'re finally in the same room tonight.', roundMin: 1, roundMax: 3, intensities: ['fire', 'hard'], media: 'text' },
  { id: 'c8', title: 'Moan Through the Wall', description: 'Make a sound loud enough they might hear through the wall / door. Then text "did you hear that?"', roundMin: 1, roundMax: 3, intensities: ['fire', 'hard'], media: 'audio' },
  { id: 'c9', title: 'Open Legs Photo', description: 'Send a photo from the waist down — suggestive, not shy. Stay in your room.', roundMin: 1, roundMax: 3, intensities: ['fire', 'hard'], media: 'photo' },
  { id: 'c10', title: 'Edge Alone', description: 'Edge yourself once alone. Text them the second you stop. No orgasm.', roundMin: 1, roundMax: 3, intensities: ['hard'], media: 'text' },
  { id: 'c11', title: 'Spit Selfie', description: 'Photo: spit on your fingers or chest. Caption it for them.', roundMin: 1, roundMax: 3, intensities: ['hard'], media: 'photo' },
  { id: 'c12', title: 'Begging Voicemail', description: '60-second voice note begging them to come find you and use you. Absolute filth.', roundMin: 1, roundMax: 3, intensities: ['hard'], media: 'audio' },

  // Rounds 4-6: approaching
  { id: 'c13', title: 'Hallway Heat', description: 'Meet in the hallway. Kiss for 30 seconds. No hands below the waist. Return to positions.', roundMin: 4, roundMax: 6, intensities: ['romantic', 'spicy', 'fire', 'hard'], media: 'touch' },
  { id: 'c14', title: 'Doorway Grind', description: 'In a doorway: press together and grind for 45 seconds. Clothes on.', roundMin: 4, roundMax: 6, intensities: ['spicy', 'fire', 'hard'], media: 'touch' },
  { id: 'c15', title: 'Same Room, No Touch', description: 'Sit in the same room. Eye contact only for 60 seconds. First to look away owes a kiss.', roundMin: 4, roundMax: 6, intensities: ['romantic', 'spicy', 'fire', 'hard'], media: 'touch' },
  { id: 'c16', title: 'Strip in the Door', description: 'Stand in the doorway and remove one piece while they watch from inside.', roundMin: 4, roundMax: 6, intensities: ['spicy', 'fire', 'hard'], media: 'touch' },
  { id: 'c17', title: 'Wall Pin', description: 'Pin them gently to the wall. Whisper something filthy. Walk away.', roundMin: 4, roundMax: 6, intensities: ['spicy', 'fire', 'hard'], media: 'touch' },
  { id: 'c18', title: 'Hand Down Pants', description: 'In the hallway or doorway: hand down their pants / under clothes for 30 seconds. Then stop.', roundMin: 4, roundMax: 6, intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'c19', title: 'Kneel at the Threshold', description: 'Kneel in the doorway. They stand over you. Eye contact. 30 seconds. Then stand.', roundMin: 4, roundMax: 6, intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'c20', title: 'Mouth Preview', description: 'Drop to your knees in the hallway and mouth them over clothes for 20 seconds.', roundMin: 4, roundMax: 6, intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'c21', title: 'Spit Trade', description: 'Meet mid-home. Spit into each other\'s mouths. Kiss. Separate again.', roundMin: 4, roundMax: 6, intensities: ['hard'], media: 'touch' },
  { id: 'c22', title: 'Ass Grab Claim', description: 'Grab their ass hard in the hallway, pull them against you, say "mine," release.', roundMin: 4, roundMax: 6, intensities: ['hard'], media: 'touch' },
  { id: 'c23', title: 'Finger Taste', description: 'Touch yourself, then put wet fingers in their mouth in the doorway.', roundMin: 4, roundMax: 6, intensities: ['hard'], media: 'touch' },
  { id: 'c24', title: 'Rough Doorway Kiss', description: 'Kiss like you\'re starving — biting, hair pulling, light choke if agreed — 45 seconds.', roundMin: 4, roundMax: 6, intensities: ['hard'], media: 'touch' },

  // Rounds 7-10: together + filthy
  { id: 'c25', title: 'Finally Together', description: 'Get in the same bed / couch. Full body press for 2 minutes. Kiss wherever you want.', roundMin: 7, roundMax: 10, intensities: ['romantic', 'spicy', 'fire', 'hard'], media: 'touch' },
  { id: 'c26', title: 'Undress Each Other', description: 'Remove each other\'s remaining clothes. Slowly. No rushing to genitals yet.', roundMin: 7, roundMax: 10, intensities: ['romantic', 'spicy', 'fire', 'hard'], media: 'touch' },
  { id: 'c27', title: 'Mutual Oral Minute', description: '69 or take turns — both get oral for at least 60 seconds.', roundMin: 7, roundMax: 10, intensities: ['spicy', 'fire', 'hard'], media: 'touch' },
  { id: 'c28', title: 'Position Roulette', description: 'Loser of a coin flip (or the guest) picks the sex position. Do it for 3 minutes.', roundMin: 7, roundMax: 10, intensities: ['spicy', 'fire', 'hard'], media: 'touch' },
  { id: 'c29', title: 'Eye Contact Fuck', description: 'Penetrative or grinding sex with mandatory eye contact for 2 minutes.', roundMin: 7, roundMax: 10, intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'c30', title: 'Orgasm Race', description: 'Try to make the other cum first with hand or mouth. 5 minute cap. Winner brags.', roundMin: 7, roundMax: 10, intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'c31', title: 'Deep & Filthy', description: 'Oral as deep as safe + filthy praise the whole time. 3 minutes.', roundMin: 7, roundMax: 10, intensities: ['hard'], media: 'touch' },
  { id: 'c32', title: 'Anal Warmup Night', description: 'Lots of lube. Anal fingering or play for 3 minutes with constant check-ins.', roundMin: 7, roundMax: 10, intensities: ['hard'], media: 'touch' },
  { id: 'c33', title: 'Face Fuck Soft', description: 'Consensual face-fucking at a pace the receiver sets with taps. 90 seconds.', roundMin: 7, roundMax: 10, intensities: ['hard'], media: 'touch' },
  { id: 'c34', title: 'Prone Bone Prayer', description: 'Prone bone or similar. Slow then hard. Dirty talk required. 4 minutes.', roundMin: 7, roundMax: 10, intensities: ['hard'], media: 'touch' },
  { id: 'c35', title: 'Cum Wherever', description: 'Agree on a finish spot (chest, mouth, inside, etc.) and make it happen together.', roundMin: 7, roundMax: 10, intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'c36', title: 'Aftercare Kiss', description: 'Whatever filth just happened — now hold each other and kiss soft for 2 minutes. Water optional.', roundMin: 7, roundMax: 10, intensities: ['romantic', 'spicy', 'fire', 'hard'], media: 'touch' },
]

export const CHALLENGES: ChallengeCard[] = [...BASE_CHALLENGES, ...DARE_CHALLENGES]

export function pickChallenge(
  intensity: Intensity,
  round: number,
  used: string[],
  seed: number,
): ChallengeCard {
  let pool = CHALLENGES.filter(
    (c) =>
      c.intensities.includes(intensity) &&
      round >= c.roundMin &&
      round <= c.roundMax &&
      !used.includes(c.id),
  )
  if (pool.length === 0) {
    pool = CHALLENGES.filter(
      (c) =>
        c.intensities.includes(intensity) &&
        round >= c.roundMin &&
        round <= c.roundMax,
    )
  }
  if (pool.length === 0) {
    pool = CHALLENGES.filter((c) => c.intensities.includes(intensity))
  }
  return pool[Math.abs(seed) % pool.length]
}
