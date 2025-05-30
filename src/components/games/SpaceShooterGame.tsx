
import React, { useState, useEffect, useCallback } from 'react';
import { GameResult } from '@/types/game';

interface SpaceShooterGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Position {
  x: number;
  y: number;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  speed: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
}

export const SpaceShooterGame: React.FC<SpaceShooterGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [player, setPlayer] = useState<Position>({ x: 50, y: 90 });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [startTime] = useState(Date.now());

  const movePlayer = useCallback((direction: 'left' | 'right') => {
    setPlayer(prev => ({
      ...prev,
      x: Math.max(0, Math.min(100, prev.x + (direction === 'left' ? -5 : 5)))
    }));
  }, []);

  const shoot = useCallback(() => {
    setBullets(prev => [...prev, {
      id: Date.now(),
      x: player.x,
      y: player.y - 5
    }]);
  }, [player]);

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
        case ' ':
          e.preventDefault();
          shoot();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, movePlayer, shoot]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      // Move bullets
      setBullets(prev => prev
        .map(bullet => ({ ...bullet, y: bullet.y - 3 }))
        .filter(bullet => bullet.y > 0)
      );

      // Move enemies
      setEnemies(prev => prev.map(enemy => ({
        ...enemy,
        y: enemy.y + enemy.speed
      })));

      // Spawn enemies
      if (Math.random() < 0.02 + level * 0.005) {
        setEnemies(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 90,
          y: 0,
          speed: 1 + Math.random() * level
        }]);
      }

      // Check collisions
      setBullets(prevBullets => {
        const remainingBullets = [...prevBullets];
        setEnemies(prevEnemies => {
          const remainingEnemies = [...prevEnemies];
          
          prevBullets.forEach((bullet, bulletIndex) => {
            prevEnemies.forEach((enemy, enemyIndex) => {
              const distance = Math.sqrt(
                Math.pow(bullet.x - enemy.x, 2) + Math.pow(bullet.y - enemy.y, 2)
              );
              
              if (distance < 5) {
                remainingBullets.splice(bulletIndex, 1);
                remainingEnemies.splice(enemyIndex, 1);
                setScore(prev => prev + 10 * level);
              }
            });
          });
          
          return remainingEnemies.filter(enemy => enemy.y < 100);
        });
        
        return remainingBullets;
      });

      // Check player-enemy collisions
      setEnemies(prev => {
        const hitEnemies = prev.filter(enemy => {
          const distance = Math.sqrt(
            Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2)
          );
          return distance < 8;
        });
        
        if (hitEnemies.length > 0) {
          setLives(l => l - 1);
          return prev.filter(enemy => !hitEnemies.includes(enemy));
        }
        
        return prev;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, player, level]);

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      onComplete({
        gameId,
        score,
        accuracy: Math.min(100, score / 10),
        timeSpent,
        xpEarned: Math.round(score / 2)
      });
    }
  }, [lives]);

  useEffect(() => {
    if (score > 0 && score % 200 === 0) {
      setLevel(prev => prev + 1);
    }
  }, [score]);

  const startGame = () => {
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">🚀 Space Shooter</h3>
        <p className="mb-6">Defend Earth from alien invasion!</p>
        <div className="mb-6 text-sm space-y-2">
          <p>• Use A/D or Arrow Keys to move</p>
          <p>• Press SPACE to shoot</p>
          <p>• Avoid enemy ships</p>
          <p>• Survive as long as possible!</p>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Mission
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">🛸 Mission Complete</h3>
        <div className="space-y-2">
          <p>Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
          <p>Level Reached: <span className="text-blue-400 font-bold">{level}</span></p>
          <p>Great defense, Captain!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-black to-purple-900 border-2 border-white/20 rounded-xl overflow-hidden">
      {/* HUD */}
      <div className="absolute top-2 left-2 text-white text-sm z-10">
        <div>Score: {score}</div>
        <div>Lives: {lives}</div>
        <div>Level: {level}</div>
      </div>

      {/* Player */}
      <div
        className="absolute w-6 h-6 bg-green-400 rounded-t-full transition-all duration-100"
        style={{
          left: `${player.x}%`,
          top: `${player.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="w-2 h-2 bg-green-600 rounded-full mx-auto"></div>
      </div>

      {/* Bullets */}
      {bullets.map(bullet => (
        <div
          key={bullet.id}
          className="absolute w-1 h-3 bg-yellow-400 rounded-full"
          style={{
            left: `${bullet.x}%`,
            top: `${bullet.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Enemies */}
      {enemies.map(enemy => (
        <div
          key={enemy.id}
          className="absolute w-6 h-6 bg-red-500 rounded-b-full"
          style={{
            left: `${enemy.x}%`,
            top: `${enemy.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-2 h-2 bg-red-700 rounded-full mx-auto mt-1"></div>
        </div>
      ))}

      {/* Controls hint */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white/70 text-xs">
        A/D to move • SPACE to shoot
      </div>
    </div>
  );
};
