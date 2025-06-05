
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

export const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const calculateXPForNextLevel = (level: number): number => {
  return (level * level) * 100;
};

// Updated rank calculation to match leaderboard ranks
export const getRank = (totalScore: number): string => {
  if (totalScore >= 100000) return 'Ace';
  if (totalScore >= 75000) return 'Crown';
  if (totalScore >= 35000) return 'Diamond';
  if (totalScore >= 15000) return 'Platinum';
  if (totalScore >= 5000) return 'Gold';
  if (totalScore >= 1000) return 'Silver';
  return 'Bronze';
};

export const formatPlayTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export const calculateAccurateStats = (progress: UserProgress) => {
  const level = calculateLevel(progress.totalXP);
  const currentLevelXP = level > 1 ? ((level - 1) * (level - 1)) * 100 : 0;
  const nextLevelXP = calculateXPForNextLevel(level);
  const xpProgress = progress.totalXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const rank = getRank(progress.totalScore);
  
  return {
    level,
    xpProgress,
    xpNeeded,
    rank,
    accuracy: progress.gamesPlayed.length > 0 ? 85 : 0,
    winRate: progress.gamesPlayed.length > 0 ? 72 : 0,
    totalXP: progress.totalXP,
    totalScore: progress.totalScore,
    totalGamesPlayed: progress.gamesPlayed.length,
    currentStreak: progress.streak,
    averageAccuracy: progress.gamesPlayed.length > 0 ? 85 : 0,
    achievements: progress.achievements.length,
    totalPlayTime: progress.totalPlayTime
  };
};

export const getNextRankRequirement = (currentRank: string): { nextRank: string; pointsNeeded: number } => {
  const ranks = [
    { rank: 'Bronze', score: 0 },
    { rank: 'Silver', score: 1000 },
    { rank: 'Gold', score: 5000 },
    { rank: 'Platinum', score: 15000 },
    { rank: 'Diamond', score: 35000 },
    { rank: 'Crown', score: 75000 },
    { rank: 'Ace', score: 100000 }
  ];
  
  const currentIndex = ranks.findIndex(r => r.rank === currentRank);
  if (currentIndex === -1 || currentIndex === ranks.length - 1) {
    return { nextRank: 'Ace', pointsNeeded: 0 };
  }
  
  const nextRank = ranks[currentIndex + 1];
  return { nextRank: nextRank.rank, pointsNeeded: nextRank.score };
};
