
import React from 'react';
import { Home, Gamepad2, Trophy, MessageCircle } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Main Content */}
      <div className="flex-1 pb-20 md:pb-6 px-2 md:px-4 pt-2 md:pt-4">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/20 z-40 safe-area-inset-bottom">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => onNavigate('/')}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
              currentPage === 'home' 
                ? 'text-purple-400 scale-110' 
                : 'text-white/70 hover:text-white active:scale-95'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button
            onClick={() => onNavigate('/games')}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
              currentPage === 'games' 
                ? 'text-purple-400 scale-110' 
                : 'text-white/70 hover:text-white active:scale-95'
            }`}
          >
            <Gamepad2 className="h-5 w-5" />
            <span className="text-xs font-medium">Games</span>
          </button>
          
          <button
            onClick={() => onNavigate('/leaderboard')}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
              currentPage === 'leaderboard' 
                ? 'text-purple-400 scale-110' 
                : 'text-white/70 hover:text-white active:scale-95'
            }`}
          >
            <Trophy className="h-5 w-5" />
            <span className="text-xs font-medium">Leaders</span>
          </button>
          
          <button
            onClick={onChatOpen}
            className="flex flex-col items-center justify-center space-y-1 text-white/70 hover:text-white transition-all duration-200 active:scale-95 relative"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs font-medium">Help</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </button>
        </div>
      </div>

      {/* Floating Chat Button for Desktop */}
      <button
        onClick={onChatOpen}
        className="hidden md:flex fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 rounded-full shadow-2xl z-40 transition-all duration-300 hover:scale-110 items-center justify-center"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </button>
    </div>
  );
};
