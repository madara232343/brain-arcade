
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface MazeRunnerGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Position {
  x: number;
  y: number;
}

export const MazeRunnerGame: React.FC<MazeRunnerGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [maze, setMaze] = useState<number[][]>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [collected, setCollected] = useState(0);

  const mazeSize = 8;
  const goalPos = { x: mazeSize - 1, y: mazeSize - 1 };

  const generateMaze = () => {
    // Create a simple maze with walls (1) and paths (0)
    const newMaze = Array(mazeSize).fill(null).map(() => Array(mazeSize).fill(0));
    
    // Add some walls randomly but ensure path exists
    for (let i = 0; i < mazeSize; i++) {
      for (let j = 0; j < mazeSize; j++) {
        if (Math.random() < 0.3 && !(i === 0 && j === 0) && !(i === goalPos.x && j === goalPos.y)) {
          newMaze[i][j] = 1;
        }
      }
    }
    
    // Add collectibles (2)
    for (let i = 0; i < 5; i++) {
      const x = Math.floor(Math.random() * mazeSize);
      const y = Math.floor(Math.random() * mazeSize);
      if (newMaze[x][y] === 0 && !(x === 0 && y === 0) && !(x === goalPos.x && y === goalPos.y)) {
        newMaze[x][y] = 2;
      }
    }
    
    setMaze(newMaze);
  };

  React.useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameStarted, timeLeft]);

  const startGame = () => {
    setGameStarted(true);
    setPlayerPos({ x: 0, y: 0 });
    setScore(0);
    setLevel(1);
    setCollected(0);
    setTimeLeft(120);
    generateMaze();
  };

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    setPlayerPos(prev => {
      let newX = prev.x;
      let newY = prev.y;
      
      switch (direction) {
        case 'up': newY = Math.max(0, prev.y - 1); break;
        case 'down': newY = Math.min(mazeSize - 1, prev.y + 1); break;
        case 'left': newX = Math.max(0, prev.x - 1); break;
        case 'right': newX = Math.min(mazeSize - 1, prev.x + 1); break;
      }
      
      // Check if movement is valid (not into wall)
      if (maze[newY] && maze[newY][newX] === 1) {
        return prev; // Can't move into wall
      }
      
      // Check for collectible
      if (maze[newY] && maze[newY][newX] === 2) {
        setScore(s => s + 50);
        setCollected(c => c + 1);
        const newMaze = [...maze];
        newMaze[newY][newX] = 0;
        setMaze(newMaze);
      }
      
      // Check if reached goal
      if (newX === goalPos.x && newY === goalPos.y) {
        setScore(s => s + 200 + timeLeft * 2);
        setTimeout(() => {
          if (level < 3) {
            setLevel(l => l + 1);
            setPlayerPos({ x: 0, y: 0 });
            generateMaze();
          } else {
            endGame();
          }
        }, 1000);
      }
      
      return { x: newX, y: newY };
    });
  };

  const endGame = () => {
    const accuracy = Math.min(100, Math.round((collected * 20) + (level * 30)));
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 120 - timeLeft,
      xpEarned: Math.round(score / 3)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-2 md:p-4">
        <h3 className="text-lg md:text-2xl font-bold mb-4">🏃 Maze Runner</h3>
        <p className="mb-6 text-sm md:text-base">Navigate through the maze and collect items!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Use arrow buttons to move</p>
            <p className="text-xs md:text-sm mb-2">• Collect green items for points</p>
            <p className="text-xs md:text-sm">• Reach the red goal to advance</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 text-sm md:text-base"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-2 md:p-4">
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between text-sm md:text-lg mb-4">
          <span>Level: {level}/3</span>
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
        </div>
        <p className="text-xs md:text-sm">Collected: {collected}</p>
      </div>

      <div className="grid grid-cols-8 gap-0 max-w-xs md:max-w-sm mx-auto mb-4 md:mb-6 border-2 border-white/30 rounded-lg overflow-hidden">
        {maze.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs md:text-sm ${
                cell === 1 ? 'bg-gray-800' : 'bg-gray-200'
              }`}
            >
              {playerPos.x === x && playerPos.y === y && '🏃'}
              {x === goalPos.x && y === goalPos.y && '🎯'}
              {cell === 2 && '💚'}
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6">
        <div></div>
        <button
          onClick={() => movePlayer('up')}
          className="p-2 md:p-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold transition-all duration-200 text-sm md:text-base"
        >
          ↑
        </button>
        <div></div>
        <button
          onClick={() => movePlayer('left')}
          className="p-2 md:p-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold transition-all duration-200 text-sm md:text-base"
        >
          ←
        </button>
        <div></div>
        <button
          onClick={() => movePlayer('right')}
          className="p-2 md:p-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold transition-all duration-200 text-sm md:text-base"
        >
          →
        </button>
        <div></div>
        <button
          onClick={() => movePlayer('down')}
          className="p-2 md:p-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold transition-all duration-200 text-sm md:text-base"
        >
          ↓
        </button>
        <div></div>
      </div>

      <div className="bg-white/10 rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(timeLeft / 120) * 100}%` }}
        />
      </div>
    </div>
  );
};
