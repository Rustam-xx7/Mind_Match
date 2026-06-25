import React, { useState, useEffect, useCallback } from 'react';
import DifficultySelector from './components/DifficultySelector';
import ScoreBoard from './components/ScoreBoard';
import Board from './components/Board';
import WinModal from './components/WinModal';
import { generateCards } from './utils/gameAssets';

/**
 * App Component
 * The central brain of the MindMatch game. It maintains state for the active difficulty,
 * the card board, elapsed time, move count, and player records.
 */
export default function App() {
  // --------------------------------------------------------
  // 1. State Declarations
  // --------------------------------------------------------
  const [difficulty, setDifficulty] = useState('easy');
  const [cards, setCards] = useState(() => generateCards('easy'));
  const [flippedCards, setFlippedCards] = useState([]); // Tracks indices of flipped cards (max 2)
  const [moves, setMoves] = useState(0); // Moves counter
  const [time, setTime] = useState(0); // Elapsed time in seconds
  const [isTimerActive, setIsTimerActive] = useState(false); // Controls timer interval
  const [gameStarted, setGameStarted] = useState(false); // Flags if first card was clicked
  const [gameWon, setGameWon] = useState(false); // Flags if all pairs are matched

  // Local record tracking for the win modal celebrate badges
  const [isNewBestTime, setIsNewBestTime] = useState(false);
  const [isNewBestMoves, setIsNewBestMoves] = useState(false);

  // Load best scores from localStorage, or initialize empty structure
  const [bestScores, setBestScores] = useState(() => {
    const saved = localStorage.getItem('mindmatch_best_scores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved best scores', e);
      }
    }
    return {
      easy: { moves: null, time: null },
      medium: { moves: null, time: null },
      hard: { moves: null, time: null },
    };
  });

  // --------------------------------------------------------
  // 2. Timer Logic
  // --------------------------------------------------------
  // Manages the elapsed time timer using a standard React useEffect.
  // It sets up a 1-second interval when active and cleans it up when inactive or unmounted.
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

  // --------------------------------------------------------
  // 3. Game State Reset
  // --------------------------------------------------------
  // Resets all game states, generates and shuffles a new board.
  // Can be invoked with an optional target difficulty (e.g., when switching modes).
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

  // Handle manual difficulty change
  const handleSelectDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
    resetGame(newDifficulty);
  };

  // --------------------------------------------------------
  // 4. Win Evaluation Logic
  // --------------------------------------------------------
  // Triggered when all cards are matched. Stops timer and checks/saves high scores.
  const handleWin = useCallback((finalMoves, finalTime) => {
    setIsTimerActive(false);
    setGameWon(true);

    const currentBest = bestScores[difficulty];
    let newBestTime = false;
    let newBestMoves = false;

    // Check if new time beats best time (or if no best time exists)
    if (currentBest.time === null || finalTime < currentBest.time) {
      newBestTime = true;
    }
    // Check if new moves beat best moves (or if no best moves exists)
    if (currentBest.moves === null || finalMoves < currentBest.moves) {
      newBestMoves = true;
    }

    // Update state and save to localStorage only for the categories that were beaten
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

  // --------------------------------------------------------
  // 5. Card Click & Matching Loop
  // --------------------------------------------------------
  // Core gameplay loop evaluating selections and matching logic.
  const handleCardClick = (clickedIndex) => {
    // 1. Lock clicks if we are already evaluating a pair
    if (flippedCards.length === 2) return;

    const clickedCard = cards[clickedIndex];

    // 2. Start the timer on the very first click of a new game
    if (!gameStarted) {
      setGameStarted(true);
      setIsTimerActive(true);
    }

    // 3. Flip the clicked card in our board array
    const updatedCards = [...cards];
    updatedCards[clickedIndex] = { ...clickedCard, isFlipped: true };
    setCards(updatedCards);

    const newFlipped = [...flippedCards, clickedIndex];
    setFlippedCards(newFlipped);

    // 4. Evaluate matching if this is the second card flipped
    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      // Increment move counter (1 move = 1 pair attempt)
      setMoves((prev) => prev + 1);

      // Check if symbols match
      if (firstCard.symbol === secondCard.symbol) {
        // MATCH: Keep them face-up permanently.
        // We wrap in a small timeout to let the card 3D flip finish first.
        setTimeout(() => {
          setCards((prevCards) => {
            const nextCards = [...prevCards];
            nextCards[firstIdx] = { ...nextCards[firstIdx], isMatched: true };
            nextCards[secondIdx] = { ...nextCards[secondIdx], isMatched: true };

            // Check if all cards are matched (Win condition)
            const allMatched = nextCards.every((c) => c.isMatched);
            if (allMatched) {
              // Since moves state updates asynchronously, we pass the actual final count (moves + 1)
              handleWin(moves + 1, time);
            }
            return nextCards;
          });
          setFlippedCards([]);
        }, 250);
      } else {
        // NO MATCH: Flip both back face-down after a short delay (800ms)
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

  // Get high scores for current difficulty to display on ScoreBoard
  const activeBestScore = bestScores[difficulty] || { moves: null, time: null };

  return (
    <div className="w-full min-h-screen flex flex-col items-center pb-12">
      {/* Header Panel */}
      <header className="flex flex-col items-center mt-6 sm:mt-8 mb-4 text-center px-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl sm:text-3xl animate-pulse">✨</span>
          <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            MindMatch
          </h1>
          <span className="text-2xl sm:text-3xl animate-pulse">✨</span>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm font-medium tracking-wide">
          Train your brain with our premium 3D card matching challenge
        </p>
      </header>

      {/* Difficulty Button Selector */}
      <DifficultySelector
        difficulty={difficulty}
        onSelectDifficulty={handleSelectDifficulty}
      />

      {/* Stats Dashboard */}
      <ScoreBoard
        moves={moves}
        time={time}
        bestMoves={activeBestScore.moves}
        bestTime={activeBestScore.time}
        onRestart={() => resetGame()}
      />

      {/* Grid Board */}
      <Board
        cards={cards}
        difficulty={difficulty}
        onCardClick={handleCardClick}
      />

      {/* Celebratory Win Modal Overlay */}
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
