
import React, { useState, useCallback } from 'react';
import { GameModal } from '@/components/GameModal';
import { Brain, Zap, Timer, Car, Target, Gamepad, Crown, Lightbulb, Search, Filter } from 'lucide-react';
import { GameResult } from '@/types/game';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Game categories with improved mobile-responsive design
const gameCategories = [
  {
    id: 'memory',
    name: 'Memory',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    description: 'Test and improve your memory',
    games: [
      { id: 'memory-sequence', title: 'Memory Sequence', description: 'Remember color patterns', icon: Brain, difficulty: 'Medium' },
      { id: 'color-memory', title: 'Color Memory', description: 'Advanced pattern recognition', icon: Brain, difficulty: 'Hard' },
      { id: 'simon-says', title: 'Simon Says', description: 'Follow the sequence', icon: Brain, difficulty: 'Easy' },
      { id: 'memory-cards', title: 'Memory Cards', description: 'Match pairs of cards', icon: Brain, difficulty: 'Medium' },
      { id: 'number-memory', title: 'Number Memory', description: 'Remember number sequences', icon: Brain, difficulty: 'Hard' },
      { id: 'word-memory', title: 'Word Memory', description: 'Associate and recall words', icon: Brain, difficulty: 'Medium' },
      { id: 'face-memory', title: 'Face Memory', description: 'Remember faces and patterns', icon: Brain, difficulty: 'Hard' },
      { id: 'spatial-memory', title: 'Spatial Memory', description: 'Remember locations', icon: Brain, difficulty: 'Medium' },
      { id: 'visual-memory', title: 'Visual Memory', description: 'Visual attention tasks', icon: Brain, difficulty: 'Easy' }
    ]
  },
  {
    id: 'puzzle',
    name: 'Puzzle',
    icon: Lightbulb,
    color: 'from-blue-500 to-indigo-500',
    description: 'Challenge your problem-solving',
    games: [
      { id: 'puzzle-blocks', title: 'Puzzle Blocks', description: 'Arrange blocks strategically', icon: Lightbulb, difficulty: 'Medium' },
      { id: 'spatial-reasoning', title: 'Spatial Reasoning', description: '3D thinking challenges', icon: Lightbulb, difficulty: 'Hard' },
      { id: 'shape-rotator', title: 'Shape Rotator', description: 'Rotate shapes to match', icon: Lightbulb, difficulty: 'Medium' },
      { id: 'pattern-match', title: 'Pattern Match', description: 'Find matching patterns', icon: Lightbulb, difficulty: 'Easy' },
      { id: 'sudoku', title: 'Sudoku', description: '4x4 number puzzle game', icon: Lightbulb, difficulty: 'Hard' },
      { id: 'maze-solver', title: 'Maze Runner', description: 'Navigate through mazes', icon: Lightbulb, difficulty: 'Medium' },
      { id: 'brain-teaser', title: 'Brain Teaser', description: 'Logic and reasoning', icon: Lightbulb, difficulty: 'Hard' },
      { id: 'logic-puzzle', title: 'Logic Puzzle', description: 'Solve logical problems', icon: Lightbulb, difficulty: 'Hard' },
      { id: 'number-puzzle', title: 'Number Puzzle', description: 'Mathematical sequences', icon: Lightbulb, difficulty: 'Medium' }
    ]
  },
  {
    id: 'speed',
    name: 'Speed',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    description: 'Test your reaction time',
    games: [
      { id: 'reaction-time', title: 'Reaction Time', description: 'Test your reflexes', icon: Zap, difficulty: 'Easy' },
      { id: 'speed-typing', title: 'Speed Typing', description: 'Type as fast as possible', icon: Zap, difficulty: 'Medium' },
      { id: 'math-sprint', title: 'Math Sprint', description: 'Quick math calculations', icon: Zap, difficulty: 'Medium' },
      { id: 'quick-math', title: 'Quick Math', description: 'Rapid arithmetic', icon: Zap, difficulty: 'Easy' },
      { id: 'word-scramble', title: 'Word Scramble', description: 'Unscramble words quickly', icon: Zap, difficulty: 'Medium' }
    ]
  },
  {
    id: 'racing',
    name: 'Racing',
    icon: Car,
    color: 'from-green-500 to-teal-500',
    description: 'High-speed challenges',
    games: [
      { id: 'space-race', title: 'Space Racer', description: 'Navigate through space obstacles', icon: Car, difficulty: 'Medium' }
    ]
  },
  {
    id: 'shooting',
    name: 'Shooting',
    icon: Target,
    color: 'from-red-500 to-pink-500',
    description: 'Aim and shoot games',
    games: [
      { id: 'bubble-shooter', title: 'Bubble Shooter', description: 'Match colored bubbles', icon: Target, difficulty: 'Easy' }
    ]
  },
  {
    id: 'arcade',
    name: 'Arcade',
    icon: Gamepad,
    color: 'from-indigo-500 to-purple-500',
    description: 'Classic arcade games',
    games: [
      { id: 'snake-game', title: 'Snake Game', description: 'Classic snake gameplay', icon: Gamepad, difficulty: 'Medium' },
      { id: 'tetris', title: 'Tetris', description: 'Block stacking puzzle', icon: Gamepad, difficulty: 'Hard' }
    ]
  },
  {
    id: 'strategy',
    name: 'Strategy',
    icon: Crown,
    color: 'from-gray-500 to-slate-600',
    description: 'Strategic thinking games',
    games: [
      { id: 'chess', title: 'Chess', description: 'Classic strategy game', icon: Crown, difficulty: 'Hard' },
      { id: 'tic-tac-toe', title: 'Tic Tac Toe', description: 'Strategic placement', icon: Crown, difficulty: 'Easy' }
    ]
  },
  {
    id: 'intelligence',
    name: 'Intelligence',
    icon: Brain,
    color: 'from-cyan-500 to-blue-500',
    description: 'IQ and cognitive tests',
    games: [
      { id: 'iq-test', title: 'IQ Test', description: 'Comprehensive intelligence test', icon: Brain, difficulty: 'Expert' },
      { id: 'eq-test', title: 'EQ Test', description: 'Emotional intelligence test', icon: Brain, difficulty: 'Medium' }
    ]
  }
];

