
import React, { useState } from 'react';
import { Search, Filter, Clock, Trophy, Box, Gamepad2, Brain, Zap, Target, Palette, Layers, RotateCw, Map, Building, Orbit } from 'lucide-react';

interface GameFeedProps {
  onPlayGame: (game: any) => void;
  playedGames: string[];
}

const games = [
  // 2D Games
  { id: 'memory-sequence', title: 'Memory Sequence', description: 'Remember and repeat sequences', icon: Brain, category: '2D', difficulty: 'Easy', estimatedTime: '2-3 min', type: 'memory' },
  { id: 'color-memory', title: 'Color Memory', description: 'Match colors in sequence', icon: Palette, category: '2D', difficulty: 'Easy', estimatedTime: '2-3 min', type: 'memory' },
  { id: 'math-sprint', title: 'Math Sprint', description: 'Solve math problems quickly', icon: Zap, category: '2D', difficulty: 'Medium', estimatedTime: '3-5 min', type: 'logic' },
  { id: 'reaction-time', title: 'Reaction Time', description: 'Test your reflexes', icon: Target, category: '2D', difficulty: 'Easy', estimatedTime: '1-2 min', type: 'speed' },
  { id: 'pattern-match', title: 'Pattern Match', description: 'Find matching patterns', icon: Layers, category: '2D', difficulty: 'Medium', estimatedTime: '3-4 min', type: 'visual' },
  { id: 'speed-typing', title: 'Speed Typing', description: 'Type words as fast as you can', icon: Gamepad2, category: '2D', difficulty: 'Medium', estimatedTime: '2-3 min', type: 'speed' },
  { id: 'visual-attention', title: 'Visual Attention', description: 'Focus on specific visual elements', icon: Target, category: '2D', difficulty: 'Hard', estimatedTime: '4-5 min', type: 'attention' },
  { id: 'word-association', title: 'Word Association', description: 'Connect related words', icon: Brain, category: '2D', difficulty: 'Medium', estimatedTime: '3-4 min', type: 'language' },
  { id: 'number-sequence', title: 'Number Sequence', description: 'Complete number patterns', icon: Zap, category: '2D', difficulty: 'Hard', estimatedTime: '4-6 min', type: 'logic' },
  { id: 'simon-says', title: 'Simon Says', description: 'Follow the sequence of commands', icon: Gamepad2, category: '2D', difficulty: 'Medium', estimatedTime: '3-5 min', type: 'memory' },
  { id: 'memory-cards', title: 'Memory Cards', description: 'Match pairs of cards', icon: Brain, category: '2D', difficulty: 'Easy', estimatedTime: '2-4 min', type: 'memory' },

  // 3D Games
  { id: 'spatial-reasoning', title: 'Spatial Reasoning', description: 'Solve 3D spatial puzzles', icon: Box, category: '3D', difficulty: 'Hard', estimatedTime: '5-7 min', type: 'spatial' },
  { id: 'puzzle-blocks', title: 'Puzzle Blocks', description: 'Arrange 3D blocks to solve puzzles', icon: Box, category: '3D', difficulty: 'Medium', estimatedTime: '4-6 min', type: 'spatial' },
  { id: 'shape-rotator', title: 'Shape Rotator', description: 'Rotate 3D shapes to match targets', icon: RotateCw, category: '3D', difficulty: 'Medium', estimatedTime: '3-5 min', type: 'spatial' },
  { id: 'maze-runner', title: 'Maze Runner', description: 'Navigate through 3D mazes', icon: Map, category: '3D', difficulty: 'Hard', estimatedTime: '5-8 min', type: 'navigation' },
  { id: 'tower-builder', title: 'Tower Builder', description: 'Stack 3D blocks to build towers', icon: Building, category: '3D', difficulty: 'Medium', estimatedTime: '4-6 min', type: 'strategy' },
  { id: 'cube-matcher', title: 'Cube Matcher', description: 'Match 3D cube patterns', icon: Box, category: '3D', difficulty: 'Hard', estimatedTime: '5-7 min', type: 'pattern' },
  { id: 'orbit-navigator', title: 'Orbit Navigator', description: 'Navigate objects in 3D space', icon: Orbit, category: '3D', difficulty: 'Hard', estimatedTime: '6-8 min', type: 'spatial' }
];

export const GameFeed: React.FC<GameFeedProps> = ({ onPlayGame, playedGames = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const categories = ['All', '2D', '3D'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || game.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '2D': return 'text-blue-400 bg-blue-400/20';
      case '3D': return 'text-purple-400 bg-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const twoDGames = filteredGames.filter(game => game.category === '2D');
  const threeDGames = filteredGames.filter(game => game.category === '3D');

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">🎮 Game Library</h2>
          <p className="text-white/70">Choose from {games.length} brain training games</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/10 border border-white/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-200 w-full sm:w-48"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-gray-800 text-white">
                {category}
              </option>
            ))}
          </select>
          
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty} className="bg-gray-800 text-white">
                {difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2D Games Section */}
      {(selectedCategory === 'All' || selectedCategory === '2D') && twoDGames.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Gamepad2 className="h-6 w-6 mr-2 text-blue-400" />
            2D Games
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {twoDGames.map((game) => {
              const IconComponent = game.icon;
              const isPlayed = playedGames.includes(game.id);
              
              return (
                <div
                  key={game.id}
                  onClick={() => onPlayGame(game)}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer hover:scale-105 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    {isPlayed && (
                      <Trophy className="h-5 w-5 text-yellow-400" />
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-200">
                    {game.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{game.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(game.category)}`}>
                      {game.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {game.estimatedTime}
                    </div>
                    <span className="capitalize">{game.type}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3D Games Section */}
      {(selectedCategory === 'All' || selectedCategory === '3D') && threeDGames.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Box className="h-6 w-6 mr-2 text-purple-400" />
            3D Games
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {threeDGames.map((game) => {
              const IconComponent = game.icon;
              const isPlayed = playedGames.includes(game.id);
              
              return (
                <div
                  key={game.id}
                  onClick={() => onPlayGame(game)}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer hover:scale-105 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    {isPlayed && (
                      <Trophy className="h-5 w-5 text-yellow-400" />
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-200">
                    {game.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{game.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(game.category)}`}>
                      {game.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {game.estimatedTime}
                    </div>
                    <span className="capitalize">{game.type}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-bold text-white mb-2">No games found</h3>
          <p className="text-white/70">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};
