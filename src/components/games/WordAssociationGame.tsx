
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/pages/Index';

interface WordAssociationGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

const wordPairs = [
  { word: 'hot', associations: ['cold', 'fire', 'summer', 'heat', 'warm'] },
  { word: 'water', associations: ['drink', 'ocean', 'wet', 'liquid', 'blue'] },
  { word: 'happy', associations: ['sad', 'joy', 'smile', 'laugh', 'cheerful'] },
  { word: 'fast', associations: ['slow', 'quick', 'speed', 'rapid', 'swift'] },
  { word: 'big', associations: ['small', 'large', 'huge', 'giant', 'massive'] },
  { word: 'light', associations: ['dark', 'bright', 'sun', 'lamp', 'illuminate'] },
  { word: 'sweet', associations: ['sour', 'sugar', 'candy', 'honey', 'dessert'] },
  { word: 'strong', associations: ['weak', 'power', 'muscle', 'force', 'sturdy'] }
];

export const WordAssociationGame: React.FC<WordAssociationGameProps> = ({ onComplete, gameId }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [streak, setStreak] = useState(0);

  const generateQuestion = () => {
    const randomPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
    const correctAnswer = randomPair.associations[Math.floor(Math.random() * randomPair.associations.length)];
    
    // Create wrong options from other word pairs
    const wrongOptions: string[] = [];
    while (wrongOptions.length < 3) {
      const randomWord = wordPairs[Math.floor(Math.random() * wordPairs.length)];
      const randomAssociation = randomWord.associations[Math.floor(Math.random() * randomWord.associations.length)];
      if (!wrongOptions.includes(randomAssociation) && randomAssociation !== correctAnswer) {
        wrongOptions.push(randomAssociation);
      }
    }

    const allOptions = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setCurrentWord(randomPair.word);
    setOptions(allOptions);
  };

  const startGame = () => {
    setGameStarted(true);
    generateQuestion();
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted, gameOver]);

  const handleAnswer = (selectedWord: string) => {
    const currentPair = wordPairs.find(pair => pair.word === currentWord);
    const isCorrect = currentPair?.associations.includes(selectedWord);

    setTotalQuestions(prev => prev + 1);

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + (10 + streak * 2));
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      generateQuestion();
    }, 1000);
  };

  const endGame = () => {
    setGameOver(true);
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const xpEarned = Math.round(score / 3);

    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 60,
      xpEarned
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white">
        <h3 className="text-2xl font-bold mb-4">🔗 Word Association</h3>
        <p className="mb-6 text-lg">Connect related words as fast as possible!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-4">
            <p className="text-sm mb-2">• Look at the main word</p>
            <p className="text-sm mb-2">• Choose the word most closely related to it</p>
            <p className="text-sm mb-2">• Build streaks for bonus points</p>
            <p className="text-sm">• You have 60 seconds to score as much as possible</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white">
        <h3 className="text-2xl font-bold mb-4">🎯 Word Master!</h3>
        <div className="space-y-3 text-lg">
          <p>Final Score: <span className="text-yellow-400 font-bold">{score}</span> points</p>
          <p>Correct Answers: <span className="text-green-400 font-bold">{correctAnswers}/{totalQuestions}</span></p>
          <p>Accuracy: <span className="text-blue-400 font-bold">{totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%</span></p>
          <p>Best Streak: <span className="text-purple-400 font-bold">{streak}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-white">
      <div className="flex justify-between mb-6 text-lg">
        <div>Time: <span className="font-bold text-red-400">{timeLeft}s</span></div>
        <div>Score: <span className="font-bold text-yellow-400">{score}</span></div>
        <div>Streak: <span className="font-bold text-purple-400">{streak}</span></div>
      </div>

      <div className="mb-8">
        <p className="text-lg mb-4">Which word is most related to:</p>
        <div className="text-6xl font-bold mb-8 text-gradient bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {currentWord}
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="bg-white/10 hover:bg-white/20 border border-white/30 hover:border-blue-400 rounded-xl p-4 text-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-white/70">
        Question {totalQuestions + 1} • {correctAnswers} correct
      </div>
    </div>
  );
};
