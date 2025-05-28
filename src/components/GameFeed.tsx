
import React, { useState, useEffect } from 'react';
import { Brain, Puzzle, Zap, Timer, Target, Gamepad2, Eye, Calculator, Music, Layers } from 'lucide-react';

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
    description: 'Remember and repeat color patterns',
    type: 'memory',
    difficulty: 'medium',
    estimatedTime: '2 min',
    xpReward: 25,
    icon: Brain
  },
  {
    id: 'math-sprint',
    title: 'Math Sprint',
    description: 'Solve math problems quickly',
    type: 'math',
    difficulty: 'easy',
    estimatedTime: '1 min',
    xpReward: 15,
    icon: Calculator
  },
  {
    id: 'pattern-match',
    title: 'Pattern Match',
    description: 'Find matching visual patterns',
    type: 'pattern',
    difficulty: 'hard',
    estimatedTime: '2 min',
    xpReward: 35,
    icon: Puzzle
  },
  {
    id: 'word-association',
    title: 'Word Association',
    description: 'Connect related words fast',
    type: 'language',
    difficulty: 'medium',
    estimatedTime: '1 min',
    xpReward: 20,
    icon: Brain
  },
  {
    id: 'reaction-time',
    title: 'Reaction Time',
    description: 'Test your reflexes',
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
    estimatedTime: '2 min',
    xpReward: 40,
    icon: Target
  },
  {
    id: 'color-memory',
    title: 'Color Memory',
    description: 'Remember highlighted colors',
    type: 'memory',
    difficulty: 'medium',
    estimatedTime: '2 min',
    xpReward: 30,
    icon: Eye
  },
  {
    id: 'number-sequence',
    title: 'Number Sequence',
    description: 'Find patterns in numbers',
    type: 'logic',
    difficulty: 'hard',
    estimatedTime: '2 min',
    xpReward: 35,
    icon: Calculator
  },
  {
    id: 'speed-typing',
    title: 'Speed Typing',
    description: 'Type words accurately and fast',
    type: 'typing',
    difficulty: 'medium',
    estimatedTime: '1 min',
    xpReward: 20,
    icon: Zap
  },
  {
    id: 'visual-attention',
    title: 'Visual Attention',
    description: 'Find hidden objects quickly',
    type: 'attention',
    difficulty: 'medium',
    estimatedTime: '1 min',
    xpReward: 25,
    icon: Eye
  },
  {
    id: 'simon-says',
    title: 'Simon Says',
    description: 'Follow the sequence pattern',
    type: 'memory',
    difficulty: 'easy',
    estimatedTime: '2 min',
    xpReward: 20,
    icon: Music
  },
  {
    id: 'memory-cards',
    title: 'Memory Cards',
    description: 'Match pairs of cards',
    type: 'memory',
    difficulty: 'medium',
    estimatedTime: '2 min',
    xpReward: 30,
    icon: Layers
  }
];

export const GameFeed: React.FC<GameFeedProps> = ({ onPlayGame, playedGames = [] }) => {
  const [games, setGames] = useState<Game[]>(allGames);

  useEffect(() => {
    if (playedGames && playedGames.length > 0) {
      const shuffled = [...allGames].sort(() => Math.random() - 0.5);
      setGames(shuffled.map(game => ({
        ...game,
        isPlayed: playedGames.includes(game.id)
      })));
    } else {
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
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center">
        🧠 Brain Games
      </h2>
      <div className="game-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {games.map((game, index) => {
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
