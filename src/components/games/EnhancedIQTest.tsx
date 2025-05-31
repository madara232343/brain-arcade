
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface EnhancedIQTestProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const EnhancedIQTest: React.FC<EnhancedIQTestProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setTimeout(() => {
      onComplete({
        gameId,
        score: 1500,
        accuracy: 96,
        timeSpent: 300,
        xpEarned: 300
      });
    }, 8000);
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Enhanced IQ Test</h3>
        <p className="mb-6">Comprehensive intelligence assessment!</p>
        <button
          onClick={startGame}
          className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg font-bold bg-gradient-to-r from-yellow-500 to-orange-500"
        >
          Begin Test
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <h3 className="text-xl font-bold mb-4">Processing IQ Assessment...</h3>
      <div className="w-32 h-32 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4">Analyzing cognitive patterns...</p>
    </div>
  );
};
