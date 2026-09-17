import type { Intensity } from '../../types'
import type { ApartQuizQuestion } from '../types'
import { pick } from '../../lib/rng'

/** 30+ quiz questions — asker-sets, fixed bank, and partner-judges. */
export const APART_QUIZZES: ApartQuizQuestion[] = [
  // ─── Asker sets (partner preference) ───
  {
    id: 'aq1',
    kind: 'asker-sets',
    prompt: 'What turns {asker} on more right now?',
    options: ['Being teased slowly', 'Being used roughly', 'Being worshipped', 'Being denied'],
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq2',
    kind: 'asker-sets',
    prompt: 'Where does {asker} most want {answerer}’s mouth tonight (fantasy)?',
    options: ['Neck & chest', 'Between their legs', 'Ass', 'Everywhere — greedy'],
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq3',
    kind: 'asker-sets',
    prompt: 'What filthy nickname does {asker} secretly love most?',
    options: ['Baby', 'Slut (consensual)', 'Good boy/girl', 'Their real name moaned'],
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq4',
    kind: 'asker-sets',
    prompt: 'If {asker} could only pick one right now…',
    options: ['Oral', 'Fingers / hand', 'Full sex', 'Toys'],
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq5',
    kind: 'asker-sets',
    prompt: 'What would {asker} prefer {answerer} send in the next 5 minutes?',
    options: ['A filthy voice note', 'A teasing photo', 'A short clip', 'A dare text'],
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
  },
  {
    id: 'aq6',
    kind: 'asker-sets',
    prompt: 'How does {asker} want to finish tonight (fantasy)?',
    options: ['In / on mouth', 'Inside', 'On body', 'Denied until later'],
    intensities: ['fire', 'hard'],
  },
  {
    id: 'aq7',
    kind: 'asker-sets',
    prompt: 'What’s {asker}’s bigger turn-on in dirty talk?',
    options: ['Praise', 'Degradation (consensual)', 'Instructions / orders', 'Begging'],
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq8',
    kind: 'asker-sets',
    prompt: 'Which body part of {answerer} is {asker} obsessing over most tonight?',
    options: ['Mouth', 'Ass', 'Chest / tits', 'Cock / pussy'],
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq9',
    kind: 'asker-sets',
    prompt: 'What pace does {asker} crave right now?',
    options: ['Agonisingly slow', 'Steady & deep', 'Fast & messy', 'Stop-start teasing'],
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
  },
  {
    id: 'aq10',
    kind: 'asker-sets',
    prompt: 'Would {asker} rather…',
    options: ['Watch {answerer} touch themselves', 'Be watched while touching', 'Mutual on video', 'Voice-only filth'],
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq11',
    kind: 'asker-sets',
    prompt: 'What’s more likely to make {asker} lose it?',
    options: ['Eye contact', 'Moaning their name', 'A sudden photo', 'Being edged'],
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq12',
    kind: 'asker-sets',
    prompt: 'If {asker} had 10 minutes alone with {answerer} right now…',
    options: ['Clothes stay on — tease only', 'Oral first', 'Straight to fucking', 'Toys come out'],
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq13',
    kind: 'asker-sets',
    prompt: 'Which word makes {asker} wetter / harder?',
    options: ['Please', 'Now', 'Mine', 'More'],
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
  },
  {
    id: 'aq14',
    kind: 'asker-sets',
    prompt: 'What should {answerer} do with their hands in the fantasy?',
    options: ['Pinned', 'In hair', 'On throat (light, safe)', 'Free to roam'],
    intensities: ['fire', 'hard'],
  },
  {
    id: 'aq15',
    kind: 'asker-sets',
    prompt: 'True preference: {asker} would rather be…',
    options: ['In control tonight', 'Told what to do', 'Equal chaos', 'Surprised'],
    intensities: ['spicy', 'fire', 'hard'],
  },

  // ─── Partner judges (no fixed answer) ───
  {
    id: 'aq16',
    kind: 'partner-judges',
    prompt: '{answerer}: describe in one sentence what you’d do to {asker} if the door opened right now. {asker} judges if it’s filthy enough.',
    options: ['I said something filthy', 'I held back (oops)', 'I went full depraved', 'I made them laugh AND horny'],
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq17',
    kind: 'partner-judges',
    prompt: '{answerer}: guess {asker}’s current horniness 1–10, then justify it dirty. {asker} says right/wrong.',
    options: ['Nailed the number', 'Too low', 'Too high', 'Wrong vibe entirely'],
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
  },
  {
    id: 'aq18',
    kind: 'partner-judges',
    prompt: '{answerer}: send (or say) a one-line confession. {asker} judges: hot or forfeit?',
    options: ['Hot — they loved it', 'Cute but not filthy', 'Tried too hard', 'Perfect filth'],
    intensities: ['spicy', 'fire', 'hard'],
  },

  // ─── Fixed filthy couple trivia / general ───
  {
    id: 'aq19',
    kind: 'fixed',
    prompt: 'Filthy trivia: what’s the safest place to put a safeword?',
    options: ['Agreed before play', 'Only mid-scene', 'Never needed if horny', 'Whispered after'],
    correctIndex: 0,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
  },
  {
    id: 'aq20',
    kind: 'fixed',
    prompt: 'True or filth: precum means you’re about to cum immediately.',
    options: ['True', 'False — it’s arousal fluid, not a countdown'],
    correctIndex: 1,
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq21',
    kind: 'fixed',
    prompt: 'Best “apart night” media rule in this app?',
    options: ['Upload to the game server', 'Send via your own messages — app never uploads', 'Email the host', 'Post to the group chat'],
    correctIndex: 1,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
  },
  {
    id: 'aq22',
    kind: 'fixed',
    prompt: 'Edging means…',
    options: ['Cumming as fast as possible', 'Getting close then stopping on purpose', 'Only using toys', 'Sleeping it off'],
    correctIndex: 1,
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq23',
    kind: 'fixed',
    prompt: 'Which is the house rule that always wins?',
    options: ['Winner decides everything forever', 'Enthusiastic consent + free skip', 'No talking during play', 'Intensity can never drop'],
    correctIndex: 1,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
  },
  {
    id: 'aq24',
    kind: 'fixed',
    prompt: 'A good short clip dare is usually…',
    options: ['45+ minutes', '5–15 seconds of focused tease', 'A feature film', 'Audio only always'],
    correctIndex: 1,
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq25',
    kind: 'fixed',
    prompt: 'Spit during oral is…',
    options: ['Always required', 'A consensual preference some love', 'A medical emergency', 'Only for photos'],
    correctIndex: 1,
    intensities: ['fire', 'hard'],
  },
  {
    id: 'aq26',
    kind: 'fixed',
    prompt: 'If someone uses their safeword, you…',
    options: ['Ignore it if you’re close', 'Stop / pause immediately and check in', 'Go harder', 'Mute the call'],
    correctIndex: 1,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
  },
  {
    id: 'aq27',
    kind: 'fixed',
    prompt: '“Taste yourself” as a forfeit usually means…',
    options: ['Cook dinner', 'Put your wet fingers to your mouth (or theirs)', 'Drink water', 'Brush teeth twice'],
    correctIndex: 1,
    intensities: ['fire', 'hard'],
  },
  {
    id: 'aq28',
    kind: 'fixed',
    prompt: 'Apart Night is designed for…',
    options: ['Same couch required', 'Different rooms / phones the whole time', 'Public play only', 'Three or more players'],
    correctIndex: 1,
    intensities: ['romantic', 'spicy', 'fire', 'hard'],
  },
  {
    id: 'aq29',
    kind: 'asker-sets',
    prompt: 'What lingerie / clothing state does {asker} want {answerer} in for the next quest?',
    options: ['Fully dressed tease', 'Underwear only', 'Nude', 'One item left'],
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq30',
    kind: 'asker-sets',
    prompt: 'Which forfeit energy is {asker} craving if {answerer} gets this wrong?',
    options: ['Photo tease', 'Video stroke / finger', 'Voice note filth', 'Taste / precum / wetness show'],
    intensities: ['fire', 'hard'],
  },
  {
    id: 'aq31',
    kind: 'asker-sets',
    prompt: 'Where does {asker} want the next orgasm to happen (fantasy timeline)?',
    options: ['During this Apart Night', 'When you finally meetup', 'Denied until morning', 'Multiple — greedy'],
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq32',
    kind: 'fixed',
    prompt: 'Lube is…',
    options: ['Optional embarrassment', 'Your friend — use it for comfort & filth', 'Only for anal forever', 'A punishment'],
    correctIndex: 1,
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq33',
    kind: 'partner-judges',
    prompt: '{answerer}: rank {asker}’s hottest feature in one filthy sentence. {asker} judges accuracy.',
    options: ['Dead accurate', 'Close', 'Wrong feature', 'Too soft — try again energy'],
    intensities: ['spicy', 'fire', 'hard'],
  },
  {
    id: 'aq34',
    kind: 'asker-sets',
    prompt: 'What should {answerer} call {asker} for the rest of this round?',
    options: ['Sir / Mistress energy', 'Baby', 'Their name only', 'A filthy pet name {asker} chooses aloud'],
    intensities: ['fire', 'hard'],
  },
]

export function pickApartQuiz(
  intensity: Intensity,
  usedIds: string[],
  seed: number,
): ApartQuizQuestion {
  const pool = APART_QUIZZES.filter(
    (q) => q.intensities.includes(intensity) && !usedIds.includes(q.id),
  )
  const fallback = APART_QUIZZES.filter((q) => q.intensities.includes(intensity))
  const list = pool.length ? pool : fallback.length ? fallback : APART_QUIZZES
  return pick(list, seed)
}

export function quizCount() {
  return APART_QUIZZES.length
}
