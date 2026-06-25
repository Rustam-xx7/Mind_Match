import React from 'react';

export default function DifficultySelector({ difficulty, onSelectDifficulty }) {
  const options = [
    { key: 'easy', label: 'Easy', grid: '4x4', color: 'from-blue-500 to-indigo-500' },
    { key: 'medium', label: 'Medium', grid: '6x4', color: 'from-violet-600 to-fuchsia-600' },
    { key: 'hard', label: 'Hard', grid: '6x6', color: 'from-pink-600 to-rose-600' },
  ];

  return (
    <div className="flex flex-col items-center gap-2 mb-4 w-full px-4">
      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400 transition-colors">
        Select Game Mode
      </span>
      <div className="flex p-1 bg-slate-200/50 dark:bg-gray-950/70 rounded-2xl border border-slate-300/60 dark:border-white/5 shadow-md dark:shadow-xl backdrop-blur-xl transition-all">
        {options.map((opt) => {
          const isActive = difficulty === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onSelectDifficulty(opt.key)}
              className={`relative px-3 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all duration-300 flex flex-col items-center justify-center min-w-[75px] sm:min-w-[100px] cursor-pointer touch-manipulation ${
                isActive
                  ? `bg-gradient-to-r ${opt.color} text-white shadow-lg shadow-purple-500/20 scale-105 z-10`
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 hover:bg-slate-300/40 dark:hover:bg-white/5 active:scale-95'
              }`}
            >
              <span className="font-display font-bold tracking-wide leading-none mb-0.5">
                {opt.label}
              </span>
              <span className={`text-[9px] font-mono leading-none ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-gray-500'}`}>
                {opt.grid}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
