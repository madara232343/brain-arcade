
import React, { useState, useEffect, useCallback } from 'react';
import { GameResult } from '@/types/game';

interface TetrisGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: '#00f0f0' },
  O: { shape: [[1, 1], [1, 1]], color: '#f0f000' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00f000' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#f00000' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000f0' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#f0a000' }
};

export const TetrisGame: React.FC<TetrisGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<string[][]>([]);
  const [currentPiece, setCurrentPiece] = useState<any>(null);
  const [nextPiece, setNextPiece] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const createEmptyBoard = () => {
    return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''));
  };

  const getRandomPiece = () => {
    const pieces = Object.keys(TETROMINOS);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    return {
      type: randomPiece,
      shape: TETROMINOS[randomPiece as keyof typeof TETROMINOS].shape,
      color: TETROMINOS[randomPiece as keyof typeof TETROMINOS].color,
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0
    };
  };

  const startGame = () => {
    setGameStarted(true);
    setBoard(createEmptyBoard());
    setCurrentPiece(getRandomPiece());
    setNextPiece(getRandomPiece());
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
  };

  const isValidPosition = (board: string[][], piece: any, dx = 0, dy = 0) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + dx;
          const newY = piece.y + y + dy;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const rotatePiece = (piece: any) => {
    const rotated = piece.shape[0].map((_: any, index: number) =>
      piece.shape.map((row: any) => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  };

  const clearLines = (board: string[][]) => {
    const newBoard = board.filter(row => row.some(cell => !cell));
    const clearedLines = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(''));
    }
    
    return { board: newBoard, clearedLines };
  };

  const placePiece = useCallback(() => {
    if (!currentPiece) return;
    
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPiece.y + y;
          const boardX = currentPiece.x + x;
          
          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      }
    }
    
    const { board: clearedBoard, clearedLines } = clearLines(newBoard);
    setBoard(clearedBoard);
    setLines(prev => prev + clearedLines);
    setScore(prev => prev + clearedLines * 100 * level);
    setLevel(Math.floor(lines / 10) + 1);
    
    setCurrentPiece(nextPiece);
    setNextPiece(getRandomPiece());
    
    // Check game over
    if (!isValidPosition(clearedBoard, nextPiece)) {
      setGameOver(true);
      endGame();
    }
  }, [currentPiece, board, nextPiece, lines, level]);

  const movePiece = (dx: number, dy: number) => {
    if (!currentPiece || gameOver) return;
    
    if (isValidPosition(board, currentPiece, dx, dy)) {
      setCurrentPiece(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    } else if (dy > 0) {
      placePiece();
    }
  };

  const rotatePieceHandler = () => {
    if (!currentPiece || gameOver) return;
    
    const rotated = rotatePiece(currentPiece);
    if (isValidPosition(board, rotated)) {
      setCurrentPiece(rotated);
    }
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const interval = setInterval(() => {
      movePiece(0, 1);
    }, Math.max(100, 1000 - (level - 1) * 100));
    
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, level, currentPiece, board]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          movePiece(0, 1);
          break;
        case 'ArrowUp':
        case ' ':
          rotatePieceHandler();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, currentPiece, board]);

  const endGame = () => {
    const accuracy = Math.min(100, Math.round((lines / level) * 10));
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: level * 60,
      xpEarned: Math.round(score / 10)
    });
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }
    
    return displayBoard;
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🧩 Tetris</h3>
        <p className="mb-6 text-sm md:text-base">Clear lines by filling rows with blocks!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Use arrow keys to move/rotate</p>
            <p className="text-xs md:text-sm mb-2">• Fill complete rows to clear them</p>
            <p className="text-xs md:text-sm">• Don't let blocks reach the top!</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Tetris
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="flex flex-col md:flex-row justify-center items-start gap-4">
        {/* Game Board */}
        <div className="bg-black/50 p-2 rounded-lg">
          <div className="grid grid-cols-10 gap-px" style={{ width: '200px', height: '400px' }}>
            {renderBoard().map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className="w-4 h-4 border border-gray-600"
                  style={{ backgroundColor: cell || '#1a1a1a' }}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Game Info */}
        <div className="space-y-4 text-left">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-lg font-bold mb-2">Score: {score}</div>
            <div className="text-sm">Lines: {lines}</div>
            <div className="text-sm">Level: {level}</div>
          </div>
          
          {nextPiece && (
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-sm mb-2">Next:</div>
              <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 1fr)` }}>
                {nextPiece.shape.map((row: any, y: number) =>
                  row.map((cell: any, x: number) => (
                    <div
                      key={`${y}-${x}`}
                      className="w-3 h-3"
                      style={{ backgroundColor: cell ? nextPiece.color : 'transparent' }}
                    />
                  ))
                )}
              </div>
            </div>
          )}
          
          <div className="bg-white/10 rounded-lg p-3 text-xs">
            <div>↑/Space: Rotate</div>
            <div>←→: Move</div>
            <div>↓: Drop</div>
          </div>
        </div>
      </div>
    </div>
  );
};
