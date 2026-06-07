// Database seeder
import { pool } from './index.js';

const imposterWords = [
  // [crewWord, imposterWord]
  ['Apple', 'Orange'], ['Dog', 'Cat'], ['Beach', 'Pool'], ['Pizza', 'Burger'],
  ['Guitar', 'Piano'], ['Doctor', 'Nurse'], ['Paris', 'London'], ['Batman', 'Superman'],
  ['Coffee', 'Tea'], ['School', 'College'], ['Mars', 'Venus'], ['Spider', 'Scorpion'],
  ['Cake', 'Pie'], ['Sun', 'Moon'], ['Car', 'Motorcycle'], ['Book', 'Magazine'],
  ['Soccer', 'Rugby'], ['King', 'Queen'], ['Winter', 'Autumn'], ['Gold', 'Silver'],
  ['Phone', 'Tablet'], ['Teacher', 'Professor'], ['Shark', 'Whale'], ['Forest', 'Jungle'],
  ['Movie', 'Series'], ['Chef', 'Baker'], ['Hammer', 'Wrench'], ['Pilot', 'Captain'],
  ['Violin', 'Cello'], ['Zombie', 'Vampire'], ['Island', 'Peninsula'], ['Lion', 'Tiger'],
  ['Castle', 'Palace'], ['Rocket', 'Airplane'], ['Diamond', 'Ruby'], ['Ninja', 'Samurai'],
  ['Dragon', 'Phoenix'], ['Wizard', 'Witch'], ['Pirate', 'Sailor'], ['Robot', 'Android'],
  ['Tornado', 'Hurricane'], ['Safari', 'Zoo'], ['Circus', 'Carnival'], ['Museum', 'Gallery'],
  ['Volcano', 'Earthquake'], ['Glacier', 'Iceberg'], ['Desert', 'Sahara'], ['Coral', 'Seaweed'],
];

const wordRushCategories: Record<string, string[]> = {
  'Animals': ['Dog', 'Cat', 'Elephant', 'Tiger', 'Penguin', 'Dolphin', 'Eagle', 'Lion', 'Bear', 'Wolf', 'Fox', 'Rabbit', 'Snake', 'Horse', 'Giraffe', 'Koala', 'Panda', 'Owl', 'Shark', 'Whale'],
  'Fruits': ['Apple', 'Banana', 'Orange', 'Grape', 'Strawberry', 'Mango', 'Pineapple', 'Watermelon', 'Peach', 'Cherry', 'Kiwi', 'Lemon', 'Coconut', 'Blueberry', 'Plum', 'Pear', 'Fig', 'Papaya', 'Lime', 'Guava'],
  'Countries': ['France', 'Japan', 'Brazil', 'Egypt', 'Canada', 'India', 'Italy', 'Mexico', 'Germany', 'Spain', 'China', 'Russia', 'Australia', 'Korea', 'Sweden', 'Norway', 'Greece', 'Turkey', 'Peru', 'Chile'],
  'Movies': ['Titanic', 'Avatar', 'Inception', 'Joker', 'Frozen', 'Rocky', 'Alien', 'Matrix', 'Shrek', 'Gladiator', 'Interstellar', 'Parasite', 'Jaws', 'Psycho', 'Memento', 'Vertigo', 'Casablanca', 'Godfather', 'Terminator', 'Predator'],
  'Sports': ['Soccer', 'Tennis', 'Basketball', 'Baseball', 'Hockey', 'Golf', 'Swimming', 'Boxing', 'Cricket', 'Rugby', 'Volleyball', 'Skiing', 'Surfing', 'Archery', 'Fencing', 'Cycling', 'Rowing', 'Sailing', 'Karate', 'Judo'],
  'Jobs': ['Doctor', 'Teacher', 'Engineer', 'Chef', 'Pilot', 'Artist', 'Lawyer', 'Nurse', 'Farmer', 'Writer', 'Actor', 'Singer', 'Dancer', 'Plumber', 'Carpenter', 'Scientist', 'Police', 'Firefighter', 'Astronaut', 'Dentist'],
  'Colors': ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Black', 'White', 'Brown', 'Gray', 'Gold', 'Silver', 'Teal', 'Navy', 'Maroon', 'Coral', 'Ivory', 'Beige', 'Crimson'],
  'Food': ['Pizza', 'Burger', 'Sushi', 'Pasta', 'Tacos', 'Salad', 'Steak', 'Ramen', 'Curry', 'Soup', 'Bread', 'Rice', 'Noodles', 'Sandwich', 'Wings', 'Fries', 'Hotdog', 'Waffle', 'Pancake', 'Dumpling'],
};

