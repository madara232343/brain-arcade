
import React, { useState } from 'react';
import { GameModal } from '@/components/GameModal';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SearchBar } from '@/components/SearchBar';
import { GameGrid } from '@/components/GameGrid';
import { DailyChallenge } from '@/components/DailyChallenge';
import { PowerUpBar } from '@/components/PowerUpBar';
import { Navbar } from '@/components/Navbar';

export interface GameResult {
  gameId: string;
  score: number;
  accuracy: number;
  timeSpent: number;
  xpEarned: number;
}

export interface UserProgress {
  level: number;
  xp: number;
  gamesPlayed: number;
  totalScore: number;
  achievements: string[];
}

const Games = () => {
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleGameComplete = (result: GameResult) => {
    console.log('Game completed:', result);
    // Handle game completion logic here
    setSelectedGame(null);
  };

  const handlePowerUpUsed = (type: string) => {
    console.log('Power-up used:', type);
    // Handle power-up usage logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Brain Training Games
          </h1>
          <p className="text-white/70 text-center text-lg">
            Challenge your mind with our collection of cognitive games
          </p>
        </div>

        <DailyChallenge />
        <PowerUpBar onPowerUpUsed={handlePowerUpUsed} />

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory} 
          />
        </div>

        <GameGrid 
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          onGameSelect={setSelectedGame}
        />

        {selectedGame && (
          <GameModal
            game={selectedGame}
            onClose={() => setSelectedGame(null)}
            onComplete={handleGameComplete}
          />
        )}
      </div>
    </div>
  );
};

export default Games;
