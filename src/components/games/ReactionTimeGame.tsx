
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface ReactionTimeGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

export const ReactionTimeGame: React.FC<ReactionTimeGameProps> = ({ 
  onComplete, 
  gameId,
  activePowerUps = new Set(),
  onPowerUpUsed
}) => {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'click' | 'too-early' | 'result'>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const startGame = () => {
    setGameState('ready');
    const delay = Math.random() * 3000 + 2000; // 2-5 seconds
    
    setTimeout(() => {
      if (gameState !== 'waiting') {
        setStartTime(Date.now());
        setGameState('click');
      }
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'ready') {
      setGameState('too-early');
      setTimeout(() => {
        setGameState('waiting');
        setReactionTime(0);
      }, 2000);
      return;
    }

    if (gameState === 'click') {
      const endTime = Date.now();
      const reaction = endTime - startTime;
      setReactionTime(reaction);
      
      const newAttempts = [...attempts, reaction];
      setAttempts(newAttempts);
      setCurrentAttempt(currentAttempt + 1);

      // Calculate score based on reaction time
      const attemptScore = Math.max(0, 1000 - reaction);
      setTotalScore(prev => prev + attemptScore);

      if (currentAttempt >= 4) {
        const avgReaction = newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length;
        const accuracy = avgReaction < 300 ? 100 : avgReaction < 500 ? 80 : avgReaction < 800 ? 60 : 40;
        
        let finalScore = totalScore + attemptScore;
        
        // Apply double XP power-up
        if (activePowerUps.has('doubleXP')) {
          finalScore *= 2;
          onPowerUpUsed?.('doubleXP');
        }
        
        onComplete({
          gameId,
          score: Math.round(finalScore),
          accuracy,
          timeSpent: 30,
          xpEarned: Math.round(finalScore / 10)
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

  if (currentAttempt === 0) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">⚡ Reaction Time Test</h3>
        <p className="mb-6 text-sm md:text-base">Test your reflexes! Click when you see green.</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Wait for the red box to turn green</p>
            <p className="text-xs md:text-sm mb-2">• Click as fast as possible when it turns green</p>
            <p className="text-xs md:text-sm">• Complete 5 attempts for final score</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentAttempt(1)}
          className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Test
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-4">
        <p className="text-lg md:text-xl">Attempt {currentAttempt} of 5</p>
        <p className="text-sm md:text-base">Score: {totalScore}</p>
        {attempts.length > 0 && (
          <p className="text-sm">Average: {Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)}ms</p>
        )}
      </div>

      <div 
        className={`w-full max-w-md h-48 md:h-64 mx-auto rounded-xl flex items-center justify-center text-lg md:text-xl font-bold cursor-pointer transition-all duration-300 select-none ${
          gameState === 'waiting' ? 'bg-gray-600' :
          gameState === 'ready' ? 'bg-red-600' :
          gameState === 'click' ? 'bg-green-600' :
          gameState === 'too-early' ? 'bg-red-800' :
          'bg-blue-600'
        }`}
        onClick={handleClick}
        onTouchStart={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        {gameState === 'waiting' && (
          <div className="text-center">
            <p className="text-base md:text-xl">Tap to Start</p>
            <p className="text-xs md:text-sm mt-2">Wait for green, then tap!</p>
          </div>
        )}
        {gameState === 'ready' && <p>Wait for it...</p>}
        {gameState === 'click' && <p>TAP NOW!</p>}
        {gameState === 'too-early' && (
          <div className="text-center">
            <p className="text-base md:text-lg">Too Early!</p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                resetAttempt();
              }}
              className="mt-2 px-4 py-2 bg-blue-500 rounded text-sm md:text-base"
            >
              Try Again
            </button>
          </div>
        )}
        {gameState === 'result' && (
          <div className="text-center">
            <p className="text-lg md:text-xl">{reactionTime}ms</p>
            <p className="text-xs md:text-sm">
              {reactionTime < 200 ? 'Excellent!' : 
               reactionTime < 300 ? 'Great!' : 
               reactionTime < 500 ? 'Good!' : 'Keep practicing!'}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs md:text-sm text-white/70">
        <p className="md:hidden">Tap the box when it turns green</p>
        <p className="hidden md:block">Click the box when it turns green</p>
      </div>
    </div>
  );
};
