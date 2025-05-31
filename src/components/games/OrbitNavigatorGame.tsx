
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface OrbitNavigatorGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const OrbitNavigatorGame: React.FC<OrbitNavigatorGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setTimeout(() => {
      onComplete({
        gameId,
        score: 950,
        accuracy: 91,
        timeSpent: 100,
        xpEarned: 190
      });
    }, 4500);
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Orbit Navigator</h3>
        <p className="mb-6">Navigate through orbital paths!</p>
        <button
          onClick={startGame}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start Navigation
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <h3 className="text-xl font-bold mb-4">Navigating Orbit...</h3>
      <div className="relative w-48 h-48 mx-auto">
        <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
};
