
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface NumberGuessingGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const NumberGuessingGame: React.FC<NumberGuessingGameProps> = ({ onComplete, gameId }) => {
  const [targetNumber, setTargetNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(1000);
  const [startTime] = useState(Date.now());

  const handleGuess = () => {
    const userGuess = parseInt(guess);
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
      setMessage('Please enter a number between 1 and 100');
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setScore(Math.max(0, score - 50));

    if (userGuess === targetNumber) {
      setMessage('🎉 Correct! You guessed it!');
      setGameOver(true);
      
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const accuracy = Math.round((1 / newAttempts) * 100);
      
      onComplete({
        gameId,
        score: score + 500,
        accuracy,
        timeSpent,
        xpEarned: Math.round((score + 500) / 10)
      });
    } else if (userGuess < targetNumber) {
      setMessage('📈 Too low! Try a higher number.');
    } else {
      setMessage('📉 Too high! Try a lower number.');
    }

    setGuess('');

    if (newAttempts >= 10) {
      setMessage(`💔 Game over! The number was ${targetNumber}`);
      setGameOver(true);
      
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      
      onComplete({
        gameId,
        score: Math.max(100, score),
        accuracy: 0,
        timeSpent,
        xpEarned: Math.round(score / 20)
      });
    }
  };

  return (
    <div className="text-center text-white p-6">
      <h3 className="text-2xl font-bold mb-4">🎯 Number Guessing Game</h3>
      <p className="mb-6">I'm thinking of a number between 1 and 100!</p>
      
      <div className="mb-6">
        <div className="text-lg mb-2">Attempts: {attempts}/10</div>
        <div className="text-lg">Score: {score}</div>
      </div>

      {!gameOver && (
        <div className="mb-6">
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess"
            className="px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white text-center text-xl w-40 mr-4"
            min="1"
            max="100"
            onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
          />
          <button
            onClick={handleGuess}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
          >
            Guess!
          </button>
        </div>
      )}

      {message && (
        <div className="text-xl mb-6 font-bold">
          {message}
        </div>
      )}

      {gameOver && (
        <div className="text-center">
          <p className="text-lg mb-4">
            Final Score: <span className="text-yellow-400 font-bold">{score}</span>
          </p>
        </div>
      )}
    </div>
  );
};
