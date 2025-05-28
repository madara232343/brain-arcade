
import React, { useState, useEffect } from 'react';
import { BarChart3, Gift, ShoppingCart } from 'lucide-react';
import { GameFeed } from '@/components/GameFeed';
import { DailyChallenge } from '@/components/DailyChallenge';
import { ProgressHeader } from '@/components/ProgressHeader';
import { GameModal } from '@/components/GameModal';
import { StatsModal } from '@/components/StatsModal';
import { RewardsModal } from '@/components/RewardsModal';
import { ShopModal } from '@/components/ShopModal';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { audioManager } from '@/utils/audioUtils';

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastPlayDate: string;
  gamesPlayed: number;
  totalScore: number;
  playedGames: string[];
  ownedItems: string[];
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
    ownedItems: []
  });

  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [gameStats, setGameStats] = useState<any[]>([]);

  const handleGameComplete = (result: GameResult) => {
    const today = new Date().toDateString();
    const isNewDay = userProgress.lastPlayDate !== today;
    
    // Calculate new level (every 100 XP = 1 level)
    const newXP = userProgress.xp + result.xpEarned;
    const newLevel = Math.floor(newXP / 100) + 1;
    
    // Update played games list safely
    const updatedPlayedGames = Array.isArray(userProgress.playedGames) 
      ? [...userProgress.playedGames] 
      : [];
    
    if (!updatedPlayedGames.includes(result.gameId)) {
      updatedPlayedGames.push(result.gameId);
    }
    
    // Update stats
    setGameStats(prev => [...prev, {
      ...result,
      timestamp: Date.now(),
      date: today
    }]);
    
    setUserProgress(prev => ({
      ...prev,
      xp: newXP,
      level: newLevel,
      streak: isNewDay ? prev.streak + 1 : prev.streak,
      lastPlayDate: today,
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + result.score,
      playedGames: updatedPlayedGames
    }));

    // Play success sound
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
      audioManager.play('success');
    }
  };

  const handleClaimReward = (rewardId: string) => {
    // Implementation for claiming rewards
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl relative z-10">
        {/* Header with action buttons */}
        <div className="flex justify-end space-x-3 mb-6">
          <button
            onClick={openStats}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105"
          >
            <BarChart3 className="h-5 w-5 text-white" />
            <span className="text-white font-medium">Stats</span>
          </button>
          <button
            onClick={openRewards}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105"
          >
            <Gift className="h-5 w-5 text-white" />
            <span className="text-white font-medium">Rewards</span>
          </button>
          <button
            onClick={openShop}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105"
          >
            <ShoppingCart className="h-5 w-5 text-white" />
            <span className="text-white font-medium">Shop</span>
          </button>
        </div>

        <ProgressHeader userProgress={userProgress} />
        <DailyChallenge userProgress={userProgress} onPlayGame={openGame} />
        <GameFeed onPlayGame={openGame} playedGames={userProgress.playedGames || []} />
        
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