const Games: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userProgress, setUserProgress] = useLocalStorage('userProgress', {
    totalScore: 0,
    totalXP: 0,
    level: 1,
    gamesPlayed: [],
    achievements: [],
    rank: 'Beginner',
    streak: 0,
    purchasedItems: [],
    activePowerUps: []
  });

  // Get all games from all categories
  const allGames = gameCategories.flatMap(category => 
    category.games.map(game => ({ ...game, category: category.id }))
  );

  // Filter games based on category and search
  const filteredCategories = gameCategories.filter(category => {
    const matchesCategory = selectedCategory === 'all' || category.id === selectedCategory;
    const hasMatchingGames = category.games.some(game => 
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesCategory && (searchTerm === '' || hasMatchingGames);
  });

  const handleGameComplete = useCallback((result: GameResult) => {
    const currentTime = new Date().toISOString();
    const newUserProgress = {
      ...userProgress,
      totalScore: userProgress.totalScore + result.score,
      totalXP: userProgress.totalXP + result.xpEarned,
      gamesPlayed: [...userProgress.gamesPlayed, result.gameId],
      lastPlayDate: currentTime
    };

    // Level up logic
    const newLevel = Math.floor(newUserProgress.totalXP / 1000) + 1;
    if (newLevel > userProgress.level) {
      newUserProgress.level = newLevel;
    }

    setUserProgress(newUserProgress);
    setSelectedGame(null);
  }, [userProgress, setUserProgress]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-orange-500';
      case 'Expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const activePowerUps = new Set(userProgress.activePowerUps || []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎮 Brain Games Arena
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
            Challenge your mind with our collection of brain training games
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Category Filter - Horizontal Scroll on Mobile */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            <Filter className="text-white/70 h-5 w-5 flex-shrink-0" />
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white text-purple-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              All ({allGames.length})
            </button>
            {gameCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-white text-purple-900'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {category.name} ({category.games.length})
              </button>
            ))}
          </div>
        </div>

        {/* Game Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category) => {
            const IconComponent = category.icon;
            const filteredGames = category.games.filter(game =>
              searchTerm === '' || 
              game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              game.description.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredGames.length === 0) return null;

            return (
              <div key={category.id} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">{category.name}</h2>
                    <p className="text-white/70 text-sm md:text-base">{category.description}</p>
                  </div>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {filteredGames.map((game) => {
                    const GameIcon = game.icon;
                    
                    return (
                      <div
                        key={game.id}
                        onClick={() => setSelectedGame(game)}
                        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 cursor-pointer group"
                      >
                        <div className="text-center">
                          <div className={`inline-flex p-3 rounded-xl mb-3 bg-gradient-to-r ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                            <GameIcon className="h-6 w-6 text-white" />
                          </div>
                          
                          <h3 className="text-white font-bold text-sm md:text-base mb-2 line-clamp-2">{game.title}</h3>
                          <p className="text-white/70 text-xs mb-3 line-clamp-2">{game.description}</p>
                          
                          <div className="flex items-center justify-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getDifficultyColor(game.difficulty)}`}>
                              {game.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Games Found</h3>
            <p className="text-white/70">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Game Modal */}
        {selectedGame && (
          <GameModal
            game={selectedGame}
            onComplete={handleGameComplete}
            onClose={() => setSelectedGame(null)}
            activePowerUps={activePowerUps}
            onPowerUpUsed={(type) => {
              setUserProgress(prev => ({
                ...prev,
                activePowerUps: prev.activePowerUps.filter(item => item !== type)
              }));
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Games;
