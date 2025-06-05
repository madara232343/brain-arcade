
import React from 'react';
import { Zap, Trophy, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gameData } from '@/data/gameData';
import { UserProgress } from '@/pages/Games';

interface DailyChallengeProps {
  userProgress: UserProgress;
  onPlayGame?: (game: any) => void;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ userProgress }) => {
  // Get a deterministic "random" game based on the date
  const getGameOfTheDay = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const gameIndex = dayOfYear % gameData.length;
    return gameData[gameIndex];
  };

  const gameOfTheDay = getGameOfTheDay();
  const IconComponent = gameOfTheDay.icon;
  
  // Check if user has already played the daily challenge
  const hasDailyChallenge = userProgress.lastPlayDate === new Date().toDateString() &&
    userProgress.playedGames?.includes(gameOfTheDay.id);

  return (
    <div className="bg-gradient-to-r from-blue-900/70 to-purple-900/70 backdrop-blur-lg rounded-xl p-4 border border-white/20 mb-6 animate-fade-in">
      <div className="flex items-center mb-3">
        <div className="p-2 bg-yellow-500 rounded-lg mr-3">
          <Calendar className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Daily Challenge</h2>
          <p className="text-white/70 text-sm">Extra XP for completing today's challenge!</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mt-3">
        <div className="flex items-center mb-3 md:mb-0">
          <div className="mr-3 p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <IconComponent className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-white">{gameOfTheDay.title}</h3>
            <p className="text-white/70 text-sm line-clamp-1">{gameOfTheDay.description}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          {hasDailyChallenge ? (
            <div className="flex items-center text-green-400">
              <Trophy className="h-5 w-5 mr-2" />
              <span className="font-medium">Complete!</span>
            </div>
          ) : (
            <Link
              to={`/game/${gameOfTheDay.id}`}
              className="flex items-center bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              <Zap className="h-4 w-4 mr-2" />
              <span>Play Challenge</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
