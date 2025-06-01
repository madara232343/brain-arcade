
import React, { useState, useEffect } from 'react';
import { Brain, Clock, Award, Target } from 'lucide-react';
import { GameResult } from '@/types/game';

interface IQTestGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'pattern' | 'logic' | 'math' | 'spatial';
}

const questions: Question[] = [
  {
    id: 1,
    question: "What comes next in the sequence: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correct: 1,
    difficulty: 'easy',
    type: 'pattern'
  },
  {
    id: 2,
    question: "If all roses are flowers and some flowers are red, which statement is definitely true?",
    options: ["All roses are red", "Some roses are red", "Some roses might be red", "No roses are red"],
    correct: 2,
    difficulty: 'medium',
    type: 'logic'
  },
  {
    id: 3,
    question: "A train travels 60 km in 40 minutes. What is its speed in km/h?",
    options: ["80", "90", "100", "110"],
    correct: 1,
    difficulty: 'medium',
    type: 'math'
  },
  {
    id: 4,
    question: "Which shape completes the pattern? ○△○△○?",
    options: ["○", "△", "□", "◇"],
    correct: 1,
    difficulty: 'easy',
    type: 'pattern'
  },
  {
    id: 5,
    question: "If you rearrange 'SILENT', you get:",
    options: ["LISTEN", "STOLEN", "TENSIL", "NESLIT"],
    correct: 0,
    difficulty: 'medium',
    type: 'logic'
  },
  {
    id: 6,
    question: "What is 15% of 240?",
    options: ["32", "36", "38", "40"],
    correct: 1,
    difficulty: 'easy',
    type: 'math'
  },
  {
    id: 7,
    question: "In a family of 6, there are grandparents, parents, and children. If there are more children than adults, what is the minimum number of children?",
    options: ["2", "3", "4", "5"],
    correct: 2,
    difficulty: 'hard',
    type: 'logic'
  },
  {
    id: 8,
    question: "If MONDAY is 123456, what is DYNAMO?",
    options: ["456321", "654321", "563241", "453621"],
    correct: 2,
    difficulty: 'hard',
    type: 'pattern'
  },
  {
    id: 9,
    question: "A cube has how many edges?",
    options: ["6", "8", "10", "12"],
    correct: 3,
    difficulty: 'easy',
    type: 'spatial'
  },
  {
    id: 10,
    question: "If 3x + 7 = 22, what is x?",
    options: ["3", "4", "5", "6"],
    correct: 2,
    difficulty: 'medium',
    type: 'math'
  }
];

