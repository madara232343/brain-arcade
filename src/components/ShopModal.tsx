
import React, { useState } from 'react';
import { X, ShoppingCart, Star, Zap, Heart, Shield, Clock, Target, Package } from 'lucide-react';

interface UserProgress {
  totalScore: number;
  totalXP: number;
  level: number;
  gamesPlayed: string[];
  achievements: string[];
  rank: string;
  streak: number;
  purchasedItems: string[];
  activeTheme: string;
  activePowerUps: string[];
  xp: number;
  lastPlayDate: string;
  playedGames: string[];
  ownedItems: string[];
  totalPlayTime: number;
  theme: string;
  avatar: string;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'powerups' | 'characters' | 'themes';
  icon: React.ComponentType<any>;
  owned: boolean;
  effect: string;
  duration?: string;
}

interface ShopModalProps {
  userProgress: UserProgress;
  onClose: () => void;
  onPurchase: (itemId: string, price: number) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ userProgress, onClose, onPurchase }) => {
  const [activeCategory, setActiveCategory] = useState<'powerups' | 'characters' | 'themes' | 'inventory'>('powerups');

  const shopItems: ShopItem[] = [
    // Power-ups
    {
      id: 'doubleXP',
      name: 'Double XP Boost',
      description: 'Earn 2x XP for the next 5 games',
      price: 100,
      category: 'powerups',
      icon: Zap,
      owned: (userProgress.purchasedItems || []).includes('doubleXP'),
      effect: 'Next 5 games give double XP',
      duration: '5 games'
    },
    {
      id: 'timeFreeze',
      name: 'Time Freeze',
      description: 'Get extra time in timed games',
      price: 150,
      category: 'powerups',
      icon: Clock,
      owned: (userProgress.purchasedItems || []).includes('timeFreeze'),
      effect: 'Adds 30-60 seconds to timer',
      duration: '1 game'
    },
    {
      id: 'accuracyBoost',
      name: 'Accuracy Boost',
      description: 'Get a hint in puzzle and IQ games',
      price: 120,
      category: 'powerups',
      icon: Target,
      owned: (userProgress.purchasedItems || []).includes('accuracyBoost'),
      effect: 'One free hint per game',
      duration: '1 game'
    },
    {
      id: 'shield',
      name: 'Error Shield',
      description: 'Protect against mistakes in action games',
      price: 80,
      category: 'powerups',
      icon: Shield,
      owned: (userProgress.purchasedItems || []).includes('shield'),
      effect: 'Ignore first 3 mistakes',
      duration: '1 game'
    },
    // Characters
    {
      id: 'robot-avatar',
      name: 'Cyber Brain',
      description: 'A futuristic AI companion',
      price: 500,
      category: 'characters',
      icon: Star,
      owned: (userProgress.purchasedItems || []).includes('robot-avatar'),
      effect: 'Unlocks robot avatar'
    },
    {
      id: 'wizard-avatar',
      name: 'Brain Wizard',
      description: 'Master of mental magic',
      price: 750,
      category: 'characters',
      icon: Star,
      owned: (userProgress.purchasedItems || []).includes('wizard-avatar'),
      effect: 'Unlocks wizard avatar'
    },
    {
      id: 'scientist-avatar',
      name: 'Mad Scientist',
      description: 'Genius laboratory researcher',
      price: 600,
      category: 'characters',
      icon: Star,
      owned: (userProgress.purchasedItems || []).includes('scientist-avatar'),
      effect: 'Unlocks scientist avatar'
    },
    // Themes
    {
      id: 'neon-theme',
      name: 'Neon Nights',
      description: 'Cyberpunk-inspired dark theme',
      price: 300,
      category: 'themes',
      icon: Heart,
      owned: (userProgress.purchasedItems || []).includes('neon-theme'),
      effect: 'Changes app theme to neon'
    },
    {
      id: 'nature-theme',
      name: 'Forest Calm',
      description: 'Peaceful green nature theme',
      price: 250,
      category: 'themes',
      icon: Heart,
      owned: (userProgress.purchasedItems || []).includes('nature-theme'),
      effect: 'Changes app theme to nature'
    },
    {
      id: 'space-theme',
      name: 'Cosmic Explorer',
      description: 'Deep space adventure theme',
      price: 400,
      category: 'themes',
      icon: Heart,
      owned: (userProgress.purchasedItems || []).includes('space-theme'),
      effect: 'Changes app theme to space'
    },
    {
      id: 'ocean-theme',
      name: 'Ocean Depths',
      description: 'Calming underwater theme',
      price: 350,
      category: 'themes',
      icon: Heart,
      owned: (userProgress.purchasedItems || []).includes('ocean-theme'),
      effect: 'Changes app theme to ocean'
    },
    {
      id: 'fire-theme',
      name: 'Phoenix Flame',
      description: 'Fiery red and orange theme',
      price: 380,
      category: 'themes',
      icon: Heart,
      owned: (userProgress.purchasedItems || []).includes('fire-theme'),
      effect: 'Changes app theme to fire'
    }
  ];

  const filteredItems = activeCategory === 'inventory' 
    ? shopItems.filter(item => item.owned)
    : shopItems.filter(item => item.category === activeCategory);

  const handlePurchase = (item: ShopItem) => {
    if (userProgress.totalScore >= item.price && !item.owned) {
      onPurchase(item.id, item.price);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
      <div className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl md:rounded-3xl max-w-6xl w-full max-h-[98vh] md:max-h-[95vh] overflow-hidden border border-white/30 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center space-x-2 md:space-x-3">
            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
            <h2 className="text-lg md:text-2xl font-bold text-white">🛒 Brain Shop</h2>
            <div className="bg-yellow-500/20 rounded-lg px-2 md:px-3 py-1">
              <span className="text-yellow-300 font-bold text-sm md:text-base">{userProgress.totalScore} coins</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-target">
            <X className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </button>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(98vh-80px)] md:max-h-[calc(95vh-120px)]">
          {/* Category Tabs */}
          <div className="flex space-x-1 mb-4 md:mb-6 bg-white/10 rounded-xl p-1 overflow-x-auto">
            {(['powerups', 'characters', 'themes', 'inventory'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 py-2 px-3 md:px-4 rounded-lg font-medium transition-all flex items-center space-x-1 md:space-x-2 text-xs md:text-sm ${
                  activeCategory === category
                    ? 'bg-white text-indigo-900'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {category === 'inventory' && <Package className="h-3 w-3 md:h-4 md:w-4" />}
                <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              </button>
            ))}
          </div>

          {/* Power-up usage instructions */}
          {activeCategory === 'powerups' && (
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 mb-6">
              <h3 className="text-white font-bold mb-2 text-sm md:text-base">💡 How Power-ups Work:</h3>
              <ul className="text-white/80 text-xs md:text-sm space-y-1">
                <li>• Power-ups are automatically applied when you start a compatible game</li>
                <li>• Each power-up can only be used once per purchase</li>
                <li>• Effects vary by game type - check descriptions for details</li>
                <li>• Purchase multiple of the same power-up to use them in multiple games</li>
              </ul>
            </div>
          )}

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredItems.map((item) => {
              const IconComponent = item.icon;
              const canAfford = userProgress.totalScore >= item.price;
              const isOwned = item.owned;

              return (
                <div
                  key={item.id}
                  className={`bg-white/10 rounded-xl p-4 md:p-6 border transition-all hover:scale-105 ${
                    isOwned
                      ? 'border-green-400/50 bg-green-400/10'
                      : canAfford
                      ? 'border-white/30 hover:border-blue-400/50'
                      : 'border-white/20 opacity-60'
                  }`}
                >
                  <div className="text-center">
                    <div className={`inline-flex p-3 md:p-4 rounded-xl mb-3 md:mb-4 ${
                      isOwned ? 'bg-green-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }`}>
                      <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    
                    <h3 className="font-bold text-white text-base md:text-lg mb-2">{item.name}</h3>
                    <p className="text-white/70 text-xs md:text-sm mb-3 md:mb-4">{item.description}</p>
                    
                    <div className="bg-white/10 rounded-lg p-2 md:p-3 mb-3 md:mb-4">
                      <p className="text-white/80 text-xs">{item.effect}</p>
                      {item.duration && (
                        <p className="text-blue-300 text-xs mt-1">Duration: {item.duration}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {activeCategory !== 'inventory' && (
                        <div className="text-yellow-400 font-bold text-sm md:text-lg">
                          {item.price} coins
                        </div>
                      )}
                      
                      {isOwned ? (
                        <span className="bg-green-500 text-white px-3 md:px-4 py-2 rounded-lg font-bold flex-1 text-center text-xs md:text-sm">
                          ✓ Owned
                        </span>
                      ) : activeCategory !== 'inventory' ? (
                        <button
                          onClick={() => handlePurchase(item)}
                          disabled={!canAfford}
                          className={`px-3 md:px-4 py-2 rounded-lg font-bold transition-all touch-target text-xs md:text-sm ${
                            canAfford
                              ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? 'Buy' : 'Not enough coins'}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && activeCategory === 'inventory' && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 md:h-16 md:w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">No Items Yet</h3>
              <p className="text-white/70 text-sm md:text-base">Purchase items from other categories to see them here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
