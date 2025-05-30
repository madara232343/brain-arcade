import React from 'react';

interface GameGridProps {
  selectedCategory: string;
  searchTerm: string;
  onGameSelect: (game: any) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({ selectedCategory, searchTerm, onGameSelect }) => {
  const games = [
    // Memory Games
    { id: 'memory', title: 'Memory Game', category: 'memory', difficulty: 'Easy', description: 'Remember the sequence', component: 'MemoryGame', emoji: '🧠' },
    { id: 'simon-says', title: 'Simon Says', category: 'memory', difficulty: 'Medium', description: 'Follow the pattern', component: 'SimonSaysGame', emoji: '🎵' },
    { id: 'visual-attention', title: 'Visual Attention', category: 'memory', difficulty: 'Hard', description: 'Find hidden objects', component: 'VisualAttentionGame', emoji: '👁️' },
    
    // Puzzle Games
    { id: 'tic-tac-toe', title: 'Tic Tac Toe', category: 'puzzle', difficulty: 'Easy', description: 'Classic strategy game', component: 'TicTacToeGame', emoji: '⭕' },
    { id: 'rock-paper-scissors', title: 'Rock Paper Scissors', category: 'puzzle', difficulty: 'Easy', description: 'Beat the AI', component: 'RockPaperScissorsGame', emoji: '✂️' },
    { id: 'pattern-match', title: 'Pattern Match', category: 'puzzle', difficulty: 'Medium', description: 'Match the patterns', component: 'PatternMatchGame', emoji: '🎯' },
    
    // Arcade Games
    { id: 'snake', title: 'Snake Game', category: 'arcade', difficulty: 'Medium', description: 'Classic snake game', component: 'SnakeGame', emoji: '🐍' },
    { id: 'car-racing', title: 'Highway Racer', category: 'arcade', difficulty: 'Hard', description: 'Avoid traffic at high speed', component: 'CarRacingGame', emoji: '🏎️' },
    { id: 'bubble-shooter', title: 'Bubble Shooter', category: 'arcade', difficulty: 'Medium', description: 'Pop bubbles by matching colors', component: 'BubbleShooterGame', emoji: '🫧' },
    { id: 'space-shooter', title: 'Space Shooter', category: 'arcade', difficulty: 'Hard', description: 'Defend against aliens', component: 'SpaceShooterGame', emoji: '🚀' },
    
    // Speed Games
    { id: 'reaction-time', title: 'Reaction Time', category: 'speed', difficulty: 'Easy', description: 'Test your reflexes', component: 'ReactionTimeGame', emoji: '⚡' },
    { id: 'speed-typing', title: 'Speed Typing', category: 'speed', difficulty: 'Medium', description: 'Type as fast as you can', component: 'SpeedTypingGame', emoji: '⌨️' },
    { id: 'math-sprint', title: 'Math Sprint', category: 'speed', difficulty: 'Medium', description: 'Solve math problems quickly', component: 'MathSprintGame', emoji: '🔢' },
    { id: 'color-click', title: 'Color Click', category: 'speed', difficulty: 'Easy', description: 'Click the right colors', component: 'ColorClickGame', emoji: '🎨' },
    
    // Logic Games
    { id: 'number-guessing', title: 'Number Guessing', category: 'logic', difficulty: 'Easy', description: 'Guess the hidden number', component: 'NumberGuessingGame', emoji: '🎯' },
    { id: 'chess-mini', title: 'Chess Puzzles', category: 'logic', difficulty: 'Hard', description: 'Solve chess tactics', component: 'ChessMiniGame', emoji: '♟️' },
  ];

  const filteredGames = games.filter(game => {
    const categoryMatch = selectedCategory === 'all' || game.category === selectedCategory;
    const searchMatch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredGames.map(game => (
        <div
          key={game.id}
          onClick={() => onGameSelect(game)}
          className="bg-white/5 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer border border-white/10"
        >
          <div className="text-5xl mb-2">{game.emoji}</div>
          <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
          <p className="text-white/70 text-sm">{game.description}</p>
          <div className="mt-2">
            <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full mr-1">{game.category}</span>
            <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">{game.difficulty}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
