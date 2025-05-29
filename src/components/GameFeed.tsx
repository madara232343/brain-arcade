import React, { useState, useEffect } from 'react';
import { Brain, Puzzle, Zap, Timer, Target, Gamepad2, Eye, Calculator, Music, Layers, Clock, Star, Trophy, Heart, Lightbulb, Shuffle, Grid3X3, Flame, MousePointer, Diamond, Sparkles, Volume2, Navigation, Radar, Crosshair, Compass, Dice1, Scissors, Book, Car, Plane, Rocket, Globe, Camera, Fingerprint, Hexagon, Octagon, Square, Box, Palette } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  type: string;
  category: '2d' | '3d';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  xpReward: number;
  icon: React.ComponentType<any>;
  isPlayed?: boolean;
}

interface GameFeedProps {
  onPlayGame: (game: Game) => void;
  playedGames: string[];
}

const all2DGames: Game[] = [
  { id: 'memory-sequence', title: 'Memory Sequence', description: 'Remember and repeat color patterns', type: 'memory', category: '2d', difficulty: 'medium', estimatedTime: '2 min', xpReward: 25, icon: Brain },
  { id: 'math-sprint', title: 'Math Sprint', description: 'Solve math problems quickly', type: 'math', category: '2d', difficulty: 'easy', estimatedTime: '1 min', xpReward: 15, icon: Calculator },
  { id: 'pattern-match', title: 'Pattern Match', description: 'Find matching visual patterns', type: 'pattern', category: '2d', difficulty: 'hard', estimatedTime: '2 min', xpReward: 35, icon: Puzzle },
  { id: 'word-association', title: 'Word Association', description: 'Connect related words fast', type: 'language', category: '2d', difficulty: 'medium', estimatedTime: '1 min', xpReward: 20, icon: Brain },
  { id: 'reaction-time', title: 'Reaction Time', description: 'Test your reflexes', type: 'speed', category: '2d', difficulty: 'easy', estimatedTime: '1 min', xpReward: 10, icon: Timer },
  { id: 'color-memory', title: 'Color Memory', description: 'Remember highlighted colors', type: 'memory', category: '2d', difficulty: 'medium', estimatedTime: '2 min', xpReward: 30, icon: Palette },
  { id: 'number-sequence', title: 'Number Sequence', description: 'Find patterns in numbers', type: 'logic', category: '2d', difficulty: 'hard', estimatedTime: '2 min', xpReward: 35, icon: Calculator },
  { id: 'speed-typing', title: 'Speed Typing', description: 'Type words accurately and fast', type: 'typing', category: '2d', difficulty: 'medium', estimatedTime: '1 min', xpReward: 20, icon: Zap },
  { id: 'visual-attention', title: 'Visual Attention', description: 'Find hidden objects quickly', type: 'attention', category: '2d', difficulty: 'medium', estimatedTime: '1 min', xpReward: 25, icon: Eye },
  { id: 'simon-says', title: 'Simon Says', description: 'Follow the sequence pattern', type: 'memory', category: '2d', difficulty: 'easy', estimatedTime: '2 min', xpReward: 20, icon: Music },
  { id: 'memory-cards', title: 'Memory Cards', description: 'Match pairs of cards', type: 'memory', category: '2d', difficulty: 'medium', estimatedTime: '2 min', xpReward: 30, icon: Layers },
  { id: 'quick-math', title: 'Quick Math', description: 'Lightning-fast arithmetic', type: 'math', category: '2d', difficulty: 'easy', estimatedTime: '1 min', xpReward: 15, icon: Calculator },
  { id: 'color-rush', title: 'Color Rush', description: 'Sort colors at lightning speed', type: 'speed', category: '2d', difficulty: 'medium', estimatedTime: '1 min', xpReward: 25, icon: Sparkles },
  { id: 'word-chain', title: 'Word Chain', description: 'Create word chains quickly', type: 'language', category: '2d', difficulty: 'hard', estimatedTime: '2 min', xpReward: 35, icon: Brain },
  { id: 'pattern-flip', title: 'Pattern Flip', description: 'Memorize and recreate patterns', type: 'pattern', category: '2d', difficulty: 'medium', estimatedTime: '2 min', xpReward: 30, icon: Puzzle },
  { id: 'focus-test', title: 'Focus Test', description: 'Maintain concentration under pressure', type: 'attention', category: '2d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 40, icon: Target },
  { id: 'sequence-master', title: 'Sequence Master', description: 'Master complex sequences', type: 'memory', category: '2d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 45, icon: Brain },
  { id: 'reflex-challenge', title: 'Reflex Challenge', description: 'Ultimate reflex testing', type: 'speed', category: '2d', difficulty: 'hard', estimatedTime: '2 min', xpReward: 35, icon: Zap },
  { id: 'logic-grid', title: 'Logic Grid', description: 'Solve complex logic puzzles', type: 'logic', category: '2d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 50, icon: Grid3X3 },
  { id: 'memory-palace', title: 'Memory Palace', description: 'Build and navigate memory palaces', type: 'memory', category: '2d', difficulty: 'hard', estimatedTime: '4 min', xpReward: 55, icon: Brain },
  { id: 'shape-shifter', title: 'Shape Shifter', description: 'Transform shapes to match patterns', type: 'pattern', category: '2d', difficulty: 'medium', estimatedTime: '2 min', xpReward: 30, icon: Puzzle },
  { id: 'number-ninja', title: 'Number Ninja', description: 'Slice through number challenges', type: 'math', category: '2d', difficulty: 'medium', estimatedTime: '2 min', xpReward: 25, icon: Calculator },
  { id: 'color-harmony', title: 'Color Harmony', description: 'Create perfect color combinations', type: 'visual', category: '2d', difficulty: 'medium', estimatedTime: '2 min', xpReward: 30, icon: Sparkles },
  { id: 'word-storm', title: 'Word Storm', description: 'Weather the storm of words', type: 'language', category: '2d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 40, icon: Brain },
  { id: 'pattern-dance', title: 'Pattern Dance', description: 'Dance through visual patterns', type: 'pattern', category: '2d', difficulty: 'medium', estimatedTime: '2 min', xpReward: 25, icon: Puzzle },
  { id: 'attention-storm', title: 'Attention Storm', description: 'Navigate through attention challenges', type: 'attention', category: '2d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 45, icon: Eye },
  { id: 'sequence-storm', title: 'Sequence Storm', description: 'Weather complex sequence challenges', type: 'memory', category: '2d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 40, icon: Brain },
  { id: 'reflex-master', title: 'Reflex Master', description: 'Become the ultimate reflex master', type: 'speed', category: '2d', difficulty: 'hard', estimatedTime: '2 min', xpReward: 45, icon: Timer },
  { id: 'logic-master', title: 'Logic Master', description: 'Master the art of logic', type: 'logic', category: '2d', difficulty: 'hard', estimatedTime: '4 min', xpReward: 50, icon: Brain },
  { id: 'brain-teaser', title: 'Brain Teaser', description: 'Ultimate brain challenge', type: 'logic', category: '2d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 45, icon: Brain }
];

const all3DGames: Game[] = [
  { id: 'spatial-reasoning', title: 'Spatial Reasoning', description: 'Rotate and match 3D objects', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '2 min', xpReward: 40, icon: Box },
  { id: 'cube-rotator', title: 'Cube Rotator', description: 'Master 3D cube rotations', type: 'spatial', category: '3d', difficulty: 'medium', estimatedTime: '2 min', xpReward: 30, icon: Box },
  { id: '3d-maze', title: '3D Maze Runner', description: 'Navigate through 3D mazes', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 45, icon: Box },
  { id: 'perspective-shift', title: 'Perspective Shift', description: 'Master changing perspectives', type: 'spatial', category: '3d', difficulty: 'medium', estimatedTime: '2 min', xpReward: 35, icon: Eye },
  { id: 'depth-perception', title: 'Depth Perception', description: 'Test your depth perception skills', type: 'spatial', category: '3d', difficulty: 'medium', estimatedTime: '2 min', xpReward: 30, icon: Eye },
  { id: 'dimension-jump', title: 'Dimension Jump', description: 'Jump between dimensions', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 50, icon: Box },
  { id: 'crystal-match', title: 'Crystal Match', description: 'Match 3D crystals in space', type: 'spatial', category: '3d', difficulty: 'medium', estimatedTime: '2 min', xpReward: 35, icon: Diamond },
  { id: 'orbital-mechanics', title: 'Orbital Mechanics', description: 'Navigate orbital paths', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 45, icon: Globe },
  { id: 'hologram-puzzle', title: 'Hologram Puzzle', description: 'Solve holographic puzzles', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 50, icon: Sparkles },
  { id: 'gravity-defier', title: 'Gravity Defier', description: 'Defy gravity in 3D space', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 45, icon: Rocket },
  { id: 'space-navigator', title: 'Space Navigator', description: 'Navigate through 3D space', type: 'spatial', category: '3d', difficulty: 'medium', estimatedTime: '2 min', xpReward: 35, icon: Navigation },
  { id: 'molecular-builder', title: 'Molecular Builder', description: 'Build 3D molecular structures', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '4 min', xpReward: 55, icon: Hexagon },
  { id: 'vector-master', title: 'Vector Master', description: 'Master 3D vector calculations', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 50, icon: Compass },
  { id: 'dimension-weaver', title: 'Dimension Weaver', description: 'Weave through dimensions', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '4 min', xpReward: 60, icon: Box },
  { id: 'spatial-memory', title: 'Spatial Memory', description: 'Remember 3D spatial arrangements', type: 'spatial', category: '3d', difficulty: 'medium', estimatedTime: '3 min', xpReward: 40, icon: Brain },
  { id: 'geometry-master', title: 'Geometry Master', description: 'Master 3D geometry', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 50, icon: Octagon },
  { id: 'rotation-symphony', title: 'Rotation Symphony', description: 'Create symphonies with rotations', type: 'spatial', category: '3d', difficulty: 'medium', estimatedTime: '3 min', xpReward: 35, icon: Music },
  { id: 'tesseract-navigator', title: 'Tesseract Navigator', description: 'Navigate 4D tesseracts', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '4 min', xpReward: 65, icon: Square },
  { id: 'quantum-tunnels', title: 'Quantum Tunnels', description: 'Tunnel through quantum space', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 55, icon: Radar },
  { id: 'fractal-explorer', title: 'Fractal Explorer', description: 'Explore infinite fractal dimensions', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '4 min', xpReward: 60, icon: Sparkles },
  { id: 'portal-jumper', title: 'Portal Jumper', description: 'Jump through 3D portals', type: 'spatial', category: '3d', difficulty: 'medium', estimatedTime: '2 min', xpReward: 35, icon: Globe },
  { id: 'matrix-navigator', title: 'Matrix Navigator', description: 'Navigate through data matrices', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 50, icon: Grid3X3 },
  { id: 'cosmic-architect', title: 'Cosmic Architect', description: 'Architect of cosmic structures', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '4 min', xpReward: 60, icon: Star },
  { id: 'reality-shifter', title: 'Reality Shifter', description: 'Shift between realities', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '4 min', xpReward: 65, icon: Sparkles },
  { id: 'void-walker', title: 'Void Walker', description: 'Walk through the void', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '3 min', xpReward: 55, icon: Box },
  { id: 'dimension-builder', title: 'Dimension Builder', description: 'Build your own dimensions', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '4 min', xpReward: 60, icon: Box },
  { id: 'space-time-weaver', title: 'Space-Time Weaver', description: 'Weave space and time', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '5 min', xpReward: 70, icon: Clock },
  { id: 'hypercube-master', title: 'Hypercube Master', description: 'Master hypercube navigation', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '4 min', xpReward: 65, icon: Box },
  { id: 'quantum-entangler', title: 'Quantum Entangler', description: 'Entangle quantum particles', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '4 min', xpReward: 60, icon: Sparkles },
  { id: 'multiverse-explorer', title: 'Multiverse Explorer', description: 'Explore infinite multiverses', type: 'spatial', category: '3d', difficulty: 'hard', estimatedTime: '5 min', xpReward: 75, icon: Globe }
];

export const GameFeed: React.FC<GameFeedProps> = ({ onPlayGame, playedGames = [] }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [activeCategory, setActiveCategory] = useState<'2d' | '3d'>('2d');

  useEffect(() => {
    const allGames = activeCategory === '2d' ? all2DGames : all3DGames;
    const shuffled = [...allGames].sort(() => Math.random() - 0.5);
    setGames(shuffled.map(game => ({
      ...game,
      isPlayed: playedGames ? playedGames.includes(game.id) : false
    })));
  }, [playedGames, activeCategory]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'hard': return 'bg-rose-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyGlow = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'shadow-emerald-500/20';
      case 'medium': return 'shadow-amber-500/20';
      case 'hard': return 'shadow-rose-500/20';
      default: return 'shadow-gray-500/20';
    }
  };

  const displayedGames = games.slice(0, 12);

  return (
    <div className="animate-fade-in">
      {/* Category Selector */}
      <div className="flex justify-center mb-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-1 border border-white/30">
          <button
            onClick={() => setActiveCategory('2d')}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              activeCategory === '2d'
                ? 'bg-white text-indigo-900 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            🎮 2D Games ({all2DGames.length})
          </button>
          <button
            onClick={() => setActiveCategory('3d')}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              activeCategory === '3d'
                ? 'bg-white text-indigo-900 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            🌟 3D Games ({all3DGames.length})
          </button>
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center">
        {activeCategory === '2d' ? '🎯 2D Brain Games' : '🚀 3D Interactive Games'}
      </h2>
      
      <div className="game-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {displayedGames.map((game, index) => {
          const IconComponent = game.icon;
          return (
            <div
              key={game.id}
              className={`game-card bg-white/10 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${getDifficultyGlow(game.difficulty)} cursor-pointer group animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onPlayGame(game)}
            >
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg md:rounded-xl group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <IconComponent className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base md:text-lg group-hover:text-blue-200 transition-colors">
                      {game.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold text-white ${getDifficultyColor(game.difficulty)} shadow-lg`}>
                        {game.difficulty}
                      </span>
                      <span className="text-white/70 text-xs md:text-sm font-medium">{game.estimatedTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div className="text-yellow-400 font-bold text-xs md:text-sm flex items-center">
                    <Zap className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    +{game.xpReward} XP
                  </div>
                  {game.isPlayed && (
                    <div className="text-green-400 text-xs font-medium">✓ Played</div>
                  )}
                </div>
              </div>

              <p className="text-white/90 mb-4 md:mb-6 text-xs md:text-sm leading-relaxed">{game.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white/60 text-xs md:text-sm">
                  <Timer className="h-3 w-3 md:h-4 md:w-4" />
                  <span>{game.estimatedTime}</span>
                </div>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white px-3 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg transform active:scale-95 touch-target">
                  Play Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
