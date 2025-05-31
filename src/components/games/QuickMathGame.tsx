
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface QuickMathGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const QuickMathGame: React.FC<QuickMathGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [equation, setEquation] = useState('');
  const [answer, setAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [streak, setStreak] = useState(0);

  const generateEquation = () => {
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let a, b, result;
    
    switch (op) {
      case '+':
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * 50) + 1;
        result = a + b;
        break;
      case '-':
        a = Math.floor(Math.random() * 50) + 25;
        b = Math.floor(Math.random() * 25) + 1;
        result = a - b;
        break;
      case '×':
        a = Math.floor(Math.random() * 12) + 1;
        b = Math.floor(Math.random() * 12) + 1;
        result = a * b;
        break;
      default:
        a = 1; b = 1; result = 2;
    }

    setEquation(`${a} ${op} ${b}`);
    setAnswer(result);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userNum = parseInt(userAnswer);
    
    if (userNum === answer) {
      const points = 20 + (streak * 5);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setUserAnswer('');
    generateEquation();
  };

  const endGame = () => {
    onComplete({
      gameId,
      score,
      accuracy: Math.min(100, (score / (45 * 25)) * 100),
      timeSpent: 45 - timeLeft,
      xpEarned: Math.round(score / 3)
    });
  };

  const startGame = () => {
    setGameStarted(true);
    generateEquation();
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">Quick Math</h3>
        <p className="mb-6 text-sm md:text-base">Solve math problems as fast as you can!</p>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Quick Math
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="flex justify-between text-base md:text-lg mb-4">
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
          <span>Streak: {streak}</span>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-6 md:p-8 mb-6">
        <h3 className="text-3xl md:text-5xl font-bold mb-6">{equation} = ?</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Your answer"
            className="w-full max-w-xs px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white text-center text-xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            autoFocus
          />
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200"
          >
            Submit
          </button>
        </form>
      </div>

      {streak > 0 && (
        <div className="bg-yellow-500/20 rounded-lg p-3 mb-4">
          <span className="text-yellow-300 font-bold">🔥 {streak} streak bonus!</span>
        </div>
      )}
    </div>
  );
};
