
export interface UserProgress {
  level: number;
  xp: number;
  gamesPlayed: string[];
  totalScore: number;
  achievements: string[];
  totalXP: number;
  playedGames: string[];
  totalPlayTime: number;
}

export const calculateLevel = (progress: UserProgress): number => {
  const totalGames = progress.gamesPlayed.length;
  const baseXP = progress.totalXP || progress.xp;
  return Math.floor(Math.sqrt(baseXP / 100)) + 1;
};

export const getNextLevelXP = (currentLevel: number): number => {
  return Math.pow(currentLevel, 2) * 100;
};

export const calculateAccuracy = (progress: UserProgress): number => {
  if (progress.playedGames.length === 0) return 0;
  return Math.round((progress.totalScore / (progress.playedGames.length * 100)) * 100);
};

export const getAchievements = (progress: UserProgress): string[] => {
  const achievements: string[] = [];
  
  if (progress.gamesPlayed.length >= 10) {
    achievements.push('First 10 Games');
  }
  
  if (progress.totalScore >= 1000) {
    achievements.push('Score Master');
  }
  
  if (progress.totalPlayTime >= 3600) {
    achievements.push('Time Champion');
  }
  
  return [...progress.achievements, ...achievements];
};

export const formatPlayTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};
