
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface BrainTeaserGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const BrainTeaserGame: React.FC<BrainTeaserGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const questions = [
    {
      question: "What comes next in the sequence: 2, 6, 12, 20, 30, ?",
      options: ["42", "40", "38", "44"],
      correct: 0
    },
    {
      question: "If all Bloops are Razzles and all Razzles are Lazzles, then all Bloops are definitely Lazzles?",
      options: ["True", "False", "Cannot determine", "Sometimes"],
      correct: 0
    },
    {
      question: "Which number doesn't belong: 8, 27, 64, 100, 125?",
      options: ["8", "27", "100", "125"],
      correct: 2
    }
  ];

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || currentQuestion >= questions.length) {
      endGame();
    }
  }, [timeLeft, gameStarted, currentQuestion]);

  const handleAnswer = (answerIndex: number) => {
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(prev => prev + 100);
      setCorrectAnswers(prev => prev + 1);
    }
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    const accuracy = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 90 - timeLeft,
      xpEarned: Math.round(score / 2)
    });
  };

  const startGame = () => {
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">Brain Teaser Challenge</h3>
        <p className="mb-6 text-sm md:text-base">Solve logical puzzles and brain teasers!</p>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Brain Teaser
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="flex justify-between text-base md:text-lg mb-4">
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
          <span>Question: {currentQuestion + 1}/{questions.length}</span>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-6 md:p-8 mb-6">
        <h3 className="text-lg md:text-xl font-bold mb-6">{question.question}</h3>
        
        <div className="grid gap-3 md:gap-4 max-w-2xl mx-auto">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="bg-gray-700 hover:bg-purple-600 text-white px-4 py-3 md:px-6 md:py-4 rounded-lg font-medium text-sm md:text-base transition-all duration-200 hover:scale-105"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/10 rounded-full h-2 mb-4">
        <div 
          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
        />
      </div>
    </div>
  );
};
