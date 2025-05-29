
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';
import { GameResult } from '@/pages/Games';

interface ShapeRotatorGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface RotatableShape {
  id: string;
  type: 'box' | 'sphere' | 'cone';
  position: [number, number, number];
  rotation: [number, number, number];
  targetRotation: [number, number, number];
  color: string;
  isMatched: boolean;
}

const RotatableShapeComponent: React.FC<{ 
  shape: RotatableShape; 
  onClick: () => void;
}> = ({ shape, onClick }) => {
  const meshRef = useRef<Mesh>(null);
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.set(...shape.rotation);
    }
  }, [shape.rotation]);

  const shapeColor = shape.isMatched ? '#00ff00' : shape.color;

  if (shape.type === 'box') {
    return (
      <mesh 
        ref={meshRef} 
        position={shape.position} 
        onClick={onClick}
      >
        <boxGeometry args={[1, 2, 0.5]} />
        <meshStandardMaterial color={shapeColor} transparent opacity={0.8} />
      </mesh>
    );
  }

  if (shape.type === 'sphere') {
    return (
      <mesh 
        ref={meshRef} 
        position={shape.position} 
        onClick={onClick}
      >
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color={shapeColor} transparent opacity={0.8} />
      </mesh>
    );
  }

  if (shape.type === 'cone') {
    return (
      <mesh 
        ref={meshRef} 
        position={shape.position} 
        onClick={onClick}
      >
        <coneGeometry args={[0.6, 1.5, 32]} />
        <meshStandardMaterial color={shapeColor} transparent opacity={0.8} />
      </mesh>
    );
  }

  return null;
};

const TargetShape: React.FC<{ shape: RotatableShape }> = ({ shape }) => {
  const meshRef = useRef<Mesh>(null);
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.set(...shape.targetRotation);
    }
  }, [shape.targetRotation]);

  if (shape.type === 'box') {
    return (
      <mesh 
        ref={meshRef} 
        position={[shape.position[0], shape.position[1] + 3, shape.position[2]]}
      >
        <boxGeometry args={[1, 2, 0.5]} />
        <meshStandardMaterial color="#ffff00" transparent opacity={0.5} wireframe />
      </mesh>
    );
  }

  if (shape.type === 'sphere') {
    return (
      <mesh 
        ref={meshRef} 
        position={[shape.position[0], shape.position[1] + 3, shape.position[2]]}
      >
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#ffff00" transparent opacity={0.5} wireframe />
      </mesh>
    );
  }

  if (shape.type === 'cone') {
    return (
      <mesh 
        ref={meshRef} 
        position={[shape.position[0], shape.position[1] + 3, shape.position[2]]}
      >
        <coneGeometry args={[0.6, 1.5, 32]} />
        <meshStandardMaterial color="#ffff00" transparent opacity={0.5} wireframe />
      </mesh>
    );
  }

  return null;
};

export const ShapeRotatorGame: React.FC<ShapeRotatorGameProps> = ({
  onComplete,
  gameId
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [shapes, setShapes] = useState<RotatableShape[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [level, setLevel] = useState(1);

  const generateShapes = (levelNum: number) => {
    const shapeTypes: ('box' | 'sphere' | 'cone')[] = ['box', 'sphere', 'cone'];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1'];
    const newShapes: RotatableShape[] = [];
    
    const shapeCount = Math.min(2 + levelNum, 5);
    
    for (let i = 0; i < shapeCount; i++) {
      const targetRot: [number, number, number] = [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ];
      
      const shape: RotatableShape = {
        id: `shape-${i}`,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        position: [i * 3 - (shapeCount - 1) * 1.5, 0, 0],
        rotation: [0, 0, 0],
        targetRotation: targetRot,
        color: colors[i % colors.length],
        isMatched: false
      };
      newShapes.push(shape);
    }
    
    return newShapes;
  };

  const startGame = () => {
    setGameStarted(true);
    setShapes(generateShapes(level));
    
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
    setShapes(prev => prev.map(shape => {
      if (shape.id === shapeId && !shape.isMatched) {
        const newRotation: [number, number, number] = [
          shape.rotation[0] + Math.PI / 4,
          shape.rotation[1] + Math.PI / 4,
          shape.rotation[2] + Math.PI / 4
        ];
        
        // Check if rotation is close to target
        const tolerance = 0.5;
        const isCloseX = Math.abs(newRotation[0] % (Math.PI * 2) - shape.targetRotation[0] % (Math.PI * 2)) < tolerance;
        const isCloseY = Math.abs(newRotation[1] % (Math.PI * 2) - shape.targetRotation[1] % (Math.PI * 2)) < tolerance;
        const isCloseZ = Math.abs(newRotation[2] % (Math.PI * 2) - shape.targetRotation[2] % (Math.PI * 2)) < tolerance;
        
        const isMatched = isCloseX && isCloseY && isCloseZ;
        
        if (isMatched) {
          setScore(s => s + 100 * level);
        }
        
        return { ...shape, rotation: newRotation, isMatched };
      }
      return shape;
    }));
  };

  const endGame = () => {
    const matchedShapes = shapes.filter(s => s.isMatched).length;
    const accuracy = shapes.length > 0 ? (matchedShapes / shapes.length) * 100 : 0;
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 120 - timeLeft,
      xpEarned: Math.max(25, Math.floor(score / 10))
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4 md:p-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">🔄 Shape Rotator</h3>
        <p className="mb-6 text-lg">Rotate 3D shapes to match their targets!</p>
        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <h4 className="text-xl font-bold mb-4">How to Play:</h4>
          <ul className="text-left space-y-2">
            <li>• Click shapes to rotate them</li>
            <li>• Match the rotation of the yellow wireframe targets above</li>
            <li>• Get close enough to the target rotation to score</li>
            <li>• Green shapes indicate successful matches</li>
          </ul>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Rotating
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
        <p className="text-center text-yellow-300 font-medium">
          🎯 Click shapes to rotate them and match the yellow wireframe targets above!
        </p>
      </div>

      <div className="h-96 md:h-[500px] bg-black/20 rounded-xl overflow-hidden">
        <Canvas camera={{ position: [0, 2, 8], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {/* Target shapes */}
          {shapes.map((shape) => (
            <TargetShape key={`target-${shape.id}`} shape={shape} />
          ))}
          
          {/* Rotatable shapes */}
          {shapes.map((shape) => (
            <RotatableShapeComponent
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
