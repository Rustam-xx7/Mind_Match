import React from 'react';
import Card from './Card';

/**
 * Board Component
 * Renders the responsive grid of Cards. It dynamically adjusts the number of grid columns
 * based on the active difficulty level and screen width to ensure the grid fits the viewport.
 * 
 * @param {Array} cards - The array of card objects currently on the board
 * @param {string} difficulty - Current difficulty ('easy', 'medium', 'hard')
 * @param {function} onCardClick - Callback function invoked when a card is clicked
 */
export default function Board({ cards, difficulty, onCardClick }) {
  // Helper to determine CSS Grid column classes and max-widths based on difficulty
  const getGridClass = () => {
    switch (difficulty) {
      case 'easy':
        // 4x4 grid (16 cards) - fits perfectly in 4 columns
        return 'grid-cols-4 max-w-[340px] sm:max-w-[440px]';
      case 'medium':
        // 6x4 grid (24 cards) - reflows to 4x6 on mobile to fit portrait screens, and 6x4 on sm+ screens
        return 'grid-cols-4 sm:grid-cols-6 max-w-[340px] sm:max-w-[640px]';
      case 'hard':
        // 6x6 grid (36 cards) - stays 6x6, using smaller padding/gaps on mobile
        return 'grid-cols-6 max-w-[350px] sm:max-w-[640px]';
      default:
        return 'grid-cols-4 max-w-[340px] sm:max-w-[440px]';
    }
  };

  return (
    <div className="w-full px-4 flex justify-center items-center py-2">
      <div className={`grid ${getGridClass()} gap-1.5 sm:gap-3.5 w-full justify-items-center items-center`}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            onClick={() => onCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
