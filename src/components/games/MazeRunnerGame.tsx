
import React, { useState, useEffect, useCallback } from 'react';
import { GameResult } from '@/types/game';

interface MazeRunnerGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface Position {
  x: number;
  y: number;
}

export const MazeRunnerGame: React.FC<MazeRunnerGameProps> = ({ 
  onComplete, 
  gameId,
  activePowerUps = new Set(),
  onPowerUpUsed
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 });
  const [maze, setMaze] = useState<number[][]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [moves, setMoves] = useState(0);
  const [collectibles, setCollectibles] = useState<Position[]>([]);
  const [collectedItems, setCollectedItems] = useState(0);

  const mazeSize = 11;
  const WALL = 1;
  const PATH = 0;
  const EXIT = 2;
  const COLLECTIBLE = 3;

  const generateMaze = useCallback(() => {
    const newMaze = Array(mazeSize).fill(null).map(() => Array(mazeSize).fill(WALL));
    
    // Create paths using recursive backtracking
    const createPath = (x: number, y: number) => {
      newMaze[y][x] = PATH;
      
      const directions = [
        [0, -2], [2, 0], [0, 2], [-2, 0]
      ].sort(() => Math.random() - 0.5);
      
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx > 0 && nx < mazeSize - 1 && ny > 0 && ny < mazeSize - 1 && newMaze[ny][nx] === WALL) {
          newMaze[y + dy/2][x + dx/2] = PATH;
          createPath(nx, ny);
        }
      }
    };
    
    createPath(1, 1);
    
    // Set exit
    newMaze[mazeSize - 2][mazeSize - 2] = EXIT;
    
    // Add collectibles
    const newCollectibles: Position[] = [];
    for (let i = 0; i < 5; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * (mazeSize - 2)) + 1;
        y = Math.floor(Math.random() * (mazeSize - 2)) + 1;
      } while (newMaze[y][x] !== PATH || (x === 1 && y === 1) || (x === mazeSize - 2 && y === mazeSize - 2));
      
      newMaze[y][x] = COLLECTIBLE;
      newCollectibles.push({ x, y });
    }
    
    setMaze(newMaze);
    setCollectibles(newCollectibles);
    setPlayerPos({ x: 1, y: 1 });
    setMoves(0);
    setCollectedItems(0);
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
    setScore(0);
    setTimeLeft(120);
    generateMaze();
    
    // Apply time freeze power-up
    if (activePowerUps.has('timeFreeze')) {
      setTimeLeft(prev => prev + 30);
      onPowerUpUsed?.('timeFreeze');
    }
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const movePlayer = useCallback((dx: number, dy: number) => {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    
    if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && maze[newY][newX] !== WALL) {
      setPlayerPos({ x: newX, y: newY });
      setMoves(prev => prev + 1);
      
      // Check for collectible
      if (maze[newY][newX] === COLLECTIBLE) {
        setCollectedItems(prev => prev + 1);
        setScore(prev => prev + 100);
        const newMaze = [...maze];
        newMaze[newY][newX] = PATH;
        setMaze(newMaze);
      }
      
      // Check for exit
      if (maze[newY][newX] === EXIT) {
        completeLevel();
      }
    }
  }, [playerPos, maze]);

  const completeLevel = () => {
    const timeBonus = Math.floor(timeLeft / 5) * 10;
    const moveBonus = Math.max(0, (200 - moves) * 2);
    const collectibleBonus = collectedItems * 50;
    const levelScore = level * 300;
    
    setScore(prev => prev + timeBonus + moveBonus + collectibleBonus + levelScore);
    setLevel(prev => prev + 1);
    
    setTimeout(() => {
      generateMaze();
    }, 1500);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, movePlayer]);

  const endGame = () => {
    const accuracy = Math.min(100, Math.round((score / (level * 500)) * 100));
    
    let finalScore = score;
    
    // Apply double XP power-up
    if (activePowerUps.has('doubleXP')) {
      finalScore *= 2;
      onPowerUpUsed?.('doubleXP');
    }
    
    onComplete({
      gameId,
      score: finalScore,
      accuracy: Math.max(accuracy, 50),
      timeSpent: 120 - timeLeft,
      xpEarned: Math.round(finalScore / 6)
    });
  };

  const getCellContent = (x: number, y: number) => {
    if (playerPos.x === x && playerPos.y === y) {
      return '🏃';
    }
    
    switch (maze[y][x]) {
      case WALL:
        return '';
      case PATH:
        return '';
      case EXIT:
        return '🏁';
      case COLLECTIBLE:
        return '💎';
      default:
        return '';
    }
  };

  const getCellClass = (x: number, y: number) => {
    const baseClass = "w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs md:text-sm transition-all duration-200";
    
    if (playerPos.x === x && playerPos.y === y) {
      return `${baseClass} bg-blue-500 rounded-full scale-110`;
    }
    
    switch (maze[y][x]) {
      case WALL:
        return `${baseClass} bg-gray-800 border border-gray-600`;
      case PATH:
        return `${baseClass} bg-gray-200`;
      case EXIT:
        return `${baseClass} bg-green-500 animate-pulse`;
      case COLLECTIBLE:
        return `${baseClass} bg-yellow-400 animate-bounce`;
      default:
        return `${baseClass} bg-gray-200`;
    }
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🏃 Maze Runner</h3>
        <p className="mb-6 text-sm md:text-base">Navigate through the maze to reach the exit!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• 🏃 Use arrow keys or WASD to move</p>
            <p className="text-xs md:text-sm mb-2">• 💎 Collect gems for bonus points</p>
            <p className="text-xs md:text-sm">• 🏁 Reach the exit to advance levels</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Running
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-4">
        <div className="flex justify-between text-xs md:text-lg mb-4">
          <span>Time: {timeLeft}s</span>
          <span>Level: {level}</span>
          <span>Score: {score}</span>
        </div>
        <div className="flex justify-between text-xs md:text-sm text-white/70">
          <span>Moves: {moves}</span>
          <span>Gems: {collectedItems}/{collectibles.length + collectedItems}</span>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-3 md:p-4 mb-4 max-w-md mx-auto overflow-auto">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${mazeSize}, minmax(0, 1fr))` }}>
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <div key={`${x}-${y}`} className={getCellClass(x, y)}>
                {getCellContent(x, y)}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto md:hidden">
          <div></div>
          <button
            onClick={() => movePlayer(0, -1)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-bold"
          >
            ↑
          </button>
          <div></div>
          <button
            onClick={() => movePlayer(-1, 0)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-bold"
          >
            ←
          </button>
          <div></div>
          <button
            onClick={() => movePlayer(1, 0)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-bold"
          >
            →
          </button>
          <div></div>
          <button
            onClick={() => movePlayer(0, 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-bold"
          >
            ↓
          </button>
          <div></div>
        </div>
        
        <p className="text-xs md:text-sm text-white/70 mt-2">
          <span className="md:hidden">Use buttons above or</span>
          <span className="hidden md:inline">Use</span> arrow keys/WASD to move
        </p>
      </div>
      
      <button
        onClick={endGame}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200 text-sm"
      >
        End Game
      </button>
    </div>
  );
};
