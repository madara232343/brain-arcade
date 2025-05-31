
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface WordAssociationGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

const wordPairs = [
  { word: 'cat', associations: ['dog', 'pet', 'animal', 'feline', 'meow'] },
  { word: 'sun', associations: ['moon', 'hot', 'bright', 'light', 'day'] },
  { word: 'book', associations: ['read', 'page', 'story', 'library', 'knowledge'] },
  { word: 'car', associations: ['drive', 'road', 'vehicle', 'wheel', 'travel'] },
  { word: 'tree', associations: ['leaf', 'forest', 'green', 'branch', 'nature'] },
  { word: 'house', associations: ['home', 'door', 'roof', 'family', 'building'] },
  { word: 'water', associations: ['drink', 'wet', 'ocean', 'blue', 'liquid'] },
  { word: 'fire', associations: ['hot', 'burn', 'red', 'heat', 'flame'] }
];

export const WordAssociationGame: React.FC<WordAssociationGameProps> = ({ onComplete, gameId }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [usedWords, setUsedWords] = useState<string[]>([]);

  const getRandomWord = () => {
    const availableWords = wordPairs.filter(pair => !usedWords.includes(pair.word));
    if (availableWords.length === 0) {
      setUsedWords([]);
      return wordPairs[Math.floor(Math.random() * wordPairs.length)];
    }
    return availableWords[Math.floor(Math.random() * availableWords.length)];
  };

  const startGame = () => {
    setGameStarted(true);
    const wordPair = getRandomWord();
    setCurrentWord(wordPair.word);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const currentPair = wordPairs.find(pair => pair.word === currentWord);
    const isCorrect = currentPair?.associations.some(assoc => 
      assoc.toLowerCase().includes(userInput.toLowerCase()) || 
      userInput.toLowerCase().includes(assoc.toLowerCase())
    );

    setTotalAnswers(totalAnswers + 1);
    
    if (isCorrect) {
      setScore(score + 10);
      setCorrectAnswers(correctAnswers + 1);
    }

    // Move to next word
    setUsedWords([...usedWords, currentWord]);
    const nextWord = getRandomWord();
    setCurrentWord(nextWord.word);
    setUserInput('');
    setRound(round + 1);
  };

  const endGame = () => {
    const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 60 - timeLeft,
      xpEarned: Math.round(score / 2)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Word Association</h3>
        <p className="mb-6">Type words that relate to the given word!</p>
        <div className="mb-6">
          <p className="text-sm text-gray-300 mb-2">Example:</p>
          <p className="text-lg">Word: <span className="text-blue-400 font-bold">CAT</span></p>
          <p className="text-sm">You could type: dog, pet, animal, meow, etc.</p>
        </div>
        <button
          onClick={startGame}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="flex justify-between text-lg mb-4">
          <span>Round: {round}</span>
          <span>Score: {score}</span>
          <span>Time: {timeLeft}s</span>
        </div>
        <div className="text-sm text-gray-300">
          Correct: {correctAnswers}/{totalAnswers}
        </div>
      </div>

      <div className="mb-8">
        <p className="text-2xl mb-4">What relates to:</p>
        <div className="text-4xl font-bold text-blue-400 mb-6">
          {currentWord.toUpperCase()}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-xl text-center focus:outline-none focus:border-blue-500"
          placeholder="Type your association..."
          autoFocus
        />
        <button
          type="submit"
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Submit
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-400">
        Think of words that are related, similar, or connected to the given word
      </p>
    </div>
  );
};
