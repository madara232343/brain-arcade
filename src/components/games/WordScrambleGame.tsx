
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface WordScrambleGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

export const WordScrambleGame: React.FC<WordScrambleGameProps> = ({ onComplete, gameId }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [hint, setHint] = useState('');

  const words = [
    { word: 'JAVASCRIPT', hint: 'Programming language' },
    { word: 'COMPUTER', hint: 'Electronic device' },
    { word: 'KEYBOARD', hint: 'Input device' },
    { word: 'INTERNET', hint: 'Global network' },
    { word: 'ALGORITHM', hint: 'Problem-solving steps' },
    { word: 'DATABASE', hint: 'Data storage system' },
    { word: 'NETWORK', hint: 'Connected systems' },
    { word: 'SOFTWARE', hint: 'Computer programs' },
    { word: 'HARDWARE', hint: 'Physical components' },
    { word: 'BROWSER', hint: 'Web navigation tool' }
  ];

  const scrambleWord = (word: string) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };

  const generateNewWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord.word);
    setScrambledWord(scrambleWord(randomWord.word));
    setHint(randomWord.hint);
    setUserGuess('');
  };

  const startGame = () => {
    setGameStarted(true);
    generateNewWord();
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const handleSubmit = () => {
    if (userGuess.toUpperCase() === currentWord) {
      setScore(prev => prev + 100);
      setWordsCompleted(prev => prev + 1);
      generateNewWord();
    } else {
      // Wrong answer feedback
      setUserGuess('');
    }
  };

  const endGame = () => {
    const accuracy = Math.round((wordsCompleted / (wordsCompleted + 1)) * 100);
    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 90 - timeLeft,
      xpEarned: Math.round(score / 3)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🔤 Word Scramble</h3>
        <p className="mb-6 text-sm md:text-base">Unscramble the letters to form words!</p>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start Word Scramble
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
          <span>Words: {wordsCompleted}</span>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-6 md:p-8 mb-6">
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-bold mb-2">Unscramble this word:</h3>
          <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4 tracking-widest">
            {scrambledWord}
          </div>
          <p className="text-white/70 text-sm md:text-base">Hint: {hint}</p>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Type your answer..."
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-lg font-bold"
            maxLength={currentWord.length}
          />
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105"
          >
            Submit Answer
          </button>
        </div>
      </div>

      <div className="bg-white/10 rounded-full h-2 mb-4">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(timeLeft / 90) * 100}%` }}
        />
      </div>
    </div>
  );
};
