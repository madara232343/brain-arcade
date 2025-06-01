
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface EnhancedIQTestProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface Question {
  id: number;
  type: 'pattern' | 'logic' | 'math' | 'spatial';
  question: string;
  options: string[];
  correct: number;
  difficulty: number;
}

export const EnhancedIQTest: React.FC<EnhancedIQTestProps> = ({ 
  onComplete, 
  gameId,
  activePowerUps = new Set(),
  onPowerUpUsed
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      type: 'pattern',
      question: 'What comes next in the sequence: 2, 4, 8, 16, ?',
      options: ['24', '30', '32', '64'],
      correct: 2,
      difficulty: 1
    },
    {
      id: 2,
      type: 'logic',
      question: 'If all Bloops are Razzles and all Razzles are Lazzles, then all Bloops are definitely:',
      options: ['Lazzles', 'Not Lazzles', 'Razzles', 'Cannot be determined'],
      correct: 0,
      difficulty: 2
    },
    {
      id: 3,
      type: 'math',
      question: 'What is 15% of 240?',
      options: ['36', '42', '48', '54'],
      correct: 0,
      difficulty: 1
    },
    {
      id: 4,
      type: 'spatial',
      question: 'How many cubes are in a 3×3×3 cube structure?',
      options: ['9', '18', '27', '81'],
      correct: 2,
      difficulty: 2
    },
    {
      id: 5,
      type: 'pattern',
      question: 'Complete the pattern: A1, C3, E5, G7, ?',
      options: ['H8', 'I9', 'J10', 'K11'],
      correct: 1,
      difficulty: 3
    },
    {
      id: 6,
      type: 'logic',
      question: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
      options: ['5 minutes', '10 minutes', '100 minutes', '500 minutes'],
      correct: 0,
      difficulty: 3
    },
    {
      id: 7,
      type: 'math',
      question: 'What is the next prime number after 17?',
      options: ['18', '19', '21', '23'],
      correct: 1,
      difficulty: 2
    },
    {
      id: 8,
      type: 'spatial',
      question: 'A square is rotated 45 degrees. What shape does it appear to be?',
      options: ['Rectangle', 'Diamond', 'Circle', 'Triangle'],
      correct: 1,
      difficulty: 1
    }
  ];

  const startGame = () => {
    setGameStarted(true);
    
    // Apply time freeze power-up
    if (activePowerUps.has('timeFreeze')) {
      setTimeLeft(prev => prev + 60);
      onPowerUpUsed?.('timeFreeze');
    }
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    const question = questions[currentQuestion];
    if (answerIndex === question.correct) {
      const points = question.difficulty * 100;
      setScore(prev => prev + points);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowHint(false);
      setHintUsed(false);
    } else {
      endGame();
    }
  };

  const useHint = () => {
    if (activePowerUps.has('accuracyBoost') && !hintUsed) {
      setShowHint(true);
      setHintUsed(true);
      onPowerUpUsed?.('accuracyBoost');
    }
  };

  const endGame = () => {
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index]?.correct
    ).length;
    
    const accuracy = Math.round((correctAnswers / questions.length) * 100);
    const timeBonus = Math.max(0, timeLeft * 2);
    
    let finalScore = score + timeBonus;
    
    // Apply double XP power-up
    if (activePowerUps.has('doubleXP')) {
      finalScore *= 2;
      onPowerUpUsed?.('doubleXP');
    }
    
    onComplete({
      gameId,
      score: finalScore,
      accuracy,
      timeSpent: 300 - timeLeft,
      xpEarned: Math.round(finalScore / 3)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">🧠 Enhanced IQ Test</h3>
        <p className="mb-6 text-sm md:text-base">Comprehensive intelligence assessment with 8 challenging questions!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Pattern recognition questions</p>
            <p className="text-xs md:text-sm mb-2">• Logical reasoning problems</p>
            <p className="text-xs md:text-sm mb-2">• Mathematical calculations</p>
            <p className="text-xs md:text-sm">• Spatial awareness challenges</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Begin IQ Test
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="flex justify-between text-base md:text-lg mb-4">
          <span>Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          <span>Question: {currentQuestion + 1}/{questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-4 md:p-6 mb-6 max-w-2xl mx-auto">
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
            question.type === 'pattern' ? 'bg-blue-500' :
            question.type === 'logic' ? 'bg-green-500' :
            question.type === 'math' ? 'bg-purple-500' : 'bg-orange-500'
          }`}>
            {question.type.toUpperCase()}
          </span>
          <span className="ml-2 text-yellow-400">
            {'★'.repeat(question.difficulty)}
          </span>
        </div>
        
        <h4 className="text-lg md:text-xl font-bold mb-6">{question.question}</h4>
        
        {showHint && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-4">
            <p className="text-yellow-300 text-sm">
              💡 Hint: The correct answer is option {String.fromCharCode(65 + question.correct)}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 rounded-lg p-3 md:p-4 transition-all duration-200 hover:scale-105"
            >
              <span className="font-bold text-blue-400">{String.fromCharCode(65 + index)})</span>
              <span className="ml-2">{option}</span>
            </button>
          ))}
        </div>
        
        {activePowerUps.has('accuracyBoost') && !hintUsed && (
          <button
            onClick={useHint}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold transition-all duration-200"
          >
            💡 Use Hint
          </button>
        )}
      </div>
      
      <button
        onClick={endGame}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200"
      >
        End Test
      </button>
    </div>
  );
};
