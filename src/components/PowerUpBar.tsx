
import React from 'react';
import { Zap, Shield, Clock, Star } from 'lucide-react';

interface PowerUpBarProps {
  onPowerUpUsed: (type: string) => void;
}

export const PowerUpBar: React.FC<PowerUpBarProps> = ({ onPowerUpUsed }) => {
  const powerUps = [
    { id: 'doubleXP', icon: Star, name: 'Double XP', color: 'bg-yellow-500' },
    { id: 'timeFreeze', icon: Clock, name: 'Time Freeze', color: 'bg-blue-500' },
    { id: 'accuracyBoost', icon: Zap, name: 'Accuracy Boost', color: 'bg-green-500' },
    { id: 'shield', icon: Shield, name: 'Error Shield', color: 'bg-purple-500' }
  ];

  return (
    <div className="flex justify-center space-x-2 mb-4">
      {powerUps.map((powerUp) => {
        const IconComponent = powerUp.icon;
        return (
          <button
            key={powerUp.id}
            onClick={() => onPowerUpUsed(powerUp.id)}
            className={`${powerUp.color} hover:opacity-80 text-white p-2 rounded-lg transition-all duration-200 hover:scale-110`}
            title={powerUp.name}
          >
            <IconComponent className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
};
