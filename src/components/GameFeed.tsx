
import React from 'react';
import { Link } from 'react-router-dom';
import { gameData, getGamesByCategory } from '@/data/gameData';

interface GameFeedProps {
  onPlayGame?: (game: any) => void;
  playedGames: string[];
  selectedCategory: string;
}

export const GameFeed: React.FC<GameFeedProps> = ({ selectedCategory, playedGames }) => {
  const games = getGamesByCategory(selectedCategory);

  return (
    <div className="mt-6">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Available Games</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {games.map((game) => {
          const isPlayed = playedGames.includes(game.id);
          const IconComponent = game.icon;
          
          return (
            <Link
              key={game.id}
              to={`/game/${game.id}`}
              className="group bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
            >
              <div className="px-3 py-3 md:p-4">
                <div className="flex items-center mb-2 md:mb-3">
                  <div className={`p-1.5 md:p-2 rounded-lg ${
                    isPlayed ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'
                  }`}>
                    <IconComponent className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <div className="ml-2">
                    <h3 className="text-sm md:text-base font-semibold text-white group-hover:text-blue-300 transition-colors">{game.title}</h3>
                    <p className="text-white/60 text-xs">{game.category}</p>
                  </div>
                </div>
                <p className="text-white/70 text-xs mb-2 line-clamp-2 h-8">{game.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/50">{game.difficulty}</span>
                  <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-white/70">
                    {isPlayed ? 'Played' : game.duration}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
