
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface ColorBlendGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const ColorBlendGame: React.FC<ColorBlendGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [targetColor, setTargetColor] = useState({ r: 0, g: 0, b: 0 });
  const [userColor, setUserColor] = useState({ r: 128, g: 128, b: 128 });
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [feedback, setFeedback] = useState('');

  const generateTargetColor = () => {
    setTargetColor({
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256)
    });
    setUserColor({ r: 128, g: 128, b: 128 });
    setFeedback('');
  };

  const startGame = () => {
    setGameStarted(true);
    generateTargetColor();
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const calculateColorDifference = () => {
    const diff = Math.sqrt(
      Math.pow(targetColor.r - userColor.r, 2) +
      Math.pow(targetColor.g - userColor.g, 2) +
      Math.pow(targetColor.b - userColor.b, 2)
    );
    return Math.max(0, 100 - (diff / 4.41)); // 441 is max possible difference
  };

  const handleSubmit = () => {
    const accuracy = calculateColorDifference();
    const points = Math.round(accuracy * 10);
    setScore(prev => prev + points);
    
    if (accuracy > 80) {
      setFeedback('Excellent match! 🎨');
    } else if (accuracy > 60) {
      setFeedback('Good try! 👍');
    } else {
      setFeedback('Keep practicing! 💪');
    }
    
    setTimeout(() => {
      setRound(prev => prev + 1);
      generateTargetColor();
    }, 2000);
  };

  const endGame = () => {
    const finalAccuracy = Math.min(100, Math.round((score / (round * 1000)) * 100));
    onComplete({
      gameId,
      score,
      accuracy: finalAccuracy,
      timeSpent: 60 - timeLeft,
      xpEarned: Math.round(score / 5)
    });
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🎨 Color Blend</h3>
        <p className="mb-6 text-sm md:text-base">Match the target color by adjusting RGB values!</p>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Color Blend
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="flex justify-between text-base md:text-lg mb-4">
          <span>Time: {timeLeft}s</span>
          <span>Round: {round}</span>
          <span>Score: {score}</span>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-6 md:p-8 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-lg font-bold mb-3">Target Color</h4>
            <div 
              className="w-32 h-32 mx-auto rounded-lg border-4 border-white/30"
              style={{ backgroundColor: rgbToHex(targetColor.r, targetColor.g, targetColor.b) }}
            />
            <p className="text-sm mt-2">
              RGB({targetColor.r}, {targetColor.g}, {targetColor.b})
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-3">Your Color</h4>
            <div 
              className="w-32 h-32 mx-auto rounded-lg border-4 border-white/30"
              style={{ backgroundColor: rgbToHex(userColor.r, userColor.g, userColor.b) }}
            />
            <p className="text-sm mt-2">
              RGB({userColor.r}, {userColor.g}, {userColor.b})
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Red: {userColor.r}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={userColor.r}
              onChange={(e) => setUserColor(prev => ({ ...prev, r: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Green: {userColor.g}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={userColor.g}
              onChange={(e) => setUserColor(prev => ({ ...prev, g: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Blue: {userColor.b}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={userColor.b}
              onChange={(e) => setUserColor(prev => ({ ...prev, b: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
        </div>

        {feedback && (
          <div className="text-lg font-bold text-yellow-400 mb-4">{feedback}</div>
        )}

        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105"
        >
          Submit Color
        </button>
      </div>
    </div>
  );
};
