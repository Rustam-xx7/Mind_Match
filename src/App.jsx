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
        // Matched: Mark permanently after flip completes
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
        // Mismatch: Flip back after 800ms
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
    <div className="w-full min-h-screen flex flex-col items-center pb-12">
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
