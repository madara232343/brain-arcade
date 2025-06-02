
import React, { useState } from 'react';
import { Crown, Medal, Trophy, Star, ArrowLeft, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  level: number;
  gamesPlayed: number;
  avatar: string;
  rank: string;
  streak: number;
}

const Leaderboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const [selectedCategory, setSelectedCategory] = useState('total-score');

  // Mock leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    { id: '1', name: 'BrainMaster', score: 89500, level: 45, gamesPlayed: 234, avatar: '🧠', rank: 'Diamond', streak: 28 },
    { id: '2', name: 'LogicKing', score: 76300, level: 38, gamesPlayed: 198, avatar: '👑', rank: 'Platinum', streak: 22 },
    { id: '3', name: 'PuzzleQueen', score: 68900, level: 34, gamesPlayed: 187, avatar: '🎯', rank: 'Platinum', streak: 19 },
    { id: '4', name: 'MindBender', score: 54200, level: 27, gamesPlayed: 156, avatar: '🚀', rank: 'Gold', streak: 15 },
    { id: '5', name: 'ThinkFast', score: 47800, level: 24, gamesPlayed: 143, avatar: '⚡', rank: 'Gold', streak: 12 },
    { id: '6', name: 'SmartCookie', score: 41500, level: 21, gamesPlayed: 129, avatar: '🍪', rank: 'Silver', streak: 10 },
    { id: '7', name: 'BrainWave', score: 38200, level: 19, gamesPlayed: 118, avatar: '🌊', rank: 'Silver', streak: 8 },
    { id: '8', name: 'MindMelt', score: 34700, level: 17, gamesPlayed: 105, avatar: '🔥', rank: 'Silver', streak: 7 },
    { id: '9', name: 'CognitoErgo', score: 29300, level: 15, gamesPlayed: 92, avatar: '🤖', rank: 'Bronze', streak: 5 },
    { id: '10', name: 'YouPlayer', score: 12500, level: 8, gamesPlayed: 45, avatar: '👤', rank: 'Bronze', streak: 3 }
  ];

  const periods = [
    { value: 'all-time', label: 'All Time' },
    { value: 'monthly', label: 'This Month' },
    { value: 'weekly', label: 'This Week' }
  ];

  const categories = [
    { value: 'total-score', label: 'Total Score' },
    { value: 'level', label: 'Level' },
    { value: 'games-played', label: 'Games Played' },
    { value: 'streak', label: 'Streak' }
  ];

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2: return <Medal className="h-6 w-6 text-gray-300" />;
      case 3: return <Trophy className="h-6 w-6 text-amber-600" />;
      default: return <Star className="h-5 w-5 text-blue-400" />;
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Diamond': return 'from-blue-400 to-cyan-400';
      case 'Platinum': return 'from-gray-300 to-gray-400';
      case 'Gold': return 'from-yellow-400 to-yellow-500';
      case 'Silver': return 'from-gray-400 to-gray-500';
      default: return 'from-orange-400 to-orange-500';
    }
  };

  const getSortedData = () => {
    return [...leaderboardData].sort((a, b) => {
      switch (selectedCategory) {
        case 'level': return b.level - a.level;
        case 'games-played': return b.gamesPlayed - a.gamesPlayed;
        case 'streak': return b.streak - a.streak;
        default: return b.score - a.score;
      }
    });
  };

  const sortedData = getSortedData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-48 md:w-80 h-48 md:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              to="/games" 
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors touch-target"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white">🏆 Leaderboard</h1>
              <p className="text-white/70">See how you rank against other players</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-6 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-white font-medium mb-2">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value} className="bg-gray-800 text-white">
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-white font-medium mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value} className="bg-gray-800 text-white">
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {sortedData.slice(0, 3).map((player, index) => {
            const position = index + 1;
            const height = position === 1 ? 'h-24' : position === 2 ? 'h-20' : 'h-16';
            
            return (
              <div key={player.id} className="text-center">
                <div className={`bg-gradient-to-r ${getRankColor(player.rank)} mx-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 shadow-lg`}>
                  {player.avatar}
                </div>
                <div className="text-white font-bold text-sm md:text-base mb-1">{player.name}</div>
                <div className="flex justify-center mb-2">{getRankIcon(position)}</div>
                <div className={`bg-white/20 backdrop-blur-md rounded-lg p-3 ${height} flex flex-col justify-end border border-white/30`}>
                  <div className="text-white font-bold text-lg">#{position}</div>
                  <div className="text-white/80 text-sm">
                    {selectedCategory === 'level' ? `Lv.${player.level}` :
                     selectedCategory === 'games-played' ? `${player.gamesPlayed} games` :
                     selectedCategory === 'streak' ? `${player.streak} days` :
                     `${player.score.toLocaleString()} pts`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-white/20">
            <h2 className="text-xl font-bold text-white">Full Rankings</h2>
          </div>
          
          <div className="divide-y divide-white/10">
            {sortedData.map((player, index) => {
              const position = index + 1;
              const isCurrentUser = player.name === 'YouPlayer';
              
              return (
                <div
                  key={player.id}
                  className={`p-4 md:p-6 hover:bg-white/5 transition-colors ${
                    isCurrentUser ? 'bg-blue-500/20 border-blue-400/30' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 text-white font-bold">
                        {position <= 3 ? getRankIcon(position) : `#${position}`}
                      </div>
                      
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getRankColor(player.rank)} flex items-center justify-center text-xl`}>
                        {player.avatar}
                      </div>
                      
                      <div>
                        <div className="text-white font-bold flex items-center space-x-2">
                          <span>{player.name}</span>
                          {isCurrentUser && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">You</span>
                          )}
                        </div>
                        <div className="text-white/70 text-sm">{player.rank} • Level {player.level}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">
                        {selectedCategory === 'level' ? `Level ${player.level}` :
                         selectedCategory === 'games-played' ? `${player.gamesPlayed} games` :
                         selectedCategory === 'streak' ? `${player.streak} day streak` :
                         `${player.score.toLocaleString()} points`}
                      </div>
                      <div className="text-white/70 text-sm">
                        {selectedCategory !== 'total-score' && `${player.score.toLocaleString()} total points`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Personal Stats */}
        <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">Your Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10th</div>
              <div className="text-white/70 text-sm">Current Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">12,500</div>
              <div className="text-white/70 text-sm">Total Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">Level 8</div>
              <div className="text-white/70 text-sm">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">45</div>
              <div className="text-white/70 text-sm">Games Played</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
