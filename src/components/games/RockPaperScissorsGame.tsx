
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface RockPaperScissorsGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

type Choice = 'rock' | 'paper' | 'scissors';

export const RockPaperScissorsGame: React.FC<RockPaperScissorsGameProps> = ({ onComplete, gameId }) => {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [aiChoice, setAiChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [wins, setWins] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime] = useState(Date.now());

  const choices: { name: Choice; emoji: string; color: string }[] = [
    { name: 'rock', emoji: '🪨', color: 'bg-gray-500' },
    { name: 'paper', emoji: '📄', color: 'bg-blue-500' },
    { name: 'scissors', emoji: '✂️', color: 'bg-red-500' }
  ];

  const getWinner = (player: Choice, ai: Choice): string => {
    if (player === ai) return 'tie';
    if (
      (player === 'rock' && ai === 'scissors') ||
      (player === 'paper' && ai === 'rock') ||
      (player === 'scissors' && ai === 'paper')
    ) {
      return 'player';
    }
    return 'ai';
  };

  const makeChoice = (choice: Choice) => {
    if (isPlaying) return;

    setIsPlaying(true);
    setPlayerChoice(choice);
    
    // AI makes random choice
    const aiChoice = choices[Math.floor(Math.random() * choices.length)].name;
    
    setTimeout(() => {
      setAiChoice(aiChoice);
      const gameResult = getWinner(choice, aiChoice);
      setResult(gameResult);

      let points = 0;
      let newWins = wins;
      
      if (gameResult === 'player') {
        points = 100;
        newWins = wins + 1;
        setWins(newWins);
      } else if (gameResult === 'tie') {
        points = 50;
      }
      
      setScore(score + points);

      if (round >= 5) {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        const accuracy = Math.round((newWins / 5) * 100);
        
        setTimeout(() => {
          onComplete({
            gameId,
            score: score + points,
            accuracy,
            timeSpent,
            xpEarned: Math.round((score + points) / 4)
          });
        }, 2000);
      } else {
        setTimeout(() => {
          setRound(round + 1);
          setPlayerChoice(null);
          setAiChoice(null);
          setResult(null);
          setIsPlaying(false);
        }, 2000);
      }
    }, 1000);
  };

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Rock Paper Scissors</h3>
        <div className="flex justify-center space-x-6 text-sm">
          <span>Round: {round}/5</span>
          <span>Score: {score}</span>
          <span>Wins: {wins}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 max-w-md mx-auto mb-8">
        <div className="text-center">
          <h4 className="text-lg mb-4">You</h4>
          <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center text-4xl border-2 border-blue-400">
            {playerChoice ? choices.find(c => c.name === playerChoice)?.emoji : '❓'}
          </div>
        </div>
        
        <div className="text-center">
          <h4 className="text-lg mb-4">AI</h4>
          <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center text-4xl border-2 border-red-400">
            {aiChoice ? choices.find(c => c.name === aiChoice)?.emoji : '❓'}
          </div>
        </div>
      </div>

      {result && (
        <div className="mb-6 text-xl font-bold">
          {result === 'player' ? '🎉 You Win!' : 
           result === 'ai' ? '😅 AI Wins!' : 
           '🤝 It\'s a Tie!'}
        </div>
      )}

      {round <= 5 && !isPlaying && (
        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
          {choices.map((choice) => (
            <button
              key={choice.name}
              onClick={() => makeChoice(choice.name)}
              className={`${choice.color} hover:opacity-80 text-white p-4 rounded-xl font-bold transition-all duration-200 hover:scale-105 flex flex-col items-center space-y-2`}
              disabled={isPlaying}
            >
              <span className="text-3xl">{choice.emoji}</span>
              <span className="capitalize text-sm">{choice.name}</span>
            </button>
          ))}
        </div>
      )}

      {isPlaying && (
        <div className="text-lg text-yellow-400">
          {playerChoice && !aiChoice ? 'AI is choosing...' : 'Revealing choices...'}
        </div>
      )}
    </div>
  );
};
