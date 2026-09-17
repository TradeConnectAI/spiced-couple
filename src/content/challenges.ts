import type { ChallengeCard, Intensity } from '../types'
import { DARE_CHALLENGES } from './darePack'

/**
 * Round map:
 * 1–3 talk (text/audio) · 4–5 photo · 6–7 clip (video) · 8–10 filth (touch)
 * Media is never uploaded by the app — players send via their own messages.
 */
const BASE_CHALLENGES: ChallengeCard[] = [
  // —— Talk / Q&A (apart) ——
  {
    id: 't1',
    title: 'What Turns You On',
    description:
      'Text them three things that turn you on about them — be specific, be filthy. They reply with three of theirs.',
    roundMin: 1,
    roundMax: 3,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
    media: 'text',
  },
  {
    id: 't2',
    title: 'Voice Confession',
    description:
      'Send a 20–40 second voice note answering: "What do you want me to do to you tonight?" No filters.',
    roundMin: 1,
    roundMax: 3,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
    media: 'audio',
  },
  {
    id: 't3',
    title: 'Filthy Q&A',
    description:
      'Text them one dirty question. They must answer in detail, then ask you one back. Two rounds minimum.',
    roundMin: 1,
    roundMax: 3,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
    media: 'text',
  },
  {
    id: 't4',
    title: 'Breath Across the Wall',
    description:
      'Send a voice note of your breathing getting heavier — whisper their name once at the end.',
    roundMin: 1,
    roundMax: 3,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
    media: 'audio',
  },
  {
    id: 't5',
    title: 'Fantasy Forecast',
    description:
      'Text a play-by-play of what happens the second you\'re in the same room. Leave nothing vague.',
    roundMin: 1,
    roundMax: 3,
    intensities: ['spicy', 'fire', 'hard'],
    media: 'text',
  },
  {
    id: 't6',
    title: 'Turn-On Interrogation',
    description:
      'Voice note: ask them "harder, slower, or dirtier?" — then tell them your answer with a moan.',
    roundMin: 1,
    roundMax: 3,
    intensities: ['spicy', 'fire', 'hard'],
    media: 'audio',
  },
  {
    id: 't7',
    title: 'Forbidden Wish',
    description:
      'Text the filthiest thing you\'ve wanted to try with them but haven\'t said out loud until now.',
    roundMin: 1,
    roundMax: 3,
    intensities: ['fire', 'hard'],
    media: 'text',
  },
  {
    id: 't8',
    title: 'Begging Voicemail',
    description:
      '60-second voice note begging them to come find you and use you. Absolute filth. Stay in your room.',
    roundMin: 1,
    roundMax: 3,
    intensities: ['hard'],
    media: 'audio',
  },
  {
    id: 't9',
    title: 'Edge Alone, Report',
    description:
      'Edge yourself once alone. Text them the second you stop — describe how close you got. No orgasm.',
    roundMin: 1,
    roundMax: 3,
    intensities: ['hard'],
    media: 'text',
  },
  {
    id: 't10',
    title: 'Mirror Dirty Talk',
    description:
      'Voice note while looking in a mirror: tell them exactly what you look like turned on right now.',
    roundMin: 1,
    roundMax: 3,
    intensities: ['spicy', 'fire', 'hard'],
    media: 'audio',
  },

  // —— Photos (apart) ——
  {
    id: 'p1',
    title: 'Doorway Tease',
    description:
      'Photo dare: hand on the doorframe / doorknob, captioned like you\'re about to walk in. Send via your own messages — the app never uploads.',
    roundMin: 4,
    roundMax: 5,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
    media: 'photo',
  },
  {
    id: 'p2',
    title: 'Undress Relay Still',
    description:
      'Each of you removes one item. Send a proof photo. Stay apart. Exchange via your own chat.',
    roundMin: 4,
    roundMax: 5,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
    media: 'photo',
  },
  {
    id: 'p3',
    title: 'Wanting Face',
    description:
      'Send a photo of your face looking exactly how you feel — hungry, flushed, impatient. Caption optional.',
    roundMin: 4,
    roundMax: 5,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
    media: 'photo',
  },
  {
    id: 'p4',
    title: 'Waist-Down Hint',
    description:
      'Suggestive photo from the waist down — teasing, not shy. Stay in your room. Send yourselves.',
    roundMin: 4,
    roundMax: 5,
    intensities: ['spicy', 'fire', 'hard'],
    media: 'photo',
  },
  {
    id: 'p5',
    title: 'Hand Placement',
    description:
      'Photo: your hand where you wish theirs was. Caption one filthy sentence.',
    roundMin: 4,
    roundMax: 5,
    intensities: ['spicy', 'fire', 'hard'],
    media: 'photo',
  },
  {
    id: 'p6',
    title: 'Almost-Naked Mirror',
    description:
      'Mirror selfie in whatever you\'re down to. Make them regret the closed door.',
    roundMin: 4,
    roundMax: 5,
    intensities: ['fire', 'hard'],
    media: 'photo',
  },
  {
    id: 'p7',
    title: 'Spit Selfie',
    description:
      'Photo: spit on your fingers or chest. Caption it for them. Send via your messages only.',
    roundMin: 4,
    roundMax: 5,
    intensities: ['hard'],
    media: 'photo',
  },
  {
    id: 'p8',
    title: 'Bite Mark Claim',
    description:
      'Photo of a place you want them to bite — marked with lipstick, a finger, or a caption arrow.',
    roundMin: 4,
    roundMax: 5,
    intensities: ['fire', 'hard'],
    media: 'photo',
  },

  // —— Short clips (apart) ——
  {
    id: 'v1',
    title: '5-Second Breath',
    description:
      'Clip dare (5–10 sec): film your face breathing heavier. Send via your own messages — app never uploads.',
    roundMin: 6,
    roundMax: 7,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
    media: 'video',
  },
  {
    id: 'v2',
    title: 'Slow Undress Clip',
    description:
      '10–15 sec: remove one piece of clothing on camera. Stay apart. Send it yourselves.',
    roundMin: 6,
    roundMax: 7,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
    media: 'video',
  },
  {
    id: 'v3',
    title: 'Come Here',
    description:
      '5–10 sec clip: look into the camera and mouth or whisper "come here." Make it hurt.',
    roundMin: 6,
    roundMax: 7,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
    media: 'video',
  },
  {
    id: 'v4',
    title: 'Touch Tease Clip',
    description:
      '10–15 sec: hands roaming your own body — suggestive, clothed or not. Send via your chat.',
    roundMin: 6,
    roundMax: 7,
    intensities: ['spicy', 'fire', 'hard'],
    media: 'video',
  },
  {
    id: 'v5',
    title: 'Moan Clip',
    description:
      '5–12 sec: a real sound of wanting. No talking required. Send it. Stay in your room.',
    roundMin: 6,
    roundMax: 7,
    intensities: ['spicy', 'fire', 'hard'],
    media: 'video',
  },
  {
    id: 'v6',
    title: 'Grind Promise',
    description:
      '10–15 sec: hips moving like you\'re already with them. Caption: "this is waiting for you."',
    roundMin: 6,
    roundMax: 7,
    intensities: ['fire', 'hard'],
    media: 'video',
  },
  {
    id: 'v7',
    title: 'Kneel Preview',
    description:
      '8–15 sec: kneel for the camera, look up, say one filthy sentence. Then stop. Stay apart.',
    roundMin: 6,
    roundMax: 7,
    intensities: ['fire', 'hard'],
    media: 'video',
  },
  {
    id: 'v8',
    title: 'Hard Edge Clip',
    description:
      '10–15 sec of edging yourself on camera — stop before the end. Send via your messages only.',
    roundMin: 6,
    roundMax: 7,
    intensities: ['hard'],
    media: 'video',
  },

  // —— Filth (together) ——
  {
    id: 'f1',
    title: 'Finally Together',
    description:
      'Same bed / couch. Full body press for 2 minutes. Kiss wherever you want.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
    media: 'touch',
  },
  {
    id: 'f2',
    title: 'Undress Each Other',
    description:
      'Remove each other\'s remaining clothes. Slowly. No rushing to genitals yet.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
    media: 'touch',
  },
  {
    id: 'f3',
    title: 'Mutual Oral Minute',
    description: '69 or take turns — both get oral for at least 60 seconds.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['spicy', 'fire', 'hard'],
    media: 'touch',
  },
  {
    id: 'f4',
    title: 'Position Roulette',
    description:
      'Loser of a coin flip (or the guest) picks the sex position. Do it for 3 minutes.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['spicy', 'fire', 'hard'],
    media: 'touch',
  },
  {
    id: 'f5',
    title: 'Eye Contact Fuck',
    description:
      'Penetrative or grinding sex with mandatory eye contact for 2 minutes.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['fire', 'hard'],
    media: 'touch',
  },
  {
    id: 'f6',
    title: 'Orgasm Race',
    description:
      'Try to make the other cum first with hand or mouth. 5 minute cap. Winner brags.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['fire', 'hard'],
    media: 'touch',
  },
  {
    id: 'f7',
    title: 'Deep & Filthy',
    description: 'Oral as deep as safe + filthy praise the whole time. 3 minutes.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['hard'],
    media: 'touch',
  },
  {
    id: 'f8',
    title: 'Anal Warmup Night',
    description:
      'Lots of lube. Anal fingering or play for 3 minutes with constant check-ins.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['hard'],
    media: 'touch',
  },
  {
    id: 'f9',
    title: 'Face Fuck Soft',
    description:
      'Consensual face-fucking at a pace the receiver sets with taps. 90 seconds.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['hard'],
    media: 'touch',
  },
  {
    id: 'f10',
    title: 'Prone Bone Prayer',
    description:
      'Prone bone or similar. Slow then hard. Dirty talk required. 4 minutes.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['hard'],
    media: 'touch',
  },
  {
    id: 'f11',
    title: 'Cum Wherever',
    description:
      'Agree on a finish spot (chest, mouth, inside, etc.) and make it happen together.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['fire', 'hard'],
    media: 'touch',
  },
  {
    id: 'f12',
    title: 'Aftercare Kiss',
    description:
      'Whatever filth just happened — now hold each other and kiss soft for 2 minutes. Water optional.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
    media: 'touch',
  },
  {
    id: 'f13',
    title: 'Deepthroat Drill Night',
    description:
      "Performer (usually the loser's vibe): slow deepthroat practice on his cock — three sinks, hold on the last. Spit OK. Safeword on. 3 minutes.",
    roundMin: 8,
    roundMax: 10,
    intensities: ['fire', 'hard'],
    media: 'touch',
  },
  {
    id: 'f14',
    title: 'Hands-Free Cock Worship',
    description:
      'Hands behind back. Mouth only on his cock — teasing then deep — for 2 minutes. Eye contact when you can.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['fire', 'hard'],
    media: 'touch',
  },
  {
    id: 'f15',
    title: 'Throatpie Fantasy Round',
    description:
      'While she deepthroats him, both narrate a filthy throatpie finish. Cum talk mandatory. Finish however you agree. 3 minutes.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['hard'],
    media: 'touch',
  },
  {
    id: 'f16',
    title: '69 Cock-Focus',
    description:
      '69 with her on top. Her mouth stays dedicated to deep, wet cock-sucking while he returns oral. 3 minutes.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['fire', 'hard'],
    media: 'touch',
  },
  {
    id: 'f17',
    title: 'Consensual Face-Fuck Soft',
    description:
      'She kneels and invites it. He fucks her mouth/throat at tap pace. Enthusiastic only. 90 seconds then aftercare kiss.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['hard'],
    media: 'touch',
  },
  {
    id: 'f18',
    title: 'Eat Her Out Slow',
    description:
      'Performer goes down on her for 3 minutes — long, slow pussy worship. She directs with softer / harder / there.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['fire', 'hard'],
    media: 'touch',
  },
  {
    id: 'f19',
    title: 'Clit Focus Challenge',
    description:
      'Tongue on her clit only for 2 minutes. No penetration. Make her moan. Then ask if she wants to finish with your mouth.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['spicy', 'fire', 'hard'],
    media: 'touch',
  },
  {
    id: 'f20',
    title: 'Face Buried Hands-Free',
    description:
      'Hands behind back or under you. Face buried in her pussy for 2 minutes. Come up wet. She can pull your head closer.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['fire', 'hard'],
    media: 'touch',
  },
  {
    id: 'f21',
    title: 'Mouth Makes Her Cum',
    description:
      'Orgasm race variant: try to finish her with mouth only in under 4 minutes. She coaches. Celebrate together after.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['fire', 'hard'],
    media: 'touch',
  },
  {
    id: 'f22',
    title: 'Face Sit If She Wants',
    description:
      'Offer face-sitting. If she is into it: sit, tongue out, tap for air, 90 seconds. If she passes: long slow oral instead. Her call.',
    roundMin: 8,
    roundMax: 10,
    intensities: ['hard'],
    media: 'touch',
  },

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
