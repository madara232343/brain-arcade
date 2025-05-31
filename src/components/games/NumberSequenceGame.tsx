
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface NumberSequenceGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const NumberSequenceGame: React.FC<NumberSequenceGameProps> = ({ onComplete, gameId }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const generateSequence = () => {
    const patterns = [
      (n: number) => n * 2, // Double
      (n: number) => n + 3, // Add 3
      (n: number) => n * n, // Square
      (n: number) => n + n - 1, // Fibonacci-like
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const start = Math.floor(Math.random() * 10) + 1;
    const newSequence = [start];
    
    for (let i = 1; i < 4; i++) {
      newSequence.push(pattern(newSequence[i - 1]));
    }
    
    setSequence(newSequence);
  };

  const startGame = () => {
    setGameStarted(true);
    generateSequence();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const answer = parseInt(userAnswer);
    const expectedPattern = detectPattern();
    const expectedNext = expectedPattern(sequence[sequence.length - 1]);
    
    if (answer === expectedNext) {
      setScore(score + 20);
      setCorrectAnswers(correctAnswers + 1);
    }
    
    if (round >= 10) {
      endGame();
    } else {
      setRound(round + 1);
      setUserAnswer('');
      generateSequence();
    }
  };

  const detectPattern = () => {
    const diff1 = sequence[1] - sequence[0];
    const diff2 = sequence[2] - sequence[1];
    const diff3 = sequence[3] - sequence[2];
    
    // Arithmetic progression
    if (diff1 === diff2 && diff2 === diff3) {
      return (n: number) => n + diff1;
    }
    
    // Geometric progression
    if (sequence[1] / sequence[0] === sequence[2] / sequence[1]) {
      const ratio = sequence[1] / sequence[0];
      return (n: number) => n * ratio;
    }
    
    // Default to arithmetic
    return (n: number) => n + diff1;
  };

  const endGame = () => {
    const accuracy = Math.round((correctAnswers / round) * 100);
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: round * 10,
      xpEarned: Math.round(score / 3)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Number Sequence</h3>
        <p className="mb-6">Find the pattern and predict the next number!</p>
        <button
          onClick={startGame}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold"
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
          <span>Round: {round}/10</span>
          <span>Score: {score}</span>
          <span>Correct: {correctAnswers}</span>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xl mb-4">What comes next in this sequence?</p>
        <div className="flex justify-center items-center space-x-4 text-3xl font-bold mb-6">
          {sequence.map((num, index) => (
            <React.Fragment key={index}>
              <span className="bg-blue-600 px-4 py-2 rounded-lg">{num}</span>
              {index < sequence.length - 1 && <span className="text-gray-400">→</span>}
            </React.Fragment>
          ))}
          <span className="text-gray-400">→</span>
          <span className="bg-gray-600 px-4 py-2 rounded-lg">?</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-xl text-center focus:outline-none focus:border-blue-500"
          placeholder="Enter the next number"
          autoFocus
          required
        />
        <button
          type="submit"
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Submit Answer
        </button>
      </form>
    </div>
  );
};
