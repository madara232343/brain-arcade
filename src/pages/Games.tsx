import React, { useState, useEffect } from 'react';
import { BarChart3, Gift, ShoppingCart, RotateCcw, User, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GameFeed } from '@/components/GameFeed';
import { DailyChallenge } from '@/components/DailyChallenge';
import { ProgressHeader } from '@/components/ProgressHeader';
import { GameModal } from '@/components/GameModal';
import { StatsModal } from '@/components/StatsModal';
import { RewardsModal } from '@/components/RewardsModal';
import { ShopModal } from '@/components/ShopModal';
import { ProfileModal } from '@/components/ProfileModal';
import { AchievementNotification } from '@/components/AchievementNotification';
import { PowerUpBar } from '@/components/PowerUpBar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { audioManager } from '@/utils/audioUtils';
import { powerUpManager } from '@/utils/powerUpManager';
import { toast } from '@/hooks/use-toast';

export interface UserProgress {
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
}

export interface GameResult {
  gameId: string;
  score: number;
  accuracy: number;
  timeSpent: number;
  xpEarned: number;
}

const Games = () => {
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('brainArcadeProgress', {
    totalScore: 0,
    totalXP: 0,
    level: 1,
    gamesPlayed: [],
    achievements: [],
    rank: 'Bronze',
    streak: 0,
    purchasedItems: [],
    activeTheme: 'default',
    activePowerUps: [],
    xp: 0,
    lastPlayDate: '',
    playedGames: [],
    ownedItems: [],
    totalPlayTime: 0,
    theme: 'default',
    avatar: 'default'
  });

  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [gameStats, setGameStats] = useState<any[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<any>(null);
  const [activePowerUps, setActivePowerUps] = useState<Set<string>>(new Set());

  // Achievement definitions
  const achievements = [
    { id: 'first-game', title: 'Getting Started', description: 'Play your first game', reward: 50, trigger: (progress: UserProgress) => progress.gamesPlayed.length >= 1 },
    { id: 'streak-master', title: 'Streak Master', description: 'Maintain a 7-day streak', reward: 200, trigger: (progress: UserProgress) => progress.streak >= 7 },
    { id: 'score-hunter', title: 'Score Hunter', description: 'Earn 10,000 total points', reward: 300, trigger: (progress: UserProgress) => progress.totalScore >= 10000 },
    { id: 'level-up', title: 'Level Up!', description: 'Reach level 5', reward: 150, trigger: (progress: UserProgress) => progress.level >= 5 },
    { id: 'time-warrior', title: 'Time Warrior', description: 'Play for 60 minutes total', reward: 100, trigger: (progress: UserProgress) => progress.totalPlayTime >= 3600 },
    { id: 'game-explorer', title: 'Game Explorer', description: 'Try 10 different games', reward: 400, trigger: (progress: UserProgress) => progress.playedGames.length >= 10 }
  ];

  const checkAchievements = (newProgress: UserProgress) => {
    const unlockedAchievements = achievements.filter(achievement => {
      return !newProgress.achievements.includes(achievement.id) && achievement.trigger(newProgress);
    });

    if (unlockedAchievements.length > 0) {
      const achievement = unlockedAchievements[0];
      setCurrentAchievement(achievement);
      
      setUserProgress(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievement.id],
        totalXP: prev.totalXP + achievement.reward,
        xp: prev.xp + achievement.reward
      }));

      toast({
        title: "🎉 Achievement Unlocked!",
        description: `${achievement.title} - +${achievement.reward} XP`,
        duration: 3000,
      });
    }
  };

  const calculateRank = (totalScore: number) => {
    if (totalScore >= 50000) return 'Diamond';
    if (totalScore >= 25000) return 'Platinum';
    if (totalScore >= 10000) return 'Gold';
    if (totalScore >= 5000) return 'Silver';
    return 'Bronze';
  };

  const handleGameComplete = (result: GameResult) => {
    const today = new Date().toDateString();
    const isNewDay = userProgress.lastPlayDate !== today;
    
    let xpMultiplier = 1;
    if (activePowerUps.has('doubleXP')) {
      xpMultiplier = 2;
    }
    
    const finalXP = result.xpEarned * xpMultiplier;
    const newXP = userProgress.totalXP + finalXP;
    const newLevel = Math.floor(newXP / 100) + 1;
    const newTotalScore = userProgress.totalScore + result.score;
    const newRank = calculateRank(newTotalScore);
    
    const updatedPlayedGames = Array.isArray(userProgress.playedGames) 
      ? [...userProgress.playedGames] 
      : [];
    
    if (!updatedPlayedGames.includes(result.gameId)) {
      updatedPlayedGames.push(result.gameId);
    }

    const updatedGamesPlayed = Array.isArray(userProgress.gamesPlayed) 
      ? [...userProgress.gamesPlayed] 
      : [];
    
    if (!updatedGamesPlayed.includes(result.gameId)) {
      updatedGamesPlayed.push(result.gameId);
    }
    
    setGameStats(prev => [...prev, {
      ...result,
      timestamp: Date.now(),
      date: today
    }]);
    
    const newProgress = {
      ...userProgress,
      totalXP: newXP,
      xp: newXP,
      level: newLevel,
      streak: isNewDay ? userProgress.streak + 1 : userProgress.streak,
      lastPlayDate: today,
      gamesPlayed: updatedGamesPlayed,
      totalScore: newTotalScore,
      playedGames: updatedPlayedGames,
      totalPlayTime: userProgress.totalPlayTime + result.timeSpent,
      rank: newRank
    };
    
    setUserProgress(newProgress);
    checkAchievements(newProgress);

    audioManager.play('success');
    setShowGameModal(false);
    setSelectedGame(null);

    toast({
      title: "🎯 Game Complete!",
      description: `+${result.score} points, +${finalXP} XP${xpMultiplier > 1 ? ' (2x bonus!)' : ''}`,
      duration: 3000,
    });
  };

  const handlePurchase = (itemId: string, price: number) => {
    if (userProgress.totalScore >= price) {
      setUserProgress(prev => ({
        ...prev,
        totalScore: prev.totalScore - price,
        purchasedItems: [...(prev.purchasedItems || []), itemId],
        ownedItems: [...(prev.ownedItems || []), itemId]
      }));
      
      // Add power-up to inventory or apply theme/avatar
      if (itemId.includes('double-xp')) {
        powerUpManager.addPowerUp('doubleXP', 'Double XP', 5);
      } else if (itemId.includes('time-freeze')) {
        powerUpManager.addPowerUp('timeFreeze', 'Time Freeze', 3);
      } else if (itemId.includes('accuracy-boost')) {
        powerUpManager.addPowerUp('accuracyBoost', 'Accuracy Boost', 3);
      } else if (itemId.includes('shield')) {
        powerUpManager.addPowerUp('shield', 'Error Shield', 5);
      } else if (itemId.includes('theme')) {
        setUserProgress(prev => ({ ...prev, activeTheme: itemId, theme: itemId }));
      } else if (itemId.includes('avatar')) {
        setUserProgress(prev => ({ ...prev, avatar: itemId }));
      }
      
      audioManager.play('success');
      toast({
        title: "🛒 Purchase Successful!",
        description: "Item added to your inventory",
        duration: 3000,
      });
    }
  };

  const handlePowerUpUsed = (type: string) => {
    setActivePowerUps(prev => new Set([...prev, type]));
    
    if (type === 'timeFreeze') {
      setTimeout(() => {
        setActivePowerUps(prev => {
          const newSet = new Set(prev);
          newSet.delete('timeFreeze');
          return newSet;
        });
      }, 10000);
    } else if (type === 'doubleXP') {
      setTimeout(() => {
        setActivePowerUps(prev => {
          const newSet = new Set(prev);
          newSet.delete('doubleXP');
          return newSet;
        });
      }, 300000); // 5 minutes
    }
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
      const resetProgress = {
        totalScore: 0,
        totalXP: 0,
        level: 1,
        gamesPlayed: [],
        achievements: [],
        rank: 'Bronze',
        streak: 0,
        purchasedItems: [],
        activeTheme: 'default',
        activePowerUps: [],
        xp: 0,
        lastPlayDate: '',
        playedGames: [],
        ownedItems: [],
        totalPlayTime: 0,
        theme: 'default',
        avatar: 'default'
      };
      setUserProgress(resetProgress);
      setGameStats([]);
      powerUpManager.clearAllPowerUps();
      audioManager.play('click');
      toast({
        title: "🔄 Progress Reset",
        description: "All progress has been reset",
        duration: 3000,
      });
    }
  };

  const openGame = (game: any) => {
    audioManager.play('click');
    setSelectedGame(game);
    setShowGameModal(true);
  };

  const getThemeClasses = () => {
    switch (userProgress.activeTheme || userProgress.theme) {
      case 'neon-theme':
        return 'from-cyan-900 via-purple-900 to-pink-900';
      case 'nature-theme':
        return 'from-green-900 via-emerald-900 to-teal-900';
      case 'space-theme':
        return 'from-slate-900 via-purple-900 to-indigo-900';
      default:
        return 'from-indigo-900 via-purple-900 to-pink-800';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getThemeClasses()} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-48 md:w-80 h-48 md:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-32 md:w-64 h-32 md:h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-6xl relative z-10">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors">
            <Home className="h-5 w-5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center space-x-1 md:space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-lg md:rounded-xl px-2 md:px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105 touch-target text-xs md:text-sm"
            >
              <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
              <span className="text-white font-medium hidden sm:inline">Profile</span>
            </button>
            <button
              onClick={() => setShowStatsModal(true)}
              className="flex items-center space-x-1 md:space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-lg md:rounded-xl px-2 md:px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105 touch-target text-xs md:text-sm"
            >
              <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-white" />
              <span className="text-white font-medium hidden sm:inline">Stats</span>
            </button>
            <button
              onClick={() => setShowRewardsModal(true)}
              className="flex items-center space-x-1 md:space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-lg md:rounded-xl px-2 md:px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105 touch-target text-xs md:text-sm"
            >
              <Gift className="h-4 w-4 md:h-5 md:w-5 text-white" />
              <span className="text-white font-medium hidden sm:inline">Rewards</span>
            </button>
            <button
              onClick={() => setShowShopModal(true)}
              className="flex items-center space-x-1 md:space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-lg md:rounded-xl px-2 md:px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105 touch-target text-xs md:text-sm"
            >
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-white" />
              <span className="text-white font-medium hidden sm:inline">Shop</span>
            </button>
            <button
              onClick={handleResetProgress}
              className="flex items-center space-x-1 md:space-x-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-lg rounded-lg md:rounded-xl px-2 md:px-4 py-2 border border-red-500/30 transition-all duration-300 hover:scale-105 touch-target text-xs md:text-sm"
            >
              <RotateCcw className="h-4 w-4 md:h-5 md:w-5 text-red-400" />
              <span className="text-red-400 font-medium hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        <PowerUpBar onPowerUpUsed={handlePowerUpUsed} />
        <ProgressHeader userProgress={userProgress} />
        <DailyChallenge userProgress={userProgress} onPlayGame={openGame} />
        <GameFeed onPlayGame={openGame} playedGames={userProgress.playedGames || []} />
        
        {/* Achievement notification */}
        <AchievementNotification
          achievement={currentAchievement}
          onClose={() => setCurrentAchievement(null)}
        />
        
        {/* Modals */}
        {showGameModal && selectedGame && (
          <GameModal
            game={selectedGame}
            onComplete={handleGameComplete}
            onClose={() => {
              audioManager.play('click');
              setShowGameModal(false);
              setSelectedGame(null);
            }}
            activePowerUps={activePowerUps}
            onPowerUpUsed={handlePowerUpUsed}
          />
        )}

        {showProfileModal && (
          <ProfileModal
            userProgress={userProgress}
            onClose={() => {
              audioManager.play('click');
              setShowProfileModal(false);
            }}
          />
        )}

        {showStatsModal && (
          <StatsModal
            userProgress={userProgress}
            gameStats={gameStats}
            onClose={() => {
              audioManager.play('click');
              setShowStatsModal(false);
            }}
          />
        )}

        {showRewardsModal && (
          <RewardsModal
            userProgress={userProgress}
            onClaimReward={() => {}}
            onClose={() => {
              audioManager.play('click');
              setShowRewardsModal(false);
            }}
          />
        )}

        {showShopModal && (
          <ShopModal
            userProgress={userProgress}
            onPurchase={handlePurchase}
            onClose={() => {
              audioManager.play('click');
              setShowShopModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Games;
