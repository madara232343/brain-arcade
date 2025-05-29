
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';
import { GameResult } from '@/pages/Games';

interface CubeMatcherGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface CubePattern {
  id: string;
  position: [number, number, number];
  color: string;
  patternType: 'target' | 'player';
  isMatched: boolean;
  size: number;
}

const PatternCube: React.FC<{ 
  cube: CubePattern; 
  onClick: () => void;
}> = ({ cube, onClick }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current && cube.patternType === 'target') {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  const cubeColor = cube.isMatched ? '#00ff00' : cube.color;
  const opacity = cube.patternType === 'target' ? 0.5 : 0.8;

  return (
    <mesh 
      ref={meshRef} 
      position={cube.position} 
      onClick={onClick}
      scale={[cube.size, cube.size, cube.size]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={cubeColor} 
        transparent 
        opacity={opacity}
        wireframe={cube.patternType === 'target'}
      />
    </mesh>
  );
};

export const CubeMatcherGame: React.FC<CubeMatcherGameProps> = ({
  onComplete,
  gameId
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [targetPattern, setTargetPattern] = useState<CubePattern[]>([]);
  const [playerPattern, setPlayerPattern] = useState<CubePattern[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [level, setLevel] = useState(1);
  const [selectedColor, setSelectedColor] = useState('#ff6b6b');

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];

  const generateTargetPattern = (levelNum: number) => {
    const pattern: CubePattern[] = [];
    const patternSize = Math.min(2 + levelNum, 5);
    
    for (let i = 0; i < patternSize * patternSize; i++) {
      if (Math.random() > 0.3) { // 70% chance for a cube
        const x = (i % patternSize) - Math.floor(patternSize / 2);
        const z = Math.floor(i / patternSize) - Math.floor(patternSize / 2);
        
        pattern.push({
          id: `target-${i}`,
          position: [x * 2, 3, z * 2],
          color: colors[Math.floor(Math.random() * colors.length)],
          patternType: 'target',
          isMatched: false,
          size: 1
        });
      }
    }
    
    return pattern;
  };

  const startGame = () => {
    setGameStarted(true);
    setTargetPattern(generateTargetPattern(level));
    setPlayerPattern([]);
    
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

  const handleGridClick = (x: number, z: number) => {
    const cubeId = `player-${x}-${z}`;
    const existingCube = playerPattern.find(cube => cube.id === cubeId);
    
    if (existingCube) {
      // Remove cube
      setPlayerPattern(prev => prev.filter(cube => cube.id !== cubeId));
    } else {
      // Add cube
      const newCube: CubePattern = {
        id: cubeId,
        position: [x * 2, 0, z * 2],
        color: selectedColor,
        patternType: 'player',
        isMatched: false,
        size: 1
      };
      setPlayerPattern(prev => [...prev, newCube]);
    }
    
    checkMatches();
  };

  const checkMatches = () => {
    let matches = 0;
    let totalScore = 0;
    
    targetPattern.forEach(targetCube => {
      const matchingPlayerCube = playerPattern.find(playerCube => 
        Math.abs(playerCube.position[0] - targetCube.position[0]) < 0.1 &&
        Math.abs(playerCube.position[2] - targetCube.position[2]) < 0.1 &&
        playerCube.color === targetCube.color
      );
      
      if (matchingPlayerCube) {
        matches++;
        totalScore += 50;
      }
    });
    
    if (matches === targetPattern.length && playerPattern.length === targetPattern.length) {
      // Perfect match!
      setScore(prev => prev + totalScore + (100 * level));
      setTimeout(() => {
        setLevel(prev => prev + 1);
        setTargetPattern(generateTargetPattern(level + 1));
        setPlayerPattern([]);
        setTimeLeft(prev => prev + 20);
      }, 1000);
    }
  };

  const endGame = () => {
    const matches = targetPattern.filter(targetCube =>
      playerPattern.some(playerCube =>
        Math.abs(playerCube.position[0] - targetCube.position[0]) < 0.1 &&
        Math.abs(playerCube.position[2] - targetCube.position[2]) < 0.1 &&
        playerCube.color === targetCube.color
      )
    ).length;
    
    const accuracy = targetPattern.length > 0 ? (matches / targetPattern.length) * 100 : 0;
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 120 - timeLeft,
      xpEarned: Math.max(25, Math.floor(score / 10))
    });
  };

  const renderGrid = () => {
    const gridCubes = [];
    const gridSize = 5;
    
    for (let x = -2; x <= 2; x++) {
      for (let z = -2; z <= 2; z++) {
        gridCubes.push(
          <mesh 
            key={`grid-${x}-${z}`}
            position={[x * 2, -0.1, z * 2]}
            onClick={() => handleGridClick(x, z)}
          >
            <boxGeometry args={[1.8, 0.1, 1.8]} />
            <meshStandardMaterial color="#333333" transparent opacity={0.3} />
          </mesh>
        );
      }
    }
    
    return gridCubes;
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4 md:p-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">🎯 Cube Matcher</h3>
        <p className="mb-6 text-lg">Match 3D cube patterns with precision!</p>
        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <h4 className="text-xl font-bold mb-4">How to Play:</h4>
          <ul className="text-left space-y-2">
            <li>• Study the wireframe pattern above</li>
            <li>• Click grid squares to place cubes below</li>
            <li>• Match the exact positions and colors</li>
            <li>• Select colors from the palette</li>
            <li>• Complete patterns to advance levels</li>
          </ul>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Matching
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
      </div>

      <div className="bg-white/5 rounded-xl p-2 mb-4">
        <p className="text-center text-yellow-300 font-medium mb-2">
          🎯 Match the wireframe pattern above by placing cubes below!
        </p>
        <div className="flex justify-center space-x-2">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded border-2 transition-all ${
                selectedColor === color ? 'border-white scale-110' : 'border-gray-400'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="h-96 md:h-[500px] bg-black/20 rounded-xl overflow-hidden">
        <Canvas camera={{ position: [6, 6, 6], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {/* Grid */}
          {renderGrid()}
          
          {/* Target pattern */}
          {targetPattern.map((cube) => (
            <PatternCube
              key={cube.id}
              cube={cube}
              onClick={() => {}}
            />
          ))}
          
          {/* Player pattern */}
          {playerPattern.map((cube) => (
            <PatternCube
              key={cube.id}
              cube={cube}
              onClick={() => {}}
            />
          ))}
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={15}
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
