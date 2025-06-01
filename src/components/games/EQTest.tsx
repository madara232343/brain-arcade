
import React, { useState, useEffect } from 'react';
import { GameResult } from '@/types/game';

interface EQTestProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface EQQuestion {
  id: number;
  scenario: string;
  question: string;
  options: string[];
  correct: number;
  emotional_skill: string;
}

export const EQTest: React.FC<EQTestProps> = ({ 
  onComplete, 
  gameId,
  activePowerUps = new Set(),
  onPowerUpUsed
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(240);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const questions: EQQuestion[] = [
    {
      id: 1,
      scenario: "Your colleague takes credit for your idea in a meeting.",
      question: "What's the most emotionally intelligent response?",
      options: [
        "Immediately call them out in front of everyone",
        "Speak to them privately after the meeting",
        "Let it slide to avoid conflict",
        "Complain to your boss"
      ],
      correct: 1,
      emotional_skill: "Self-Regulation"
    },
    {
      id: 2,
      scenario: "A team member seems upset but won't talk about it.",
      question: "How should you approach this situation?",
      options: [
        "Ignore it, it's their personal problem",
        "Force them to tell you what's wrong",
        "Give them space but let them know you're available",
        "Tell everyone else about their mood"
      ],
      correct: 2,
      emotional_skill: "Empathy"
    },
    {
      id: 3,
      scenario: "You receive harsh criticism from your manager.",
      question: "What's your best first response?",
      options: [
        "Defend yourself immediately",
        "Take a moment to process before responding",
        "Get angry and walk away",
        "Blame external factors"
      ],
      correct: 1,
      emotional_skill: "Self-Awareness"
    },
    {
      id: 4,
      scenario: "You notice a friend has been avoiding social gatherings.",
      question: "How do you show emotional intelligence?",
      options: [
        "Confront them about avoiding you",
        "Stop inviting them to things",
        "Reach out privately to check on them",
        "Tell mutual friends about your concerns"
      ],
      correct: 2,
      emotional_skill: "Social Skills"
    },
    {
      id: 5,
      scenario: "You're feeling overwhelmed with your workload.",
      question: "What's the most emotionally intelligent action?",
      options: [
        "Work through it without telling anyone",
        "Complain constantly to colleagues",
        "Communicate your concerns to your supervisor",
        "Take sick days to avoid the work"
      ],
      correct: 2,
      emotional_skill: "Self-Management"
    },
    {
      id: 6,
      scenario: "During a heated argument, you notice the other person getting very emotional.",
      question: "How should you respond?",
      options: [
        "Press your point more aggressively",
        "Suggest taking a break to cool down",
        "Tell them they're being too emotional",
        "Leave without saying anything"
      ],
      correct: 1,
      emotional_skill: "Relationship Management"
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
      setScore(prev => prev + 200);
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
    const timeBonus = Math.max(0, timeLeft * 3);
    
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
      timeSpent: 240 - timeLeft,
      xpEarned: Math.round(finalScore / 3)
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">💝 Emotional Intelligence Test</h3>
        <p className="mb-6 text-sm md:text-base">Assess your emotional intelligence across key scenarios!</p>
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm mb-2">• Self-awareness and regulation</p>
            <p className="text-xs md:text-sm mb-2">• Empathy and social skills</p>
            <p className="text-xs md:text-sm mb-2">• Relationship management</p>
            <p className="text-xs md:text-sm">• Emotional decision-making</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
        >
          Start EQ Test
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
            className="bg-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-4 md:p-6 mb-6 max-w-2xl mx-auto">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-pink-500">
            {question.emotional_skill}
          </span>
        </div>
        
        <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-bold text-blue-300 mb-2">Scenario:</h4>
          <p className="text-sm md:text-base">{question.scenario}</p>
        </div>
        
        <h4 className="text-lg md:text-xl font-bold mb-6">{question.question}</h4>
        
        {showHint && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-4">
            <p className="text-yellow-300 text-sm">
              💡 Hint: The emotionally intelligent choice is option {String.fromCharCode(65 + question.correct)}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 rounded-lg p-3 md:p-4 transition-all duration-200 hover:scale-105 text-left"
            >
              <span className="font-bold text-pink-400">{String.fromCharCode(65 + index)})</span>
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
