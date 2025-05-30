
import React from 'react';
import { Home, Gamepad2, Trophy, User, MessageCircle } from 'lucide-react';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  currentPage: 'home' | 'games' | 'leaderboard' | 'profile';
  onNavigate: (page: string) => void;
  onChatOpen: () => void;
}

export const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({
  children,
  currentPage,
  onNavigate,
  onChatOpen
}) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Main Content */}
      <div className="flex-1 pb-20 md:pb-0">
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/20 z-40">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => onNavigate('/')}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              currentPage === 'home' ? 'text-purple-400' : 'text-white/70 hover:text-white'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => onNavigate('/games')}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              currentPage === 'games' ? 'text-purple-400' : 'text-white/70 hover:text-white'
            }`}
          >
            <Gamepad2 className="h-5 w-5" />
            <span className="text-xs">Games</span>
          </button>
          
          <button
            onClick={() => onNavigate('/leaderboard')}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              currentPage === 'leaderboard' ? 'text-purple-400' : 'text-white/70 hover:text-white'
            }`}
          >
            <Trophy className="h-5 w-5" />
            <span className="text-xs">Leaders</span>
          </button>
          
          <button
            onClick={onChatOpen}
            className="flex flex-col items-center justify-center space-y-1 text-white/70 hover:text-white transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs">Help</span>
          </button>
        </div>
      </div>

      {/* Floating Chat Button for Desktop */}
      <button
        onClick={onChatOpen}
        className="hidden md:block fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 rounded-full shadow-2xl z-40 transition-all duration-300 hover:scale-110"
      >
        <MessageCircle className="h-6 w-6 text-white mx-auto" />
      </button>
    </div>
  );
};
