
import React, { useState } from 'react';
import { X, ShoppingCart, Star, Zap, Heart, Shield, Clock, Target } from 'lucide-react';
import { UserProgress } from '@/pages/Index';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'powerups' | 'characters' | 'themes';
  icon: React.ComponentType<any>;
  owned: boolean;
  effect: string;
}

interface ShopModalProps {
  userProgress: UserProgress;
  onClose: () => void;
  onPurchase: (itemId: string, price: number) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ userProgress, onClose, onPurchase }) => {
  const [activeCategory, setActiveCategory] = useState<'powerups' | 'characters' | 'themes'>('powerups');

  const shopItems: ShopItem[] = [
    // Power-ups
    {
      id: 'double-xp',
      name: 'Double XP Boost',
      description: 'Earn 2x XP for the next 5 games',
      price: 100,
      category: 'powerups',
      icon: Zap,
      owned: false,
      effect: 'Next 5 games give double XP'
    },
    {
      id: 'time-freeze',
      name: 'Time Freeze',
      description: 'Stop the timer for 10 seconds in timed games',
      price: 150,
      category: 'powerups',
      icon: Clock,
      owned: false,
      effect: 'Freeze timer for 10 seconds'
    },
    {
      id: 'accuracy-boost',
      name: 'Accuracy Boost',
      description: 'Get a hint in pattern and memory games',
      price: 120,
      category: 'powerups',
      icon: Target,
      owned: false,
      effect: 'One free hint per game'
    },
    {
      id: 'shield',
      name: 'Error Shield',
      description: 'Protect against one wrong answer',
      price: 80,
      category: 'powerups',
      icon: Shield,
      owned: false,
      effect: 'Ignore first mistake'
    },
    // Characters
    {
      id: 'robot-avatar',
      name: 'Cyber Brain',
      description: 'A futuristic AI companion',
      price: 500,
      category: 'characters',
      icon: Star,
      owned: false,
      effect: 'Unlocks robot avatar'
    },
    {
      id: 'wizard-avatar',
      name: 'Brain Wizard',
      description: 'Master of mental magic',
      price: 750,
      category: 'characters',
      icon: Star,
      owned: false,
      effect: 'Unlocks wizard avatar'
    },
    {
      id: 'scientist-avatar',
      name: 'Mad Scientist',
      description: 'Genius laboratory researcher',
      price: 600,
      category: 'characters',
      icon: Star,
      owned: false,
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
      owned: false,
      effect: 'Changes app theme to neon'
    },
    {
      id: 'nature-theme',
      name: 'Forest Calm',
      description: 'Peaceful green nature theme',
      price: 250,
      category: 'themes',
      icon: Heart,
      owned: false,
      effect: 'Changes app theme to nature'
    },
    {
      id: 'space-theme',
      name: 'Cosmic Explorer',
      description: 'Deep space adventure theme',
      price: 400,
      category: 'themes',
      icon: Heart,
      owned: false,
      effect: 'Changes app theme to space'
    }
  ];

  const filteredItems = shopItems.filter(item => item.category === activeCategory);

  const handlePurchase = (item: ShopItem) => {
    if (userProgress.totalScore >= item.price && !item.owned) {
      onPurchase(item.id, item.price);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden border border-white/30 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="h-6 w-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Brain Shop</h2>
            <div className="bg-yellow-500/20 rounded-lg px-3 py-1">
              <span className="text-yellow-300 font-bold">{userProgress.totalScore} coins</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {/* Category Tabs */}
          <div className="flex space-x-1 mb-6 bg-white/10 rounded-xl p-1">
            {(['powerups', 'characters', 'themes'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-white text-indigo-900'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const IconComponent = item.icon;
              const canAfford = userProgress.totalScore >= item.price;
              const isOwned = item.owned;

              return (
                <div
                  key={item.id}
                  className={`bg-white/10 rounded-xl p-6 border transition-all hover:scale-105 ${
                    isOwned
                      ? 'border-green-400/50 bg-green-400/10'
                      : canAfford
                      ? 'border-white/30 hover:border-blue-400/50'
                      : 'border-white/20 opacity-60'
                  }`}
                >
                  <div className="text-center">
                    <div className={`inline-flex p-4 rounded-xl mb-4 ${
                      isOwned ? 'bg-green-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="font-bold text-white text-lg mb-2">{item.name}</h3>
                    <p className="text-white/70 text-sm mb-4">{item.description}</p>
                    
                    <div className="bg-white/10 rounded-lg p-3 mb-4">
                      <p className="text-white/80 text-xs">{item.effect}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-yellow-400 font-bold text-lg">
                        {item.price} coins
                      </div>
                      
                      {isOwned ? (
                        <span className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
                          Owned
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePurchase(item)}
                          disabled={!canAfford}
                          className={`px-4 py-2 rounded-lg font-bold transition-all ${
                            canAfford
                              ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? 'Buy' : 'Not enough coins'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
