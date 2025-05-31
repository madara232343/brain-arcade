
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface PatternMatchGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const PatternMatchGame: React.FC<PatternMatchGameProps> = ({ onComplete, gameId }) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showingPattern, setShowingPattern] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const generatePattern = (level: number) => {
    const patternLength = Math.min(3 + level, 8);
    const newPattern = Array.from({ length: patternLength }, () => Math.floor(Math.random() * 9));
    setPattern(newPattern);
    setUserInput([]);
    showPattern(newPattern);
  };

  const showPattern = (pat: number[]) => {
    setShowingPattern(true);
    setTimeout(() => {
      setShowingPattern(false);
    }, pat.length * 800 + 1000);
  };

  const startGame = () => {
    setGameStarted(true);
    generatePattern(1);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const handleNumberClick = (num: number) => {
    if (showingPattern) return;

    const newInput = [...userInput, num];
    setUserInput(newInput);

    if (newInput[newInput.length - 1] !== pattern[newInput.length - 1]) {
      endGame();
      return;
    }

    if (newInput.length === pattern.length) {
      setScore(score + currentLevel * 20);
      setCurrentLevel(currentLevel + 1);
      setTimeout(() => generatePattern(currentLevel + 1), 1000);
    }
  };

  const endGame = () => {
    const accuracy = Math.round((score / (currentLevel * 20)) * 100);
    onComplete({
      gameId,
      score,
      accuracy: Math.min(accuracy, 100),
      timeSpent: 60 - timeLeft,
      xpEarned: Math.round(score / 3)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Pattern Match</h3>
        <p className="mb-6">Memorize the pattern and repeat it!</p>
        <button
          onClick={startGame}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="flex justify-between text-lg mb-4">
          <span>Level: {currentLevel}</span>
          <span>Score: {score}</span>
          <span>Time: {timeLeft}s</span>
        </div>
      </div>

      {showingPattern && (
        <div className="mb-6">
          <p className="text-xl text-yellow-400 mb-4">Memorize this pattern:</p>
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            {pattern.map((num, index) => (
              <div
                key={index}
                className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-2xl font-bold animate-pulse"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      )}

      {!showingPattern && pattern.length > 0 && (
        <>
          <p className="text-lg text-green-400 mb-4">
            Enter the pattern ({userInput.length}/{pattern.length}):
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="w-16 h-16 bg-gray-600 hover:bg-gray-500 rounded-lg text-xl font-bold transition-colors"
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex justify-center space-x-2 mb-4">
            {userInput.map((num, index) => (
              <div
                key={index}
                className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-lg font-bold"
              >
                {num}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
