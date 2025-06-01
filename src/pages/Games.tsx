
import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  Target, 
  Puzzle, 
  Crown,
  Car,
  Gamepad2,
  Trophy,
  Clock,
  RotateCcw,
  Compass,
  Box,
  Orbit,
  HeartHandshake,
  Palette,
  Layers3,
  Navigation,
  Eye,
  MapPin,
  Shapes
} from 'lucide-react';
import { GameModal } from '@/components/GameModal';
import { CategoryFilter } from '@/components/CategoryFilter';
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout';
import { ChatBot } from '@/components/ChatBot';
import { GameResult } from '@/types/game';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: React.ComponentType<any>;
  timeEstimate: string;
  xpReward: string;
  bgGradient: string;
}

const games: Game[] = [
  // Memory Games
  {
    id: 'memory-sequence',
    title: 'Memory Sequence',
    description: 'Remember and repeat color sequences',
    category: 'Memory',
    difficulty: 'Medium',
    icon: Brain,
    timeEstimate: '2-3 min',
    xpReward: '80-150 XP',
    bgGradient: 'from-blue-500 to-purple-600'
  },
  {
    id: 'spatial-memory',
    title: 'Spatial Memory',
    description: 'Remember positions and click them in order',
    category: 'Memory',
    difficulty: 'Medium',
    icon: MapPin,
    timeEstimate: '2-4 min',
    xpReward: '90-180 XP',
    bgGradient: 'from-green-500 to-teal-600'
  },
  {
    id: 'color-memory',
    title: 'Color Memory',
    description: 'Memorize and reproduce color patterns',
    category: 'Memory',
    difficulty: 'Easy',
    icon: Palette,
    timeEstimate: '2-3 min',
    xpReward: '60-120 XP',
    bgGradient: 'from-pink-500 to-purple-600'
  },

  // Puzzle Games
  {
    id: 'puzzle-blocks',
    title: 'Puzzle Blocks',
    description: 'Arrange colored blocks to match patterns',
    category: 'Puzzle',
    difficulty: 'Medium',
    icon: Puzzle,
    timeEstimate: '3-5 min',
    xpReward: '100-200 XP',
    bgGradient: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'spatial-reasoning',
    title: 'Spatial Reasoning',
    description: 'Identify rotated shapes and patterns',
    category: 'Puzzle',
    difficulty: 'Hard',
    icon: Shapes,
    timeEstimate: '3-4 min',
    xpReward: '120-240 XP',
    bgGradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'shape-rotator',
    title: 'Shape Rotator',
    description: 'Rotate shapes to match target orientations',
    category: 'Puzzle',
    difficulty: 'Medium',
    icon: RotateCcw,
    timeEstimate: '2-3 min',
    xpReward: '80-160 XP',
    bgGradient: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'maze-runner',
    title: 'Maze Runner',
    description: 'Navigate through complex mazes to reach the exit',
    category: 'Puzzle',
    difficulty: 'Medium',
    icon: Navigation,
    timeEstimate: '3-5 min',
    xpReward: '100-180 XP',
    bgGradient: 'from-green-500 to-emerald-600'
  },

  // Speed Games  
  {
    id: 'reaction-time',
    title: 'Reaction Time',
    description: 'Test your reflexes and reaction speed',
    category: 'Speed',
    difficulty: 'Easy',
    icon: Zap,
    timeEstimate: '1-2 min',
    xpReward: '50-100 XP',
    bgGradient: 'from-red-500 to-orange-600'
  },

  // Strategy Games
  {
    id: 'chess',
    title: 'Chess vs Computer',
    description: 'Play chess against an intelligent AI opponent',
    category: 'Strategy',
    difficulty: 'Hard',
    icon: Crown,
    timeEstimate: '5-10 min',
    xpReward: '150-300 XP',
    bgGradient: 'from-amber-600 to-yellow-600'
  },

  // Racing Games
  {
    id: 'space-race',
    title: 'Space Racer',
    description: 'Navigate through space avoiding obstacles',
    category: 'Racing',
    difficulty: 'Medium',
    icon: Target,
    timeEstimate: '2-4 min',
    xpReward: '80-200 XP',
    bgGradient: 'from-blue-500 to-purple-600'
  },

  // Intelligence Tests
  {
    id: 'enhanced-iq-test',
    title: 'Enhanced IQ Test',
    description: 'Comprehensive intelligence assessment',
    category: 'Intelligence',
    difficulty: 'Hard',
    icon: Brain,
    timeEstimate: '5-8 min',
    xpReward: '200-400 XP',
    bgGradient: 'from-yellow-500 to-orange-600'
  },

  // 3D Games
  {
    id: 'tower-builder',
    title: '3D Tower Builder',
    description: 'Build the tallest stable tower in 3D',
    category: '3D',
    difficulty: 'Medium',
    icon: Layers3,
    timeEstimate: '3-5 min',
    xpReward: '120-250 XP',
    bgGradient: 'from-orange-500 to-red-600'
  },
  {
    id: 'cube-matcher',
    title: 'Cube Matcher',
    description: 'Match 3D cube patterns and colors',
    category: '3D',
    difficulty: 'Medium',
    icon: Box,
    timeEstimate: '2-4 min',
    xpReward: '90-170 XP',
    bgGradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'orbit-navigator',
    title: 'Orbit Navigator',
    description: 'Navigate through complex orbital paths',
    category: '3D',
    difficulty: 'Hard',
    icon: Orbit,
    timeEstimate: '3-6 min',
    xpReward: '140-280 XP',
    bgGradient: 'from-blue-500 to-indigo-600'
  }
];

