
import React, { useState, useEffect, useCallback } from 'react';
import { GameResult } from '@/types/game';

interface PlatformerGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Player {
  x: number;
  y: number;
  velocityY: number;
  onGround: boolean;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Coin {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

export const PlatformerGame: React.FC<PlatformerGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [player, setPlayer] = useState<Player>({ x: 50, y: 350, velocityY: 0, onGround: true });
  const [coins, setCoins] = useState<Coin[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [startTime] = useState(Date.now());

  const platforms: Platform[] = [
    { x: 0, y: 380, width: 600, height: 20 }, // Ground
    { x: 150, y: 320, width: 100, height: 15 },
    { x: 300, y: 260, width: 100, height: 15 },
    { x: 450, y: 200, width: 100, height: 15 },
    { x: 200, y: 140, width: 200, height: 15 },
  ];

  const initializeCoins = () => {
    const newCoins: Coin[] = [
      { id: 1, x: 200, y: 300, collected: false },
      { id: 2, x: 350, y: 240, collected: false },
      { id: 3, x: 500, y: 180, collected: false },
      { id: 4, x: 300, y: 120, collected: false },
      { id: 5, x: 100, y: 60, collected: false },
    ];
    setCoins(newCoins);
  };

  const jump = useCallback(() => {
    setPlayer(prev => {
      if (prev.onGround) {
        return { ...prev, velocityY: -12, onGround: false };
      }
      return prev;
    });
  }, []);

  const movePlayer = useCallback((direction: 'left' | 'right') => {
    setPlayer(prev => ({
      ...prev,
      x: Math.max(0, Math.min(580, prev.x + (direction === 'left' ? -5 : 5)))
    }));
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
        case 'ArrowUp':
        case 'w':
        case ' ':
          e.preventDefault();
          jump();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, movePlayer, jump]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setPlayer(prev => {
        let newPlayer = { ...prev };
        
        // Apply gravity
        newPlayer.velocityY += 0.8;
        newPlayer.y += newPlayer.velocityY;
        
        // Check platform collisions
        newPlayer.onGround = false;
        platforms.forEach(platform => {
          if (
            newPlayer.x + 20 > platform.x &&
            newPlayer.x < platform.x + platform.width &&
            newPlayer.y + 20 > platform.y &&
            newPlayer.y + 20 < platform.y + platform.height + 10 &&
            newPlayer.velocityY > 0
          ) {
            newPlayer.y = platform.y - 20;
            newPlayer.velocityY = 0;
            newPlayer.onGround = true;
          }
        });
        
        // Check if player fell off screen
        if (newPlayer.y > 400) {
          setGameOver(true);
        }
        
        return newPlayer;
      });

      // Check coin collection
      setCoins(prevCoins => {
        return prevCoins.map(coin => {
          if (
            !coin.collected &&
            Math.abs(player.x - coin.x) < 30 &&
            Math.abs(player.y - coin.y) < 30
          ) {
            setScore(prev => prev + 50);
            return { ...coin, collected: true };
          }
          return coin;
        });
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, player.x, player.y]);

  useEffect(() => {
    if (coins.every(coin => coin.collected) && coins.length > 0) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      onComplete({
        gameId,
        score: score + 100,
        accuracy: 100,
        timeSpent,
        xpEarned: Math.round((score + 100) / 3)
      });
    }
  }, [coins]);

  const startGame = () => {
    setGameStarted(true);
    initializeCoins();
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">🏃 Platform Runner</h3>
        <p className="mb-6">Jump and collect all the golden coins!</p>
        <div className="mb-6 text-sm space-y-2">
          <p>• Use A/D or Arrow Keys to move</p>
          <p>• Press W, UP, or SPACE to jump</p>
          <p>• Collect all coins to win</p>
          <p>• Don't fall off the platforms!</p>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Adventure
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">💀 Game Over</h3>
        <div className="space-y-2">
          <p>Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
          <p>Better luck next time!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-sky-400 to-green-300 border-2 border-white/20 rounded-xl overflow-hidden">
      {/* Score */}
      <div className="absolute top-2 left-2 text-white text-sm z-10 bg-black/30 rounded px-2 py-1">
        Score: {score}
      </div>

      {/* Platforms */}
      {platforms.map((platform, index) => (
        <div
          key={index}
          className="absolute bg-green-600 border-t-2 border-green-400"
          style={{
            left: `${(platform.x / 600) * 100}%`,
            top: `${(platform.y / 400) * 100}%`,
            width: `${(platform.width / 600) * 100}%`,
            height: `${(platform.height / 400) * 100}%`
          }}
        />
      ))}

      {/* Coins */}
      {coins.map(coin => (
        !coin.collected && (
          <div
            key={coin.id}
            className="absolute w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-600 animate-bounce"
            style={{
              left: `${(coin.x / 600) * 100}%`,
              top: `${(coin.y / 400) * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="w-2 h-2 bg-yellow-600 rounded-full mx-auto mt-1" />
          </div>
        )
      ))}

      {/* Player */}
      <div
        className="absolute w-5 h-5 bg-blue-500 rounded transition-all duration-75"
        style={{
          left: `${(player.x / 600) * 100}%`,
          top: `${(player.y / 400) * 100}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="w-2 h-2 bg-blue-700 rounded-full mx-auto" />
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white/70 text-xs bg-black/30 rounded px-2 py-1">
        A/D to move • W/SPACE to jump
      </div>
    </div>
  );
};
