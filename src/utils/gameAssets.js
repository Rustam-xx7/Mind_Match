/**
 * Fisher-Yates Shuffle Algorithm
 * Shuffles an array in-place with O(n) time complexity.
 * It works by traversing the array from the last element to the first,
 * swapping the current element with a randomly selected element from the remaining unshuffled portion.
 * 
 * @param {Array} array - The array to shuffle
 * @returns {Array} A new shuffled array
 */
export const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements arr[i] and arr[j]
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// 18 vibrant, distinct animal emojis representing the maximum pairs (for Hard 6x6 difficulty = 18 pairs)
export const EMOJIS = [
  '🐶', '🐱', '🦊', '🐻', '🐼', '🐨', 
  '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', 
  '🐔', '🐧', '🐦', '🦆', '🦅', '🦉'
];

/**
 * Generates a list of shuffled cards based on the selected difficulty level.
 * 
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Array} Array of card objects
 */
export const generateCards = (difficulty) => {
  let numPairs = 8; // Default to Easy (4x4 = 16 cards)
  
  if (difficulty === 'medium') {
    numPairs = 12; // Medium (6x4 = 24 cards)
  } else if (difficulty === 'hard') {
    numPairs = 18; // Hard (6x6 = 36 cards)
  }
  
  // Select the subset of emojis needed for this difficulty
  const selectedEmojis = EMOJIS.slice(0, numPairs);
  
  // Duplicate emojis to form pairs
  const cardPairs = [...selectedEmojis, ...selectedEmojis];
  
  // Map to card objects with unique IDs and initial states
  const cards = cardPairs.map((symbol, index) => ({
    id: `${difficulty}-${symbol}-${index}`, // Unique ID
    symbol,
    isFlipped: false,
    isMatched: false
  }));
  
  // Shuffle cards using the Fisher-Yates algorithm
  return shuffle(cards);
};
