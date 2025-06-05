
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface ChessGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
type PieceColor = 'white' | 'black';

interface Piece {
  type: PieceType;
  color: PieceColor;
}

interface Position {
  row: number;
  col: number;
}

const initialBoard: (Piece | null)[][] = [
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

// Updated piece symbols with better contrast for white pieces
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
  const [board, setBoard] = useState<(Piece | null)[][]>(initialBoard.map(row => [...row]));
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [capturedPieces, setCapturedPieces] = useState<Piece[]>([]);
  const [gameTime, setGameTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<PieceColor | null>(null);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver]);

  // Computer AI move
  useEffect(() => {
    if (gameStarted && currentPlayer === 'black' && !gameOver) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 1000 + Math.random() * 2000);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setBoard(initialBoard.map(row => [...row]));
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setMoveCount(0);
    setCapturedPieces([]);
    setGameTime(0);
    setGameOver(false);
    setWinner(null);
  };

  const makeComputerMove = () => {
    const allMoves = getAllValidMoves('black');
    if (allMoves.length === 0) {
      endGame('white');
      return;
    }

    // Simple AI: prioritize captures, then random moves
    const captureMoves = allMoves.filter(move => board[move.to.row][move.to.col] !== null);
    const selectedMove = captureMoves.length > 0 ? 
      captureMoves[Math.floor(Math.random() * captureMoves.length)] :
      allMoves[Math.floor(Math.random() * allMoves.length)];

    executeMove(selectedMove.from, selectedMove.to);
  };

  const getAllValidMoves = (color: PieceColor) => {
    const moves: { from: Position; to: Position }[] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === color) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (isValidMove({ row, col }, { row: toRow, col: toCol })) {
                moves.push({ from: { row, col }, to: { row: toRow, col: toCol } });
              }
            }
          }
        }
      }
    }
    return moves;
  };

  const isValidMove = (from: Position, to: Position): boolean => {
    const piece = board[from.row][from.col];
    if (!piece) return false;

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

  const isPathBlocked = (from: Position, to: Position): boolean => {
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

  const executeMove = (from: Position, to: Position) => {
    const newBoard = board.map(row => [...row]);
    const movingPiece = newBoard[from.row][from.col];
    const capturedPiece = newBoard[to.row][to.col];
    
    if (capturedPiece) {
      setCapturedPieces(prev => [...prev, capturedPiece]);
      
      // Check for game end conditions
      if (capturedPiece.type === 'king') {
        endGame(movingPiece!.color);
        return;
      }
    }
    
    newBoard[to.row][to.col] = movingPiece;
    newBoard[from.row][from.col] = null;
    
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    setMoveCount(prev => prev + 1);
    
    // End game after 30 moves or if no valid moves
    if (moveCount >= 30) {
      endGame(capturedPieces.filter(p => p.color === 'black').length > capturedPieces.filter(p => p.color === 'white').length ? 'white' : 'black');
    }
  };

  const handleSquareClick = (row: number, col: number) => {
    if (gameOver || currentPlayer === 'black') return;

    if (selectedSquare) {
      if (selectedSquare.row === row && selectedSquare.col === col) {
        setSelectedSquare(null);
        return;
      }
      
      if (isValidMove(selectedSquare, { row, col })) {
        executeMove(selectedSquare, { row, col });
      }
      setSelectedSquare(null);
    } else {
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare({ row, col });
      }
    }
  };

  const endGame = (winnerColor: PieceColor) => {
    setGameOver(true);
    setWinner(winnerColor);
    
    const score = capturedPieces.length * 100 + (winnerColor === 'white' ? 500 : 0);
    onComplete({
      gameId,
      score,
      accuracy: Math.max(50, 100 - Math.floor(moveCount / 2)),
      timeSpent: gameTime,
      xpEarned: Math.round(score / 5)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-2 md:p-4">
        <h3 className="text-lg md:text-2xl font-bold mb-4">♔ Chess vs Computer</h3>
        <p className="mb-6 text-sm md:text-base">Play chess against an AI opponent!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• You play as White pieces</p>
            <p className="text-xs md:text-sm mb-2">• Click piece to select, click square to move</p>
            <p className="text-xs md:text-sm">• Capture the king or get more points to win</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 text-sm md:text-base"
        >
          Start Chess
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white p-2 md:p-4">
        <h3 className="text-lg md:text-xl font-bold mb-4">🎯 Game Over!</h3>
        <div className="space-y-2 text-sm md:text-lg">
          <p>Winner: <span className="text-yellow-400 font-bold">{winner === 'white' ? 'You!' : 'Computer'}</span></p>
          <p>Moves: <span className="text-blue-400 font-bold">{moveCount}</span></p>
          <p>Pieces Captured: <span className="text-green-400 font-bold">{capturedPieces.length}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-2 md:p-4">
      <div className="mb-4">
        <div className="flex justify-between text-sm md:text-lg mb-4">
          <span>Turn: {currentPlayer === 'white' ? '⚪ You' : '⚫ Computer'}</span>
          <span>Moves: {moveCount}/30</span>
          <span>Time: {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-start gap-4">
        {/* Chess Board - Updated for better white piece visibility */}
        <div className="bg-amber-900 p-2 rounded-lg">
          <div className="grid grid-cols-8 gap-0 w-64 h-64 md:w-80 md:h-80">
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-lg md:text-2xl transition-all duration-200 ${
                    (rowIndex + colIndex) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800'
                  } ${
                    selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex
                      ? 'bg-yellow-400'
                      : 'hover:bg-yellow-200'
                  }`}
                  disabled={currentPlayer === 'black'}
                >
                  {piece && (
                    <span className={`${piece.color === 'white' ? 'text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]' : 'text-black'}`}>
                      {pieceSymbols[piece.type][piece.color]}
                    </span>
                  )}
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
                  {pieceSymbols[piece.type][piece.color]}
                </span>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => endGame('black')}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200 text-sm md:text-base"
          >
            Resign
          </button>
        </div>
      </div>
    </div>
  );
};
