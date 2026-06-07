export const WORD_PAIRS: [string, string][] = [
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
  ['Library', 'Bookstore'], ['Hospital', 'Clinic'], ['Stadium', 'Arena'], ['Church', 'Temple'],
  ['Newspaper', 'Blog'], ['Submarine', 'Ship'], ['Telescope', 'Microscope'], ['Penguin', 'Ostrich'],
  ['Butterfly', 'Moth'], ['Bicycle', 'Scooter'], ['Campfire', 'Fireplace'], ['Lighthouse', 'Tower'],
  ['Passport', 'License'], ['Candle', 'Lamp'], ['Anchor', 'Propeller'], ['Igloo', 'Cabin'],
  ['Comet', 'Asteroid'], ['Sphinx', 'Pyramid'], ['Orchestra', 'Band'], ['Sword', 'Shield'],
  ['Rainbow', 'Aurora'], ['Sandal', 'Boot'], ['Parachute', 'Hang glider'], ['Oasis', 'Mirage'],
  ['Crown', 'Tiara'], ['Dungeon', 'Basement'], ['Fortress', 'Bunker'], ['Harp', 'Banjo'],
  ['Galaxy', 'Nebula'], ['Maze', 'Labyrinth'], ['Tattoo', 'Piercing'], ['Monopoly', 'Chess'],
  ['Dinosaur', 'Mammoth'], ['Coyote', 'Jackal'], ['Kangaroo', 'Wallaby'], ['Crocodile', 'Alligator'],
  ['Dolphin', 'Porpoise'], ['Falcon', 'Hawk'], ['Panther', 'Leopard'], ['Gorilla', 'Chimpanzee'],
  ['Salamander', 'Newt'], ['Tortoise', 'Turtle'], ['Hamster', 'Gerbil'], ['Donkey', 'Mule'],
  ['Cheetah', 'Jaguar'], ['Walrus', 'Seal'], ['Octopus', 'Squid'], ['Lobster', 'Crab'],
  ['Mosquito', 'Fly'], ['Scorpion', 'Tarantula'], ['Pelican', 'Stork'], ['Woodpecker', 'Toucan'],
  ['Hedgehog', 'Porcupine'], ['Platypus', 'Beaver'], ['Koala', 'Sloth'], ['Flamingo', 'Crane'],
  ['Sushi', 'Sashimi'], ['Croissant', 'Donut'], ['Spaghetti', 'Fettuccine'], ['Pancake', 'Waffle'],
  ['Burrito', 'Wrap'], ['Smoothie', 'Milkshake'], ['Pretzel', 'Bagel'], ['Brownie', 'Cookie'],
  ['Lollipop', 'Caramel'], ['Marshmallow', 'Meringue'],
];

export function getRandomWordPair(): { crewWord: string; imposterWord: string } {
  const [crewWord, imposterWord] = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
  return { crewWord, imposterWord };
}
