
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface MemoryGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete, gameId, activePowerUps = new Set(), onPowerUpUsed }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [currentShowing, setCurrentShowing] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [mistakes, setMistakes] = useState(0);
  const [hasUsedShield, setHasUsedShield] = useState(false);

  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameStarted, gameOver]);

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
        setTimeout(() => setCurrentShowing(-1), 400);
      }, (index + 1) * 600);
    });
    
    setTimeout(() => {
      setShowingSequence(false);
      setCurrentShowing(-1);
    }, seq.length * 600 + 500);
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
    setTimeLeft(activePowerUps.has('timeFreeze') ? 70 : 60);
    setMistakes(0);
    setHasUsedShield(false);
    
    setTimeout(() => {
      generateSequence();
    }, 1000);
  };

  const handleColorClick = (colorIndex: number) => {
    if (showingSequence || gameOver) return;

    const newUserSequence = [...userSequence, colorIndex];
    setUserSequence(newUserSequence);

    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      if (activePowerUps.has('shield') && !hasUsedShield) {
        setHasUsedShield(true);
        onPowerUpUsed?.('shield');
        setUserSequence([]);
        return;
      }
      
      setMistakes(prev => prev + 1);
      setGameOver(true);
      return;
    }

    if (newUserSequence.length === sequence.length) {
      const baseScore = level * 100;
      const xpMultiplier = activePowerUps.has('doubleXP') ? 2 : 1;
      setScore(prev => prev + (baseScore * xpMultiplier));
      setLevel(prev => prev + 1);
      setTimeout(() => {
        generateSequence();
      }, 1000);
    }
  };

  const useTimeFreeze = () => {
    if (activePowerUps.has('timeFreeze')) {
      setTimeLeft(prev => prev + 10);
      onPowerUpUsed?.('timeFreeze');
    }
  };

  const useHint = () => {
    if (activePowerUps.has('accuracyBoost') && userSequence.length < sequence.length) {
      const nextColor = sequence[userSequence.length];
      setCurrentShowing(nextColor);
      setTimeout(() => setCurrentShowing(-1), 1000);
      onPowerUpUsed?.('accuracyBoost');
    }
  };

  const endGame = () => {
    const accuracy = sequence.length > 0 ? Math.round((sequence.length / (sequence.length + mistakes)) * 100) : 0;
    const xpMultiplier = activePowerUps.has('doubleXP') ? 2 : 1;
    onComplete({
      gameId,
      score,
      accuracy: Math.min(accuracy, 100),
      timeSpent: 60 - timeLeft,
      xpEarned: Math.round((score / 2) * xpMultiplier)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-3 md:p-4">
        <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">🧠 Memory Sequence</h3>
        <p className="mb-4 md:mb-6 text-sm md:text-base px-2">Watch the sequence of colors and repeat them in order!</p>
        <div className="mb-4 md:mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4 max-w-xs md:max-w-none">
            <p className="text-xs md:text-sm mb-2">• Watch the flashing sequence</p>
            <p className="text-xs md:text-sm mb-2">• Click colors in the same order</p>
            <p className="text-xs md:text-sm">• Sequence gets longer each level</p>
          </div>
        </div>
        
        {activePowerUps.size > 0 && (
          <div className="mb-4 bg-yellow-500/20 rounded-lg p-2 md:p-3">
            <p className="text-xs md:text-sm text-yellow-300 mb-2">Active Power-ups:</p>
            <div className="flex flex-wrap justify-center gap-1 md:gap-2">
              {Array.from(activePowerUps).map(powerUp => (
                <span key={powerUp} className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">
                  {powerUp}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 text-sm md:text-base"
        >
          Start Memory Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white p-3 md:p-4">
        <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">🎯 Game Over!</h3>
        <div className="space-y-2 md:space-y-3 text-sm md:text-lg">
          <p>Level Reached: <span className="text-blue-400 font-bold">{level}</span></p>
          <p>Sequence Length: <span className="text-green-400 font-bold">{sequence.length}</span></p>
          <p>Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
          <p>Time Left: <span className="text-purple-400 font-bold">{timeLeft}s</span></p>
        </div>
        <button
          onClick={endGame}
          className="mt-4 md:mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-200 text-sm md:text-base"
        >
          Complete Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-2 md:p-4">
      <div className="mb-4 md:mb-6">
        <div className="flex flex-wrap justify-between text-sm md:text-lg mb-3 md:mb-4 gap-2">
          <span>Level: {level}</span>
          <span>Score: {score}</span>
          <span>Time: {timeLeft}s</span>
          <span>Sequence: {sequence.length}</span>
        </div>
        
        {/* Power-up buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {activePowerUps.has('timeFreeze') && (
            <button
              onClick={useTimeFreeze}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 md:px-3 py-1 md:py-2 rounded text-xs md:text-sm"
            >
              ⏱️ Freeze Time
            </button>
          )}
          {activePowerUps.has('accuracyBoost') && userSequence.length < sequence.length && (
            <button
              onClick={useHint}
              className="bg-green-500 hover:bg-green-600 text-white px-2 md:px-3 py-1 md:py-2 rounded text-xs md:text-sm"
            >
              💡 Hint
            </button>
          )}
          {activePowerUps.has('shield') && !hasUsedShield && (
            <div className="bg-purple-500 text-white px-2 md:px-3 py-1 md:py-2 rounded text-xs md:text-sm">
              🛡️ Shield Active
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 max-w-xs md:max-w-md mx-auto mb-4 md:mb-6">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleColorClick(index)}
            className={`w-12 h-12 md:w-20 md:h-20 rounded-xl transition-all duration-200 ${color} ${
              currentShowing === index ? 'scale-110 brightness-150 shadow-lg' : ''
            } ${
              showingSequence ? 'cursor-not-allowed opacity-70' : 'hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
            }`}
            disabled={showingSequence}
          />
        ))}
      </div>

      <div className="mb-3 md:mb-4 min-h-[2rem]">
        {showingSequence && (
          <p className="text-sm md:text-lg text-yellow-400 animate-pulse">
            👀 Watch the sequence... ({sequence.length} colors)
          </p>
        )}
        {!showingSequence && sequence.length > 0 && (
          <p className="text-sm md:text-lg text-green-400">
            🎯 Repeat the sequence ({userSequence.length}/{sequence.length})
          </p>
        )}
      </div>
      
      {userSequence.length > 0 && (
        <div className="flex justify-center space-x-1 md:space-x-2 mb-3 md:mb-4">
          {userSequence.map((colorIndex, i) => (
            <div
              key={i}
              className={`w-4 h-4 md:w-6 md:h-6 rounded-full ${colors[colorIndex]} border-2 border-white`}
            />
          ))}
        </div>
      )}
      
      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 md:h-3">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 md:h-3 rounded-full transition-all duration-300"
          style={{ width: `${((60 - timeLeft) / 60) * 100}%` }}
        />
      </div>
    </div>
  );
};
