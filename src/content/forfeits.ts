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

  // Deepthroat / female-oral focus (performer receives cock orally — Laura energy when guest forfeits)
  { id: 'dt1', title: 'Cock Tease Warmup', description: 'Kiss, lick, and tease the head of his cock for 90 seconds — no deep taking yet. Eyes up. Make him ache.', intensities: ['spicy', 'fire', 'hard'], media: 'touch' },
  { id: 'dt2', title: 'Slow Throat Practice', description: 'Slide his cock into your throat as deep as is safe, slow and deliberate. Three full sinks. Spit welcome. Tap if you need air.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'dt3', title: 'Hold & Count Five', description: 'Deepthroat him and hold. He counts to five out loud. Eyes on him. Come up gasping — then thank him.', intensities: ['hard'], media: 'touch' },
  { id: 'dt4', title: 'Hands-Free Throat', description: 'Hands behind your back. Deepthroat his cock with only your mouth for 90 seconds. Drool on purpose.', intensities: ['hard'], media: 'touch' },
  { id: 'dt5', title: 'Eye-Contact Blowjob', description: 'Suck him for 2 minutes without breaking eye contact. When you go deep, look wrecked and proud.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'dt6', title: 'Spit-Shine His Cock', description: 'Make it filthy: spit on his cock, stroke with the mess, then deepthroat. 2 minutes of wet, noisy oral.', intensities: ['hard'], media: 'touch' },
  { id: 'dt7', title: 'Throat Training Ladder', description: 'Shallow → mid → deep. Three depths, 20 seconds each, on his cock. Build the stretch. Safeword ready.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'dt8', title: 'Consensual Face-Fuck', description: 'Kneel. Tell him to use your mouth. He fucks your throat at a pace you set with taps. 90 seconds. Enthusiastic only.', intensities: ['hard'], media: 'touch' },
  { id: 'dt9', title: 'Throatpie Beg', description: 'While deepthroating him, beg for a throatpie in filthy detail. Cum-in-throat fantasy talk required. 2 minutes.', intensities: ['hard'], media: 'touch' },
  { id: 'dt10', title: 'Mouth Edge Him', description: 'Bring him to the edge twice with your mouth on his cock — no finish yet. Stop when he says "edge." Third round: he chooses.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'dt11', title: '69 Her on Top Oral', description: '69 with you on top. Focus your mouth on his cock — deep, wet, dedicated — while he tastes you. 2 minutes.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'dt12', title: 'Drool On His Balls', description: 'Deepthroat until you drool down onto his balls, then lick them clean and sink again. Messy worship. 2 minutes.', intensities: ['hard'], media: 'touch' },
  { id: 'dt13', title: 'Finish In My Mouth', description: 'Suck him with the goal of finishing in your mouth. Swallow or show — his call. Keep going until he cums or 4 minutes.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'dt14', title: 'Gagged Praise', description: 'Take his cock deep. Between sinks, gasp praise: how good he tastes, how full your throat feels. 2 minutes of oral + filth.', intensities: ['hard'], media: 'touch' },
  { id: 'dt15', title: 'Kneel & Open Wide', description: 'Kneel, mouth open, tongue out. He rests his cock on your tongue, then feeds it into your throat. Hold for a count of 3. Twice.', intensities: ['hard'], media: 'touch' },
  { id: 'dt16', title: 'Sloppy Nose-to-Base', description: 'Try for nose-to-base on his cock (as deep as safe). Hold a beat. Come up a mess. One proud attempt counts.', intensities: ['hard'], media: 'touch' },
  // Cunnilingus / eat-her-out focus (performer goes down on her — Steve energy when host forfeits / guest buys)
  { id: 'pe1', title: 'Thigh Kiss Tease', description: 'Kiss and lick her inner thighs for 90 seconds — stop just short of her pussy. Make her ache for your mouth.', intensities: ['spicy', 'fire', 'hard'], media: 'touch' },
  { id: 'pe2', title: 'Clit Warmup Circles', description: 'Soft tongue circles on her clit for 2 minutes. No fingers yet. Slow. Ask what pace she wants mid-way.', intensities: ['spicy', 'fire', 'hard'], media: 'touch' },
  { id: 'pe3', title: 'Long Slow Oral', description: 'Eat her pussy slowly for 3 minutes. Broad strokes, then focused. No rushing to finish — worship the taste.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'pe4', title: 'Hands-Free Face Buried', description: 'Hands under you or behind your back. Bury your face in her pussy — tongue only — for 2 minutes. Come up glistening.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'pe5', title: 'Hold Her Thighs', description: 'Pin her thighs open with your hands and eat her like you mean it for 2 minutes. Eyes up when you can. She sets the "harder/softer" word.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'pe6', title: 'Tongue Edge Her', description: 'Bring her to the edge twice with only your tongue. Stop both times when she says edge. Third time: finish her with your mouth if she wants.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'pe7', title: 'Face Sit Soft', description: 'Lie back. She sits on your face if she wants. Tongue out, hands on her hips/ass. Tap to breathe. 90 seconds. Enthusiastic only.', intensities: ['hard'], media: 'touch' },
  { id: 'pe8', title: 'Mouth Finish Her', description: 'Your only job: make her cum with your mouth. Hands optional for spreading — tongue does the work. Up to 5 minutes. Celebrate when she does.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'pe9', title: 'Suck Her Clit', description: 'Gentle suction on her clit — rhythm she likes — for 90 seconds. Then broad licking. Ask which she wants more of.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'pe10', title: 'Figure-Eight Tongue', description: 'Trace figure-eights over her clit and lips for 2 minutes without stopping. Spit for slickness if needed. Stay locked in.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'pe11', title: 'Spread & Stare Oral', description: 'Spread her open, look, tell her how pretty her pussy is — then dive in for 2 minutes of dedicated oral. Praise between licks.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'pe12', title: 'Finger + Tongue Combo', description: 'One or two fingers slow while your tongue works her clit. Coordinated. 2 minutes. Check depth and speed with her.', intensities: ['fire', 'hard'], media: 'touch' },
  { id: 'pe13', title: 'Over-Clothes Then Bare', description: 'Mouth on her pussy over underwear for 45 seconds, then pull them aside and go bare for 90 more. Tease-to-filth arc.', intensities: ['spicy', 'fire', 'hard'], media: 'touch' },
  { id: 'pe14', title: 'Drip & Lick Clean', description: 'Get her dripping wet with your mouth, then lick every bit of mess you made. No wiping with hands — tongue only. 2 minutes.', intensities: ['hard'], media: 'touch' },
  { id: 'pe15', title: '69 Him on Bottom Oral', description: '69 with you on the bottom. Your mouth stays buried in her pussy — deep, wet, focused — while she returns oral. 2 minutes.', intensities: ['fire', 'hard'], media: 'touch' },

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
