import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface MemoryGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

export const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete, gameId }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    generateNewSequence();
  };

  const generateNewSequence = () => {
    const newColor = Math.floor(Math.random() * colors.length);
    const newSequence = [...sequence, newColor];
    setSequence(newSequence);
    setPlayerSequence([]);
    showSequence(newSequence);
  };

  const showSequence = async (seq: number[]) => {
    setShowingSequence(true);
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      // Flash the color
    }
    
    setShowingSequence(false);
  };

  const handleColorClick = (colorIndex: number) => {
    if (showingSequence || gameOver) return;

    const newPlayerSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      // Wrong color clicked
      endGame();
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      // Round completed successfully
      setScore(score + round * 10);
      setRound(round + 1);
      setTimeout(() => generateNewSequence(), 1000);
    }
  };

  const endGame = () => {
    setGameOver(true);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const accuracy = Math.round((score / (round * 10)) * 100) || 0;
    const xpEarned = Math.round(score / 4);

    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent,
      xpEarned
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white">
        <h3 className="text-xl font-bold mb-4">Memory Sequence</h3>
        <p className="mb-6">Watch the sequence of colors and repeat it back in the same order.</p>
        <button
          onClick={startGame}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white">
      <div className="flex justify-between mb-6">
        <div>Round: {round}</div>
        <div>Score: {score}</div>
      </div>

      {showingSequence && (
        <div className="mb-4 text-lg">Watch the sequence...</div>
      )}

      {!showingSequence && !gameOver && (
        <div className="mb-4 text-lg">Repeat the sequence!</div>
      )}

      <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-6">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleColorClick(index)}
            className={`w-20 h-20 rounded-lg transition-all duration-200 ${
              showingSequence && sequence[playerSequence.length] === index
                ? 'scale-110 brightness-150'
                : ''
            }`}
            style={{ backgroundColor: color }}
            disabled={showingSequence || gameOver}
          />
        ))}
      </div>

      {gameOver && (
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Game Over!</h3>
          <p>You reached round {round} with a score of {score}!</p>
        </div>
      )}
    </div>
  );
};