export const IQTestGame: React.FC<IQTestGameProps> = ({
  onComplete,
  gameId,
  activePowerUps = new Set(),
  onPowerUpUsed
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [shieldActive, setShieldActive] = useState(false);

  useEffect(() => {
    if (activePowerUps.has('shield')) {
      setShieldActive(true);
    }
    if (activePowerUps.has('timeFreeze')) {
      setTimeLeft(prev => prev + 300); // 5 extra minutes
    }
  }, [activePowerUps]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endTest();
    }
  }, [gameStarted, timeLeft, showResults]);

  const calculateIQ = (correctAnswers: number, totalQuestions: number, timeUsed: number): number => {
    const baseScore = (correctAnswers / totalQuestions) * 100;
    const timeBonus = Math.max(0, (1200 - timeUsed) / 1200) * 20;
    const difficultyBonus = answers.reduce((bonus, answer, index) => {
      if (answer === questions[index].correct) {
        switch (questions[index].difficulty) {
          case 'easy': return bonus + 5;
          case 'medium': return bonus + 10;
          case 'hard': return bonus + 15;
          default: return bonus;
        }
      }
      return bonus;
    }, 0);
    
    const rawScore = baseScore + timeBonus + difficultyBonus;
    const iqMultiplier = activePowerUps.has('doubleXP') ? 1.2 : 1;
    return Math.min(200, Math.max(70, Math.round((rawScore + 85) * iqMultiplier)));
  };

  const startTest = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResults(false);
    setHintsUsed(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const useHint = () => {
    if (activePowerUps.has('accuracyBoost') && hintsUsed < 2) {
      const currentQ = questions[currentQuestion];
      // Remove one wrong answer
      const wrongAnswers = currentQ.options.map((_, index) => index).filter(i => i !== currentQ.correct);
      const randomWrong = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
      
      setHintsUsed(prev => prev + 1);
      onPowerUpUsed?.('accuracyBoost');
      
      // Visual indication of hint (could be enhanced with UI changes)
      alert(`Hint: Option ${String.fromCharCode(65 + randomWrong)} is incorrect.`);
    }
  };

  const nextQuestion = () => {
    const newAnswers = [...answers, selectedAnswer || -1];
    setAnswers(newAnswers);
    
    if (selectedAnswer === questions[currentQuestion].correct) {
      const questionScore = questions[currentQuestion].difficulty === 'hard' ? 15 : 
                           questions[currentQuestion].difficulty === 'medium' ? 10 : 5;
      const multiplier = activePowerUps.has('doubleXP') ? 2 : 1;
      setScore(prev => prev + (questionScore * multiplier));
    } else if (!shieldActive) {
      // Penalty for wrong answer
      setScore(prev => Math.max(0, prev - 2));
    }
    
    if (shieldActive && selectedAnswer !== questions[currentQuestion].correct) {
      setShieldActive(false);
      onPowerUpUsed?.('shield');
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      endTest();
    }
  };

  const endTest = () => {
    const finalAnswers = [...answers, selectedAnswer || -1];
    const correctCount = finalAnswers.filter((answer, index) => answer === questions[index]?.correct).length;
    const timeUsed = 1200 - timeLeft;
    const iqScore = calculateIQ(correctCount, questions.length, timeUsed);
    
    setShowResults(true);
    
    const xpMultiplier = activePowerUps.has('doubleXP') ? 2 : 1;
    onComplete({
      gameId,
      score: iqScore,
      accuracy: (correctCount / questions.length) * 100,
      timeSpent: timeUsed,
      xpEarned: Math.max(100, Math.floor((iqScore / 2) * xpMultiplier))
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getIQLevel = (iq: number) => {
    if (iq >= 140) return { level: "Genius", color: "text-purple-400", emoji: "🧠" };
    if (iq >= 130) return { level: "Gifted", color: "text-blue-400", emoji: "🌟" };
    if (iq >= 120) return { level: "Superior", color: "text-green-400", emoji: "⭐" };
    if (iq >= 110) return { level: "Above Average", color: "text-yellow-400", emoji: "👍" };
    if (iq >= 90) return { level: "Average", color: "text-orange-400", emoji: "👌" };
    return { level: "Below Average", color: "text-red-400", emoji: "💪" };
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4 md:p-8 animate-fade-in">
        <div className="mb-6">
          <div className="text-4xl md:text-6xl mb-4 animate-pulse">🧠</div>
          <h3 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            IQ Test Challenge
          </h3>
          <p className="mb-6 text-base md:text-lg text-white/80">Test your intelligence with 10 challenging questions!</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 mb-6 border border-white/20">
          <h4 className="text-lg md:text-xl font-bold mb-4 text-yellow-300">Test Information:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-sm md:text-base">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
              <span>10 Questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
              <span>20 Minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
              <span>Multiple Choice</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
              <span>IQ Score 70-200</span>
            </div>
          </div>
        </div>

        {activePowerUps.size > 0 && (
          <div className="mb-4 bg-yellow-500/20 rounded-lg p-3">
            <p className="text-sm text-yellow-300 mb-2">Active Power-ups:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from(activePowerUps).map(powerUp => (
                <span key={powerUp} className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">
                  {powerUp}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={startTest}
          className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 hover:from-purple-400 hover:via-blue-400 hover:to-green-400 text-white px-6 md:px-10 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        >
          Start IQ Test 🚀
        </button>
      </div>
    );
  }

  if (showResults) {
    const iqScore = calculateIQ(score, questions.length, 1200 - timeLeft);
    const iqLevel = getIQLevel(iqScore);
    
    return (
      <div className="text-center text-white p-4 md:p-8 animate-fade-in">
        <div className="mb-6">
          <div className="text-4xl md:text-6xl mb-4">{iqLevel.emoji}</div>
          <h3 className="text-2xl md:text-4xl font-bold mb-4">Test Complete!</h3>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 mb-6 border border-white/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-purple-400 mb-2">{iqScore}</div>
              <div className="text-white/70 text-sm">IQ Score</div>
            </div>
            <div className="text-center">
              <div className={`text-lg md:text-2xl font-bold mb-2 ${iqLevel.color}`}>{iqLevel.level}</div>
              <div className="text-white/70 text-sm">Level</div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold text-green-400 mb-2">{score}/{questions.length * 15}</div>
              <div className="text-white/70 text-sm">Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold text-blue-400 mb-2">{formatTime(1200 - timeLeft)}</div>
              <div className="text-white/70 text-sm">Time</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="text-white p-2 md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg px-3 md:px-4 py-2">
            <div className="text-sm md:text-lg font-bold">⏰ {formatTime(timeLeft)}</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg px-3 md:px-4 py-2">
            <div className="text-sm md:text-lg font-bold">Q {currentQuestion + 1}/{questions.length}</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg px-3 md:px-4 py-2">
            <div className="text-sm md:text-lg font-bold">Score: {score}</div>
          </div>
        </div>
      </div>

      {/* Power-up buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {activePowerUps.has('accuracyBoost') && hintsUsed < 2 && (
          <button
            onClick={useHint}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm"
          >
            💡 Hint ({2 - hintsUsed} left)
          </button>
        )}
        {shieldActive && (
          <div className="bg-purple-500 text-white px-3 py-2 rounded text-sm">
            🛡️ Shield Active
          </div>
        )}
      </div>

      <div className="bg-white/10 rounded-xl p-3 mb-4">
        <div className="w-full bg-white/20 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-white/70 text-xs md:text-sm">{Math.round(progress)}% Complete</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 mb-6 border border-white/20">
        <div className="flex flex-wrap items-center mb-4 gap-2">
          <div className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${
            question.difficulty === 'easy' ? 'bg-green-500' :
            question.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
          }`}>
            {question.difficulty.toUpperCase()}
          </div>
          <div className="px-2 md:px-3 py-1 rounded-full text-xs font-bold bg-blue-500">
            {question.type.toUpperCase()}
          </div>
        </div>
        
        <h4 className="text-lg md:text-xl font-bold mb-6 text-white">{question.question}</h4>
        
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`p-3 md:p-4 rounded-xl text-left transition-all duration-300 hover:scale-105 ${
                selectedAnswer === index
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 border-2 border-white'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                  selectedAnswer === index ? 'bg-white text-purple-500' : 'border-white/50'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-white text-sm md:text-base">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={nextQuestion}
          disabled={selectedAnswer === null}
          className={`px-6 md:px-8 py-3 rounded-xl font-bold transition-all duration-300 text-sm md:text-base ${
            selectedAnswer !== null
              ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white hover:scale-105'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentQuestion === questions.length - 1 ? 'Finish Test' : 'Next Question'} →
        </button>
      </div>
    </div>
  );
};
