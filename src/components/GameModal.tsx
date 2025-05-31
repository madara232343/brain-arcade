
import React, { useState } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { GameResult } from '@/types/game';
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
import { PuzzleBlocksGame } from '@/components/games/PuzzleBlocksGame';
import { ShapeRotatorGame } from '@/components/games/ShapeRotatorGame';
import { MazeRunnerGame } from '@/components/games/MazeRunnerGame';
import { Enhanced3DTowerBuilder } from '@/components/games/Enhanced3DTowerBuilder';
import { CubeMatcherGame } from '@/components/games/CubeMatcherGame';
import { OrbitNavigatorGame } from '@/components/games/OrbitNavigatorGame';
import { EnhancedIQTest } from '@/components/games/EnhancedIQTest';
import { EQTest } from '@/components/games/EQTest';
import { TicTacToeGame } from '@/components/games/TicTacToeGame';
import { RockPaperScissorsGame } from '@/components/games/RockPaperScissorsGame';
import { SnakeGame } from '@/components/games/SnakeGame';
import { BrainTeaserGame } from '@/components/games/BrainTeaserGame';
import { LogicPuzzleGame } from '@/components/games/LogicPuzzleGame';
import { WordChainGame } from '@/components/games/WordChainGame';
import { QuickMathGame } from '@/components/games/QuickMathGame';
import { GameCompleteModal } from '@/components/GameCompleteModal';
import { audioManager } from '@/utils/audioUtils';
import { useSounds } from '@/components/SoundManager';

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
  const { playSound } = useSounds();

  const handleGameComplete = (result: GameResult) => {
    playSound('success');
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
    playSound('click');
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
        // Memory Games
        case 'memory-sequence':
          return <MemoryGame {...gameProps} />;
        case 'color-memory':
          return <ColorMemoryGame {...gameProps} />;
        case 'simon-says':
          return <SimonSaysGame {...gameProps} />;
        case 'memory-cards':
          return <MemoryCardGame {...gameProps} />;
        
        // Math Games
        case 'math-sprint':
          return <MathSprintGame {...gameProps} />;
        case 'quick-math':
          return <QuickMathGame {...gameProps} />;
        
        // Puzzle Games
        case 'puzzle-blocks':
          return <PuzzleBlocksGame {...gameProps} />;
        case 'spatial-reasoning':
          return <SpatialReasoningGame {...gameProps} />;
        case 'shape-rotator':
          return <ShapeRotatorGame {...gameProps} />;
        case 'pattern-match':
          return <PatternMatchGame {...gameProps} />;
        case 'brain-teaser':
          return <BrainTeaserGame {...gameProps} />;
        case 'logic-puzzle':
          return <LogicPuzzleGame {...gameProps} />;
        
        // Word Games
        case 'word-association':
          return <WordAssociationGame {...gameProps} />;
        case 'word-chain':
          return <WordChainGame {...gameProps} />;
        case 'speed-typing':
          return <SpeedTypingGame {...gameProps} />;
        
        // Speed Games
        case 'reaction-time':
          return <ReactionTimeGame {...gameProps} />;
        case 'visual-attention':
          return <VisualAttentionGame {...gameProps} />;
        case 'number-sequence':
          return <NumberSequenceGame {...gameProps} />;
        
        // 3D Games
        case 'maze-runner':
          return <MazeRunnerGame {...gameProps} />;
        case 'tower-builder':
          return <Enhanced3DTowerBuilder {...gameProps} />;
        case 'cube-matcher':
          return <CubeMatcherGame {...gameProps} />;
        case 'orbit-navigator':
          return <OrbitNavigatorGame {...gameProps} />;
        
        // Strategy Games
        case 'tic-tac-toe':
          return <TicTacToeGame {...gameProps} />;
        case 'rock-paper-scissors':
          return <RockPaperScissorsGame {...gameProps} />;
        
        // Arcade Games
        case 'snake-game':
          return <SnakeGame {...gameProps} />;
        
        // Intelligence Tests
        case 'enhanced-iq-test':
        case 'iq-test':
          return <EnhancedIQTest {...gameProps} />;
        case 'eq-test':
          return <EQTest {...gameProps} />;
        
        default:
          return <GenericGame {...gameProps} game={game} />;
      }
    } catch (error) {
      console.error('Error rendering game:', error);
      return <GenericGame {...gameProps} game={game} />;
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
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-lg rounded-xl md:rounded-3xl w-full max-w-6xl max-h-[98vh] md:max-h-[95vh] overflow-hidden border border-white/30 shadow-2xl animate-scale-in">
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

// Enhanced Generic Game Component with unique mechanics
const GenericGame: React.FC<{
  onComplete: (result: GameResult) => void;
  gameId: string;
  game: any;
}> = ({ onComplete, gameId, game }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [targets, setTargets] = useState<{x: number, y: number, id: number}[]>([]);
  const [nextId, setNextId] = useState(1);

  const generateTarget = () => {
    const newTarget = {
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      id: nextId
    };
    setTargets(prev => [...prev, newTarget]);
    setNextId(prev => prev + 1);

    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== newTarget.id));
    }, 2000);
  };

  const handleStart = () => {
    setGameStarted(true);
    const targetInterval = setInterval(generateTarget, 1500);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(targetInterval);
          const accuracy = Math.min(100, Math.round((score / 60) * 100));
          onComplete({
            gameId,
            score,
            accuracy,
            timeSpent: 60,
            xpEarned: Math.max(25, Math.floor(score / 4))
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTargetClick = (targetId: number) => {
    setScore(prev => prev + 25);
    setTargets(prev => prev.filter(t => t.id !== targetId));
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <div className="mb-6">
          <game.icon className="h-16 w-16 mx-auto mb-4 text-blue-400" />
          <h3 className="text-xl md:text-2xl font-bold mb-4">{game.title}</h3>
          <p className="mb-6 text-sm md:text-lg text-white/80">{game.description}</p>
        </div>
        <button
          onClick={handleStart}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 hover:scale-105"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="text-lg md:text-xl mb-2">Time: {timeLeft}s</div>
        <div className="text-lg md:text-xl mb-2">Score: {score}</div>
        <div className="text-sm md:text-lg mb-4 text-white/70">Click the targets!</div>
      </div>
      
      <div className="relative bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl h-64 md:h-96 mb-6 border border-white/20 overflow-hidden">
        {targets.map(target => (
          <button
            key={target.id}
            onClick={() => handleTargetClick(target.id)}
            className="absolute w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg hover:scale-110 transition-all duration-200 animate-pulse"
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            🎯
          </button>
        ))}
        
        {targets.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-white/50">
            <span className="text-lg">Wait for targets...</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 bg-white/10 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((60 - timeLeft) / 60) * 100}%` }}
        />
      </div>
    </div>
  );
};