const neverHaveIEverQuestions = {
  family: [
    'Never have I ever eaten food off the floor.',
    'Never have I ever pretended to be sick to skip school.',
    'Never have I ever cheated at a board game.',
    'Never have I ever talked to myself in the mirror.',
    'Never have I ever forgotten someone\'s name mid-conversation.',
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
    'Never have I ever accidentally liked someone\'s old Instagram photo.',
    'Never have I ever used someone else\'s Netflix password.',
    'Never have I ever lied to get out of plans.',
    'Never have I ever had a wardrobe malfunction in public.',
    'Never have I ever eavesdropped on a stranger\'s conversation.',
    'Never have I ever taken a selfie in the bathroom.',
    'Never have I ever forgotten to mute myself on a video call.',
    'Never have I ever accidentally sent a screenshot to the person I was screenshotting.',
    'Never have I ever said "you too" when a waiter said "enjoy your meal".',
    'Never have I ever waved back at someone who wasn\'t waving at me.',
    'Never have I ever laughed at a joke I didn\'t understand.',
    'Never have I ever pretended to read the menu at a restaurant.',
  ],
  spicy: [
    'Never have I ever had a crush on a friend\'s partner.',
    'Never have I ever kissed someone whose name I didn\'t know.',
    'Never have I ever lied about my body count.',
    'Never have I ever sent a risky text to the wrong person.',
    'Never have I ever been caught in a compromising position.',
    'Never have I ever had a secret relationship.',
    'Never have I ever dated two people at the same time.',
    'Never have I ever flirted with someone just to get something.',
    'Never have I ever been friend-zoned.',
    'Never have I ever friend-zoned someone.',
    'Never have I ever slid into someone\'s DMs.',
    'Never have I ever gone on a date just for a free meal.',
    'Never have I ever had a crush on a celebrity.',
    'Never have I ever practiced kissing on my hand.',
    'Never have I ever lied about being single.',
  ],
};

const wrongAnswerPrompts = [
  'What is the capital of France?',
  'What do cows drink?',
  'What color is the sky on a clear day?',
  'What is 2 + 2?',
  'What do you call a baby dog?',
  'What is the largest planet in our solar system?',
  'What is the main ingredient in guacamole?',
  'How many days are in a week?',
  'What do fish live in?',
  'What is the fastest land animal?',
  'What language do people speak in Brazil?',
  'What do bees make?',
  'What is the opposite of hot?',
  'What do you use to brush your teeth?',
  'What is the freezing point of water in Fahrenheit?',
  'What do birds have that helps them fly?',
  'What is the name of the fairy in Peter Pan?',
  'What planet do we live on?',
  'What is the tallest animal?',
  'What do you call frozen water?',
  'How many legs does a spider have?',
  'What fruit is yellow and curved?',
  'What do you call a person who flies an airplane?',
  'What is the study of rocks called?',
  'What do plants need to grow besides water?',
  'What is the hardest natural substance?',
  'What animal is known as man\'s best friend?',
  'What do you call a shape with three sides?',
  'What color do you get when you mix red and blue?',
  'What is the smallest prime number?',
];

async function seed() {
  console.log('[Seed] Seeding database...');

  // Seed imposter word pairs
  for (const [crew, imposter] of imposterWords) {
    await pool.query(
      `INSERT INTO questions (category, content, game_type, difficulty, metadata)
       VALUES ($1, $2, 'imposter', 'easy', $3)
       ON CONFLICT DO NOTHING`,
      ['words', crew, JSON.stringify({ imposterWord: imposter })]
    );
  }
  console.log(`[Seed] Inserted ${imposterWords.length} imposter word pairs`);

  // Seed Word Rush categories
  let wrCount = 0;
  for (const [category, words] of Object.entries(wordRushCategories)) {
    await pool.query(
      `INSERT INTO questions (category, content, game_type, difficulty, metadata)
       VALUES ($1, $2, 'wordrush', 'easy', $3)
       ON CONFLICT DO NOTHING`,
      [category, JSON.stringify(words), JSON.stringify({ wordCount: words.length })]
    );
    wrCount++;
  }
  console.log(`[Seed] Inserted ${wrCount} word rush categories`);

  // Seed Never Have I Ever questions
  let nhieCount = 0;
  for (const [pack, questions] of Object.entries(neverHaveIEverQuestions)) {
    for (const q of questions) {
      await pool.query(
        `INSERT INTO questions (category, content, game_type, difficulty, metadata)
         VALUES ($1, $2, 'neverhaveiever', 'easy', $3)
         ON CONFLICT DO NOTHING`,
        [pack, q, JSON.stringify({ pack })]
      );
      nhieCount++;
    }
  }
  console.log(`[Seed] Inserted ${nhieCount} NHIE questions`);

  // Seed Wrong Answers prompts
  for (const prompt of wrongAnswerPrompts) {
    await pool.query(
      `INSERT INTO questions (category, content, game_type, difficulty, metadata)
       VALUES ($1, $2, 'wronganswers', 'easy', '{}')
       ON CONFLICT DO NOTHING`,
      ['general', prompt]
    );
  }
  console.log(`[Seed] Inserted ${wrongAnswerPrompts.length} wrong answer prompts`);

  console.log('[Seed] Seeding complete!');
  await pool.end();
}

seed().catch((err) => {
  console.error('[Seed] Error:', err);
  process.exit(1);
});
