
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface MathSprintGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const MathSprintGame: React.FC<MathSprintGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<{question: string, answer: number, options: number[]}>({
    question: '',
    answer: 0,
    options: []
  });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const generateProblem = () => {
    const operations = ['+', '-', '×', '÷'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2, answer, question;
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 - num2;
        question = `${num1} - ${num2}`;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
      case '÷':
        answer = Math.floor(Math.random() * 12) + 1;
        num1 = answer * (Math.floor(Math.random() * 12) + 1);
        question = `${num1} ÷ ${num1 / answer}`;
        break;
      default:
        num1 = 1; num2 = 1; answer = 2; question = '1 + 1';
    }

    // Generate wrong options
    const wrongOptions = [];
    for (let i = 0; i < 3; i++) {
      let wrongAnswer;
      do {
        wrongAnswer = answer + Math.floor(Math.random() * 20) - 10;
      } while (wrongAnswer === answer || wrongOptions.includes(wrongAnswer) || wrongAnswer < 0);
      wrongOptions.push(wrongAnswer);
    }

    const options = [answer, ...wrongOptions].sort(() => Math.random() - 0.5);

    setCurrentProblem({ question, answer, options });
  };

  const startGame = () => {
    setGameStarted(true);
    generateProblem();
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const handleAnswer = (selectedAnswer: number) => {
    setTotalQuestions(prev => prev + 1);
    
    if (selectedAnswer === currentProblem.answer) {
      setScore(prev => prev + 20);
      setCorrectAnswers(prev => prev + 1);
    }
    
    generateProblem();
  };

  const endGame = () => {
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 60 - timeLeft,
      xpEarned: Math.round(score / 3)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">Math Sprint</h3>
        <p className="mb-6 text-sm md:text-base">Solve as many math problems as you can in 60 seconds!</p>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Math Sprint
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
          <span>Correct: {correctAnswers}/{totalQuestions}</span>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-6 md:p-8 mb-6">
        <h3 className="text-2xl md:text-4xl font-bold mb-8">{currentProblem.question} = ?</h3>
        
        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-md mx-auto">
          {currentProblem.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="bg-gray-700 hover:bg-blue-600 text-white px-4 py-3 md:px-6 md:py-4 rounded-lg font-bold text-lg md:text-xl transition-all duration-200 hover:scale-105"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/10 rounded-full h-2 mb-4">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(timeLeft / 60) * 100}%` }}
        />
      </div>
    </div>
  );
};
