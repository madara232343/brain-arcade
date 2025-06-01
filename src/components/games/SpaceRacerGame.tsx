
import React, { useState, useEffect, useCallback } from 'react';
import { GameResult } from '@/types/game';

interface SpaceRacerGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  type: 'asteroid' | 'enemy' | 'powerup';
}

export const SpaceRacerGame: React.FC<SpaceRacerGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerX, setPlayerX] = useState(200);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [fuel, setFuel] = useState(100);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(120);
  const [obstacleId, setObstacleId] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setPlayerX(200);
    setObstacles([]);
    setScore(0);
    setSpeed(2);
    setFuel(100);
    setLives(3);
    setTimeLeft(120);
  };

  const generateObstacle = useCallback(() => {
    const types: Array<'asteroid' | 'enemy' | 'powerup'> = ['asteroid', 'asteroid', 'enemy', 'powerup'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    setObstacles(prev => [...prev, {
      id: obstacleId,
      x: Math.random() * 350 + 25,
      y: -50,
      type
    }]);
    
    setObstacleId(prev => prev + 1);
  }, [obstacleId]);

  useEffect(() => {
    if (!gameStarted) return;

    const gameInterval = setInterval(() => {
      // Move obstacles
      setObstacles(prev => prev.map(obs => ({ ...obs, y: obs.y + speed })).filter(obs => obs.y < 600));
      
      // Generate new obstacles
      if (Math.random() < 0.3) {
        generateObstacle();
      }
      
      // Update score and speed
      setScore(prev => prev + Math.floor(speed));
      setSpeed(prev => Math.min(prev + 0.001, 8));
      
      // Consume fuel
      setFuel(prev => Math.max(prev - 0.1, 0));
    }, 50);

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
    };
  }, [gameStarted, speed, generateObstacle]);

  useEffect(() => {
    if (fuel <= 0 || lives <= 0) {
      endGame();
    }
  }, [fuel, lives]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          setPlayerX(prev => Math.max(25, prev - 20));
          break;
        case 'ArrowRight':
        case 'd':
          setPlayerX(prev => Math.min(375, prev + 20));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted]);

  useEffect(() => {
    // Check collisions
    obstacles.forEach(obstacle => {
      const playerCollision = Math.abs(obstacle.x - playerX) < 30 && obstacle.y > 450 && obstacle.y < 550;
      
      if (playerCollision) {
        setObstacles(prev => prev.filter(obs => obs.id !== obstacle.id));
        
        switch (obstacle.type) {
          case 'asteroid':
          case 'enemy':
            setLives(prev => prev - 1);
            break;
          case 'powerup':
            setFuel(prev => Math.min(prev + 20, 100));
            setScore(prev => prev + 500);
            break;
        }
      }
    });
  }, [obstacles, playerX]);

  const endGame = () => {
    const accuracy = Math.round((score / timeLeft) * 100 / 60);
    onComplete({
      gameId,
      score,
      accuracy: Math.min(accuracy, 100),
      timeSpent: 120 - timeLeft,
      xpEarned: Math.round(score / 10)
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const normalizedX = (x / rect.width) * 400;
    setPlayerX(Math.max(25, Math.min(375, normalizedX)));
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🚀 Space Racer</h3>
        <p className="mb-6 text-sm md:text-base">Navigate through space, avoid obstacles, collect fuel!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Use arrow keys or touch to move</p>
            <p className="text-xs md:text-sm mb-2">• Avoid asteroids and enemies</p>
            <p className="text-xs md:text-sm">• Collect power-ups for fuel</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Launch Ship
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-4">
        <div className="flex flex-wrap justify-between text-sm md:text-base mb-4 gap-2">
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
          <span>Lives: {'❤️'.repeat(lives)}</span>
          <span>Fuel: {Math.round(fuel)}%</span>
        </div>
      </div>

      <div 
        className="relative bg-gradient-to-b from-black via-purple-900 to-blue-900 rounded-xl mx-auto border border-white/30 overflow-hidden"
        style={{ width: '400px', height: '500px' }}
        onTouchMove={handleTouchMove}
      >
        {/* Stars background */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Player ship */}
        <div
          className="absolute w-8 h-12 transition-all duration-100"
          style={{
            left: playerX - 16,
            bottom: '50px'
          }}
        >
          <div className="text-2xl">🚀</div>
        </div>
        
        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className="absolute w-8 h-8 transition-all duration-100"
            style={{
              left: obstacle.x - 16,
              top: obstacle.y
            }}
          >
            {obstacle.type === 'asteroid' && '☄️'}
            {obstacle.type === 'enemy' && '👾'}
            {obstacle.type === 'powerup' && '⚡'}
          </div>
        ))}
        
        {/* Fuel bar */}
        <div className="absolute top-4 left-4 right-4">
          <div className="text-xs mb-1">Fuel</div>
          <div className="w-full bg-red-900 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${fuel}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs md:text-sm text-white/70">
        Use arrow keys or touch to move
      </div>
    </div>
  );
};
