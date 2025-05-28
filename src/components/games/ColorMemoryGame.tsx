
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/pages/Index';
import { PowerUpBar } from '@/components/PowerUpBar';
import { audioManager } from '@/utils/audioUtils';

interface ColorMemoryGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

interface ColorCell {
  id: number;
  color: string;
  isTarget: boolean;
  isGuessed: boolean;
  isCorrect?: boolean;
  isHighlighted?: boolean;
}

export const ColorMemoryGame: React.FC<ColorMemoryGameProps> = ({ onComplete, gameId }) => {
  const [grid, setGrid] = useState<ColorCell[]>([]);
  const [showColors, setShowColors] = useState(true);
  const [gamePhase, setGamePhase] = useState<'memorize' | 'recall' | 'result'>('memorize');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [startTime, setStartTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activePowerUps, setActivePowerUps] = useState<Set<string>>(new Set());
  const [highlightedCells, setHighlightedCells] = useState<Set<number>>(new Set());

  const gridSize = Math.min(3 + Math.floor(round / 3), 4);
  const targetCount = Math.min(2 + Math.floor(round / 2), Math.floor(gridSize * gridSize / 2));

  const generateGrid = () => {
    const cells: ColorCell[] = [];
    const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < gridSize * gridSize; i++) {
      cells.push({
        id: i,
        color: shuffledColors[i % shuffledColors.length],
        isTarget: false,
        isGuessed: false,
        isHighlighted: false
      });
    }

    // Set random cells as targets with better distribution
    const targetIndices: number[] = [];
    const attempts = 50; // Prevent infinite loop
    let attemptCount = 0;
    
    while (targetIndices.length < targetCount && attemptCount < attempts) {
      const randomIndex = Math.floor(Math.random() * cells.length);
      if (!targetIndices.includes(randomIndex)) {
        // Ensure targets aren't too close to each other
        const isValidPosition = targetIndices.every(existingIndex => {
          const row1 = Math.floor(existingIndex / gridSize);
          const col1 = existingIndex % gridSize;
          const row2 = Math.floor(randomIndex / gridSize);
          const col2 = randomIndex % gridSize;
          const distance = Math.abs(row1 - row2) + Math.abs(col1 - col2);
          return distance > 1 || targetIndices.length < 2;
        });
        
        if (isValidPosition) {
          targetIndices.push(randomIndex);
          cells[randomIndex].isTarget = true;
        }
      }
      attemptCount++;
    }

    setGrid(cells);
    setWrongGuesses(0);
    setHighlightedCells(new Set(targetIndices));
  };

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    generateGrid();
    
    // Show colors for memorization with progressive timing
    const memorizationTime = Math.max(2000 + round * 200, 1500);
    setTimeout(() => {
      setShowColors(false);
      setGamePhase('recall');
      setHighlightedCells(new Set());
    }, memorizationTime);
  };

  // Timer effect
  useEffect(() => {
    if (gameStarted && gamePhase === 'recall' && timeLeft > 0) {
      const timer = setTimeout(() => {
        if (!activePowerUps.has('timeFreeze')) {
          setTimeLeft(prev => prev - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'recall') {
      endGame();
    }
  }, [timeLeft, gameStarted, gamePhase, activePowerUps]);

  const handleCellClick = (cellId: number) => {
    if (gamePhase !== 'recall') return;

    const cell = grid.find(c => c.id === cellId);
    if (!cell || cell.isGuessed) return;

    setGrid(prev => prev.map(c => {
      if (c.id === cellId) {
        const isCorrect = c.isTarget;
        if (isCorrect) {
          setScore(prev => prev + (15 * (activePowerUps.has('doubleXP') ? 2 : 1)));
          audioManager.play('success');
        } else {
          if (!activePowerUps.has('shield')) {
            setWrongGuesses(prev => prev + 1);
          } else {
            // Use up shield
            setActivePowerUps(prev => {
              const newSet = new Set(prev);
              newSet.delete('shield');
              return newSet;
            });
          }
          audioManager.play('error');
        }
        return { ...c, isGuessed: true, isCorrect };
      }
      return c;
    }));

    // Check game state
    setTimeout(() => {
      const updatedGrid = grid.map(c => {
        if (c.id === cellId) {
          return { ...c, isGuessed: true, isCorrect: c.isTarget };
        }
        return c;
      });

      const allTargetsFound = updatedGrid.filter(c => c.isTarget).every(c => c.isGuessed && c.isCorrect);
      const wrongCount = updatedGrid.filter(c => c.isGuessed && !c.isTarget).length;

      if (allTargetsFound) {
        setScore(prev => prev + (25 * (activePowerUps.has('doubleXP') ? 2 : 1)));
        audioManager.play('complete');
        setTimeout(() => {
          setRound(prev => prev + 1);
          setShowColors(true);
          setGamePhase('memorize');
          setTimeLeft(30 + round * 2);
          generateGrid();
        }, 1500);
      } else if (wrongCount >= 3) {
        endGame();
      }
    }, 100);
  };

  const handlePowerUpUsed = (type: string) => {
    setActivePowerUps(prev => new Set([...prev, type]));
    
    if (type === 'timeFreeze') {
      setTimeout(() => {
        setActivePowerUps(prev => {
          const newSet = new Set(prev);
          newSet.delete('timeFreeze');
          return newSet;
        });
      }, 10000);
    } else if (type === 'accuracyBoost') {
      // Show one target briefly
      const targets = grid.filter(c => c.isTarget && !c.isGuessed);
      if (targets.length > 0) {
        const randomTarget = targets[Math.floor(Math.random() * targets.length)];
        setHighlightedCells(new Set([randomTarget.id]));
        setTimeout(() => setHighlightedCells(new Set()), 2000);
      }
      setActivePowerUps(prev => {
        const newSet = new Set(prev);
        newSet.delete('accuracyBoost');
        return newSet;
      });
    }
  };

  const endGame = () => {
    setGamePhase('result');
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const accuracy = Math.round((score / Math.max(round * 40, 1)) * 100);
    const xpEarned = Math.round(score / 2);

    setTimeout(() => {
      onComplete({
        gameId,
        score,
        accuracy,
        timeSpent,
        xpEarned
      });
    }, 2000);
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🎨 Color Memory</h3>
        <p className="mb-6 text-sm md:text-lg">Remember the highlighted colors and click them!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4 text-left">
            <p className="text-xs md:text-sm mb-2">• Watch highlighted cells carefully</p>
            <p className="text-xs md:text-sm mb-2">• Click the correct cells when they turn gray</p>
            <p className="text-xs md:text-sm mb-2">• Maximum 3 mistakes per round</p>
            <p className="text-xs md:text-sm">• Use power-ups for advantages</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 hover:scale-105 touch-target"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (gamePhase === 'result') {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4 animate-success-bounce">🎉 Great Memory!</h3>
        <div className="space-y-2 md:space-y-3 text-sm md:text-lg">
          <p>Round Reached: <span className="text-yellow-400 font-bold">{round}</span></p>
          <p>Final Score: <span className="text-green-400 font-bold">{score}</span> points</p>
          <p className="text-xs md:text-sm text-white/70">Keep practicing to improve your visual memory!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-2 md:p-4">
      <PowerUpBar onPowerUpUsed={handlePowerUpUsed} />
      
      <div className="flex flex-wrap justify-between mb-4 md:mb-6 text-sm md:text-lg gap-2">
        <div>Round: <span className="font-bold">{round}</span></div>
        <div>Score: <span className="font-bold text-yellow-400">{score}</span></div>
        <div>Time: <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>{timeLeft}s</span></div>
      </div>

      {gamePhase === 'memorize' && (
        <div className="mb-4 text-lg md:text-xl font-bold animate-pulse text-yellow-400">
          🧠 Memorize the glowing colors...
        </div>
      )}

      {gamePhase === 'recall' && (
        <div className="mb-4 text-lg md:text-xl font-bold text-green-400">
          🎯 Click the highlighted cells!
        </div>
      )}

      <div 
        className="grid gap-2 md:gap-3 mx-auto mb-4 md:mb-6 max-w-xs md:max-w-md"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          aspectRatio: '1'
        }}
      >
        {grid.map((cell) => {
          const isCurrentlyHighlighted = (gamePhase === 'memorize' && cell.isTarget) || 
                                        highlightedCells.has(cell.id);
          
          return (
            <button
              key={cell.id}
              onClick={() => handleCellClick(cell.id)}
              className={`aspect-square rounded-lg md:rounded-xl transition-all duration-300 border-2 flex items-center justify-center font-bold text-sm md:text-base touch-target ${
                isCurrentlyHighlighted
                  ? 'border-yellow-400 border-4 animate-pulse-glow shadow-lg shadow-yellow-400/50 scale-105' 
                  : cell.isGuessed
                    ? cell.isCorrect
                      ? 'border-green-400 border-4 shadow-lg shadow-green-400/50 scale-105'
                      : 'border-red-400 border-4 shadow-lg shadow-red-400/50'
                    : 'border-white/30 hover:border-white/60 hover:scale-105 active:scale-95'
              }`}
              style={{
                backgroundColor: showColors || cell.isGuessed || isCurrentlyHighlighted ? cell.color : '#4a5568',
                minHeight: '50px'
              }}
              disabled={gamePhase !== 'recall' || cell.isGuessed}
            >
              {cell.isGuessed && cell.isCorrect && <span className="text-white text-lg md:text-xl">✓</span>}
              {cell.isGuessed && !cell.isCorrect && <span className="text-white text-lg md:text-xl">✗</span>}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-white/70">
        <span>Mistakes: <span className={`font-bold ${wrongGuesses >= 2 ? 'text-red-400' : 'text-yellow-400'}`}>{wrongGuesses}/3</span></span>
        <span>Found: <span className="font-bold text-green-400">{grid.filter(cell => cell.isGuessed && cell.isCorrect).length}/{targetCount}</span></span>
        <span>Targets: <span className="font-bold text-blue-400">{targetCount}</span></span>
      </div>

      {activePowerUps.size > 0 && (
        <div className="mt-4 text-xs text-yellow-400">
          Active: {Array.from(activePowerUps).join(', ')}
        </div>
      )}
    </div>
  );
};
