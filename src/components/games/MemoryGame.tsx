
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface MemoryGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete, gameId }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

  const generateSequence = () => {
    const newNumber = Math.floor(Math.random() * 6);
    const newSequence = [...sequence, newNumber];
    setSequence(newSequence);
    setUserSequence([]);
    showSequence(newSequence);
  };

  const showSequence = (seq: number[]) => {
    setShowingSequence(true);
    seq.forEach((num, index) => {
      setTimeout(() => {
        // Flash animation handled by CSS
      }, index * 600);
    });
    setTimeout(() => setShowingSequence(false), seq.length * 600 + 500);
  };

  const startGame = () => {
    setGameStarted(true);
    generateSequence();
  };

  const handleColorClick = (colorIndex: number) => {
    if (showingSequence || gameOver) return;

    const newUserSequence = [...userSequence, colorIndex];
    setUserSequence(newUserSequence);

    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      setGameOver(true);
      endGame();
      return;
    }

    if (newUserSequence.length === sequence.length) {
      setScore(prev => prev + level * 10);
      setLevel(prev => prev + 1);
      setTimeout(generateSequence, 1000);
    }
  };

  const endGame = () => {
    const accuracy = sequence.length > 0 ? Math.round((level / sequence.length) * 100) : 0;
    onComplete({
      gameId,
      score,
      accuracy: Math.min(accuracy, 100),
      timeSpent: level * 5,
      xpEarned: Math.round(score / 2)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">Memory Sequence</h3>
        <p className="mb-6 text-sm md:text-base">Watch the sequence of colors and repeat them in order!</p>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Memory Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl font-bold mb-4">Game Over!</h3>
        <p className="text-lg mb-2">Level Reached: {level}</p>
        <p className="text-lg mb-4">Final Score: {score}</p>
        <p className="mb-6">You remembered {sequence.length} colors in sequence!</p>
        <button
          onClick={endGame}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Complete Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="flex justify-between text-base md:text-lg mb-4">
          <span>Level: {level}</span>
          <span>Score: {score}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-md mx-auto mb-6">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleColorClick(index)}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-lg transition-all duration-200 ${color} ${
              showingSequence ? 'cursor-not-allowed opacity-50' : 'hover:scale-105 active:scale-95'
            }`}
            disabled={showingSequence}
          />
        ))}
      </div>

      {showingSequence && (
        <p className="text-base md:text-lg text-yellow-400">Watch the sequence...</p>
      )}
      {!showingSequence && sequence.length > 0 && (
        <p className="text-base md:text-lg text-green-400">
          Repeat the sequence ({userSequence.length}/{sequence.length})
        </p>
      )}
    </div>
  );
};
