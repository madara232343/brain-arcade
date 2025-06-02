
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GameResult } from '@/types/game';
import { PowerUpBar } from './PowerUpBar';
import { ReactionTimeGame } from './games/ReactionTimeGame';
import { SpatialReasoningGame } from './games/SpatialReasoningGame';
import { EnhancedIQTest } from './games/EnhancedIQTest';
import { EQTest } from './games/EQTest';
import { SpaceRacerGame } from './games/SpaceRacerGame';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: string;
}

interface GameModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onGameComplete: (result: GameResult) => void;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

export const GameModal: React.FC<GameModalProps> = ({ 
  game, 
  isOpen, 
  onClose, 
  onGameComplete,
  activePowerUps = new Set(),
  onPowerUpUsed
}) => {
  const [internalActivePowerUps, setInternalActivePowerUps] = useState<Set<string>>(new Set());

  const handlePowerUpActivated = (powerUpId: string, type: string) => {
    setInternalActivePowerUps(prev => new Set([...prev, type]));
    onPowerUpUsed?.(type);
  };

  const handleGameComplete = (result: GameResult) => {
    // Clear active power-ups when game completes
    setInternalActivePowerUps(new Set());
    onGameComplete(result);
  };

  const handlePowerUpUsedInGame = (type: string) => {
    setInternalActivePowerUps(prev => {
      const newSet = new Set(prev);
      newSet.delete(type);
      return newSet;
    });
  };

  const renderGameComponent = () => {
    if (!game) return null;

    const combinedActivePowerUps = new Set([...activePowerUps, ...internalActivePowerUps]);

    const commonProps = {
      onComplete: handleGameComplete,
      gameId: game.id,
      activePowerUps: combinedActivePowerUps,
      onPowerUpUsed: handlePowerUpUsedInGame
    };

    switch (game.component) {
      case 'ReactionTimeGame':
        return <ReactionTimeGame {...commonProps} />;
      case 'SpatialReasoningGame':
        return <SpatialReasoningGame {...commonProps} />;
      case 'EnhancedIQTest':
        return <EnhancedIQTest {...commonProps} />;
      case 'EQTest':
        return <EQTest {...commonProps} />;
      case 'SpaceRacerGame':
        return <SpaceRacerGame {...commonProps} />;
      default:
        return <p>Game component not found.</p>;
    }
  };

  if (!isOpen || !game) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40 flex items-center justify-center p-2 md:p-4">
      <PowerUpBar onPowerUpActivated={handlePowerUpActivated} />
      
      <div className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl md:rounded-3xl max-w-4xl w-full max-h-[98vh] md:max-h-[95vh] overflow-hidden border border-white/30 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center space-x-3">
            <span className="text-2xl md:text-3xl">{game.icon}</span>
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-white">{game.title}</h2>
              <p className="text-white/70 text-sm md:text-base">{game.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-target">
            <X className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </button>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(98vh-120px)] md:max-h-[calc(95vh-120px)]">
          {renderGameComponent()}
        </div>
      </div>
    </div>
  );
};
