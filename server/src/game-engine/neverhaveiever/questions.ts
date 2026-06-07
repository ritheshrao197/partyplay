export const QUESTION_PACKS: Record<string, string[]> = {
  family: [
    'Never have I ever eaten food off the floor.',
    'Never have I ever pretended to be sick to skip school.',
    'Never have I ever cheated at a board game.',
    'Never have I ever talked to myself in the mirror.',
    "Never have I ever forgotten someone's name mid-conversation.",
    'Never have I ever worn mismatched socks in public.',
    'Never have I ever blamed a fart on someone else.',
    'Never have I ever pretended to be on a phone call to avoid someone.',
    'Never have I ever laughed so hard I cried.',
    'Never have I ever accidentally called my teacher Mom or Dad.',
    'Never have I ever tried to lick my elbow.',
    'Never have I ever eaten an entire pizza by myself.',
    'Never have I ever sung in the shower.',
    'Never have I ever danced when no one was watching.',
    'Never have I ever re-gifted a gift I received.',
    'Never have I ever fallen asleep in class.',
    'Never have I ever lied about my age.',
    'Never have I ever Googled my own name.',
    'Never have I ever pretended to like a gift I hated.',
    'Never have I ever walked into a glass door.',
  ],
  party: [
    'Never have I ever pulled an all-nighter.',
    'Never have I ever sent a text to the wrong person.',
    'Never have I ever ghosted someone.',
    'Never have I ever been caught talking about someone behind their back.',
    'Never have I ever binge-watched an entire series in one weekend.',
    'Never have I ever stalked someone on social media.',
    'Never have I ever pretended not to see someone to avoid talking.',
    'Never have I ever cried at a movie in public.',
    "Never have I ever accidentally liked someone's old Instagram photo.",
    "Never have I ever used someone else's Netflix password.",
    'Never have I ever lied to get out of plans.',
    'Never have I ever had a wardrobe malfunction in public.',
    "Never have I ever eavesdropped on a stranger's conversation.",
    'Never have I ever taken a selfie in the bathroom.',
    'Never have I ever forgotten to mute myself on a video call.',
    'Never have I ever said "you too" when a waiter said "enjoy your meal".',
    "Never have I ever waved back at someone who wasn't waving at me.",
    "Never have I ever laughed at a joke I didn't understand.",
    'Never have I ever pretended to read the menu at a restaurant.',
    'Never have I ever accidentally sent a screenshot to the person I was screenshotting.',
  ],
  spicy: [
    "Never have I ever had a crush on a friend's partner.",
    "Never have I ever kissed someone whose name I didn't know.",
    'Never have I ever lied about my body count.',
    'Never have I ever sent a risky text to the wrong person.',
    'Never have I ever been caught in a compromising position.',
    'Never have I ever had a secret relationship.',
    'Never have I ever dated two people at the same time.',
    'Never have I ever flirted with someone just to get something.',
    'Never have I ever been friend-zoned.',
    'Never have I ever friend-zoned someone.',
    "Never have I ever slid into someone's DMs.",
    'Never have I ever gone on a date just for a free meal.',
    'Never have I ever had a crush on a celebrity.',
    'Never have I ever practiced kissing on my hand.',
    'Never have I ever lied about being single.',
  ],
};

export function getRandomQuestion(pack: string = 'party'): string {
  const questions = QUESTION_PACKS[pack] || QUESTION_PACKS.party;
  return questions[Math.floor(Math.random() * questions.length)];
}

export function getRandomQuestionFromAll(): { question: string; pack: string } {
  const allPacks = Object.keys(QUESTION_PACKS);
  const pack = allPacks[Math.floor(Math.random() * allPacks.length)];
  const questions = QUESTION_PACKS[pack];
  return { question: questions[Math.floor(Math.random() * questions.length)], pack };
}
