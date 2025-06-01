
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface SpatialMemoryGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface GridCell {
  id: number;
  isHighlighted: boolean;
  isClicked: boolean;
}

export const SpatialMemoryGame: React.FC<SpatialMemoryGameProps> = ({ 
  onComplete, 
  gameId,
  activePowerUps = new Set(),
  onPowerUpUsed
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gridSize] = useState(4);
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);

  const initializeGrid = () => {
    const newGrid: GridCell[] = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      newGrid.push({
        id: i,
        isHighlighted: false,
        isClicked: false
      });
    }
    setGrid(newGrid);
  };

  const generateSequence = () => {
    const sequenceLength = Math.min(2 + level, 8);
    const newSequence: number[] = [];
    const usedPositions = new Set<number>();
    
    while (newSequence.length < sequenceLength) {
      const randomPos = Math.floor(Math.random() * (gridSize * gridSize));
      if (!usedPositions.has(randomPos)) {
        newSequence.push(randomPos);
        usedPositions.add(randomPos);
      }
    }
    
    setSequence(newSequence);
    setUserSequence([]);
    showSequence(newSequence);
  };

  const showSequence = (seq: number[]) => {
    setShowingSequence(true);
    
    // Clear any previous highlights
    setGrid(prev => prev.map(cell => ({ ...cell, isHighlighted: false, isClicked: false })));
    
    seq.forEach((position, index) => {
      setTimeout(() => {
        setGrid(prev => prev.map(cell => 
          cell.id === position 
            ? { ...cell, isHighlighted: true }
            : { ...cell, isHighlighted: false }
        ));
        
        // Remove highlight after 800ms
        setTimeout(() => {
          setGrid(prev => prev.map(cell => ({ ...cell, isHighlighted: false })));
        }, 800);
      }, index * 1000);
    });
    
    // Allow user input after sequence is shown
    setTimeout(() => {
      setShowingSequence(false);
    }, seq.length * 1000 + 1000);
  };

  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
    setScore(0);
    setGameOver(false);
    setTimeLeft(90);
    initializeGrid();
    
    // Apply time freeze power-up
    if (activePowerUps.has('timeFreeze')) {
      setTimeLeft(prev => prev + 30);
      onPowerUpUsed?.('timeFreeze');
    }
    
    setTimeout(() => {
      generateSequence();
    }, 1000);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameStarted, gameOver]);

  const handleCellClick = (cellId: number) => {
    if (showingSequence || gameOver) return;
    
    const newUserSequence = [...userSequence, cellId];
    setUserSequence(newUserSequence);
    
    // Update grid to show clicked cell
    setGrid(prev => prev.map(cell => 
      cell.id === cellId 
        ? { ...cell, isClicked: true }
        : cell
    ));
    
    // Check if click is correct
    const expectedPosition = sequence[newUserSequence.length - 1];
    if (cellId !== expectedPosition) {
      setGameOver(true);
      return;
    }
    
    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      const levelScore = level * 200;
      const timeBonus = Math.floor(timeLeft / 5) * 10;
      const accuracyBonus = sequence.length * 50;
      
      setScore(prev => prev + levelScore + timeBonus + accuracyBonus);
      setLevel(prev => prev + 1);
      
      setTimeout(() => {
        initializeGrid();
        generateSequence();
      }, 1500);
    }
  };

  const endGame = () => {
    const accuracy = sequence.length > 0 ? Math.round((level / (level + 1)) * 100) : 0;
    
    let finalScore = score;
    
    // Apply double XP power-up
    if (activePowerUps.has('doubleXP')) {
      finalScore *= 2;
      onPowerUpUsed?.('doubleXP');
    }
    
    onComplete({
      gameId,
      score: finalScore,
      accuracy: Math.min(accuracy, 100),
      timeSpent: 90 - timeLeft,
      xpEarned: Math.round(finalScore / 5)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🎯 Spatial Memory</h3>
        <p className="mb-6 text-sm md:text-base">Remember the positions of highlighted cells and click them in order!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Watch cells light up in sequence</p>
            <p className="text-xs md:text-sm mb-2">• Click the cells in the same order</p>
            <p className="text-xs md:text-sm">• Sequences get longer each level</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Spatial Memory
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl font-bold mb-4">🎯 Game Complete!</h3>
        <div className="space-y-2 text-sm md:text-lg">
          <p>Level Reached: <span className="text-green-400 font-bold">{level}</span></p>
          <p>Sequence Length: <span className="text-blue-400 font-bold">{sequence.length}</span></p>
          <p>Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
        </div>
        <button
          onClick={endGame}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200"
        >
          Complete Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="flex justify-between text-sm md:text-lg mb-4">
          <span>Time: {timeLeft}s</span>
          <span>Level: {level}</span>
          <span>Score: {score}</span>
        </div>
      </div>

      <div className="mb-4">
        {showingSequence && (
          <p className="text-base md:text-lg text-yellow-400 animate-pulse">
            👀 Watch the sequence... ({sequence.length} positions)
          </p>
        )}
        {!showingSequence && sequence.length > 0 && (
          <p className="text-base md:text-lg text-green-400">
            🎯 Click the positions in order ({userSequence.length}/{sequence.length})
          </p>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 md:gap-3 max-w-xs mx-auto mb-6">
        {grid.map((cell) => (
          <button
            key={cell.id}
            onClick={() => handleCellClick(cell.id)}
            disabled={showingSequence}
            className={`aspect-square rounded-lg border-2 transition-all duration-300 ${
              cell.isHighlighted 
                ? 'bg-yellow-400 border-yellow-200 shadow-lg scale-110' 
                : cell.isClicked
                ? 'bg-green-500 border-green-300'
                : 'bg-gray-700 border-gray-500 hover:bg-gray-600'
            } ${
              showingSequence ? 'cursor-not-allowed' : 'hover:scale-105 active:scale-95'
            }`}
          >
            <div className="w-full h-full flex items-center justify-center">
              {cell.isClicked && <span className="text-white font-bold">✓</span>}
            </div>
          </button>
        ))}
      </div>
      
      <button
        onClick={() => setGameOver(true)}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200 text-sm"
      >
        End Game
      </button>
    </div>
  );
};
