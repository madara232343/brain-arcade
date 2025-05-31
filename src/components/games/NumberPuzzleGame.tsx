
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface NumberPuzzleGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const NumberPuzzleGame: React.FC<NumberPuzzleGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [puzzle, setPuzzle] = useState<(number | null)[][]>([]);
  const [targetSum, setTargetSum] = useState(0);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(120);

  const generatePuzzle = () => {
    const size = 4;
    const newPuzzle = Array(size).fill(null).map(() => Array(size).fill(null));
    
    // Fill some cells with numbers
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (Math.random() > 0.5) {
          newPuzzle[i][j] = Math.floor(Math.random() * 9) + 1;
        }
      }
    }
    
    setPuzzle(newPuzzle);
    setTargetSum(15 + level * 5);
  };

  const startGame = () => {
    setGameStarted(true);
    generatePuzzle();
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const handleCellClick = (row: number, col: number) => {
    if (puzzle[row][col] !== null) return;
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    
    const newPuzzle = [...puzzle];
    newPuzzle[selectedCell.row][selectedCell.col] = num;
    setPuzzle(newPuzzle);
    setSelectedCell(null);
    
    checkSolution(newPuzzle);
  };

  const checkSolution = (currentPuzzle: (number | null)[][]) => {
    // Check if all rows sum to target
    let correct = true;
    for (let i = 0; i < currentPuzzle.length; i++) {
      const rowSum = currentPuzzle[i].reduce((sum, cell) => sum + (cell || 0), 0);
      if (rowSum !== targetSum) {
        correct = false;
        break;
      }
    }
    
    if (correct) {
      setScore(prev => prev + level * 200);
      setLevel(prev => prev + 1);
      generatePuzzle();
    }
  };

  const endGame = () => {
    const accuracy = Math.min(100, level * 10);
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
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🔢 Number Puzzle</h3>
        <p className="mb-6 text-sm md:text-base">Fill empty cells so each row sums to the target!</p>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Number Puzzle
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="flex justify-between text-base md:text-lg mb-4">
          <span>Time: {timeLeft}s</span>
          <span>Level: {level}</span>
          <span>Score: {score}</span>
        </div>
        <div className="text-lg font-bold text-yellow-400">Target Sum: {targetSum}</div>
      </div>

      <div className="bg-white/10 rounded-xl p-6 md:p-8 mb-6">
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-6">
          {puzzle.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`w-12 h-12 md:w-16 md:h-16 rounded-lg font-bold text-lg transition-all duration-200 ${
                  cell !== null 
                    ? 'bg-blue-600 text-white' 
                    : selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                      ? 'bg-yellow-500 text-black'
                      : 'bg-white/20 text-white/70 hover:bg-white/30'
                }`}
              >
                {cell || '?'}
              </button>
            ))
          )}
        </div>
        
        {selectedCell && (
          <div>
            <p className="text-white/70 mb-3">Select a number (1-9):</p>
            <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumberInput(num)}
                  className="w-10 h-10 bg-green-500 hover:bg-green-400 text-white rounded-lg font-bold transition-all duration-200 hover:scale-105"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
