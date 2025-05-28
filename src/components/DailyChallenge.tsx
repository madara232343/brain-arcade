
import React from 'react';
import { Calendar, Play, Flame, Star, Trophy, Gift } from 'lucide-react';
import { UserProgress } from '@/pages/Index';

interface DailyChallengeProps {
  userProgress: UserProgress;
  onPlayGame: (game: any) => void;
}

const dailyChallenges = [
  {
    id: 'daily-memory-master',
    title: 'Memory Master Challenge',
    description: 'Complete 3 memory games in a row without mistakes',
    type: 'memory',
    difficulty: 'hard',
    xpReward: 100,
    bonusReward: 'Memory Champion Badge'
  },
  {
    id: 'daily-speed-demon',
    title: 'Speed Demon Challenge',
    description: 'Beat your best reaction time 5 times',
    type: 'speed',
    difficulty: 'medium',
    xpReward: 75,
    bonusReward: 'Lightning Badge'
  },
  {
    id: 'daily-math-wizard',
    title: 'Math Wizard Challenge',
    description: 'Solve 50 math problems with 95% accuracy',
    type: 'math',
    difficulty: 'hard',
    xpReward: 120,
    bonusReward: 'Calculator Master Badge'
  },
  {
    id: 'daily-pattern-genius',
    title: 'Pattern Genius Challenge',
    description: 'Complete pattern matching in under 30 seconds',
    type: 'pattern',
    difficulty: 'medium',
    xpReward: 80,
    bonusReward: 'Pattern Expert Badge'
  }
];

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ userProgress, onPlayGame }) => {
  const today = new Date().toDateString();
  const hasPlayedToday = userProgress.lastPlayDate === today;
  
  // Rotate daily challenge based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const todaysChallenge = dailyChallenges[dayOfYear % dailyChallenges.length];

  const getStreakColor = () => {
    if (userProgress.streak >= 30) return 'from-purple-500 to-pink-500';
    if (userProgress.streak >= 14) return 'from-yellow-500 to-orange-500';
    if (userProgress.streak >= 7) return 'from-green-500 to-blue-500';
    return 'from-orange-500 to-pink-500';
  };

  const getStreakEmoji = () => {
    if (userProgress.streak >= 30) return '🏆';
    if (userProgress.streak >= 14) return '⭐';
    if (userProgress.streak >= 7) return '🔥';
    return '✨';
  };

  const dailyGame = {
    ...todaysChallenge,
    isDailyChallenge: true
  };

  return (
    <div className={`bg-gradient-to-r ${getStreakColor()} rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-2xl animate-fade-in hover:scale-[1.02] transition-all duration-300`}>
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 animate-pulse" />
            <div>
              <h2 className="text-3xl font-bold">Daily Challenge</h2>
              <p className="text-white/90 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <Flame className="h-6 w-6 animate-pulse" />
                <span className="font-bold text-xl">{userProgress.streak}</span>
              </div>
              <p className="text-xs mt-1 opacity-90">day streak</p>
            </div>
            <div className="text-4xl animate-bounce">
              {getStreakEmoji()}
            </div>
          </div>
        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <Trophy className="h-6 w-6 text-yellow-300" />
            <h3 className="text-xl font-bold">{todaysChallenge.title}</h3>
          </div>
          <p className="text-lg mb-4 opacity-95">
            {todaysChallenge.description}
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">{todaysChallenge.difficulty}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
              <Gift className="h-4 w-4" />
              <span className="text-sm font-medium">+{todaysChallenge.xpReward} XP</span>
            </div>
            <div className="bg-yellow-500/20 rounded-lg px-3 py-2">
              <span className="text-sm font-medium text-yellow-200">{todaysChallenge.bonusReward}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-lg font-semibold opacity-95">
              Keep your streak alive! 🚀
            </p>
            <p className="text-sm opacity-80">
              Complete daily challenges to earn bonus rewards and maintain your streak.
            </p>
          </div>
          
          <button
            onClick={() => onPlayGame(dailyGame)}
            className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              hasPlayedToday
                ? 'bg-white/20 text-white/70 cursor-not-allowed'
                : 'bg-white text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl'
            }`}
            disabled={hasPlayedToday}
          >
            <Play className={`h-6 w-6 ${hasPlayedToday ? '' : 'animate-pulse'}`} />
            <span className="text-lg">
              {hasPlayedToday ? 'Completed! ✓' : 'Start Challenge'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
