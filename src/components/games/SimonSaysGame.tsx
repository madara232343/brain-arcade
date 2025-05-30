
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';
import { PowerUpBar } from '@/components/PowerUpBar';
import { audioManager } from '@/utils/audioUtils';

interface SimonSaysGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

const colors = ['red', 'blue', 'green', 'yellow'];
const sounds = ['do', 're', 'mi', 'fa'];

export const SimonSaysGame: React.FC<SimonSaysGameProps> = ({ onComplete, gameId }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [activePowerUps, setActivePowerUps] = useState<Set<string>>(new Set());

  const generateNewSequence = () => {
    const newColor = Math.floor(Math.random() * colors.length);
    const newSequence = [...sequence, newColor];
    setSequence(newSequence);
    setPlayerSequence([]);
    showSequence(newSequence);
  };

  const showSequence = async (seq: number[]) => {
    setIsShowingSequence(true);
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveColor(seq[i]);
      audioManager.play('click');
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveColor(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsShowingSequence(false);
  };

  const startGame = () => {
    setGameStarted(true);
    generateNewSequence();
  };

  const handleColorClick = (colorIndex: number) => {
    if (isShowingSequence || gameOver) return;

    audioManager.play('click');
    setActiveColor(colorIndex);
    setTimeout(() => setActiveColor(null), 200);

    const newPlayerSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      if (!activePowerUps.has('shield')) {
        endGame();
      } else {
        setActivePowerUps(prev => {
          const newSet = new Set(prev);
          newSet.delete('shield');
          return newSet;
        });
      }
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      const points = round * 10 * (activePowerUps.has('doubleXP') ? 2 : 1);
      setScore(score + points);
      setRound(round + 1);
      setTimeout(() => generateNewSequence(), 1000);
    }
  };

  const handlePowerUpUsed = (type: string) => {
    setActivePowerUps(prev => new Set([...prev, type]));
    
    if (type === 'accuracyBoost') {
      // Show next color briefly
      if (playerSequence.length < sequence.length) {
        const nextColor = sequence[playerSequence.length];
        setActiveColor(nextColor);
        setTimeout(() => setActiveColor(null), 1000);
      }
      setActivePowerUps(prev => {
        const newSet = new Set(prev);
        newSet.delete('accuracyBoost');
        return newSet;
      });
    }
  };

  const endGame = () => {
    setGameOver(true);
    const accuracy = Math.round((round / Math.max(round + 1, 1)) * 100);
    const xpEarned = Math.round(score / 3);

    setTimeout(() => {
      onComplete({
        gameId,
        score,
        accuracy,
        timeSpent: round * 3,
        xpEarned
      });
    }, 2000);
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🎵 Simon Says</h3>
        <p className="mb-6 text-sm md:text-lg">Watch the sequence and repeat it back!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Watch the color sequence carefully</p>
            <p className="text-xs md:text-sm mb-2">• Click the colors in the same order</p>
            <p className="text-xs md:text-sm">• Each round adds one more color</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 hover:scale-105"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🎯 Great Memory!</h3>
        <div className="space-y-2 md:space-y-3 text-sm md:text-lg">
          <p>Round Reached: <span className="text-yellow-400 font-bold">{round}</span></p>
          <p>Final Score: <span className="text-green-400 font-bold">{score}</span> points</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-2 md:p-4">
      <PowerUpBar onPowerUpUsed={handlePowerUpUsed} />
      
      <div className="flex justify-between mb-6 text-sm md:text-lg">
        <div>Round: <span className="font-bold">{round}</span></div>
        <div>Score: <span className="font-bold text-yellow-400">{score}</span></div>
      </div>

      {isShowingSequence && (
        <div className="mb-4 text-lg md:text-xl font-bold animate-pulse text-blue-400">
          🧠 Watch the sequence...
        </div>
      )}

      {!isShowingSequence && !gameOver && (
        <div className="mb-4 text-lg md:text-xl font-bold text-green-400">
          🎯 Your turn! ({playerSequence.length + 1}/{sequence.length})
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleColorClick(index)}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-xl transition-all duration-200 border-4 touch-target ${
              activeColor === index
                ? 'scale-110 brightness-150 border-white'
                : 'border-white/30 hover:border-white/60'
            } ${
              isShowingSequence || gameOver ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'
            }`}
            style={{ 
              backgroundColor: color,
              opacity: activeColor === index ? 1 : 0.7
            }}
            disabled={isShowingSequence || gameOver}
          />
        ))}
      </div>

      <div className="mt-4 text-xs md:text-sm text-white/70">
        Sequence length: {sequence.length}
      </div>
    </div>
  );
};
