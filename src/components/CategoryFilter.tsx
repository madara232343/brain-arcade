
import React from 'react';
import { Brain, Zap, Puzzle, Gamepad2, Cpu, Rocket, Target, CaseSensitive, Shapes } from 'lucide-react';
import { getGameCategories } from '@/data/gameData';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryIcons: {[key: string]: React.FC<any>} = {
  'Memory': Brain,
  'Speed': Zap,
  'Puzzle': Puzzle,
  'Arcade': Gamepad2,
  'Strategy': Cpu,
  'Racing': Rocket,
  'Shooting': Target,
  'Word': CaseSensitive,
  '3D': Shapes,
  'Intelligence': Brain,
  'Creative': Shapes,
  'Attention': Target,
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
  const categories = ['all', ...getGameCategories()];

  return (
    <div className="overflow-x-auto pb-2 mb-2">
      <div className="flex space-x-2 min-w-max">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          const IconComponent = category === 'all' 
            ? Gamepad2 
            : (categoryIcons[category] || Brain);
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span className="text-sm font-medium capitalize">
                {category === 'all' ? 'All Games' : category}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
