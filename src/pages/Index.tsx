import React, { useState, useEffect } from 'react';
import { BarChart3, Gift, ShoppingCart, RotateCcw } from 'lucide-react';
import { GameFeed } from '@/components/GameFeed';
import { DailyChallenge } from '@/components/DailyChallenge';
import { ProgressHeader } from '@/components/ProgressHeader';
import { GameModal } from '@/components/GameModal';
import { StatsModal } from '@/components/StatsModal';
import { RewardsModal } from '@/components/RewardsModal';
import { ShopModal } from '@/components/ShopModal';
import { AchievementNotification } from '@/components/AchievementNotification';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { audioManager } from '@/utils/audioUtils';
import { powerUpManager } from '@/utils/powerUpManager';

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastPlayDate: string;
  gamesPlayed: number;
  totalScore: number;
  playedGames: string[];
  ownedItems: string[];
  achievements: string[];
  totalPlayTime: number;
}

export interface GameResult {
  gameId: string;
  score: number;
  accuracy: number;
  timeSpent: number;
  xpEarned: number;
}

const Index = () => {
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('brainArcadeProgress', {
    xp: 0,
    level: 1,
    streak: 0,
    lastPlayDate: '',
    gamesPlayed: 0,
    totalScore: 0,
    playedGames: [],
    ownedItems: [],
    achievements: [],
    totalPlayTime: 0
  });

  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [gameStats, setGameStats] = useState<any[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<any>(null);

  // Achievement definitions
  const achievements = [
    { id: 'first-game', title: 'Getting Started', description: 'Play your first game', reward: 50, trigger: (progress: UserProgress) => progress.gamesPlayed >= 1 },
    { id: 'streak-master', title: 'Streak Master', description: 'Maintain a 7-day streak', reward: 200, trigger: (progress: UserProgress) => progress.streak >= 7 },
    { id: 'score-hunter', title: 'Score Hunter', description: 'Earn 10,000 total points', reward: 300, trigger: (progress: UserProgress) => progress.totalScore >= 10000 },
    { id: 'level-up', title: 'Level Up!', description: 'Reach level 5', reward: 150, trigger: (progress: UserProgress) => progress.level >= 5 },
    { id: 'time-warrior', title: 'Time Warrior', description: 'Play for 60 minutes total', reward: 100, trigger: (progress: UserProgress) => progress.totalPlayTime >= 3600 },
    { id: 'game-explorer', title: 'Game Explorer', description: 'Try all available games', reward: 400, trigger: (progress: UserProgress) => progress.playedGames.length >= 10 }
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
        xp: prev.xp + achievement.reward
      }));
    }
  };

  const handleGameComplete = (result: GameResult) => {
    const today = new Date().toDateString();
    const isNewDay = userProgress.lastPlayDate !== today;
    
    const newXP = userProgress.xp + result.xpEarned;
    const newLevel = Math.floor(newXP / 100) + 1;
    
    const updatedPlayedGames = Array.isArray(userProgress.playedGames) 
      ? [...userProgress.playedGames] 
      : [];
    
    if (!updatedPlayedGames.includes(result.gameId)) {
      updatedPlayedGames.push(result.gameId);
    }
    
    setGameStats(prev => [...prev, {
      ...result,
      timestamp: Date.now(),
      date: today
    }]);
    
    const newProgress = {
      ...userProgress,
      xp: newXP,
      level: newLevel,
      streak: isNewDay ? userProgress.streak + 1 : userProgress.streak,
      lastPlayDate: today,
      gamesPlayed: userProgress.gamesPlayed + 1,
      totalScore: userProgress.totalScore + result.score,
      playedGames: updatedPlayedGames,
      totalPlayTime: userProgress.totalPlayTime + result.timeSpent
    };
    
    setUserProgress(newProgress);
    checkAchievements(newProgress);

    audioManager.play('success');
    setShowGameModal(false);
    setSelectedGame(null);
  };

  const handlePurchase = (itemId: string, price: number) => {
    if (userProgress.totalScore >= price) {
      setUserProgress(prev => ({
        ...prev,
        totalScore: prev.totalScore - price,
        ownedItems: [...(prev.ownedItems || []), itemId]
      }));
      
      // Add power-up to inventory
      if (itemId.includes('double-xp')) {
        powerUpManager.addPowerUp('double-xp', 5);
      } else if (itemId.includes('time-freeze')) {
        powerUpManager.addPowerUp('time-freeze', 3);
      } else if (itemId.includes('accuracy-boost')) {
        powerUpManager.addPowerUp('accuracy-boost', 3);
      } else if (itemId.includes('shield')) {
        powerUpManager.addPowerUp('shield', 5);
      }
      
      audioManager.play('success');
    }
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
      setUserProgress({
        xp: 0,
        level: 1,
        streak: 0,
        lastPlayDate: '',
        gamesPlayed: 0,
        totalScore: 0,
        playedGames: [],
        ownedItems: [],
        achievements: [],
        totalPlayTime: 0
      });
      setGameStats([]);
      audioManager.play('click');
    }
  };

  const handleClaimReward = (rewardId: string) => {
    audioManager.play('success');
  };

  const openGame = (game: any) => {
    audioManager.play('click');
    setSelectedGame(game);
    setShowGameModal(true);
  };

  const openStats = () => {
    audioManager.play('click');
    setShowStatsModal(true);
  };

  const openRewards = () => {
    audioManager.play('click');
    setShowRewardsModal(true);
  };

  const openShop = () => {
    audioManager.play('click');
    setShowShopModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-48 md:w-80 h-48 md:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-32 md:w-64 h-32 md:h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-6xl relative z-10">
        {/* Mobile-optimized header */}
        <div className="flex flex-wrap justify-end gap-2 md:gap-3 mb-4 md:mb-6">
          <button
            onClick={openStats}
            className="flex items-center space-x-1 md:space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-lg md:rounded-xl px-2 md:px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105 touch-target text-xs md:text-sm"
          >
            <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-white" />
            <span className="text-white font-medium hidden sm:inline">Stats</span>
          </button>
          <button
            onClick={openRewards}
            className="flex items-center space-x-1 md:space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-lg md:rounded-xl px-2 md:px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105 touch-target text-xs md:text-sm"
          >
            <Gift className="h-4 w-4 md:h-5 md:w-5 text-white" />
            <span className="text-white font-medium hidden sm:inline">Rewards</span>
          </button>
          <button
            onClick={openShop}
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
            onClaimReward={handleClaimReward}
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

export default Index;
