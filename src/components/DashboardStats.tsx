
import React from 'react';
import { Trophy, Zap, Target, Flame } from 'lucide-react';

interface UserProgress {
  totalScore: number;
  totalXP: number;
  level: number;
  gamesPlayed: string[];
  achievements: string[];
  rank: string;
  streak: number;
  purchasedItems: string[];
  activeTheme: string;
  activePowerUps: string[];
}

interface DashboardStatsProps {
  userProgress: UserProgress;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ userProgress }) => {
  const xpToNextLevel = (userProgress.level * 100) - userProgress.totalXP;
  const progressPercentage = ((userProgress.totalXP % 100) / 100) * 100;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-white">Level {userProgress.level}</div>
          <div className="text-sm text-white/70">Current Level</div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <Target className="h-6 w-6 text-green-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-white">{userProgress.gamesPlayed.length}</div>
          <div className="text-sm text-white/70">Games Played</div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <Flame className="h-6 w-6 text-orange-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-white">{userProgress.streak}</div>
          <div className="text-sm text-white/70">Day Streak</div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <Zap className="h-6 w-6 text-purple-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-white">{userProgress.totalScore}</div>
          <div className="text-sm text-white/70">Total Score</div>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm text-white/70 mb-1">
          <span>Progress to Level {userProgress.level + 1}</span>
          <span>{xpToNextLevel} XP needed</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
