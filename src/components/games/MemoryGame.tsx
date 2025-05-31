
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface MemoryGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete, gameId }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [activeButton, setActiveButton] = useState<number | null>(null);

  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];

  const startGame = () => {
    setGameStarted(true);
    generateSequence();
  };

  const generateSequence = () => {
    const newNumber = Math.floor(Math.random() * 4);
    const newSequence = [...sequence, newNumber];
    setSequence(newSequence);
    setUserSequence([]);
    showSequence(newSequence);
  };

  const showSequence = (seq: number[]) => {
    setIsShowing(true);
    seq.forEach((num, index) => {
      setTimeout(() => {
        setActiveButton(num);
        setTimeout(() => setActiveButton(null), 500);
      }, (index + 1) * 800);
    });
    setTimeout(() => setIsShowing(false), seq.length * 800 + 500);
  };

  const handleButtonClick = (buttonIndex: number) => {
    if (isShowing) return;

    const newUserSequence = [...userSequence, buttonIndex];
    setUserSequence(newUserSequence);

    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      endGame();
      return;
    }

    if (newUserSequence.length === sequence.length) {
      setScore(score + round * 10);
      setRound(round + 1);
      setTimeout(generateSequence, 1000);
    }
  };

  const endGame = () => {
    const accuracy = sequence.length > 0 ? Math.round((userSequence.length / sequence.length) * 100) : 0;
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: round * 5,
      xpEarned: Math.round(score / 2)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Memory Sequence</h3>
        <p className="mb-6">Remember and repeat the sequence!</p>
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
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="text-lg mb-2">Round: {round}</div>
        <div className="text-lg mb-4">Score: {score}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(index)}
            className={`w-24 h-24 rounded-lg transition-all duration-200 ${color} ${
              activeButton === index ? 'scale-110 brightness-150' : 'hover:scale-105'
            }`}
            disabled={isShowing}
          />
        ))}
      </div>

      {isShowing && (
        <p className="text-lg text-yellow-400">Watch the sequence...</p>
      )}
      {!isShowing && sequence.length > 0 && (
        <p className="text-lg text-green-400">
          Repeat the sequence ({userSequence.length}/{sequence.length})
        </p>
      )}
    </div>
  );
};
