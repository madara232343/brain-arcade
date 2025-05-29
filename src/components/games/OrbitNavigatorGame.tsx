
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';
import { GameResult } from '@/pages/Games';

interface OrbitNavigatorGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface OrbitingObject {
  id: string;
  position: [number, number, number];
  radius: number;
  speed: number;
  color: string;
  isTarget: boolean;
  isCollected: boolean;
  angle: number;
}

interface Player {
  position: [number, number, number];
  radius: number;
  speed: number;
  angle: number;
}

const OrbitingObjectComponent: React.FC<{ 
  obj: OrbitingObject;
}> = ({ obj }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      const x = Math.cos(obj.angle) * obj.radius;
      const z = Math.sin(obj.angle) * obj.radius;
      meshRef.current.position.set(x, obj.position[1], z);
      
      if (!obj.isCollected) {
        meshRef.current.rotation.x += delta * 2;
        meshRef.current.rotation.y += delta;
      }
    }
  });

  if (obj.isCollected) return null;

  return (
    <mesh ref={meshRef} position={obj.position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial 
        color={obj.color} 
        emissive={obj.isTarget ? obj.color : '#000000'}
        emissiveIntensity={obj.isTarget ? 0.3 : 0}
      />
    </mesh>
  );
};

const PlayerComponent: React.FC<{ 
  player: Player;
}> = ({ player }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      const x = Math.cos(player.angle) * player.radius;
      const z = Math.sin(player.angle) * player.radius;
      meshRef.current.position.set(x, player.position[1], z);
      meshRef.current.rotation.y += delta * 3;
    }
  });

  return (
    <mesh ref={meshRef} position={player.position}>
      <coneGeometry args={[0.3, 0.8, 8]} />
      <meshStandardMaterial color="#00ff00" emissive="#004400" />
    </mesh>
  );
};

const OrbitRing: React.FC<{ radius: number }> = ({ radius }) => {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
      <meshStandardMaterial color="#444444" transparent opacity={0.3} />
    </mesh>
  );
};

export const OrbitNavigatorGame: React.FC<OrbitNavigatorGameProps> = ({
  onComplete,
  gameId
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [objects, setObjects] = useState<OrbitingObject[]>([]);
  const [player, setPlayer] = useState<Player>({ 
    position: [0, 0, 0], 
    radius: 3, 
    speed: 1, 
    angle: 0 
  });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [level, setLevel] = useState(1);
  const [collected, setCollected] = useState(0);

  const generateObjects = (levelNum: number) => {
    const newObjects: OrbitingObject[] = [];
    const objectCount = Math.min(5 + levelNum, 12);
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    
    for (let i = 0; i < objectCount; i++) {
      const radius = 2 + Math.random() * 5;
      const obj: OrbitingObject = {
        id: `object-${i}`,
        position: [0, (Math.random() - 0.5) * 2, 0],
        radius,
        speed: 0.5 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        isTarget: Math.random() > 0.7, // 30% chance to be target
        isCollected: false,
        angle: Math.random() * Math.PI * 2
      };
      newObjects.push(obj);
    }
    
    return newObjects;
  };

  const startGame = () => {
    setGameStarted(true);
    setObjects(generateObjects(level));
    setPlayer({ position: [0, 0, 0], radius: 3, speed: 1, angle: 0 });
    setCollected(0);
    
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
      if (!gameStarted) return;
      
      const { key } = event;
      setPlayer(prev => {
        let newPlayer = { ...prev };
        
        switch (key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            newPlayer.radius = Math.max(1, prev.radius - 0.2);
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            newPlayer.radius = Math.min(8, prev.radius + 0.2);
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            newPlayer.angle -= 0.1;
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            newPlayer.angle += 0.1;
            break;
          default:
            return prev;
        }
        
        return newPlayer;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted]);

  useFrame((state, delta) => {
    if (!gameStarted) return;
    
    // Update object positions
    setObjects(prev => prev.map(obj => ({
      ...obj,
      angle: obj.angle + obj.speed * delta
    })));

    // Check for collisions
    const playerX = Math.cos(player.angle) * player.radius;
    const playerZ = Math.sin(player.angle) * player.radius;
    
    setObjects(prev => prev.map(obj => {
      if (obj.isCollected) return obj;
      
      const objX = Math.cos(obj.angle) * obj.radius;
      const objZ = Math.sin(obj.angle) * obj.radius;
      const distance = Math.sqrt(
        (playerX - objX) ** 2 + 
        (player.position[1] - obj.position[1]) ** 2 + 
        (playerZ - objZ) ** 2
      );
      
      if (distance < 0.6) {
        if (obj.isTarget) {
          setScore(s => s + 100 * level);
          setCollected(c => c + 1);
        } else {
          setScore(s => Math.max(0, s - 50));
        }
        return { ...obj, isCollected: true };
      }
      
      return obj;
    }));
  });

  const endGame = () => {
    const targets = objects.filter(obj => obj.isTarget).length;
    const accuracy = targets > 0 ? (collected / targets) * 100 : 0;
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
        <h3 className="text-2xl md:text-3xl font-bold mb-4">🌌 Orbit Navigator</h3>
        <p className="mb-6 text-lg">Navigate objects in 3D orbital space!</p>
        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <h4 className="text-xl font-bold mb-4">How to Play:</h4>
          <ul className="text-left space-y-2">
            <li>• Use WASD or arrow keys to navigate</li>
            <li>• Up/Down: Change orbital radius</li>
            <li>• Left/Right: Move around orbit</li>
            <li>• Collect glowing target objects</li>
            <li>• Avoid non-glowing objects (they reduce score)</li>
          </ul>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Navigating
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
          <div className="text-lg font-bold">Collected: {collected}</div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-2 mb-4">
        <p className="text-center text-yellow-300 font-medium">
          🎯 Use WASD/arrows to navigate! Collect glowing objects, avoid the others!
        </p>
      </div>

      <div className="h-96 md:h-[500px] bg-black/20 rounded-xl overflow-hidden">
        <Canvas camera={{ position: [0, 8, 8], fov: 75 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {/* Central sphere */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#666666" />
          </mesh>
          
          {/* Orbit rings */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map(radius => (
            <OrbitRing key={radius} radius={radius} />
          ))}
          
          {/* Player */}
          <PlayerComponent player={player} />
          
          {/* Orbiting objects */}
          {objects.map((obj) => (
            <OrbitingObjectComponent
              key={obj.id}
              obj={obj}
            />
          ))}
          
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
