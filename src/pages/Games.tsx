import React, { useState } from 'react';
import { GameModal } from '@/components/GameModal';
import { CategoryFilter } from '@/components/CategoryFilter';
import { GameResult } from '@/types/game';
import { Trophy, Clock, Target, Star, Zap, Users } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  icon: string;
  rating: number;
  plays: number;
}

export const Games: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allGames: Game[] = [
    // Memory Games (15 games)
    { id: 'simon-says', title: 'Simon Says', description: 'Follow the color sequence patterns', category: 'memory', difficulty: 'Medium', icon: '🎵', rating: 4.8, plays: 15420 },
    { id: 'memory-cards', title: 'Memory Cards', description: 'Match pairs of hidden cards', category: 'memory', difficulty: 'Easy', icon: '🃏', rating: 4.6, plays: 12340 },
    { id: 'memory-sequence', title: 'Memory Sequence', description: 'Remember and repeat sequences', category: 'memory', difficulty: 'Medium', icon: '🧠', rating: 4.7, plays: 9876 },
    { id: 'number-sequence', title: 'Number Sequence', description: 'Find patterns in number sequences', category: 'memory', difficulty: 'Hard', icon: '🔢', rating: 4.5, plays: 8765 },
    { id: 'pattern-match', title: 'Pattern Match', description: 'Identify matching patterns quickly', category: 'memory', difficulty: 'Medium', icon: '🎯', rating: 4.4, plays: 7654 },
    { id: 'color-memory', title: 'Color Memory', description: 'Remember color sequences', category: 'memory', difficulty: 'Easy', icon: '🌈', rating: 4.3, plays: 6543 },
    { id: 'word-association', title: 'Word Association', description: 'Connect related words', category: 'memory', difficulty: 'Medium', icon: '📝', rating: 4.2, plays: 5432 },
    { id: 'visual-attention', title: 'Visual Attention', description: 'Focus on visual details', category: 'memory', difficulty: 'Hard', icon: '👁️', rating: 4.1, plays: 4321 },
    { id: 'face-memory', title: 'Face Memory', description: 'Remember and recognize faces', category: 'memory', difficulty: 'Medium', icon: '👤', rating: 4.3, plays: 5200 },
    { id: 'sequence-master', title: 'Sequence Master', description: 'Advanced sequence memorization', category: 'memory', difficulty: 'Expert', icon: '🔗', rating: 4.6, plays: 3800 },
    { id: 'memory-matrix', title: 'Memory Matrix', description: 'Remember grid positions', category: 'memory', difficulty: 'Hard', icon: '⬜', rating: 4.4, plays: 4100 },
    { id: 'audio-memory', title: 'Audio Memory', description: 'Remember sound patterns', category: 'memory', difficulty: 'Medium', icon: '🔊', rating: 4.2, plays: 3600 },
    { id: 'story-recall', title: 'Story Recall', description: 'Remember story details', category: 'memory', difficulty: 'Hard', icon: '📖', rating: 4.5, plays: 2900 },
    { id: 'name-game', title: 'Name Game', description: 'Remember names and faces', category: 'memory', difficulty: 'Medium', icon: '🏷️', rating: 4.1, plays: 3200 },
    { id: 'memory-palace', title: 'Memory Palace', description: 'Advanced memory techniques', category: 'memory', difficulty: 'Expert', icon: '🏰', rating: 4.7, plays: 2500 },

    // Puzzle Games (20 games)
    { id: 'tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic strategy game against AI', category: 'puzzle', difficulty: 'Easy', icon: '❌', rating: 4.5, plays: 25000 },
    { id: 'bubble-shooter', title: 'Bubble Shooter', description: 'Match and pop colorful bubbles', category: 'puzzle', difficulty: 'Medium', icon: '🫧', rating: 4.7, plays: 18500 },
    { id: 'cube-matcher', title: 'Cube Matcher', description: 'Match 3D cube patterns', category: 'puzzle', difficulty: 'Hard', icon: '🧊', rating: 4.3, plays: 12000 },
    { id: 'tower-builder', title: 'Tower Builder', description: 'Build the tallest tower', category: 'puzzle', difficulty: 'Medium', icon: '🏗️', rating: 4.4, plays: 9800 },
    { id: 'spatial-reasoning', title: 'Spatial Reasoning', description: 'Solve 3D spatial puzzles', category: 'puzzle', difficulty: 'Expert', icon: '🔷', rating: 4.6, plays: 7500 },
    { id: 'puzzle-blocks', title: 'Puzzle Blocks', description: 'Arrange blocks to solve puzzles', category: 'puzzle', difficulty: 'Medium', icon: '🧩', rating: 4.2, plays: 6200 },
    { id: 'maze-solver', title: 'Maze Solver', description: 'Navigate complex mazes', category: 'puzzle', difficulty: 'Hard', icon: '🌀', rating: 4.3, plays: 8100 },
    { id: 'logic-grid', title: 'Logic Grid', description: 'Solve logical deduction puzzles', category: 'puzzle', difficulty: 'Expert', icon: '📋', rating: 4.5, plays: 5400 },
    { id: 'sliding-puzzle', title: 'Sliding Puzzle', description: 'Rearrange sliding tiles', category: 'puzzle', difficulty: 'Medium', icon: '🔲', rating: 4.1, plays: 7300 },
    { id: 'jigsaw-rush', title: 'Jigsaw Rush', description: 'Complete jigsaw puzzles quickly', category: 'puzzle', difficulty: 'Easy', icon: '🧩', rating: 4.4, plays: 9600 },
    { id: 'sudoku-mini', title: 'Sudoku Mini', description: 'Quick sudoku puzzles', category: 'puzzle', difficulty: 'Hard', icon: '🔢', rating: 4.6, plays: 6800 },
    { id: 'crossword-quick', title: 'Crossword Quick', description: 'Fast crossword challenges', category: 'puzzle', difficulty: 'Medium', icon: '📝', rating: 4.2, plays: 5700 },
    { id: 'tangram-master', title: 'Tangram Master', description: 'Arrange geometric shapes', category: 'puzzle', difficulty: 'Hard', icon: '🔺', rating: 4.3, plays: 4900 },
    { id: 'connect-dots', title: 'Connect Dots', description: 'Connect dots to form shapes', category: 'puzzle', difficulty: 'Easy', icon: '⭕', rating: 4.0, plays: 8200 },
    { id: 'word-ladder', title: 'Word Ladder', description: 'Transform words step by step', category: 'puzzle', difficulty: 'Medium', icon: '🪜', rating: 4.2, plays: 5100 },
    { id: 'block-puzzle', title: 'Block Puzzle', description: 'Fit blocks into grid', category: 'puzzle', difficulty: 'Medium', icon: '🟫', rating: 4.1, plays: 6400 },
    { id: 'rope-puzzle', title: 'Rope Puzzle', description: 'Untangle rope knots', category: 'puzzle', difficulty: 'Hard', icon: '🪢', rating: 4.4, plays: 3800 },
    { id: 'mirror-puzzle', title: 'Mirror Puzzle', description: 'Solve reflection puzzles', category: 'puzzle', difficulty: 'Expert', icon: '🪞', rating: 4.5, plays: 3200 },
    { id: 'gear-puzzle', title: 'Gear Puzzle', description: 'Connect mechanical gears', category: 'puzzle', difficulty: 'Hard', icon: '⚙️', rating: 4.3, plays: 4100 },
    { id: 'crystal-quest', title: 'Crystal Quest', description: 'Collect crystals strategically', category: 'puzzle', difficulty: 'Medium', icon: '💎', rating: 4.2, plays: 5600 },

    // Speed Games (15 games)
    { id: 'reaction-time', title: 'Reaction Time', description: 'Test your reflexes and reaction speed', category: 'speed', difficulty: 'Easy', icon: '⚡', rating: 4.9, plays: 22000 },
    { id: 'speed-typing', title: 'Speed Typing', description: 'Type as fast and accurately as possible', category: 'speed', difficulty: 'Medium', icon: '⌨️', rating: 4.6, plays: 16800 },
    { id: 'math-sprint', title: 'Math Sprint', description: 'Solve math problems quickly', category: 'speed', difficulty: 'Hard', icon: '🔢', rating: 4.4, plays: 11200 },
    { id: 'quick-tap', title: 'Quick Tap', description: 'Tap targets as fast as possible', category: 'speed', difficulty: 'Easy', icon: '👆', rating: 4.3, plays: 9500 },
    { id: 'color-rush', title: 'Color Rush', description: 'Identify colors at high speed', category: 'speed', difficulty: 'Medium', icon: '🎨', rating: 4.2, plays: 8300 },
    { id: 'speed-reader', title: 'Speed Reader', description: 'Read and comprehend quickly', category: 'speed', difficulty: 'Hard', icon: '📚', rating: 4.5, plays: 7400 },
    { id: 'rapid-fire', title: 'Rapid Fire', description: 'Answer questions rapidly', category: 'speed', difficulty: 'Medium', icon: '🔥', rating: 4.3, plays: 9100 },
    { id: 'flash-cards', title: 'Flash Cards', description: 'Memorize cards at speed', category: 'speed', difficulty: 'Easy', icon: '🃏', rating: 4.1, plays: 8700 },
    { id: 'number-crunch', title: 'Number Crunch', description: 'Process numbers quickly', category: 'speed', difficulty: 'Hard', icon: '🧮', rating: 4.4, plays: 6200 },
    { id: 'word-blitz', title: 'Word Blitz', description: 'Find words at lightning speed', category: 'speed', difficulty: 'Medium', icon: '💨', rating: 4.2, plays: 7800 },
    { id: 'symbol-storm', title: 'Symbol Storm', description: 'Match symbols rapidly', category: 'speed', difficulty: 'Easy', icon: '🔣', rating: 4.0, plays: 8900 },
    { id: 'speed-sort', title: 'Speed Sort', description: 'Sort items as fast as possible', category: 'speed', difficulty: 'Medium', icon: '📊', rating: 4.3, plays: 6700 },
    { id: 'reflex-test', title: 'Reflex Test', description: 'Ultimate reflex challenge', category: 'speed', difficulty: 'Expert', icon: '⚡', rating: 4.6, plays: 5300 },
    { id: 'time-attack', title: 'Time Attack', description: 'Race against the clock', category: 'speed', difficulty: 'Hard', icon: '⏰', rating: 4.4, plays: 6100 },
    { id: 'lightning-round', title: 'Lightning Round', description: 'Multi-skill speed test', category: 'speed', difficulty: 'Expert', icon: '⚡', rating: 4.7, plays: 4200 },

    // Racing Games (15 games)
    { id: 'car-racing', title: 'Highway Racer', description: 'Race through traffic at high speed', category: 'racing', difficulty: 'Medium', icon: '🏎️', rating: 4.7, plays: 19500 },
    { id: 'space-race', title: 'Space Race', description: 'Navigate through asteroid fields', category: 'racing', difficulty: 'Hard', icon: '🚀', rating: 4.5, plays: 14200 },
    { id: 'bike-challenge', title: 'Bike Challenge', description: 'Navigate challenging bike courses', category: 'racing', difficulty: 'Medium', icon: '🏍️', rating: 4.3, plays: 10800 },
    { id: 'runner-dash', title: 'Runner Dash', description: 'Endless running adventure', category: 'racing', difficulty: 'Easy', icon: '🏃', rating: 4.4, plays: 12600 },
    { id: 'boat-race', title: 'Boat Race', description: 'High-speed water racing', category: 'racing', difficulty: 'Medium', icon: '🚤', rating: 4.1, plays: 7800 },
    { id: 'sky-racer', title: 'Sky Racer', description: 'Fly through aerial courses', category: 'racing', difficulty: 'Hard', icon: '✈️', rating: 4.4, plays: 9200 },
    { id: 'desert-rally', title: 'Desert Rally', description: 'Off-road desert racing', category: 'racing', difficulty: 'Medium', icon: '🏜️', rating: 4.2, plays: 8100 },
    { id: 'snow-speedway', title: 'Snow Speedway', description: 'Race on icy tracks', category: 'racing', difficulty: 'Hard', icon: '❄️', rating: 4.3, plays: 6900 },
    { id: 'jungle-run', title: 'Jungle Run', description: 'Navigate jungle obstacles', category: 'racing', difficulty: 'Medium', icon: '🌴', rating: 4.1, plays: 7500 },
    { id: 'circuit-master', title: 'Circuit Master', description: 'Professional racing circuits', category: 'racing', difficulty: 'Expert', icon: '🏁', rating: 4.6, plays: 5400 },
    { id: 'drift-king', title: 'Drift King', description: 'Master the art of drifting', category: 'racing', difficulty: 'Hard', icon: '💨', rating: 4.5, plays: 6200 },
    { id: 'turbo-boost', title: 'Turbo Boost', description: 'High-speed turbo racing', category: 'racing', difficulty: 'Medium', icon: '🔥', rating: 4.2, plays: 7700 },
    { id: 'neon-nights', title: 'Neon Nights', description: 'Futuristic night racing', category: 'racing', difficulty: 'Hard', icon: '🌃', rating: 4.4, plays: 5800 },
    { id: 'hover-craft', title: 'Hover Craft', description: 'Anti-gravity racing', category: 'racing', difficulty: 'Expert', icon: '🛸', rating: 4.5, plays: 4100 },
    { id: 'time-trial', title: 'Time Trial', description: 'Beat your best times', category: 'racing', difficulty: 'Medium', icon: '⏱️', rating: 4.3, plays: 6600 },

    // Shooting Games (15 games)
    { id: 'space-shooter', title: 'Space Shooter', description: 'Defend Earth from alien invasion', category: 'shooting', difficulty: 'Medium', icon: '🚀', rating: 4.8, plays: 21000 },
    { id: 'target-practice', title: 'Target Practice', description: 'Improve your aiming accuracy', category: 'shooting', difficulty: 'Easy', icon: '🎯', rating: 4.5, plays: 15600 },
    { id: 'zombie-defense', title: 'Zombie Defense', description: 'Survive the zombie apocalypse', category: 'shooting', difficulty: 'Hard', icon: '🧟', rating: 4.6, plays: 17800 },
    { id: 'laser-blaster', title: 'Laser Blaster', description: 'Futuristic laser combat', category: 'shooting', difficulty: 'Medium', icon: '🔫', rating: 4.3, plays: 11400 },
    { id: 'duck-hunt', title: 'Duck Hunt', description: 'Classic duck hunting game', category: 'shooting', difficulty: 'Easy', icon: '🦆', rating: 4.2, plays: 9200 },
    { id: 'asteroid-blast', title: 'Asteroid Blast', description: 'Destroy incoming asteroids', category: 'shooting', difficulty: 'Medium', icon: '☄️', rating: 4.4, plays: 12100 },
    { id: 'sniper-elite', title: 'Sniper Elite', description: 'Precision long-range shooting', category: 'shooting', difficulty: 'Expert', icon: '🔭', rating: 4.7, plays: 8300 },
    { id: 'cannon-blast', title: 'Cannon Blast', description: 'Artillery shooting challenge', category: 'shooting', difficulty: 'Hard', icon: '🔫', rating: 4.3, plays: 7600 },
    { id: 'bow-master', title: 'Bow Master', description: 'Archery precision test', category: 'shooting', difficulty: 'Medium', icon: '🏹', rating: 4.5, plays: 9800 },
    { id: 'plasma-storm', title: 'Plasma Storm', description: 'Energy weapon combat', category: 'shooting', difficulty: 'Hard', icon: '⚡', rating: 4.4, plays: 6700 },
    { id: 'tank-battle', title: 'Tank Battle', description: 'Armored vehicle combat', category: 'shooting', difficulty: 'Medium', icon: '🛡️', rating: 4.2, plays: 8900 },
    { id: 'missile-command', title: 'Missile Command', description: 'Defend cities from missiles', category: 'shooting', difficulty: 'Hard', icon: '🚀', rating: 4.5, plays: 7200 },
    { id: 'alien-invasion', title: 'Alien Invasion', description: 'Repel alien attackers', category: 'shooting', difficulty: 'Expert', icon: '👽', rating: 4.6, plays: 5900 },
    { id: 'western-duel', title: 'Western Duel', description: 'Old west gunslinger duel', category: 'shooting', difficulty: 'Medium', icon: '🤠', rating: 4.3, plays: 6400 },
    { id: 'robot-wars', title: 'Robot Wars', description: 'Mechanical combat arena', category: 'shooting', difficulty: 'Hard', icon: '🤖', rating: 4.4, plays: 5100 },

    // Arcade Games (10 games)
    { id: 'snake', title: 'Snake Classic', description: 'Eat food and grow your snake', category: 'arcade', difficulty: 'Easy', icon: '🐍', rating: 4.8, plays: 28000 },
    { id: 'platformer', title: 'Platform Runner', description: 'Jump and collect coins', category: 'arcade', difficulty: 'Medium', icon: '🏃', rating: 4.6, plays: 16500 },
    { id: 'brick-breaker', title: 'Brick Breaker', description: 'Break all the colorful bricks', category: 'arcade', difficulty: 'Medium', icon: '🧱', rating: 4.4, plays: 13200 },
    { id: 'pac-maze', title: 'Pac Maze', description: 'Navigate mazes and collect dots', category: 'arcade', difficulty: 'Easy', icon: '👻', rating: 4.7, plays: 20300 },
    { id: 'fruit-ninja', title: 'Fruit Slicer', description: 'Slice flying fruits', category: 'arcade', difficulty: 'Easy', icon: '🥝', rating: 4.5, plays: 18700 },
    { id: 'pinball-master', title: 'Pinball Master', description: 'Classic pinball action', category: 'arcade', difficulty: 'Medium', icon: '🕹️', rating: 4.3, plays: 11800 },
    { id: 'asteroid-dodge', title: 'Asteroid Dodge', description: 'Navigate through space debris', category: 'arcade', difficulty: 'Hard', icon: '💫', rating: 4.4, plays: 9600 },
    { id: 'bubble-pop', title: 'Bubble Pop', description: 'Pop bubbles for points', category: 'arcade', difficulty: 'Easy', icon: '🫧', rating: 4.2, plays: 14200 },
    { id: 'gem-collector', title: 'Gem Collector', description: 'Collect precious gems', category: 'arcade', difficulty: 'Medium', icon: '💎', rating: 4.3, plays: 8700 },
    { id: 'retro-rally', title: 'Retro Rally', description: 'Classic arcade racing', category: 'arcade', difficulty: 'Medium', icon: '🚗', rating: 4.5, plays: 10300 },

    // Strategy Games (10 games)
    { id: 'rock-paper-scissors', title: 'Rock Paper Scissors', description: 'Classic hand game against AI', category: 'strategy', difficulty: 'Easy', icon: '✂️', rating: 4.3, plays: 14500 },
    { id: 'chess-mini', title: 'Chess Mini', description: 'Quick chess puzzles', category: 'strategy', difficulty: 'Expert', icon: '♟️', rating: 4.7, plays: 8900 },
    { id: 'towers-defense', title: 'Towers Defense', description: 'Defend your base strategically', category: 'strategy', difficulty: 'Hard', icon: '🏰', rating: 4.5, plays: 11700 },
    { id: 'mind-reader', title: 'Mind Reader', description: 'Predict AI patterns', category: 'strategy', difficulty: 'Medium', icon: '🔮', rating: 4.2, plays: 6800 },
    { id: 'checkers-pro', title: 'Checkers Pro', description: 'Classic checkers strategy', category: 'strategy', difficulty: 'Medium', icon: '⚫', rating: 4.4, plays: 7300 },
    { id: 'connect-four', title: 'Connect Four', description: 'Connect four in a row', category: 'strategy', difficulty: 'Easy', icon: '🔴', rating: 4.1, plays: 9400 },
    { id: 'battle-ships', title: 'Battle Ships', description: 'Naval strategy warfare', category: 'strategy', difficulty: 'Medium', icon: '⚓', rating: 4.3, plays: 6100 },
    { id: 'resource-manager', title: 'Resource Manager', description: 'Manage resources efficiently', category: 'strategy', difficulty: 'Hard', icon: '⚖️', rating: 4.4, plays: 5200 },
    { id: 'territory-control', title: 'Territory Control', description: 'Expand your territory', category: 'strategy', difficulty: 'Expert', icon: '🗺️', rating: 4.6, plays: 4600 },
    { id: 'puzzle-strategy', title: 'Puzzle Strategy', description: 'Strategic puzzle solving', category: 'strategy', difficulty: 'Hard', icon: '🧠', rating: 4.5, plays: 3900 },

    // Intelligence Tests (5 games)
    { id: 'iq-test', title: 'IQ Test', description: 'Comprehensive intelligence assessment', category: 'intelligence', difficulty: 'Expert', icon: '🧠', rating: 4.9, plays: 35000 },
    { id: 'eq-test', title: 'EQ Test', description: 'Emotional intelligence evaluation', category: 'intelligence', difficulty: 'Expert', icon: '❤️', rating: 4.8, plays: 25000 },
    { id: 'logic-test', title: 'Logic Test', description: 'Logical reasoning assessment', category: 'intelligence', difficulty: 'Expert', icon: '🤔', rating: 4.7, plays: 18000 },
    { id: 'creativity-test', title: 'Creativity Test', description: 'Creative thinking evaluation', category: 'intelligence', difficulty: 'Expert', icon: '🎨', rating: 4.6, plays: 12000 },
    { id: 'aptitude-test', title: 'Aptitude Test', description: 'General aptitude assessment', category: 'intelligence', difficulty: 'Expert', icon: '📊', rating: 4.8, plays: 15000 }
  ];

  const filteredGames = allGames.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGameComplete = (result: GameResult) => {
    console.log('Game completed:', result);
    // Handle game completion
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-orange-400 bg-orange-500/20';
      case 'expert': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'memory': return '🧠';
      case 'puzzle': return '🧩';
      case 'speed': return '⚡';
      case 'racing': return '🏎️';
      case 'shooting': return '🎯';
      case 'arcade': return '🕹️';
      case 'strategy': return '♟️';
      case 'intelligence': return '🎓';
      default: return '🎮';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🎮 Game Collection
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Challenge your mind with our diverse collection of {allGames.length} brain training games
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Category Filter */}
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className="group bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
              {/* Game Icon & Category */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {game.icon}
                </div>
                <div className="text-2xl opacity-50">
                  {getCategoryIcon(game.category)}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {game.title}
              </h3>
              <p className="text-white/70 text-sm mb-4 line-clamp-2">
                {game.description}
              </p>

              {/* Difficulty Badge */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                  {game.difficulty}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-white/80">{game.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-white/80">{game.plays.toLocaleString()}</span>
                </div>
              </div>

              {/* Play Button */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white py-2 rounded-lg font-medium transition-all duration-300">
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Games Found */}
        {filteredGames.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Games Found</h3>
            <p className="text-white/70">Try adjusting your search or category filter</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-blue-400 mb-2">{allGames.length}</div>
            <div className="text-white/70">Total Games</div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-green-400 mb-2">8</div>
            <div className="text-white/70">Categories</div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-yellow-400 mb-2">4.5</div>
            <div className="text-white/70">Avg Rating</div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-purple-400 mb-2">1M+</div>
            <div className="text-white/70">Total Plays</div>
          </div>
        </div>
      </div>

      {/* Game Modal */}
      {selectedGame && (
        <GameModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          onComplete={handleGameComplete}
        />
      )}
    </div>
  );
};
