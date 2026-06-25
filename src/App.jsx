import React, { useState, useEffect, useCallback } from 'react';
import DifficultySelector from './components/DifficultySelector';
import ScoreBoard from './components/ScoreBoard';
import Board from './components/Board';
import WinModal from './components/WinModal';
import { generateCards } from './utils/gameAssets';

export default function App() {
  const [difficulty, setDifficulty] = useState('easy');
  const [cards, setCards] = useState(() => generateCards('easy'));
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const [isNewBestTime, setIsNewBestTime] = useState(false);
  const [isNewBestMoves, setIsNewBestMoves] = useState(false);

  // Load theme from localStorage or fallback to system preference
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('mindmatch_theme');
    if (saved) return saved;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  const [bestScores, setBestScores] = useState(() => {
    const saved = localStorage.getItem('mindmatch_best_scores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      easy: { moves: null, time: null },
      medium: { moves: null, time: null },
      hard: { moves: null, time: null },
    };
  });

  // Apply theme class to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mindmatch_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Handles the timer increment
  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive]);

  const resetGame = useCallback((targetDifficulty = difficulty) => {
    setCards(generateCards(targetDifficulty));
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setIsTimerActive(false);
    setGameStarted(false);
    setGameWon(false);
    setIsNewBestTime(false);
    setIsNewBestMoves(false);
  }, [difficulty]);

  const handleSelectDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
    resetGame(newDifficulty);
  };

  const handleWin = useCallback((finalMoves, finalTime) => {
    setIsTimerActive(false);
    setGameWon(true);

    const currentBest = bestScores[difficulty];
    let newBestTime = false;
    let newBestMoves = false;

    if (currentBest.time === null || finalTime < currentBest.time) {
      newBestTime = true;
    }
    if (currentBest.moves === null || finalMoves < currentBest.moves) {
      newBestMoves = true;
    }

    if (newBestTime || newBestMoves) {
      const updatedScores = {
        ...bestScores,
        [difficulty]: {
          time: newBestTime ? finalTime : currentBest.time,
          moves: newBestMoves ? finalMoves : currentBest.moves,
        },
      };
      setBestScores(updatedScores);
      localStorage.setItem('mindmatch_best_scores', JSON.stringify(updatedScores));
    }

    setIsNewBestTime(newBestTime);
    setIsNewBestMoves(newBestMoves);
  }, [bestScores, difficulty]);

  const handleCardClick = (clickedIndex) => {
    if (flippedCards.length === 2) return;

    const clickedCard = cards[clickedIndex];

    if (!gameStarted) {
      setGameStarted(true);
      setIsTimerActive(true);
    }

    const updatedCards = [...cards];
    updatedCards[clickedIndex] = { ...clickedCard, isFlipped: true };
    setCards(updatedCards);

    const newFlipped = [...flippedCards, clickedIndex];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      setMoves((prev) => prev + 1);

      if (firstCard.symbol === secondCard.symbol) {
        setTimeout(() => {
          setCards((prevCards) => {
            const nextCards = [...prevCards];
            nextCards[firstIdx] = { ...nextCards[firstIdx], isMatched: true };
            nextCards[secondIdx] = { ...nextCards[secondIdx], isMatched: true };

            const allMatched = nextCards.every((c) => c.isMatched);
            if (allMatched) {
              handleWin(moves + 1, time);
            }
            return nextCards;
          });
          setFlippedCards([]);
        }, 250);
      } else {
        setTimeout(() => {
          setCards((prevCards) => {
            const nextCards = [...prevCards];
            nextCards[firstIdx] = { ...nextCards[firstIdx], isFlipped: false };
            nextCards[secondIdx] = { ...nextCards[secondIdx], isFlipped: false };
            return nextCards;
          });
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  const activeBestScore = bestScores[difficulty] || { moves: null, time: null };

  return (
    <div className="w-full min-h-screen flex flex-col items-center pb-12 relative">
      {/* Floating Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2.5 rounded-2xl bg-slate-200/70 dark:bg-slate-900/60 text-slate-700 dark:text-gray-300 hover:bg-slate-300/80 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 border border-slate-300/40 dark:border-white/5 shadow-md hover:shadow-lg cursor-pointer touch-manipulation z-20"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <header className="flex flex-col items-center mt-6 sm:mt-8 mb-4 text-center px-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl sm:text-3xl animate-pulse">✨</span>
          <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 transition-all duration-300">
            MindMatch
          </h1>
          <span className="text-2xl sm:text-3xl animate-pulse">✨</span>
        </div>
        <p className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm font-medium tracking-wide transition-colors">
          Train your brain with our premium 3D card matching challenge
        </p>
      </header>

      <DifficultySelector
        difficulty={difficulty}
        onSelectDifficulty={handleSelectDifficulty}
      />

      <ScoreBoard
        moves={moves}
        time={time}
        bestMoves={activeBestScore.moves}
        bestTime={activeBestScore.time}
        onRestart={() => resetGame()}
      />

      <Board
        cards={cards}
        difficulty={difficulty}
        onCardClick={handleCardClick}
      />

      <WinModal
        isOpen={gameWon}
        moves={moves}
        time={time}
        isNewBestTime={isNewBestTime}
        isNewBestMoves={isNewBestMoves}
        onRestart={() => resetGame()}
      />
    </div>
  );
}
