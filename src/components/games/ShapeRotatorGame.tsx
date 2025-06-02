
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface ShapeRotatorGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Shape {
  type: 'triangle' | 'square' | 'pentagon' | 'hexagon';
  rotation: number;
  targetRotation: number;
}

export const ShapeRotatorGame: React.FC<ShapeRotatorGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [userRotation, setUserRotation] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(90);
  const [completed, setCompleted] = useState(0);

  const shapes = [
    { type: 'triangle' as const, symbol: '▲', sides: 3 },
    { type: 'square' as const, symbol: '■', sides: 4 },
    { type: 'pentagon' as const, symbol: '⬟', sides: 5 },
    { type: 'hexagon' as const, symbol: '⬢', sides: 6 }
  ];

  const generateShape = () => {
    const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
    const targetRotation = Math.floor(Math.random() * 360);
    setCurrentShape({
      type: shapeType.type,
      rotation: 0,
      targetRotation
    });
    setUserRotation(0);
  };

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
    setScore(0);
    setLevel(1);
    setCompleted(0);
    setTimeLeft(90);
    generateShape();
  };

  const handleRotate = (direction: 'left' | 'right') => {
    const increment = 15;
    setUserRotation(prev => {
      const newRotation = direction === 'right' 
        ? (prev + increment) % 360 
        : (prev - increment + 360) % 360;
      return newRotation;
    });
  };

  const checkMatch = () => {
    if (!currentShape) return;
    
    const tolerance = 20;
    const diff = Math.abs(userRotation - currentShape.targetRotation);
    const isMatch = diff <= tolerance || diff >= (360 - tolerance);
    
    if (isMatch) {
      const points = Math.max(50, 200 - diff);
      setScore(prev => prev + points);
      setCompleted(prev => prev + 1);
      
      if (completed + 1 >= level * 3) {
        setLevel(prev => prev + 1);
      }
      
      generateShape();
    }
  };

  const endGame = () => {
    const accuracy = completed > 0 ? Math.min(100, Math.round((score / (completed * 200)) * 100)) : 0;
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 90 - timeLeft,
      xpEarned: Math.round(score / 5)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-2 md:p-4">
        <h3 className="text-lg md:text-2xl font-bold mb-4">🔄 Shape Rotator</h3>
        <p className="mb-6 text-sm md:text-base">Rotate shapes to match the target orientation!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Use rotation buttons to turn the shape</p>
            <p className="text-xs md:text-sm mb-2">• Match the target rotation shown</p>
            <p className="text-xs md:text-sm">• Get as close as possible for points</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 text-sm md:text-base"
        >
          Start Game
        </button>
      </div>
    );
  }

  const currentShapeData = shapes.find(s => s.type === currentShape?.type);

  return (
    <div className="text-center text-white p-2 md:p-4">
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between text-sm md:text-lg mb-4">
          <span>Level: {level}</span>
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
        </div>
        <p className="text-xs md:text-sm">Completed: {completed}/{level * 3}</p>
      </div>

      {currentShape && currentShapeData && (
        <div className="mb-6 md:mb-8">
          <p className="text-sm md:text-lg mb-4">Target rotation: {currentShape.targetRotation}°</p>
          
          <div className="flex justify-center items-center space-x-4 md:space-x-8 mb-6">
            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-300 mb-2">Target</p>
              <div 
                className="text-3xl md:text-5xl text-yellow-400"
                style={{ transform: `rotate(${currentShape.targetRotation}deg)` }}
              >
                {currentShapeData.symbol}
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-300 mb-2">Your Shape</p>
              <div 
                className="text-3xl md:text-5xl text-cyan-400 transition-transform duration-200"
                style={{ transform: `rotate(${userRotation}deg)` }}
              >
                {currentShapeData.symbol}
              </div>
              <p className="text-xs md:text-sm mt-2">{userRotation}°</p>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => handleRotate('left')}
              className="px-4 md:px-6 py-2 md:py-3 bg-red-500 hover:bg-red-600 rounded-lg font-bold transition-all duration-200 hover:scale-105 text-sm md:text-base"
            >
              ← Rotate Left
            </button>
            <button
              onClick={() => handleRotate('right')}
              className="px-4 md:px-6 py-2 md:py-3 bg-green-500 hover:bg-green-600 rounded-lg font-bold transition-all duration-200 hover:scale-105 text-sm md:text-base"
            >
              Rotate Right →
            </button>
          </div>

          <button
            onClick={checkMatch}
            className="px-6 md:px-8 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold transition-all duration-200 hover:scale-105 text-sm md:text-base"
          >
            Check Match
          </button>
        </div>
      )}

      <div className="bg-white/10 rounded-full h-2">
        <div 
          className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(timeLeft / 90) * 100}%` }}
        />
      </div>
    </div>
  );
};
