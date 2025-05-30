
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
  // Memory Games (15 games)
  { id: 'memory-sequence', title: 'Memory Sequence', description: 'Remember and repeat patterns', icon: Brain, difficulty: 'Medium', category: 'memory', estimatedTime: '3-5 min' },
  { id: 'color-memory', title: 'Color Memory', description: 'Match colors in sequence', icon: Palette, difficulty: 'Easy', category: 'memory', estimatedTime: '2-4 min' },
  { id: 'simon-says', title: 'Simon Says', description: 'Follow the pattern sequence', icon: Target, difficulty: 'Medium', category: 'memory', estimatedTime: '3-6 min' },
  { id: 'memory-cards', title: 'Memory Cards', description: 'Find matching pairs', icon: Grid3x3, difficulty: 'Easy', category: 'memory', estimatedTime: '4-7 min' },
  { id: 'number-memory', title: 'Number Memory', description: 'Remember number sequences', icon: Hash, difficulty: 'Medium', category: 'memory', estimatedTime: '3-5 min' },
  { id: 'word-memory', title: 'Word Memory', description: 'Memorize word lists', icon: Type, difficulty: 'Medium', category: 'memory', estimatedTime: '4-6 min' },
  { id: 'face-memory', title: 'Face Memory', description: 'Remember faces and names', icon: Users, difficulty: 'Hard', category: 'memory', estimatedTime: '5-8 min' },
  { id: 'spatial-memory', title: 'Spatial Memory', description: 'Remember object positions', icon: Map, difficulty: 'Medium', category: 'memory', estimatedTime: '3-6 min' },
  { id: 'sequence-memory', title: 'Sequence Memory', description: 'Remember action sequences', icon: RotateCw, difficulty: 'Hard', category: 'memory', estimatedTime: '4-7 min' },
  { id: 'audio-memory', title: 'Audio Memory', description: 'Remember sound patterns', icon: Headphones, difficulty: 'Medium', category: 'memory', estimatedTime: '3-5 min' },
  { id: 'visual-memory', title: 'Visual Memory', description: 'Remember visual patterns', icon: Eye, difficulty: 'Medium', category: 'memory', estimatedTime: '3-6 min' },
  { id: 'pattern-memory', title: 'Pattern Memory', description: 'Memorize complex patterns', icon: Grid3x3, difficulty: 'Hard', category: 'memory', estimatedTime: '5-8 min' },
  { id: 'location-memory', title: 'Location Memory', description: 'Remember item locations', icon: Map, difficulty: 'Medium', category: 'memory', estimatedTime: '4-6 min' },
  { id: 'story-memory', title: 'Story Memory', description: 'Remember story details', icon: MessageSquare, difficulty: 'Hard', category: 'memory', estimatedTime: '6-10 min' },
  { id: 'dual-memory', title: 'Dual Memory', description: 'Multiple memory tasks', icon: Brain, difficulty: 'Expert', category: 'memory', estimatedTime: '7-12 min' },

  // Puzzle Games (20 games)
  { id: 'puzzle-blocks', title: 'Puzzle Blocks', description: 'Arrange blocks to solve puzzles', icon: Puzzle, difficulty: 'Medium', category: 'puzzle', estimatedTime: '5-8 min' },
  { id: 'spatial-reasoning', title: 'Spatial Reasoning', description: 'Rotate and match objects', icon: Box, difficulty: 'Hard', category: 'puzzle', estimatedTime: '6-10 min' },
  { id: 'shape-rotator', title: 'Shape Rotator', description: 'Rotate shapes to match targets', icon: RotateCw, difficulty: 'Medium', category: 'puzzle', estimatedTime: '4-7 min' },
  { id: 'pattern-match', title: 'Pattern Match', description: 'Find hidden patterns', icon: Eye, difficulty: 'Hard', category: 'puzzle', estimatedTime: '5-8 min' },
  { id: 'jigsaw-puzzle', title: 'Jigsaw Puzzle', description: 'Complete picture puzzles', icon: Puzzle, difficulty: 'Medium', category: 'puzzle', estimatedTime: '8-15 min' },
  { id: 'sudoku', title: 'Sudoku', description: 'Number placement puzzle', icon: Grid3x3, difficulty: 'Hard', category: 'puzzle', estimatedTime: '10-20 min' },
  { id: 'crossword', title: 'Crossword', description: 'Word puzzle challenge', icon: Type, difficulty: 'Medium', category: 'puzzle', estimatedTime: '8-15 min' },
  { id: 'logic-grid', title: 'Logic Grid', description: 'Solve logic puzzles', icon: Grid3x3, difficulty: 'Hard', category: 'puzzle', estimatedTime: '6-12 min' },
  { id: 'maze-solver', title: 'Maze Solver', description: 'Navigate complex mazes', icon: Map, difficulty: 'Medium', category: 'puzzle', estimatedTime: '4-8 min' },
  { id: 'word-search', title: 'Word Search', description: 'Find hidden words', icon: Eye, difficulty: 'Easy', category: 'puzzle', estimatedTime: '3-6 min' },
  { id: 'tangram', title: 'Tangram', description: 'Shape arrangement puzzle', icon: Puzzle, difficulty: 'Medium', category: 'puzzle', estimatedTime: '5-10 min' },
  { id: 'bridge-builder', title: 'Bridge Builder', description: 'Engineer bridge solutions', icon: Building, difficulty: 'Hard', category: 'puzzle', estimatedTime: '7-12 min' },
  { id: 'pipe-connect', title: 'Pipe Connect', description: 'Connect pipe networks', icon: RotateCw, difficulty: 'Medium', category: 'puzzle', estimatedTime: '4-8 min' },
  { id: 'tower-puzzle', title: 'Tower Puzzle', description: 'Stack towers correctly', icon: Building, difficulty: 'Medium', category: 'puzzle', estimatedTime: '5-9 min' },
  { id: 'sliding-puzzle', title: 'Sliding Puzzle', description: 'Slide pieces to solve', icon: Grid3x3, difficulty: 'Medium', category: 'puzzle', estimatedTime: '4-8 min' },
  { id: 'color-puzzle', title: 'Color Puzzle', description: 'Match color patterns', icon: Palette, difficulty: 'Easy', category: 'puzzle', estimatedTime: '3-6 min' },
  { id: 'crystal-puzzle', title: 'Crystal Puzzle', description: 'Arrange crystal formations', icon: Gem, difficulty: 'Hard', category: 'puzzle', estimatedTime: '6-10 min' },
  { id: 'gear-puzzle', title: 'Gear Puzzle', description: 'Connect mechanical gears', icon: RotateCw, difficulty: 'Medium', category: 'puzzle', estimatedTime: '4-7 min' },
  { id: 'mirror-puzzle', title: 'Mirror Puzzle', description: 'Use mirrors to solve', icon: Eye, difficulty: 'Hard', category: 'puzzle', estimatedTime: '5-10 min' },
  { id: 'gravity-puzzle', title: 'Gravity Puzzle', description: 'Use physics to solve', icon: Target, difficulty: 'Medium', category: 'puzzle', estimatedTime: '4-8 min' },

  // Speed Games (15 games)
  { id: 'reaction-time', title: 'Reaction Time', description: 'Test your reflexes', icon: Zap, difficulty: 'Easy', category: 'speed', estimatedTime: '2-3 min' },
  { id: 'speed-typing', title: 'Speed Typing', description: 'Type as fast as you can', icon: Type, difficulty: 'Medium', category: 'speed', estimatedTime: '3-5 min' },
  { id: 'math-sprint', title: 'Math Sprint', description: 'Solve equations quickly', icon: Calculator, difficulty: 'Medium', category: 'speed', estimatedTime: '3-5 min' },
  { id: 'click-speed', title: 'Click Speed', description: 'Click as fast as possible', icon: MousePointer, difficulty: 'Easy', category: 'speed', estimatedTime: '1-2 min' },
  { id: 'word-sprint', title: 'Word Sprint', description: 'Form words quickly', icon: Type, difficulty: 'Medium', category: 'speed', estimatedTime: '3-5 min' },
  { id: 'number-dash', title: 'Number Dash', description: 'Quick number recognition', icon: Hash, difficulty: 'Easy', category: 'speed', estimatedTime: '2-4 min' },
  { id: 'color-dash', title: 'Color Dash', description: 'Identify colors rapidly', icon: Palette, difficulty: 'Easy', category: 'speed', estimatedTime: '2-3 min' },
  { id: 'shape-speed', title: 'Shape Speed', description: 'Recognize shapes quickly', icon: Target, difficulty: 'Easy', category: 'speed', estimatedTime: '2-4 min' },
  { id: 'sequence-speed', title: 'Sequence Speed', description: 'Complete sequences fast', icon: Zap, difficulty: 'Medium', category: 'speed', estimatedTime: '3-5 min' },
  { id: 'reflex-test', title: 'Reflex Test', description: 'Multi-directional reflexes', icon: Zap, difficulty: 'Medium', category: 'speed', estimatedTime: '2-4 min' },
  { id: 'tap-speed', title: 'Tap Speed', description: 'Tap targets quickly', icon: MousePointer, difficulty: 'Easy', category: 'speed', estimatedTime: '2-3 min' },
  { id: 'flash-math', title: 'Flash Math', description: 'Lightning fast calculations', icon: Calculator, difficulty: 'Hard', category: 'speed', estimatedTime: '3-6 min' },
  { id: 'quick-draw', title: 'Quick Draw', description: 'Draw patterns quickly', icon: PaintBucket, difficulty: 'Medium', category: 'speed', estimatedTime: '3-5 min' },
  { id: 'speed-reading', title: 'Speed Reading', description: 'Read and comprehend fast', icon: Eye, difficulty: 'Hard', category: 'speed', estimatedTime: '4-6 min' },
  { id: 'time-attack', title: 'Time Attack', description: 'Beat the clock challenge', icon: Clock, difficulty: 'Hard', category: 'speed', estimatedTime: '3-5 min' },

  // Racing Games (15 games)
  { id: 'car-race', title: 'Speed Racer', description: 'Race through traffic', icon: Car, difficulty: 'Medium', category: 'racing', estimatedTime: '5-8 min' },
  { id: 'bike-race', title: 'Bike Rush', description: 'Motorcycle racing', icon: Bike, difficulty: 'Medium', category: 'racing', estimatedTime: '4-7 min' },
  { id: 'space-race', title: 'Space Race', description: 'Race through space', icon: Rocket, difficulty: 'Hard', category: 'racing', estimatedTime: '6-10 min' },
  { id: 'boat-race', title: 'Water Racing', description: 'High-speed boat racing', icon: Ship, difficulty: 'Medium', category: 'racing', estimatedTime: '5-8 min' },
  { id: 'plane-race', title: 'Sky Racer', description: 'Aerial racing challenge', icon: Plane, difficulty: 'Hard', category: 'racing', estimatedTime: '6-9 min' },
  { id: 'train-race', title: 'Rail Runner', description: 'Train racing adventure', icon: Train, difficulty: 'Medium', category: 'racing', estimatedTime: '5-8 min' },
  { id: 'truck-race', title: 'Truck Rally', description: 'Heavy vehicle racing', icon: Truck, difficulty: 'Medium', category: 'racing', estimatedTime: '5-8 min' },
  { id: 'obstacle-race', title: 'Obstacle Course', description: 'Navigate challenging obstacles', icon: Target, difficulty: 'Hard', category: 'racing', estimatedTime: '6-10 min' },
  { id: 'time-trial', title: 'Time Trial', description: 'Beat your best time', icon: Clock, difficulty: 'Medium', category: 'racing', estimatedTime: '4-7 min' },
  { id: 'drift-race', title: 'Drift Master', description: 'Master drifting techniques', icon: Car, difficulty: 'Hard', category: 'racing', estimatedTime: '6-9 min' },
  { id: 'circuit-race', title: 'Circuit Champion', description: 'Professional circuit racing', icon: Trophy, difficulty: 'Hard', category: 'racing', estimatedTime: '7-12 min' },
  { id: 'off-road', title: 'Off-Road Adventure', description: 'Rough terrain racing', icon: Car, difficulty: 'Medium', category: 'racing', estimatedTime: '5-8 min' },
  { id: 'street-race', title: 'Street Racing', description: 'Urban racing challenge', icon: Car, difficulty: 'Medium', category: 'racing', estimatedTime: '5-8 min' },
  { id: 'marathon-race', title: 'Marathon Runner', description: 'Long distance racing', icon: Target, difficulty: 'Hard', category: 'racing', estimatedTime: '8-15 min' },
  { id: 'grand-prix', title: 'Grand Prix', description: 'Formula racing championship', icon: Trophy, difficulty: 'Expert', category: 'racing', estimatedTime: '10-20 min' },

  // Shooting Games (15 games)  
  { id: 'target-shooter', title: 'Target Practice', description: 'Aim and shoot targets', icon: Crosshair, difficulty: 'Easy', category: 'shooting', estimatedTime: '3-5 min' },
  { id: 'bubble-shooter', title: 'Bubble Shooter', description: 'Pop colorful bubbles', icon: Target, difficulty: 'Easy', category: 'shooting', estimatedTime: '4-8 min' },
  { id: 'space-shooter', title: 'Space Invaders', description: 'Defend from alien invasion', icon: Rocket, difficulty: 'Medium', category: 'shooting', estimatedTime: '5-10 min' },
  { id: 'sniper-challenge', title: 'Sniper Challenge', description: 'Precision shooting game', icon: Crosshair, difficulty: 'Hard', category: 'shooting', estimatedTime: '6-10 min' },
  { id: 'duck-hunt', title: 'Duck Hunt', description: 'Classic hunting game', icon: Target, difficulty: 'Medium', category: 'shooting', estimatedTime: '4-7 min' },
  { id: 'zombie-shooter', title: 'Zombie Defense', description: 'Survive zombie waves', icon: Crosshair, difficulty: 'Hard', category: 'shooting', estimatedTime: '6-12 min' },
  { id: 'clay-pigeon', title: 'Clay Pigeon', description: 'Shoot flying targets', icon: Target, difficulty: 'Medium', category: 'shooting', estimatedTime: '3-6 min' },
  { id: 'laser-shooter', title: 'Laser Battle', description: 'Futuristic laser combat', icon: Zap, difficulty: 'Medium', category: 'shooting', estimatedTime: '5-8 min' },
  { id: 'cannon-shooter', title: 'Cannon Master', description: 'Artillery shooting game', icon: Target, difficulty: 'Medium', category: 'shooting', estimatedTime: '4-7 min' },
  { id: 'bow-archer', title: 'Bow Archer', description: 'Medieval archery challenge', icon: Target, difficulty: 'Medium', category: 'shooting', estimatedTime: '4-8 min' },
  { id: 'tank-shooter', title: 'Tank Battle', description: 'Tank warfare game', icon: Shield, difficulty: 'Hard', category: 'shooting', estimatedTime: '6-10 min' },
  { id: 'water-gun', title: 'Water Gun Fight', description: 'Fun water shooting game', icon: Target, difficulty: 'Easy', category: 'shooting', estimatedTime: '3-6 min' },
  { id: 'fruit-shooter', title: 'Fruit Ninja Shooter', description: 'Shoot flying fruits', icon: Target, difficulty: 'Easy', category: 'shooting', estimatedTime: '3-5 min' },
  { id: 'robot-shooter', title: 'Robot Wars', description: 'Battle against robots', icon: Crosshair, difficulty: 'Hard', category: 'shooting', estimatedTime: '6-12 min' },
  { id: 'cowboy-duel', title: 'Cowboy Duel', description: 'Wild west showdown', icon: Crosshair, difficulty: 'Medium', category: 'shooting', estimatedTime: '4-7 min' },

  // Arcade Games (10 games)
  { id: 'snake-game', title: 'Snake Classic', description: 'Grow your snake', icon: Target, difficulty: 'Easy', category: 'arcade', estimatedTime: '5-10 min' },
  { id: 'tetris', title: 'Block Puzzle', description: 'Classic falling blocks', icon: Grid3x3, difficulty: 'Medium', category: 'arcade', estimatedTime: '5-15 min' },
  { id: 'pac-man', title: 'Dot Eater', description: 'Collect dots, avoid ghosts', icon: Target, difficulty: 'Medium', category: 'arcade', estimatedTime: '5-10 min' },
  { id: 'frogger', title: 'Road Crosser', description: 'Cross busy roads safely', icon: Target, difficulty: 'Medium', category: 'arcade', estimatedTime: '4-8 min' },
  { id: 'pong', title: 'Paddle Ball', description: 'Classic paddle game', icon: Target, difficulty: 'Easy', category: 'arcade', estimatedTime: '3-6 min' },
  { id: 'breakout', title: 'Brick Breaker', description: 'Break all the bricks', icon: Target, difficulty: 'Easy', category: 'arcade', estimatedTime: '4-8 min' },
  { id: 'asteroid', title: 'Asteroid Field', description: 'Navigate asteroid field', icon: Rocket, difficulty: 'Medium', category: 'arcade', estimatedTime: '5-10 min' },
  { id: 'pinball', title: 'Pinball Machine', description: 'Classic pinball game', icon: Target, difficulty: 'Medium', category: 'arcade', estimatedTime: '5-10 min' },
  { id: 'centipede', title: 'Bug Shooter', description: 'Shoot segmented creatures', icon: Target, difficulty: 'Medium', category: 'arcade', estimatedTime: '5-10 min' },
  { id: 'tower-builder', title: 'Tower Builder', description: 'Build the tallest tower', icon: Building, difficulty: 'Medium', category: 'arcade', estimatedTime: '5-8 min' },

  // Strategy Games (10 games)
  { id: 'chess', title: 'Chess Master', description: 'Classic strategy game', icon: Crown, difficulty: 'Hard', category: 'strategy', estimatedTime: '15-30 min' },
  { id: 'checkers', title: 'Checkers', description: 'Traditional board game', icon: Grid3x3, difficulty: 'Medium', category: 'strategy', estimatedTime: '10-20 min' },
  { id: 'tic-tac-toe', title: 'Tic Tac Toe', description: 'Three in a row', icon: Grid3x3, difficulty: 'Easy', category: 'strategy', estimatedTime: '2-5 min' },
  { id: 'rock-paper-scissors', title: 'Rock Paper Scissors', description: 'Classic hand game', icon: Dice1, difficulty: 'Easy', category: 'strategy', estimatedTime: '2-5 min' },
  { id: 'connect-four', title: 'Connect Four', description: 'Connect four in a row', icon: Grid3x3, difficulty: 'Medium', category: 'strategy', estimatedTime: '5-10 min' },
  { id: 'battleship', title: 'Battleship', description: 'Naval strategy game', icon: Ship, difficulty: 'Medium', category: 'strategy', estimatedTime: '8-15 min' },
  { id: 'tower-defense', title: 'Tower Defense', description: 'Defend your base', icon: Shield, difficulty: 'Hard', category: 'strategy', estimatedTime: '10-20 min' },
  { id: 'risk-game', title: 'Territory War', description: 'Conquer the world', icon: Crown, difficulty: 'Expert', category: 'strategy', estimatedTime: '20-40 min' },
  { id: 'reversi', title: 'Reversi', description: 'Flip strategy game', icon: Grid3x3, difficulty: 'Medium', category: 'strategy', estimatedTime: '8-15 min' },
  { id: 'iq-test', title: 'IQ Test Challenge', description: 'Intelligence assessment', icon: Brain, difficulty: 'Expert', category: 'strategy', estimatedTime: '15-20 min' },

  // Intelligence Tests (5 games)
  { id: 'enhanced-iq-test', title: 'Enhanced IQ Test', description: 'Comprehensive intelligence test', icon: Brain, difficulty: 'Expert', category: 'intelligence', estimatedTime: '25-35 min' },
  { id: 'eq-test', title: 'EQ Test', description: 'Emotional intelligence assessment', icon: Heart, difficulty: 'Medium', category: 'intelligence', estimatedTime: '15-25 min' },
  { id: 'sq-test', title: 'SQ Test', description: 'Social intelligence test', icon: Users, difficulty: 'Medium', category: 'intelligence', estimatedTime: '15-25 min' },
  { id: 'creativity-test', title: 'Creativity Test', description: 'Measure creative thinking', icon: Lightbulb, difficulty: 'Medium', category: 'intelligence', estimatedTime: '12-20 min' },
  { id: 'logic-test', title: 'Logic Reasoning', description: 'Pure logic assessment', icon: Brain, difficulty: 'Hard', category: 'intelligence', estimatedTime: '18-25 min' }
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
