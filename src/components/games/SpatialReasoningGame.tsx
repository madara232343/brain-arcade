
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface SpatialReasoningGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const SpatialReasoningGame: React.FC<SpatialReasoningGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    // Simulate game completion for now
    setTimeout(() => {
      onComplete({
        gameId,
        score: 750,
        accuracy: 85,
        timeSpent: 45,
        xpEarned: 150
      });
    }, 3000);
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Spatial Reasoning</h3>
        <p className="mb-6">Rotate and match 3D objects!</p>
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
      <h3 className="text-xl font-bold mb-4">Playing Spatial Reasoning...</h3>
      <div className="animate-pulse">
        <div className="w-32 h-32 bg-purple-500 mx-auto rounded-lg mb-4"></div>
        <p>Analyzing spatial patterns...</p>
      </div>
    </div>
  );
};
