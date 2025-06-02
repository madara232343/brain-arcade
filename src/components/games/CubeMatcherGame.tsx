
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface CubeMatcherGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Cube {
  id: number;
  pattern: number[];
  color: string;
  matched: boolean;
}

export const CubeMatcherGame: React.FC<CubeMatcherGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [selectedCubes, setSelectedCubes] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(90);
  const [matches, setMatches] = useState(0);

  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
  const patterns = [
    [1, 0, 1, 0, 1, 0], // Alternating
    [1, 1, 0, 0, 1, 1], // Pairs
    [1, 0, 0, 1, 0, 0], // Scattered
    [0, 1, 1, 1, 0, 1], // Mostly filled
    [1, 1, 1, 0, 0, 0], // Half filled
    [0, 0, 1, 1, 0, 0]  // Center filled
  ];

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameStarted, timeLeft]);

  const generateCubes = () => {
    const newCubes: Cube[] = [];
    const numCubes = 6 + level * 2;
    const numPairs = Math.floor(numCubes / 2);
    
    // Create pairs of matching cubes
    for (let i = 0; i < numPairs; i++) {
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Create two identical cubes
      for (let j = 0; j < 2; j++) {
        newCubes.push({
          id: newCubes.length,
          pattern: [...pattern],
          color,
          matched: false
        });
      }
    }
    
    // Shuffle the cubes
    for (let i = newCubes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCubes[i], newCubes[j]] = [newCubes[j], newCubes[i]];
      newCubes[i].id = i;
      newCubes[j].id = j;
    }
    
    setCubes(newCubes);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLevel(1);
    setMatches(0);
    setTimeLeft(90);
    setSelectedCubes([]);
    generateCubes();
  };

  const selectCube = (cubeId: number) => {
    if (selectedCubes.includes(cubeId) || cubes[cubeId].matched) return;
    
    const newSelected = [...selectedCubes, cubeId];
    setSelectedCubes(newSelected);
    
    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      const cube1 = cubes[first];
      const cube2 = cubes[second];
      
      // Check if patterns match
      const patternsMatch = cube1.pattern.every((val, idx) => val === cube2.pattern[idx]);
      const colorsMatch = cube1.color === cube2.color;
      
      if (patternsMatch && colorsMatch) {
        // Match found!
        setCubes(prev => prev.map(cube => 
          cube.id === first || cube.id === second 
            ? { ...cube, matched: true }
            : cube
        ));
        setScore(prev => prev + level * 100);
        setMatches(prev => prev + 1);
        
        // Check if all pairs matched
        if (matches + 1 >= Math.floor((6 + level * 2) / 2)) {
          setLevel(prev => prev + 1);
          setTimeout(() => {
            generateCubes();
            setMatches(0);
          }, 1000);
        }
      }
      
      setTimeout(() => setSelectedCubes([]), 1000);
    }
  };

  const endGame = () => {
    const accuracy = cubes.length > 0 ? Math.round((matches * 2 / cubes.length) * 100) : 0;
    onComplete({
      gameId,
      score,
      accuracy: Math.min(accuracy, 100),
      timeSpent: 90 - timeLeft,
      xpEarned: Math.round(score / 5)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-2 md:p-4">
        <h3 className="text-lg md:text-2xl font-bold mb-4">🧊 Cube Matcher</h3>
        <p className="mb-6 text-sm md:text-base">Match cubes with identical patterns and colors!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Click two cubes to compare them</p>
            <p className="text-xs md:text-sm mb-2">• Match cubes with same pattern and color</p>
            <p className="text-xs md:text-sm">• Complete all pairs to advance levels</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 text-sm md:text-base"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-2 md:p-4">
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between text-sm md:text-lg mb-4">
          <span>Level: {level}</span>
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
        </div>
        <p className="text-xs md:text-sm">Matches: {matches}/{Math.floor((6 + level * 2) / 2)}</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 max-w-md mx-auto mb-6">
        {cubes.map((cube) => (
          <button
            key={cube.id}
            onClick={() => selectCube(cube.id)}
            className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg transition-all duration-200 border-2 ${
              cube.matched 
                ? 'opacity-50 border-green-500' 
                : selectedCubes.includes(cube.id)
                  ? 'border-yellow-400 scale-110' 
                  : 'border-white/30 hover:border-white/60 hover:scale-105'
            } ${cube.color}`}
            disabled={cube.matched}
          >
            {/* Cube pattern display */}
            <div className="grid grid-cols-3 gap-1 p-1 h-full">
              {cube.pattern.map((dot, idx) => (
                <div
                  key={idx}
                  className={`rounded-full ${
                    dot ? 'bg-white' : 'bg-black/30'
                  }`}
                />
              ))}
            </div>
            
            {cube.matched && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white/10 rounded-full h-2">
        <div 
          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(timeLeft / 90) * 100}%` }}
        />
      </div>
    </div>
  );
};
