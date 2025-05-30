
import React, { useState, useEffect, useCallback } from 'react';
import { GameResult } from '@/types/game';

interface SnakeGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

export const SnakeGame: React.FC<SnakeGameProps> = ({ onComplete, gameId }) => {
  const gridSize = 20;
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  }, []);

  const moveSnake = useCallback(() => {
    if (!gameRunning || gameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        setGameOver(true);
        setGameRunning(false);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setGameRunning(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameRunning, gameOver, generateFood]);

  useEffect(() => {
    if (gameRunning && !gameOver) {
      const gameLoop = setInterval(moveSnake, 150);
      return () => clearInterval(gameLoop);
    }
  }, [moveSnake, gameRunning, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameRunning]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setScore(0);
    setGameRunning(true);
    setGameOver(false);
    setStartTime(Date.now());
  };

  const endGame = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const accuracy = Math.min(100, Math.round((score / Math.max(1, timeSpent)) * 10));
    
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent,
      xpEarned: Math.round(score / 2)
    });
  };

  if (gameOver) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Game Over!</h3>
        <p className="text-xl mb-4">Final Score: {score}</p>
        <p className="mb-6">Snake Length: {snake.length}</p>
        <button
          onClick={endGame}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Complete Game
        </button>
      </div>
    );
  }

  if (!gameRunning) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Snake Game</h3>
        <p className="mb-6">Use arrow keys to control the snake. Eat food to grow and score points!</p>
        <button
          onClick={startGame}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-4">
        <span className="text-xl font-bold">Score: {score}</span>
        <span className="ml-6 text-lg">Length: {snake.length}</span>
      </div>
      
      <div 
        className="grid bg-gray-800 border-2 border-white/30 mx-auto"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: '400px',
          height: '400px'
        }}
      >
        {Array.from({ length: gridSize * gridSize }, (_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;
          
          return (
            <div
              key={index}
              className={`border border-gray-700 ${
                isFood ? 'bg-red-500' : 
                isHead ? 'bg-green-400' : 
                isSnake ? 'bg-green-600' : 
                'bg-gray-900'
              }`}
            />
          );
        })}
      </div>
      
      <p className="mt-4 text-sm text-white/70">Use arrow keys to move</p>
    </div>
  );
};
