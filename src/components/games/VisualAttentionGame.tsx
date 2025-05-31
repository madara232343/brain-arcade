
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface VisualAttentionGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Target {
  id: number;
  x: number;
  y: number;
  isTarget: boolean;
}

export const VisualAttentionGame: React.FC<VisualAttentionGameProps> = ({ onComplete, gameId }) => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);

  const generateTargets = () => {
    const newTargets: Target[] = [];
    const numTargets = 5 + round;
    const numRealTargets = Math.max(1, Math.floor(numTargets / 3));

    for (let i = 0; i < numTargets; i++) {
      newTargets.push({
        id: i,
        x: Math.random() * 80 + 10, // 10% to 90% of container width
        y: Math.random() * 80 + 10, // 10% to 90% of container height
        isTarget: i < numRealTargets
      });
    }

    setTargets(newTargets.sort(() => Math.random() - 0.5));
    
    // Auto-advance after showing targets
    setTimeout(() => {
      setTargets([]);
      setRound(round + 1);
      setTimeout(generateTargets, 1000);
    }, 3000);
  };

  const startGame = () => {
    setGameStarted(true);
    generateTargets();
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const handleTargetClick = (target: Target) => {
    if (target.isTarget) {
      setScore(score + 10);
      setHits(hits + 1);
    } else {
      setMisses(misses + 1);
    }
    
    setTargets(targets.filter(t => t.id !== target.id));
  };

  const endGame = () => {
    const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 60 - timeLeft,
      xpEarned: Math.round(score / 3)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Visual Attention</h3>
        <p className="mb-6">Click only the red targets, avoid the blue distractors!</p>
        <button
          onClick={startGame}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-4">
        <div className="flex justify-between text-lg">
          <span>Round: {round}</span>
          <span>Score: {score}</span>
          <span>Time: {timeLeft}s</span>
        </div>
        <div className="flex justify-center space-x-4 text-sm mt-2">
          <span className="text-green-400">Hits: {hits}</span>
          <span className="text-red-400">Misses: {misses}</span>
        </div>
      </div>

      <div className="relative w-full h-96 bg-gray-800 rounded-lg border-2 border-gray-600 overflow-hidden">
        {targets.map((target) => (
          <button
            key={target.id}
            onClick={() => handleTargetClick(target)}
            className={`absolute w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 ${
              target.isTarget 
                ? 'bg-red-500 hover:bg-red-400' 
                : 'bg-blue-500 hover:bg-blue-400'
            }`}
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
        
        {targets.length === 0 && round <= 10 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xl text-yellow-400">Get ready for round {round}...</p>
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-400">
        Click the red targets quickly! Avoid the blue ones.
      </p>
    </div>
  );
};
