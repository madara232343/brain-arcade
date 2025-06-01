
import React, { useState, useEffect, useCallback } from 'react';
import { GameResult } from '@/types/game';

interface SpaceRacerGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  type: 'asteroid' | 'enemy' | 'powerup';
}

export const SpaceRacerGame: React.FC<SpaceRacerGameProps> = ({ onComplete, gameId, activePowerUps = new Set(), onPowerUpUsed }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerX, setPlayerX] = useState(200);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [fuel, setFuel] = useState(100);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(120);
  const [obstacleId, setObstacleId] = useState(0);
  const [shieldActive, setShieldActive] = useState(false);
  const [gameWidth, setGameWidth] = useState(400);
  const [gameHeight, setGameHeight] = useState(500);

  useEffect(() => {
    const updateGameSize = () => {
      const isMobile = window.innerWidth < 768;
      const width = isMobile ? Math.min(350, window.innerWidth - 32) : 400;
      const height = isMobile ? 400 : 500;
      setGameWidth(width);
      setGameHeight(height);
      setPlayerX(width / 2);
    };
    
    updateGameSize();
    window.addEventListener('resize', updateGameSize);
    return () => window.removeEventListener('resize', updateGameSize);
  }, []);

  useEffect(() => {
    if (activePowerUps.has('shield')) {
      setShieldActive(true);
    }
  }, [activePowerUps]);

  const startGame = () => {
    setGameStarted(true);
    setPlayerX(gameWidth / 2);
    setObstacles([]);
    setScore(0);
    setSpeed(2);
    setFuel(100);
    setLives(activePowerUps.has('shield') ? 4 : 3);
    setTimeLeft(activePowerUps.has('timeFreeze') ? 150 : 120);
    setShieldActive(activePowerUps.has('shield'));
    setObstacleId(0);
  };

  const generateObstacle = useCallback(() => {
    const types: Array<'asteroid' | 'enemy' | 'powerup'> = ['asteroid', 'asteroid', 'enemy', 'powerup'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    setObstacles(prev => [...prev, {
      id: obstacleId,
      x: Math.random() * (gameWidth - 50) + 25,
      y: -50,
      type
    }]);
    
    setObstacleId(prev => prev + 1);
  }, [obstacleId, gameWidth]);

  useEffect(() => {
    if (!gameStarted) return;

    const gameInterval = setInterval(() => {
      setObstacles(prev => prev.map(obs => ({ ...obs, y: obs.y + speed })).filter(obs => obs.y < gameHeight + 50));
      
      if (Math.random() < 0.3) {
        generateObstacle();
      }
      
      const baseScore = Math.floor(speed);
      const xpMultiplier = activePowerUps.has('doubleXP') ? 2 : 1;
      setScore(prev => prev + (baseScore * xpMultiplier));
      setSpeed(prev => Math.min(prev + 0.001, 8));
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
  }, [gameStarted, speed, generateObstacle, activePowerUps, gameHeight]);

  useEffect(() => {
    if (fuel <= 0 || lives <= 0) {
      endGame();
    }
  }, [fuel, lives]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      
      const moveAmount = window.innerWidth < 768 ? 15 : 20;
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setPlayerX(prev => Math.max(25, prev - moveAmount));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setPlayerX(prev => Math.min(gameWidth - 25, prev + moveAmount));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameWidth]);

  useEffect(() => {
    obstacles.forEach(obstacle => {
      const playerCollision = Math.abs(obstacle.x - playerX) < 35 && 
                            obstacle.y > (gameHeight - 80) && 
                            obstacle.y < (gameHeight - 20);
      
      if (playerCollision) {
        setObstacles(prev => prev.filter(obs => obs.id !== obstacle.id));
        
        switch (obstacle.type) {
          case 'asteroid':
          case 'enemy':
            if (shieldActive) {
              setShieldActive(false);
              onPowerUpUsed?.('shield');
            } else {
              setLives(prev => prev - 1);
            }
            break;
          case 'powerup':
            setFuel(prev => Math.min(prev + 20, 100));
            const bonusScore = 500;
            const xpMultiplier = activePowerUps.has('doubleXP') ? 2 : 1;
            setScore(prev => prev + (bonusScore * xpMultiplier));
            break;
        }
      }
    });
  }, [obstacles, playerX, shieldActive, activePowerUps, onPowerUpUsed, gameHeight]);

  const endGame = () => {
    const accuracy = Math.round((score / Math.max(timeLeft, 1)) * 100 / 60);
    const xpMultiplier = activePowerUps.has('doubleXP') ? 2 : 1;
    onComplete({
      gameId,
      score,
      accuracy: Math.min(accuracy, 100),
      timeSpent: 120 - timeLeft,
      xpEarned: Math.round((score / 10) * xpMultiplier)
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const normalizedX = (x / rect.width) * gameWidth;
    setPlayerX(Math.max(25, Math.min(gameWidth - 25, normalizedX)));
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  const useTimeFreeze = () => {
    if (activePowerUps.has('timeFreeze')) {
      setTimeLeft(prev => prev + 30);
      onPowerUpUsed?.('timeFreeze');
    }
  };

  const moveLeft = () => {
    setPlayerX(prev => Math.max(25, prev - 25));
  };

  const moveRight = () => {
    setPlayerX(prev => Math.min(gameWidth - 25, prev + 25));
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-3 md:p-4">
        <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">🚀 Space Racer</h3>
        <p className="mb-4 md:mb-6 text-sm md:text-base px-2">Navigate through space, avoid obstacles, collect fuel!</p>
        <div className="mb-4 md:mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4 max-w-xs md:max-w-none">
            <p className="text-xs md:text-sm mb-2">• Use arrow keys or touch to move</p>
            <p className="text-xs md:text-sm mb-2">• Avoid asteroids and enemies</p>
            <p className="text-xs md:text-sm">• Collect power-ups for fuel</p>
          </div>
        </div>
        
        {activePowerUps.size > 0 && (
          <div className="mb-4 bg-yellow-500/20 rounded-lg p-2 md:p-3">
            <p className="text-xs md:text-sm text-yellow-300 mb-2">Active Power-ups:</p>
            <div className="flex flex-wrap justify-center gap-1 md:gap-2">
              {Array.from(activePowerUps).map(powerUp => (
                <span key={powerUp} className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">
                  {powerUp}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 text-sm md:text-base"
        >
          Launch Ship
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-2 md:p-4">
      <div className="mb-3 md:mb-4">
        <div className="flex flex-wrap justify-between text-xs md:text-base mb-3 md:mb-4 gap-1 md:gap-2">
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
          <span>Lives: {'❤️'.repeat(lives)}</span>
          <span>Fuel: {Math.round(fuel)}%</span>
        </div>
        
        {/* Power-up buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {activePowerUps.has('timeFreeze') && (
            <button
              onClick={useTimeFreeze}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 md:px-3 py-1 md:py-2 rounded text-xs md:text-sm"
            >
              ⏱️ Add Time
            </button>
          )}
          {shieldActive && (
            <div className="bg-purple-500 text-white px-2 md:px-3 py-1 md:py-2 rounded text-xs md:text-sm">
              🛡️ Shield Active
            </div>
          )}
        </div>
      </div>

      <div 
        className="relative bg-gradient-to-b from-black via-purple-900 to-blue-900 rounded-xl mx-auto border border-white/30 overflow-hidden touch-none"
        style={{ width: `${gameWidth}px`, height: `${gameHeight}px` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Stars background */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
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
          className="absolute w-6 h-8 md:w-8 md:h-12 transition-all duration-100 z-10"
          style={{
            left: playerX - (window.innerWidth < 768 ? 12 : 16),
            bottom: '20px'
          }}
        >
          <div className="text-lg md:text-2xl">🚀</div>
        </div>
        
        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className="absolute w-6 h-6 md:w-8 md:h-8 transition-all duration-100"
            style={{
              left: obstacle.x - (window.innerWidth < 768 ? 12 : 16),
              top: obstacle.y
            }}
          >
            {obstacle.type === 'asteroid' && <span className="text-lg md:text-xl">☄️</span>}
            {obstacle.type === 'enemy' && <span className="text-lg md:text-xl">👾</span>}
            {obstacle.type === 'powerup' && <span className="text-lg md:text-xl">⚡</span>}
          </div>
        ))}
        
        {/* Fuel bar */}
        <div className="absolute top-2 md:top-4 left-2 md:left-4 right-2 md:right-4">
          <div className="text-xs mb-1">Fuel</div>
          <div className="w-full bg-red-900 rounded-full h-1.5 md:h-2">
            <div 
              className="bg-green-500 h-1.5 md:h-2 rounded-full transition-all duration-300"
              style={{ width: `${fuel}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile Controls */}
      <div className="md:hidden flex justify-center space-x-4 mt-4">
        <button
          onTouchStart={moveLeft}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg active:scale-95 transition-all select-none"
        >
          ←
        </button>
        <button
          onTouchStart={moveRight}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg active:scale-95 transition-all select-none"
        >
          →
        </button>
      </div>
      
      <div className="mt-3 md:mt-4 text-xs md:text-sm text-white/70">
        {window.innerWidth < 768 ? 'Touch screen or use buttons to move' : 'Use arrow keys or touch to move'}
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 md:h-3 mt-3">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 md:h-3 rounded-full transition-all duration-300"
          style={{ width: `${((120 - timeLeft) / 120) * 100}%` }}
        />
      </div>
    </div>
  );
};
