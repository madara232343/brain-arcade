
import React, { useState, useEffect } from 'react';
import { GameFeed } from '@/components/GameFeed';
import { DashboardStats } from '@/components/DashboardStats';
import { GameModal } from '@/components/GameModal';
import { GameCompleteModal } from '@/components/GameCompleteModal';
import { DailyChallenge } from '@/components/DailyChallenge';
import { ProfileModal } from '@/components/ProfileModal';
import { ShopModal } from '@/components/ShopModal';
import { ReviewModal } from '@/components/ReviewModal';
import { PowerUpBar } from '@/components/PowerUpBar';
import { AchievementToast } from '@/components/AchievementToast';
import { User, Trophy, ShoppingCart, Star, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface GameResult {
  gameId: string;
  score: number;
  accuracy: number;
  timeSpent: number;
  xpEarned: number;
}

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
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  requirement: number;
  currentProgress: number;
  unlocked: boolean;
  icon: string;
  category: 'games' | 'score' | 'streak' | 'time';
}

const Index = () => {
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [activePowerUps, setActivePowerUps] = useState<Set<string>>(new Set());
  const [achievementToShow, setAchievementToShow] = useState<Achievement | null>(null);

  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('brainArcadeProgress');
    return saved ? JSON.parse(saved) : {
      totalScore: 0,
      totalXP: 0,
      level: 1,
      gamesPlayed: [],
      achievements: [],
      rank: 'Beginner',
      streak: 0,
      purchasedItems: [],
      activeTheme: 'default',
      activePowerUps: []
    };
  });

  useEffect(() => {
    localStorage.setItem('brainArcadeProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  const handleGameComplete = (result: GameResult) => {
    setGameResult(result);
    
    const newTotalScore = userProgress.totalScore + result.score;
    const newTotalXP = userProgress.totalXP + result.xpEarned;
    const newLevel = Math.floor(newTotalXP / 100) + 1;
    
    const newGamesPlayed = userProgress.gamesPlayed.includes(result.gameId) 
      ? userProgress.gamesPlayed 
      : [...userProgress.gamesPlayed, result.gameId];

    let newRank = userProgress.rank;
    if (newLevel >= 50) newRank = 'Master';
    else if (newLevel >= 30) newRank = 'Expert';
    else if (newLevel >= 20) newRank = 'Advanced';
    else if (newLevel >= 10) newRank = 'Intermediate';
    else if (newLevel >= 5) newRank = 'Novice';

    setUserProgress(prev => ({
      ...prev,
      totalScore: newTotalScore,
      totalXP: newTotalXP,
      level: newLevel,
      gamesPlayed: newGamesPlayed,
      rank: newRank
    }));

    // Check for achievements
    checkAchievements(newTotalScore, newTotalXP, newGamesPlayed.length, result);
  };

  const checkAchievements = (score: number, xp: number, gamesCount: number, result: GameResult) => {
    const achievements: Achievement[] = [
      {
        id: 'first-game',
        title: 'First Steps',
        description: 'Play your first game',
        requirement: 1,
        currentProgress: gamesCount,
        unlocked: gamesCount >= 1,
        icon: '🎮',
        category: 'games'
      },
      {
        id: 'score-master',
        title: 'Score Master',
        description: 'Reach 1000 total points',
        requirement: 1000,
        currentProgress: score,
        unlocked: score >= 1000,
        icon: '⭐',
        category: 'score'
      },
      {
        id: 'perfect-game',
        title: 'Perfectionist',
        description: 'Get 100% accuracy in any game',
        requirement: 100,
        currentProgress: result.accuracy,
        unlocked: result.accuracy === 100,
        icon: '🎯',
        category: 'games'
      }
    ];

    achievements.forEach(achievement => {
      if (achievement.unlocked && !userProgress.achievements.includes(achievement.id)) {
        setUserProgress(prev => ({
          ...prev,
          achievements: [...prev.achievements, achievement.id]
        }));
        setAchievementToShow(achievement);
        toast({
          title: "🏆 Achievement Unlocked!",
          description: `${achievement.title}: ${achievement.description}`,
          duration: 4000,
        });
      }
    });
  };

  const handlePurchase = (itemId: string, price: number) => {
    if (userProgress.totalScore >= price) {
      setUserProgress(prev => ({
        ...prev,
        totalScore: prev.totalScore - price,
        purchasedItems: [...prev.purchasedItems, itemId]
      }));

      // Apply theme if it's a theme item
      if (itemId.includes('theme')) {
        setUserProgress(prev => ({
          ...prev,
          activeTheme: itemId
        }));
      }

      toast({
        title: "🛒 Purchase Successful!",
        description: "Item added to your inventory",
        duration: 3000,
      });
    }
  };

  const handlePowerUpUsed = (type: string) => {
    if (userProgress.purchasedItems.includes(type)) {
      setActivePowerUps(prev => new Set([...prev, type]));
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      userProgress.activeTheme === 'neon-theme' 
        ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-black'
        : userProgress.activeTheme === 'nature-theme'
        ? 'bg-gradient-to-br from-green-800 via-emerald-700 to-teal-900'
        : userProgress.activeTheme === 'space-theme'
        ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-black'
        : 'bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900'
    }`}>
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 text-center md:text-left">
              🧠 Brain Burst Arcade
            </h1>
            <p className="text-white/80 text-center md:text-left">Challenge your mind with engaging brain games</p>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-4">
            <button
              onClick={() => setShowProfile(true)}
              className="bg-white/20 hover:bg-white/30 text-white p-2 md:p-3 rounded-xl transition-all duration-300 hover:scale-105 touch-target"
            >
              <User className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              onClick={() => setShowShop(true)}
              className="bg-white/20 hover:bg-white/30 text-white p-2 md:p-3 rounded-xl transition-all duration-300 hover:scale-105 touch-target"
            >
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              onClick={() => setShowReview(true)}
              className="bg-white/20 hover:bg-white/30 text-white p-2 md:p-3 rounded-xl transition-all duration-300 hover:scale-105 touch-target"
            >
              <Star className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </header>

        {/* Dashboard Stats */}
        <DashboardStats userProgress={userProgress} />

        {/* Daily Challenge */}
        <DailyChallenge userProgress={userProgress} onComplete={handleGameComplete} />

        {/* Game Feed */}
        <GameFeed 
          onPlayGame={setSelectedGame}
          playedGames={userProgress.gamesPlayed}
        />

        {/* Modals */}
        {selectedGame && (
          <GameModal
            game={selectedGame}
            onComplete={handleGameComplete}
            onClose={() => setSelectedGame(null)}
            activePowerUps={activePowerUps}
            onPowerUpUsed={handlePowerUpUsed}
          />
        )}

        {gameResult && (
          <GameCompleteModal
            result={gameResult}
            game={selectedGame}
            onClose={() => {
              setGameResult(null);
              setSelectedGame(null);
            }}
          />
        )}

        {showProfile && (
          <ProfileModal
            userProgress={userProgress}
            onClose={() => setShowProfile(false)}
          />
        )}

        {showShop && (
          <ShopModal
            userProgress={userProgress}
            onClose={() => setShowShop(false)}
            onPurchase={handlePurchase}
          />
        )}

        {showReview && (
          <ReviewModal onClose={() => setShowReview(false)} />
        )}

        {achievementToShow && (
          <AchievementToast
            achievement={achievementToShow}
            onClose={() => setAchievementToShow(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
