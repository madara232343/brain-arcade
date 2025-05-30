
import React, { useState, useEffect, useCallback } from 'react';
import { GameResult } from '@/types/game';

interface BrickBreakerGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Brick {
  x: number;
  y: number;
  hits: number;
  color: string;
  points: number;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export const BrickBreakerGame: React.FC<BrickBreakerGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [paddle, setPaddle] = useState({ x: 50, width: 15 });
  const [ball, setBall] = useState<Ball>({ x: 50, y: 85, dx: 2, dy: -2 });
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [startTime] = useState(Date.now());

  const initializeBricks = () => {
    const newBricks: Brick[] = [];
    const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
    
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        newBricks.push({
          x: col * 10,
          y: row * 6 + 10,
          hits: row < 2 ? 2 : 1,
          color: colors[row] || 'blue',
          points: (5 - row) * 10
        });
      }
    }
    
    setBricks(newBricks);
  };

  const movePaddle = useCallback((direction: 'left' | 'right') => {
    setPaddle(prev => ({
      ...prev,
      x: Math.max(0, Math.min(85, prev.x + (direction === 'left' ? -5 : 5)))
    }));
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          movePaddle('left');
          break;
        case 'ArrowRight':
        case 'd':
          movePaddle('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, movePaddle]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setBall(prevBall => {
        let newBall = { ...prevBall };
        
        // Move ball
        newBall.x += newBall.dx;
        newBall.y += newBall.dy;
        
        // Wall collisions
        if (newBall.x <= 0 || newBall.x >= 100) {
          newBall.dx = -newBall.dx;
        }
        if (newBall.y <= 0) {
          newBall.dy = -newBall.dy;
        }
        
        // Paddle collision
        if (
          newBall.y >= 82 &&
          newBall.y <= 87 &&
          newBall.x >= paddle.x &&
          newBall.x <= paddle.x + paddle.width
        ) {
          newBall.dy = -Math.abs(newBall.dy);
          // Add some angle based on where it hits the paddle
          const hitPos = (newBall.x - paddle.x) / paddle.width;
          newBall.dx = (hitPos - 0.5) * 4;
        }
        
        // Brick collisions
        setBricks(prevBricks => {
          return prevBricks.filter(brick => {
            if (
              newBall.x >= brick.x &&
              newBall.x <= brick.x + 9 &&
              newBall.y >= brick.y &&
              newBall.y <= brick.y + 5
            ) {
              newBall.dy = -newBall.dy;
              
              if (brick.hits > 1) {
                setScore(prev => prev + brick.points / 2);
                return { ...brick, hits: brick.hits - 1 };
              } else {
                setScore(prev => prev + brick.points);
                return null;
              }
            }
            return brick;
          }).filter(Boolean) as Brick[];
        });
        
        // Ball goes below paddle
        if (newBall.y > 100) {
          setLives(prev => prev - 1);
          return { x: 50, y: 85, dx: 2, dy: -2 };
        }
        
        return newBall;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, paddle]);

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      onComplete({
        gameId,
        score,
        accuracy: Math.min(100, (score / 2500) * 100),
        timeSpent,
        xpEarned: Math.round(score / 5)
      });
    }
  }, [lives]);

  useEffect(() => {
    if (bricks.length === 0 && gameStarted) {
      setLevel(prev => prev + 1);
      initializeBricks();
      setBall({ x: 50, y: 85, dx: 2, dy: -2 });
    }
  }, [bricks.length]);

  const startGame = () => {
    setGameStarted(true);
    initializeBricks();
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">🧱 Brick Breaker</h3>
        <p className="mb-6">Break all the bricks with your ball!</p>
        <div className="mb-6 text-sm space-y-2">
          <p>• Use A/D or Arrow Keys to move paddle</p>
          <p>• Keep the ball in play</p>
          <p>• Break all bricks to advance levels</p>
          <p>• Different colored bricks give different points</p>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Breaking
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">🏁 Game Over!</h3>
        <div className="space-y-2">
          <p>Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
          <p>Level Reached: <span className="text-orange-400 font-bold">{level}</span></p>
          <p>Great brick breaking skills!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-black to-gray-800 border-2 border-white/20 rounded-xl overflow-hidden">
      {/* HUD */}
      <div className="absolute top-2 left-2 text-white text-sm z-10 space-y-1">
        <div>Score: {score}</div>
        <div>Lives: {lives}</div>
        <div>Level: {level}</div>
      </div>

      {/* Bricks */}
      {bricks.map((brick, index) => (
        <div
          key={index}
          className="absolute border border-black/20"
          style={{
            left: `${brick.x}%`,
            top: `${brick.y}%`,
            width: '9%',
            height: '5%',
            backgroundColor: brick.color,
            opacity: brick.hits > 1 ? 1 : 0.7
          }}
        />
      ))}

      {/* Ball */}
      <div
        className="absolute w-2 h-2 bg-white rounded-full"
        style={{
          left: `${ball.x}%`,
          top: `${ball.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Paddle */}
      <div
        className="absolute h-2 bg-blue-400 rounded"
        style={{
          left: `${paddle.x}%`,
          top: '85%',
          width: `${paddle.width}%`
        }}
      />

      {/* Controls hint */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white/70 text-xs">
        A/D or ←/→ to move paddle
      </div>
    </div>
  );
};
