
import React from 'react';
import { Calendar, Play, Flame } from 'lucide-react';
import { UserProgress } from '@/pages/Index';

interface DailyChallengeProps {
  userProgress: UserProgress;
  onPlayGame: (game: any) => void;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ userProgress, onPlayGame }) => {
  const today = new Date().toDateString();
  const hasPlayedToday = userProgress.lastPlayDate === today;

  const dailyGame = {
    id: 'daily-challenge',
    title: 'Daily Challenge',
    description: 'Test your memory with this sequence challenge',
    type: 'memory',
    difficulty: 'medium',
    isDailyChallenge: true
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Daily Challenge</h2>
          </div>
          <div className="flex items-center space-x-1">
            <Flame className="h-5 w-5" />
            <span className="font-bold">{userProgress.streak} day streak</span>
          </div>
        </div>

        <p className="text-lg mb-4 opacity-90">
          Keep your streak alive! Complete today's challenge to earn bonus XP.
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-lg px-3 py-1">
              <span className="text-sm font-medium">Medium</span>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-1">
              <span className="text-sm font-medium">+50 XP</span>
            </div>
          </div>
          
          <button
            onClick={() => onPlayGame(dailyGame)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
              hasPlayedToday
                ? 'bg-white/20 text-white/70 cursor-not-allowed'
                : 'bg-white text-orange-500 hover:bg-orange-50 hover:scale-105'
            }`}
            disabled={hasPlayedToday}
          >
            <Play className="h-5 w-5" />
            <span>{hasPlayedToday ? 'Completed!' : 'Play Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
