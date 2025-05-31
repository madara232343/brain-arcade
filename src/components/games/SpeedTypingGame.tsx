
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface SpeedTypingGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

const sentences = [
  "The quick brown fox jumps over the lazy dog",
  "Pack my box with five dozen liquor jugs",
  "How vexingly quick daft zebras jump",
  "Bright vixens jump; dozy fowl quack",
  "Quick zephyrs blow, vexing daft Jim",
  "Sphinx of black quartz, judge my vow",
  "Two driven jocks help fax my big quiz",
  "Five quacking zephyrs jolt my wax bed"
];

export const SpeedTypingGame: React.FC<SpeedTypingGameProps> = ({ onComplete, gameId }) => {
  const [currentSentence, setCurrentSentence] = useState('');
  const [userInput, setUserInput] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [startTime, setStartTime] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    setCurrentSentence(sentences[Math.floor(Math.random() * sentences.length)]);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    setTotalChars(value.length);

    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === currentSentence[i]) {
        correct++;
      }
    }
    setCorrectChars(correct);

    if (value === currentSentence) {
      setWordsTyped(wordsTyped + currentSentence.split(' ').length);
      setUserInput('');
      setCurrentSentence(sentences[Math.floor(Math.random() * sentences.length)]);
    }
  };

  const endGame = () => {
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const wpm = Math.round(wordsTyped / timeElapsed);
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
    const score = wpm * accuracy / 100 * 10;

    onComplete({
      gameId,
      score: Math.round(score),
      accuracy,
      timeSpent: 60 - timeLeft,
      xpEarned: Math.round(score / 2)
    });
  };

  const getCharacterColor = (index: number) => {
    if (index >= userInput.length) return 'text-gray-400';
    return userInput[index] === currentSentence[index] ? 'text-green-400' : 'text-red-400';
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Speed Typing</h3>
        <p className="mb-6">Type the sentences as fast and accurately as possible!</p>
        <button
          onClick={startGame}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start Typing
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="flex justify-between text-lg mb-4">
          <span>Time: {timeLeft}s</span>
          <span>Words: {wordsTyped}</span>
          <span>Accuracy: {totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100}%</span>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6 text-left">
        <div className="text-xl font-mono leading-relaxed">
          {currentSentence.split('').map((char, index) => (
            <span key={index} className={getCharacterColor(index)}>
              {char}
            </span>
          ))}
        </div>
      </div>

      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-xl font-mono focus:outline-none focus:border-blue-500"
        placeholder="Start typing here..."
        autoFocus
      />

      <div className="mt-4 text-sm text-gray-400">
        Current WPM: {Math.round(wordsTyped / ((60 - timeLeft) / 60) || 0)}
      </div>
    </div>
  );
};
