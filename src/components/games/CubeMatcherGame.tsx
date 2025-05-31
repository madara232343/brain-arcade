
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface CubeMatcherGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const CubeMatcherGame: React.FC<CubeMatcherGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setTimeout(() => {
      onComplete({
        gameId,
        score: 680,
        accuracy: 85,
        timeSpent: 75,
        xpEarned: 136
      });
    }, 3500);
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Cube Matcher</h3>
        <p className="mb-6">Match the 3D cube patterns!</p>
        <button
          onClick={startGame}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <h3 className="text-xl font-bold mb-4">Matching Cubes...</h3>
      <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="w-16 h-16 bg-purple-500 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  );
};
