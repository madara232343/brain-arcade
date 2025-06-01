
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface ReactionTimeGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const ReactionTimeGame: React.FC<ReactionTimeGameProps> = ({ onComplete, gameId }) => {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'click' | 'too-early' | 'result'>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(0);

  const startGame = () => {
    setGameState('ready');
    const delay = Math.random() * 3000 + 2000; // 2-5 seconds
    setTimeout(() => {
      setStartTime(Date.now());
      setGameState('click');
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'ready') {
      setGameState('too-early');
      setTimeout(() => setGameState('waiting'), 2000);
      return;
    }

    if (gameState === 'click') {
      const endTime = Date.now();
      const reaction = endTime - startTime;
      setReactionTime(reaction);
      
      const newAttempts = [...attempts, reaction];
      setAttempts(newAttempts);
      setCurrentAttempt(currentAttempt + 1);

      if (currentAttempt >= 4) {
        const avgReaction = newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length;
        const score = Math.max(0, 1000 - avgReaction);
        const accuracy = avgReaction < 300 ? 100 : avgReaction < 500 ? 80 : avgReaction < 800 ? 60 : 40;
        
        onComplete({
          gameId,
          score: Math.round(score),
          accuracy,
          timeSpent: 30,
          xpEarned: Math.round(score / 10)
        });
      } else {
        setGameState('result');
        setTimeout(() => setGameState('waiting'), 2000);
      }
    }
  };

  const resetAttempt = () => {
    setGameState('waiting');
    setReactionTime(0);
  };

  return (
    <div className="text-center text-white p-4">
      <h3 className="text-2xl font-bold mb-4">Reaction Time Test</h3>
      <div className="mb-4">
        <p>Attempt {currentAttempt + 1} of 5</p>
        {attempts.length > 0 && (
          <p>Average: {Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)}ms</p>
        )}
      </div>

      <div 
        className={`w-80 h-80 mx-auto rounded-lg flex items-center justify-center text-xl font-bold cursor-pointer transition-all duration-300 ${
          gameState === 'waiting' ? 'bg-gray-600' :
          gameState === 'ready' ? 'bg-red-600' :
          gameState === 'click' ? 'bg-green-600' :
          gameState === 'too-early' ? 'bg-red-800' :
          'bg-blue-600'
        }`}
        onClick={handleClick}
      >
        {gameState === 'waiting' && (
          <div className="text-center">
            <p>Click to Start</p>
            <p className="text-sm mt-2">Wait for green, then click!</p>
          </div>
        )}
        {gameState === 'ready' && <p>Wait for it...</p>}
        {gameState === 'click' && <p>CLICK NOW!</p>}
        {gameState === 'too-early' && (
          <div className="text-center">
            <p>Too Early!</p>
            <button onClick={resetAttempt} className="mt-2 px-4 py-2 bg-blue-500 rounded">
              Try Again
            </button>
          </div>
        )}
        {gameState === 'result' && (
          <div className="text-center">
            <p>{reactionTime}ms</p>
            <p className="text-sm">
              {reactionTime < 200 ? 'Excellent!' : 
               reactionTime < 300 ? 'Great!' : 
               reactionTime < 500 ? 'Good!' : 'Keep practicing!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
