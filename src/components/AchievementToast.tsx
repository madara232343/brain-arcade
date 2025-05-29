
import React, { useEffect } from 'react';
import { Trophy, X } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  requirement: number;
  currentProgress: number;
  unlocked: boolean;
  icon: string;
  category: 'games' | 'score' | 'streak' | 'time';
}

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-xl shadow-2xl animate-slide-in-right max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-yellow-200" />
          <span className="font-bold">Achievement Unlocked!</span>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div>
        <h3 className="font-bold text-lg">{achievement.title}</h3>
        <p className="text-sm opacity-90">{achievement.description}</p>
      </div>
    </div>
  );
};
