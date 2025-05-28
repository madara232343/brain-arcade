
import React from 'react';
import { Trophy, Share2, X, Zap } from 'lucide-react';
import { GameResult } from '@/pages/Index';

interface GameCompleteModalProps {
  result: GameResult;
  game: any;
  onClose: () => void;
}

export const GameCompleteModal: React.FC<GameCompleteModalProps> = ({ result, game, onClose }) => {
  const getPerformanceMessage = () => {
    if (result.accuracy >= 90) return "Outstanding! 🏆";
    if (result.accuracy >= 75) return "Great job! 🎉";
    if (result.accuracy >= 60) return "Good effort! 👍";
    return "Keep practicing! 💪";
  };

  const shareResult = () => {
    const text = `I just played ${game.title} on Brain Arcade and scored ${result.score} points with ${result.accuracy}% accuracy! 🧠⚡`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Brain Arcade Game Result',
        text,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(text + ` ${window.location.href}`);
      // You could show a toast here
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl max-w-md w-full p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Game Complete!</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{getPerformanceMessage()}</div>
          <h3 className="text-xl font-bold text-white mb-4">{game.title}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{result.score}</div>
            <div className="text-sm text-white/70">Score</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{result.accuracy}%</div>
            <div className="text-sm text-white/70">Accuracy</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{result.timeSpent}s</div>
            <div className="text-sm text-white/70">Time</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 flex items-center justify-center">
              <Zap className="h-5 w-5 mr-1" />
              {result.xpEarned}
            </div>
            <div className="text-sm text-white/70">XP Earned</div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={shareResult}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center space-x-2 transition-colors"
          >
            <Share2 className="h-5 w-5" />
            <span>Share Result</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-lg font-bold transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
