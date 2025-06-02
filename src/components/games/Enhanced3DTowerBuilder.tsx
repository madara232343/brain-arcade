
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface Enhanced3DTowerBuilderProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Block {
  id: number;
  width: number;
  height: number;
  color: string;
  placed: boolean;
}

export const Enhanced3DTowerBuilder: React.FC<Enhanced3DTowerBuilderProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [tower, setTower] = useState<Block[]>([]);
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  const [stability, setStability] = useState(100);

  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameStarted, timeLeft, gameOver]);

  const generateBlock = () => {
    const width = 80 + Math.random() * 40; // 80-120px width
    const height = 20 + Math.random() * 20; // 20-40px height
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      id: Date.now(),
      width,
      height,
      color,
      placed: false
    };
  };

  const startGame = () => {
    setGameStarted(true);
    setTower([{
      id: 0,
      width: 120,
      height: 30,
      color: 'bg-gray-600',
      placed: true
    }]);
    setCurrentBlock(generateBlock());
    setScore(0);
    setLevel(1);
    setTimeLeft(120);
    setGameOver(false);
    setStability(100);
  };

  const placeBlock = () => {
    if (!currentBlock || gameOver) return;

    const lastBlock = tower[tower.length - 1];
    const stabilityPenalty = Math.abs(currentBlock.width - lastBlock.width) * 2;
    const newStability = Math.max(0, stability - stabilityPenalty);
    
    setStability(newStability);
    
    if (newStability < 20) {
      setGameOver(true);
      return;
    }

    const points = Math.round(100 - stabilityPenalty + (currentBlock.width / 2));
    setScore(prev => prev + points);
    
    setTower(prev => [...prev, { ...currentBlock, placed: true }]);
    setCurrentBlock(generateBlock());
    
    if (tower.length % 5 === 0) {
      setLevel(prev => prev + 1);
    }
  };

  const endGame = () => {
    const accuracy = Math.min(100, Math.round((tower.length - 1) * 10 + stability));
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 120 - timeLeft,
      xpEarned: Math.round(score / 4)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-2 md:p-4">
        <h3 className="text-lg md:text-2xl font-bold mb-4">🏗️ 3D Tower Builder</h3>
        <p className="mb-6 text-sm md:text-base">Build the tallest stable tower possible!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Place blocks to build your tower</p>
            <p className="text-xs md:text-sm mb-2">• Similar sized blocks are more stable</p>
            <p className="text-xs md:text-sm">• Keep stability above 20% to continue</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 text-sm md:text-base"
        >
          Start Building
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white p-2 md:p-4">
        <h3 className="text-lg md:text-xl font-bold mb-4">🏗️ Tower Collapsed!</h3>
        <div className="space-y-2 text-sm md:text-lg">
          <p>Tower Height: <span className="text-yellow-400 font-bold">{tower.length - 1} blocks</span></p>
          <p>Final Score: <span className="text-green-400 font-bold">{score}</span></p>
          <p>Stability: <span className="text-red-400 font-bold">{stability}%</span></p>
        </div>
        <button
          onClick={endGame}
          className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-200 text-sm md:text-base"
        >
          Complete Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-2 md:p-4">
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between text-sm md:text-lg mb-4">
          <span>Level: {level}</span>
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
        </div>
        <div className="flex justify-between text-xs md:text-sm">
          <span>Height: {tower.length - 1}</span>
          <span className={`font-bold ${stability > 60 ? 'text-green-400' : stability > 30 ? 'text-yellow-400' : 'text-red-400'}`}>
            Stability: {stability}%
          </span>
        </div>
      </div>

      {/* Tower Display */}
      <div className="flex flex-col-reverse items-center justify-end mb-6 min-h-48 md:min-h-64 max-h-48 md:max-h-64 overflow-y-auto">
        {tower.map((block, index) => (
          <div
            key={block.id}
            className={`${block.color} rounded border-2 border-white/30 mb-1 transition-all duration-300`}
            style={{
              width: `${block.width}px`,
              height: `${block.height}px`,
              transform: index > 0 ? `rotate(${(Math.random() - 0.5) * (100 - stability) * 0.1}deg)` : 'none'
            }}
          />
        ))}
      </div>

      {/* Current Block */}
      {currentBlock && (
        <div className="mb-6">
          <p className="text-xs md:text-sm text-gray-300 mb-2">Next Block:</p>
          <div
            className={`${currentBlock.color} rounded border-2 border-white/50 mx-auto mb-4`}
            style={{
              width: `${currentBlock.width}px`,
              height: `${currentBlock.height}px`
            }}
          />
          <button
            onClick={placeBlock}
            className="px-6 md:px-8 py-2 md:py-3 bg-green-500 hover:bg-green-600 rounded-lg font-bold transition-all duration-200 hover:scale-105 text-sm md:text-base"
          >
            Place Block
          </button>
        </div>
      )}

      {/* Stability Bar */}
      <div className="mb-4">
        <div className="bg-gray-700 rounded-full h-2 md:h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              stability > 60 ? 'bg-green-500' : stability > 30 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${stability}%` }}
          />
        </div>
      </div>

      {/* Time Bar */}
      <div className="bg-white/10 rounded-full h-2">
        <div 
          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(timeLeft / 120) * 100}%` }}
        />
      </div>
    </div>
  );
};
