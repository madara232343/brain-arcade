
import React from 'react';
import { 
  Brain, 
  Puzzle, 
  Zap, 
  Car, 
  Target, 
  Gamepad2, 
  Crown, 
  Heart,
  Users 
} from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'All Games', icon: Gamepad2, color: 'from-gray-500 to-gray-600', count: 105 },
  { id: 'memory', name: 'Memory', icon: Brain, color: 'from-blue-500 to-cyan-500', count: 15 },
  { id: 'puzzle', name: 'Puzzle', icon: Puzzle, color: 'from-green-500 to-teal-500', count: 20 },
  { id: 'speed', name: 'Speed', icon: Zap, color: 'from-yellow-500 to-orange-500', count: 15 },
  { id: 'racing', name: 'Racing', icon: Car, color: 'from-orange-500 to-red-500', count: 15 },
  { id: 'shooting', name: 'Shooting', icon: Target, color: 'from-red-500 to-pink-500', count: 15 },
  { id: 'arcade', name: 'Arcade', icon: Gamepad2, color: 'from-purple-500 to-pink-500', count: 10 },
  { id: 'strategy', name: 'Strategy', icon: Crown, color: 'from-indigo-500 to-purple-500', count: 10 },
  { id: 'intelligence', name: 'Intelligence', icon: Users, color: 'from-violet-500 to-purple-600', count: 5 }
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4">Game Categories</h3>
      
      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`group relative p-4 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                isSelected 
                  ? 'bg-white/20 border-white/40 shadow-lg' 
                  : 'bg-white/5 border-white/20 hover:bg-white/10'
              }`}
            >
              <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="h-6 w-6 text-white mx-auto" />
              </div>
              
              <div className="text-center">
                <h4 className={`font-bold text-sm transition-colors ${
                  isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'
                }`}>
                  {category.name}
                </h4>
                <p className="text-white/60 text-xs mt-1">{category.count} games</p>
              </div>
              
              {isSelected && (
                <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                  isSelected 
                    ? 'bg-white/20 border border-white/40' 
                    : 'bg-white/5 border border-white/20'
                }`}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} mb-2`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${
                  isSelected ? 'text-white' : 'text-white/80'
                }`}>
                  {category.name}
                </span>
                <span className="text-white/60 text-xs">{category.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Stats */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/20">
          <span className="text-white/70 text-sm">Total Games: </span>
          <span className="text-white font-bold">105+</span>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/20">
          <span className="text-white/70 text-sm">Categories: </span>
          <span className="text-white font-bold">8</span>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/20">
          <span className="text-white/70 text-sm">New Games: </span>
          <span className="text-green-400 font-bold">Weekly</span>
        </div>
      </div>
    </div>
  );
};
