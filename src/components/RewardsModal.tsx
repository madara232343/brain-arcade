
import React, { useState } from 'react';
import { X, Gift, Star, Trophy, Target, Clock, Zap } from 'lucide-react';
import { UserProgress } from '@/pages/Index';

interface Reward {
  id: string;
  title: string;
  description: string;
  requirement: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
  completed: boolean;
  type: 'daily' | 'weekly' | 'achievement';
  icon: React.ComponentType<any>;
}

interface RewardsModalProps {
  userProgress: UserProgress;
  onClose: () => void;
  onClaimReward: (rewardId: string) => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({ userProgress, onClose, onClaimReward }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'achievement'>('daily');

  const rewards: Reward[] = [
    // Daily Rewards
    {
      id: 'daily-games-5',
      title: 'Daily Player',
      description: 'Play 5 games today',
      requirement: 'Play 5 games',
      progress: Math.min(userProgress.gamesPlayed % 5, 5),
      maxProgress: 5,
      xpReward: 50,
      completed: (userProgress.gamesPlayed % 5) >= 5,
      type: 'daily',
      icon: Zap
    },
    {
      id: 'daily-score-500',
      title: 'Score Master',
      description: 'Earn 500 points today',
      requirement: 'Earn 500 points',
      progress: Math.min(userProgress.totalScore % 500, 500),
      maxProgress: 500,
      xpReward: 75,
      completed: (userProgress.totalScore % 500) >= 500,
      type: 'daily',
      icon: Target
    },
    {
      id: 'daily-perfect-game',
      title: 'Perfect Performance',
      description: 'Complete a game with 100% accuracy',
      requirement: '100% accuracy in any game',
      progress: 0,
      maxProgress: 1,
      xpReward: 100,
      completed: false,
      type: 'daily',
      icon: Star
    },
    // Weekly Rewards
    {
      id: 'weekly-streak-7',
      title: 'Consistency Champion',
      description: 'Maintain a 7-day streak',
      requirement: 'Play for 7 consecutive days',
      progress: Math.min(userProgress.streak, 7),
      maxProgress: 7,
      xpReward: 200,
      completed: userProgress.streak >= 7,
      type: 'weekly',
      icon: Trophy
    },
    {
      id: 'weekly-games-50',
      title: 'Weekly Warrior',
      description: 'Play 50 games this week',
      requirement: 'Play 50 games',
      progress: Math.min(userProgress.gamesPlayed, 50),
      maxProgress: 50,
      xpReward: 300,
      completed: userProgress.gamesPlayed >= 50,
      type: 'weekly',
      icon: Clock
    },
    // Achievements
    {
      id: 'achievement-level-10',
      title: 'Brain Master',
      description: 'Reach level 10',
      requirement: 'Reach level 10',
      progress: Math.min(userProgress.level, 10),
      maxProgress: 10,
      xpReward: 500,
      completed: userProgress.level >= 10,
      type: 'achievement',
      icon: Trophy
    },
    {
      id: 'achievement-games-100',
      title: 'Dedicated Player',
      description: 'Play 100 games total',
      requirement: 'Play 100 games',
      progress: Math.min(userProgress.gamesPlayed, 100),
      maxProgress: 100,
      xpReward: 1000,
      completed: userProgress.gamesPlayed >= 100,
      type: 'achievement',
      icon: Gift
    }
  ];

  const filteredRewards = rewards.filter(reward => reward.type === activeTab);

  const getProgressPercentage = (reward: Reward) => {
    return Math.min((reward.progress / reward.maxProgress) * 100, 100);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-white/30 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center space-x-3">
            <Gift className="h-6 w-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Rewards & Achievements</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-white/10 rounded-xl p-1">
            {(['daily', 'weekly', 'achievement'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white text-indigo-900'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Rewards List */}
          <div className="grid gap-4">
            {filteredRewards.map((reward) => {
              const IconComponent = reward.icon;
              const progressPercentage = getProgressPercentage(reward);

              return (
                <div
                  key={reward.id}
                  className={`bg-white/10 rounded-xl p-6 border transition-all ${
                    reward.completed
                      ? 'border-green-400/50 bg-green-400/10'
                      : 'border-white/20 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl ${
                        reward.completed ? 'bg-green-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'
                      }`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{reward.title}</h3>
                        <p className="text-white/70">{reward.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">+{reward.xpReward} XP</div>
                      {reward.completed && (
                        <button
                          onClick={() => onClaimReward(reward.id)}
                          className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-all"
                        >
                          Claim
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-white/70 mb-1">
                      <span>{reward.requirement}</span>
                      <span>{reward.progress}/{reward.maxProgress}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          reward.completed ? 'bg-green-500' : 'bg-gradient-to-r from-blue-400 to-purple-500'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
