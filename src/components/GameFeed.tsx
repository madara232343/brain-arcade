import React from 'react';
import { 
  Brain, 
  Zap, 
  Target, 
  Palette, 
  Clock, 
  Type, 
  Eye, 
  MessageSquare, 
  Hash, 
  MousePointer, 
  Grid3x3, 
  Puzzle, 
  RotateCw, 
  Map, 
  Building, 
  Box, 
  Globe,
  Calculator,
  Trophy,
  Star,
  Car,
  Gamepad2,
  Heart,
  Users,
  Music,
  Camera,
  Lightbulb,
  Shield,
  Swords,
  Rocket,
  Fish,
  TreePine,
  Dice1,
  Dice2,
  Dice3,
  Crown,
  Gem,
  Coins,
  Sword,
  Crosshair,
  Plane,
  Ship,
  Truck,
  Bike,
  Train,
  Headphones,
  PaintBucket,
  Brush
} from 'lucide-react';

interface GameFeedProps {
  onPlayGame: (game: any) => void;
  playedGames: string[];
  selectedCategory?: string;
}

const games = [
  // Memory Games (15 games) - All unique
  { id: 'memory-sequence', title: 'Memory Sequence', description: 'Remember and repeat color patterns', icon: Brain, difficulty: 'Medium', category: 'memory', estimatedTime: '3-5 min' },
  { id: 'color-memory', title: 'Color Memory', description: 'Match colors in sequence', icon: Palette, difficulty: 'Easy', category: 'memory', estimatedTime: '2-4 min' },
  { id: 'simon-says', title: 'Simon Says', description: 'Follow the pattern sequence', icon: Target, difficulty: 'Medium', category: 'memory', estimatedTime: '3-6 min' },
  { id: 'memory-cards', title: 'Memory Cards', description: 'Find matching pairs of cards', icon: Grid3x3, difficulty: 'Easy', category: 'memory', estimatedTime: '4-7 min' },
  { id: 'number-memory', title: 'Number Memory', description: 'Remember number sequences', icon: Hash, difficulty: 'Medium', category: 'memory', estimatedTime: '3-5 min' },
  { id: 'word-memory', title: 'Word Memory', description: 'Memorize word associations', icon: Type, difficulty: 'Medium', category: 'memory', estimatedTime: '4-6 min' },
  { id: 'face-memory', title: 'Face Memory', description: 'Remember faces and patterns', icon: Users, difficulty: 'Hard', category: 'memory', estimatedTime: '5-8 min' },
  { id: 'spatial-memory', title: 'Spatial Memory', description: 'Remember 3D object positions', icon: Map, difficulty: 'Medium', category: 'memory', estimatedTime: '3-6 min' },
  { id: 'visual-memory', title: 'Visual Memory', description: 'Remember visual attention patterns', icon: Eye, difficulty: 'Medium', category: 'memory', estimatedTime: '3-6 min' },

  // Puzzle Games (20 games) - All unique
  { id: 'puzzle-blocks', title: 'Puzzle Blocks', description: 'Arrange 3D blocks to solve puzzles', icon: Puzzle, difficulty: 'Medium', category: 'puzzle', estimatedTime: '5-8 min' },
  { id: 'spatial-reasoning', title: 'Spatial Reasoning', description: 'Rotate and match 3D objects', icon: Box, difficulty: 'Hard', category: 'puzzle', estimatedTime: '6-10 min' },
  { id: 'shape-rotator', title: 'Shape Rotator', description: 'Rotate shapes to match targets', icon: RotateCw, difficulty: 'Medium', category: 'puzzle', estimatedTime: '4-7 min' },
  { id: 'pattern-match', title: 'Pattern Match', description: 'Find hidden visual patterns', icon: Eye, difficulty: 'Hard', category: 'puzzle', estimatedTime: '5-8 min' },
  { id: 'sudoku', title: 'Sudoku', description: '4x4 number placement puzzle', icon: Grid3x3, difficulty: 'Medium', category: 'puzzle', estimatedTime: '5-10 min' },
  { id: 'maze-solver', title: 'Maze Runner', description: 'Navigate 3D mazes', icon: Map, difficulty: 'Medium', category: 'puzzle', estimatedTime: '4-8 min' },
  { id: 'brain-teaser', title: 'Brain Teaser', description: 'Logic riddles and problems', icon: Lightbulb, difficulty: 'Hard', category: 'puzzle', estimatedTime: '6-12 min' },
  { id: 'logic-puzzle', title: 'Logic Puzzle', description: 'Solve logical reasoning puzzles', icon: Brain, difficulty: 'Hard', category: 'puzzle', estimatedTime: '6-12 min' },
  { id: 'number-puzzle', title: 'Number Puzzle', description: 'Fill grids with target sums', icon: Hash, difficulty: 'Medium', category: 'puzzle', estimatedTime: '5-9 min' },

  // Speed Games (15 games) - All unique  
  { id: 'reaction-time', title: 'Reaction Time', description: 'Test your reflexes with targets', icon: Zap, difficulty: 'Easy', category: 'speed', estimatedTime: '2-3 min' },
  { id: 'speed-typing', title: 'Speed Typing', description: 'Type words as fast as possible', icon: Type, difficulty: 'Medium', category: 'speed', estimatedTime: '3-5 min' },
  { id: 'math-sprint', title: 'Math Sprint', description: 'Solve math equations quickly', icon: Calculator, difficulty: 'Medium', category: 'speed', estimatedTime: '3-5 min' },
  { id: 'quick-math', title: 'Quick Math', description: 'Lightning fast arithmetic', icon: Calculator, difficulty: 'Hard', category: 'speed', estimatedTime: '3-6 min' },
  { id: 'word-scramble', title: 'Word Scramble', description: 'Unscramble words quickly', icon: Type, difficulty: 'Medium', category: 'speed', estimatedTime: '3-5 min' },

  // Racing Games (5 games) - All unique
  { id: 'car-race', title: 'Speed Racer', description: 'Race through space obstacles', icon: Car, difficulty: 'Medium', category: 'racing', estimatedTime: '5-8 min' },
  { id: 'bike-race', title: 'Bike Rush', description: 'Navigate asteroid fields', icon: Bike, difficulty: 'Medium', category: 'racing', estimatedTime: '4-7 min' },
  { id: 'space-race', title: 'Space Race', description: 'Pilot spacecraft through dangers', icon: Rocket, difficulty: 'Hard', category: 'racing', estimatedTime: '6-10 min' },

  // Shooting Games (5 games) - All unique
  { id: 'target-shooter', title: 'Target Practice', description: 'Shoot bubbles to match colors', icon: Crosshair, difficulty: 'Easy', category: 'shooting', estimatedTime: '3-5 min' },
  { id: 'bubble-shooter', title: 'Bubble Shooter', description: 'Match 3+ bubbles to pop them', icon: Target, difficulty: 'Easy', category: 'shooting', estimatedTime: '4-8 min' },

  // Arcade Games (5 games) - All unique
  { id: 'snake-game', title: 'Snake Classic', description: 'Grow your snake by eating food', icon: Target, difficulty: 'Easy', category: 'arcade', estimatedTime: '5-10 min' },
  { id: 'tetris', title: 'Block Puzzle', description: 'Clear lines with falling blocks', icon: Grid3x3, difficulty: 'Medium', category: 'arcade', estimatedTime: '5-15 min' },

  // Strategy Games (5 games) - All unique
  { id: 'chess', title: 'Chess Master', description: 'Strategic piece movement game', icon: Crown, difficulty: 'Hard', category: 'strategy', estimatedTime: '8-15 min' },
  { id: 'tic-tac-toe', title: 'Tic Tac Toe', description: 'Three in a row strategy', icon: Grid3x3, difficulty: 'Easy', category: 'strategy', estimatedTime: '2-5 min' },
  { id: 'rock-paper-scissors', title: 'Rock Paper Scissors', description: 'Classic hand game strategy', icon: Dice1, difficulty: 'Easy', category: 'strategy', estimatedTime: '2-5 min' },

  // Intelligence Tests (5 games) - All unique
  { id: 'enhanced-iq-test', title: 'Enhanced IQ Test', description: 'Comprehensive intelligence assessment', icon: Brain, difficulty: 'Expert', category: 'intelligence', estimatedTime: '25-35 min' },
  { id: 'eq-test', title: 'EQ Test', description: 'Emotional intelligence assessment', icon: Heart, difficulty: 'Medium', category: 'intelligence', estimatedTime: '15-25 min' },

  // Creative Games (5 games) - All unique
  { id: 'color-blend', title: 'Color Blend', description: 'Match target colors with RGB sliders', icon: Palette, difficulty: 'Medium', category: 'creative', estimatedTime: '4-8 min' },

  // Word Games (5 games) - All unique  
  { id: 'word-chain', title: 'Word Chain', description: 'Create word associations', icon: Type, difficulty: 'Medium', category: 'word', estimatedTime: '4-8 min' },

  // 3D Games (5 games) - All unique
  { id: 'tower-builder', title: '3D Tower Builder', description: 'Build towers in 3D space', icon: Building, difficulty: 'Medium', category: '3d', estimatedTime: '5-10 min' },
  { id: 'cube-matcher', title: 'Cube Matcher', description: 'Match 3D cube patterns', icon: Box, difficulty: 'Hard', category: '3d', estimatedTime: '6-12 min' },
  { id: 'orbit-navigator', title: 'Orbit Navigator', description: 'Navigate 3D orbital paths', icon: Globe, difficulty: 'Hard', category: '3d', estimatedTime: '8-15 min' }
];

