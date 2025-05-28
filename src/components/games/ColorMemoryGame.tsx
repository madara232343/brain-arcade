
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
  const [wrongGuesses, setWrongGuesses] = useState(0);

  const gridSize = Math.min(3 + Math.floor(round / 2), 5);
  const targetCount = Math.min(2 + round, Math.floor(gridSize * gridSize / 3));

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
    const targetIndices: number[] = [];
    while (targetIndices.length < targetCount) {
      const randomIndex = Math.floor(Math.random() * cells.length);
      if (!targetIndices.includes(randomIndex)) {
        targetIndices.push(randomIndex);
        cells[randomIndex].isTarget = true;
      }
    }

    setGrid(cells);
    setWrongGuesses(0);
  };

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    generateGrid();
    
    // Show colors for memorization
    setTimeout(() => {
      setShowColors(false);
      setGamePhase('recall');
    }, 2000 + round * 300);
  };

  const handleCellClick = (cellId: number) => {
    if (gamePhase !== 'recall') return;

    setGrid(prev => prev.map(cell => {
      if (cell.id === cellId && !cell.isGuessed) {
        const isCorrect = cell.isTarget;
        if (isCorrect) {
          setScore(prev => prev + 15);
        } else {
          setWrongGuesses(prev => prev + 1);
        }
        return { ...cell, isGuessed: true, isCorrect };
      }
      return cell;
    }));

    // Check game state after update
    setTimeout(() => {
      const currentGrid = grid.map(cell => {
        if (cell.id === cellId && !cell.isGuessed) {
          return { ...cell, isGuessed: true, isCorrect: cell.isTarget };
        }
        return cell;
      });

      const allTargetsFound = currentGrid.filter(cell => cell.isTarget).every(cell => cell.isGuessed && cell.isCorrect);
      const wrongCount = currentGrid.filter(cell => cell.isGuessed && !cell.isTarget).length;

      if (allTargetsFound) {
        // Perfect round - bonus points and continue
        setScore(prev => prev + 25);
        setTimeout(() => {
          setRound(prev => prev + 1);
          setShowColors(true);
          setGamePhase('memorize');
          generateGrid();
        }, 1500);
      } else if (wrongCount >= 3) {
        // Too many mistakes - end game
        endGame();
      }
    }, 100);
  };

  const endGame = () => {
    setGamePhase('result');
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const accuracy = Math.round((score / Math.max(round * 40, 1)) * 100);
    const xpEarned = Math.round(score / 2);

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
    if (gameStarted && gamePhase === 'memorize') {
      generateGrid();
    }
  }, [round, gameStarted]);

  if (!gameStarted) {
    return (
      <div className="text-center text-white">
        <h3 className="text-2xl font-bold mb-4">🎨 Color Memory</h3>
        <p className="mb-6 text-lg">Remember the highlighted colors and click them when they disappear!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-4">
            <p className="text-sm mb-2">• Watch the colored grid carefully</p>
            <p className="text-sm mb-2">• Remember which cells are highlighted</p>
            <p className="text-sm mb-2">• Click the correct cells when they turn gray</p>
            <p className="text-sm">• Maximum 3 mistakes allowed per round</p>
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
        <div className="space-y-3 text-lg">
          <p>Round Reached: <span className="text-yellow-400 font-bold">{round}</span></p>
          <p>Final Score: <span className="text-green-400 font-bold">{score}</span> points</p>
          <p className="text-sm text-white/70">Keep practicing to improve your visual memory!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-white">
      <div className="flex justify-between mb-6 text-lg">
        <div>Round: <span className="font-bold">{round}</span></div>
        <div>Score: <span className="font-bold text-yellow-400">{score}</span></div>
        <div>Targets: <span className="font-bold text-blue-400">{targetCount}</span></div>
      </div>

      {gamePhase === 'memorize' && (
        <div className="mb-4 text-xl font-bold animate-pulse text-yellow-400">
          🧠 Memorize the highlighted colors...
        </div>
      )}

      {gamePhase === 'recall' && (
        <div className="mb-4 text-xl font-bold text-green-400">
          🎯 Click the highlighted cells!
        </div>
      )}

      <div 
        className="grid gap-3 mx-auto mb-6 max-w-md"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          aspectRatio: '1'
        }}
      >
        {grid.map((cell) => (
          <button
            key={cell.id}
            onClick={() => handleCellClick(cell.id)}
            className={`aspect-square rounded-xl transition-all duration-300 border-2 flex items-center justify-center font-bold text-sm ${
              gamePhase === 'memorize' 
                ? cell.isTarget 
                  ? 'border-yellow-400 border-4 animate-pulse shadow-lg shadow-yellow-400/50' 
                  : 'border-white/30'
                : cell.isGuessed
                  ? cell.isCorrect
                    ? 'border-green-400 border-4 shadow-lg shadow-green-400/50'
                    : 'border-red-400 border-4 shadow-lg shadow-red-400/50'
                  : 'border-white/30 hover:border-white/60 hover:scale-105'
            } ${
              gamePhase === 'recall' && !cell.isGuessed ? 'hover:shadow-lg cursor-pointer' : ''
            }`}
            style={{
              backgroundColor: showColors || cell.isGuessed ? cell.color : '#4a5568',
              minHeight: '60px'
            }}
            disabled={gamePhase !== 'recall' || cell.isGuessed}
          >
            {cell.isGuessed && cell.isCorrect && '✓'}
            {cell.isGuessed && !cell.isCorrect && '✗'}
          </button>
        ))}
      </div>

      <div className="flex justify-center space-x-6 text-sm text-white/70">
        <span>Mistakes: <span className="font-bold text-red-400">{wrongGuesses}/3</span></span>
        <span>Found: <span className="font-bold text-green-400">{grid.filter(cell => cell.isGuessed && cell.isCorrect).length}/{targetCount}</span></span>
      </div>
    </div>
  );
};
