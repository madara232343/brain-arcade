
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface ChessMiniGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface ChessPuzzle {
  id: number;
  description: string;
  board: string[][];
  solution: string;
  difficulty: number;
}

export const ChessMiniGame: React.FC<ChessMiniGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [startTime] = useState(Date.now());

  const puzzles: ChessPuzzle[] = [
    {
      id: 1,
      description: "White to move and checkmate in 1",
      board: [
        ['♜', '', '', '', '♚', '', '', '♜'],
        ['♟', '♟', '♟', '', '', '♟', '♟', '♟'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['♙', '♙', '♙', '', '', '♙', '♙', '♙'],
        ['♖', '', '', '', '♕', '', '', '♖']
      ],
      solution: "Qe8#",
      difficulty: 1
    },
    {
      id: 2,
      description: "White to move and win material",
      board: [
        ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
        ['♟', '♟', '♟', '', '♟', '♟', '♟', '♟'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '♟', '', '', '', ''],
        ['', '', '', '♙', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['♙', '♙', '♙', '', '♙', '♙', '♙', '♙'],
        ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
      ],
      solution: "Qxd8+",
      difficulty: 2
    },
    {
      id: 3,
      description: "Find the best defensive move for Black",
      board: [
        ['♜', '', '', '♛', '♚', '', '', '♜'],
        ['♟', '♟', '', '', '', '♟', '♟', '♟'],
        ['', '', '♟', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '♙', '♕', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['♙', '♙', '♙', '', '', '♙', '♙', '♙'],
        ['♖', '', '', '', '♔', '', '', '♖']
      ],
      solution: "Qd1+",
      difficulty: 3
    }
  ];

  const handleSquareClick = (row: number, col: number) => {
    const square = String.fromCharCode(97 + col) + (8 - row);
    
    if (selectedSquare) {
      const move = selectedSquare + square;
      checkSolution(move);
      setSelectedSquare(null);
    } else {
      setSelectedSquare(square);
    }
  };

  const checkSolution = (move: string) => {
    setAttempts(prev => prev + 1);
    const puzzle = puzzles[currentPuzzle];
    
    if (move.includes(puzzle.solution.slice(-2))) { // Basic solution checking
      setScore(prev => prev + (4 - puzzle.difficulty) * 50);
      setSolved(prev => prev + 1);
      
      if (currentPuzzle < puzzles.length - 1) {
        setCurrentPuzzle(prev => prev + 1);
      } else {
        // Game complete
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        const accuracy = Math.round((solved / attempts) * 100);
        onComplete({
          gameId,
          score,
          accuracy,
          timeSpent,
          xpEarned: Math.round(score / 4)
        });
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">♟️ Chess Mini</h3>
        <p className="mb-6">Solve tactical chess puzzles!</p>
        <div className="mb-6 text-sm space-y-2">
          <p>• Click piece then destination square</p>
          <p>• Find the best move in each position</p>
          <p>• Progress through increasing difficulty</p>
          <p>• Test your chess tactics skills</p>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Puzzles
        </button>
      </div>
    );
  }

  if (currentPuzzle >= puzzles.length) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">♔ Chess Master!</h3>
        <div className="space-y-2">
          <p>Puzzles Solved: <span className="text-green-400 font-bold">{solved}/{puzzles.length}</span></p>
          <p>Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
          <p>Accuracy: <span className="text-blue-400 font-bold">{Math.round((solved / attempts) * 100)}%</span></p>
        </div>
      </div>
    );
  }

  const puzzle = puzzles[currentPuzzle];

  return (
    <div className="text-center text-white p-4">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Puzzle {currentPuzzle + 1}</h3>
        <p className="text-white/80">{puzzle.description}</p>
        <div className="flex justify-center space-x-6 text-sm mt-2">
          <span>Score: {score}</span>
          <span>Solved: {solved}/{puzzles.length}</span>
        </div>
      </div>

      {/* Chess Board */}
      <div className="mx-auto max-w-sm bg-amber-100 p-2 rounded-lg">
        <div className="grid grid-cols-8 gap-0 border-2 border-amber-800">
          {puzzle.board.map((row, rowIndex) =>
            row.map((piece, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                className={`aspect-square flex items-center justify-center text-2xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                  (rowIndex + colIndex) % 2 === 0 
                    ? 'bg-amber-200 hover:bg-amber-300' 
                    : 'bg-amber-600 hover:bg-amber-700'
                } ${
                  selectedSquare === String.fromCharCode(97 + colIndex) + (8 - rowIndex)
                    ? 'ring-2 ring-blue-400'
                    : ''
                }`}
              >
                {piece}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Selected Square Info */}
      {selectedSquare && (
        <div className="mt-4 text-yellow-400">
          Selected: {selectedSquare.toUpperCase()}
        </div>
      )}

      {/* Difficulty indicator */}
      <div className="mt-4">
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
          puzzle.difficulty === 1 ? 'bg-green-500/20 text-green-400' :
          puzzle.difficulty === 2 ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          Difficulty: {puzzle.difficulty}/3
        </div>
      </div>
    </div>
  );
};
