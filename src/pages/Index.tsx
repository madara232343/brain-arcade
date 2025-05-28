
import React, { useState, useEffect } from 'react';
import { GameFeed } from '@/components/GameFeed';
import { DailyChallenge } from '@/components/DailyChallenge';
import { ProgressHeader } from '@/components/ProgressHeader';
import { GameModal } from '@/components/GameModal';
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
    playedGames: []
  });

  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showGameModal, setShowGameModal] = useState(false);

  const handleGameComplete = (result: GameResult) => {
    const today = new Date().toDateString();
    const isNewDay = userProgress.lastPlayDate !== today;
    
    // Calculate new level (every 100 XP = 1 level)
    const newXP = userProgress.xp + result.xpEarned;
    const newLevel = Math.floor(newXP / 100) + 1;
    
    // Update played games list
    const updatedPlayedGames = [...userProgress.playedGames];
    if (!updatedPlayedGames.includes(result.gameId)) {
      updatedPlayedGames.push(result.gameId);
    }
    
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

  const openGame = (game: any) => {
    audioManager.play('click');
    setSelectedGame(game);
    setShowGameModal(true);
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
        <ProgressHeader userProgress={userProgress} />
        <DailyChallenge userProgress={userProgress} onPlayGame={openGame} />
        <GameFeed onPlayGame={openGame} playedGames={userProgress.playedGames} />
        
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
      </div>
    </div>
  );
};

export default Index;
