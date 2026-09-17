import type { Intensity } from '../../types'
import type { ApartQuestCard } from '../types'
import { pick } from '../../lib/rng'

/** 20+ apart quests — text / photo / short clip. App never uploads. */
export const APART_QUESTS: ApartQuestCard[] = [
  {
    id: 'aqs1',
    title: 'Filthy Q&A',
    description:
      'Text your partner 3 naughty questions. They must answer all three before the next round. No soft answers.',
    media: 'text',
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
    who: 'both',
  },
  {
    id: 'aqs2',
    title: 'Underwear Proof',
    description:
      'Send a photo proving what’s under your clothes right now — teasing angle, face optional.',
    media: 'photo',
    intensities: ['spicy', 'fire', 'hard'],
    who: 'either',
  },
  {
    id: 'aqs3',
    title: '5-Second Moan',
    description:
      'Send a 5-second voice/video clip of you moaning their name. Make it believable.',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
    who: 'either',
  },
  {
    id: 'aqs4',
    title: 'Mirror Tease',
    description:
      'Photo or 10s clip in the mirror — shirt up / pants down enough to tease. Caption it filthy.',
    media: 'photo',
    intensities: ['spicy', 'fire', 'hard'],
    who: 'either',
  },
  {
    id: 'aqs5',
    title: 'Confession Text',
    description:
      'Text one thing you’ve fantasised about them this week that you haven’t said out loud yet.',
    media: 'text',
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
    who: 'both',
  },
  {
    id: 'aqs6',
    title: 'Hand Shot',
    description:
      'Send a photo of your hand where you’d want theirs — thigh, chest, between legs (clothes on OK).',
    media: 'photo',
    intensities: ['spicy', 'fire', 'hard'],
    who: 'either',
  },
  {
    id: 'aqs7',
    title: 'Clip: Strip One',
    description:
      'Record a 10–15s clip removing one item of clothing slowly. Send via your messages.',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
    who: 'either',
  },
  {
    id: 'aqs8',
    title: 'Rate My Body Text',
    description:
      'Text them which part of their body you’d attack first if you kicked the door in — be specific.',
    media: 'text',
    intensities: ['spicy', 'fire', 'hard'],
    who: 'both',
  },
  {
    id: 'aqs9',
    title: 'Wet / Hard Evidence',
    description:
      'Send proof you’re turned on — subtle bulge photo, wetness hint, hard nipples, flushed chest. Your call how explicit.',
    media: 'photo',
    intensities: ['fire', 'hard'],
    who: 'either',
  },
  {
    id: 'aqs10',
    title: 'Instruction Obey',
    description:
      'Partner sends one instruction by text (safe, apart-friendly). You have 2 minutes to do it and confirm with a photo or clip.',
    media: 'text',
    intensities: ['spicy', 'fire', 'hard'],
    who: 'both',
  },
  {
    id: 'aqs11',
    title: 'Pillow Prop',
    description:
      'Short clip: grind on / squeeze a pillow like it’s them. 10 seconds. Moan optional but encouraged.',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
    who: 'either',
  },
  {
    id: 'aqs12',
    title: 'Caption This Nude-ish',
    description:
      'Send a teasing photo with a caption that would get you banned from a family group chat.',
    media: 'photo',
    intensities: ['fire', 'hard'],
    who: 'either',
  },
  {
    id: 'aqs13',
    title: 'Two Truths, One Lie (Filthy)',
    description:
      'Text 2 true filthy facts about yourself and 1 lie. Partner guesses the lie. Winner gets bragging rights (+coins if host awards).',
    media: 'text',
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
    who: 'both',
  },
  {
    id: 'aqs14',
    title: 'Close-Up Tease Clip',
    description:
      '5–10s extreme close-up of skin, mouth, cleavage, thighs, or bulge — no full reveal required. Suggestive > explicit OK.',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
    who: 'either',
  },
  {
    id: 'aqs15',
    title: 'Countdown Dare',
    description:
      'Partner counts down 5…4…3…2…1 by text. On 1 you send a spontaneous photo of whatever state you’re in.',
    media: 'photo',
    intensities: ['spicy', 'fire', 'hard'],
    who: 'both',
  },
  {
    id: 'aqs16',
    title: 'Voice Note Menu',
    description:
      'Voice note (30s): describe a 3-course “sex menu” you’d serve them — starter, main, dessert. Explicit.',
    media: 'audio',
    intensities: ['fire', 'hard'],
    who: 'either',
  },
  {
    id: 'aqs17',
    title: 'Show the Toy / Prop',
    description:
      'Photo: show a toy, lube, pillow, or household prop you’d use on them. Caption how.',
    media: 'photo',
    intensities: ['fire', 'hard'],
    who: 'either',
  },
  {
    id: 'aqs18',
    title: 'Mutual Flash Sync',
    description:
      'On a count of three (text), both send a flash photo within 15 seconds. No delaying. Laugh if chaos.',
    media: 'photo',
    intensities: ['spicy', 'fire', 'hard'],
    who: 'both',
  },
  {
    id: 'aqs19',
    title: 'Edge Peek Clip',
    description:
      'Touch yourself off-camera until warm, then hit record for 8 seconds of face + what you’re doing (tasteful or filthy).',
    media: 'video',
    intensities: ['fire', 'hard'],
    who: 'either',
  },
  {
    id: 'aqs20',
    title: 'Praise / Degrade Choice',
    description:
      'Text your partner: “Praise me” or “Degrade me (consensual).” They send 4 lines in that style. You must thank them.',
    media: 'text',
    intensities: ['fire', 'hard'],
    who: 'both',
  },
  {
    id: 'aqs21',
    title: 'Sock / Panties Trophy',
    description:
      'Photo: hold up the underwear you just took off (or are about to). Tell them what you’d make them do with it.',
    media: 'photo',
    intensities: ['fire', 'hard'],
    who: 'either',
  },
  {
    id: 'aqs22',
    title: 'Location Fantasy',
    description:
      'Text a filthy scene set somewhere in your home — hallway, shower, kitchen counter. 4 sentences minimum.',
    media: 'text',
    intensities: ['spicy', 'fire', 'hard'],
    who: 'both',
  },
]

export function pickApartQuest(
  intensity: Intensity,
  usedIds: string[],
  seed: number,
): ApartQuestCard {
  const pool = APART_QUESTS.filter(
    (q) => q.intensities.includes(intensity) && !usedIds.includes(q.id),
  )
  const fallback = APART_QUESTS.filter((q) => q.intensities.includes(intensity))
  const list = pool.length ? pool : fallback.length ? fallback : APART_QUESTS
  return pick(list, seed)
}

export function questCount() {
  return APART_QUESTS.length
}
