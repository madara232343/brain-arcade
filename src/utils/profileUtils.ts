
import { UserProgress } from '@/pages/Games';

export const calculateAccurateStats = (userProgress: UserProgress, gameStats: any[]) => {
  const totalGamesPlayed = Math.max(
    userProgress.gamesPlayed?.length || 0,
    userProgress.playedGames?.length || 0,
    gameStats.length
  );

  const totalScore = userProgress.totalScore || 0;
  const totalXP = userProgress.totalXP || userProgress.xp || 0;
  const level = Math.floor(totalXP / 100) + 1;
  
  const currentStreak = calculateStreak(gameStats);
  const averageAccuracy = gameStats.length > 0 
    ? gameStats.reduce((sum, game) => sum + (game.accuracy || 0), 0) / gameStats.length 
    : 0;

  const rank = calculateRank(totalScore);
  
  return {
    totalGamesPlayed,
    totalScore,
    totalXP,
    level,
    currentStreak,
    averageAccuracy: Math.round(averageAccuracy),
    rank,
    achievements: userProgress.achievements?.length || 0,
    totalPlayTime: userProgress.totalPlayTime || 0
  };
};

export const calculateStreak = (gameStats: any[]): number => {
  if (gameStats.length === 0) return 0;
  
  const sortedStats = gameStats.sort((a, b) => b.timestamp - a.timestamp);
  const today = new Date().toDateString();
  let streak = 0;
  let currentDate = new Date();
  
  for (const game of sortedStats) {
    const gameDate = new Date(game.timestamp).toDateString();
    const expectedDate = currentDate.toDateString();
    
    if (gameDate === expectedDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

export const calculateRank = (totalScore: number): string => {
  if (totalScore >= 100000) return 'Legendary';
  if (totalScore >= 50000) return 'Diamond';
  if (totalScore >= 25000) return 'Platinum';
  if (totalScore >= 10000) return 'Gold';
  if (totalScore >= 5000) return 'Silver';
  return 'Bronze';
};

export const formatPlayTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const getNextRankRequirement = (currentScore: number): { nextRank: string; pointsNeeded: number } => {
  const ranks = [
    { name: 'Silver', requirement: 5000 },
    { name: 'Gold', requirement: 10000 },
    { name: 'Platinum', requirement: 25000 },
    { name: 'Diamond', requirement: 50000 },
    { name: 'Legendary', requirement: 100000 }
  ];
  
  for (const rank of ranks) {
    if (currentScore < rank.requirement) {
      return {
        nextRank: rank.name,
        pointsNeeded: rank.requirement - currentScore
      };
    }
  }
  
  return { nextRank: 'Max Rank', pointsNeeded: 0 };
};
