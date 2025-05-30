
import React from 'react';
import { Gamepad2, Zap, Car, Target, Brain, Puzzle, Clock, Trophy } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'All Games', icon: Gamepad2, color: 'from-purple-500 to-blue-500' },
  { id: 'memory', name: 'Memory', icon: Brain, color: 'from-blue-500 to-cyan-500' },
  { id: 'puzzle', name: 'Puzzle', icon: Puzzle, color: 'from-green-500 to-teal-500' },
  { id: 'speed', name: 'Speed', icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { id: 'reaction', name: 'Reaction', icon: Target, color: 'from-red-500 to-pink-500' },
  { id: 'racing', name: 'Racing', icon: Car, color: 'from-orange-500 to-red-500' },
  { id: 'arcade', name: 'Arcade', icon: Trophy, color: 'from-purple-500 to-pink-500' },
  { id: 'strategy', name: 'Strategy', icon: Clock, color: 'from-indigo-500 to-purple-500' }
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Gamepad2 className="h-6 w-6 mr-2 text-purple-400" />
        Game Categories
      </h3>
      
      <div className="flex flex-wrap gap-2 md:gap-3">
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                isSelected
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span className="text-sm md:text-base">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
