
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface MemoryGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ 
  onComplete, 
  gameId,
  activePowerUps = new Set(),
  onPowerUpUsed
}) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [currentShowing, setCurrentShowing] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(120);

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
    setCurrentShowing(-1);
    
    seq.forEach((num, index) => {
      setTimeout(() => {
        setCurrentShowing(num);
        setTimeout(() => setCurrentShowing(-1), 600);
      }, (index + 1) * 800);
    });
    
    setTimeout(() => {
      setShowingSequence(false);
      setCurrentShowing(-1);
    }, seq.length * 800 + 800);
  };

  const startGame = () => {
    setGameStarted(true);
    setSequence([]);
    setUserSequence([]);
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setShowingSequence(false);
    setCurrentShowing(-1);
    setTimeLeft(120);
    
    // Apply time freeze power-up
    if (activePowerUps.has('timeFreeze')) {
      setTimeLeft(prev => prev + 30);
      onPowerUpUsed?.('timeFreeze');
    }
    
    setTimeout(() => {
      generateSequence();
    }, 1000);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameStarted, gameOver]);

  const handleColorClick = (colorIndex: number) => {
    if (showingSequence || gameOver) return;

    const newUserSequence = [...userSequence, colorIndex];
    setUserSequence(newUserSequence);

    // Check if the clicked color is correct
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      setGameOver(true);
      return;
    }

    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      const levelScore = level * 100;
      const timeBonus = Math.floor(timeLeft / 10) * 5;
      const totalLevelScore = levelScore + timeBonus;
      
      setScore(prev => prev + totalLevelScore);
      setLevel(prev => prev + 1);
      
      setTimeout(() => {
        generateSequence();
      }, 1000);
    }
  };

  const endGame = () => {
    const accuracy = sequence.length > 0 ? Math.round((level / (level + 1)) * 100) : 0;
    
    let finalScore = score;
    
    // Apply double XP power-up
    if (activePowerUps.has('doubleXP')) {
      finalScore *= 2;
      onPowerUpUsed?.('doubleXP');
    }
    
    onComplete({
      gameId,
      score: finalScore,
      accuracy: Math.min(accuracy, 100),
      timeSpent: 120 - timeLeft,
      xpEarned: Math.round(finalScore / 4)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🧠 Memory Sequence</h3>
        <p className="mb-6 text-sm md:text-base">Watch the sequence of colors and repeat them in order!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Watch the flashing sequence</p>
            <p className="text-xs md:text-sm mb-2">• Click colors in the same order</p>
            <p className="text-xs md:text-sm">• Sequence gets longer each level</p>
          </div>
        </div>
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
        <h3 className="text-xl font-bold mb-4">🎯 Game Over!</h3>
        <div className="space-y-2 md:space-y-3 text-sm md:text-lg">
          <p>Level Reached: <span className="text-blue-400 font-bold">{level}</span></p>
          <p>Sequence Length: <span className="text-green-400 font-bold">{sequence.length}</span></p>
          <p>Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
        </div>
        <button
          onClick={endGame}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200"
        >
          Complete Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="flex justify-between text-sm md:text-lg mb-4">
          <span>Time: {timeLeft}s</span>
          <span>Level: {level}</span>
          <span>Score: {score}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-md mx-auto mb-6">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleColorClick(index)}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-xl transition-all duration-200 ${color} ${
              currentShowing === index ? 'scale-110 brightness-150 shadow-xl ring-4 ring-white' : ''
            } ${
              showingSequence ? 'cursor-not-allowed opacity-70' : 'hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
            }`}
            disabled={showingSequence}
          />
        ))}
      </div>

      <div className="mb-4">
        {showingSequence && (
          <p className="text-base md:text-lg text-yellow-400 animate-pulse">
            👀 Watch the sequence... ({sequence.length} colors)
          </p>
        )}
        {!showingSequence && sequence.length > 0 && (
          <p className="text-base md:text-lg text-green-400">
            🎯 Repeat the sequence ({userSequence.length}/{sequence.length})
          </p>
        )}
      </div>
      
      {userSequence.length > 0 && (
        <div className="flex justify-center space-x-1 md:space-x-2 mb-4">
          {userSequence.map((colorIndex, i) => (
            <div
              key={i}
              className={`w-4 h-4 md:w-6 md:h-6 rounded-full ${colors[colorIndex]} border-2 border-white`}
            />
          ))}
        </div>
      )}
      
      <button
        onClick={() => setGameOver(true)}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200 text-sm"
      >
        End Game
      </button>
    </div>
  );
};
