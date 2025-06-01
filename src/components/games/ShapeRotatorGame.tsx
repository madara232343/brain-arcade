
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface ShapeRotatorGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const ShapeRotatorGame: React.FC<ShapeRotatorGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setTimeout(() => {
      onComplete({
        gameId,
        score: 720,
        accuracy: 88,
        timeSpent: 45,
        xpEarned: 144
      });
    }, 3000);
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Shape Rotator</h3>
        <p className="mb-6">Rotate shapes to match the target!</p>
        <button
          onClick={startGame}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <h3 className="text-xl font-bold mb-4">Rotating Shapes...</h3>
      <div className="w-32 h-32 bg-cyan-500 mx-auto rounded-lg animate-spin"></div>
    </div>
  );
};
