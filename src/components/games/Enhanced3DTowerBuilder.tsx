
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Mesh, TextureLoader, RepeatWrapping } from 'three';
import { GameResult } from '@/pages/Games';

interface Enhanced3DTowerBuilderProps {
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
  textureType: string;
}

const EnhancedBlock: React.FC<{ 
  block: TowerBlock; 
  onClick: () => void;
  isMoving?: boolean;
}> = ({ block, onClick, isMoving = false }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current && isMoving) {
      meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 2) * 2;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={block.position} 
      onClick={onClick}
      castShadow
      receiveShadow
    >
      <boxGeometry args={block.size} />
      <meshPhongMaterial 
        color={block.color}
        transparent 
        opacity={block.isPlaced ? 0.9 : 0.7}
        shininess={100}
      />
      {block.isPlaced && (
        <Text
          position={[0, 0, block.size[2]/2 + 0.01]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {block.id.split('-')[1]}
        </Text>
      )}
    </mesh>
  );
};

const Ground: React.FC = () => {
  return (
    <mesh position={[0, -0.5, 0]} receiveShadow>
      <boxGeometry args={[15, 1, 15]} />
      <meshLambertMaterial color="#2d5a27" />
    </mesh>
  );
};

export const Enhanced3DTowerBuilder: React.FC<Enhanced3DTowerBuilderProps> = ({
  onComplete,
  gameId
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [blocks, setBlocks] = useState<TowerBlock[]>([]);
  const [currentBlock, setCurrentBlock] = useState<TowerBlock | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [towerHeight, setTowerHeight] = useState(0);
  const [perfect, setPerfect] = useState(0);

  const generateBlock = (height: number): TowerBlock => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a29bfe', '#fd79a8'];
    const textureTypes = ['wood', 'stone', 'metal', 'crystal'];
    const size: [number, number, number] = [
      Math.max(1, 2.5 - (height * 0.05)),
      0.5,
      Math.max(1, 2.5 - (height * 0.05))
    ];
    
    return {
      id: `block-${height + 1}`,
      position: [0, height * 0.5 + 3, 0],
      color: colors[height % colors.length],
      isPlaced: false,
      size,
      textureType: textureTypes[height % textureTypes.length]
    };
  };

  const startGame = () => {
    setGameStarted(true);
    setBlocks([]);
    setTowerHeight(0);
    setPerfect(0);
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
    const isPerfect = Math.abs(currentBlock.position[0]) < 0.1;
    
    if (isPerfect) {
      setPerfect(prev => prev + 1);
    }
    
    const points = isPerfect ? 200 : Math.floor(accuracy * 100);
    const newBlock = {
      ...currentBlock,
      position: [currentBlock.position[0], towerHeight * 0.5, 0] as [number, number, number],
      isPlaced: true
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setScore(prev => prev + points);
    setTowerHeight(prev => prev + 1);
    
    if (Math.abs(currentBlock.position[0]) > 2) {
      endGame();
      return;
    }
    
    setCurrentBlock(generateBlock(towerHeight + 1));
  };

  const calculateAccuracy = (xPosition: number): number => {
    const maxOffset = 2;
    const offset = Math.abs(xPosition);
    return Math.max(0, (maxOffset - offset) / maxOffset);
  };

  const endGame = () => {
    const accuracy = towerHeight > 0 ? Math.min(100, (score / (towerHeight * 150)) * 100) : 0;
    const bonusXP = perfect * 25;
    onComplete({
      gameId,
      score: score + bonusXP,
      accuracy,
      timeSpent: 120 - timeLeft,
      xpEarned: Math.max(50, Math.floor((score + bonusXP) / 8))
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4 md:p-8 animate-fade-in">
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">🏗️</div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Enhanced Tower Builder
          </h3>
          <p className="mb-6 text-lg text-white/80">Build the ultimate 3D tower with enhanced graphics!</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h4 className="text-xl font-bold mb-4 text-yellow-300">How to Play:</h4>
          <ul className="text-left space-y-3 text-white/90">
            <li className="flex items-center"><span className="text-green-400 mr-2">▶</span> Click to drop moving blocks precisely</li>
            <li className="flex items-center"><span className="text-blue-400 mr-2">▶</span> Perfect alignment gives bonus points</li>
            <li className="flex items-center"><span className="text-purple-400 mr-2">▶</span> Blocks shrink as tower grows</li>
            <li className="flex items-center"><span className="text-red-400 mr-2">▶</span> Too much misalignment = game over</li>
          </ul>
        </div>
        
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-400 hover:via-red-400 hover:to-pink-400 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl animate-pulse-glow"
        >
          Start Building 🚀
        </button>
      </div>
    );
  }

  return (
    <div className="text-white p-2 md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
        <div className="flex items-center space-x-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg px-4 py-2">
            <div className="text-lg font-bold">⏰ {timeLeft}s</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg px-4 py-2">
            <div className="text-lg font-bold">🎯 {score}</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg px-4 py-2">
            <div className="text-lg font-bold">📏 {towerHeight}</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg px-4 py-2">
            <div className="text-lg font-bold">⭐ {perfect}</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl p-3 mb-4 border border-yellow-400/30">
        <p className="text-center text-yellow-200 font-medium">
          🎯 Click to drop the moving block! Perfect placement = bonus points!
        </p>
      </div>

      <div className="h-96 md:h-[600px] bg-gradient-to-b from-sky-400/20 to-green-400/20 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
        <Canvas 
          camera={{ position: [8, 8, 8], fov: 60 }}
          shadows
        >
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 15, 10]} 
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4ecdc4" />
          <pointLight position={[10, -5, 10]} intensity={0.3} color="#ff6b6b" />
          
          <Ground />
          
          {blocks.map((block) => (
            <EnhancedBlock
              key={block.id}
              block={block}
              onClick={() => {}}
            />
          ))}
          
          {currentBlock && (
            <EnhancedBlock
              block={currentBlock}
              onClick={handleBlockClick}
              isMoving={true}
            />
          )}
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={handleBlockClick}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 text-lg"
        >
          Drop Block 📦
        </button>
        <button
          onClick={endGame}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105"
        >
          End Game 🏁
        </button>
      </div>
    </div>
  );
};
