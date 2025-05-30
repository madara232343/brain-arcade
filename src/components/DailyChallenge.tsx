
import React, { useState, useEffect } from 'react';
import { Calendar, Trophy, Clock, Star, Zap, Gift } from 'lucide-react';

export const DailyChallenge: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [streak, setStreak] = useState(3);
  const [completed, setCompleted] = useState(false);

  const challenges = [
    {
      id: 1,
      title: "Memory Master",
      description: "Complete 3 memory games with 80%+ accuracy",
      reward: "250 XP + Memory Badge",
      difficulty: "Medium",
      icon: "🧠",
      progress: 2,
      total: 3
    },
    {
      id: 2,
      title: "Speed Demon",
      description: "Finish 5 speed games under 30 seconds each",
      reward: "300 XP + Speed Badge",
      difficulty: "Hard",
      icon: "⚡",
      progress: 1,
      total: 5
    },
    {
      id: 3,
      title: "Perfect Score",
      description: "Get 100% accuracy in any puzzle game",
      reward: "400 XP + Perfect Badge",
      difficulty: "Expert",
      icon: "🎯",
      progress: 0,
      total: 1
    }
  ];

  useEffect(() => {
    // Set random daily challenge
    const today = new Date().getDate();
    const challengeIndex = today % challenges.length;
    setCurrentChallenge(challenges[challengeIndex]);

    // Calculate time until next challenge (midnight)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const updateTimer = () => {
      const timeRemaining = tomorrow.getTime() - new Date().getTime();
      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-orange-400';
      case 'Expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20';
      case 'Medium': return 'bg-yellow-500/20';
      case 'Hard': return 'bg-orange-500/20';
      case 'Expert': return 'bg-red-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  if (!currentChallenge) return null;

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-lg rounded-3xl p-4 md:p-6 border border-white/20 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center space-x-3 mb-3 md:mb-0">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Calendar className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white">Daily Challenge</h3>
            <p className="text-white/70 text-xs md:text-sm">Resets in {timeLeft}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-1">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-white text-sm font-bold">{streak} day streak</span>
          </div>
          <div className="p-2 bg-white/10 rounded-lg">
            <Trophy className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Challenge Card */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl md:text-3xl">{currentChallenge.icon}</span>
              <div>
                <h4 className="text-lg md:text-xl font-bold text-white">{currentChallenge.title}</h4>
                <div className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyBg(currentChallenge.difficulty)} ${getDifficultyColor(currentChallenge.difficulty)}`}>
                  {currentChallenge.difficulty}
                </div>
              </div>
            </div>
            
            <p className="text-white/80 mb-4 text-sm md:text-base">{currentChallenge.description}</p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70 text-sm">Progress</span>
                <span className="text-white font-bold text-sm">
                  {currentChallenge.progress}/{currentChallenge.total}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentChallenge.progress / currentChallenge.total) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Reward */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-3">
              <Gift className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
              <span className="text-white font-medium text-sm md:text-base">{currentChallenge.reward}</span>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="mt-4 md:mt-0 md:ml-6">
            {currentChallenge.progress >= currentChallenge.total ? (
              <button 
                className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                onClick={() => setCompleted(true)}
              >
                <Trophy className="h-4 w-4" />
                <span>Claim Reward</span>
              </button>
            ) : (
              <button className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Start Challenge</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Preview */}
      <div className="mt-4 md:mt-6 grid grid-cols-7 gap-1 md:gap-2">
        {Array.from({ length: 7 }).map((_, index) => {
          const isToday = index === new Date().getDay();
          const isCompleted = index < new Date().getDay();
          
          return (
            <div
              key={index}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                isToday 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110' 
                  : isCompleted 
                    ? 'bg-green-500/30 text-green-400' 
                    : 'bg-white/10 text-white/50'
              }`}
            >
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}
            </div>
          );
        })}
      </div>
    </div>
  );
};
