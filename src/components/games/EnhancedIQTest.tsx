
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface EnhancedIQTestProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface Question {
  id: number;
  type: 'logical' | 'mathematical' | 'spatial' | 'verbal';
  question: string;
  options: string[];
  correct: number;
  difficulty: number; // 1-5
}

export const EnhancedIQTest: React.FC<EnhancedIQTestProps> = ({ onComplete, gameId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [startTime] = useState(Date.now());
  const [showResult, setShowResult] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      type: 'logical',
      question: "If all roses are flowers and some flowers fade quickly, which statement is necessarily true?",
      options: [
        "All roses fade quickly",
        "Some roses might fade quickly", 
        "No roses fade quickly",
        "All flowers are roses"
      ],
      correct: 1,
      difficulty: 3
    },
    {
      id: 2,
      type: 'mathematical',
      question: "What is the next number in the sequence: 2, 6, 12, 20, 30, ?",
      options: ["40", "42", "44", "48"],
      correct: 1,
      difficulty: 4
    },
    {
      id: 3,
      type: 'spatial',
      question: "If you fold a piece of paper in half twice and cut a triangle, how many holes will there be when unfolded?",
      options: ["2", "4", "6", "8"],
      correct: 1,
      difficulty: 3
    },
    {
      id: 4,
      type: 'verbal',
      question: "METICULOUS is to CARELESS as GENEROUS is to:",
      options: ["Selfish", "Kind", "Wealthy", "Poor"],
      correct: 0,
      difficulty: 2
    },
    {
      id: 5,
      type: 'logical',
      question: "In a class of 30 students, 18 play football, 12 play basketball, and 8 play both. How many play neither?",
      options: ["6", "8", "10", "12"],
      correct: 1,
      difficulty: 4
    },
    {
      id: 6,
      type: 'mathematical',
      question: "If 3x + 7 = 22, what is the value of x + 3?",
      options: ["5", "6", "7", "8"],
      correct: 3,
      difficulty: 2
    },
    {
      id: 7,
      type: 'spatial',
      question: "Which shape comes next in the pattern: ○△□○△?",
      options: ["○", "△", "□", "◇"],
      correct: 2,
      difficulty: 1
    },
    {
      id: 8,
      type: 'verbal',
      question: "Which word does NOT belong with the others?",
      options: ["Apple", "Orange", "Banana", "Potato"],
      correct: 3,
      difficulty: 1
    },
    {
      id: 9,
      type: 'logical',
      question: "If today is Monday, what day will it be 100 days from now?",
      options: ["Monday", "Tuesday", "Wednesday", "Thursday"],
      correct: 1,
      difficulty: 3
    },
    {
      id: 10,
      type: 'mathematical',
      question: "A car travels 60 km in 45 minutes. What is its speed in km/h?",
      options: ["75", "80", "85", "90"],
      correct: 1,
      difficulty: 3
    }
  ];

  const calculateIQ = () => {
    let correctAnswers = 0;
    let totalDifficulty = 0;
    
    answers.forEach((answer, index) => {
      if (answer === questions[index].correct) {
        correctAnswers++;
        totalDifficulty += questions[index].difficulty;
      }
    });

    // Base IQ calculation
    const accuracyRate = correctAnswers / questions.length;
    const difficultyBonus = totalDifficulty / (correctAnswers || 1);
    const timeBonus = timeLeft > 900 ? 1.1 : timeLeft > 600 ? 1.05 : 1.0;
    
    // IQ score calculation (normalized to 70-150 range)
    let iq = 100 + (accuracyRate - 0.5) * 50 + (difficultyBonus - 2.5) * 10;
    iq *= timeBonus;
    iq = Math.max(70, Math.min(150, Math.round(iq)));
    
    return { iq, correctAnswers, accuracy: Math.round(accuracyRate * 100) };
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const completeTest = () => {
    const { iq, correctAnswers, accuracy } = calculateIQ();
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    onComplete({
      gameId,
      score: iq * 10, // Convert IQ to game score
      accuracy,
      timeSpent,
      xpEarned: correctAnswers * 50
    });
  };

  React.useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setShowResult(true);
    }
  }, [timeLeft, showResult]);

  if (showResult) {
    const { iq, correctAnswers, accuracy } = calculateIQ();
    
    return (
      <div className="text-center text-white p-6">
        <h3 className="text-3xl font-bold mb-6">IQ Test Complete!</h3>
        
        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <div className="text-6xl font-bold text-blue-400 mb-2">{iq}</div>
          <div className="text-xl text-white/80">Your IQ Score</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{correctAnswers}/10</div>
            <div className="text-sm text-white/70">Correct Answers</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">{accuracy}%</div>
            <div className="text-sm text-white/70">Accuracy</div>
          </div>
        </div>
        
        <div className="text-lg text-white/80 mb-6">
          {iq >= 130 ? "Exceptional intelligence! 🎯" :
           iq >= 115 ? "Above average intelligence! 🌟" :
           iq >= 100 ? "Average intelligence 👍" :
           iq >= 85 ? "Below average 📚" :
           "Keep practicing! 💪"}
        </div>
        
        <button
          onClick={completeTest}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg"
        >
          View Results
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-white p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="text-lg font-mono">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>
      
      <div className="mb-2 text-sm text-blue-400 capitalize">{question.type} • Difficulty: {'★'.repeat(question.difficulty)}</div>
      
      <h3 className="text-xl font-bold mb-6">{question.question}</h3>
      
      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className="text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-200 hover:scale-[1.02]"
          >
            <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
            {option}
          </button>
        ))}
      </div>
      
      <div className="mt-6 bg-white/5 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>
    </div>
  );
};
