
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface PuzzleBlocksGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface Block {
  id: number;
  x: number;
  y: number;
  color: string;
  isFixed: boolean;
}

export const PuzzleBlocksGame: React.FC<PuzzleBlocksGameProps> = ({ 
  onComplete, 
  gameId, 
  activePowerUps = new Set(),
  onPowerUpUsed 
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [targetPattern, setTargetPattern] = useState<Block[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(90);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [movesLeft, setMovesLeft] = useState(15);

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];

  const generatePuzzle = () => {
    const gridSize = 4;
    const newBlocks: Block[] = [];
    const newTarget: Block[] = [];
    
    // Generate target pattern
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if ((i + j) % 2 === 0) {
          newTarget.push({
            id: i * gridSize + j,
            x: j,
            y: i,
            color: colors[Math.floor(Math.random() * colors.length)],
            isFixed: false
          });
        }
      }
    }
    
    // Generate scrambled blocks
    const scrambledColors = [...newTarget.map(b => b.color)].sort(() => Math.random() - 0.5);
    let colorIndex = 0;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if ((i + j) % 2 === 0) {
          newBlocks.push({
            id: i * gridSize + j,
            x: j,
            y: i,
            color: scrambledColors[colorIndex],
            isFixed: false
          });
          colorIndex++;
        }
      }
    }
    
    setBlocks(newBlocks);
    setTargetPattern(newTarget);
  };

  const startGame = () => {
    setGameStarted(true);
    generatePuzzle();
    
    // Apply time freeze power-up
    if (activePowerUps.has('timeFreeze')) {
      setTimeLeft(prev => prev + 30);
      onPowerUpUsed?.('timeFreeze');
    }
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && movesLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || movesLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted, movesLeft]);

  const handleBlockClick = (blockId: number) => {
    if (selectedBlock === null) {
      setSelectedBlock(blockId);
    } else if (selectedBlock === blockId) {
      setSelectedBlock(null);
    } else {
      // Swap blocks
      const newBlocks = [...blocks];
      const block1Index = newBlocks.findIndex(b => b.id === selectedBlock);
      const block2Index = newBlocks.findIndex(b => b.id === blockId);
      
      if (block1Index !== -1 && block2Index !== -1) {
        const tempColor = newBlocks[block1Index].color;
        newBlocks[block1Index].color = newBlocks[block2Index].color;
        newBlocks[block2Index].color = tempColor;
        
        setBlocks(newBlocks);
        setMovesLeft(prev => prev - 1);
        setSelectedBlock(null);
        
        checkSolution(newBlocks);
      }
    }
  };

  const checkSolution = (currentBlocks: Block[]) => {
    const isCorrect = currentBlocks.every(block => {
      const targetBlock = targetPattern.find(t => t.id === block.id);
      return targetBlock && targetBlock.color === block.color;
    });
    
    if (isCorrect) {
      const levelBonus = level * 200;
      const timeBonus = timeLeft * 10;
      const moveBonus = movesLeft * 20;
      const totalScore = levelBonus + timeBonus + moveBonus;
      
      let finalScore = score + totalScore;
      
      // Apply double XP power-up
      if (activePowerUps.has('doubleXP')) {
        finalScore *= 2;
        onPowerUpUsed?.('doubleXP');
      }
      
      setScore(finalScore);
      setLevel(prev => prev + 1);
      setMovesLeft(15);
      generatePuzzle();
    }
  };

  const endGame = () => {
    const accuracy = Math.round((score / (level * 200)) * 100);
    onComplete({
      gameId,
      score,
      accuracy: Math.min(accuracy, 100),
      timeSpent: 90 - timeLeft,
      xpEarned: Math.round(score / 4)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🧩 Puzzle Blocks</h3>
        <p className="mb-6 text-sm md:text-base">Arrange blocks to match the target pattern!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Click two blocks to swap their colors</p>
            <p className="text-xs md:text-sm mb-2">• Match the target pattern shown above</p>
            <p className="text-xs md:text-sm">• Complete with minimum moves for bonus points</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Puzzle
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-4">
        <div className="flex justify-between text-base md:text-lg mb-4">
          <span>Time: {timeLeft}s</span>
          <span>Level: {level}</span>
          <span>Score: {score}</span>
          <span>Moves: {movesLeft}</span>
        </div>
      </div>

      {/* Target Pattern */}
      <div className="mb-6">
        <h4 className="text-sm md:text-base font-bold mb-2 text-yellow-400">Target Pattern:</h4>
        <div className="grid grid-cols-4 gap-1 max-w-xs mx-auto mb-4 bg-white/10 p-3 rounded-lg">
          {Array.from({ length: 16 }).map((_, index) => {
            const targetBlock = targetPattern.find(b => b.id === index);
            return (
              <div
                key={index}
                className={`w-8 h-8 md:w-12 md:h-12 rounded border-2 border-white/30 ${
                  targetBlock ? '' : 'bg-gray-800'
                }`}
                style={{ backgroundColor: targetBlock?.color || '#374151' }}
              />
            );
          })}
        </div>
      </div>

      {/* Current Puzzle */}
      <div className="mb-6">
        <h4 className="text-sm md:text-base font-bold mb-2 text-blue-400">Current Puzzle:</h4>
        <div className="grid grid-cols-4 gap-1 max-w-xs mx-auto">
          {Array.from({ length: 16 }).map((_, index) => {
            const block = blocks.find(b => b.id === index);
            const isSelected = selectedBlock === index;
            
            return (
              <button
                key={index}
                onClick={() => block && handleBlockClick(index)}
                className={`w-8 h-8 md:w-12 md:h-12 rounded border-2 transition-all duration-200 ${
                  block 
                    ? isSelected 
                      ? 'border-yellow-400 scale-110 shadow-lg' 
                      : 'border-white/30 hover:border-white/60 hover:scale-105'
                    : 'bg-gray-800 border-gray-600 cursor-not-allowed'
                }`}
                style={{ backgroundColor: block?.color || '#374151' }}
                disabled={!block}
              />
            );
          })}
        </div>
      </div>
      
      <button
        onClick={endGame}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200"
      >
        End Game
      </button>
    </div>
  );
};