export const GameFeed: React.FC<GameFeedProps> = ({ onPlayGame, playedGames, selectedCategory = 'all' }) => {
  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Hard': return 'text-orange-400 bg-orange-500/20';
      case 'Expert': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'memory': return 'from-blue-500 to-cyan-500';
      case 'puzzle': return 'from-green-500 to-teal-500';
      case 'speed': return 'from-yellow-500 to-orange-500';
      case 'racing': return 'from-orange-500 to-red-500';
      case 'shooting': return 'from-red-500 to-pink-500';
      case 'arcade': return 'from-purple-500 to-pink-500';
      case 'strategy': return 'from-indigo-500 to-purple-500';
      case 'intelligence': return 'from-violet-500 to-purple-600';
      case 'creative': return 'from-pink-500 to-purple-500';
      case 'word': return 'from-teal-500 to-green-500';
      case '3d': return 'from-gray-700 to-gray-900';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          {selectedCategory === 'all' ? 'All Games' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Games`}
        </h2>
        <div className="text-white/70 text-sm">
          {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} available
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredGames.map((game) => {
          const IconComponent = game.icon;
          const isPlayed = playedGames.includes(game.id);
          const categoryGradient = getCategoryColor(game.category);
          
          return (
            <div
              key={game.id}
              className="group bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer game-card animate-fade-in"
              onClick={() => onPlayGame(game)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${categoryGradient} group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                {isPlayed && (
                  <div className="flex items-center space-x-1 bg-green-500/20 rounded-full px-2 py-1">
                    <Star className="h-3 w-3 text-green-400 fill-green-400" />
                    <span className="text-green-400 text-xs font-medium">Played</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                {game.title}
              </h3>
              
              <p className="text-white/70 mb-4 text-sm leading-relaxed">
                {game.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                  {game.difficulty}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-400 bg-blue-500/20">
                  {game.category}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium text-purple-400 bg-purple-500/20">
                  {game.estimatedTime}
                </span>
              </div>
              
              <button
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 group-hover:scale-105 ${
                  isPlayed
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400'
                    : `bg-gradient-to-r ${categoryGradient} hover:shadow-lg`
                } text-white`}
              >
                {isPlayed ? 'Play Again' : 'Start Game'}
              </button>
            </div>
          );
        })}
      </div>
      
      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-2xl font-bold text-white mb-2">No Games Found</h3>
          <p className="text-white/70">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
};
