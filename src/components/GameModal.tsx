import React, { useState, useEffect } from 'react';
import { X, Trophy, Clock, Target, Star } from 'lucide-react';
import { TicTacToeGame } from './games/TicTacToeGame';
import { RockPaperScissorsGame } from './games/RockPaperScissorsGame';
import { MemoryGame } from './games/MemoryGame';
import { ReactionTimeGame } from './games/ReactionTimeGame';
import { PatternMatchGame } from './games/PatternMatchGame';
import { SimonSaysGame } from './games/SimonSaysGame';
import { MemoryCardGame } from './games/MemoryCardGame';
import { NumberSequenceGame } from './games/NumberSequenceGame';
import { SpaceShooterGame } from './games/SpaceShooterGame';
import { CarRacingGame } from './games/CarRacingGame';
import { BubbleShooterGame } from './games/BubbleShooterGame';
import { PlatformerGame } from './games/PlatformerGame';
import { SnakeGame } from './games/SnakeGame';
import { SpeedTypingGame } from './games/SpeedTypingGame';
import { MathSprintGame } from './games/MathSprintGame';
import { EnhancedIQTest } from './games/EnhancedIQTest';
import { EQTest } from './games/EQTest';
import { BrickBreakerGame } from './games/BrickBreakerGame';
import { ChessMiniGame } from './games/ChessMiniGame';
import { GameResult } from '@/types/game';

interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  icon: string;
  component?: React.ComponentType<any>;
}

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
  onComplete: (result: GameResult) => void;
}

export const GameModal: React.FC<GameModalProps> = ({ game, onClose, onComplete }) => {
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    setGameStarted(false);
  }, [game]);

  if (!game) return null;

  const gameComponents: Record<string, React.ComponentType<any>> = {
    'tic-tac-toe': TicTacToeGame,
    'rock-paper-scissors': RockPaperScissorsGame,
    'memory-sequence': MemoryGame,
    'reaction-time': ReactionTimeGame,
    'pattern-match': PatternMatchGame,
    'simon-says': SimonSaysGame,
    'memory-cards': MemoryCardGame,
    'number-sequence': NumberSequenceGame,
    'space-shooter': SpaceShooterGame,
    'car-racing': CarRacingGame,
    'bubble-shooter': BubbleShooterGame,
    'platformer': PlatformerGame,
    'snake': SnakeGame,
    'speed-typing': SpeedTypingGame,
    'math-sprint': MathSprintGame,
    'iq-test': EnhancedIQTest,
    'eq-test': EQTest,
    'brick-breaker': BrickBreakerGame,
    'chess-mini': ChessMiniGame,
  };

  const GameComponent = gameComponents[game.id];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-orange-400 bg-orange-500/20';
      case 'expert': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'memory': return 'text-blue-400 bg-blue-500/20';
      case 'puzzle': return 'text-green-400 bg-green-500/20';
      case 'speed': return 'text-yellow-400 bg-yellow-500/20';
      case 'racing': return 'text-orange-400 bg-orange-500/20';
      case 'shooting': return 'text-red-400 bg-red-500/20';
      case 'arcade': return 'text-purple-400 bg-purple-500/20';
      case 'strategy': return 'text-indigo-400 bg-indigo-500/20';
      case 'intelligence': return 'text-pink-400 bg-pink-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden border border-white/30 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-2xl">
              {game.icon}
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">{game.title}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(game.category)}`}>
                  {game.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                  {game.difficulty}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {!gameStarted && GameComponent ? (
            <div className="text-center space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="text-white/80 text-lg leading-relaxed">{game.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-white font-bold text-lg">Score Points</div>
                  <div className="text-white/70 text-sm">Earn XP and climb leaderboards</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-white font-bold text-lg">Track Accuracy</div>
                  <div className="text-white/70 text-sm">Monitor your performance</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-white font-bold text-lg">Beat Your Time</div>
                  <div className="text-white/70 text-sm">Improve your speed</div>
                </div>
              </div>

              <button
                onClick={() => setGameStarted(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-3 mx-auto"
              >
                <Star className="h-6 w-6" />
                <span>Start Game</span>
              </button>
            </div>
          ) : GameComponent ? (
            <GameComponent
              onComplete={(result: GameResult) => {
                onComplete(result);
                onClose();
              }}
              gameId={game.id}
            />
          ) : (
            <div className="text-center text-white p-8">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2">Coming Soon!</h3>
              <p className="text-white/70">This game is under development. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
