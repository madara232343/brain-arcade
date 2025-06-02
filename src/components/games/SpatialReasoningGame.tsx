
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface SpatialReasoningGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Question {
  id: number;
  shape: string;
  rotation: number;
  options: string[];
  correct: number;
}

export const SpatialReasoningGame: React.FC<SpatialReasoningGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);

  const questions: Question[] = [
    {
      id: 1,
      shape: '🔺',
      rotation: 90,
      options: ['🔻', '◀️', '▶️', '🔺'],
      correct: 1
    },
    {
      id: 2,
      shape: '🔷',
      rotation: 45,
      options: ['🔶', '🔷', '💎', '⬜'],
      correct: 2
    },
    {
      id: 3,
      shape: '⬛',
      rotation: 180,
      options: ['⬛', '⬜', '🔳', '▪️'],
      correct: 0
    },
    {
      id: 4,
      shape: '🔶',
      rotation: 270,
      options: ['🔷', '🔶', '💠', '🔸'],
      correct: 0
    },
    {
      id: 5,
      shape: '🔻',
      rotation: 45,
      options: ['🔺', '🔻', '◀️', '▶️'],
      correct: 1
    }
  ];

  React.useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameStarted, timeLeft]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setTimeLeft(60);
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (answerIndex === questions[currentQuestion].correct) {
      setScore(prev => prev + 200);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    const accuracy = questions.length > 0 ? Math.round((score / (questions.length * 200)) * 100) : 0;
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 60 - timeLeft,
      xpEarned: Math.round(score / 4)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-2 md:p-4">
        <h3 className="text-lg md:text-2xl font-bold mb-4">🧩 Spatial Reasoning</h3>
        <p className="mb-6 text-sm md:text-base">Identify how shapes look when rotated!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Look at the original shape</p>
            <p className="text-xs md:text-sm mb-2">• Imagine it rotated</p>
            <p className="text-xs md:text-sm">• Select the correct result</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 text-sm md:text-base"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-2 md:p-4">
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between text-sm md:text-lg mb-4">
          <span>Question: {currentQuestion + 1}/{questions.length}</span>
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
        </div>
      </div>

      <div className="mb-6 md:mb-8">
        <p className="text-sm md:text-lg mb-4">Rotate this shape {questions[currentQuestion].rotation}°:</p>
        <div className="text-4xl md:text-6xl mb-6">{questions[currentQuestion].shape}</div>
        <p className="text-sm md:text-base text-gray-300">Which option shows the rotated shape?</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-xs md:max-w-sm mx-auto mb-6">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className="p-4 md:p-6 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <span className="text-2xl md:text-4xl">{option}</span>
          </button>
        ))}
      </div>

      <div className="bg-white/10 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(timeLeft / 60) * 100}%` }}
        />
      </div>
    </div>
  );
};
