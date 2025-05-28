
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/pages/Index';

interface NumberSequenceGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Sequence {
  numbers: number[];
  pattern: string;
  nextNumber: number;
  rule: string;
}

export const NumberSequenceGame: React.FC<NumberSequenceGameProps> = ({ onComplete, gameId }) => {
  const [currentSequence, setCurrentSequence] = useState<Sequence | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [difficulty, setDifficulty] = useState(1);

  const generateSequence = (): Sequence => {
    const patterns = [
      // Arithmetic progressions
      () => {
        const start = Math.floor(Math.random() * 20) + 1;
        const diff = Math.floor(Math.random() * 5) + 1;
        const numbers = [start, start + diff, start + diff * 2, start + diff * 3, start + diff * 4];
        return {
          numbers: numbers.slice(0, 4),
          pattern: `+${diff}`,
          nextNumber: numbers[4],
          rule: `Add ${diff} each time`
        };
      },
      // Geometric progressions
      () => {
        const start = Math.floor(Math.random() * 5) + 2;
        const ratio = 2;
        const numbers = [start, start * ratio, start * ratio * ratio, start * ratio * ratio * ratio, start * ratio * ratio * ratio * ratio];
        return {
          numbers: numbers.slice(0, 4),
          pattern: `×${ratio}`,
          nextNumber: numbers[4],
          rule: `Multiply by ${ratio} each time`
        };
      },
      // Fibonacci-like
      () => {
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 3) + 1;
        const numbers = [a, b, a + b, a + 2 * b, 2 * a + 3 * b];
        return {
          numbers: numbers.slice(0, 4),
          pattern: 'Fibonacci',
          nextNumber: numbers[4],
          rule: 'Each number is the sum of the previous two'
        };
      },
      // Square sequence
      () => {
        const start = Math.floor(Math.random() * 3) + 1;
        const numbers = [start * start, (start + 1) * (start + 1), (start + 2) * (start + 2), (start + 3) * (start + 3), (start + 4) * (start + 4)];
        return {
          numbers: numbers.slice(0, 4),
          pattern: 'Squares',
          nextNumber: numbers[4],
          rule: 'Perfect squares sequence'
        };
      }
    ];

    const selectedPattern = patterns[Math.floor(Math.random() * Math.min(patterns.length, difficulty + 1))];
    return selectedPattern();
  };

  const generateOptions = (correctAnswer: number) => {
    const options = [correctAnswer];
    
    // Generate plausible wrong answers
    for (let i = 0; i < 3; i++) {
      let wrongAnswer;
      do {
        wrongAnswer = correctAnswer + (Math.floor(Math.random() * 20) - 10);
      } while (options.includes(wrongAnswer) || wrongAnswer <= 0);
      options.push(wrongAnswer);
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  const generateQuestion = () => {
    const sequence = generateSequence();
    const options = generateOptions(sequence.nextNumber);
    
    setCurrentSequence(sequence);
    setOptions(options);
    setUserAnswer('');
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

  const handleAnswer = (selectedNumber: number) => {
    const isCorrect = selectedNumber === currentSequence?.nextNumber;
    
    setTotalQuestions(prev => prev + 1);

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + (20 + difficulty * 10));
      
      // Increase difficulty every 3 correct answers
      if ((correctAnswers + 1) % 3 === 0) {
        setDifficulty(prev => Math.min(prev + 1, 3));
      }
    }

    setTimeout(() => {
      generateQuestion();
    }, 2000);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numberAnswer = parseInt(userAnswer);
    if (!isNaN(numberAnswer)) {
      handleAnswer(numberAnswer);
    }
  };

  const endGame = () => {
    setGameOver(true);
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const xpEarned = Math.round(score / 3);

    onComplete({
      gameId,
      score,
      accuracy,
      timeSpent: 120,
      xpEarned
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white">
        <h3 className="text-2xl font-bold mb-4">🔢 Number Sequence</h3>
        <p className="mb-6 text-lg">Find the pattern in number sequences!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-4">
            <p className="text-sm mb-2">• Look at the sequence of numbers</p>
            <p className="text-sm mb-2">• Find the mathematical pattern</p>
            <p className="text-sm mb-2">• Choose or type the next number</p>
            <p className="text-sm">• Difficulty increases as you progress</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center text-white">
        <h3 className="text-2xl font-bold mb-4">🧮 Pattern Master!</h3>
        <div className="space-y-3 text-lg">
          <p>Difficulty Reached: <span className="text-orange-400 font-bold">{difficulty}</span></p>
          <p>Final Score: <span className="text-yellow-400 font-bold">{score}</span> points</p>
          <p>Correct Answers: <span className="text-green-400 font-bold">{correctAnswers}/{totalQuestions}</span></p>
          <p>Accuracy: <span className="text-blue-400 font-bold">{totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-white">
      <div className="flex justify-between mb-6 text-lg">
        <div>Time: <span className="font-bold text-red-400">{timeLeft}s</span></div>
        <div>Level: <span className="font-bold text-orange-400">{difficulty}</span></div>
        <div>Score: <span className="font-bold text-yellow-400">{score}</span></div>
      </div>

      {currentSequence && (
        <div className="mb-8">
          <p className="text-lg mb-4">What's the next number in the sequence?</p>
          
          <div className="flex justify-center items-center space-x-4 mb-6 text-4xl font-bold">
            {currentSequence.numbers.map((num, index) => (
              <React.Fragment key={index}>
                <span className="bg-white/20 rounded-xl px-4 py-2">{num}</span>
                {index < currentSequence.numbers.length - 1 && (
                  <span className="text-white/50">→</span>
                )}
              </React.Fragment>
            ))}
            <span className="text-white/50">→</span>
            <span className="bg-yellow-400/20 border-2 border-yellow-400 border-dashed rounded-xl px-4 py-2 text-yellow-400">?</span>
          </div>

          <div className="mb-6">
            <p className="text-sm text-white/70 mb-4">Pattern: {currentSequence.rule}</p>
            
            {/* Multiple choice options */}
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-4">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="bg-white/10 hover:bg-white/20 border border-white/30 hover:border-blue-400 rounded-xl p-3 text-lg font-bold transition-all duration-200 hover:scale-105"
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Alternative: Type your answer */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <p className="text-sm text-white/70 mb-2">Or type your answer:</p>
              <form onSubmit={handleInputSubmit} className="flex justify-center">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="px-4 py-2 bg-white/20 rounded-l-lg border border-white/30 text-white text-center"
                  placeholder="?"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg font-bold transition-colors"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-white/70">
        Question {totalQuestions + 1} • {correctAnswers} correct
      </div>
    </div>
  );
};
