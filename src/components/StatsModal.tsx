
import React from 'react';
import { X, TrendingUp, Target, Zap, Trophy, Calendar, Award } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface UserProgress {
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
}

interface StatsModalProps {
  userProgress: UserProgress;
  onClose: () => void;
  gameStats: any[];
}

export const StatsModal: React.FC<StatsModalProps> = ({ userProgress, onClose, gameStats }) => {
  const weeklyData = [
    { day: 'Mon', xp: 120, games: 8 },
    { day: 'Tue', xp: 85, games: 6 },
    { day: 'Wed', xp: 150, games: 10 },
    { day: 'Thu', xp: 95, games: 7 },
    { day: 'Fri', xp: 180, games: 12 },
    { day: 'Sat', xp: 200, games: 15 },
    { day: 'Sun', xp: 165, games: 11 }
  ];

  const gameTypeData = [
    { name: 'Memory', value: 30, color: '#8884d8' },
    { name: 'Math', value: 25, color: '#82ca9d' },
    { name: 'Speed', value: 20, color: '#ffc658' },
    { name: 'Pattern', value: 15, color: '#ff7300' },
    { name: 'Other', value: 10, color: '#0088fe' }
  ];

  const performanceData = [
    { game: 'Memory', accuracy: 85, avgScore: 450 },
    { game: 'Math', accuracy: 92, avgScore: 380 },
    { game: 'Speed', accuracy: 78, avgScore: 520 },
    { game: 'Pattern', accuracy: 88, avgScore: 410 }
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-white/30 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Performance Stats</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userProgress.level}</div>
              <div className="text-sm text-white/70">Current Level</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <Zap className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userProgress.totalXP}</div>
              <div className="text-sm text-white/70">Total XP</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userProgress.gamesPlayed.length}</div>
              <div className="text-sm text-white/70">Games Played</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <Award className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userProgress.streak}</div>
              <div className="text-sm text-white/70">Day Streak</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Weekly Progress */}
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Weekly Progress</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="xp" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Game Distribution */}
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Game Types Played</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={gameTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {gameTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance by Game Type */}
          <div className="bg-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Performance by Game Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="game" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="accuracy" fill="#8884d8" />
                <Bar dataKey="avgScore" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
