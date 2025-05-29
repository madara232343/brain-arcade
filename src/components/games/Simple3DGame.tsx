
import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';
import { GameResult } from '@/pages/Games';

interface Simple3DGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  title: string;
  description: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

const RotatingCube: React.FC<{ position: [number, number, number]; color: string; onClick: () => void }> = ({ position, color, onClick }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export const Simple3DGame: React.FC<Simple3DGameProps> = ({
  onComplete,
  gameId,
  title,
  description
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Array<{ id: number; position: [number, number, number]; color: string; isTarget: boolean }>>([]);

  const generateTargets = () => {
    const newTargets = [];
    for (let i = 0; i < 8; i++) {
      newTargets.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4
        ] as [number, number, number],
        color: i === 0 ? '#ff0000' : '#4ecdc4',
        isTarget: i === 0
      });
    }
    return newTargets;
  };

  const startGame = () => {
    setGameStarted(true);
    setTargets(generateTargets());
    
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

  const handleCubeClick = (targetId: number) => {
    const target = targets.find(t => t.id === targetId);
    if (target?.isTarget) {
      setScore(prev => prev + 100);
      setTargets(generateTargets()); // Generate new targets
    } else {
      setScore(prev => Math.max(0, prev - 25));
    }
  };

  const endGame = () => {
    const accuracy = score > 0 ? Math.min(100, (score / 100) * 100) : 0;
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 30 - timeLeft,
      xpEarned: Math.max(25, Math.floor(score / 4))
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4 md:p-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">{title}</h3>
        <p className="mb-6 text-lg">{description}</p>
        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <h4 className="text-xl font-bold mb-4">How to Play:</h4>
          <ul className="text-left space-y-2">
            <li>• Click and drag to rotate the view</li>
            <li>• Find and click the red target cubes</li>
            <li>• Avoid clicking blue cubes</li>
            <li>• Score as many points as possible!</li>
          </ul>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start 3D Game
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
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-2 mb-4">
        <p className="text-center text-yellow-300 font-medium">
          🎯 Click the <span className="text-red-400 font-bold">RED</span> cubes to score points!
        </p>
      </div>

      <div className="h-96 md:h-[500px] bg-black/20 rounded-xl overflow-hidden">
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {targets.map((target) => (
            <RotatingCube
              key={target.id}
              position={target.position}
              color={target.color}
              onClick={() => handleCubeClick(target.id)}
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
