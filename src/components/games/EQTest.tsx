
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface EQTestProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

interface EQQuestion {
  id: number;
  scenario: string;
  question: string;
  options: string[];
  scores: number[]; // EQ scores for each option
}

export const EQTest: React.FC<EQTestProps> = ({ onComplete, gameId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());

  const questions: EQQuestion[] = [
    {
      id: 1,
      scenario: "Your colleague takes credit for your idea in a meeting.",
      question: "How would you handle this situation?",
      options: [
        "Confront them immediately in front of everyone",
        "Speak to them privately after the meeting",
        "Report them to your manager",
        "Let it go and move on"
      ],
      scores: [2, 9, 6, 4]
    },
    {
      id: 2,
      scenario: "You notice a friend seems upset but they say they're fine.",
      question: "What's your next step?",
      options: [
        "Accept their answer and drop it",
        "Keep asking until they tell you",
        "Give them space but let them know you're available",
        "Tell them they're obviously lying"
      ],
      scores: [5, 4, 9, 1]
    },
    {
      id: 3,
      scenario: "You're feeling overwhelmed with work deadlines.",
      question: "How do you manage your stress?",
      options: [
        "Work through the night to finish everything",
        "Prioritize tasks and ask for help if needed",
        "Complain to colleagues about the workload",
        "Take a break to clear your head first"
      ],
      scores: [3, 9, 2, 7]
    },
    {
      id: 4,
      scenario: "Someone gives you harsh but constructive criticism.",
      question: "Your immediate reaction is to:",
      options: [
        "Defend yourself and your actions",
        "Thank them and ask for specific examples",
        "Feel hurt but try not to show it",
        "Dismiss their opinion as irrelevant"
      ],
      scores: [4, 9, 6, 1]
    },
    {
      id: 5,
      scenario: "You're in a group project and one member isn't contributing.",
      question: "How do you address this?",
      options: [
        "Do their work yourself to avoid conflict",
        "Have a team discussion about expectations",
        "Complain about them to other team members",
        "Confront them aggressively about their laziness"
      ],
      scores: [4, 9, 2, 3]
    },
    {
      id: 6,
      scenario: "You make a mistake that affects your team's project.",
      question: "Your response is to:",
      options: [
        "Try to hide it and fix it quietly",
        "Immediately inform the team and apologize",
        "Blame external circumstances",
        "Wait to see if anyone notices"
      ],
      scores: [3, 9, 1, 2]
    },
    {
      id: 7,
      scenario: "A family member is going through a difficult time.",
      question: "How do you support them?",
      options: [
        "Give them advice on how to fix their problems",
        "Listen actively and offer emotional support",
        "Distract them with fun activities",
        "Tell them to be more positive"
      ],
      scores: [5, 9, 6, 3]
    },
    {
      id: 8,
      scenario: "You're in a heated argument with someone you care about.",
      question: "What's your approach?",
      options: [
        "Take a break to cool down before continuing",
        "Try to win the argument at all costs",
        "Apologize even if you don't think you're wrong",
        "Walk away and never bring it up again"
      ],
      scores: [9, 2, 5, 4]
    }
  ];

  const calculateEQ = () => {
    const totalScore = answers.reduce((sum, answerIndex, questionIndex) => {
      return sum + questions[questionIndex].scores[answerIndex];
    }, 0);

    const maxPossibleScore = questions.length * 9;
    const eqPercentage = (totalScore / maxPossibleScore) * 100;
    
    // Convert to EQ score (typically 0-200 scale)
    const eq = Math.round(eqPercentage * 2);
    
    return { eq, totalScore, maxPossibleScore, percentage: Math.round(eqPercentage) };
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
    const { eq, percentage } = calculateEQ();
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    onComplete({
      gameId,
      score: eq * 5,
      accuracy: percentage,
      timeSpent,
      xpEarned: Math.round(eq * 2)
    });
  };

  if (showResult) {
    const { eq, percentage } = calculateEQ();
    
    return (
      <div className="text-center text-white p-6">
        <h3 className="text-3xl font-bold mb-6">EQ Test Complete!</h3>
        
        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <div className="text-6xl font-bold text-green-400 mb-2">{eq}</div>
          <div className="text-xl text-white/80">Your EQ Score</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <div className="text-2xl font-bold text-purple-400">{percentage}%</div>
          <div className="text-sm text-white/70">Emotional Intelligence</div>
        </div>
        
        <div className="text-lg text-white/80 mb-6">
          {eq >= 160 ? "Exceptional emotional intelligence! 🌟" :
           eq >= 130 ? "High emotional intelligence! 👏" :
           eq >= 100 ? "Good emotional awareness 👍" :
           eq >= 70 ? "Developing emotional skills 📚" :
           "Focus on emotional growth 💪"}
        </div>
        
        <button
          onClick={completeTest}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg"
        >
          View Results
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="text-white p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="text-sm text-green-400">Emotional Intelligence Test</div>
      </div>
      
      <div className="bg-white/5 rounded-xl p-6 mb-6">
        <h4 className="text-lg font-bold mb-3 text-green-400">Scenario:</h4>
        <p className="text-white/90 mb-4">{question.scenario}</p>
        <h4 className="text-lg font-bold text-white">{question.question}</h4>
      </div>
      
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
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>
    </div>
  );
};
