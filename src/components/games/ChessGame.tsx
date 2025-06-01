
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface ChessGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
type PieceColor = 'white' | 'black';

type Piece = {
  type: PieceType;
  color: PieceColor;
} | null;

type Position = {
  row: number;
  col: number;
};

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

export const ChessGame: React.FC<ChessGameProps> = ({ 
  onComplete, 
  gameId,
  activePowerUps = new Set(),
  onPowerUpUsed
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<Piece[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [capturedPieces, setCapturedPieces] = useState<Piece[]>([]);
  const [gameTime, setGameTime] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [computerThinking, setComputerThinking] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setBoard(initialBoard.map(row => [...row]));
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setMoveCount(0);
    setCapturedPieces([]);
    setGameTime(0);
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver]);

  const isValidMove = (from: Position, to: Position): boolean => {
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

  const getAllValidMoves = (color: PieceColor): Array<{from: Position, to: Position}> => {
    const moves: Array<{from: Position, to: Position}> = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === color) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (isValidMove({row, col}, {row: toRow, col: toCol})) {
                moves.push({
                  from: {row, col},
                  to: {row: toRow, col: toCol}
                });
              }
            }
          }
        }
      }
    }
    
    return moves;
  };

  const evaluateBoard = (): number => {
    const pieceValues = {
      pawn: 1,
      knight: 3,
      bishop: 3,
      rook: 5,
      queen: 9,
      king: 0
    };
    
    let score = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          const value = pieceValues[piece.type];
          score += piece.color === 'black' ? value : -value;
        }
      }
    }
    return score;
  };

  const makeComputerMove = () => {
    setComputerThinking(true);
    
    setTimeout(() => {
      const validMoves = getAllValidMoves('black');
      if (validMoves.length === 0) {
        setGameOver(true);
        setComputerThinking(false);
        return;
      }
      
      // Simple AI: prefer captures, then random moves
      const captureMoves = validMoves.filter(move => 
        board[move.to.row][move.to.col] !== null
      );
      
      const moveToMake = captureMoves.length > 0 
        ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
        : validMoves[Math.floor(Math.random() * validMoves.length)];
      
      makeMove(moveToMake.from, moveToMake.to);
      setComputerThinking(false);
    }, 1000);
  };

  const makeMove = (from: Position, to: Position) => {
    const newBoard = board.map(row => [...row]);
    const movingPiece = newBoard[from.row][from.col];
    const capturedPiece = newBoard[to.row][to.col];
    
    if (capturedPiece) {
      setCapturedPieces(prev => [...prev, capturedPiece]);
      setScore(prev => prev + getPieceValue(capturedPiece));
    }
    
    newBoard[to.row][to.col] = movingPiece;
    newBoard[from.row][from.col] = null;
    
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    setMoveCount(prev => prev + 1);
    
    // Check for game end conditions
    if (moveCount >= 30 || isKingCaptured(newBoard)) {
      setGameOver(true);
    }
  };

  const getPieceValue = (piece: Piece): number => {
    if (!piece) return 0;
    const values = { pawn: 100, knight: 300, bishop: 300, rook: 500, queen: 900, king: 0 };
    return values[piece.type];
  };

  const isKingCaptured = (board: Piece[][]): boolean => {
    let whiteKing = false;
    let blackKing = false;
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.type === 'king') {
          if (piece.color === 'white') whiteKing = true;
          if (piece.color === 'black') blackKing = true;
        }
      }
    }
    
    return !whiteKing || !blackKing;
  };

  const handleSquareClick = (row: number, col: number) => {
    if (currentPlayer === 'black' || computerThinking || gameOver) return;
    
    if (selectedSquare) {
      if (selectedSquare.row === row && selectedSquare.col === col) {
        setSelectedSquare(null);
        return;
      }
      
      if (isValidMove(selectedSquare, {row, col})) {
        makeMove(selectedSquare, {row, col});
        setSelectedSquare(null);
      } else {
        setSelectedSquare(null);
      }
    } else {
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare({row, col});
      }
    }
  };

  useEffect(() => {
    if (currentPlayer === 'black' && !gameOver && gameStarted) {
      makeComputerMove();
    }
  }, [currentPlayer, gameOver, gameStarted]);

  const endGame = () => {
    const timeBonus = Math.max(0, (300 - gameTime) * 2);
    const moveBonus = Math.max(0, (50 - moveCount) * 10);
    
    let finalScore = score + timeBonus + moveBonus;
    
    // Apply double XP power-up
    if (activePowerUps.has('doubleXP')) {
      finalScore *= 2;
      onPowerUpUsed?.('doubleXP');
    }
    
    const accuracy = Math.min(100, Math.max(50, Math.round((score / 1000) * 100)));
    
    onComplete({
      gameId,
      score: finalScore,
      accuracy,
      timeSpent: gameTime,
      xpEarned: Math.round(finalScore / 8)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">♔ Chess vs Computer</h3>
        <p className="mb-6 text-sm md:text-base">Play chess against an AI opponent!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• You play as White pieces</p>
            <p className="text-xs md:text-sm mb-2">• Click piece to select, click square to move</p>
            <p className="text-xs md:text-sm">• Capture pieces to earn points</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Chess Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl font-bold mb-4">♔ Game Over!</h3>
        <div className="space-y-2 text-sm md:text-lg">
          <p>Moves Played: <span className="text-blue-400 font-bold">{moveCount}</span></p>
          <p>Pieces Captured: <span className="text-green-400 font-bold">{capturedPieces.length}</span></p>
          <p>Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
        </div>
        <button
          onClick={endGame}
          className="mt-6 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200"
        >
          Complete Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-4">
        <div className="flex justify-between text-sm md:text-lg mb-4">
          <span>Turn: {currentPlayer === 'white' ? '⚪ You' : '⚫ Computer'}</span>
          <span>Moves: {moveCount}/30</span>
          <span>Score: {score}</span>
        </div>
        {computerThinking && (
          <p className="text-yellow-400 animate-pulse">Computer is thinking...</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-start gap-4">
        {/* Chess Board */}
        <div className="bg-amber-900 p-2 rounded-lg">
          <div className="grid grid-cols-8 gap-0" style={{ width: '320px', height: '320px' }}>
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  disabled={currentPlayer === 'black' || computerThinking}
                  className={`w-10 h-10 flex items-center justify-center text-xl md:text-2xl transition-all duration-200 ${
                    (rowIndex + colIndex) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800'
                  } ${
                    selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex
                      ? 'bg-yellow-400'
                      : 'hover:bg-yellow-200'
                  } ${
                    currentPlayer === 'black' || computerThinking ? 'cursor-not-allowed' : 'cursor-pointer'
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
            onClick={() => setGameOver(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200"
          >
            Resign Game
          </button>
        </div>
      </div>
    </div>
  );
};
