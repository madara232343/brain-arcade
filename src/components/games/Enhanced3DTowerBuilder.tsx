
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface Enhanced3DTowerBuilderProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const Enhanced3DTowerBuilder: React.FC<Enhanced3DTowerBuilderProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setTimeout(() => {
      onComplete({
        gameId,
        score: 1200,
        accuracy: 92,
        timeSpent: 120,
        xpEarned: 240
      });
    }, 5000);
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">3D Tower Builder</h3>
        <p className="mb-6">Build the tallest stable tower!</p>
        <button
          onClick={startGame}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start Building
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <h3 className="text-xl font-bold mb-4">Building Tower...</h3>
      <div className="flex flex-col items-center space-y-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`bg-yellow-500 rounded h-6`} style={{ width: `${120 - i * 10}px` }}></div>
        ))}
      </div>
    </div>
  );
};
