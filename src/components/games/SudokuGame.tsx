
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface SudokuGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const SudokuGame: React.FC<SudokuGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<number[][]>([]);
  const [initialBoard, setInitialBoard] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [errors, setErrors] = useState(0);

  const generateSudoku = () => {
    // Simple Sudoku generator (4x4 for mobile-friendly gameplay)
    const size = 4;
    const newBoard = Array(size).fill(null).map(() => Array(size).fill(0));
    
    // Fill with a valid solution
    const solution = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 3, 4, 1],
      [4, 1, 2, 3]
    ];
    
    // Remove some numbers to create puzzle
    const puzzle = solution.map(row => [...row]);
    const cellsToRemove = 8; // Remove 8 out of 16 cells
    
    for (let i = 0; i < cellsToRemove; i++) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      puzzle[row][col] = 0;
    }
    
    setBoard(puzzle);
    setInitialBoard(puzzle.map(row => [...row]));
  };

  const startGame = () => {
    setGameStarted(true);
    generateSudoku();
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const isValidMove = (board: number[][], row: number, col: number, num: number) => {
    // Check row
    for (let c = 0; c < 4; c++) {
      if (c !== col && board[row][c] === num) return false;
    }
    
    // Check column
    for (let r = 0; r < 4; r++) {
      if (r !== row && board[r][col] === num) return false;
    }
    
    // Check 2x2 box
    const boxRow = Math.floor(row / 2) * 2;
    const boxCol = Math.floor(col / 2) * 2;
    
    for (let r = boxRow; r < boxRow + 2; r++) {
      for (let c = boxCol; c < boxCol + 2; c++) {
        if ((r !== row || c !== col) && board[r][c] === num) return false;
      }
    }
    
    return true;
  };

  const handleCellClick = (row: number, col: number) => {
    if (initialBoard[row][col] !== 0) return; // Can't change initial numbers
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const newBoard = [...board];
    
    if (isValidMove(newBoard, row, col, num)) {
      newBoard[row][col] = num;
      setBoard(newBoard);
      setScore(prev => prev + 50);
      
      // Check if puzzle is complete
      const isComplete = newBoard.every(row => row.every(cell => cell !== 0));
      if (isComplete) {
        endGame(true);
      }
    } else {
      setErrors(prev => prev + 1);
      if (errors >= 2) {
        endGame();
      }
    }
    
    setSelectedCell(null);
  };

  const endGame = (completed = false) => {
    const accuracy = completed ? 100 : Math.max(0, 100 - errors * 10);
    onComplete({
      gameId,
      score: completed ? score + timeLeft * 10 : score,
      accuracy,
      timeSpent: 300 - timeLeft,
      xpEarned: Math.round(score / 5)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🔢 Sudoku</h3>
        <p className="mb-6 text-sm md:text-base">Fill the 4x4 grid with numbers 1-4!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Each row must contain 1-4</p>
            <p className="text-xs md:text-sm mb-2">• Each column must contain 1-4</p>
            <p className="text-xs md:text-sm">• Each 2x2 box must contain 1-4</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Sudoku
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-4">
        <div className="flex justify-between text-base md:text-lg mb-4">
          <span>Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          <span>Score: {score}</span>
          <span>Errors: {errors}/3</span>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-4 md:p-6 mb-6 max-w-sm mx-auto">
        <div className="grid grid-cols-4 gap-1 mb-6">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`w-12 h-12 md:w-16 md:h-16 rounded-lg font-bold text-lg transition-all duration-200 ${
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                    ? 'bg-yellow-500 text-black'
                    : initialBoard[rowIndex][colIndex] !== 0
                      ? 'bg-gray-600 text-white cursor-not-allowed'
                      : cell !== 0
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/20 text-white/70 hover:bg-white/30'
                } ${
                  // Highlight 2x2 boxes
                  Math.floor(rowIndex / 2) === 0 && Math.floor(colIndex / 2) === 0 ? 'border-t-2 border-l-2 border-white/50' :
                  Math.floor(rowIndex / 2) === 0 && Math.floor(colIndex / 2) === 1 ? 'border-t-2 border-r-2 border-white/50' :
                  Math.floor(rowIndex / 2) === 1 && Math.floor(colIndex / 2) === 0 ? 'border-b-2 border-l-2 border-white/50' :
                  'border-b-2 border-r-2 border-white/50'
                }`}
                disabled={initialBoard[rowIndex][colIndex] !== 0}
              >
                {cell || ''}
              </button>
            ))
          )}
        </div>
        
        {selectedCell && (
          <div>
            <p className="text-white/70 mb-3">Select number (1-4):</p>
            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
              {[1, 2, 3, 4].map(num => (
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
