import React from 'react';
import { Brain, Puzzle, Zap, Timer, Target } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  xpReward: number;
  icon: React.ComponentType<any>;
}

interface GameFeedProps {
  onPlayGame: (game: Game) => void;
}

const games: Game[] = [
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
    icon: Zap
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
  }
];

export const GameFeed: React.FC<GameFeedProps> = ({ onPlayGame }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Brain Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game) => {
          const IconComponent = game.icon;
          return (
            <div
              key={game.id}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105 cursor-pointer group"
              onClick={() => onPlayGame(game)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{game.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getDifficultyColor(game.difficulty)}`}>
                        {game.difficulty}
                      </span>
                      <span className="text-white/70 text-sm">{game.estimatedTime}</span>
                    </div>
                  </div>
                </div>
                <div className="text-blue-300 font-bold text-sm">+{game.xpReward} XP</div>
              </div>

              <p className="text-white/80 mb-4">{game.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <Timer className="h-4 w-4" />
                  <span>{game.estimatedTime}</span>
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Play
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
