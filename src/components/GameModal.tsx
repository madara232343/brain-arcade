
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GameResult } from '@/pages/Index';
import { MemoryGame } from '@/components/games/MemoryGame';
import { MathSprintGame } from '@/components/games/MathSprintGame';
import { ReactionTimeGame } from '@/components/games/ReactionTimeGame';
import { GameCompleteModal } from '@/components/GameCompleteModal';

interface GameModalProps {
  game: any;
  onComplete: (result: GameResult) => void;
  onClose: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({ game, onComplete, onClose }) => {
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleGameComplete = (result: GameResult) => {
    setGameResult(result);
  };

  const handleResultClose = () => {
    if (gameResult) {
      onComplete(gameResult);
    }
  };

  const renderGame = () => {
    switch (game.type) {
      case 'memory':
        return <MemoryGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'math':
        return <MathSprintGame onComplete={handleGameComplete} gameId={game.id} />;
      case 'speed':
        return <ReactionTimeGame onComplete={handleGameComplete} gameId={game.id} />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-white">This game type is not yet implemented.</p>
            <button
              onClick={() => handleGameComplete({
                gameId: game.id,
                score: 100,
                accuracy: 100,
                timeSpent: 60,
                xpEarned: 25
              })}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/20">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">{game.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>
        
        <div className="p-6">
          {renderGame()}
        </div>
      </div>
    </div>
  );
};
