
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface BubbleShooterGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  color: string;
  row: number;
  col: number;
}

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

export const BubbleShooterGame: React.FC<BubbleShooterGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [shooterColor, setShooterColor] = useState(colors[0]);
  const [angle, setAngle] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime] = useState(Date.now());

  const initializeBubbles = () => {
    const newBubbles: Bubble[] = [];
    let id = 0;
    
    for (let row = 0; row < 8; row++) {
      const bubblesInRow = row % 2 === 0 ? 12 : 11;
      const offsetX = row % 2 === 0 ? 0 : 25;
      
      for (let col = 0; col < bubblesInRow; col++) {
        newBubbles.push({
          id: id++,
          x: offsetX + col * 50,
          y: row * 43,
          color: colors[Math.floor(Math.random() * colors.length)],
          row,
          col
        });
      }
    }
    
    setBubbles(newBubbles);
    setShooterColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const newAngle = Math.atan2(mouseY - rect.height + 50, mouseX - centerX);
    setAngle(newAngle);
  };

  const shoot = () => {
    // Simulate bubble shooting logic
    const targetBubbles = bubbles.filter(b => b.color === shooterColor);
    
    if (targetBubbles.length > 0) {
      const targetBubble = targetBubbles[Math.floor(Math.random() * targetBubbles.length)];
      const matchingBubbles = getConnectedBubbles(targetBubble);
      
      if (matchingBubbles.length >= 3) {
        setBubbles(prev => prev.filter(b => !matchingBubbles.includes(b)));
        setScore(prev => prev + matchingBubbles.length * 10);
      }
    }
    
    setShooterColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  const getConnectedBubbles = (startBubble: Bubble): Bubble[] => {
    const connected = [startBubble];
    const visited = new Set([startBubble.id]);
    const queue = [startBubble];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      bubbles.forEach(bubble => {
        if (
          !visited.has(bubble.id) &&
          bubble.color === startBubble.color &&
          isAdjacent(current, bubble)
        ) {
          connected.push(bubble);
          visited.add(bubble.id);
          queue.push(bubble);
        }
      });
    }
    
    return connected;
  };

  const isAdjacent = (bubble1: Bubble, bubble2: Bubble): boolean => {
    const dx = Math.abs(bubble1.x - bubble2.x);
    const dy = Math.abs(bubble1.y - bubble2.y);
    return dx <= 50 && dy <= 50 && (dx + dy) <= 60;
  };

  useEffect(() => {
    if (bubbles.length === 0 && gameStarted) {
      setGameOver(true);
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      onComplete({
        gameId,
        score,
        accuracy: Math.min(100, score / 10),
        timeSpent,
        xpEarned: Math.round(score / 4)
      });
    }
  }, [bubbles.length]);

  const startGame = () => {
    setGameStarted(true);
    initializeBubbles();
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">🫧 Bubble Shooter</h3>
        <p className="mb-6">Match 3 or more bubbles to pop them!</p>
        <div className="mb-6 text-sm space-y-2">
          <p>• Aim with mouse</p>
          <p>• Click to shoot</p>
          <p>• Match 3+ same colored bubbles</p>
          <p>• Clear all bubbles to win!</p>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">🎉 Bubbles Cleared!</h3>
        <div className="space-y-2">
          <p>Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
          <p>Excellent bubble popping!</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-96 bg-gradient-to-b from-cyan-500 to-blue-600 border-2 border-white/20 rounded-xl overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      onClick={shoot}
    >
      {/* Score */}
      <div className="absolute top-2 left-2 text-white text-sm z-10">
        Score: {score}
      </div>

      {/* Bubbles */}
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute w-8 h-8 rounded-full border-2 border-white/30"
          style={{
            left: `${(bubble.x / 600) * 100}%`,
            top: `${(bubble.y / 400) * 100}%`,
            backgroundColor: bubble.color,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Shooter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div
          className="w-10 h-10 rounded-full border-2 border-white"
          style={{ backgroundColor: shooterColor }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-1 h-8 bg-white/50 origin-bottom"
          style={{
            transform: `translate(-50%, -100%) rotate(${angle}rad)`
          }}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white/70 text-xs">
        Aim and click to shoot
      </div>
    </div>
  );
};
