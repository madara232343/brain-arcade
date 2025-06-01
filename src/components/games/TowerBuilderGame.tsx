import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';
import { GameResult } from '@/types/game';

interface TowerBuilderGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface TowerBlock {
  id: string;
  position: [number, number, number];
  color: string;
  isPlaced: boolean;
  size: [number, number, number];
}

const TowerBlockComponent: React.FC<{ 
  block: TowerBlock; 
  onClick: () => void;
  isMoving?: boolean;
}> = ({ block, onClick, isMoving = false }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current && isMoving) {
      meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 2) * 2;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={block.position} 
      onClick={onClick}
    >
      <boxGeometry args={block.size} />
      <meshStandardMaterial 
        color={block.color} 
        transparent 
        opacity={block.isPlaced ? 0.8 : 0.6}
      />
    </mesh>
  );
};

export const TowerBuilderGame: React.FC<TowerBuilderGameProps> = ({
  onComplete,
  gameId
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [blocks, setBlocks] = useState<TowerBlock[]>([]);
  const [currentBlock, setCurrentBlock] = useState<TowerBlock | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [level, setLevel] = useState(1);
  const [towerHeight, setTowerHeight] = useState(0);

  const generateBlock = (height: number): TowerBlock => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    const size: [number, number, number] = [
      2 - (height * 0.1),
      0.5,
      2 - (height * 0.1)
    ];
    
    return {
      id: `block-${Date.now()}`,
      position: [0, height + 2, 0],
      color: colors[height % colors.length],
      isPlaced: false,
      size
    };
  };

  const startGame = () => {
    setGameStarted(true);
    setBlocks([]);
    setTowerHeight(0);
    setCurrentBlock(generateBlock(0));
    
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

  const handleBlockClick = () => {
    if (!currentBlock) return;
    
    const accuracy = calculateAccuracy(currentBlock.position[0]);
    const newBlock = {
      ...currentBlock,
      position: [currentBlock.position[0], towerHeight * 0.5, 0] as [number, number, number],
      isPlaced: true
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setScore(prev => prev + Math.floor(accuracy * 100));
    setTowerHeight(prev => prev + 1);
    
    // Check if tower is too unstable (block too far off center)
    if (Math.abs(currentBlock.position[0]) > 1.5) {
      endGame();
      return;
    }
    
    // Generate next block
    setCurrentBlock(generateBlock(towerHeight + 1));
  };

  const calculateAccuracy = (xPosition: number): number => {
    const maxOffset = 2;
    const offset = Math.abs(xPosition);
    return Math.max(0, (maxOffset - offset) / maxOffset);
  };

  const endGame = () => {
    const accuracy = towerHeight > 0 ? Math.min(100, (score / (towerHeight * 100)) * 100) : 0;
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 90 - timeLeft,
      xpEarned: Math.max(25, Math.floor(score / 10))
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4 md:p-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">🏗️ Tower Builder</h3>
        <p className="mb-6 text-lg">Stack 3D blocks to build the tallest tower!</p>
        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <h4 className="text-xl font-bold mb-4">How to Play:</h4>
          <ul className="text-left space-y-2">
            <li>• Click to drop the moving block</li>
            <li>• Stack blocks as accurately as possible</li>
            <li>• Blocks get smaller as you build higher</li>
            <li>• Perfect alignment gives maximum points</li>
            <li>• Tower falls if blocks are too misaligned</li>
          </ul>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Building
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
          <div className="text-lg font-bold">Height: {towerHeight}</div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-2 mb-4">
        <p className="text-center text-yellow-300 font-medium">
          🎯 Click to drop the moving block! Stack them as precisely as possible!
        </p>
      </div>

      <div className="h-96 md:h-[500px] bg-black/20 rounded-xl overflow-hidden">
        <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {/* Ground */}
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[10, 1, 10]} />
            <meshStandardMaterial color="#444444" />
          </mesh>
          
          {/* Placed blocks */}
          {blocks.map((block) => (
            <TowerBlockComponent
              key={block.id}
              block={block}
              onClick={() => {}}
            />
          ))}
          
          {/* Current moving block */}
          {currentBlock && (
            <TowerBlockComponent
              block={currentBlock}
              onClick={handleBlockClick}
              isMoving={true}
            />
          )}
          
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
