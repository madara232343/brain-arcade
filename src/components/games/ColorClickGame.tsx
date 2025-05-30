
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface ColorClickGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const ColorClickGame: React.FC<ColorClickGameProps> = ({ onComplete, gameId }) => {
  const [targetColor, setTargetColor] = useState('');
  const [colors, setColors] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  const colorNames = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
  const colorValues = {
    red: '#EF4444',
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    purple: '#8B5CF6',
    orange: '#F97316',
    pink: '#EC4899',
    cyan: '#06B6D4'
  };

  const generateRound = () => {
    const newTargetColor = colorNames[Math.floor(Math.random() * colorNames.length)];
    const newColors = [newTargetColor];
    
    // Add random colors
    while (newColors.length < 9) {
      const randomColor = colorNames[Math.floor(Math.random() * colorNames.length)];
      newColors.push(randomColor);
    }
    
    // Shuffle array
    setColors(newColors.sort(() => Math.random() - 0.5));
    setTargetColor(newTargetColor);
  };

  const startGame = () => {
    setGameStarted(true);
    generateRound();
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted, gameOver]);

  const handleColorClick = (clickedColor: string) => {
    if (gameOver) return;

    setTotalClicks(prev => prev + 1);

    if (clickedColor === targetColor) {
      setScore(prev => prev + 10);
      setCorrectClicks(prev => prev + 1);
      generateRound();
    } else {
      setScore(prev => Math.max(0, prev - 2));
    }
  };

  const endGame = () => {
    setGameOver(true);
    const accuracy = totalClicks > 0 ? Math.round((correctClicks / totalClicks) * 100) : 0;
    
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 30,
      xpEarned: Math.round(score / 2)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-6">
        <h3 className="text-2xl font-bold mb-4">🎨 Color Click</h3>
        <p className="mb-6">Click the correct color as fast as you can!</p>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white p-6">
        <h3 className="text-2xl font-bold mb-4">🎨 Color Master!</h3>
        <div className="space-y-2 text-lg">
          <p>Score: {score} points</p>
          <p>Accuracy: {totalClicks > 0 ? Math.round((correctClicks / totalClicks) * 100) : 0}%</p>
          <p>Correct Clicks: {correctClicks}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="flex justify-between mb-6 text-lg">
        <div>Time: {timeLeft}s</div>
        <div>Score: {score}</div>
      </div>

      <div className="mb-6">
        <p className="text-xl mb-4">Click: <span className="font-bold text-2xl">{targetColor.toUpperCase()}</span></p>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleColorClick(color)}
            className="w-20 h-20 rounded-xl border-2 border-white/30 hover:border-white/60 transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: colorValues[color as keyof typeof colorValues] }}
          />
        ))}
      </div>

      <div className="mt-4 text-sm text-white/70">
        Correct: {correctClicks} | Total: {totalClicks}
      </div>
    </div>
  );
};
