
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface ColorMemoryGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const ColorMemoryGame: React.FC<ColorMemoryGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [showColors, setShowColors] = useState(true);
  const [colorSequence, setColorSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const colors = [
    { name: 'red', bg: 'bg-red-500', hover: 'hover:bg-red-400' },
    { name: 'blue', bg: 'bg-blue-500', hover: 'hover:bg-blue-400' },
    { name: 'green', bg: 'bg-green-500', hover: 'hover:bg-green-400' },
    { name: 'yellow', bg: 'bg-yellow-500', hover: 'hover:bg-yellow-400' },
    { name: 'purple', bg: 'bg-purple-500', hover: 'hover:bg-purple-400' },
    { name: 'orange', bg: 'bg-orange-500', hover: 'hover:bg-orange-400' }
  ];

  const generateColorSequence = () => {
    const sequence = [];
    const sequenceLength = Math.min(3 + round, 8);
    
    for (let i = 0; i < sequenceLength; i++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      sequence.push(randomColor.name);
    }
    
    setColorSequence(sequence);
    setUserSequence([]);
    setShowColors(true);
    
    setTimeout(() => {
      setShowColors(false);
    }, sequence.length * 800 + 1000);
  };

  const startGame = () => {
    setGameStarted(true);
    generateColorSequence();
  };

  const handleColorClick = (colorName: string) => {
    if (showColors || gameOver) return;
    
    const newUserSequence = [...userSequence, colorName];
    setUserSequence(newUserSequence);
    
    if (newUserSequence[newUserSequence.length - 1] !== colorSequence[newUserSequence.length - 1]) {
      setGameOver(true);
      endGame();
      return;
    }
    
    if (newUserSequence.length === colorSequence.length) {
      setScore(prev => prev + round * 15);
      setRound(prev => prev + 1);
      setTimeout(generateColorSequence, 1500);
    }
  };

  const endGame = () => {
    const accuracy = colorSequence.length > 0 ? Math.round((round / colorSequence.length) * 100) : 0;
    onComplete({
      gameId,
      score,
      accuracy: Math.min(accuracy, 100),
      timeSpent: round * 6,
      xpEarned: Math.round(score / 2)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">Color Memory Challenge</h3>
        <p className="mb-6 text-sm md:text-base">Memorize the color sequence and repeat it back!</p>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Color Memory
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl font-bold mb-4">Game Complete!</h3>
        <p className="text-lg mb-2">Round Reached: {round}</p>
        <p className="text-lg mb-4">Final Score: {score}</p>
        <p className="mb-6">You remembered {colorSequence.length} colors!</p>
        <button
          onClick={endGame}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold"
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
          <span>Round: {round}</span>
          <span>Score: {score}</span>
        </div>
      </div>

      {showColors && (
        <div className="mb-6">
          <p className="text-lg md:text-xl text-yellow-400 mb-4">Memorize these colors:</p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-4">
            {colorSequence.map((colorName, index) => {
              const color = colors.find(c => c.name === colorName);
              return (
                <div
                  key={index}
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-lg ${color?.bg} animate-pulse border-2 border-white/30`}
                />
              );
            })}
          </div>
        </div>
      )}

      {!showColors && (
        <>
          <p className="text-base md:text-lg text-green-400 mb-4">
            Click the colors in order ({userSequence.length}/{colorSequence.length}):
          </p>
          <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-sm mx-auto mb-6">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorClick(color.name)}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-lg ${color.bg} ${color.hover} transition-all duration-200 hover:scale-105 border-2 border-white/20`}
              />
            ))}
          </div>
          
          <div className="flex justify-center space-x-2 mb-4">
            {userSequence.map((colorName, index) => {
              const color = colors.find(c => c.name === colorName);
              return (
                <div
                  key={index}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded ${color?.bg} border border-white/50`}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
