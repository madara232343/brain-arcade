
import React from 'react';
import { X, Trophy, Star, Award, Crown, Medal } from 'lucide-react';
import { UserProgress } from '@/pages/Games';

interface ProfileModalProps {
  userProgress: UserProgress;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ userProgress, onClose }) => {
  const getRankInfo = (rank: number) => {
    switch (rank) {
      case 1: return { name: 'Diamond', icon: Crown, color: 'from-blue-400 to-cyan-400', bgColor: 'bg-blue-500/20' };
      case 2: return { name: 'Platinum', icon: Medal, color: 'from-gray-300 to-gray-400', bgColor: 'bg-gray-500/20' };
      case 3: return { name: 'Gold', icon: Award, color: 'from-yellow-400 to-yellow-500', bgColor: 'bg-yellow-500/20' };
      case 4: return { name: 'Silver', icon: Medal, color: 'from-gray-400 to-gray-500', bgColor: 'bg-gray-400/20' };
      default: return { name: 'Bronze', icon: Trophy, color: 'from-orange-400 to-orange-500', bgColor: 'bg-orange-500/20' };
    }
  };

  const getAvatarDisplay = () => {
    switch (userProgress.avatar) {
      case 'robot-avatar':
        return '🤖';
      case 'wizard-avatar':
        return '🧙‍♂️';
      case 'scientist-avatar':
        return '👨‍🔬';
      default:
        return '👤';
    }
  };

  const rankInfo = getRankInfo(userProgress.rank);
  const RankIcon = rankInfo.icon;

  const nextRankScore = () => {
    switch (userProgress.rank) {
      case 5: return 5000;
      case 4: return 10000;
      case 3: return 25000;
      case 2: return 50000;
      default: return userProgress.totalScore;
    }
  };

  const progressToNextRank = userProgress.rank === 1 
    ? 100 
    : Math.min((userProgress.totalScore / nextRankScore()) * 100, 100);

  const stats = [
    { label: 'Level', value: userProgress.level, icon: Star },
    { label: 'Total XP', value: userProgress.xp.toLocaleString(), icon: Star },
    { label: 'Games Played', value: userProgress.gamesPlayed, icon: Trophy },
    { label: 'Total Score', value: userProgress.totalScore.toLocaleString(), icon: Award },
    { label: 'Current Streak', value: `${userProgress.streak} days`, icon: Star },
    { label: 'Achievements', value: userProgress.achievements.length, icon: Medal },
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-white/30 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">{getAvatarDisplay()}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">Player Profile</h2>
              <p className="text-white/70">Level {userProgress.level} Brain Trainer</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {/* Rank Section */}
          <div className={`${rankInfo.bgColor} rounded-2xl p-6 mb-6 border border-white/20`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${rankInfo.color}`}>
                  <RankIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{rankInfo.name} Rank</h3>
                  <p className="text-white/70">Current ranking based on total score</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{userProgress.totalScore.toLocaleString()}</div>
                <div className="text-white/70">Total Points</div>
              </div>
            </div>
            
            {userProgress.rank > 1 && (
              <div>
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Progress to next rank</span>
                  <span>{Math.round(progressToNextRank)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full bg-gradient-to-r ${rankInfo.color} transition-all duration-500`}
                    style={{ width: `${progressToNextRank}%` }}
                  />
                </div>
                <div className="text-center text-white/70 text-sm mt-2">
                  {nextRankScore() - userProgress.totalScore} points to next rank
                </div>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-6 w-6 text-blue-400" />
                    <div>
                      <div className="text-white/70 text-sm">{stat.label}</div>
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Achievements */}
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Award className="h-6 w-6 mr-2 text-yellow-400" />
              Recent Achievements
            </h3>
            {userProgress.achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userProgress.achievements.slice(-6).map((achievement, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-3 border border-white/20">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                      <span className="text-white font-medium">{achievement}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/70">No achievements yet. Keep playing to unlock them!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
