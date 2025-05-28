
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/pages/Index';

interface MathSprintGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Problem {
  question: string;
  answer: number;
}

export const MathSprintGame: React.FC<MathSprintGameProps> = ({ onComplete, gameId }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);

  const generateProblem = (): Problem => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1: number, num2: number, answer: number, question: string;

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * num1);
        answer = num1 - num2;
        question = `${num1} - ${num2}`;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
      default:
        num1 = 1;
        num2 = 1;
        answer = 2;
        question = '1 + 1';
    }

    return { question, answer };
  };

  const startGame = () => {
    setGameStarted(true);
    const initialProblems = Array.from({ length: 20 }, generateProblem);
    setProblems(initialProblems);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted, gameOver]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userAnswer) return;

    const isCorrect = parseInt(userAnswer) === problems[currentProblem].answer;
    
    if (isCorrect) {
      setScore(score + 10);
      setCorrectAnswers(correctAnswers + 1);
    }
    
    setTotalAnswers(totalAnswers + 1);
    setUserAnswer('');
    
    if (currentProblem < problems.length - 1) {
      setCurrentProblem(currentProblem + 1);
    } else {
      // Generate more problems
      setProblems([...problems, ...Array.from({ length: 10 }, generateProblem)]);
      setCurrentProblem(currentProblem + 1);
    }
  };

  const endGame = () => {
    setGameOver(true);
    const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
    const xpEarned = Math.round(score / 4);

    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 60,
      xpEarned
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white">
        <h3 className="text-xl font-bold mb-4">Math Sprint</h3>
        <p className="mb-6">Solve as many math problems as you can in 60 seconds!</p>
        <button
          onClick={startGame}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white">
        <h3 className="text-xl font-bold mb-4">Time's Up!</h3>
        <div className="space-y-2">
          <p>Score: {score} points</p>
          <p>Correct Answers: {correctAnswers}/{totalAnswers}</p>
          <p>Accuracy: {totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-white">
      <div className="flex justify-between mb-6">
        <div>Time: {timeLeft}s</div>
        <div>Score: {score}</div>
      </div>

      <div className="mb-8">
        <div className="text-4xl font-bold mb-4">
          {problems[currentProblem]?.question} = ?
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="px-4 py-2 text-2xl text-center bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/50"
            placeholder="Your answer"
            autoFocus
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="text-sm text-white/70">
        Problem {currentProblem + 1} • {correctAnswers} correct
      </div>
    </div>
  );
};
