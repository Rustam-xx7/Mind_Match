import React from 'react';

/**
 * ScoreBoard Component
 * Displays the current game statistics (Moves, Timer) and the player's personal bests
 * for the currently active difficulty.
 *
 * @param {number} moves - Number of current moves
 * @param {number} time - Elapsed time in seconds
 * @param {number|null} bestMoves - Best moves for this difficulty from localStorage
 * @param {number|null} bestTime - Best time in seconds for this difficulty from localStorage
 * @param {function} onRestart - Callback to restart/reshuffle the game
 */
export default function ScoreBoard({ moves, time, bestMoves, bestTime, onRestart }) {
  // Formats time in seconds to mm:ss layout
  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '--:--';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="w-full max-w-2xl px-4 mb-4">
      <div className="glass-panel rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Current Game Stats */}
        <div className="flex flex-row gap-5 sm:gap-6 justify-around w-full sm:w-auto">
          {/* Timer Display */}
          <div className="flex flex-col items-center min-w-[70px]">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-bold mb-0.5">
              Time
            </span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              {formatTime(time)}
            </span>
          </div>
          
          <div className="w-[1px] h-8 bg-white/10 self-center"></div>
          
          {/* Moves Display */}
          <div className="flex flex-col items-center min-w-[70px]">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-bold mb-0.5">
              Moves
            </span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {moves}
            </span>
          </div>
        </div>

        {/* Vertical Separator (desktop only) */}
        <div className="hidden sm:block w-[1px] h-10 bg-white/10"></div>

        {/* Personal Best Stats */}
        <div className="flex flex-row gap-5 sm:gap-6 justify-around w-full sm:w-auto bg-white/5 rounded-2xl py-2 px-4 border border-white/5">
          {/* Best Time */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
              Best Time
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-cyan-400">
              {formatTime(bestTime)}
            </span>
          </div>
          
          <div className="w-[1px] h-6 bg-white/10 self-center"></div>
          
          {/* Best Moves */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
              Best Moves
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-pink-400">
              {bestMoves !== null ? `${bestMoves} moves` : '---'}
            </span>
          </div>
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-indigo-500/15 flex items-center justify-center gap-2 touch-manipulation"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
          </svg>
          Restart
        </button>
      </div>
    </div>
  );
}
