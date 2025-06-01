
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface SpatialReasoningGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface Shape {
  id: number;
  type: 'square' | 'circle' | 'triangle' | 'diamond';
  rotation: number;
  color: string;
}

interface Question {
  shapes: Shape[];
  rotatedShapes: Shape[];
  correctAnswer: number;
  options: Shape[][];
}

export const SpatialReasoningGame: React.FC<SpatialReasoningGameProps> = ({ 
  onComplete, 
  gameId,
  activePowerUps = new Set(),
  onPowerUpUsed
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
  const totalQuestions = 8;

  const generateShape = (id: number): Shape => ({
    id,
    type: ['square', 'circle', 'triangle', 'diamond'][Math.floor(Math.random() * 4)] as Shape['type'],
    rotation: Math.floor(Math.random() * 4) * 90,
    color: colors[Math.floor(Math.random() * colors.length)]
  });

  const rotateShape = (shape: Shape, degrees: number): Shape => ({
    ...shape,
    rotation: (shape.rotation + degrees) % 360
  });

  const generateQuestion = (): Question => {
    const originalShapes: Shape[] = [];
    for (let i = 0; i < 3; i++) {
      originalShapes.push(generateShape(i));
    }

    const rotationAngle = [90, 180, 270][Math.floor(Math.random() * 3)];
    const rotatedShapes = originalShapes.map(shape => rotateShape(shape, rotationAngle));

    const correctAnswer = Math.floor(Math.random() * 4);
    const options: Shape[][] = [];

    for (let i = 0; i < 4; i++) {
      if (i === correctAnswer) {
        options.push(rotatedShapes);
      } else {
        // Generate wrong options
        const wrongOption = originalShapes.map(shape => {
          const wrongRotation = [90, 180, 270].filter(r => r !== rotationAngle)[Math.floor(Math.random() * 2)];
          return rotateShape(shape, wrongRotation);
        });
        options.push(wrongOption);
      }
    }

    return {
      shapes: originalShapes,
      rotatedShapes,
      correctAnswer,
      options
    };
  };

  const generateQuestions = () => {
    const newQuestions: Question[] = [];
    for (let i = 0; i < totalQuestions; i++) {
      newQuestions.push(generateQuestion());
    }
    setQuestions(newQuestions);
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(120);
    setSelectedAnswer(null);
    setShowResult(false);
    generateQuestions();
    
    // Apply time freeze power-up
    if (activePowerUps.has('timeFreeze')) {
      setTimeLeft(prev => prev + 30);
      onPowerUpUsed?.('timeFreeze');
    }
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowResult(true);
    
    const currentQ = questions[currentQuestion];
    const isCorrect = optionIndex === currentQ.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 200);
    }
    
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        endGame();
      }
    }, 2000);
  };

  const endGame = () => {
    const accuracy = Math.round((score / (totalQuestions * 200)) * 100);
    const timeBonus = Math.floor(timeLeft / 10) * 5;
    
    let finalScore = score + timeBonus;
    
    // Apply double XP power-up
    if (activePowerUps.has('doubleXP')) {
      finalScore *= 2;
      onPowerUpUsed?.('doubleXP');
    }
    
    onComplete({
      gameId,
      score: finalScore,
      accuracy: Math.min(accuracy, 100),
      timeSpent: 120 - timeLeft,
      xpEarned: Math.round(finalScore / 4)
    });
  };

  const renderShape = (shape: Shape, size: number = 40) => {
    const style = {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: shape.color,
      transform: `rotate(${shape.rotation}deg)`,
      transition: 'transform 0.3s ease'
    };

    switch (shape.type) {
      case 'square':
        return <div style={style} className="border-2 border-white/50" />;
      case 'circle':
        return <div style={{...style, borderRadius: '50%'}} className="border-2 border-white/50" />;
      case 'triangle':
        return (
          <div 
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid ${shape.color}`,
              transform: `rotate(${shape.rotation}deg)`,
              transition: 'transform 0.3s ease'
            }}
          />
        );
      case 'diamond':
        return (
          <div 
            style={{
              ...style,
              transform: `rotate(${shape.rotation + 45}deg)`
            }}
            className="border-2 border-white/50"
          />
        );
      default:
        return <div style={style} />;
    }
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🔄 Spatial Reasoning</h3>
        <p className="mb-6 text-sm md:text-base">Identify how shapes would look when rotated!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Study the original shapes</p>
            <p className="text-xs md:text-sm mb-2">• Find which option shows them rotated</p>
            <p className="text-xs md:text-sm">• Complete 8 questions for maximum score</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Spatial Test
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center text-white p-4">
        <p>Loading questions...</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="flex justify-between text-sm md:text-lg mb-4">
          <span>Time: {timeLeft}s</span>
          <span>Question: {currentQuestion + 1}/{totalQuestions}</span>
          <span>Score: {score}</span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg md:text-xl font-bold mb-4">Original Shapes:</h4>
        <div className="flex justify-center space-x-4 md:space-x-6 mb-6">
          {currentQ.shapes.map((shape, index) => (
            <div key={index} className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16">
              {renderShape(shape, 48)}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg md:text-xl font-bold mb-4">Which option shows these shapes rotated?</h4>
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {currentQ.options.map((option, optionIndex) => (
            <button
              key={optionIndex}
              onClick={() => handleAnswerSelect(optionIndex)}
              disabled={showResult}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                showResult
                  ? optionIndex === currentQ.correctAnswer
                    ? 'bg-green-500/30 border-green-400'
                    : selectedAnswer === optionIndex
                    ? 'bg-red-500/30 border-red-400'
                    : 'bg-white/10 border-white/30'
                  : 'bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50'
              }`}
            >
              <div className="flex justify-center space-x-2">
                {option.map((shape, shapeIndex) => (
                  <div key={shapeIndex} className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10">
                    {renderShape(shape, 32)}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm font-bold">
                Option {String.fromCharCode(65 + optionIndex)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {showResult && (
        <div className="mb-4">
          <p className={`text-lg font-bold ${
            selectedAnswer === currentQ.correctAnswer ? 'text-green-400' : 'text-red-400'
          }`}>
            {selectedAnswer === currentQ.correctAnswer ? '✅ Correct!' : '❌ Incorrect!'}
          </p>
        </div>
      )}
      
      <button
        onClick={endGame}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200 text-sm"
      >
        End Game
      </button>
    </div>
  );
};
