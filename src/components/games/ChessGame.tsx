
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface ChessGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

type Piece = {
  type: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  color: 'white' | 'black';
} | null;

const initialBoard: Piece[][] = [
  [
    { type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, 
    { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' }, 
    { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, 
    { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }
  ],
  Array(8).fill({ type: 'pawn', color: 'black' }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ type: 'pawn', color: 'white' }),
  [
    { type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, 
    { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' }, 
    { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, 
    { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }
  ]
];

const pieceSymbols = {
  king: { white: '♔', black: '♚' },
  queen: { white: '♕', black: '♛' },
  rook: { white: '♖', black: '♜' },
  bishop: { white: '♗', black: '♝' },
  knight: { white: '♘', black: '♞' },
  pawn: { white: '♙', black: '♟' }
};

export const ChessGame: React.FC<ChessGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<Piece[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [selectedSquare, setSelectedSquare] = useState<{row: number, col: number} | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [capturedPieces, setCapturedPieces] = useState<Piece[]>([]);
  const [gameTime, setGameTime] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setBoard(initialBoard.map(row => [...row]));
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setMoveCount(0);
    setCapturedPieces([]);
    setGameTime(0);
  };

  React.useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted]);

  const isValidMove = (from: {row: number, col: number}, to: {row: number, col: number}): boolean => {
    const piece = board[from.row][from.col];
    if (!piece || piece.color !== currentPlayer) return false;

    const targetPiece = board[to.row][to.col];
    if (targetPiece && targetPiece.color === piece.color) return false;

    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        if (to.col === from.col && !targetPiece) {
          if (to.row === from.row + direction) return true;
          if (from.row === startRow && to.row === from.row + 2 * direction) return true;
        }
        if (colDiff === 1 && to.row === from.row + direction && targetPiece) return true;
        return false;

      case 'rook':
        return (rowDiff === 0 || colDiff === 0) && !isPathBlocked(from, to);

      case 'bishop':
        return rowDiff === colDiff && !isPathBlocked(from, to);

      case 'queen':
        return (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) && !isPathBlocked(from, to);

      case 'knight':
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

      case 'king':
        return rowDiff <= 1 && colDiff <= 1;

      default:
        return false;
    }
  };

  const isPathBlocked = (from: {row: number, col: number}, to: {row: number, col: number}): boolean => {
    const rowStep = to.row > from.row ? 1 : to.row < from.row ? -1 : 0;
    const colStep = to.col > from.col ? 1 : to.col < from.col ? -1 : 0;
    
    let currentRow = from.row + rowStep;
    let currentCol = from.col + colStep;
    
    while (currentRow !== to.row || currentCol !== to.col) {
      if (board[currentRow][currentCol]) return true;
      currentRow += rowStep;
      currentCol += colStep;
    }
    
    return false;
  };

  const makeMove = (to: {row: number, col: number}) => {
    if (!selectedSquare) return;
    
    if (isValidMove(selectedSquare, to)) {
      const newBoard = board.map(row => [...row]);
      const movingPiece = newBoard[selectedSquare.row][selectedSquare.col];
      const capturedPiece = newBoard[to.row][to.col];
      
      if (capturedPiece) {
        setCapturedPieces(prev => [...prev, capturedPiece]);
      }
      
      newBoard[to.row][to.col] = movingPiece;
      newBoard[selectedSquare.row][selectedSquare.col] = null;
      
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      setMoveCount(prev => prev + 1);
      
      // Simple game end condition (after 20 moves)
      if (moveCount >= 20) {
        endGame();
      }
    }
    
    setSelectedSquare(null);
  };

  const handleSquareClick = (row: number, col: number) => {
    if (selectedSquare) {
      makeMove({ row, col });
    } else {
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare({ row, col });
      }
    }
  };

  const endGame = () => {
    const score = capturedPieces.length * 100 + (moveCount * 10);
    onComplete({
      gameId,
      score,
      accuracy: Math.max(50, 100 - moveCount),
      timeSpent: gameTime,
      xpEarned: Math.round(score / 5)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">♔ Chess</h3>
        <p className="mb-6 text-sm md:text-base">Strategic board game - capture opponent pieces!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Click piece to select, click square to move</p>
            <p className="text-xs md:text-sm mb-2">• White moves first</p>
            <p className="text-xs md:text-sm">• Game ends after 20 moves</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Chess
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-4">
        <div className="flex justify-between text-base md:text-lg mb-4">
          <span>Turn: {currentPlayer === 'white' ? '⚪' : '⚫'} {currentPlayer}</span>
          <span>Moves: {moveCount}/20</span>
          <span>Time: {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-start gap-4">
        {/* Chess Board */}
        <div className="bg-amber-900 p-2 rounded-lg">
          <div className="grid grid-cols-8 gap-0" style={{ width: '320px', height: '320px' }}>
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  className={`w-10 h-10 flex items-center justify-center text-2xl transition-all duration-200 ${
                    (rowIndex + colIndex) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800'
                  } ${
                    selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex
                      ? 'bg-yellow-400'
                      : 'hover:bg-yellow-200'
                  }`}
                >
                  {piece && pieceSymbols[piece.type][piece.color]}
                </button>
              ))
            )}
          </div>
        </div>
        
        {/* Game Info */}
        <div className="space-y-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-sm font-bold mb-2">Captured Pieces</div>
            <div className="flex flex-wrap gap-1">
              {capturedPieces.map((piece, index) => (
                <span key={index} className="text-lg">
                  {piece && pieceSymbols[piece.type][piece.color]}
                </span>
              ))}
            </div>
          </div>
          
          <button
            onClick={endGame}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200"
          >
            End Game
          </button>
        </div>
      </div>
    </div>
  );
};
