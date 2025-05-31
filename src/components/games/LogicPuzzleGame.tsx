
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface LogicPuzzleGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const LogicPuzzleGame: React.FC<LogicPuzzleGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState<number[][]>([]);
  const [targetSum, setTargetSum] = useState(15);

  const generatePuzzle = () => {
    const newGrid = Array(3).fill(null).map(() => Array(3).fill(0));
    setGrid(newGrid);
    setTargetSum(15 + Math.floor(Math.random() * 10));
  };

  const handleCellClick = (row: number, col: number) => {
    const newGrid = [...grid];
    newGrid[row][col] = (newGrid[row][col] + 1) % 10;
    setGrid(newGrid);
    
    // Check if puzzle is solved
    const sum = newGrid.flat().reduce((a, b) => a + b, 0);
    if (sum === targetSum) {
      setScore(prev => prev + 200);
      if (currentPuzzle < 4) {
        setCurrentPuzzle(prev => prev + 1);
        generatePuzzle();
      } else {
        endGame();
      }
    }
  };

  const endGame = () => {
    onComplete({
      gameId,
      score,
      accuracy: Math.min(100, (score / 1000) * 100),
      timeSpent: 120,
      xpEarned: Math.round(score / 3)
    });
  };

  const startGame = () => {
    setGameStarted(true);
    generatePuzzle();
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">Logic Grid Puzzle</h3>
        <p className="mb-6 text-sm md:text-base">Click numbers to make the grid sum equal the target!</p>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Logic Puzzle
        </button>
      </div>
    );
  }

  const currentSum = grid.flat().reduce((a, b) => a + b, 0);

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="flex justify-between text-base md:text-lg mb-4">
          <span>Puzzle: {currentPuzzle + 1}/5</span>
          <span>Score: {score}</span>
          <span>Target: {targetSum}</span>
        </div>
        <div className="text-lg mb-4">Current Sum: {currentSum}</div>
      </div>

      <div className="bg-white/10 rounded-xl p-6 md:p-8 mb-6">
        <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-xs mx-auto">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className="w-12 h-12 md:w-16 md:h-16 bg-teal-600 hover:bg-teal-500 text-white text-xl font-bold rounded-lg transition-all duration-200 hover:scale-105"
              >
                {cell}
              </button>
            ))
          )}
        </div>
      </div>

      <p className="text-white/70 text-sm md:text-base">Click cells to cycle through numbers 0-9</p>
    </div>
  );
};
