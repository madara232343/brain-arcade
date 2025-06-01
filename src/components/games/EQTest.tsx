
import React, { useState, useEffect } from 'react';
import { Heart, Clock, Award, Target } from 'lucide-react';
import { GameResult } from '@/types/game';

interface EQTestProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
  activePowerUps?: Set<string>;
  onPowerUpUsed?: (type: string) => void;
}

interface EQQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  scenario: string;
}

const eqQuestions: EQQuestion[] = [
  {
    id: 1,
    scenario: "At Work",
    question: "Your colleague seems upset after a meeting. What's your first response?",
    options: [
      "Ignore it, it's not my business",
      "Ask if they're okay and if they want to talk",
      "Tell them to get over it",
      "Assume they're being dramatic"
    ],
    correct: 1
  },
  {
    id: 2,
    scenario: "Personal Conflict",
    question: "During an argument with a friend, you notice they're getting very emotional. You should:",
    options: [
      "Match their emotional intensity",
      "Walk away immediately",
      "Acknowledge their feelings and try to calm the situation",
      "Tell them they're overreacting"
    ],
    correct: 2
  },
  {
    id: 3,
    scenario: "Team Leadership",
    question: "Your team member made a mistake that affected the project. Your response:",
    options: [
      "Publicly criticize them in the next meeting",
      "Have a private conversation to understand what happened",
      "Report them to management immediately",
      "Fix it yourself without saying anything"
    ],
    correct: 1
  },
  {
    id: 4,
    scenario: "Social Situation",
    question: "At a party, you notice someone sitting alone looking uncomfortable. You:",
    options: [
      "Leave them alone - they probably want space",
      "Approach them and try to include them in conversation",
      "Point them out to others",
      "Assume they're antisocial"
    ],
    correct: 1
  },
  {
    id: 5,
    scenario: "Self-Awareness",
    question: "When you're feeling stressed, you typically:",
    options: [
      "Take it out on others around you",
      "Recognize the feeling and take steps to manage it",
      "Pretend everything is fine",
      "Blame external circumstances entirely"
    ],
    correct: 1
  },
  {
    id: 6,
    scenario: "Empathy Test",
    question: "Your friend is excited about something you find boring. You:",
    options: [
      "Tell them it's boring",
      "Change the subject quickly",
      "Show genuine interest in their excitement",
      "Listen politely but show no enthusiasm"
    ],
    correct: 2
  },
  {
    id: 7,
    scenario: "Conflict Resolution",
    question: "Two team members are in conflict. As a mediator, you:",
    options: [
      "Take sides with whoever you like more",
      "Tell them to solve it themselves",
      "Listen to both sides and help them find common ground",
      "Assign blame to end the conflict quickly"
    ],
    correct: 2
  },
  {
    id: 8,
    scenario: "Emotional Regulation",
    question: "You receive harsh criticism. Your immediate internal response is to:",
    options: [
      "Get defensive and angry",
      "Consider if there's truth in the feedback",
      "Dismiss it entirely",
      "Take it personally and feel worthless"
    ],
    correct: 1
  }
];

