
import React, { useState } from 'react';
import { X, Trophy, Star, Award, Crown, Medal, Clock, Target, Gamepad2, Package, Camera, Edit2, Save } from 'lucide-react';
import { calculateAccurateStats, formatPlayTime, getNextRankRequirement, getRank } from '@/utils/profileUtils';

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
  xp: number;
  lastPlayDate: string;
  playedGames: string[];
  ownedItems: string[];
  totalPlayTime: number;
  theme: string;
  avatar: string;
  profilePhoto?: string;
  playerName?: string;
}

interface ProfileModalProps {
  userProgress: UserProgress;
  onClose: () => void;
  onUpdateProfile: (updates: Partial<UserProgress>) => void;
  gameStats?: any[];
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ 
  userProgress, 
  onClose,
  onUpdateProfile,
  gameStats = []
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [playerName, setPlayerName] = useState(userProgress.playerName || 'Player');
  const [profilePhoto, setProfilePhoto] = useState(userProgress.profilePhoto || '');

  const stats = calculateAccurateStats(userProgress);
  const currentRank = getRank(userProgress.totalScore); // Real-time rank calculation
  const nextRank = getNextRankRequirement(userProgress.totalScore);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        setProfilePhoto(photoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    onUpdateProfile({
      playerName,
      profilePhoto,
      rank: currentRank // Update rank in real-time
    });
    setIsEditing(false);
  };

  const getRankInfo = (rank: string) => {
    const rankMap: { [key: string]: any } = {
      'Ace': { name: 'Ace', icon: Crown, color: 'from-purple-400 to-pink-400', bgColor: 'bg-purple-500/20', emoji: '🚀' },
      'Crown': { name: 'Crown', icon: Crown, color: 'from-yellow-400 to-orange-400', bgColor: 'bg-yellow-500/20', emoji: '👑' },
      'Diamond': { name: 'Diamond', icon: Crown, color: 'from-blue-400 to-cyan-400', bgColor: 'bg-blue-500/20', emoji: '💎' },
      'Platinum': { name: 'Platinum', icon: Medal, color: 'from-gray-300 to-gray-400', bgColor: 'bg-gray-500/20', emoji: '🥈' },
      'Gold': { name: 'Gold', icon: Award, color: 'from-yellow-400 to-yellow-500', bgColor: 'bg-yellow-500/20', emoji: '🥇' },
      'Silver': { name: 'Silver', icon: Medal, color: 'from-gray-400 to-gray-500', bgColor: 'bg-gray-400/20', emoji: '🥈' },
      'Bronze': { name: 'Bronze', icon: Trophy, color: 'from-orange-400 to-orange-500', bgColor: 'bg-orange-500/20', emoji: '🥉' }
    };
    return rankMap[rank] || rankMap['Bronze'];
  };

  const getAvatarDisplay = () => {
    if (profilePhoto) {
      return (
        <img 
          src={profilePhoto} 
          alt="Profile" 
          className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-white/30"
        />
      );
    }

    const avatarMap: { [key: string]: string } = {
      'robot-avatar': '🤖',
      'wizard-avatar': '🧙‍♂️',
      'scientist-avatar': '👨‍🔬',
      'default': '👤'
    };
    
    const currentAvatar = userProgress.avatar || 'default';
    const ownedItems = userProgress.purchasedItems || [];
    
    if (currentAvatar !== 'default' && !ownedItems.includes(currentAvatar)) {
      return <div className="text-3xl md:text-4xl">{avatarMap['default']}</div>;
    }
    
    return <div className="text-3xl md:text-4xl">{avatarMap[currentAvatar] || avatarMap['default']}</div>;
  };

  const rankInfo = getRankInfo(currentRank);
  const RankIcon = rankInfo.icon;

  const progressToNextRank = nextRank.pointsNeeded > 0 
    ? Math.min((userProgress.totalScore / (userProgress.totalScore + nextRank.pointsNeeded)) * 100, 100)
    : 100;

  const achievementNames: { [key: string]: string } = {
    'first-game': 'First Steps',
    'streak-master': 'Streak Master',
    'score-hunter': 'Score Hunter',
    'level-up': 'Level Up Champion',
    'time-warrior': 'Time Warrior',
    'game-explorer': 'Game Explorer'
  };

