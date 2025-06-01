
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
  speed: number;
}

export const SpaceRacerGame: React.FC<SpaceRacerGameProps> = ({ 
  onComplete, 
  gameId,
  activePowerUps = new Set(),
  onPowerUpUsed
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerX, setPlayerX] = useState(50); // Percentage position
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [fuel, setFuel] = useState(100);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(120);
  const [obstacleId, setObstacleId] = useState(0);
  const [gameArea, setGameArea] = useState({ width: 400, height: 500 });
  const [shields, setShields] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setPlayerX(50);
    setObstacles([]);
    setScore(0);
    setSpeed(2);
    setFuel(100);
    setLives(3);
    setTimeLeft(120);
    setShields(0);
    
    // Apply power-ups
    if (activePowerUps.has('timeFreeze')) {
      setTimeLeft(prev => prev + 30);
      onPowerUpUsed?.('timeFreeze');
    }
    
    if (activePowerUps.has('shield')) {
      setShields(3);
      onPowerUpUsed?.('shield');
    }
  };

  const generateObstacle = useCallback(() => {
    const types: Array<'asteroid' | 'enemy' | 'powerup'> = ['asteroid', 'asteroid', 'enemy', 'powerup'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    setObstacles(prev => [...prev, {
      id: obstacleId,
      x: Math.random() * 80 + 10, // Keep obstacles in 10-90% range
      y: -5,
      type,
      speed: speed + Math.random() * 2
    }]);
    
    setObstacleId(prev => prev + 1);
  }, [obstacleId, speed]);

  useEffect(() => {
    if (!gameStarted) return;

    const gameInterval = setInterval(() => {
      // Move obstacles
      setObstacles(prev => 
        prev.map(obs => ({ ...obs, y: obs.y + obs.speed }))
           .filter(obs => obs.y < 105)
      );
      
      // Generate new obstacles
      if (Math.random() < 0.25) {
        generateObstacle();
      }
      
      // Update score and speed
      setScore(prev => {
        const newScore = prev + Math.floor(speed * 2);
        setSpeed(Math.min(2 + newScore / 1000, 8));
        return newScore;
      });
      
      // Consume fuel
      setFuel(prev => Math.max(prev - 0.15, 0));
    }, 100);

    return () => clearInterval(gameInterval);
  }, [gameStarted, generateObstacle, speed]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  useEffect(() => {
    if (fuel <= 0 || lives <= 0) {
      endGame();
    }
  }, [fuel, lives]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setPlayerX(prev => Math.max(5, prev - 8));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setPlayerX(prev => Math.min(95, prev + 8));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted]);

  // Collision detection
  useEffect(() => {
    obstacles.forEach(obstacle => {
      const playerCollision = Math.abs(obstacle.x - playerX) < 8 && obstacle.y > 85 && obstacle.y < 95;
      
      if (playerCollision) {
        setObstacles(prev => prev.filter(obs => obs.id !== obstacle.id));
        
        switch (obstacle.type) {
          case 'asteroid':
          case 'enemy':
            if (shields > 0) {
              setShields(prev => prev - 1);
            } else {
              setLives(prev => prev - 1);
            }
            break;
          case 'powerup':
            setFuel(prev => Math.min(prev + 25, 100));
            setScore(prev => prev + 200);
            break;
        }
      }
    });
  }, [obstacles, playerX, shields]);

  const endGame = () => {
    const accuracy = Math.round(Math.min((score / 100), 100));
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
      timeSpent: 120 - timeLeft,
      xpEarned: Math.round(finalScore / 10)
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameStarted) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const normalizedX = (x / rect.width) * 100;
    setPlayerX(Math.max(5, Math.min(95, normalizedX)));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameStarted) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const normalizedX = (x / rect.width) * 100;
    setPlayerX(Math.max(5, Math.min(95, normalizedX)));
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🚀 Space Racer</h3>
        <p className="mb-6 text-sm md:text-base">Navigate through space, avoid obstacles, collect fuel!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4 text-left">
            <p className="text-xs md:text-sm mb-2">• 🖱️ Move mouse or drag finger to control ship</p>
            <p className="text-xs md:text-sm mb-2">• ⌨️ Use arrow keys or A/D on desktop</p>
            <p className="text-xs md:text-sm mb-2">• ☄️ Avoid asteroids and enemies</p>
            <p className="text-xs md:text-sm">• ⚡ Collect power-ups for fuel</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Launch Ship 🚀
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-2 md:p-4">
      <div className="mb-4">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs md:text-sm mb-4">
          <span className="bg-blue-500/30 px-2 py-1 rounded">⏱️ {timeLeft}s</span>
          <span className="bg-green-500/30 px-2 py-1 rounded">🎯 {score}</span>
          <span className="bg-red-500/30 px-2 py-1 rounded">❤️ {lives}</span>
          <span className="bg-yellow-500/30 px-2 py-1 rounded">⛽ {Math.round(fuel)}%</span>
          {shields > 0 && <span className="bg-purple-500/30 px-2 py-1 rounded">🛡️ {shields}</span>}
        </div>
      </div>

      <div 
        className="relative bg-gradient-to-b from-black via-purple-900/50 to-blue-900/50 rounded-xl mx-auto border border-white/30 overflow-hidden cursor-none select-none"
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          height: '60vh',
          minHeight: '400px',
          maxHeight: '500px'
        }}
        onTouchMove={handleTouchMove}
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => e.preventDefault()}
      >
        {/* Animated stars background */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 3}s infinite`
              }}
            />
          ))}
        </div>
        
        {/* Player ship */}
        <div
          className="absolute transition-all duration-100 ease-out z-10"
          style={{
            left: `${playerX}%`,
            bottom: '8%',
            transform: 'translateX(-50%)'
          }}
        >
          <div className="text-xl md:text-2xl">🚀</div>
          {shields > 0 && (
            <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-pulse"></div>
          )}
        </div>
        
        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className="absolute transition-all duration-75 ease-linear"
            style={{
              left: `${obstacle.x}%`,
              top: `${obstacle.y}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="text-lg md:text-xl">
              {obstacle.type === 'asteroid' && '☄️'}
              {obstacle.type === 'enemy' && '👾'}
              {obstacle.type === 'powerup' && '⚡'}
            </div>
          </div>
        ))}
        
        {/* Fuel bar */}
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="text-xs mb-1 text-white/80">Fuel</div>
          <div className="w-full bg-red-900/60 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${fuel}%` }}
            />
          </div>
        </div>

        {/* Speed indicator */}
        <div className="absolute top-16 left-4 text-xs text-white/70">
          Speed: {speed.toFixed(1)}x
        </div>
      </div>
      
      <div className="mt-4 text-xs md:text-sm text-white/70 max-w-sm mx-auto">
        <p className="md:hidden">Drag your finger to move the ship</p>
        <p className="hidden md:block">Move mouse or use arrow keys (A/D) to control your ship</p>
      </div>
      
      <button
        onClick={endGame}
        className="mt-3 bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 text-sm"
      >
        🏁 End Mission
      </button>
    </div>
  );
};
