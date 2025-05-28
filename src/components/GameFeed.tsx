
import React, { useState, useEffect } from 'react';
import { Brain, Puzzle, Zap, Timer, Target, Gamepad2, Eye, Calculator } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  type: string;
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

const allGames: Game[] = [
  {
    id: 'memory-sequence',
    title: 'Memory Sequence',
    description: 'Remember and repeat the sequence of colors',
    type: 'memory',
    difficulty: 'medium',
    estimatedTime: '2 min',
    xpReward: 25,
    icon: Brain
  },
  {
    id: 'math-sprint',
    title: 'Math Sprint',
    description: 'Solve as many math problems as you can',
    type: 'math',
    difficulty: 'easy',
    estimatedTime: '1 min',
    xpReward: 15,
    icon: Calculator
  },
  {
    id: 'pattern-match',
    title: 'Pattern Match',
    description: 'Find the matching patterns quickly',
    type: 'pattern',
    difficulty: 'hard',
    estimatedTime: '3 min',
    xpReward: 35,
    icon: Puzzle
  },
  {
    id: 'word-association',
    title: 'Word Association',
    description: 'Connect related words as fast as possible',
    type: 'language',
    difficulty: 'medium',
    estimatedTime: '2 min',
    xpReward: 20,
    icon: Brain
  },
  {
    id: 'reaction-time',
    title: 'Reaction Time',
    description: 'Test your reflexes and reaction speed',
    type: 'speed',
    difficulty: 'easy',
    estimatedTime: '1 min',
    xpReward: 10,
    icon: Timer
  },
  {
    id: 'spatial-reasoning',
    title: 'Spatial Reasoning',
    description: 'Rotate and match 3D objects',
    type: 'spatial',
    difficulty: 'hard',
    estimatedTime: '4 min',
    xpReward: 40,
    icon: Target
  },
  {
    id: 'color-memory',
    title: 'Color Memory',
    description: 'Remember the exact colors and positions',
    type: 'memory',
    difficulty: 'medium',
    estimatedTime: '2 min',
    xpReward: 30,
    icon: Eye
  },
  {
    id: 'number-sequence',
    title: 'Number Sequence',
    description: 'Find the pattern in number sequences',
    type: 'logic',
    difficulty: 'hard',
    estimatedTime: '3 min',
    xpReward: 35,
    icon: Calculator
  },
  {
    id: 'speed-typing',
    title: 'Speed Typing',
    description: 'Type words as fast and accurately as possible',
    type: 'typing',
    difficulty: 'medium',
    estimatedTime: '1 min',
    xpReward: 20,
    icon: Zap
  },
  {
    id: 'visual-attention',
    title: 'Visual Attention',
    description: 'Find hidden objects in complex scenes',
    type: 'attention',
    difficulty: 'medium',
    estimatedTime: '2 min',
    xpReward: 25,
    icon: Eye
  }
];

export const GameFeed: React.FC<GameFeedProps> = ({ onPlayGame, playedGames = [] }) => {
  const [games, setGames] = useState<Game[]>(allGames);

  useEffect(() => {
    // Randomize games after first play - only if playedGames is defined and has content
    if (playedGames && playedGames.length > 0) {
      const shuffled = [...allGames].sort(() => Math.random() - 0.5);
      setGames(shuffled.map(game => ({
        ...game,
        isPlayed: playedGames.includes(game.id)
      })));
    } else {
      // Set initial games with played status
      setGames(allGames.map(game => ({
        ...game,
        isPlayed: playedGames ? playedGames.includes(game.id) : false
      })));
    }
  }, [playedGames]);

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

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        🧠 Brain Games
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => {
          const IconComponent = game.icon;
          return (
            <div
              key={game.id}
              className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${getDifficultyGlow(game.difficulty)} cursor-pointer group animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onPlayGame(game)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-blue-200 transition-colors">
                      {game.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getDifficultyColor(game.difficulty)} shadow-lg`}>
                        {game.difficulty}
                      </span>
                      <span className="text-white/70 text-sm font-medium">{game.estimatedTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div className="text-yellow-400 font-bold text-sm flex items-center">
                    <Zap className="h-4 w-4 mr-1" />
                    +{game.xpReward} XP
                  </div>
                  {game.isPlayed && (
                    <div className="text-green-400 text-xs font-medium">✓ Played</div>
                  )}
                </div>
              </div>

              <p className="text-white/90 mb-6 text-sm leading-relaxed">{game.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <Timer className="h-4 w-4" />
                  <span>{game.estimatedTime}</span>
                </div>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white px-6 py-2 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg transform active:scale-95">
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
