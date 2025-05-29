
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cone } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import { GameResult } from '@/pages/Games';

interface SpatialReasoningGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface Shape {
  id: string;
  type: 'box' | 'sphere' | 'cone';
  position: [number, number, number];
  color: string;
  isTarget: boolean;
  isSelected: boolean;
}

const RotatingShape: React.FC<{ 
  shape: Shape; 
  onClick: () => void;
}> = ({ shape, onClick }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  const getShapeComponent = () => {
    const props = {
      ref: meshRef,
      position: shape.position,
      onClick,
      scale: shape.isSelected ? 1.2 : 1.0
    };

    switch (shape.type) {
      case 'box':
        return (
          <Box {...props}>
            <meshStandardMaterial 
              color={shape.isSelected ? '#ffff00' : shape.color} 
              transparent 
              opacity={0.8} 
            />
          </Box>
        );
      case 'sphere':
        return (
          <Sphere {...props}>
            <meshStandardMaterial 
              color={shape.isSelected ? '#ffff00' : shape.color} 
              transparent 
              opacity={0.8} 
            />
          </Sphere>
        );
      case 'cone':
        return (
          <Cone {...props}>
            <meshStandardMaterial 
              color={shape.isSelected ? '#ffff00' : shape.color} 
              transparent 
              opacity={0.8} 
            />
          </Cone>
        );
      default:
        return null;
    }
  };

  return getShapeComponent();
};

export const SpatialReasoningGame: React.FC<SpatialReasoningGameProps> = ({
  onComplete,
  gameId
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [level, setLevel] = useState(1);
  const [targetFound, setTargetFound] = useState(false);

  const generateShapes = (levelNum: number) => {
    const shapeTypes: ('box' | 'sphere' | 'cone')[] = ['box', 'sphere', 'cone'];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    const newShapes: Shape[] = [];
    
    const shapeCount = Math.min(5 + levelNum, 12);
    
    for (let i = 0; i < shapeCount; i++) {
      const shape: Shape = {
        id: `shape-${i}`,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4
        ],
        color: colors[Math.floor(Math.random() * colors.length)],
        isTarget: i === 0, // First shape is always the target
        isSelected: false
      };
      newShapes.push(shape);
    }
    
    return newShapes;
  };

  const startGame = () => {
    setGameStarted(true);
    setShapes(generateShapes(level));
    setTargetFound(false);
    
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

  const handleShapeClick = (shapeId: string) => {
    const clickedShape = shapes.find(s => s.id === shapeId);
    if (!clickedShape) return;

    if (clickedShape.isTarget) {
      setScore(prev => prev + 100 * level);
      setTargetFound(true);
      
      // Move to next level after a short delay
      setTimeout(() => {
        setLevel(prev => prev + 1);
        setShapes(generateShapes(level + 1));
        setTargetFound(false);
        setTimeLeft(prev => prev + 10); // Bonus time
      }, 1000);
    } else {
      setScore(prev => Math.max(0, prev - 25));
    }

    // Update selection state
    setShapes(prev => prev.map(shape => ({
      ...shape,
      isSelected: shape.id === shapeId
    })));
  };

  const endGame = () => {
    const accuracy = score > 0 ? Math.min(100, (score / (level * 100)) * 100) : 0;
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
        <h3 className="text-2xl md:text-3xl font-bold mb-4">🧩 3D Spatial Reasoning</h3>
        <p className="mb-6 text-lg">Find and click the target shapes in 3D space!</p>
        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <h4 className="text-xl font-bold mb-4">How to Play:</h4>
          <ul className="text-left space-y-2">
            <li>• Click and drag to rotate the view</li>
            <li>• Find the target shape (highlighted in instructions)</li>
            <li>• Click on the correct shape to score points</li>
            <li>• Wrong clicks will reduce your score</li>
            <li>• Complete levels to increase difficulty</li>
          </ul>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start 3D Challenge
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
        {targetFound && (
          <div className="text-green-400 font-bold text-lg animate-bounce">
            Target Found! +{100 * level} points
          </div>
        )}
      </div>

      <div className="bg-white/5 rounded-xl p-2 mb-4">
        <p className="text-center text-yellow-300 font-medium">
          🎯 Find the <span className="text-red-400 font-bold">RED</span> target shape and click on it!
        </p>
      </div>

      <div className="h-96 md:h-[500px] bg-black/20 rounded-xl overflow-hidden">
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {shapes.map((shape) => (
            <RotatingShape
              key={shape.id}
              shape={shape}
              onClick={() => handleShapeClick(shape.id)}
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
