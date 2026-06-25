import React from 'react';
import Card from './Card';

export default function Board({ cards, difficulty, onCardClick }) {
  const getGridClass = () => {
    switch (difficulty) {
      case 'easy':
        return 'grid-cols-4 max-w-[340px] sm:max-w-[440px]';
      case 'medium':
        // Reflows to 4x6 on mobile portrait to fit viewports, and 6x4 on desktop
        return 'grid-cols-4 sm:grid-cols-6 max-w-[340px] sm:max-w-[640px]';
      case 'hard':
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