export const EQTest: React.FC<EQTestProps> = ({ 
  onComplete, 
  gameId, 
  activePowerUps = new Set(), 
  onPowerUpUsed 
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
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

  const calculateEQ = (correctAnswers: number, totalQuestions: number, timeUsed: number): number => {
    const baseScore = (correctAnswers / totalQuestions) * 100;
    const timeBonus = Math.max(0, (900 - timeUsed) / 900) * 20;
    const rawScore = baseScore + timeBonus;
    const eqMultiplier = activePowerUps.has('doubleXP') ? 1.2 : 1;
    return Math.min(150, Math.max(50, Math.round((rawScore + 50) * eqMultiplier)));
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
      const currentQ = eqQuestions[currentQuestion];
      // Show the scenario context as a hint
      setHintsUsed(prev => prev + 1);
      onPowerUpUsed?.('accuracyBoost');
      alert(`Hint: Think about the most emotionally intelligent response in the "${currentQ.scenario}" context.`);
    }
  };

  const nextQuestion = () => {
    const newAnswers = [...answers, selectedAnswer || -1];
    setAnswers(newAnswers);
    
    if (selectedAnswer === eqQuestions[currentQuestion].correct) {
      const questionScore = 15;
      const multiplier = activePowerUps.has('doubleXP') ? 2 : 1;
      setScore(prev => prev + (questionScore * multiplier));
    } else if (!shieldActive) {
      setScore(prev => Math.max(0, prev - 3));
    }
    
    if (shieldActive && selectedAnswer !== eqQuestions[currentQuestion].correct) {
      setShieldActive(false);
      onPowerUpUsed?.('shield');
    }
    
    if (currentQuestion < eqQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      endTest();
    }
  };

  const endTest = () => {
    const finalAnswers = [...answers, selectedAnswer || -1];
    const correctCount = finalAnswers.filter((answer, index) => answer === eqQuestions[index]?.correct).length;
    const timeUsed = 900 - timeLeft;
    const eqScore = calculateEQ(correctCount, eqQuestions.length, timeUsed);
    
    setShowResults(true);
    
    const xpMultiplier = activePowerUps.has('doubleXP') ? 2 : 1;
    onComplete({
      gameId,
      score: eqScore,
      accuracy: (correctCount / eqQuestions.length) * 100,
      timeSpent: timeUsed,
      xpEarned: Math.max(80, Math.floor((eqScore / 2) * xpMultiplier))
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEQLevel = (eq: number) => {
    if (eq >= 130) return { level: "Emotionally Gifted", color: "text-purple-400", emoji: "💖" };
    if (eq >= 120) return { level: "High EQ", color: "text-blue-400", emoji: "😊" };
    if (eq >= 110) return { level: "Above Average", color: "text-green-400", emoji: "👍" };
    if (eq >= 90) return { level: "Average", color: "text-yellow-400", emoji: "😐" };
    if (eq >= 80) return { level: "Developing", color: "text-orange-400", emoji: "🤔" };
    return { level: "Needs Growth", color: "text-red-400", emoji: "💪" };
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4 md:p-8 animate-fade-in">
        <div className="mb-6">
          <div className="text-4xl md:text-6xl mb-4 animate-pulse">💖</div>
          <h3 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Emotional Intelligence Test
          </h3>
          <p className="mb-6 text-base md:text-lg text-white/80">Assess your emotional intelligence and social skills!</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 mb-6 border border-white/20">
          <h4 className="text-lg md:text-xl font-bold mb-4 text-pink-300">Test Information:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-sm md:text-base">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 md:h-5 md:w-5 text-pink-400" />
              <span>8 Scenarios</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
              <span>15 Minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
              <span>Situational Questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
              <span>EQ Score 50-150</span>
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
          className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-400 hover:via-purple-400 hover:to-indigo-400 text-white px-6 md:px-10 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 hover:scale-110"
        >
          Start EQ Test 💖
        </button>
      </div>
    );
  }

  if (showResults) {
    const eqScore = calculateEQ(score / 15, eqQuestions.length, 900 - timeLeft);
    const eqLevel = getEQLevel(eqScore);
    
    return (
      <div className="text-center text-white p-4 md:p-8 animate-fade-in">
        <div className="mb-6">
          <div className="text-4xl md:text-6xl mb-4">{eqLevel.emoji}</div>
          <h3 className="text-2xl md:text-4xl font-bold mb-4">EQ Test Complete!</h3>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 mb-6 border border-white/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-pink-400 mb-2">{eqScore}</div>
              <div className="text-white/70 text-sm">EQ Score</div>
            </div>
            <div className="text-center">
              <div className={`text-lg md:text-2xl font-bold mb-2 ${eqLevel.color}`}>{eqLevel.level}</div>
              <div className="text-white/70 text-sm">Level</div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold text-green-400 mb-2">{score}</div>
              <div className="text-white/70 text-sm">Points</div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold text-blue-400 mb-2">{formatTime(900 - timeLeft)}</div>
              <div className="text-white/70 text-sm">Time</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = eqQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / eqQuestions.length) * 100;

  return (
    <div className="text-white p-2 md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg px-3 md:px-4 py-2">
            <div className="text-sm md:text-lg font-bold">⏰ {formatTime(timeLeft)}</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg px-3 md:px-4 py-2">
            <div className="text-sm md:text-lg font-bold">Q {currentQuestion + 1}/{eqQuestions.length}</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg px-3 md:px-4 py-2">
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
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-white/70 text-xs md:text-sm">{Math.round(progress)}% Complete</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 mb-6 border border-white/20">
        <div className="mb-4">
          <div className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500 inline-block mb-3">
            {question.scenario.toUpperCase()}
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
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 border-2 border-white'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-transparent'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 ${
                  selectedAnswer === index ? 'bg-white text-pink-500' : 'border-white/50'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-white text-sm md:text-base leading-relaxed">{option}</span>
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
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white hover:scale-105'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentQuestion === eqQuestions.length - 1 ? 'Finish Test' : 'Next Question'} →
        </button>
      </div>
    </div>
  );
};
