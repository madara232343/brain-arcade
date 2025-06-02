
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface OrbitNavigatorGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Planet {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  collected: boolean;
}

interface Ship {
  x: number;
  y: number;
  angle: number;
  orbitRadius: number;
  orbitSpeed: number;
}

export const OrbitNavigatorGame: React.FC<OrbitNavigatorGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [ship, setShip] = useState<Ship>({ x: 150, y: 150, angle: 0, orbitRadius: 50, orbitSpeed: 0.02 });
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(120);
  const [collected, setCollected] = useState(0);
  const [obstacles, setObstacles] = useState<Planet[]>([]);

  const centerX = 150;
  const centerY = 150;

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameStarted, timeLeft]);

  useEffect(() => {
    if (gameStarted) {
      const gameLoop = setInterval(() => {
        updateShip();
        checkCollisions();
      }, 16); // ~60fps
      return () => clearInterval(gameLoop);
    }
  }, [gameStarted, ship]);

  const generateLevel = () => {
    const newPlanets: Planet[] = [];
    const newObstacles: Planet[] = [];
    
    // Generate collectible planets
    for (let i = 0; i < 3 + level; i++) {
      const angle = (Math.PI * 2 / (3 + level)) * i;
      const distance = 80 + Math.random() * 60;
      newPlanets.push({
        id: i,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        radius: 8,
        color: 'bg-green-500',
        collected: false
      });
    }
    
    // Generate obstacles
    for (let i = 0; i < level; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 60 + Math.random() * 80;
      newObstacles.push({
        id: i + 100,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        radius: 12,
        color: 'bg-red-500',
        collected: false
      });
    }
    
    setPlanets(newPlanets);
    setObstacles(newObstacles);
    setCollected(0);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLevel(1);
    setTimeLeft(120);
    setShip({ x: 150, y: 150, angle: 0, orbitRadius: 50, orbitSpeed: 0.02 });
    generateLevel();
  };

  const updateShip = () => {
    setShip(prev => {
      const newAngle = prev.angle + prev.orbitSpeed;
      const newX = centerX + Math.cos(newAngle) * prev.orbitRadius;
      const newY = centerY + Math.sin(newAngle) * prev.orbitRadius;
      
      return {
        ...prev,
        angle: newAngle,
        x: newX,
        y: newY
      };
    });
  };

  const checkCollisions = () => {
    // Check planet collection
    setPlanets(prev => prev.map(planet => {
      if (!planet.collected) {
        const distance = Math.sqrt(
          Math.pow(ship.x - planet.x, 2) + Math.pow(ship.y - planet.y, 2)
        );
        
        if (distance < planet.radius + 8) {
          setScore(s => s + 100);
          setCollected(c => c + 1);
          return { ...planet, collected: true };
        }
      }
      return planet;
    }));
    
    // Check obstacle collision
    const hitObstacle = obstacles.some(obstacle => {
      const distance = Math.sqrt(
        Math.pow(ship.x - obstacle.x, 2) + Math.pow(ship.y - obstacle.y, 2)
      );
      return distance < obstacle.radius + 8;
    });
    
    if (hitObstacle) {
      endGame();
    }
  };

  const adjustOrbit = (type: 'radius' | 'speed', direction: 'increase' | 'decrease') => {
    setShip(prev => {
      if (type === 'radius') {
        const newRadius = direction === 'increase' 
          ? Math.min(140, prev.orbitRadius + 10)
          : Math.max(30, prev.orbitRadius - 10);
        return { ...prev, orbitRadius: newRadius };
      } else {
        const newSpeed = direction === 'increase'
          ? Math.min(0.05, prev.orbitSpeed + 0.005)
          : Math.max(0.01, prev.orbitSpeed - 0.005);
        return { ...prev, orbitSpeed: newSpeed };
      }
    });
  };

  const endGame = () => {
    const accuracy = planets.length > 0 ? Math.round((collected / planets.length) * 100) : 0;
    onComplete({
      gameId,
      score,
      accuracy: Math.min(accuracy, 100),
      timeSpent: 120 - timeLeft,
      xpEarned: Math.round(score / 3)
    });
  };

  // Check level completion
  useEffect(() => {
    if (collected > 0 && collected === planets.length) {
      setScore(prev => prev + level * 200);
      setLevel(prev => prev + 1);
      setTimeout(() => generateLevel(), 1000);
    }
  }, [collected, planets.length]);

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-2 md:p-4">
        <h3 className="text-lg md:text-2xl font-bold mb-4">🚀 Orbit Navigator</h3>
        <p className="mb-6 text-sm md:text-base">Navigate orbital paths to collect planets!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Adjust orbit radius and speed</p>
            <p className="text-xs md:text-sm mb-2">• Collect green planets, avoid red obstacles</p>
            <p className="text-xs md:text-sm">• Complete levels to progress</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 text-sm md:text-base"
        >
          Start Navigation
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-2 md:p-4">
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between text-sm md:text-lg mb-4">
          <span>Level: {level}</span>
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
        </div>
        <p className="text-xs md:text-sm">Collected: {collected}/{planets.length}</p>
      </div>

      {/* Game Area */}
      <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto mb-6 bg-black/50 rounded-lg overflow-hidden border-2 border-white/30">
        {/* Central Star */}
        <div 
          className="absolute w-6 h-6 bg-yellow-400 rounded-full"
          style={{
            left: `${centerX - 12}px`,
            top: `${centerY - 12}px`
          }}
        />
        
        {/* Orbit Path */}
        <div 
          className="absolute border border-white/20 rounded-full"
          style={{
            width: `${ship.orbitRadius * 2}px`,
            height: `${ship.orbitRadius * 2}px`,
            left: `${centerX - ship.orbitRadius}px`,
            top: `${centerY - ship.orbitRadius}px`
          }}
        />
        
        {/* Ship */}
        <div 
          className="absolute w-4 h-4 bg-blue-500 rounded-full transition-all duration-100"
          style={{
            left: `${ship.x - 8}px`,
            top: `${ship.y - 8}px`
          }}
        />
        
        {/* Planets */}
        {planets.map(planet => (
          <div
            key={planet.id}
            className={`absolute rounded-full transition-all duration-200 ${
              planet.collected ? 'opacity-30 scale-75' : planet.color
            }`}
            style={{
              width: `${planet.radius * 2}px`,
              height: `${planet.radius * 2}px`,
              left: `${planet.x - planet.radius}px`,
              top: `${planet.y - planet.radius}px`
            }}
          />
        ))}
        
        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className={`absolute ${obstacle.color} rounded-full animate-pulse`}
            style={{
              width: `${obstacle.radius * 2}px`,
              height: `${obstacle.radius * 2}px`,
              left: `${obstacle.x - obstacle.radius}px`,
              top: `${obstacle.y - obstacle.radius}px`
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
        <div className="text-center">
          <p className="text-xs md:text-sm mb-2">Orbit Radius</p>
          <div className="flex gap-2">
            <button
              onClick={() => adjustOrbit('radius', 'decrease')}
              className="px-2 md:px-3 py-1 md:py-2 bg-red-500 hover:bg-red-600 rounded text-xs md:text-sm"
            >
              -
            </button>
            <button
              onClick={() => adjustOrbit('radius', 'increase')}
              className="px-2 md:px-3 py-1 md:py-2 bg-green-500 hover:bg-green-600 rounded text-xs md:text-sm"
            >
              +
            </button>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs md:text-sm mb-2">Orbit Speed</p>
          <div className="flex gap-2">
            <button
              onClick={() => adjustOrbit('speed', 'decrease')}
              className="px-2 md:px-3 py-1 md:py-2 bg-red-500 hover:bg-red-600 rounded text-xs md:text-sm"
            >
              -
            </button>
            <button
              onClick={() => adjustOrbit('speed', 'increase')}
              className="px-2 md:px-3 py-1 md:py-2 bg-green-500 hover:bg-green-600 rounded text-xs md:text-sm"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/10 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(timeLeft / 120) * 100}%` }}
        />
      </div>
    </div>
  );
};
