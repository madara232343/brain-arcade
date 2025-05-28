
import React, { useState } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { GameResult } from '@/pages/Index';
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
import { GameCompleteModal } from '@/components/GameCompleteModal';
import { audioManager } from '@/utils/audioUtils';

interface GameModalProps {
  game: any;
  onComplete: (result: GameResult) => void;
  onClose: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({ game, onComplete, onClose }) => {
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
    switch (game.id) {
      case 'memory-sequence':
        return <MemoryGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'color-memory':
        return <ColorMemoryGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'math-sprint':
        return <MathSprintGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'reaction-time':
        return <ReactionTimeGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'pattern-match':
        return <PatternMatchGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'speed-typing':
        return <SpeedTypingGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'visual-attention':
        return <VisualAttentionGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'word-association':
        return <WordAssociationGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'spatial-reasoning':
        return <SpatialReasoningGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'number-sequence':
        return <NumberSequenceGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'simon-says':
        return <SimonSaysGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'memory-cards':
        return <MemoryCardGame onComplete={handleGameComplete} gameId={game.id} />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-white text-lg mb-4">🚧 Game Coming Soon!</p>
            <p className="text-white/80 mb-6">This game will be available in the next update.</p>
            <button
              onClick={() => handleGameComplete({
                gameId: game.id,
                score: 100,
                accuracy: 100,
                timeSpent: 30,
                xpEarned: 25
              })}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
            >
              Demo Complete
            </button>
          </div>
        );
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
