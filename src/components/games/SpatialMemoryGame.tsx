
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface SpatialMemoryGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const SpatialMemoryGame: React.FC<SpatialMemoryGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [showSequence, setShowSequence] = useState(false);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState(-1);

  const gridSize = 16; // 4x4 grid

  const generateSequence = () => {
    const newSequence = Array.from({ length: level + 2 }, () => Math.floor(Math.random() * gridSize));
    setSequence(newSequence);
    setUserSequence([]);
    showSequenceToUser(newSequence);
  };

  const showSequenceToUser = (seq: number[]) => {
    setShowSequence(true);
    setCurrentHighlight(-1);
    
    seq.forEach((pos, index) => {
      setTimeout(() => {
        setCurrentHighlight(pos);
        setTimeout(() => setCurrentHighlight(-1), 400);
      }, (index + 1) * 600);
    });
    
    setTimeout(() => {
      setShowSequence(false);
    }, seq.length * 600 + 500);
  };

  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
    setScore(0);
    setGameOver(false);
    setTimeout(() => generateSequence(), 1000);
  };

  const handleCellClick = (index: number) => {
    if (showSequence || gameOver) return;

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    // Check if correct
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      setGameOver(true);
      return;
    }

    // Check if sequence complete
    if (newUserSequence.length === sequence.length) {
      setScore(prev => prev + level * 100);
      setLevel(prev => prev + 1);
      setTimeout(() => generateSequence(), 1000);
    }
  };

  const endGame = () => {
    const accuracy = sequence.length > 0 ? Math.round((level / (level + 1)) * 100) : 0;
    onComplete({
      gameId,
      score,
      accuracy: Math.min(accuracy, 100),
      timeSpent: level * 8,
      xpEarned: Math.round(score / 3)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-2 md:p-4">
        <h3 className="text-lg md:text-2xl font-bold mb-4">🧠 Spatial Memory</h3>
        <p className="mb-6 text-sm md:text-base">Remember the sequence of highlighted squares and repeat it!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Watch the sequence carefully</p>
            <p className="text-xs md:text-sm mb-2">• Click squares in the same order</p>
            <p className="text-xs md:text-sm">• Sequences get longer each level</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 text-sm md:text-base"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white p-2 md:p-4">
        <h3 className="text-lg md:text-xl font-bold mb-4">🎯 Game Over!</h3>
        <div className="space-y-2 text-sm md:text-lg">
          <p>Level Reached: <span className="text-purple-400 font-bold">{level}</span></p>
          <p>Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
        </div>
        <button
          onClick={endGame}
          className="mt-6 bg-purple-500 hover:bg-purple-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-200 text-sm md:text-base"
        >
          Complete Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-2 md:p-4">
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between text-sm md:text-lg mb-4">
          <span>Level: {level}</span>
          <span>Score: {score}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 md:gap-2 max-w-xs md:max-w-sm mx-auto mb-4 md:mb-6">
        {Array.from({ length: gridSize }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            className={`w-12 h-12 md:w-16 md:h-16 rounded-lg transition-all duration-200 ${
              currentHighlight === index ? 'bg-yellow-400 scale-110 shadow-lg' : 'bg-gray-700'
            } ${
              showSequence ? 'cursor-not-allowed' : 'hover:bg-gray-600 active:scale-95'
            }`}
            disabled={showSequence}
          />
        ))}
      </div>

      <div className="mb-4">
        {showSequence && (
          <p className="text-sm md:text-lg text-yellow-400 animate-pulse">
            👀 Watch the sequence... ({sequence.length} positions)
          </p>
        )}
        {!showSequence && sequence.length > 0 && (
          <p className="text-sm md:text-lg text-green-400">
            🎯 Repeat the sequence ({userSequence.length}/{sequence.length})
          </p>
        )}
      </div>
    </div>
  );
};
