
import React, { useState, useEffect } from 'react';
import { GameFeed } from '@/components/GameFeed';
import { DailyChallenge } from '@/components/DailyChallenge';
import { ProgressHeader } from '@/components/ProgressHeader';
import { GameModal } from '@/components/GameModal';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastPlayDate: string;
  gamesPlayed: number;
  totalScore: number;
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
    totalScore: 0
  });

  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showGameModal, setShowGameModal] = useState(false);

  const handleGameComplete = (result: GameResult) => {
    const today = new Date().toDateString();
    const isNewDay = userProgress.lastPlayDate !== today;
    
    setUserProgress(prev => ({
      ...prev,
      xp: prev.xp + result.xpEarned,
      level: Math.floor((prev.xp + result.xpEarned) / 100) + 1,
      streak: isNewDay ? prev.streak + 1 : prev.streak,
      lastPlayDate: today,
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + result.score
    }));

    setShowGameModal(false);
    setSelectedGame(null);
  };

  const openGame = (game: any) => {
    setSelectedGame(game);
    setShowGameModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <ProgressHeader userProgress={userProgress} />
        <DailyChallenge userProgress={userProgress} onPlayGame={openGame} />
        <GameFeed onPlayGame={openGame} />
        
        {showGameModal && selectedGame && (
          <GameModal
            game={selectedGame}
            onComplete={handleGameComplete}
            onClose={() => {
              setShowGameModal(false);
              setSelectedGame(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
