export const CATEGORIES: Record<string, string[]> = {
  'Animals': ['Dog', 'Cat', 'Elephant', 'Tiger', 'Penguin', 'Dolphin', 'Eagle', 'Lion', 'Bear', 'Wolf', 'Fox', 'Rabbit', 'Snake', 'Horse', 'Giraffe', 'Koala', 'Panda', 'Owl', 'Shark', 'Whale'],
  'Fruits': ['Apple', 'Banana', 'Orange', 'Grape', 'Strawberry', 'Mango', 'Pineapple', 'Watermelon', 'Peach', 'Cherry', 'Kiwi', 'Lemon', 'Coconut', 'Blueberry', 'Plum', 'Pear', 'Fig', 'Papaya', 'Lime', 'Guava'],
  'Countries': ['France', 'Japan', 'Brazil', 'Egypt', 'Canada', 'India', 'Italy', 'Mexico', 'Germany', 'Spain', 'China', 'Russia', 'Australia', 'Korea', 'Sweden', 'Norway', 'Greece', 'Turkey', 'Peru', 'Chile'],
  'Movies': ['Titanic', 'Avatar', 'Inception', 'Joker', 'Frozen', 'Rocky', 'Alien', 'Matrix', 'Shrek', 'Gladiator'],
  'Sports': ['Soccer', 'Tennis', 'Basketball', 'Baseball', 'Hockey', 'Golf', 'Swimming', 'Boxing', 'Cricket', 'Rugby'],
  'Jobs': ['Doctor', 'Teacher', 'Engineer', 'Chef', 'Pilot', 'Artist', 'Lawyer', 'Nurse', 'Farmer', 'Writer'],
  'Colors': ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Black', 'White', 'Brown'],
  'Food': ['Pizza', 'Burger', 'Sushi', 'Pasta', 'Tacos', 'Salad', 'Steak', 'Ramen', 'Curry', 'Soup'],
};

export function getRandomCategory(): { name: string; words: string[] } {
  const keys = Object.keys(CATEGORIES);
  const name = keys[Math.floor(Math.random() * keys.length)];
  return { name, words: CATEGORIES[name] };
}
