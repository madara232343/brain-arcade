
import React, { useState, useEffect, useCallback } from 'react';
import { GameResult } from '@/types/game';

interface CarRacingGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Car {
  id: number;
  x: number;
  y: number;
  speed: number;
}

export const CarRacingGame: React.FC<CarRacingGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerX, setPlayerX] = useState(50);
  const [cars, setCars] = useState<Car[]>([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [roadOffset, setRoadOffset] = useState(0);
  const [startTime] = useState(Date.now());

  const movePlayer = useCallback((direction: 'left' | 'right') => {
    setPlayerX(prev => Math.max(25, Math.min(75, prev + (direction === 'left' ? -8 : 8))));
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
          movePlayer('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, movePlayer]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      // Move road
      setRoadOffset(prev => (prev + speed * 2) % 40);
      
      // Move cars
      setCars(prev => prev
        .map(car => ({ ...car, y: car.y + car.speed }))
        .filter(car => car.y < 110)
      );

      // Spawn new cars
      if (Math.random() < 0.015 + speed * 0.001) {
        const lanes = [35, 50, 65];
        setCars(prev => [...prev, {
          id: Date.now(),
          x: lanes[Math.floor(Math.random() * lanes.length)],
          y: -10,
          speed: speed + Math.random() * 2
        }]);
      }

      // Check collisions
      setCars(prevCars => {
        const collision = prevCars.some(car => {
          const distance = Math.sqrt(
            Math.pow(playerX - car.x, 2) + Math.pow(85 - car.y, 2)
          );
          return distance < 12;
        });
        
        if (collision) {
          setGameOver(true);
        }
        
        return prevCars;
      });

      // Increase score and speed
      setScore(prev => prev + Math.round(speed));
      setSpeed(prev => Math.min(5, prev + 0.001));
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, playerX, speed]);

  useEffect(() => {
    if (gameOver) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      onComplete({
        gameId,
        score,
        accuracy: Math.min(100, score / 50),
        timeSpent,
        xpEarned: Math.round(score / 3)
      });
    }
  }, [gameOver]);

  const startGame = () => {
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">🏎️ Highway Racer</h3>
        <p className="mb-6">Race through traffic at high speed!</p>
        <div className="mb-6 text-sm space-y-2">
          <p>• Use A/D or Arrow Keys to steer</p>
          <p>• Avoid other cars</p>
          <p>• Speed increases over time</p>
          <p>• Survive as long as possible!</p>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Racing
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">🏁 Race Finished!</h3>
        <div className="space-y-2">
          <p>Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
          <p>Top Speed: <span className="text-orange-400 font-bold">{speed.toFixed(1)}x</span></p>
          <p>Great driving skills!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-white/20 rounded-xl overflow-hidden">
      {/* Road */}
      <div className="absolute inset-0 bg-gray-700">
        {/* Road lines */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-8 bg-white rounded-full left-1/2 transform -translate-x-1/2"
            style={{
              top: `${(i * 40 - roadOffset) % 400}px`,
              opacity: 0.8
            }}
          />
        ))}
        
        {/* Lane dividers */}
        <div className="absolute left-1/3 top-0 w-0.5 h-full bg-yellow-400 opacity-60" />
        <div className="absolute left-2/3 top-0 w-0.5 h-full bg-yellow-400 opacity-60" />
      </div>

      {/* HUD */}
      <div className="absolute top-2 left-2 text-white text-sm z-10 space-y-1">
        <div>Score: {score}</div>
        <div>Speed: {speed.toFixed(1)}x</div>
      </div>

      {/* Player car */}
      <div
        className="absolute w-8 h-12 bg-blue-500 rounded-lg transition-all duration-100 z-10"
        style={{
          left: `${playerX}%`,
          top: '85%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
        }}
      >
        <div className="w-2 h-2 bg-yellow-400 rounded-full absolute top-1 left-1"></div>
        <div className="w-2 h-2 bg-yellow-400 rounded-full absolute top-1 right-1"></div>
        <div className="w-2 h-2 bg-red-500 rounded-full absolute bottom-1 left-1"></div>
        <div className="w-2 h-2 bg-red-500 rounded-full absolute bottom-1 right-1"></div>
      </div>

      {/* Traffic cars */}
      {cars.map(car => (
        <div
          key={car.id}
          className="absolute w-8 h-12 bg-red-500 rounded-lg"
          style={{
            left: `${car.x}%`,
            top: `${car.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-2 h-2 bg-yellow-400 rounded-full absolute top-1 left-1"></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full absolute top-1 right-1"></div>
        </div>
      ))}

      {/* Controls hint */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white/70 text-xs">
        A/D or ←/→ to steer
      </div>
    </div>
  );
};
