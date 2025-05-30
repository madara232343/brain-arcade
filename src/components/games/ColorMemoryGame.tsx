
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';
import { audioManager } from '@/utils/audioUtils';

interface ColorMemoryGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

const colors = [
  { name: 'red', bg: 'bg-red-500', glow: 'shadow-red-500/50' },
  { name: 'blue', bg: 'bg-blue-500', glow: 'shadow-blue-500/50' },
  { name: 'green', bg: 'bg-green-500', glow: 'shadow-green-500/50' },
  { name: 'yellow', bg: 'bg-yellow-500', glow: 'shadow-yellow-500/50' },
  { name: 'purple', bg: 'bg-purple-500', glow: 'shadow-purple-500/50' },
  { name: 'orange', bg: 'bg-orange-500', glow: 'shadow-orange-500/50' },
  { name: 'pink', bg: 'bg-pink-500', glow: 'shadow-pink-500/50' },
  { name: 'cyan', bg: 'bg-cyan-500', glow: 'shadow-cyan-500/50' }
];

export const ColorMemoryGame: React.FC<ColorMemoryGameProps> = ({ 
  onComplete, 
  gameId, 
  activePowerUps = new Set(),
  onPowerUpUsed 
}) => {
  const [gridSize, setGridSize] = useState(3);
  const [targetColors, setTargetColors] = useState<number[]>([]);
  const [displayedColors, setDisplayedColors] = useState<number[]>([]);
  const [userClicks, setUserClicks] = useState<number[]>([]);
  const [isShowingColors, setIsShowingColors] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePhase, setGamePhase] = useState<'memorize' | 'recall' | 'result'>('memorize');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(45);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const generateColorPattern = () => {
    const numColors = Math.min(2 + round, gridSize * gridSize - 1);
    const pattern: number[] = [];
    const usedPositions = new Set<number>();
    
    for (let i = 0; i < numColors; i++) {
      let position;
      do {
        position = Math.floor(Math.random() * (gridSize * gridSize));
      } while (usedPositions.has(position));
      
      usedPositions.add(position);
      pattern.push(position);
    }
    
    return pattern.sort((a, b) => a - b);
  };

  const startGame = () => {
    setGameStarted(true);
    startRound();
  };

  const startRound = () => {
    const pattern = generateColorPattern();
    setTargetColors(pattern);
    setDisplayedColors(pattern);
    setUserClicks([]);
    setGamePhase('memorize');
    setIsShowingColors(true);

    // Show colors for a few seconds
    setTimeout(() => {
      setIsShowingColors(false);
      setGamePhase('recall');
    }, 2000 + round * 500);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        if (!activePowerUps.has('timeFreeze')) {
          setTimeLeft(prev => prev - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted, activePowerUps]);

  const handleCellClick = (position: number) => {
    if (gamePhase !== 'recall' || isShowingColors) return;

    const newUserClicks = [...userClicks, position];
    setUserClicks(newUserClicks);
    audioManager.play('click');

    // Check if this click is correct
    const isCorrect = targetColors[newUserClicks.length - 1] === position;
    
    if (!isCorrect) {
      if (activePowerUps.has('shield') && onPowerUpUsed) {
        onPowerUpUsed('shield');
        return; // Shield protects from wrong answer
      }
      // Wrong answer - end game
      endGame();
      return;
    }

    // Check if pattern is complete
    if (newUserClicks.length === targetColors.length) {
      setCorrectAnswers(prev => prev + 1);
      const roundScore = targetColors.length * 10 * (activePowerUps.has('doubleXP') ? 2 : 1);
      setScore(prev => prev + roundScore);
      
      setTimeout(() => {
        if (round < 8) {
          setRound(prev => prev + 1);
          if (round % 2 === 0 && gridSize < 5) {
            setGridSize(prev => prev + 1);
          }
          startRound();
        } else {
          endGame();
        }
      }, 1000);
    }
  };

  const endGame = () => {
    const accuracy = Math.round((correctAnswers / round) * 100);
    const xpEarned = Math.round(score / 4);

    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 45 - timeLeft,
      xpEarned
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🎨 Color Memory</h3>
        <p className="mb-6 text-sm md:text-lg">Remember the highlighted colors and click them in order!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Watch the colors that light up</p>
            <p className="text-xs md:text-sm mb-2">• Click them back in the same order</p>
            <p className="text-xs md:text-sm">• Each round adds more colors</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 hover:scale-105"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (timeLeft === 0 || (gamePhase === 'result')) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🏆 Great Memory!</h3>
        <div className="space-y-2 md:space-y-3 text-sm md:text-lg">
          <p>Round Reached: <span className="text-purple-400 font-bold">{round}</span></p>
          <p>Score: <span className="text-yellow-400 font-bold">{score}</span></p>
          <p>Accuracy: <span className="text-green-400 font-bold">{Math.round((correctAnswers / round) * 100)}%</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-2 md:p-4">
      <div className="flex flex-wrap justify-between mb-4 md:mb-6 text-sm md:text-lg gap-2">
        <div>Time: <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>{timeLeft}s</span></div>
        <div>Round: <span className="font-bold text-purple-400">{round}</span></div>
        <div>Score: <span className="font-bold text-yellow-400">{score}</span></div>
      </div>

      {gamePhase === 'memorize' && (
        <div className="mb-4 text-lg md:text-xl font-bold animate-pulse text-blue-400">
          🧠 Memorize the colors...
        </div>
      )}

      {gamePhase === 'recall' && (
        <div className="mb-4 text-lg md:text-xl font-bold text-green-400">
          🎯 Click the colors in order! ({userClicks.length}/{targetColors.length})
        </div>
      )}

      <div 
        className={`grid gap-2 md:gap-3 max-w-sm mx-auto`}
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const isTarget = targetColors.includes(index);
          const isClicked = userClicks.includes(index);
          const shouldGlow = isShowingColors && isTarget;
          
          return (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              className={`aspect-square rounded-lg transition-all duration-300 border-2 touch-target ${
                shouldGlow
                  ? `${colors[index % colors.length].bg} ${colors[index % colors.length].glow} shadow-2xl scale-110 border-white`
                  : isClicked
                  ? `${colors[index % colors.length].bg} border-green-400 scale-105`
                  : 'bg-gray-600 border-gray-500 hover:border-gray-400 hover:scale-105'
              }`}
              disabled={gamePhase !== 'recall' || isShowingColors}
            >
              {isClicked && <div className="text-white font-bold">✓</div>}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-xs md:text-sm text-white/70">
        Click the highlighted colors in the order they appeared
      </div>
    </div>
  );
};
