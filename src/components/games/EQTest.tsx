
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface EQTestProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const EQTest: React.FC<EQTestProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setTimeout(() => {
      onComplete({
        gameId,
        score: 1300,
        accuracy: 93,
        timeSpent: 240,
        xpEarned: 260
      });
    }, 6000);
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Emotional Intelligence Test</h3>
        <p className="mb-6">Assess your emotional intelligence!</p>
        <button
          onClick={startGame}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start EQ Test
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <h3 className="text-xl font-bold mb-4">Evaluating Emotional Intelligence...</h3>
      <div className="w-24 h-24 bg-pink-500 rounded-full mx-auto animate-pulse"></div>
      <p className="mt-4">Understanding emotional patterns...</p>
    </div>
  );
};
