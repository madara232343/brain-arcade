
import React, { useState, useEffect } from 'react';
import { Zap, Clock, Target, Shield } from 'lucide-react';
import { powerUpManager, PowerUp } from '@/utils/powerUpManager';

interface PowerUpBarProps {
  onPowerUpActivated?: (powerUpId: string, type: string) => void;
}

export const PowerUpBar: React.FC<PowerUpBarProps> = ({ onPowerUpActivated }) => {
  const [availablePowerUps, setAvailablePowerUps] = useState<PowerUp[]>([]);

  useEffect(() => {
    const unsubscribe = powerUpManager.subscribe((powerUps) => {
      setAvailablePowerUps(powerUps.filter(p => p.usesLeft > 0));
    });

    // Initial load
    setAvailablePowerUps(powerUpManager.getActivePowerUps().filter(p => p.usesLeft > 0));

    return unsubscribe;
  }, []);

  const handlePowerUpClick = (powerUp: PowerUp) => {
    if (powerUpManager.usePowerUp(powerUp.id)) {
      onPowerUpActivated?.(powerUp.id, powerUp.type);
    }
  };

  const getPowerUpIcon = (type: string) => {
    switch (type) {
      case 'doubleXP': return <Zap className="h-4 w-4" />;
      case 'timeFreeze': return <Clock className="h-4 w-4" />;
      case 'accuracyBoost': return <Target className="h-4 w-4" />;
      case 'shield': return <Shield className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  if (availablePowerUps.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-30 space-y-2">
      {availablePowerUps.map((powerUp) => (
        <button
          key={powerUp.id}
          onClick={() => handlePowerUpClick(powerUp)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white px-3 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
          title={`${powerUp.name} (${powerUp.usesLeft} uses left)`}
        >
          {getPowerUpIcon(powerUp.type)}
          <span className="text-sm font-medium">{powerUp.usesLeft}</span>
        </button>
      ))}
    </div>
  );
};
