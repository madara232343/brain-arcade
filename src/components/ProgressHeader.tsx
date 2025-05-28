
import React from 'react';
import { Trophy, Zap, Target, Flame } from 'lucide-react';
import { UserProgress } from '@/pages/Index';

interface ProgressHeaderProps {
  userProgress: UserProgress;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({ userProgress }) => {
  const xpToNextLevel = (userProgress.level * 100) - userProgress.xp;
  const progressPercentage = ((userProgress.xp % 100) / 100) * 100;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-white">Brain Arcade</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-yellow-300">
            <Flame className="h-5 w-5" />
            <span className="font-bold">{userProgress.streak}</span>
          </div>
          <div className="flex items-center space-x-1 text-blue-300">
            <Zap className="h-5 w-5" />
            <span className="font-bold">{userProgress.xp} XP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-white">Level {userProgress.level}</div>
          <div className="text-sm text-white/70">Current Level</div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <Target className="h-6 w-6 text-green-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-white">{userProgress.gamesPlayed}</div>
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
