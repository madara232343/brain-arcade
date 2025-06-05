
import { 
  Brain, Cpu, Zap, Puzzle, Clock, Target, Layers, 
  Grid3X3, Shapes, Gamepad2, Crown, Microscope, PuzzlePiece,
  Dices, MousePointer, KeyRound, Layout, Megaphone, Rocket, Blocks,
  CaseSensitive, Boxes, 
} from 'lucide-react';

export const gameData = [
  {
    id: 'memory-sequence',
    title: 'Memory Sequence',
    description: 'Test and improve your memory by remembering sequences.',
    icon: Brain,
    category: 'Memory',
    difficulty: 'Medium',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'color-memory',
    title: 'Color Memory',
    description: 'Remember and match color patterns to enhance your visual memory.',
    icon: Layers,
    category: 'Memory',
    difficulty: 'Easy',
    duration: '2-4 min',
    highScore: 0
  },
  {
    id: 'simon-says',
    title: 'Simon Says',
    description: 'Follow the pattern and repeat it to test your sequence memory.',
    icon: Grid3X3,
    category: 'Memory',
    difficulty: 'Medium',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'memory-cards',
    title: 'Memory Cards',
    description: 'Find matching pairs of cards to test your spatial memory.',
    icon: Layers,
    category: 'Memory',
    difficulty: 'Easy',
    duration: '2-4 min',
    highScore: 0
  },
  {
    id: 'number-memory',
    title: 'Number Memory',
    description: 'Memorize sequences of numbers to enhance working memory.',
    icon: Dices,
    category: 'Memory',
    difficulty: 'Hard',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'word-memory',
    title: 'Word Association',
    description: 'Build mental connections between related words.',
    icon: CaseSensitive,
    category: 'Memory',
    difficulty: 'Medium',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'face-memory',
    title: 'Pattern Match',
    description: 'Remember and identify patterns to improve visual memory.',
    icon: Shapes,
    category: 'Memory',
    difficulty: 'Medium',
    duration: '2-4 min',
    highScore: 0
  },
  {
    id: 'spatial-memory',
    title: 'Spatial Memory',
    description: 'Remember the locations of objects in space.',
    icon: Boxes,
    category: 'Memory',
    difficulty: 'Medium',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'visual-memory',
    title: 'Visual Attention',
    description: 'Quickly spot differences and patterns in visual scenes.',
    icon: Target,
    category: 'Attention',
    difficulty: 'Medium',
    duration: '2-4 min',
    highScore: 0
  },
  {
    id: 'puzzle-blocks',
    title: 'Puzzle Blocks',
    description: 'Arrange blocks to solve spatial puzzles.',
    icon: Puzzle,
    category: 'Puzzle',
    difficulty: 'Medium',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'spatial-reasoning',
    title: 'Spatial Reasoning',
    description: 'Solve puzzles that test your spatial awareness.',
    icon: Puzzle,
    category: 'Puzzle',
    difficulty: 'Hard',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'shape-rotator',
    title: 'Shape Rotator',
    description: 'Mentally rotate shapes to match patterns.',
    icon: Shapes,
    category: 'Puzzle',
    difficulty: 'Hard',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'pattern-match',
    title: 'Pattern Matching',
    description: 'Find matching patterns quickly to test your visual perception.',
    icon: Layers,
    category: 'Puzzle',
    difficulty: 'Medium',
    duration: '2-4 min',
    highScore: 0
  },
  {
    id: 'sudoku',
    title: 'Sudoku',
    description: 'Classic number puzzle to test your logic and reasoning.',
    icon: Grid3X3,
    category: 'Puzzle',
    difficulty: 'Hard',
    duration: '5-10 min',
    highScore: 0
  },
  {
    id: 'maze-solver',
    title: 'Maze Runner',
    description: 'Navigate through increasingly complex mazes.',
    icon: Layout,
    category: 'Puzzle',
    difficulty: 'Medium',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'brain-teaser',
    title: 'Brain Teaser',
    description: 'Solve challenging brain teasers to improve problem-solving.',
    icon: Brain,
    category: 'Puzzle',
    difficulty: 'Hard',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'logic-puzzle',
    title: 'Logic Puzzle',
    description: 'Exercise your logical thinking with deductive reasoning puzzles.',
    icon: Cpu,
    category: 'Puzzle',
    difficulty: 'Hard',
    duration: '5-10 min',
    highScore: 0
  },
  {
    id: 'number-puzzle',
    title: 'Number Puzzle',
    description: 'Solve number-based puzzles to improve mathematical reasoning.',
    icon: Dices,
    category: 'Puzzle',
    difficulty: 'Medium',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'reaction-time',
    title: 'Reaction Time',
    description: 'Test and improve your reaction time with quick challenges.',
    icon: Zap,
    category: 'Speed',
    difficulty: 'Easy',
    duration: '1-3 min',
    highScore: 0
  },
  {
    id: 'speed-typing',
    title: 'Speed Typing',
    description: 'Improve your typing speed and accuracy.',
    icon: KeyRound,
    category: 'Speed',
    difficulty: 'Medium',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'math-sprint',
    title: 'Math Sprint',
    description: 'Solve math problems as quickly as possible.',
    icon: Clock,
    category: 'Speed',
    difficulty: 'Medium',
    duration: '2-4 min',
    highScore: 0
  },
  {
    id: 'quick-math',
    title: 'Quick Math',
    description: 'Test your mental math abilities under time pressure.',
    icon: Clock,
    category: 'Speed',
    difficulty: 'Medium',
    duration: '2-4 min',
    highScore: 0
  },
  {
    id: 'word-scramble',
    title: 'Word Scramble',
    description: 'Unscramble letters to form words as quickly as possible.',
    icon: CaseSensitive,
    category: 'Speed',
    difficulty: 'Medium',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'space-race',
    title: 'Space Racer',
    description: 'Navigate through space avoiding obstacles.',
    icon: Rocket,
    category: 'Racing',
    difficulty: 'Medium',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'bubble-shooter',
    title: 'Bubble Shooter',
    description: 'Pop colorful bubbles to test your aim and strategy.',
    icon: Target,
    category: 'Shooting',
    difficulty: 'Easy',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'snake-game',
    title: 'Snake Game',
    description: 'Classic snake game to test your reflexes and planning.',
    icon: Gamepad2,
    category: 'Arcade',
    difficulty: 'Medium',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'Arrange falling blocks to complete lines in this classic game.',
    icon: Blocks,
    category: 'Arcade',
    difficulty: 'Medium',
    duration: '5-10 min',
    highScore: 0
  },
  {
    id: 'chess',
    title: 'Chess',
    description: 'Classic chess game to improve strategic thinking.',
    icon: Crown,
    category: 'Strategy',
    difficulty: 'Hard',
    duration: '10-15 min',
    highScore: 0
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    description: 'Classic game of Xs and Os to test your tactical thinking.',
    icon: Grid3X3,
    category: 'Strategy',
    difficulty: 'Easy',
    duration: '1-3 min',
    highScore: 0
  },
  {
    id: 'rock-paper-scissors',
    title: 'Rock Paper Scissors',
    description: 'Classic game with a twist to test your prediction skills.',
    icon: Gamepad2,
    category: 'Strategy',
    difficulty: 'Easy',
    duration: '1-3 min',
    highScore: 0
  },
  {
    id: 'enhanced-iq-test',
    title: 'IQ Test',
    description: 'Test your intelligence quotient with challenging problems.',
    icon: Brain,
    category: 'Intelligence',
    difficulty: 'Hard',
    duration: '10-15 min',
    highScore: 0
  },
  {
    id: 'eq-test',
    title: 'EQ Test',
    description: 'Measure your emotional intelligence with scenario-based questions.',
    icon: Brain,
    category: 'Intelligence',
    difficulty: 'Medium',
    duration: '10-15 min',
    highScore: 0
  },
  {
    id: 'color-blend',
    title: 'Color Blend',
    description: 'Mix colors to create specific targets and test your perception.',
    icon: Layers,
    category: 'Creative',
    difficulty: 'Medium',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'word-chain',
    title: 'Word Chain',
    description: 'Create chains of words by connecting letters.',
    icon: CaseSensitive,
    category: 'Word',
    difficulty: 'Medium',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'tower-builder',
    title: 'Tower Builder',
    description: 'Stack blocks to build the tallest tower possible.',
    icon: Blocks,
    category: '3D',
    difficulty: 'Medium',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'cube-matcher',
    title: 'Cube Matcher',
    description: 'Match 3D cubes to test your spatial perception.',
    icon: Boxes,
    category: '3D',
    difficulty: 'Hard',
    duration: '3-5 min',
    highScore: 0
  },
  {
    id: 'orbit-navigator',
    title: 'Orbit Navigator',
    description: 'Navigate through orbiting objects in a 3D space.',
    icon: Rocket,
    category: '3D',
    difficulty: 'Hard',
    duration: '3-5 min',
    highScore: 0
  }
];

export const getGameCategories = () => {
  const categories = new Set(gameData.map(game => game.category));
  return Array.from(categories);
};

export const getGamesByCategory = (category: string) => {
  if (category === 'all') {
    return gameData;
  }
  return gameData.filter(game => game.category === category);
};
