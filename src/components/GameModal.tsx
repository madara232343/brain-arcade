import React, { useState } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { GameResult } from '@/pages/Games';
import { MemoryGame } from '@/components/games/MemoryGame';
import { MathSprintGame } from '@/components/games/MathSprintGame';
import { ReactionTimeGame } from '@/components/games/ReactionTimeGame';
import { ColorMemoryGame } from '@/components/games/ColorMemoryGame';
import { PatternMatchGame } from '@/components/games/PatternMatchGame';
import { SpeedTypingGame } from '@/components/games/SpeedTypingGame';
import { VisualAttentionGame } from '@/components/games/VisualAttentionGame';
import { WordAssociationGame } from '@/components/games/WordAssociationGame';
import { SpatialReasoningGame } from '@/components/games/SpatialReasoningGame';
import { NumberSequenceGame } from '@/components/games/NumberSequenceGame';
import { SimonSaysGame } from '@/components/games/SimonSaysGame';
import { MemoryCardGame } from '@/components/games/MemoryCardGame';
import { Simple3DGame } from '@/components/games/Simple3DGame';
import { GameCompleteModal } from '@/components/GameCompleteModal';
import { audioManager } from '@/utils/audioUtils';

interface GameModalProps {
  game: any;
  onComplete: (result: GameResult) => void;
  onClose: () => void;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

export const GameModal: React.FC<GameModalProps> = ({ 
  game, 
  onComplete, 
  onClose, 
  activePowerUps = new Set(), 
  onPowerUpUsed 
}) => {
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(!audioManager.isMuted());

  const handleGameComplete = (result: GameResult) => {
    audioManager.play('complete');
    setGameResult(result);
  };

  const handleResultClose = () => {
    if (gameResult) {
      onComplete(gameResult);
    }
  };

  const toggleSound = () => {
    const newState = audioManager.toggle();
    setSoundEnabled(newState);
    audioManager.play('click');
  };

  const renderGame = () => {
    const gameProps = {
      onComplete: handleGameComplete,
      gameId: game.id,
      activePowerUps,
      onPowerUpUsed
    };

    try {
      switch (game.id) {
        case 'memory-sequence':
          return <MemoryGame {...gameProps} />;
        case 'color-memory':
          return <ColorMemoryGame {...gameProps} />;
        case 'math-sprint':
          return <MathSprintGame {...gameProps} />;
        case 'reaction-time':
          return <ReactionTimeGame {...gameProps} />;
        case 'pattern-match':
          return <PatternMatchGame {...gameProps} />;
        case 'speed-typing':
          return <SpeedTypingGame {...gameProps} />;
        case 'visual-attention':
          return <VisualAttentionGame {...gameProps} />;
        case 'word-association':
          return <WordAssociationGame {...gameProps} />;
        case 'number-sequence':
          return <NumberSequenceGame {...gameProps} />;
        case 'simon-says':
          return <SimonSaysGame {...gameProps} />;
        case 'memory-cards':
          return <MemoryCardGame {...gameProps} />;
        case 'spatial-reasoning':
          return <SpatialReasoningGame {...gameProps} />;
        case 'puzzle-blocks':
          return <Simple3DGame {...gameProps} title="🧩 Puzzle Blocks" description="Arrange 3D blocks to solve puzzles" />;
        case 'shape-rotator':
          return <Simple3DGame {...gameProps} title="🔄 Shape Rotator" description="Rotate 3D shapes to match targets" />;
        case 'maze-runner':
          return <Simple3DGame {...gameProps} title="🏃 Maze Runner" description="Navigate through 3D mazes" />;
        case 'tower-builder':
          return <Simple3DGame {...gameProps} title="🏗️ Tower Builder" description="Stack 3D blocks to build towers" />;
        case 'cube-matcher':
          return <Simple3DGame {...gameProps} title="🎯 Cube Matcher" description="Match 3D cube patterns" />;
        case 'orbit-navigator':
          return <Simple3DGame {...gameProps} title="🌌 Orbit Navigator" description="Navigate objects in 3D space" />;
        default:
          return <GenericDemoGame {...gameProps} game={game} />;
      }
    } catch (error) {
      console.error('Error rendering game:', error);
      return <GenericDemoGame {...gameProps} game={game} />;
    }
  };

  if (gameResult) {
    return (
      <GameCompleteModal
        result={gameResult}
        game={game}
        onClose={handleResultClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl md:rounded-3xl w-full max-w-6xl max-h-[98vh] md:max-h-[95vh] overflow-hidden border border-white/30 shadow-2xl animate-scale-in modal-content">
        <div className="flex items-center justify-between p-3 md:p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="p-1.5 md:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <game.icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-white">{game.title}</h2>
              <p className="text-white/70 text-xs md:text-sm hidden md:block">{game.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3">
            <button
              onClick={toggleSound}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-target"
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 md:h-5 md:w-5 text-white" />
              ) : (
                <VolumeX className="h-4 w-4 md:h-5 md:w-5 text-white/50" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-target"
            >
              <X className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </button>
          </div>
        </div>
        
        <div className="p-2 md:p-6 overflow-y-auto max-h-[calc(98vh-80px)] md:max-h-[calc(95vh-120px)]">
          {renderGame()}
        </div>
      </div>
    </div>
  );
};

// Generic Demo Game Component for fallback
const GenericDemoGame: React.FC<{
  onComplete: (result: GameResult) => void;
  gameId: string;
  game: any;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}> = ({ onComplete, gameId, game }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStart = () => {
    setGameStarted(true);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete({
            gameId,
            score,
            accuracy: 85 + Math.random() * 15,
            timeSpent: 30,
            xpEarned: Math.max(25, Math.floor(score / 4))
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClick = () => {
    if (gameStarted && timeLeft > 0) {
      setScore(prev => prev + 10);
    }
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">{game.title}</h3>
        <p className="mb-6 text-sm md:text-lg">{game.description}</p>
        <button
          onClick={handleStart}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 hover:scale-105"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-4">
        <div className="text-lg md:text-xl mb-2">Time: {timeLeft}s</div>
        <div className="text-lg md:text-xl mb-4">Score: {score}</div>
      </div>
      <div className="bg-white/10 rounded-xl p-8 mb-4">
        <button
          onClick={handleClick}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Click Me! 🎯
        </button>
      </div>
      <p className="text-white/70">Click the button as many times as you can!</p>
    </div>
  );
};
