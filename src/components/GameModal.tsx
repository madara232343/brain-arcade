import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface GameModalProps {
  game: any;
  onClose: () => void;
  onComplete: (result: any) => void;
}

export const GameModal: React.FC<GameModalProps> = ({ game, onClose, onComplete }) => {
  const renderGame = () => {
    const gameProps = {
      onComplete,
      gameId: game.id
    };

    // Import all game components
    const gameComponents: { [key: string]: React.ComponentType<any> } = {
      MemoryGame: React.lazy(() => import('./games/MemoryGame').then(module => ({ default: module.MemoryGame }))),
      SimonSaysGame: React.lazy(() => import('./games/SimonSaysGame').then(module => ({ default: module.SimonSaysGame }))),
      VisualAttentionGame: React.lazy(() => import('./games/VisualAttentionGame').then(module => ({ default: module.VisualAttentionGame }))),
      TicTacToeGame: React.lazy(() => import('./games/TicTacToeGame').then(module => ({ default: module.TicTacToeGame }))),
      RockPaperScissorsGame: React.lazy(() => import('./games/RockPaperScissorsGame').then(module => ({ default: module.RockPaperScissorsGame }))),
      PatternMatchGame: React.lazy(() => import('./games/PatternMatchGame').then(module => ({ default: module.PatternMatchGame }))),
      SnakeGame: React.lazy(() => import('./games/SnakeGame').then(module => ({ default: module.SnakeGame }))),
      CarRacingGame: React.lazy(() => import('./games/CarRacingGame').then(module => ({ default: module.CarRacingGame }))),
      BubbleShooterGame: React.lazy(() => import('./games/BubbleShooterGame').then(module => ({ default: module.BubbleShooterGame }))),
      SpaceShooterGame: React.lazy(() => import('./games/SpaceShooterGame').then(module => ({ default: module.SpaceShooterGame }))),
      ReactionTimeGame: React.lazy(() => import('./games/ReactionTimeGame').then(module => ({ default: module.ReactionTimeGame }))),
      SpeedTypingGame: React.lazy(() => import('./games/SpeedTypingGame').then(module => ({ default: module.SpeedTypingGame }))),
      MathSprintGame: React.lazy(() => import('./games/MathSprintGame').then(module => ({ default: module.MathSprintGame }))),
      ColorClickGame: React.lazy(() => import('./games/ColorClickGame').then(module => ({ default: module.ColorClickGame }))),
      NumberGuessingGame: React.lazy(() => import('./games/NumberGuessingGame').then(module => ({ default: module.NumberGuessingGame }))),
      ChessMiniGame: React.lazy(() => import('./games/ChessMiniGame').then(module => ({ default: module.ChessMiniGame }))),
    };

    const GameComponent = gameComponents[game.component];
    
    if (!GameComponent) {
      return <div className="text-white text-center p-8">Game not found</div>;
    }

    return (
      <React.Suspense fallback={<div className="text-white text-center p-8">Loading game...</div>}>
        <GameComponent {...gameProps} />
      </React.Suspense>
    );
  };

  return (
    <Dialog open={!!game} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-gradient-to-br from-purple-900/95 to-blue-900/95 text-white border-white/20 border rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{game?.title}</DialogTitle>
          <DialogDescription className="text-white/70">
            {game?.description}
          </DialogDescription>
        </DialogHeader>
        {renderGame()}
      </DialogContent>
    </Dialog>
  );
};
