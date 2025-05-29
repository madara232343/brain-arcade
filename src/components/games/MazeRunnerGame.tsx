
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';
import { GameResult } from '@/pages/Games';

interface MazeRunnerGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface MazeCell {
  x: number;
  y: number;
  isWall: boolean;
  isPath: boolean;
  isStart: boolean;
  isEnd: boolean;
}

interface Player {
  x: number;
  y: number;
}

const MazeWall: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="#666666" />
    </mesh>
  );
};

const MazePlayer: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color="#00ff00" emissive="#004400" />
    </mesh>
  );
};

const MazeGoal: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.3, 0.3, 0.1, 8]} />
      <meshStandardMaterial color="#ffff00" emissive="#444400" />
    </mesh>
  );
};

export const MazeRunnerGame: React.FC<MazeRunnerGameProps> = ({
  onComplete,
  gameId
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [maze, setMaze] = useState<MazeCell[][]>([]);
  const [player, setPlayer] = useState<Player>({ x: 1, y: 1 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [level, setLevel] = useState(1);
  const [goalReached, setGoalReached] = useState(false);

  const generateMaze = (size: number) => {
    const newMaze: MazeCell[][] = [];
    
    // Initialize maze with walls
    for (let y = 0; y < size; y++) {
      newMaze[y] = [];
      for (let x = 0; x < size; x++) {
        newMaze[y][x] = {
          x,
          y,
          isWall: true,
          isPath: false,
          isStart: x === 1 && y === 1,
          isEnd: x === size - 2 && y === size - 2
        };
      }
    }
    
    // Create simple maze pattern
    for (let y = 1; y < size - 1; y += 2) {
      for (let x = 1; x < size - 1; x += 2) {
        newMaze[y][x].isWall = false;
        newMaze[y][x].isPath = true;
        
        // Create some connections
        if (Math.random() > 0.3 && x + 1 < size - 1) {
          newMaze[y][x + 1].isWall = false;
          newMaze[y][x + 1].isPath = true;
        }
        if (Math.random() > 0.3 && y + 1 < size - 1) {
          newMaze[y + 1][x].isWall = false;
          newMaze[y + 1][x].isPath = true;
        }
      }
    }
    
    // Ensure start and end are paths
    newMaze[1][1].isWall = false;
    newMaze[1][1].isPath = true;
    newMaze[size - 2][size - 2].isWall = false;
    newMaze[size - 2][size - 2].isPath = true;
    
    return newMaze;
  };

  const startGame = () => {
    setGameStarted(true);
    const mazeSize = Math.min(7 + level, 15);
    setMaze(generateMaze(mazeSize));
    setPlayer({ x: 1, y: 1 });
    setGoalReached(false);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameStarted || goalReached) return;
      
      const { key } = event;
      let newX = player.x;
      let newY = player.y;
      
      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newY = Math.max(0, player.y - 1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          newY = Math.min(maze.length - 1, player.y + 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newX = Math.max(0, player.x - 1);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          newX = Math.min(maze[0]?.length - 1 || 0, player.x + 1);
          break;
        default:
          return;
      }
      
      // Check if new position is valid
      if (maze[newY] && maze[newY][newX] && !maze[newY][newX].isWall) {
        setPlayer({ x: newX, y: newY });
        setScore(prev => prev + 10);
        
        // Check if reached goal
        if (maze[newY][newX].isEnd) {
          setGoalReached(true);
          setScore(prev => prev + 500 * level);
          setTimeout(() => {
            setLevel(prev => prev + 1);
            const newMazeSize = Math.min(7 + level + 1, 15);
            setMaze(generateMaze(newMazeSize));
            setPlayer({ x: 1, y: 1 });
            setGoalReached(false);
            setTimeLeft(prev => prev + 30);
          }, 2000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, player, maze, goalReached, level]);

  const endGame = () => {
    const accuracy = goalReached ? 100 : Math.min(100, (score / (level * 500)) * 100);
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 60 - timeLeft,
      xpEarned: Math.max(25, Math.floor(score / 10))
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4 md:p-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">🏃 Maze Runner</h3>
        <p className="mb-6 text-lg">Navigate through 3D mazes to reach the goal!</p>
        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <h4 className="text-xl font-bold mb-4">How to Play:</h4>
          <ul className="text-left space-y-2">
            <li>• Use WASD or arrow keys to move</li>
            <li>• Navigate from the green start to the yellow goal</li>
            <li>• Avoid the gray walls</li>
            <li>• Complete mazes quickly for bonus points</li>
          </ul>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Running
        </button>
      </div>
    );
  }

  return (
    <div className="text-white p-2 md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="text-lg font-bold">Time: {timeLeft}s</div>
          <div className="text-lg font-bold">Score: {score}</div>
          <div className="text-lg font-bold">Level: {level}</div>
        </div>
        {goalReached && (
          <div className="text-green-400 font-bold text-lg animate-bounce">
            Goal Reached! +{500 * level} points
          </div>
        )}
      </div>

      <div className="bg-white/5 rounded-xl p-2 mb-4">
        <p className="text-center text-yellow-300 font-medium">
          🎯 Use WASD or arrow keys to navigate to the yellow goal!
        </p>
      </div>

      <div className="h-96 md:h-[500px] bg-black/20 rounded-xl overflow-hidden">
        <Canvas camera={{ position: [5, 8, 5], fov: 75 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <directionalLight position={[0, 10, 0]} intensity={0.5} />
          
          {/* Maze walls */}
          {maze.map((row, y) =>
            row.map((cell, x) => {
              if (cell.isWall) {
                return (
                  <MazeWall
                    key={`wall-${x}-${y}`}
                    position={[x - maze[0].length / 2, 0, y - maze.length / 2]}
                  />
                );
              }
              return null;
            })
          )}
          
          {/* Player */}
          <MazePlayer
            position={[
              player.x - maze[0]?.length / 2 || 0,
              0.5,
              player.y - maze.length / 2
            ]}
          />
          
          {/* Goal */}
          {maze.map((row, y) =>
            row.map((cell, x) => {
              if (cell.isEnd) {
                return (
                  <MazeGoal
                    key={`goal-${x}-${y}`}
                    position={[x - maze[0].length / 2, 0.5, y - maze.length / 2]}
                  />
                );
              }
              return null;
            })
          )}
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={20}
          />
        </Canvas>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={endGame}
          className="bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-lg font-bold transition-all duration-300"
        >
          End Game
        </button>
      </div>
    </div>
  );
};
