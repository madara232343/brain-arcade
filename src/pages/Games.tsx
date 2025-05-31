import React, { useState, useEffect } from 'react';
import { BarChart3, Gift, ShoppingCart, RotateCcw, User, Home, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GameFeed } from '@/components/GameFeed';
import { DailyChallenge } from '@/components/DailyChallenge';
import { ProgressHeader } from '@/components/ProgressHeader';
import { GameModal } from '@/components/GameModal';
import { StatsModal } from '@/components/StatsModal';
import { RewardsModal } from '@/components/RewardsModal';
import { ShopModal } from '@/components/ShopModal';
import { ProfileModal } from '@/components/ProfileModal';
import { CategoryFilter } from '@/components/CategoryFilter';
import { AchievementNotification } from '@/components/AchievementNotification';
import { PowerUpBar } from '@/components/PowerUpBar';
import { ChatBot } from '@/components/ChatBot';
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout';
import { SoundProvider, useSounds } from '@/components/SoundManager';
import { ThemeProvider, useTheme } from '@/components/ThemeManager';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { audioManager } from '@/utils/audioUtils';
import { powerUpManager } from '@/utils/powerUpManager';
import { calculateAccurateStats } from '@/utils/profileUtils';
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

const GamesContent = () => {
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
  const [showChatBot, setShowChatBot] = useState(false);
  const [gameStats, setGameStats] = useState<any[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<any>(null);
  const [activePowerUps, setActivePowerUps] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { playSound } = useSounds();
  const { currentTheme, setTheme } = useTheme();

  // Update theme when user changes it
  useEffect(() => {
    if (userProgress.activeTheme !== currentTheme.id) {
      setTheme(userProgress.activeTheme);
    }
  }, [userProgress.activeTheme, currentTheme.id, setTheme]);

  const achievements = [
    { id: 'first-game', title: 'Getting Started', description: 'Play your first game', reward: 50, trigger: (progress: UserProgress) => progress.gamesPlayed.length >= 1 },
    { id: 'streak-master', title: 'Streak Master', description: 'Maintain a 7-day streak', reward: 200, trigger: (progress: UserProgress) => progress.streak >= 7 },
    { id: 'score-hunter', title: 'Score Hunter', description: 'Earn 10,000 total points', reward: 300, trigger: (progress: UserProgress) => progress.totalScore >= 10000 },
    { id: 'level-up', title: 'Level Up!', description: 'Reach level 5', reward: 150, trigger: (progress: UserProgress) => progress.level >= 5 },
    { id: 'time-warrior', title: 'Time Warrior', description: 'Play for 60 minutes total', reward: 100, trigger: (progress: UserProgress) => progress.totalPlayTime >= 3600 },
    { id: 'game-explorer', title: 'Game Explorer', description: 'Try 10 different games', reward: 400, trigger: (progress: UserProgress) => progress.playedGames.length >= 10 },
    { id: 'memory-master', title: 'Memory Master', description: 'Complete 5 memory games', reward: 250, trigger: (progress: UserProgress) => progress.playedGames.filter(id => id.includes('memory')).length >= 5 },
    { id: 'puzzle-solver', title: 'Puzzle Solver', description: 'Complete 5 puzzle games', reward: 250, trigger: (progress: UserProgress) => progress.playedGames.filter(id => ['puzzle-blocks', 'sudoku', 'tetris', 'brain-teaser'].includes(id)).length >= 5 },
    { id: 'speed-demon', title: 'Speed Demon', description: 'Complete 5 speed games', reward: 250, trigger: (progress: UserProgress) => progress.playedGames.filter(id => ['reaction-time', 'speed-typing', 'math-sprint'].includes(id)).length >= 5 },
    { id: 'strategist', title: 'Master Strategist', description: 'Complete chess and checkers', reward: 350, trigger: (progress: UserProgress) => progress.playedGames.includes('chess') && progress.playedGames.includes('checkers') },
    { id: 'high-scorer', title: 'High Scorer', description: 'Score 50,000 points', reward: 500, trigger: (progress: UserProgress) => progress.totalScore >= 50000 },
    { id: 'perfectionist', title: 'Perfectionist', description: 'Get 100% accuracy in any game', reward: 400, trigger: (progress: UserProgress) => progress.achievements.includes('perfect-game') },
    { id: 'marathon-runner', title: 'Marathon Runner', description: 'Play for 3 hours total', reward: 300, trigger: (progress: UserProgress) => progress.totalPlayTime >= 10800 },
    { id: 'daily-player', title: 'Daily Player', description: 'Play games 5 days in a row', reward: 250, trigger: (progress: UserProgress) => progress.streak >= 5 },
    { id: 'category-master', title: 'Category Master', description: 'Play games from all categories', reward: 600, trigger: (progress: UserProgress) => {
      const categories = ['memory', 'puzzle', 'speed', 'racing', 'shooting', 'arcade', 'strategy'];
      return categories.every(cat => progress.playedGames.some(game => game.includes(cat)));
    }},
    { id: 'collector', title: 'Collector', description: 'Own 10 shop items', reward: 300, trigger: (progress: UserProgress) => (progress.ownedItems || []).length >= 10 },
    { id: 'xp-master', title: 'XP Master', description: 'Earn 5,000 XP', reward: 200, trigger: (progress: UserProgress) => progress.totalXP >= 5000 },
    { id: 'game-addict', title: 'Game Addict', description: 'Play 50 games total', reward: 800, trigger: (progress: UserProgress) => progress.gamesPlayed.length >= 50 },
    { id: 'bronze-champion', title: 'Bronze Champion', description: 'Reach Bronze rank', reward: 100, trigger: (progress: UserProgress) => ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Legendary'].includes(progress.rank) },
    { id: 'silver-champion', title: 'Silver Champion', description: 'Reach Silver rank', reward: 200, trigger: (progress: UserProgress) => ['Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Legendary'].includes(progress.rank) },
    { id: 'gold-champion', title: 'Gold Champion', description: 'Reach Gold rank', reward: 300, trigger: (progress: UserProgress) => ['Gold', 'Platinum', 'Diamond', 'Master', 'Legendary'].includes(progress.rank) },
    { id: 'platinum-champion', title: 'Platinum Champion', description: 'Reach Platinum rank', reward: 500, trigger: (progress: UserProgress) => ['Platinum', 'Diamond', 'Master', 'Legendary'].includes(progress.rank) },
    { id: 'diamond-champion', title: 'Diamond Champion', description: 'Reach Diamond rank', reward: 750, trigger: (progress: UserProgress) => ['Diamond', 'Master', 'Legendary'].includes(progress.rank) },
    { id: 'master-champion', title: 'Master Champion', description: 'Reach Master rank', reward: 1000, trigger: (progress: UserProgress) => ['Master', 'Legendary'].includes(progress.rank) },
    { id: 'legendary-champion', title: 'Legendary Champion', description: 'Reach Legendary rank', reward: 1500, trigger: (progress: UserProgress) => progress.rank === 'Legendary' }
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

      playSound('notification');
      toast({
        title: "🎉 Achievement Unlocked!",
        description: `${achievement.title} - +${achievement.reward} XP`,
        duration: 3000,
      });
    }
  };

  const calculateRank = (totalScore: number) => {
    if (totalScore >= 500000) return 'Legendary';
    if (totalScore >= 250000) return 'Master';
    if (totalScore >= 100000) return 'Diamond';
    if (totalScore >= 50000) return 'Platinum';
    if (totalScore >= 25000) return 'Gold';
    if (totalScore >= 10000) return 'Silver';
    if (totalScore >= 5000) return 'Bronze';
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

    playSound('success');
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
      if (itemId.includes('doubleXP')) {
        powerUpManager.addPowerUp('doubleXP', 'Double XP', 5);
        playSound('powerup');
      } else if (itemId.includes('timeFreeze')) {
        powerUpManager.addPowerUp('timeFreeze', 'Time Freeze', 3);
        playSound('powerup');
      } else if (itemId.includes('accuracyBoost')) {
        powerUpManager.addPowerUp('accuracyBoost', 'Accuracy Boost', 3);
        playSound('powerup');
      } else if (itemId.includes('shield')) {
        powerUpManager.addPowerUp('shield', 'Error Shield', 5);
        playSound('powerup');
      } else if (itemId.includes('theme')) {
        setUserProgress(prev => ({ ...prev, activeTheme: itemId, theme: itemId }));
        setTheme(itemId);
      } else if (itemId.includes('avatar')) {
        setUserProgress(prev => ({ ...prev, avatar: itemId }));
      }
      
      playSound('success');
      toast({
        title: "🛒 Purchase Successful!",
        description: "Item added to your inventory",
        duration: 3000,
      });
    }
  };

  const handlePowerUpUsed = (type: string) => {
    setActivePowerUps(prev => new Set([...prev, type]));
    playSound('powerup');
    
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
      }, 300000);
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
      playSound('click');
      toast({
        title: "🔄 Progress Reset",
        description: "All progress has been reset",
        duration: 3000,
      });
    }
  };

  const openGame = (game: any) => {
    playSound('click');
    setSelectedGame(game);
    setShowGameModal(true);
  };

  const handleNavigation = (path: string) => {
    playSound('click');
    window.location.href = path;
  };

  return (
    <MobileOptimizedLayout 
      currentPage="games" 
      onNavigate={handleNavigation}
      onChatOpen={() => setShowChatBot(true)}
    >
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} relative overflow-hidden`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 md:w-96 h-32 md:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-24 md:w-80 h-24 md:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-16 md:w-64 h-16 md:h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-6xl relative z-10">
          {/* Header - Desktop Only */}
          <div className="hidden md:flex justify-between items-center gap-3 mb-6">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105"
              >
                <User className="h-5 w-5 text-white" />
                <span className="text-white font-medium">Profile</span>
              </button>
              <button
                onClick={() => setShowStatsModal(true)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105"
              >
                <BarChart3 className="h-5 w-5 text-white" />
                <span className="text-white font-medium">Stats</span>
              </button>
              <button
                onClick={() => setShowRewardsModal(true)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105"
              >
                <Gift className="h-5 w-5 text-white" />
                <span className="text-white font-medium">Rewards</span>
              </button>
              <button
                onClick={() => setShowShopModal(true)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105"
              >
                <ShoppingCart className="h-5 w-5 text-white" />
                <span className="text-white font-medium">Shop</span>
              </button>
              <button
                onClick={handleResetProgress}
                className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-lg rounded-xl px-4 py-2 border border-red-500/30 transition-all duration-300 hover:scale-105"
              >
                <RotateCcw className="h-5 w-5 text-red-400" />
                <span className="text-red-400 font-medium">Reset</span>
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <Link to="/" className="text-white hover:text-blue-300 transition-colors">
              <Home className="h-6 w-6" />
            </Link>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowProfileModal(true)}
                className="p-2 bg-white/10 rounded-lg border border-white/20 touch-target"
              >
                <User className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={() => setShowShopModal(true)}
                className="p-2 bg-white/10 rounded-lg border border-white/20 touch-target"
              >
                <ShoppingCart className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          <PowerUpBar onPowerUpUsed={handlePowerUpUsed} />
          <ProgressHeader userProgress={userProgress} />
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory} 
          />
          <DailyChallenge userProgress={userProgress} onPlayGame={openGame} />
          <GameFeed 
            onPlayGame={openGame} 
            playedGames={userProgress.playedGames || []}
            selectedCategory={selectedCategory}
          />
          
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
                playSound('click');
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
              gameStats={gameStats}
              onClose={() => {
                playSound('click');
                setShowProfileModal(false);
              }}
            />
          )}

          {showStatsModal && (
            <StatsModal
              userProgress={userProgress}
              gameStats={gameStats}
              onClose={() => {
                playSound('click');
                setShowStatsModal(false);
              }}
            />
          )}

          {showRewardsModal && (
            <RewardsModal
              userProgress={userProgress}
              onClaimReward={() => {}}
              onClose={() => {
                playSound('click');
                setShowRewardsModal(false);
              }}
            />
          )}

          {showShopModal && (
            <ShopModal
              userProgress={userProgress}
              onPurchase={handlePurchase}
              onClose={() => {
                playSound('click');
                setShowShopModal(false);
              }}
            />
          )}

          <ChatBot 
            isOpen={showChatBot}
            onClose={() => setShowChatBot(false)}
          />
        </div>
      </div>
    </MobileOptimizedLayout>
  );
};

const Games = () => {
  return (
    <SoundProvider>
      <ThemeProvider>
        <GamesContent />
      </ThemeProvider>
    </SoundProvider>
  );
};

export default Games;
