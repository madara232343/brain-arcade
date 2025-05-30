import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface VisualAttentionGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface GameObject {
  id: number;
  x: number;
  y: number;
  isTarget: boolean;
  found: boolean;
  shape: string;
  color: string;
}

const shapes = ['🔴', '🟡', '🔵', '🟢', '🟠', '🟣', '⭐', '💎', '🔶', '🔷'];
const distractors = ['⚪', '⚫', '🔘', '💫', '✨', '🌟', '💠', '🔸', '🔹', '🔲'];

export const VisualAttentionGame: React.FC<VisualAttentionGameProps> = ({ onComplete, gameId }) => {
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [targetShape, setTargetShape] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(1);
  const [targetsFound, setTargetsFound] = useState(0);
  const [totalTargets, setTotalTargets] = useState(0);

  const generateObjects = () => {
    const target = shapes[Math.floor(Math.random() * shapes.length)];
    setTargetShape(target);
    
    const objectCount = Math.min(15 + round * 2, 30);
    const targetCount = Math.min(3 + Math.floor(round / 2), 8);
    
    const newObjects: GameObject[] = [];
    
    // Add targets
    for (let i = 0; i < targetCount; i++) {
      newObjects.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 15,
        isTarget: true,
        found: false,
        shape: target,
        color: '#FFD700'
      });
    }
    
    // Add distractors
    for (let i = targetCount; i < objectCount; i++) {
      const distractor = Math.random() > 0.3 
        ? distractors[Math.floor(Math.random() * distractors.length)]
        : shapes.filter(s => s !== target)[Math.floor(Math.random() * (shapes.length - 1))];
      
      newObjects.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 15,
        isTarget: false,
        found: false,
        shape: distractor,
        color: '#888'
      });
    }
    
    setObjects(newObjects);
    setTotalTargets(targetCount);
    setTargetsFound(0);
  };

  const startGame = () => {
    setGameStarted(true);
    generateObjects();
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted, gameOver]);

  const handleObjectClick = (objectId: number) => {
    if (gameOver) return;

    setObjects(prev => prev.map(obj => {
      if (obj.id === objectId && !obj.found) {
        if (obj.isTarget) {
          setScore(prevScore => prevScore + 10);
          setTargetsFound(prev => prev + 1);
        } else {
          setScore(prevScore => Math.max(0, prevScore - 3));
        }
        return { ...obj, found: true };
      }
      return obj;
    }));

    // Check if all targets found
    const updatedTargetsFound = objects.filter(obj => obj.isTarget && obj.id === objectId).length > 0 
      ? targetsFound + 1 
      : targetsFound;

    if (updatedTargetsFound === totalTargets) {
      setTimeout(() => {
        setRound(prev => prev + 1);
        setScore(prev => prev + 20); // Bonus for completing round
        generateObjects();
      }, 1000);
    }
  };

  const endGame = () => {
    setGameOver(true);
    const accuracy = totalTargets > 0 ? Math.round((targetsFound / totalTargets) * 100) : 0;
    const xpEarned = Math.round(score / 3);

    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 45,
      xpEarned
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white">
        <h3 className="text-2xl font-bold mb-4">👁️ Visual Attention</h3>
        <p className="mb-6 text-lg">Find all the target objects hidden in the scene!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-4">
            <p className="text-sm">• Look for the target shape shown at the top</p>
            <p className="text-sm">• Click on all matching objects</p>
            <p className="text-sm">• Avoid clicking wrong objects</p>
            <p className="text-sm">• Complete rounds quickly for bonus points</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white">
        <h3 className="text-2xl font-bold mb-4">🎯 Attention Master!</h3>
        <div className="space-y-2 text-lg">
          <p>Round Reached: {round}</p>
          <p>Final Score: {score} points</p>
          <p>Targets Found: {targetsFound}/{totalTargets}</p>
          <p>Excellent visual attention skills!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex justify-between mb-4 text-lg">
        <div>Time: {timeLeft}s</div>
        <div>Round: {round}</div>
        <div>Score: {score}</div>
      </div>

      <div className="text-center mb-4">
        <p className="text-lg mb-2">Find all: <span className="text-3xl">{targetShape}</span></p>
        <p className="text-sm">Found: {targetsFound}/{totalTargets}</p>
      </div>

      <div className="relative bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl h-80 border border-white/20 overflow-hidden">
        {objects.map((obj) => (
          <button
            key={obj.id}
            onClick={() => handleObjectClick(obj.id)}
            className={`absolute text-2xl transition-all duration-200 hover:scale-125 ${
              obj.found
                ? obj.isTarget
                  ? 'animate-bounce text-green-400'
                  : 'opacity-30'
                : 'hover:animate-pulse'
            }`}
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            disabled={obj.found}
          >
            {obj.shape}
          </button>
        ))}
      </div>
    </div>
  );
};