  const displayStats = [
    { label: 'Level', value: stats.level, icon: Star, color: 'text-purple-400' },
    { label: 'Total XP', value: stats.totalXP.toLocaleString(), icon: Star, color: 'text-blue-400' },
    { label: 'Games Played', value: stats.totalGamesPlayed, icon: Gamepad2, color: 'text-green-400' },
    { label: 'Total Score', value: stats.totalScore.toLocaleString(), icon: Award, color: 'text-yellow-400' },
    { label: 'Current Streak', value: `${stats.currentStreak} days`, icon: Target, color: 'text-orange-400' },
    { label: 'Avg. Accuracy', value: `${stats.averageAccuracy}%`, icon: Target, color: 'text-pink-400' },
    { label: 'Achievements', value: stats.achievements, icon: Medal, color: 'text-red-400' },
    { label: 'Play Time', value: formatPlayTime(stats.totalPlayTime), icon: Clock, color: 'text-cyan-400' },
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
      <div className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl md:rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-white/30 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {getAvatarDisplay()}
              {isEditing && (
                <label className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 rounded-full p-1 cursor-pointer transition-colors">
                  <Camera className="h-3 w-3 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-white/10 border border-white/30 rounded-lg px-3 py-1 text-white text-xl md:text-2xl font-bold focus:outline-none focus:border-blue-400"
                />
              ) : (
                <h2 className="text-xl md:text-2xl font-bold text-white">{playerName}</h2>
              )}
              <p className="text-white/70 text-sm md:text-base">Level {stats.level} Brain Trainer</p>
              <p className="text-purple-400 text-xs md:text-sm">{currentRank} Rank</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <button 
                onClick={handleSaveProfile}
                className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors touch-target"
              >
                <Save className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors touch-target"
              >
                <Edit2 className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </button>
            )}
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-target"
            >
              <X className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-100px)] md:max-h-[calc(95vh-120px)]">
          {/* Rank Section */}
          <div className={`${rankInfo.bgColor} rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6 border border-white/20`}>
            <div className="flex flex-col md:flex-row items-center md:justify-between mb-4 space-y-3 md:space-y-0">
              <div className="flex items-center space-x-3 text-center md:text-left">
                <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-r ${rankInfo.color}`}>
                  <RankIcon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white flex items-center space-x-2">
                    <span>{rankInfo.name} Rank</span>
                    <span className="text-2xl">{rankInfo.emoji}</span>
                  </h3>
                  <p className="text-white/70 text-sm md:text-base">Current ranking based on total score</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{stats.totalScore.toLocaleString()}</div>
                <div className="text-white/70 text-sm md:text-base">Total Points</div>
              </div>
            </div>
            
            {nextRank.pointsNeeded > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/70">
                  <span>Progress to {nextRank.nextRank}</span>
                  <span>{Math.round(progressToNextRank)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 md:h-3">
                  <div 
                    className={`h-2 md:h-3 rounded-full bg-gradient-to-r ${rankInfo.color} transition-all duration-500`}
                    style={{ width: `${progressToNextRank}%` }}
                  />
                </div>
                <div className="text-center text-white/70 text-xs md:text-sm">
                  {nextRank.pointsNeeded.toLocaleString()} points to {nextRank.nextRank}
                </div>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            {displayStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/20">
                  <div className="text-center">
                    <IconComponent className={`h-5 w-5 md:h-6 md:w-6 ${stat.color} mx-auto mb-2`} />
                    <div className="text-white/70 text-xs md:text-sm mb-1">{stat.label}</div>
                    <div className="text-lg md:text-xl font-bold text-white">{stat.value}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Purchased Items Display */}
          {userProgress.purchasedItems && userProgress.purchasedItems.length > 0 && (
            <div className="bg-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center">
                <Package className="h-5 w-5 md:h-6 md:w-6 mr-2 text-blue-400" />
                Owned Items
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {userProgress.purchasedItems.map((item, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-3 border border-white/20">
                    <div className="text-center">
                      <div className="text-2xl mb-2">
                        {item.includes('avatar') ? 
                          (item === 'robot-avatar' ? '🤖' : 
                           item === 'wizard-avatar' ? '🧙‍♂️' : 
                           item === 'scientist-avatar' ? '👨‍🔬' : '🎁') : '🎁'}
                      </div>
                      <span className="text-white font-medium text-sm">
                        {item.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      {item === userProgress.avatar && (
                        <div className="text-green-400 text-xs mt-1">Active</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          <div className="bg-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
            <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center">
              <Award className="h-5 w-5 md:h-6 md:w-6 mr-2 text-yellow-400" />
              Recent Achievements
            </h3>
            {userProgress.achievements && userProgress.achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userProgress.achievements.slice(-6).map((achievementId, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-3 border border-white/20">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 flex-shrink-0" />
                      <span className="text-white font-medium text-sm md:text-base">
                        {achievementNames[achievementId] || achievementId}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 md:py-8">
                <div className="text-3xl md:text-4xl mb-2">🏆</div>
                <p className="text-white/70 text-sm md:text-base">No achievements yet</p>
                <p className="text-white/50 text-xs md:text-sm mt-2">Play games to unlock achievements!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
