// Fisher-Yates Shuffle algorithm: shuffles an array in-place
export const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const EMOJIS = [
  '🐶', '🐱', '🦊', '🐻', '🐼', '🐨', 
  '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', 
  '🐔', '🐧', '🐦', '🦆', '🦅', '🦉'
];

// Generates a shuffled set of cards based on difficulty
export const generateCards = (difficulty) => {
  let numPairs = 8; // easy: 4x4
  if (difficulty === 'medium') numPairs = 12; // 6x4
  else if (difficulty === 'hard') numPairs = 18; // 6x6

  const selectedEmojis = EMOJIS.slice(0, numPairs);
  const cardPairs = [...selectedEmojis, ...selectedEmojis];
  
  const cards = cardPairs.map((symbol, index) => ({
    id: `${difficulty}-${symbol}-${index}`,
    symbol,
    isFlipped: false,
    isMatched: false
  }));
  
  return shuffle(cards);
};
