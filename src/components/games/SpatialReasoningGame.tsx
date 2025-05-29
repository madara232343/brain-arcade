
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cone, Cylinder } from '@react-three/drei';
import { GameResult } from '@/pages/Index';
import { Mesh } from 'three';

interface SpatialReasoningGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface Shape3D {
  id: number;
  type: 'box' | 'sphere' | 'cone' | 'cylinder';
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  isTarget: boolean;
}

const Shape3DComponent: React.FC<{ shape: Shape3D; onClick: () => void; isGlowing?: boolean }> = ({ 
  shape, 
  onClick, 
  isGlowing = false 
}) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && isGlowing) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  const shapeProps = {
    ref: meshRef,
    position: shape.position,
    rotation: shape.rotation,
    onClick,
    scale: isGlowing ? 1.2 : 1
  };

  const material = (
    <meshStandardMaterial 
      color={shape.color} 
      emissive={isGlowing ? shape.color : '#000000'}
      emissiveIntensity={isGlowing ? 0.3 : 0}
    />
  );

  switch (shape.type) {
    case 'box':
      return <Box {...shapeProps}>{material}</Box>;
    case 'sphere':
      return <Sphere {...shapeProps}>{material}</Sphere>;
    case 'cone':
      return <Cone {...shapeProps}>{material}</Cone>;
    case 'cylinder':
      return <Cylinder {...shapeProps}>{material}</Cylinder>;
    default:
      return <Box {...shapeProps}>{material}</Box>;
  }
};

export const SpatialReasoningGame: React.FC<SpatialReasoningGameProps> = ({ 
  onComplete, 
  gameId,
  activePowerUps = new Set(),
  onPowerUpUsed 
}) => {
  const [shapes, setShapes] = useState<Shape3D[]>([]);
  const [targetShape, setTargetShape] = useState<Shape3D | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [showingTarget, setShowingTarget] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
  const shapeTypes: ('box' | 'sphere' | 'cone' | 'cylinder')[] = ['box', 'sphere', 'cone', 'cylinder'];

  const generateShapes = () => {
    const newShapes: Shape3D[] = [];
    const targetType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Create target shape
    const target: Shape3D = {
      id: 0,
      type: targetType,
      color: targetColor,
      position: [0, 2, 0],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      isTarget: true
    };
    
    setTargetShape(target);

    // Create answer options (including correct one)
    for (let i = 0; i < 6; i++) {
      const isCorrect = i === 0;
      newShapes.push({
        id: i + 1,
        type: isCorrect ? targetType : shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        color: isCorrect ? targetColor : colors[Math.floor(Math.random() * colors.length)],
        position: [
          (i % 3 - 1) * 3,
          -2,
          Math.floor(i / 3) * 3 - 1.5
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        isTarget: isCorrect
      });
    }

    // Shuffle the shapes
    for (let i = newShapes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newShapes[i], newShapes[j]] = [newShapes[j], newShapes[i]];
    }

    setShapes(newShapes);
  };

  const startGame = () => {
    setGameStarted(true);
    generateShapes();
    setShowingTarget(true);
    
    setTimeout(() => {
      setShowingTarget(false);
    }, 3000);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        if (!activePowerUps.has('timeFreeze')) {
          setTimeLeft(prev => prev - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted, activePowerUps]);

  const handleShapeClick = (shape: Shape3D) => {
    if (showingTarget) return;

    const isCorrect = shape.isTarget;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      const roundScore = 50 * (activePowerUps.has('doubleXP') ? 2 : 1);
      setScore(prev => prev + roundScore);
      
      if (round < 10) {
        setRound(prev => prev + 1);
        generateShapes();
        setShowingTarget(true);
        setTimeout(() => setShowingTarget(false), 2000);
      } else {
        endGame();
      }
    } else {
      if (activePowerUps.has('shield') && onPowerUpUsed) {
        onPowerUpUsed('shield');
        return;
      }
      endGame();
    }
  };

  const endGame = () => {
    const accuracy = Math.round((correctAnswers / round) * 100);
    const xpEarned = Math.round(score / 3);

    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 60 - timeLeft,
      xpEarned
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🔄 3D Spatial Reasoning</h3>
        <p className="mb-6 text-sm md:text-lg">Match 3D shapes in this spatial reasoning challenge!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Study the target 3D shape</p>
            <p className="text-xs md:text-sm mb-2">• Find the matching shape below</p>
            <p className="text-xs md:text-sm">• Use mouse to rotate the view</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 hover:scale-105"
        >
          Start 3D Game
        </button>
      </div>
    );
  }

  if (timeLeft === 0 || round > 10) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🧠 3D Master!</h3>
        <div className="space-y-2 md:space-y-3 text-sm md:text-lg">
          <p>Round Reached: <span className="text-purple-400 font-bold">{round}</span></p>
          <p>Score: <span className="text-yellow-400 font-bold">{score}</span></p>
          <p>Accuracy: <span className="text-green-400 font-bold">{Math.round((correctAnswers / round) * 100)}%</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white p-2 md:p-4">
      <div className="flex flex-wrap justify-between mb-4 text-sm md:text-lg gap-2">
        <div>Time: <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>{timeLeft}s</span></div>
        <div>Round: <span className="font-bold text-purple-400">{round}</span></div>
        <div>Score: <span className="font-bold text-yellow-400">{score}</span></div>
      </div>

      {showingTarget && (
        <div className="text-center mb-4 text-lg md:text-xl font-bold animate-pulse text-blue-400">
          🎯 Study the target shape above!
        </div>
      )}

      {!showingTarget && (
        <div className="text-center mb-4 text-lg md:text-xl font-bold text-green-400">
          🔍 Click the matching shape below!
        </div>
      )}

      <div className="w-full h-96 bg-black/20 rounded-xl overflow-hidden">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />
            
            {targetShape && showingTarget && (
              <Shape3DComponent
                shape={targetShape}
                onClick={() => {}}
                isGlowing={true}
              />
            )}
            
            {!showingTarget && shapes.map((shape) => (
              <Shape3DComponent
                key={shape.id}
                shape={shape}
                onClick={() => handleShapeClick(shape)}
              />
            ))}
            
            <OrbitControls enablePan={false} enableZoom={true} />
          </Suspense>
        </Canvas>
      </div>

      <div className="text-center mt-4 text-xs md:text-sm text-white/70">
        Drag to rotate • Scroll to zoom • Click shapes to select
      </div>
    </div>
  );
};
