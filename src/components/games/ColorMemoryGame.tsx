
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/pages/Index';

interface ColorMemoryGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

interface ColorCell {
  id: number;
  color: string;
  isTarget: boolean;
  isGuessed: boolean;
  isCorrect?: boolean;
}

export const ColorMemoryGame: React.FC<ColorMemoryGameProps> = ({ onComplete, gameId }) => {
  const [grid, setGrid] = useState<ColorCell[]>([]);
  const [showColors, setShowColors] = useState(true);
  const [gamePhase, setGamePhase] = useState<'memorize' | 'recall' | 'result'>('memorize');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [startTime, setStartTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const gridSize = Math.min(4 + Math.floor(round / 3), 6);
  const targetCount = Math.min(3 + round, Math.floor(gridSize * gridSize / 2));

  const generateGrid = () => {
    const cells: ColorCell[] = [];
    const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < gridSize * gridSize; i++) {
      cells.push({
        id: i,
        color: shuffledColors[i % shuffledColors.length],
        isTarget: false,
        isGuessed: false
      });
    }

    // Set random cells as targets
    const targetIndices = [];
    while (targetIndices.length < targetCount) {
      const randomIndex = Math.floor(Math.random() * cells.length);
      if (!targetIndices.includes(randomIndex)) {
        targetIndices.push(randomIndex);
        cells[randomIndex].isTarget = true;
      }
    }

    setGrid(cells);
  };

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    generateGrid();
    
    // Show colors for memorization
    setTimeout(() => {
      setShowColors(false);
      setGamePhase('recall');
    }, 2000 + round * 500);
  };

  const handleCellClick = (cellId: number) => {
    if (gamePhase !== 'recall') return;

    setGrid(prev => prev.map(cell => {
      if (cell.id === cellId && !cell.isGuessed) {
        const isCorrect = cell.isTarget;
        if (isCorrect) {
          setScore(prev => prev + 10);
        }
        return { ...cell, isGuessed: true, isCorrect };
      }
      return cell;
    }));

    // Check if all targets found
    const updatedGrid = grid.map(cell => {
      if (cell.id === cellId && !cell.isGuessed) {
        return { ...cell, isGuessed: true, isCorrect: cell.isTarget };
      }
      return cell;
    });

    const allTargetsFound = updatedGrid.filter(cell => cell.isTarget).every(cell => cell.isGuessed);
    const wrongGuesses = updatedGrid.filter(cell => cell.isGuessed && !cell.isTarget).length;

    if (allTargetsFound || wrongGuesses >= 3) {
      if (allTargetsFound && wrongGuesses === 0) {
        // Perfect round
        setScore(prev => prev + 20);
        setTimeout(() => {
          setRound(prev => prev + 1);
          setShowColors(true);
          setGamePhase('memorize');
          generateGrid();
        }, 1500);
      } else {
        endGame();
      }
    }
  };

  const endGame = () => {
    setGamePhase('result');
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const accuracy = Math.round((score / (round * 30)) * 100) || 0;
    const xpEarned = Math.round(score / 3);

    setTimeout(() => {
      onComplete({
        gameId,
        score,
        accuracy,
        timeSpent,
        xpEarned
      });
    }, 2000);
  };

  useEffect(() => {
    if (gameStarted) {
      generateGrid();
    }
  }, [round]);

  if (!gameStarted) {
    return (
      <div className="text-center text-white">
        <h3 className="text-2xl font-bold mb-4">🎨 Color Memory</h3>
        <p className="mb-6 text-lg">Remember the highlighted colors and click them when they disappear!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-4">
            <p className="text-sm">• Watch the colored grid</p>
            <p className="text-sm">• Remember which cells light up</p>
            <p className="text-sm">• Click the correct cells when they turn gray</p>
            <p className="text-sm">• Avoid wrong clicks (max 3 mistakes)</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (gamePhase === 'result') {
    return (
      <div className="text-center text-white">
        <h3 className="text-2xl font-bold mb-4">🎉 Great Memory!</h3>
        <div className="space-y-2 text-lg">
          <p>Round Reached: {round}</p>
          <p>Final Score: {score} points</p>
          <p>Keep practicing to improve your visual memory!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-white">
      <div className="flex justify-between mb-6 text-lg">
        <div>Round: {round}</div>
        <div>Score: {score}</div>
        <div>Targets: {targetCount}</div>
      </div>

      {gamePhase === 'memorize' && (
        <div className="mb-4 text-xl font-bold animate-pulse">
          Memorize the highlighted colors... 🧠
        </div>
      )}

      {gamePhase === 'recall' && (
        <div className="mb-4 text-xl font-bold">
          Click the highlighted cells! 🎯
        </div>
      )}

      <div 
        className="grid gap-2 mx-auto mb-6 max-w-md"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {grid.map((cell) => (
          <button
            key={cell.id}
            onClick={() => handleCellClick(cell.id)}
            className={`aspect-square rounded-lg transition-all duration-300 border-2 ${
              gamePhase === 'memorize' 
                ? cell.isTarget 
                  ? 'border-yellow-400 border-4 animate-pulse' 
                  : 'border-white/30'
                : cell.isGuessed
                  ? cell.isCorrect
                    ? 'border-green-400 border-4'
                    : 'border-red-400 border-4'
                  : 'border-white/30 hover:border-white/60'
            } ${
              gamePhase === 'recall' ? 'hover:scale-105 cursor-pointer' : ''
            }`}
            style={{
              backgroundColor: showColors || cell.isGuessed ? cell.color : '#4a5568',
              opacity: cell.isGuessed ? (cell.isCorrect ? 1 : 0.5) : 1
            }}
            disabled={gamePhase !== 'recall' || cell.isGuessed}
          />
        ))}
      </div>

      <div className="text-sm text-white/70">
        Wrong clicks: {grid.filter(cell => cell.isGuessed && !cell.isTarget).length}/3
      </div>
    </div>
  );
};