const categories = ['All', 'Memory', 'Puzzle', 'Speed', 'Strategy', 'Racing', 'Intelligence', '3D'];

export default function Games() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showChatBot, setShowChatBot] = useState(false);
  const [userStats, setUserStats] = useLocalStorage('userStats', {
    totalXP: 0,
    level: 1,
    gamesPlayed: 0,
    totalScore: 0
  });
  const [activePowerUps, setActivePowerUps] = useLocalStorage('activePowerUps', new Set<string>());

  const filteredGames = selectedCategory === 'All' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  const handleGameComplete = (result: GameResult) => {
    setUserStats(prev => ({
      totalXP: prev.totalXP + result.xpEarned,
      level: Math.floor((prev.totalXP + result.xpEarned) / 1000) + 1,
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + result.score
    }));

    toast.success(`Game completed! +${result.xpEarned} XP`, {
      description: `Score: ${result.score} | Accuracy: ${result.accuracy}%`
    });

    setSelectedGame(null);
  };

  const handlePowerUpUsed = (powerUpType: string) => {
    const newActivePowerUps = new Set(activePowerUps);
    newActivePowerUps.delete(powerUpType);
    setActivePowerUps(newActivePowerUps);
  };

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <MobileOptimizedLayout
      currentPage="games"
      onNavigate={handleNavigation}
      onChatOpen={() => setShowChatBot(true)}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            🎮 Brain Games
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Challenge your mind with our collection of brain-training games
          </p>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className="group bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-white/15"
            >
              <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${game.bgGradient} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <game.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                {game.title}
              </h3>
              
              <p className="text-sm md:text-base text-white/70 mb-4 line-clamp-2">
                {game.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className={`font-medium ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                  <span className="text-white/60">{game.timeEstimate}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="text-purple-400 font-medium">{game.category}</span>
                  <span className="text-green-400 font-medium">{game.xpReward}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <Gamepad2 className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <p className="text-xl text-white/60">No games found in this category</p>
          </div>
        )}
      </div>

      {/* Game Modal */}
      {selectedGame && (
        <GameModal
          game={selectedGame}
          onComplete={handleGameComplete}
          onClose={() => setSelectedGame(null)}
          activePowerUps={activePowerUps}
          onPowerUpUsed={handlePowerUpUsed}
        />
      )}

      {/* ChatBot */}
      {showChatBot && (
        <ChatBot onClose={() => setShowChatBot(false)} />
      )}
    </MobileOptimizedLayout>
  );
}
