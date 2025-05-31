
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface WordChainGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const WordChainGame: React.FC<WordChainGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [chain, setChain] = useState<string[]>([]);

  const words = ['apple', 'elephant', 'table', 'eagle', 'house', 'sun', 'night', 'tree', 'elephant', 'tiger'];

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    const startWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(startWord);
    setChain([startWord]);
    setUsedWords([startWord]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const word = userInput.toLowerCase().trim();
    
    if (word.length < 2) return;
    
    const lastLetter = currentWord[currentWord.length - 1];
    const firstLetter = word[0];
    
    if (firstLetter === lastLetter && !usedWords.includes(word)) {
      setScore(prev => prev + word.length * 10);
      setCurrentWord(word);
      setChain(prev => [...prev, word]);
      setUsedWords(prev => [...prev, word]);
      setUserInput('');
    } else {
      // Invalid word, small penalty
      setScore(prev => Math.max(0, prev - 5));
    }
    setUserInput('');
  };

  const endGame = () => {
    onComplete({
      gameId,
      score,
      accuracy: Math.min(100, (chain.length / 20) * 100),
      timeSpent: 60 - timeLeft,
      xpEarned: Math.round(score / 4)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">Word Chain Challenge</h3>
        <p className="mb-6 text-sm md:text-base">Create a chain of words where each word starts with the last letter of the previous word!</p>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Word Chain
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="flex justify-between text-base md:text-lg mb-4">
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
          <span>Chain: {chain.length}</span>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-6 md:p-8 mb-6">
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-bold mb-2">Current Word:</h3>
          <div className="text-2xl md:text-3xl font-bold text-orange-400">{currentWord}</div>
          <p className="text-sm md:text-base text-white/70 mt-2">
            Next word must start with: <span className="text-orange-300 font-bold">{currentWord[currentWord.length - 1]?.toUpperCase()}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your word..."
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            autoFocus
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-bold transition-all duration-200"
          >
            Submit Word
          </button>
        </form>
      </div>

      <div className="bg-white/10 rounded-xl p-4">
        <h4 className="font-bold mb-2">Word Chain:</h4>
        <div className="flex flex-wrap gap-2 justify-center">
          {chain.slice(-5).map((word, index) => (
            <span key={index} className="bg-orange-500/20 px-2 py-1 rounded text-sm">
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
