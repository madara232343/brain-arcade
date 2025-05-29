
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';
import { GameResult } from '@/pages/Games';

interface PuzzleBlocksGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface Block {
  id: string;
  position: [number, number, number];
  color: string;
  isTarget: boolean;
  isPlaced: boolean;
}

const PuzzleBlock: React.FC<{ 
  block: Block; 
  onClick: () => void;
}> = ({ block, onClick }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current && !block.isPlaced) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const blockColor = block.isTarget ? '#00ff00' : block.isPlaced ? '#ffff00' : block.color;
  const blockScale = block.isTarget ? 1.2 : 1.0;

  return (
    <mesh 
      ref={meshRef} 
      position={block.position} 
      onClick={onClick}
      scale={[blockScale, blockScale, blockScale]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={blockColor} transparent opacity={0.8} />
    </mesh>
  );
};

export const PuzzleBlocksGame: React.FC<PuzzleBlocksGameProps> = ({
  onComplete,
  gameId
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [level, setLevel] = useState(1);
  const [targetPositions, setTargetPositions] = useState<[number, number, number][]>([]);

  const generatePuzzle = (levelNum: number) => {
    const newBlocks: Block[] = [];
    const newTargetPositions: [number, number, number][] = [];
    
    const blockCount = Math.min(3 + levelNum, 8);
    
    // Generate target positions (where blocks should go)
    for (let i = 0; i < blockCount; i++) {
      const targetPos: [number, number, number] = [
        i * 2 - (blockCount - 1),
        0,
        0
      ];
      newTargetPositions.push(targetPos);
    }
    
    // Generate blocks in random positions
    for (let i = 0; i < blockCount; i++) {
      const block: Block = {
        id: `block-${i}`,
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4
        ],
        color: '#4ecdc4',
        isTarget: false,
        isPlaced: false
      };
      newBlocks.push(block);
    }
    
    setBlocks(newBlocks);
    setTargetPositions(newTargetPositions);
  };

  const startGame = () => {
    setGameStarted(true);
    generatePuzzle(level);
    
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

  const handleBlockClick = (blockId: string) => {
    setBlocks(prev => prev.map(block => {
      if (block.id === blockId && !block.isPlaced) {
        // Find closest target position
        const closestTarget = targetPositions.find((_, index) => 
          !prev.some(b => b.isPlaced && Math.abs(b.position[0] - targetPositions[index][0]) < 0.5)
        );
        
        if (closestTarget) {
          setScore(s => s + 50 * level);
          return { ...block, position: closestTarget, isPlaced: true };
        }
      }
      return block;
    }));
  };

  const endGame = () => {
    const placedBlocks = blocks.filter(b => b.isPlaced).length;
    const accuracy = blocks.length > 0 ? (placedBlocks / blocks.length) * 100 : 0;
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
        <h3 className="text-2xl md:text-3xl font-bold mb-4">🧩 Puzzle Blocks</h3>
        <p className="mb-6 text-lg">Arrange 3D blocks to solve puzzles!</p>
        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <h4 className="text-xl font-bold mb-4">How to Play:</h4>
          <ul className="text-left space-y-2">
            <li>• Click blocks to place them in the correct positions</li>
            <li>• Arrange blocks in a line to complete the puzzle</li>
            <li>• Complete levels to increase difficulty</li>
            <li>• Green highlight shows target positions</li>
          </ul>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Puzzle
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
          🎯 Click blocks to arrange them in a line!
        </p>
      </div>

      <div className="h-96 md:h-[500px] bg-black/20 rounded-xl overflow-hidden">
        <Canvas camera={{ position: [0, 2, 8], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {/* Target positions */}
          {targetPositions.map((pos, index) => (
            <mesh key={`target-${index}`} position={pos}>
              <boxGeometry args={[1.1, 1.1, 1.1]} />
              <meshStandardMaterial color="#00ff00" transparent opacity={0.3} wireframe />
            </mesh>
          ))}
          
          {/* Blocks */}
          {blocks.map((block) => (
            <PuzzleBlock
              key={block.id}
              block={block}
              onClick={() => handleBlockClick(block.id)}
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
