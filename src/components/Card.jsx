import React from 'react';

/**
 * Card Component
 * Renders an individual game card with a smooth 3D flip transition.
 * 
 * @param {object} card - The card object containing id, symbol, isFlipped, and isMatched
 * @param {function} onClick - Callback function when the card is clicked
 */
export default function Card({ card, onClick }) {
  const { isFlipped, isMatched, symbol } = card;

  // Clicks are ignored if the card is already flipped or matched
  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full aspect-square perspective-1000 cursor-pointer select-none active:scale-95 transition-transform duration-150 touch-manipulation"
    >
      <div
        className={`w-full h-full preserve-3d transition-transform duration-500 ease-out ${
          isFlipped || isMatched ? 'rotate-y-180' : ''
        } ${isMatched ? 'animate-match' : ''}`}
      >
        {/* Card Back (Face Down) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-white/10 shadow-lg flex items-center justify-center overflow-hidden">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:10px_10px] sm:bg-[size:14px_14px]"></div>
          
          {/* Inner ambient glow */}
          <div className="absolute w-2/3 h-2/3 rounded-full bg-purple-500/10 blur-xl"></div>
          
          {/* Sleek central emblem */}
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-purple-500/30 flex items-center justify-center bg-white/5 shadow-inner z-10">
            <span className="text-sm sm:text-base font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">
              ?
            </span>
          </div>
        </div>

        {/* Card Front (Face Up / Revealed) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-slate-900 border-2 border-white/15 shadow-xl flex items-center justify-center overflow-hidden">
          {/* Soft green overlay when matched */}
          {isMatched && (
            <div className="absolute inset-0 bg-emerald-500/5 z-10"></div>
          )}
          {/* Emoji Symbol */}
          <span className="text-2xl sm:text-3.5xl md:text-4xl select-none transform hover:scale-110 transition-transform duration-300">
            {symbol}
          </span>
        </div>
      </div>
    </div>
  );
}
