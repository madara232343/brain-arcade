
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
  Star
} from 'lucide-react';

interface GameFeedProps {
  onPlayGame: (game: any) => void;
  playedGames: string[];
  selectedCategory?: string;
}

const games = [
  // Memory Games
  { id: 'memory-sequence', title: 'Memory Sequence', description: 'Remember and repeat patterns', icon: Brain, difficulty: 'Medium', category: 'memory', estimatedTime: '3-5 min' },
  { id: 'color-memory', title: 'Color Memory', description: 'Match colors in sequence', icon: Palette, difficulty: 'Easy', category: 'memory', estimatedTime: '2-4 min' },
  { id: 'simon-says', title: 'Simon Says', description: 'Follow the pattern sequence', icon: Target, difficulty: 'Medium', category: 'memory', estimatedTime: '3-6 min' },
  { id: 'memory-cards', title: 'Memory Cards', description: 'Find matching pairs', icon: Grid3x3, difficulty: 'Easy', category: 'memory', estimatedTime: '4-7 min' },
  
  // Puzzle Games
  { id: 'puzzle-blocks', title: 'Puzzle Blocks', description: 'Arrange 3D blocks to solve puzzles', icon: Puzzle, difficulty: 'Medium', category: 'puzzle', estimatedTime: '5-8 min' },
  { id: 'spatial-reasoning', title: 'Spatial Reasoning', description: 'Rotate and match 3D objects', icon: Box, difficulty: 'Hard', category: 'puzzle', estimatedTime: '6-10 min' },
  { id: 'shape-rotator', title: 'Shape Rotator', description: 'Rotate shapes to match targets', icon: RotateCw, difficulty: 'Medium', category: 'puzzle', estimatedTime: '4-7 min' },
  { id: 'pattern-match', title: 'Pattern Match', description: 'Find hidden patterns', icon: Eye, difficulty: 'Hard', category: 'puzzle', estimatedTime: '5-8 min' },
  
  // Speed Games
  { id: 'reaction-time', title: 'Reaction Time', description: 'Test your reflexes', icon: Zap, difficulty: 'Easy', category: 'speed', estimatedTime: '2-3 min' },
  { id: 'speed-typing', title: 'Speed Typing', description: 'Type as fast as you can', icon: Type, difficulty: 'Medium', category: 'speed', estimatedTime: '3-5 min' },
  { id: 'math-sprint', title: 'Math Sprint', description: 'Solve equations quickly', icon: Calculator, difficulty: 'Medium', category: 'speed', estimatedTime: '3-5 min' },
  
  // Reaction Games
  { id: 'visual-attention', title: 'Visual Attention', description: 'Spot differences quickly', icon: Eye, difficulty: 'Medium', category: 'reaction', estimatedTime: '4-6 min' },
  { id: 'word-association', title: 'Word Association', description: 'Connect related words', icon: MessageSquare, difficulty: 'Easy', category: 'reaction', estimatedTime: '3-5 min' },
  { id: 'number-sequence', title: 'Number Sequence', description: 'Complete number patterns', icon: Hash, difficulty: 'Hard', category: 'reaction', estimatedTime: '4-7 min' },
  
  // Racing Games (3D)
  { id: 'maze-runner', title: 'Maze Runner 3D', description: 'Navigate through 3D mazes', icon: Map, difficulty: 'Medium', category: 'racing', estimatedTime: '5-10 min' },
  { id: 'orbit-navigator', title: 'Orbit Navigator', description: 'Navigate through space obstacles', icon: Globe, difficulty: 'Hard', category: 'racing', estimatedTime: '6-12 min' },
  
  // Arcade Games
  { id: 'tower-builder', title: 'Tower Builder 3D', description: 'Build the tallest tower', icon: Building, difficulty: 'Medium', category: 'arcade', estimatedTime: '5-8 min' },
  { id: 'cube-matcher', title: 'Cube Matcher 3D', description: 'Match 3D cubes in space', icon: Box, difficulty: 'Hard', category: 'arcade', estimatedTime: '6-10 min' },
  
  // Strategy Games
  { id: 'iq-test', title: 'IQ Test Challenge', description: 'Comprehensive intelligence assessment', icon: Trophy, difficulty: 'Expert', category: 'strategy', estimatedTime: '15-20 min' }
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
      case 'reaction': return 'from-red-500 to-pink-500';
      case 'racing': return 'from-orange-500 to-red-500';
      case 'arcade': return 'from-purple-500 to-pink-500';
      case 'strategy': return 'from-indigo-500 to-purple-500';
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredGames.map((game) => {
          const IconComponent = game.icon;
          const isPlayed = playedGames.includes(game.id);
          const categoryGradient = getCategoryColor(game.category);
          
          return (
            <div
              key={game.id}
              className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer game-card animate-fade-in"
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
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
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
