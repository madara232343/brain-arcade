
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

export const getRank = (xp: number): string => {
  if (xp < 500) return 'Bronze';
  if (xp < 1500) return 'Silver';
  if (xp < 3500) return 'Gold';
  if (xp < 7500) return 'Platinum';
  if (xp < 15000) return 'Diamond';
  return 'Master';
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
  
  return {
    level,
    xpProgress,
    xpNeeded,
    rank: getRank(progress.totalXP),
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
    { rank: 'Bronze', xp: 0 },
    { rank: 'Silver', xp: 500 },
    { rank: 'Gold', xp: 1500 },
    { rank: 'Platinum', xp: 3500 },
    { rank: 'Diamond', xp: 7500 },
    { rank: 'Master', xp: 15000 }
  ];
  
  const currentIndex = ranks.findIndex(r => r.rank === currentRank);
  if (currentIndex === -1 || currentIndex === ranks.length - 1) {
    return { nextRank: 'Master', pointsNeeded: 0 };
  }
  
  const nextRank = ranks[currentIndex + 1];
  return { nextRank: nextRank.rank, pointsNeeded: nextRank.xp };
};
