
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
      const nextAttempt = currentAttempt + 1;
      setCurrentAttempt(nextAttempt);

      if (nextAttempt >= 5) {
        // Game complete after 5 attempts
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
    <div className="text-center text-white p-2 md:p-4">
      <h3 className="text-lg md:text-2xl font-bold mb-4">⚡ Reaction Time Test</h3>
      <div className="mb-4">
        <p className="text-sm md:text-base">Attempt {currentAttempt + 1} of 5</p>
        {attempts.length > 0 && (
          <p className="text-sm md:text-base">Average: {Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)}ms</p>
        )}
      </div>

      <div 
        className={`w-full max-w-xs md:max-w-sm h-48 md:h-80 mx-auto rounded-lg flex items-center justify-center text-base md:text-xl font-bold cursor-pointer transition-all duration-300 touch-target ${
          gameState === 'waiting' ? 'bg-gray-600' :
          gameState === 'ready' ? 'bg-red-600' :
          gameState === 'click' ? 'bg-green-600' :
          gameState === 'too-early' ? 'bg-red-800' :
          'bg-blue-600'
        }`}
        onClick={handleClick}
      >
        {gameState === 'waiting' && (
          <div className="text-center px-4">
            <p className="text-sm md:text-lg">Click to Start</p>
            <p className="text-xs md:text-sm mt-2">Wait for green, then click!</p>
          </div>
        )}
        {gameState === 'ready' && <p className="text-sm md:text-lg">Wait for it...</p>}
        {gameState === 'click' && <p className="text-sm md:text-lg">CLICK NOW!</p>}
        {gameState === 'too-early' && (
          <div className="text-center">
            <p className="text-sm md:text-lg">Too Early!</p>
            <button onClick={resetAttempt} className="mt-2 px-3 md:px-4 py-2 bg-blue-500 rounded text-xs md:text-sm">
              Try Again
            </button>
          </div>
        )}
        {gameState === 'result' && (
          <div className="text-center">
            <p className="text-sm md:text-lg">{reactionTime}ms</p>
            <p className="text-xs md:text-sm">
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
