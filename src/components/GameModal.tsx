
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
    switch (game.type) {
      case 'memory':
        if (game.id === 'color-memory') {
          return <ColorMemoryGame onComplete={handleGameComplete} gameId={game.id} />;
        }
        return <MemoryGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'math':
        return <MathSprintGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'speed':
        return <ReactionTimeGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'pattern':
        return <PatternMatchGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'typing':
        return <SpeedTypingGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'attention':
        return <VisualAttentionGame onComplete={handleGameComplete} gameId={game.id} />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-white text-lg mb-4">🚧 Coming Soon!</p>
            <p className="text-white/80 mb-6">This game type is still in development.</p>
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
              Complete Demo
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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-white/30 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <game.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{game.title}</h2>
              <p className="text-white/70 text-sm">{game.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSound}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? (
                <Volume2 className="h-5 w-5 text-white" />
              ) : (
                <VolumeX className="h-5 w-5 text-white/50" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {renderGame()}
        </div>
      </div>
    </div>
  );
};
