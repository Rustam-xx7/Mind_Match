import React from 'react';

/**
 * DifficultySelector Component
 * Displays a touch-friendly, glassmorphic button group to select game difficulty.
 * Each difficulty has a distinct gradient indicator and shows its grid dimensions.
 *
 * @param {string} difficulty - Current selected difficulty ('easy', 'medium', 'hard')
 * @param {function} onSelectDifficulty - Callback function when a difficulty is clicked
 */
export default function DifficultySelector({ difficulty, onSelectDifficulty }) {
  const options = [
    { key: 'easy', label: 'Easy', grid: '4x4', color: 'from-blue-500 to-indigo-500' },
    { key: 'medium', label: 'Medium', grid: '6x4', color: 'from-violet-600 to-fuchsia-600' },
    { key: 'hard', label: 'Hard', grid: '6x6', color: 'from-pink-600 to-rose-600' },
  ];

  return (
    <div className="flex flex-col items-center gap-2 mb-4 w-full px-4">
      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400">
        Select Game Mode
      </span>
      <div className="flex p-1 bg-gray-950/70 rounded-2xl border border-white/5 shadow-xl backdrop-blur-xl">
        {options.map((opt) => {
          const isActive = difficulty === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onSelectDifficulty(opt.key)}
              className={`relative px-3 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all duration-300 flex flex-col items-center justify-center min-w-[75px] sm:min-w-[100px] cursor-pointer touch-manipulation ${
                isActive
                  ? `bg-gradient-to-r ${opt.color} text-white shadow-lg shadow-purple-500/20 scale-105 z-10`
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 active:scale-95'
              }`}
            >
              <span className="font-display font-bold tracking-wide leading-none mb-0.5">
                {opt.label}
              </span>
              <span className={`text-[9px] font-mono leading-none ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                {opt.grid}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
