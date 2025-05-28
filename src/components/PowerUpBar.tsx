
import React, { useState, useEffect } from 'react';
import { Zap, Clock, Target, Shield } from 'lucide-react';
import { PowerUp, powerUpManager } from '@/utils/powerUpManager';

interface PowerUpBarProps {
  onPowerUpUsed: (type: string) => void;
}

export const PowerUpBar: React.FC<PowerUpBarProps> = ({ onPowerUpUsed }) => {
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);

  useEffect(() => {
    const unsubscribe = powerUpManager.subscribe(setPowerUps);
    setPowerUps(powerUpManager.getActivePowerUps());
    return unsubscribe;
  }, []);

  const handleUsePowerUp = (powerUpId: string, type: string) => {
    if (powerUpManager.usePowerUp(powerUpId)) {
      onPowerUpUsed(type);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'timeFreeze': return Clock;
      case 'doubleXP': return Zap;
      case 'accuracyBoost': return Target;
      case 'shield': return Shield;
      default: return Zap;
    }
  };

  if (powerUps.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
      <span className="text-white/70 text-sm font-medium mr-2">Power-ups:</span>
      {powerUps.map((powerUp) => {
        const IconComponent = getIcon(powerUp.type);
        return (
          <button
            key={powerUp.id}
            onClick={() => handleUsePowerUp(powerUp.id, powerUp.type)}
            className="flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <IconComponent className="h-4 w-4" />
            <span>{powerUp.name}</span>
            <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">
              {powerUp.usesLeft}
            </span>
          </button>
        );
      })}
    </div>
  );
};
