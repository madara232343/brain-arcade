import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface PatternMatchGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Pattern {
  id: number;
  shape: string;
  color: string;
  size: string;
}

const shapes = ['●', '■', '▲', '♦', '★', '♠', '♥', '♣'];
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
const sizes = ['text-xl', 'text-2xl', 'text-3xl'];

export const PatternMatchGame: React.FC<PatternMatchGameProps> = ({ onComplete, gameId }) => {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [targetPattern, setTargetPattern] = useState<Pattern | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [startTime, setStartTime] = useState(0);

  const generatePattern = (): Pattern => ({
    id: Math.random(),
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    size: sizes[Math.floor(Math.random() * sizes.length)]
  });

  const generatePatterns = () => {
    const newTarget = generatePattern();
    const newPatterns = [newTarget];
    
    // Add similar patterns as distractors
    for (let i = 0; i < 8; i++) {
      newPatterns.push(generatePattern());
    }
    
    // Shuffle the patterns
    const shuffled = newPatterns.sort(() => Math.random() - 0.5);
    setPatterns(shuffled);
    setTargetPattern(newTarget);
  };

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    generatePatterns();
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted, gameOver]);

  const handlePatternClick = (pattern: Pattern) => {
    if (!targetPattern || gameOver) return;

    const isMatch = pattern.shape === targetPattern.shape && 
                   pattern.color === targetPattern.color && 
                   pattern.size === targetPattern.size;

    if (isMatch) {
      setScore(prev => prev + (10 + streak * 2));
      setStreak(prev => prev + 1);
      generatePatterns();
    } else {
      setStreak(0);
      setScore(prev => Math.max(0, prev - 5));
    }
  };

  const endGame = () => {
    setGameOver(true);
    const timeSpent = 30;
    const accuracy = Math.round((score / Math.max(1, score + streak)) * 100);
    const xpEarned = Math.round(score / 2);

    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent,
      xpEarned
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white">
        <h3 className="text-2xl font-bold mb-4">🎯 Pattern Match</h3>
        <p className="mb-6 text-lg">Find the exact match for the target pattern!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-4">
            <p className="text-sm">• Look at the target pattern</p>
            <p className="text-sm">• Find the exact match (shape, color, size)</p>
            <p className="text-sm">• Work quickly for bonus points</p>
            <p className="text-sm">• Build streaks for multipliers</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white">
        <h3 className="text-2xl font-bold mb-4">🏆 Pattern Master!</h3>
        <div className="space-y-2 text-lg">
          <p>Final Score: {score} points</p>
          <p>Best Streak: {streak}</p>
          <p>Great pattern recognition skills!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-white">
      <div className="flex justify-between mb-6 text-lg">
        <div>Time: {timeLeft}s</div>
        <div>Score: {score}</div>
        <div>Streak: {streak}</div>
      </div>

      {targetPattern && (
        <div className="mb-6">
          <p className="text-lg mb-2">Find this pattern:</p>
          <div className="bg-white/20 rounded-xl p-6 inline-block">
            <div 
              className={`${targetPattern.size} font-bold animate-pulse`}
              style={{ color: targetPattern.color }}
            >
              {targetPattern.shape}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        {patterns.map((pattern, index) => (
          <button
            key={index}
            onClick={() => handlePatternClick(pattern)}
            className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all duration-200 hover:scale-105 border border-white/30 hover:border-white/60"
          >
            <div 
              className={`${pattern.size} font-bold`}
              style={{ color: pattern.color }}
            >
              {pattern.shape}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
