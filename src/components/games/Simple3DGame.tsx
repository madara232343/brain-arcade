
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';
import { GameResult } from '@/types/game';

interface Simple3DGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  title: string;
  description: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

const AnimatedSphere: React.FC<{ position: [number, number, number]; color: string; onClick: () => void; isTarget: boolean }> = ({ position, color, onClick, isTarget }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * (isTarget ? 2 : 0.5);
      meshRef.current.rotation.y += delta * (isTarget ? 1.5 : 0.3);
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <sphereGeometry args={[isTarget ? 0.8 : 0.6, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        emissive={isTarget ? '#ff0000' : '#000000'} 
        emissiveIntensity={isTarget ? 0.3 : 0} 
      />
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
  const [timeLeft, setTimeLeft] = useState(45);
  const [targetsHit, setTargetsHit] = useState(0);
  const [totalTargets, setTotalTargets] = useState(0);
  const [targets, setTargets] = useState<Array<{ 
    id: number; 
    position: [number, number, number]; 
    color: string; 
    isTarget: boolean;
    value: number;
  }>>([]);

  const generateTargets = () => {
    const newTargets = [];
    const targetCount = Math.min(2 + Math.floor(score / 200), 5);
    const totalObjects = 12;
    
    for (let i = 0; i < totalObjects; i++) {
      const isTarget = i < targetCount;
      newTargets.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6
        ] as [number, number, number],
        color: isTarget ? '#ff4444' : ['#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 4)],
        isTarget,
        value: isTarget ? 100 + Math.floor(score / 100) * 25 : 0
      });
    }
    
    // Shuffle array to randomize positions
    for (let i = newTargets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTargets[i], newTargets[j]] = [newTargets[j], newTargets[i]];
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

    // Generate new targets every 8 seconds
    const targetGenerator = setInterval(() => {
      setTargets(generateTargets());
    }, 8000);

    return () => {
      clearInterval(timer);
      clearInterval(targetGenerator);
    };
  };

  const handleObjectClick = (targetId: number) => {
    const target = targets.find(t => t.id === targetId);
    if (!target) return;

    if (target.isTarget) {
      setScore(prev => prev + target.value);
      setTargetsHit(prev => prev + 1);
      setTotalTargets(prev => prev + 1);
      // Regenerate targets immediately after hitting a target
      setTargets(generateTargets());
    } else {
      setScore(prev => Math.max(0, prev - 50));
      setTotalTargets(prev => prev + 1);
    }
  };

  const endGame = () => {
    const accuracy = totalTargets > 0 ? Math.round((targetsHit / totalTargets) * 100) : 0;
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 45 - timeLeft,
      xpEarned: Math.max(50, Math.floor(score / 3))
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4 md:p-8">
        <h3 className="text-xl md:text-3xl font-bold mb-4">{title}</h3>
        <p className="mb-6 text-sm md:text-lg text-white/80">{description}</p>
        <div className="bg-white/10 rounded-xl p-4 md:p-6 mb-6 text-left">
          <h4 className="text-lg md:text-xl font-bold mb-4 text-center">🎯 How to Play:</h4>
          <ul className="space-y-2 text-sm md:text-base">
            <li className="flex items-center space-x-2">
              <span className="text-red-400">🔴</span>
              <span>Click <strong className="text-red-400">glowing red spheres</strong> to score points</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-blue-400">🔵</span>
              <span>Avoid clicking blue/teal spheres (lose points)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-yellow-400">⚡</span>
              <span>Score increases as you progress</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-400">🎮</span>
              <span>Drag to rotate view, scroll to zoom</span>
            </li>
          </ul>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-400 hover:to-purple-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 hover:scale-105 shadow-lg"
        >
          🚀 Start 3D Challenge
        </button>
      </div>
    );
  }

  return (
    <div className="text-white p-2 md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="text-sm md:text-lg font-bold">⏱️ Time: {timeLeft}s</div>
          <div className="text-sm md:text-lg font-bold">🎯 Score: {score}</div>
          <div className="text-sm md:text-lg font-bold">✅ Hits: {targetsHit}</div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-2 md:p-3 mb-4">
        <p className="text-center text-yellow-300 font-medium text-xs md:text-sm">
          🔥 Find and click the <span className="text-red-400 font-bold animate-pulse">GLOWING RED</span> spheres! 
          <span className="hidden md:inline"> Avoid the blue ones!</span>
        </p>
      </div>

      <div className="h-80 md:h-[500px] bg-black/20 rounded-xl overflow-hidden border border-white/20">
        <Canvas 
          camera={{ position: [0, 0, 10], fov: 75 }}
          style={{ touchAction: 'none' }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <pointLight position={[-10, -10, -10]} intensity={0.6} color="#4ecdc4" />
          <pointLight position={[0, 10, -10]} intensity={0.8} color="#ff6b6b" />
          
          {targets.map((target) => (
            <AnimatedSphere
              key={target.id}
              position={target.position}
              color={target.color}
              isTarget={target.isTarget}
              onClick={() => handleObjectClick(target.id)}
            />
          ))}
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={20}
            autoRotate={false}
            dampingFactor={0.1}
            enableDamping={true}
          />
        </Canvas>
      </div>

      <div className="mt-4 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <div className="text-xs md:text-sm text-white/70 text-center md:text-left">
          📱 Touch: Drag to rotate • Pinch to zoom<br className="md:hidden" />
          <span className="hidden md:inline"> | </span>💻 Mouse: Drag to rotate • Scroll to zoom
        </div>
        <button
          onClick={endGame}
          className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 text-sm md:text-base"
        >
          🏁 End Game
        </button>
      </div>

      {/* Score multiplier indicator */}
      {score > 500 && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-500/90 text-black px-3 py-1 rounded-full font-bold text-sm animate-bounce">
          🔥 Score Multiplier Active! 🔥
        </div>
      )}
    </div>
  );
};
