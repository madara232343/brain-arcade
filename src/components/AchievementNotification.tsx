
import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
}

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({ 
  achievement, 
  onClose 
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (achievement) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-xl shadow-2xl max-w-sm animate-bounce">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">🎉 Achievement Unlocked!</h3>
            <p className="font-semibold">{achievement.title}</p>
            <p className="text-sm opacity-90">{achievement.description}</p>
            <div className="flex items-center mt-2 space-x-1">
              <Star className="h-4 w-4" />
              <span className="text-sm font-bold">+{achievement.reward} XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
