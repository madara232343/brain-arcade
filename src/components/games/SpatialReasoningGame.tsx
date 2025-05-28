
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/pages/Index';

interface SpatialReasoningGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

const shapes = ['🔺', '🔴', '🔶', '⬛', '🟡', '🔷'];
const rotations = [0, 90, 180, 270];

interface Shape3D {
  id: number;
  shape: string;
  rotation: number;
  isTarget: boolean;
}

export const SpatialReasoningGame: React.FC<SpatialReasoningGameProps> = ({ onComplete, gameId }) => {
  const [targetShape, setTargetShape] = useState<Shape3D | null>(null);
  const [options, setOptions] = useState<Shape3D[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [round, setRound] = useState(1);

  const generateQuestion = () => {
    const baseShape = shapes[Math.floor(Math.random() * shapes.length)];
    const baseRotation = rotations[Math.floor(Math.random() * rotations.length)];
    
    const target: Shape3D = {
      id: 0,
      shape: baseShape,
      rotation: baseRotation,
      isTarget: true
    };

    // Create the correct answer (same shape, different rotation)
    const correctRotation = rotations[Math.floor(Math.random() * rotations.length)];
    const correctAnswer: Shape3D = {
      id: 1,
      shape: baseShape,
      rotation: correctRotation,
      isTarget: false
    };

    // Create wrong answers
    const wrongAnswers: Shape3D[] = [];
    for (let i = 0; i < 3; i++) {
      wrongAnswers.push({
        id: i + 2,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: rotations[Math.floor(Math.random() * rotations.length)],
        isTarget: false
      });
    }

    const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    setTargetShape(target);
    setOptions(allOptions);
  };

  const startGame = () => {
    setGameStarted(true);
    generateQuestion();
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted, gameOver]);

  const handleAnswer = (selectedShape: Shape3D) => {
    const isCorrect = selectedShape.shape === targetShape?.shape;
    
    setTotalQuestions(prev => prev + 1);

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + (15 + round * 5));
    }

    setTimeout(() => {
      if (totalQuestions > 0 && (totalQuestions + 1) % 5 === 0) {
        setRound(prev => prev + 1);
      }
      generateQuestion();
    }, 1500);
  };

  const endGame = () => {
    setGameOver(true);
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const xpEarned = Math.round(score / 2);

    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 90,
      xpEarned
    });
  };

  const getShapeStyle = (shape: Shape3D) => ({
    transform: `rotate(${shape.rotation}deg)`,
    fontSize: '3rem',
    transition: 'transform 0.3s ease'
  });

  if (!gameStarted) {
    return (
      <div className="text-center text-white">
        <h3 className="text-2xl font-bold mb-4">🔄 Spatial Reasoning</h3>
        <p className="mb-6 text-lg">Rotate and match 3D objects!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-4">
            <p className="text-sm mb-2">• Look at the target shape and its rotation</p>
            <p className="text-sm mb-2">• Find the same shape among the options</p>
            <p className="text-sm mb-2">• Ignore the rotation - focus on the shape</p>
            <p className="text-sm">• Complete as many as possible in 90 seconds</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white">
        <h3 className="text-2xl font-bold mb-4">🧠 Spatial Master!</h3>
        <div className="space-y-3 text-lg">
          <p>Round Reached: <span className="text-purple-400 font-bold">{round}</span></p>
          <p>Final Score: <span className="text-yellow-400 font-bold">{score}</span> points</p>
          <p>Correct Answers: <span className="text-green-400 font-bold">{correctAnswers}/{totalQuestions}</span></p>
          <p>Accuracy: <span className="text-blue-400 font-bold">{totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-white">
      <div className="flex justify-between mb-6 text-lg">
        <div>Time: <span className="font-bold text-red-400">{timeLeft}s</span></div>
        <div>Round: <span className="font-bold text-purple-400">{round}</span></div>
        <div>Score: <span className="font-bold text-yellow-400">{score}</span></div>
      </div>

      {targetShape && (
        <div className="mb-8">
          <p className="text-lg mb-4">Find the same shape:</p>
          <div className="bg-white/20 rounded-xl p-8 inline-block mb-6">
            <div style={getShapeStyle(targetShape)} className="animate-pulse">
              {targetShape.shape}
            </div>
          </div>

          <p className="text-sm text-white/70 mb-6">Click on the matching shape (rotation doesn't matter)</p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option)}
                className="bg-white/10 hover:bg-white/20 border border-white/30 hover:border-blue-400 rounded-xl p-6 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <div style={getShapeStyle(option)}>
                  {option.shape}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-white/70">
        Question {totalQuestions + 1} • {correctAnswers} correct
      </div>
    </div>
  );
};
