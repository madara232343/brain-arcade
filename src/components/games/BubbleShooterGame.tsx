
import React, { useState, useEffect, useCallback } from 'react';
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

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

export const BubbleShooterGame: React.FC<BubbleShooterGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [shooterBubble, setShooterBubble] = useState<string>('');
  const [nextBubble, setNextBubble] = useState<string>('');
  const [shooterAngle, setShooterAngle] = useState(90);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [bubbleId, setBubbleId] = useState(1000);

  const generateBubbles = useCallback(() => {
    const newBubbles: Bubble[] = [];
    const rows = 6 + level;
    
    for (let row = 0; row < Math.min(rows, 12); row++) {
      const bubblesInRow = row % 2 === 0 ? 8 : 7;
      const offsetX = row % 2 === 0 ? 0 : 25;
      
      for (let col = 0; col < bubblesInRow; col++) {
        newBubbles.push({
          id: newBubbles.length,
          x: offsetX + col * 50 + 25,
          y: row * 43 + 25,
          color: colors[Math.floor(Math.random() * colors.length)],
          row,
          col
        });
      }
    }
    
    setBubbles(newBubbles);
  }, [level]);

  const startGame = () => {
    setGameStarted(true);
    generateBubbles();
    setShooterBubble(colors[Math.floor(Math.random() * colors.length)]);
    setNextBubble(colors[Math.floor(Math.random() * colors.length)]);
  };

  const findConnectedBubbles = (bubbles: Bubble[], startBubble: Bubble): Bubble[] => {
    const connected: Bubble[] = [];
    const queue = [startBubble];
    const visited = new Set<number>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current.id)) continue;
      
      visited.add(current.id);
      connected.push(current);

      // Find adjacent bubbles with same color
      const adjacent = bubbles.filter(bubble => {
        if (bubble.color !== current.color || visited.has(bubble.id)) return false;
        
        const dx = Math.abs(bubble.x - current.x);
        const dy = Math.abs(bubble.y - current.y);
        return dx <= 50 && dy <= 50 && (dx + dy) <= 60;
      });

      queue.push(...adjacent);
    }

    return connected;
  };

  const shoot = () => {
    if (!shooterBubble) return;

    // Calculate trajectory based on angle
    const radians = (shooterAngle * Math.PI) / 180;
    const speed = 8;
    const startX = 200;
    const startY = 500;

    let x = startX;
    let y = startY;
    const vx = Math.cos(radians) * speed;
    const vy = -Math.sin(radians) * speed;

    // Simulate bubble path
    const interval = setInterval(() => {
      x += vx;
      y += vy;

      // Check collision with existing bubbles
      const hitBubble = bubbles.find(bubble => {
        const dx = bubble.x - x;
        const dy = bubble.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 40;
      });

      if (hitBubble || y <= 25 || x <= 25 || x >= 375) {
        clearInterval(interval);
        
        // Add new bubble
        const newBubble: Bubble = {
          id: bubbleId,
          x: Math.max(25, Math.min(375, x)),
          y: Math.max(25, y),
          color: shooterBubble,
          row: Math.floor(y / 43),
          col: Math.floor(x / 50)
        };

        setBubbleId(prev => prev + 1);
        
        const updatedBubbles = [...bubbles, newBubble];
        
        // Check for matches
        const connected = findConnectedBubbles(updatedBubbles, newBubble);
        
        if (connected.length >= 3) {
          // Remove matched bubbles
          const remainingBubbles = updatedBubbles.filter(
            bubble => !connected.some(c => c.id === bubble.id)
          );
          
          setBubbles(remainingBubbles);
          setScore(prev => prev + connected.length * 100);
          
          // Check if level complete
          if (remainingBubbles.length === 0) {
            setLevel(prev => prev + 1);
            setTimeout(() => generateBubbles(), 1000);
          }
        } else {
          setBubbles(updatedBubbles);
        }
        
        // Update shooter
        setShooterBubble(nextBubble);
        setNextBubble(colors[Math.floor(Math.random() * colors.length)]);
      }
    }, 16);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const angle = Math.atan2(500 - mouseY, mouseX - centerX) * (180 / Math.PI);
    setShooterAngle(Math.max(10, Math.min(170, angle)));
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🎯 Bubble Shooter</h3>
        <p className="mb-6 text-sm md:text-base">Match 3 or more bubbles of the same color!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Aim and shoot bubbles</p>
            <p className="text-xs md:text-sm mb-2">• Match 3+ bubbles to pop them</p>
            <p className="text-xs md:text-sm">• Clear all bubbles to advance</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Shooting
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-4">
        <div className="flex justify-between text-base md:text-lg mb-4">
          <span>Level: {level}</span>
          <span>Score: {score}</span>
          <span>Bubbles: {bubbles.length}</span>
        </div>
      </div>

      <div 
        className="relative bg-gradient-to-b from-blue-900 to-purple-900 rounded-xl mx-auto"
        style={{ width: '400px', height: '550px' }}
        onMouseMove={handleMouseMove}
        onClick={shoot}
      >
        {/* Bubbles */}
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            className="absolute w-10 h-10 rounded-full border-2 border-white/30 transition-all duration-200 flex items-center justify-center text-white font-bold text-sm"
            style={{
              left: bubble.x - 20,
              top: bubble.y - 20,
              backgroundColor: bubble.color
            }}
          >
            ●
          </div>
        ))}
        
        {/* Shooter */}
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        >
          <div
            className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: shooterBubble }}
          >
            ●
          </div>
          
          {/* Aim line */}
          <div
            className="absolute bottom-6 left-6 w-1 bg-white/50 origin-bottom"
            style={{
              height: '60px',
              transform: `rotate(${90 - shooterAngle}deg)`
            }}
          />
        </div>
        
        {/* Next bubble */}
        <div className="absolute bottom-4 right-4">
          <div className="text-xs mb-1">Next:</div>
          <div
            className="w-8 h-8 rounded-full border border-white/30"
            style={{ backgroundColor: nextBubble }}
          />
        </div>
      </div>
    </div>
  );
};
