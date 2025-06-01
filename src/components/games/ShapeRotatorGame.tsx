
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface ShapeRotatorGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface Shape {
  type: 'square' | 'triangle' | 'hexagon' | 'star';
  currentRotation: number;
  targetRotation: number;
  color: string;
}

export const ShapeRotatorGame: React.FC<ShapeRotatorGameProps> = ({ 
  onComplete, 
  gameId,
  activePowerUps = new Set(),
  onPowerUpUsed
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(90);
  const [rotationSpeed, setRotationSpeed] = useState(15);

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
  const shapeTypes: Shape['type'][] = ['square', 'triangle', 'hexagon', 'star'];

  const generateShape = (): Shape => {
    const targetRotations = [0, 45, 90, 135, 180, 225, 270, 315];
    return {
      type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
      currentRotation: Math.floor(Math.random() * 360),
      targetRotation: targetRotations[Math.floor(Math.random() * targetRotations.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLevel(1);
    setTimeLeft(90);
    setRotationSpeed(15);
    setCurrentShape(generateShape());
    
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

  const rotateShape = (direction: 'left' | 'right') => {
    if (!currentShape) return;
    
    const rotation = direction === 'left' ? -rotationSpeed : rotationSpeed;
    setCurrentShape(prev => prev ? {
      ...prev,
      currentRotation: (prev.currentRotation + rotation + 360) % 360
    } : null);
  };

  const checkAlignment = () => {
    if (!currentShape) return;
    
    const tolerance = 10; // degrees
    const diff = Math.abs(currentShape.currentRotation - currentShape.targetRotation);
    const isAligned = diff <= tolerance || Math.abs(diff - 360) <= tolerance;
    
    if (isAligned) {
      const levelScore = level * 100;
      const accuracyBonus = Math.max(0, (tolerance - Math.min(diff, Math.abs(diff - 360))) * 10);
      const timeBonus = Math.floor(timeLeft / 5) * 2;
      
      setScore(prev => prev + levelScore + accuracyBonus + timeBonus);
      setLevel(prev => prev + 1);
      setRotationSpeed(Math.max(5, rotationSpeed - 1)); // Increase difficulty
      
      setTimeout(() => {
        setCurrentShape(generateShape());
      }, 1000);
      
      return true;
    }
    return false;
  };

  const endGame = () => {
    const accuracy = Math.min(100, Math.round((level / (level + 5)) * 100));
    
    let finalScore = score;
    
    // Apply double XP power-up
    if (activePowerUps.has('doubleXP')) {
      finalScore *= 2;
      onPowerUpUsed?.('doubleXP');
    }
    
    onComplete({
      gameId,
      score: finalScore,
      accuracy,
      timeSpent: 90 - timeLeft,
      xpEarned: Math.round(finalScore / 5)
    });
  };

  const renderShape = (shape: Shape) => {
    const size = 120;
    const style = {
      width: `${size}px`,
      height: `${size}px`,
      transform: `rotate(${shape.currentRotation}deg)`,
      transition: 'transform 0.2s ease',
      backgroundColor: shape.color,
      border: '3px solid white'
    };

    switch (shape.type) {
      case 'square':
        return <div style={style} className="mx-auto" />;
      case 'triangle':
        return (
          <div 
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid ${shape.color}`,
              transform: `rotate(${shape.currentRotation}deg)`,
              transition: 'transform 0.2s ease',
              margin: '0 auto'
            }}
          />
        );
      case 'hexagon':
        return (
          <div 
            style={{
              width: `${size}px`,
              height: `${size * 0.866}px`,
              backgroundColor: shape.color,
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              transform: `rotate(${shape.currentRotation}deg)`,
              transition: 'transform 0.2s ease',
              margin: '0 auto',
              border: '3px solid white'
            }}
          />
        );
      case 'star':
        return (
          <div 
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: shape.color,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              transform: `rotate(${shape.currentRotation}deg)`,
              transition: 'transform 0.2s ease',
              margin: '0 auto',
              border: '3px solid white'
            }}
          />
        );
      default:
        return <div style={style} className="mx-auto" />;
    }
  };

  const renderTargetIndicator = (targetRotation: number) => {
    return (
      <div className="relative w-32 h-32 mx-auto mb-4">
        <div className="absolute inset-0 border-4 border-dashed border-yellow-400 rounded-full opacity-50"></div>
        <div 
          className="absolute top-0 left-1/2 w-1 h-8 bg-yellow-400 origin-bottom"
          style={{
            transform: `translateX(-50%) rotate(${targetRotation}deg)`,
            transformOrigin: '50% 64px'
          }}
        />
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    );
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🔄 Shape Rotator</h3>
        <p className="mb-6 text-sm md:text-base">Rotate shapes to match the target orientation!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Use rotation buttons to turn the shape</p>
            <p className="text-xs md:text-sm mb-2">• Match the yellow target indicator</p>
            <p className="text-xs md:text-sm">• Get precise for bonus points</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Rotating
        </button>
      </div>
    );
  }

  if (!currentShape) return null;

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="flex justify-between text-sm md:text-lg mb-4">
          <span>Time: {timeLeft}s</span>
          <span>Level: {level}</span>
          <span>Score: {score}</span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg md:text-xl font-bold mb-4">Target Orientation:</h4>
        {renderTargetIndicator(currentShape.targetRotation)}
      </div>

      <div className="mb-6">
        <h4 className="text-lg md:text-xl font-bold mb-4">Current Shape:</h4>
        <div className="flex justify-center items-center mb-4" style={{ height: '140px' }}>
          {renderShape(currentShape)}
        </div>
        <p className="text-sm text-white/70">
          Current: {Math.round(currentShape.currentRotation)}° | Target: {currentShape.targetRotation}°
        </p>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => rotateShape('left')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105"
        >
          ↺ Rotate Left
        </button>
        <button
          onClick={() => rotateShape('right')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105"
        >
          ↻ Rotate Right
        </button>
      </div>

      <button
        onClick={checkAlignment}
        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 mb-4"
      >
        ✓ Check Alignment
      </button>
      
      <div className="mt-4">
        <button
          onClick={endGame}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200 text-sm"
        >
          End Game
        </button>
      </div>
    </div>
  );
};
