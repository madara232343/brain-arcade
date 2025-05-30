import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface SpeedTypingGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

const words = [
  'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'the', 'and', 'you',
  'javascript', 'react', 'component', 'function', 'array', 'object', 'string',
  'number', 'boolean', 'interface', 'type', 'class', 'method', 'variable',
  'algorithm', 'data', 'structure', 'loop', 'condition', 'return', 'import'
];

export const SpeedTypingGame: React.FC<SpeedTypingGameProps> = ({ onComplete, gameId }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctWords, setCorrectWords] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [startTime, setStartTime] = useState(0);

  const generateWord = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(word);
  };

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    generateWord();
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted, gameOver]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    if (value === currentWord) {
      setCorrectWords(prev => prev + 1);
      setScore(prev => prev + currentWord.length * 2);
      setTotalWords(prev => prev + 1);
      setUserInput('');
      generateWord();
      
      // Calculate WPM
      const timeElapsed = (Date.now() - startTime) / 1000 / 60;
      setWpm(Math.round((correctWords + 1) / timeElapsed));
    } else if (value.length > currentWord.length || !currentWord.startsWith(value)) {
      // Wrong input, skip word
      setTotalWords(prev => prev + 1);
      setUserInput('');
      generateWord();
    }
  };

  const endGame = () => {
    setGameOver(true);
    const accuracy = totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
    const xpEarned = Math.round(score / 5);

    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 60,
      xpEarned
    });
  };

  const getInputColor = () => {
    if (userInput === '') return 'text-white';
    if (currentWord.startsWith(userInput)) return 'text-green-400';
    return 'text-red-400';
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white">
        <h3 className="text-2xl font-bold mb-4">⚡ Speed Typing</h3>
        <p className="mb-6 text-lg">Type the words as fast and accurately as possible!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-4">
            <p className="text-sm">• Type each word exactly as shown</p>
            <p className="text-sm">• Press Enter or complete the word to continue</p>
            <p className="text-sm">• Focus on accuracy and speed</p>
            <p className="text-sm">• Track your WPM (Words Per Minute)</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Typing
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white">
        <h3 className="text-2xl font-bold mb-4">⚡ Typing Complete!</h3>
        <div className="space-y-2 text-lg">
          <p>Words Typed: {correctWords}</p>
          <p>Accuracy: {totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0}%</p>
          <p>Speed: {wpm} WPM</p>
          <p>Score: {score} points</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-white">
      <div className="flex justify-around mb-6 text-lg">
        <div>Time: {timeLeft}s</div>
        <div>WPM: {wpm}</div>
        <div>Score: {score}</div>
      </div>

      <div className="mb-8">
        <p className="text-sm mb-2">Type this word:</p>
        <div className="text-6xl font-bold mb-6 font-mono tracking-wider">
          {currentWord.split('').map((char, index) => (
            <span
              key={index}
              className={
                index < userInput.length
                  ? userInput[index] === char
                    ? 'text-green-400'
                    : 'text-red-400 bg-red-400/20'
                  : 'text-white/50'
              }
            >
              {char}
            </span>
          ))}
        </div>

        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className={`px-6 py-4 text-2xl text-center bg-white/10 rounded-xl border-2 border-white/30 ${getInputColor()} placeholder-white/50 focus:outline-none focus:border-blue-400 w-full max-w-md`}
          placeholder="Start typing..."
          autoFocus
        />
      </div>

      <div className="text-sm text-white/70 space-x-4">
        <span>Correct: {correctWords}</span>
        <span>Total: {totalWords}</span>
        <span>Accuracy: {totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 100}%</span>
      </div>
    </div>
  );
};
