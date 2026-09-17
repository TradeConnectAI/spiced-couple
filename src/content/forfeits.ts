import type { ForfeitCard, Intensity } from '../types'
import { DARE_FORFEITS } from './darePack'

const BASE_FORFEITS: ForfeitCard[] = [
  // Romantic
  { id: 'r1', title: 'Forehead Forever', description: 'Give them a long forehead kiss, then whisper one thing you love about their body.', intensities: ['romantic'], media: 'touch' },
  { id: 'r2', title: 'Slow Dance Text', description: 'Send a voice note describing a slow dance you want with them tonight — even if you\'re in different rooms.', intensities: ['romantic'], media: 'audio' },
  { id: 'r3', title: 'Hand Hold Heat', description: 'Hold their hand against your chest / stomach for 60 seconds in silence.', intensities: ['romantic'], media: 'touch' },
  { id: 'r4', title: 'Compliment Storm', description: 'Send 5 increasingly flirty compliments by text right now.', intensities: ['romantic'], media: 'text' },
  { id: 'r5', title: 'Neck Soft', description: 'Kiss their neck for 30 seconds. No more, no less.', intensities: ['romantic'], media: 'touch' },
  { id: 'r6', title: 'Memory Lane', description: 'Voice-note your hottest shared memory in romantic detail.', intensities: ['romantic'], media: 'audio' },

  // Spicy
  { id: 's1', title: 'Bite Mark', description: 'Leave a soft bite on their neck or shoulder. Kiss it after.', intensities: ['spicy', 'fire', 'hard'], media: 'touch' },
  { id: 's2', title: 'Thigh Squeeze', description: 'Put their hand high on your thigh and hold it there for 45 seconds.', intensities: ['spicy', 'fire', 'hard'], media: 'touch' },
  { id: 's3', title: 'Underwear Pic', description: 'Send a teasing photo — underwear or bare skin, your call. Face optional.', intensities: ['spicy', 'fire', 'hard'], media: 'photo' },
  { id: 's4', title: 'Dirty Sentence', description: 'Text them one sentence about what you\'d do if you had 10 minutes alone right now.', intensities: ['spicy', 'fire', 'hard'], media: 'text' },
  { id: 's5', title: 'Lap Sit', description: 'Sit on their lap facing them for 1 minute. Grind once. Just once.', intensities: ['spicy', 'fire', 'hard'], media: 'touch' },
  { id: 's6', title: 'Strip One', description: 'Remove one item of clothing and show them (in person or photo).', intensities: ['spicy', 'fire', 'hard'], media: 'photo' },
  { id: 's7', title: 'Kiss Below', description: 'Kiss them somewhere below the waist — over clothes is fine.', intensities: ['spicy', 'fire', 'hard'], media: 'touch' },
  { id: 's8', title: 'Moan On Command', description: 'Send a 5-second voice note of you moaning their name.', intensities: ['spicy', 'fire', 'hard'], media: 'audio' },
  { id: 's9', title: 'Hand Guide', description: 'Put their hand where you want it and keep it there for 60 seconds.', intensities: ['spicy', 'fire', 'hard'], media: 'touch' },
  { id: 's10', title: 'Tease Strip Voice', description: 'Voice note describing taking your clothes off slowly for them.', intensities: ['spicy', 'fire', 'hard'], media: 'audio' },

  // Fire
  { id: 'f1', title: 'Oral Preview', description: 'Go down on them for 60 seconds. Timer starts when mouth makes contact.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'f2', title: 'Stroke Showcase', description: 'Give them a 90-second handjob / fingering. Eye contact required.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'f3', title: 'Spit Kiss', description: 'Spit in their mouth (or onto their tongue) then kiss deep.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'f4', title: 'Bent Over', description: 'Bend over for them. They get 45 seconds of touching / spanking / grinding.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'f5', title: 'Nude Selfie', description: 'Send a nude (or nearly) photo with a filthy caption.', intensities: ['fire', 'hard'], media: 'photo' },
  { id: 'f6', title: 'Ride the Thigh', description: 'Straddle their thigh and grind for 90 seconds. Clothes optional.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'f7', title: 'Beg Out Loud', description: 'On voice note or in person: beg them for what you want in explicit detail for 30 seconds.', intensities: ['fire', 'hard'], media: 'audio' },
  { id: 'f8', title: 'Finger / Stroke While Kissing', description: 'Kiss them while your hand works them for 2 minutes.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'f9', title: 'Show Off', description: 'Spread / present yourself for a photo or in person for 20 seconds.', intensities: ['fire', 'hard'], media: 'photo' },
  { id: 'f10', title: 'Edge Yourself', description: 'Touch yourself to the edge in front of them (or on video). Stop before you cum.', intensities: ['fire', 'hard'], media: 'video' },
  { id: 'f11', title: 'Taste Yourself', description: 'Touch yourself, then put your fingers in their mouth (or yours on camera).', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'f12', title: 'Clothes Off Challenge', description: 'Strip completely for the next round. No putting clothes back on until they say.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'f13', title: 'Mark Me', description: 'They get to leave a hickey or bite mark somewhere visible to you both.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'f14', title: 'Dirty Dictation', description: 'They dictate a filthy text; you send it to them as if it\'s your own confession.', intensities: ['fire', 'hard'], media: 'text' },
  { id: 'f15', title: 'Kneel Service', description: 'Kneel and use your mouth on them for 2 minutes.', intensities: ['fire', 'hard'], media: 'touch' },

  // Hard — absolute filth, consensual
  { id: 'h1', title: 'Deep Throat Hold', description: 'Take them deep into your throat (or as deep as safe). Hold for a count of 5. Eyes up. Spit is hot.', intensities: ['hard'], media: 'touch' },
  { id: 'h2', title: 'Sloppy Blowjob', description: 'Give the messiest, wettest blowjob you can for 2 minutes. Drool on purpose.', intensities: ['hard'], media: 'touch' },
  { id: 'h3', title: 'Anal Finger Forfeit', description: 'Lube up and take a finger in your ass while they watch / help. 90 seconds.', intensities: ['hard'], media: 'touch' },
  { id: 'h4', title: 'Face Sit Surrender', description: 'Lie back. They sit on your face. Tongue out. 90 seconds. Tap to breathe.', intensities: ['hard'], media: 'touch' },
  { id: 'h5', title: 'Throatpie Dirty Talk', description: 'While sucking them, beg for a throatpie in the filthiest language you have. 2 minutes of mouth + talk.', intensities: ['hard'], media: 'touch' },
  { id: 'h6', title: 'Spit On Me', description: 'They spit on your tongue / chest / cock / pussy (their choice). You thank them.', intensities: ['hard'], media: 'touch' },
  { id: 'h7', title: 'Ass Up Present', description: 'Ass up, face down. They get 2 minutes of unrestricted touching, spanking, teasing, fingering within limits.', intensities: ['hard'], media: 'touch' },
  { id: 'h8', title: 'Gag On It', description: 'Consensual gagging oral — push your limits safely for 60 seconds. Safeword / tap out ready.', intensities: ['hard'], media: 'touch' },
  { id: 'h9', title: 'Anal Tongue', description: 'Rim them for a full 2 minutes. Get in there.', intensities: ['hard'], media: 'touch' },
  { id: 'h10', title: 'Use My Mouth', description: 'Hands behind back. They fuck your mouth at their pace for 90 seconds. Tap = pause.', intensities: ['hard'], media: 'touch' },
  { id: 'h11', title: 'Cream Pie Beg', description: 'During the next sexual contact, you must beg to be filled / to fill them. No stopping the dirty talk.', intensities: ['hard'], media: 'audio' },
  { id: 'h12', title: 'Plug Walk', description: 'Put in a plug or toy (lube!) and keep it in through the next mini-game.', intensities: ['hard'], media: 'touch' },
  { id: 'h13', title: 'Degrade Me Softly', description: 'They call you their filthy names for 1 minute while touching you. You say "thank you" after each.', intensities: ['hard'], media: 'touch' },
  { id: 'h14', title: 'Rough Kiss & Choke Light', description: 'Passionate rough kissing with light consensual hand-on-throat pressure (airway free). 60 seconds.', intensities: ['hard'], media: 'touch' },
  { id: 'h15', title: 'Cum On Command Attempt', description: 'They try to make you cum with hand / mouth / toy in 3 minutes. You\'re not allowed to stop them.', intensities: ['hard'], media: 'touch' },
  { id: 'h16', title: 'Open Wide Photo', description: 'Send a photo: mouth open, tongue out, looking wrecked — post-oral energy.', intensities: ['hard'], media: 'photo' },
  { id: 'h17', title: 'Double Duty', description: 'Mouth on them while your hand works their ass / balls / clit. 2 minutes of coordinated filth.', intensities: ['hard'], media: 'touch' },
  { id: 'h18', title: 'Fuck Machine Mouth', description: 'Stay still on your knees. They set the oral rhythm. You take it for 2 minutes.', intensities: ['hard'], media: 'touch' },
]

export const FORFEITS: ForfeitCard[] = [...BASE_FORFEITS, ...DARE_FORFEITS]

export function pickForfeit(
  intensity: Intensity,
  used: string[],
  seed: number,
): ForfeitCard {
  let pool = FORFEITS.filter(
    (f) => f.intensities.includes(intensity) && !used.includes(f.id),
  )
  if (pool.length === 0) {
    pool = FORFEITS.filter((f) => f.intensities.includes(intensity))
  }
  const idx = Math.abs(seed) % pool.length
  return pool[idx]
}
