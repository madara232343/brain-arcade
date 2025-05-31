
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface PuzzleBlocksGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const PuzzleBlocksGame: React.FC<PuzzleBlocksGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setTimeout(() => {
      onComplete({
        gameId,
        score: 850,
        accuracy: 90,
        timeSpent: 60,
        xpEarned: 170
      });
    }, 3000);
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Puzzle Blocks</h3>
        <p className="mb-6">Arrange blocks to complete the puzzle!</p>
        <button
          onClick={startGame}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <h3 className="text-xl font-bold mb-4">Solving Puzzle...</h3>
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-12 h-12 bg-indigo-500 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
};
