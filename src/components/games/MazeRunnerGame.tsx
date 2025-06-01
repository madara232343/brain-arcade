
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface MazeRunnerGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const MazeRunnerGame: React.FC<MazeRunnerGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setTimeout(() => {
      onComplete({
        gameId,
        score: 900,
        accuracy: 95,
        timeSpent: 90,
        xpEarned: 180
      });
    }, 4000);
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Maze Runner</h3>
        <p className="mb-6">Navigate through the maze to reach the exit!</p>
        <button
          onClick={startGame}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <h3 className="text-xl font-bold mb-4">Running Through Maze...</h3>
      <div className="grid grid-cols-8 gap-1 max-w-sm mx-auto">
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className={`w-6 h-6 ${Math.random() > 0.3 ? 'bg-gray-800' : 'bg-green-500'} rounded`}></div>
        ))}
      </div>
    </div>
  );
};
