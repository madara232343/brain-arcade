
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface SudokuGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

export const SudokuGame: React.FC<SudokuGameProps> = ({ onComplete, gameId, activePowerUps = new Set(), onPowerUpUsed }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<number[][]>([]);
  const [initialBoard, setInitialBoard] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [errors, setErrors] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [shieldActive, setShieldActive] = useState(false);

  useEffect(() => {
    if (activePowerUps.has('shield')) {
      setShieldActive(true);
    }
  }, [activePowerUps]);

  const generateSudoku = () => {
    const size = 4;
    const solution = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 3, 4, 1],
      [4, 1, 2, 3]
    ];
    
    const puzzle = solution.map(row => [...row]);
    const cellsToRemove = 8;
    
    for (let i = 0; i < cellsToRemove; i++) {
      let row, col;
      do {
        row = Math.floor(Math.random() * size);
        col = Math.floor(Math.random() * size);
      } while (puzzle[row][col] === 0);
      puzzle[row][col] = 0;
    }
    
    setBoard(puzzle);
    setInitialBoard(puzzle.map(row => [...row]));
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setErrors(0);
    setHintsUsed(0);
    setTimeLeft(activePowerUps.has('timeFreeze') ? 350 : 300);
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
    for (let c = 0; c < 4; c++) {
      if (c !== col && board[row][c] === num) return false;
    }
    
    for (let r = 0; r < 4; r++) {
      if (r !== row && board[r][col] === num) return false;
    }
    
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
    if (initialBoard[row][col] !== 0) return;
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const newBoard = [...board];
    
    if (isValidMove(newBoard, row, col, num)) {
      newBoard[row][col] = num;
      setBoard(newBoard);
      const baseScore = 50;
      const xpMultiplier = activePowerUps.has('doubleXP') ? 2 : 1;
      setScore(prev => prev + (baseScore * xpMultiplier));
      
      const isComplete = newBoard.every(row => row.every(cell => cell !== 0));
      if (isComplete) {
        endGame(true);
      }
    } else {
      if (shieldActive) {
        setShieldActive(false);
        onPowerUpUsed?.('shield');
      } else {
        setErrors(prev => prev + 1);
        if (errors >= 2) {
          endGame();
        }
      }
    }
    
    setSelectedCell(null);
  };

  const useHint = () => {
    if (activePowerUps.has('accuracyBoost') && hintsUsed < 3) {
      const emptyCells = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (board[r][c] === 0) {
            emptyCells.push({ row: r, col: c });
          }
        }
      }
      
      if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        for (let num = 1; num <= 4; num++) {
          if (isValidMove(board, randomCell.row, randomCell.col, num)) {
            const newBoard = [...board];
            newBoard[randomCell.row][randomCell.col] = num;
            setBoard(newBoard);
            setHintsUsed(prev => prev + 1);
            onPowerUpUsed?.('accuracyBoost');
            break;
          }
        }
      }
    }
  };

  const useTimeFreeze = () => {
    if (activePowerUps.has('timeFreeze')) {
      setTimeLeft(prev => prev + 30);
      onPowerUpUsed?.('timeFreeze');
    }
  };

  const endGame = (completed = false) => {
    const accuracy = completed ? 100 : Math.max(0, 100 - errors * 10);
    const timeBonus = completed ? timeLeft * 10 : 0;
    const finalScore = score + timeBonus;
    const xpMultiplier = activePowerUps.has('doubleXP') ? 2 : 1;
    
    onComplete({
      gameId,
      score: finalScore,
      accuracy,
      timeSpent: 300 - timeLeft,
      xpEarned: Math.round((finalScore / 5) * xpMultiplier)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-3 md:p-4">
        <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">🔢 Sudoku</h3>
        <p className="mb-4 md:mb-6 text-sm md:text-base px-2">Fill the 4x4 grid with numbers 1-4!</p>
        <div className="mb-4 md:mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4 max-w-xs md:max-w-none">
            <p className="text-xs md:text-sm mb-2">• Each row must contain 1-4</p>
            <p className="text-xs md:text-sm mb-2">• Each column must contain 1-4</p>
            <p className="text-xs md:text-sm">• Each 2x2 box must contain 1-4</p>
          </div>
        </div>
        
        {activePowerUps.size > 0 && (
          <div className="mb-4 bg-yellow-500/20 rounded-lg p-2 md:p-3">
            <p className="text-xs md:text-sm text-yellow-300 mb-2">Active Power-ups:</p>
            <div className="flex flex-wrap justify-center gap-1 md:gap-2">
              {Array.from(activePowerUps).map(powerUp => (
                <span key={powerUp} className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">
                  {powerUp}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 text-sm md:text-base"
        >
          Start Sudoku
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-2 md:p-4">
      <div className="mb-3 md:mb-4">
        <div className="flex flex-wrap justify-between text-sm md:text-lg mb-3 md:mb-4 gap-2">
          <span>Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          <span>Score: {score}</span>
          <span>Errors: {errors}/3</span>
        </div>
        
        {/* Power-up buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {activePowerUps.has('timeFreeze') && (
            <button
              onClick={useTimeFreeze}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 md:px-3 py-1 md:py-2 rounded text-xs md:text-sm"
            >
              ⏱️ Add Time
            </button>
          )}
          {activePowerUps.has('accuracyBoost') && hintsUsed < 3 && (
            <button
              onClick={useHint}
              className="bg-green-500 hover:bg-green-600 text-white px-2 md:px-3 py-1 md:py-2 rounded text-xs md:text-sm"
            >
              💡 Hint ({3 - hintsUsed} left)
            </button>
          )}
          {shieldActive && (
            <div className="bg-purple-500 text-white px-2 md:px-3 py-1 md:py-2 rounded text-xs md:text-sm">
              🛡️ Shield Active
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-3 md:p-6 mb-4 md:mb-6 max-w-sm mx-auto">
        <div className="grid grid-cols-4 gap-1 mb-4 md:mb-6">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`w-10 h-10 md:w-16 md:h-16 rounded-lg font-bold text-sm md:text-lg transition-all duration-200 ${
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                    ? 'bg-yellow-500 text-black'
                    : initialBoard[rowIndex][colIndex] !== 0
                      ? 'bg-gray-600 text-white cursor-not-allowed'
                      : cell !== 0
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/20 text-white/70 hover:bg-white/30'
                } ${
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
            <p className="text-white/70 mb-2 md:mb-3 text-sm md:text-base">Select number (1-4):</p>
            <div className="grid grid-cols-4 gap-1 md:gap-2 max-w-xs mx-auto">
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumberInput(num)}
                  className="w-8 h-8 md:w-10 md:h-10 bg-green-500 hover:bg-green-400 text-white rounded-lg font-bold transition-all duration-200 hover:scale-105 text-sm md:text-base"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 md:h-3">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 md:h-3 rounded-full transition-all duration-300"
          style={{ width: `${((300 - timeLeft) / 300) * 100}%` }}
        />
      </div>
    </div>
  );
};
