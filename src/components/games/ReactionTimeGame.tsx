import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface ReactionTimeGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const ReactionTimeGame: React.FC<ReactionTimeGameProps> = ({ onComplete, gameId }) => {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'click' | 'result'>('waiting');
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [clickTime, setClickTime] = useState(0);
  const [tooEarly, setTooEarly] = useState(false);

  const totalRounds = 5;

  const startGame = () => {
    setGameState('ready');
    setCurrentRound(1);
    startRound();
  };

  const startRound = () => {
    setGameState('ready');
    setTooEarly(false);
    
    const delay = Math.random() * 3000 + 2000; // 2-5 seconds
    
    setTimeout(() => {
      setGameState('click');
      setClickTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'ready') {
      setTooEarly(true);
      setTimeout(() => {
        if (currentRound < totalRounds) {
          startRound();
        } else {
          endGame();
        }
      }, 1500);
      return;
    }

    if (gameState === 'click') {
      const reactionTime = Date.now() - clickTime;
      const newReactionTimes = [...reactionTimes, reactionTime];
      setReactionTimes(newReactionTimes);
      setGameState('result');
      
      setTimeout(() => {
        if (currentRound < totalRounds) {
          setCurrentRound(currentRound + 1);
          startRound();
        } else {
          endGame();
        }
      }, 2000);
    }
  };

  const endGame = () => {
    const avgReactionTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    const score = Math.max(0, Math.round(1000 - avgReactionTime));
    const accuracy = 100; // All successful clicks are "accurate"
    const xpEarned = Math.round(score / 10);

    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 60,
      xpEarned
    });
  };

  const getBackgroundColor = () => {
    if (tooEarly) return 'bg-red-500';
    if (gameState === 'click') return 'bg-green-500';
    if (gameState === 'ready') return 'bg-red-600';
    return 'bg-blue-600';
  };

  const getInstruction = () => {
    if (tooEarly) return 'Too early! Wait for green...';
    if (gameState === 'click') return 'CLICK NOW!';
    if (gameState === 'ready') return 'Wait for green...';
    if (gameState === 'result') return `${reactionTimes[reactionTimes.length - 1]}ms`;
    return '';
  };

  if (gameState === 'waiting') {
    return (
      <div className="text-center text-white">
        <h3 className="text-xl font-bold mb-4">Reaction Time Test</h3>
        <p className="mb-6">Click as fast as you can when the screen turns green!</p>
        <p className="mb-6 text-sm text-white/70">You'll do {totalRounds} rounds to test your reflexes.</p>
        <button
          onClick={startGame}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start Test
        </button>
      </div>
    );
  }

  if (reactionTimes.length === totalRounds) {
    const avgReactionTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    const bestTime = Math.min(...reactionTimes);
    
    return (
      <div className="text-center text-white">
        <h3 className="text-xl font-bold mb-4">Test Complete!</h3>
        <div className="space-y-2 mb-6">
          <p>Average Reaction Time: {Math.round(avgReactionTime)}ms</p>
          <p>Best Time: {bestTime}ms</p>
          <p>Score: {Math.max(0, Math.round(1000 - avgReactionTime))} points</p>
        </div>
        <div className="text-sm text-white/70">
          Individual times: {reactionTimes.map(t => `${t}ms`).join(', ')}
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center text-white transition-all duration-200 ${getBackgroundColor()} -m-6 p-6 min-h-[400px] flex flex-col justify-center cursor-pointer`} onClick={handleClick}>
      <div className="mb-4 text-sm">Round {currentRound} of {totalRounds}</div>
      <div className="text-2xl font-bold mb-4">{getInstruction()}</div>
      {gameState === 'result' && (
        <div className="text-lg">
          Round {currentRound} complete!
        </div>
      )}
    </div>
  );
};
