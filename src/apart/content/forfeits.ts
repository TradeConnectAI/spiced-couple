import type { Intensity } from '../../types'
import type { ApartForfeitCard } from '../types'
import { pick } from '../../lib/rng'

/**
 * Apart-safe forfeits. Male → Steve/host; female → Laura/guest by default.
 * Steve's requested examples are first in the male list.
 */
export const APART_FORFEITS: ApartForfeitCard[] = [
  // ─── Steve / male (masturbation · video · precum) ───
  {
    id: 'am1',
    title: '3-Minute Stroke',
    description:
      'On video/call: stroke your cock for a full 3 minutes. Slow for the first minute, then faster. No finishing.',
    target: 'male',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'am2',
    title: 'Edge — Don’t Finish',
    description:
      'On video: stroke yourself to the edge. Get right there. Then stop. Hands off. Show them how hard you are. No cum.',
    target: 'male',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'am3',
    title: 'Precum Close-Up',
    description:
      'Get yourself dripping, then send/show a close-up clip of the precum at your tip. Wipe a bit on your finger for the camera.',
    target: 'male',
    media: 'video',
    intensities: ['fire', 'hard'],
  },
  {
    id: 'am4',
    title: 'Slow Then Fast',
    description:
      'On call: 60s slow strokes (eye contact), then 60s fast. Moan their name at least twice. Stop before you cum.',
    target: 'male',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'am5',
    title: 'Ball Tease Cam',
    description:
      'On video for 90 seconds: massage your balls with one hand while stroking lightly with the other. Show everything.',
    target: 'male',
    media: 'video',
    intensities: ['fire', 'hard'],
  },
  {
    id: 'am6',
    title: 'Taste Your Precum',
    description:
      'Stroke until precum beads. Scoop it on a finger, show the camera, then taste it. Tell them how it tastes.',
    target: 'male',
    media: 'video',
    intensities: ['fire', 'hard'],
  },
  {
    id: 'am7',
    title: 'Double Edge',
    description:
      'Edge yourself twice on video — stop both times. After the second edge, hold your cock up and throb for them. No finish.',
    target: 'male',
    media: 'video',
    intensities: ['fire', 'hard'],
  },
  {
    id: 'am8',
    title: 'Cock Bounce',
    description:
      'On camera 30 seconds: bounce / slap your hard cock against your stomach or palm. Then stroke for 90 more seconds.',
    target: 'male',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'am9',
    title: 'Lube Showcase',
    description:
      'Add lube (or spit). Give a wet, noisy 2-minute handjob to yourself on video. Filthy sounds encouraged.',
    target: 'male',
    media: 'video',
    intensities: ['fire', 'hard'],
  },
  {
    id: 'am10',
    title: 'Dirty Talk Stroke',
    description:
      'Stroke on video for 2 minutes while telling them exactly what you’d do if they were in the room. Explicit.',
    target: 'male',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'am11',
    title: 'Hard Progress Pic + Stroke',
    description:
      'Send a photo of how hard you are, then jump on video and stroke for 2 minutes while they watch.',
    target: 'male',
    media: 'photo',
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'am12',
    title: 'Cum Denial Throb',
    description:
      'Get as close as you can. Stop. Hands behind your head. Show your cock throbbing on camera for 20 seconds. Denied.',
    target: 'male',
    media: 'video',
    intensities: ['fire', 'hard'],
  },
  {
    id: 'am13',
    title: 'Name Every Ten',
    description:
      'Stroke on call. Every 10 strokes, moan their name out loud. Keep going for 3 minutes or until they say stop (no cum).',
    target: 'male',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'am14',
    title: 'Shaft Close-Up',
    description:
      'Send a 15–20s close-up clip of the head and shaft while you stroke slowly. Then continue on video call for 90s.',
    target: 'male',
    media: 'video',
    intensities: ['fire', 'hard'],
  },
  {
    id: 'am15',
    title: 'Hip-Thrust Fist',
    description:
      'On camera: fuck your fist with hip thrusts for 2 minutes. Show your face when you get close — then stop.',
    target: 'male',
    media: 'video',
    intensities: ['fire', 'hard'],
  },
  {
    id: 'am16',
    title: 'Spit & Polish',
    description:
      'Spit on your cock on camera. Rub it in. Stroke wet for 2 minutes. Show them the mess when done (no cum required).',
    target: 'male',
    media: 'video',
    intensities: ['hard'],
  },

  // ─── Laura / female (fingering · taste · pillow · clit) ───
  {
    id: 'af1',
    title: 'Finger Cam — 2 Minutes',
    description:
      'On video: finger yourself for a full 2 minutes. Eye contact when you can. Don’t finish unless they beg you to.',
    target: 'female',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'af2',
    title: 'Taste Yourself',
    description:
      'Get your fingers wet, show them to the camera, then taste yourself. Tell them how you taste. Optional: lick clean.',
    target: 'female',
    media: 'video',
    intensities: ['fire', 'hard'],
  },
  {
    id: 'af3',
    title: 'Pillow Ride — 2 Min',
    description:
      'On camera: ride a pillow (or rolled blanket) for 2 minutes. Grind, moan their name, show your face.',
    target: 'female',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'af4',
    title: 'Clit Tease Video',
    description:
      'Send/show a short clip focused on slow clit teasing — circles only, no deep fingering. 60–90 seconds of pure tease.',
    target: 'female',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'af5',
    title: 'Spread Showcase',
    description:
      'On camera for 30 seconds: spread yourself. Hold. Then finger slowly for another 90 seconds while they watch.',
    target: 'female',
    media: 'video',
    intensities: ['fire', 'hard'],
  },
  {
    id: 'af6',
    title: 'Nipples + Fingers',
    description:
      'On call for 2 minutes: play with your nipples with one hand while fingering with the other. Moan for them.',
    target: 'female',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'af7',
    title: 'Double Edge (Her)',
    description:
      'Edge yourself twice on video — pull away both times. After the second, show how wet you are. No orgasm.',
    target: 'female',
    media: 'video',
    intensities: ['fire', 'hard'],
  },
  {
    id: 'af8',
    title: 'Wetness Close-Up',
    description:
      'Send a close-up photo or short clip of how wet you are, then taste your fingers on camera and smile.',
    target: 'female',
    media: 'photo',
    intensities: ['fire', 'hard'],
  },
  {
    id: 'af9',
    title: 'Pillow + Name',
    description:
      'Hump a pillow on camera for 2 minutes. Moan their name every time you grind down. Filthy soundtrack required.',
    target: 'female',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'af10',
    title: 'Two Fingers Deep',
    description:
      'On video 90 seconds: two fingers, show the depth. Slow pumps. Tell them how full you feel.',
    target: 'female',
    media: 'video',
    intensities: ['fire', 'hard'],
  },
  {
    id: 'af11',
    title: 'Clit Only — No Penetration',
    description:
      'On video for 2 minutes: clit circles only. No fingers inside. Get as desperate as you can. Stop when they say.',
    target: 'female',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'af12',
    title: 'Strip Then Edge',
    description:
      'Strip tease on call (or clip), then finger yourself to the edge. Stop. Show them your shaking hands.',
    target: 'female',
    media: 'video',
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'af13',
    title: 'Ass/Pussy Flash',
    description:
      'Bend over on camera — ass and pussy flash for 20 seconds. Then reach back and tease yourself for 60 more.',
    target: 'female',
    media: 'video',
    intensities: ['fire', 'hard'],
  },
  {
    id: 'af14',
    title: 'Hard Edge Push',
    description:
      'On video: get yourself as close as possible. Push for a hard edge (orgasm optional only if they allow). 2 minutes of work.',
    target: 'female',
    media: 'video',
    intensities: ['hard'],
  },
  {
    id: 'af15',
    title: 'Toy or Fingers Ride',
    description:
      'If you have a toy, ride it on video for 2 minutes. If not: fingers + filthy dirty talk as if it’s them inside you.',
    target: 'female',
    media: 'video',
    intensities: ['fire', 'hard'],
  },
  {
    id: 'af16',
    title: 'Suck Your Fingers Clean',
    description:
      'Finger yourself until soaked. On camera: suck every finger clean, slowly, while looking at them. Then say thank you.',
    target: 'female',
    media: 'video',
    intensities: ['fire', 'hard'],
  },
]

export function pickApartForfeit(
  intensity: Intensity,
  target: 'male' | 'female',
  usedIds: string[],
  seed: number,
): ApartForfeitCard {
  const pool = APART_FORFEITS.filter(
    (f) => f.target === target && f.intensities.includes(intensity) && !usedIds.includes(f.id),
  )
  const fallback = APART_FORFEITS.filter(
    (f) => f.target === target && f.intensities.includes(intensity),
  )
  const list = pool.length ? pool : fallback.length ? fallback : APART_FORFEITS.filter((f) => f.target === target)
  return pick(list, seed)
}

export function countForfeitsByTarget() {
  const male = APART_FORFEITS.filter((f) => f.target === 'male').length
  const female = APART_FORFEITS.filter((f) => f.target === 'female').length
  return { male, female, total: APART_FORFEITS.length }
}
