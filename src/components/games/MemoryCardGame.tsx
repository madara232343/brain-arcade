
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';
import { PowerUpBar } from '@/components/PowerUpBar';
import { audioManager } from '@/utils/audioUtils';

interface MemoryCardGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

const emojis = ['🎯', '🎪', '🎨', '🎭', '🎪', '🚀', '⭐', '🌟', '💎', '🔥', '⚡', '🌈', '🎁', '🏆', '🎸', '🎺'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryCardGame: React.FC<MemoryCardGameProps> = ({ onComplete, gameId }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [activePowerUps, setActivePowerUps] = useState<Set<string>>(new Set());

  const gridSize = 4; // 4x4 grid = 16 cards = 8 pairs

  const initializeGame = () => {
    const selectedEmojis = emojis.slice(0, 8);
    const cardEmojis = [...selectedEmojis, ...selectedEmojis];
    
    const shuffledCards = cardEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameStarted(true);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && matches < 8) {
      const timer = setTimeout(() => {
        if (!activePowerUps.has('timeFreeze')) {
          setTimeLeft(prev => prev - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || matches === 8) {
      endGame();
    }
  }, [timeLeft, gameStarted, matches, activePowerUps]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard?.emoji === secondCard?.emoji) {
        // Match found
        audioManager.play('success');
        setMatches(prev => prev + 1);
        setScore(prev => prev + (50 * (activePowerUps.has('doubleXP') ? 2 : 1)));
        
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ));
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        audioManager.play('error');
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handlePowerUpUsed = (type: string) => {
    setActivePowerUps(prev => new Set([...prev, type]));
    
    if (type === 'timeFreeze') {
      setTimeout(() => {
        setActivePowerUps(prev => {
          const newSet = new Set(prev);
          newSet.delete('timeFreeze');
          return newSet;
        });
      }, 10000);
    } else if (type === 'accuracyBoost') {
      // Briefly show all cards
      setCards(prev => prev.map(c => ({ ...c, isFlipped: true })));
      setTimeout(() => {
        setCards(prev => prev.map(c => ({ 
          ...c, 
          isFlipped: c.isMatched 
        })));
      }, 2000);
      
      setActivePowerUps(prev => {
        const newSet = new Set(prev);
        newSet.delete('accuracyBoost');
        return newSet;
      });
    }
  };

  const endGame = () => {
    const accuracy = Math.round((matches / 8) * 100);
    const timeBonus = Math.max(0, timeLeft * 5);
    const moveBonus = Math.max(0, (50 - moves) * 10);
    const finalScore = score + timeBonus + moveBonus;
    const xpEarned = Math.round(finalScore / 5);

    onComplete({
      gameId,
      score: finalScore,
      accuracy,
      timeSpent: 90 - timeLeft,
      xpEarned
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🃏 Memory Cards</h3>
        <p className="mb-6 text-sm md:text-lg">Match all pairs of cards!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Click cards to flip them</p>
            <p className="text-xs md:text-sm mb-2">• Match pairs of identical emojis</p>
            <p className="text-xs md:text-sm">• Complete all pairs before time runs out</p>
          </div>
        </div>
        <button
          onClick={initializeGame}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 hover:scale-105"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (matches === 8 || timeLeft === 0) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">
          {matches === 8 ? '🎉 Perfect!' : '⏰ Time Up!'}
        </h3>
        <div className="space-y-2 md:space-y-3 text-sm md:text-lg">
          <p>Matches: <span className="text-green-400 font-bold">{matches}/8</span></p>
          <p>Moves: <span className="text-blue-400 font-bold">{moves}</span></p>
          <p>Score: <span className="text-yellow-400 font-bold">{score}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-2 md:p-4">
      <PowerUpBar onPowerUpUsed={handlePowerUpUsed} />
      
      <div className="flex flex-wrap justify-between mb-4 md:mb-6 text-sm md:text-lg gap-2">
        <div>Time: <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>{timeLeft}s</span></div>
        <div>Matches: <span className="font-bold text-green-400">{matches}/8</span></div>
        <div>Moves: <span className="font-bold text-purple-400">{moves}</span></div>
        <div>Score: <span className="font-bold text-yellow-400">{score}</span></div>
      </div>

      <div className="grid grid-cols-4 gap-2 md:gap-3 max-w-sm mx-auto">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-lg transition-all duration-300 border-2 flex items-center justify-center text-xl md:text-2xl font-bold touch-target ${
              card.isFlipped || card.isMatched
                ? 'bg-white border-blue-400 transform scale-105'
                : 'bg-gradient-to-br from-gray-600 to-gray-800 border-gray-500 hover:border-gray-400 hover:scale-105'
            } ${
              card.isMatched ? 'animate-pulse bg-green-200' : ''
            }`}
            disabled={card.isFlipped || card.isMatched || flippedCards.length === 2}
          >
            {(card.isFlipped || card.isMatched) ? card.emoji : '?'}
          </button>
        ))}
      </div>
    </div>
  );
};
