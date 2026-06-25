import React from 'react';

export default function Card({ card, onClick }) {
  const { isFlipped, isMatched, symbol } = card;

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
        {/* Card Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-slate-800 to-purple-700 dark:from-indigo-950 dark:via-slate-900 dark:to-purple-950 border border-indigo-500/30 dark:border-white/10 shadow-lg flex items-center justify-center overflow-hidden transition-all duration-300">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:10px_10px] sm:bg-[size:14px_14px]"></div>
          <div className="absolute w-2/3 h-2/3 rounded-full bg-purple-500/20 dark:bg-purple-500/10 blur-xl"></div>
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-indigo-400/40 dark:border-purple-500/30 flex items-center justify-center bg-white/10 dark:bg-white/5 shadow-inner z-10">
            <span className="text-sm sm:text-base font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              ?
            </span>
          </div>
        </div>

        {/* Card Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/15 shadow-xl flex items-center justify-center overflow-hidden transition-all duration-300">
          {isMatched && (
            <div className="absolute inset-0 bg-emerald-500/5 z-10"></div>
          )}
          <span className="text-2xl sm:text-3.5xl md:text-4xl select-none transform hover:scale-110 transition-transform duration-300">
            {symbol}
          </span>
        </div>
      </div>
    </div>
  );
}
