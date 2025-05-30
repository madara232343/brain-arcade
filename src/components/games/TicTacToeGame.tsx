
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface TicTacToeGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const TicTacToeGame: React.FC<TicTacToeGameProps> = ({ onComplete, gameId }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [wins, setWins] = useState(0);
  const [startTime] = useState(Date.now());

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkWinner = (newBoard: (string | null)[]) => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }
    return newBoard.includes(null) ? null : 'tie';
  };

  const makePlayerMove = (index: number) => {
    if (board[index] || gameOver || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      handleGameEnd(gameResult);
    } else {
      setIsPlayerTurn(false);
      setTimeout(() => makeAIMove(newBoard), 500);
    }
  };

  const makeAIMove = (currentBoard: (string | null)[]) => {
    const emptySquares = currentBoard.map((square, index) => square === null ? index : null).filter(val => val !== null);
    if (emptySquares.length === 0) return;

    const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)] as number;
    const newBoard = [...currentBoard];
    newBoard[randomIndex] = 'O';
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      handleGameEnd(gameResult);
    } else {
      setIsPlayerTurn(true);
    }
  };

  const handleGameEnd = (result: string) => {
    setGameOver(true);
    setWinner(result);
    const newGamesPlayed = gamesPlayed + 1;
    setGamesPlayed(newGamesPlayed);

    if (result === 'X') {
      const newWins = wins + 1;
      setWins(newWins);
      setScore(score + 100);
    } else if (result === 'tie') {
      setScore(score + 50);
    }

    if (newGamesPlayed >= 3) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const accuracy = Math.round((wins / newGamesPlayed) * 100);
      const finalScore = result === 'X' ? score + 100 : result === 'tie' ? score + 50 : score;
      
      onComplete({
        gameId,
        score: finalScore,
        accuracy,
        timeSpent,
        xpEarned: Math.round(finalScore / 5)
      });
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
  };

  const renderSquare = (index: number) => (
    <button
      key={index}
      onClick={() => makePlayerMove(index)}
      className={`w-20 h-20 border-2 border-white/30 text-4xl font-bold transition-all duration-200 hover:bg-white/10 ${
        board[index] === 'X' ? 'text-blue-400' : board[index] === 'O' ? 'text-red-400' : 'text-white'
      }`}
      disabled={gameOver || !isPlayerTurn || board[index] !== null}
    >
      {board[index]}
    </button>
  );

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Tic Tac Toe</h3>
        <div className="flex justify-center space-x-6 text-sm">
          <span>Score: {score}</span>
          <span>Games: {gamesPlayed}/3</span>
          <span>Wins: {wins}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6">
        {Array.from({ length: 9 }, (_, index) => renderSquare(index))}
      </div>

      {gameOver && (
        <div className="mb-4">
          <p className="text-xl mb-2">
            {winner === 'X' ? '🎉 You Win!' : winner === 'O' ? '😅 AI Wins!' : '🤝 It\'s a Tie!'}
          </p>
          {gamesPlayed < 3 && (
            <button
              onClick={resetGame}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Next Game
            </button>
          )}
        </div>
      )}

      {!isPlayerTurn && !gameOver && (
        <p className="text-lg text-yellow-400">AI is thinking...</p>
      )}
    </div>
  );
};
