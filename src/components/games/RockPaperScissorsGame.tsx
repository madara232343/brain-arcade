
import React, { useState } from 'react';
import { GameResult } from '@/types/game';

interface RockPaperScissorsGameProps {
  onComplete: (result: GameResult) => void;
  gameId: string;
}

type Choice = 'rock' | 'paper' | 'scissors' | null;

export const RockPaperScissorsGame: React.FC<RockPaperScissorsGameProps> = ({ onComplete, gameId }) => {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [wins, setWins] = useState(0);
  const [result, setResult] = useState<string>('');

  const choices: Choice[] = ['rock', 'paper', 'scissors'];
  const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };

  const startGame = () => {
    setGameStarted(true);
  };

  const playRound = (choice: Choice) => {
    if (!choice) return;
    
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    setPlayerChoice(choice);
    setComputerChoice(computerChoice);
    
    const roundResult = determineWinner(choice, computerChoice);
    setResult(roundResult);
    
    if (roundResult === 'win') {
      setScore(score + 20);
      setWins(wins + 1);
    } else if (roundResult === 'tie') {
      setScore(score + 5);
    }
    
    if (round >= 5) {
      setTimeout(() => {
        const accuracy = Math.round((wins / round) * 100);
        onComplete({
          gameId,
          score: roundResult === 'win' ? score + 20 : roundResult === 'tie' ? score + 5 : score,
          accuracy,
          timeSpent: round * 5,
          xpEarned: Math.round((roundResult === 'win' ? score + 20 : roundResult === 'tie' ? score + 5 : score) / 4)
        });
      }, 2000);
    } else {
      setTimeout(() => {
        setRound(round + 1);
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult('');
      }, 2000);
    }
  };

  const determineWinner = (player: Choice, computer: Choice): string => {
    if (player === computer) return 'tie';
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'win';
    }
    return 'lose';
  };

  if (!gameStarted) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-2xl font-bold mb-4">Rock Paper Scissors</h3>
        <p className="mb-6">Play 5 rounds against the computer!</p>
        <button
          onClick={startGame}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-4">
      <div className="mb-6">
        <div className="flex justify-between text-lg mb-4">
          <span>Round: {round}/5</span>
          <span>Score: {score}</span>
          <span>Wins: {wins}</span>
        </div>
      </div>

      {!playerChoice ? (
        <div>
          <p className="text-xl mb-6">Choose your weapon:</p>
          <div className="flex justify-center space-x-4">
            {choices.map((choice) => (
              <button
                key={choice}
                onClick={() => playRound(choice)}
                className="bg-gray-700 hover:bg-gray-600 p-6 rounded-xl text-4xl transition-all duration-200 hover:scale-110"
              >
                {emojis[choice!]}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-center items-center space-x-8 mb-6">
            <div className="text-center">
              <p className="text-lg mb-2">You</p>
              <div className="text-6xl">{emojis[playerChoice]}</div>
            </div>
            <div className="text-4xl">VS</div>
            <div className="text-center">
              <p className="text-lg mb-2">Computer</p>
              <div className="text-6xl">{computerChoice ? emojis[computerChoice] : '❓'}</div>
            </div>
          </div>
          
          {result && (
            <div className="text-2xl font-bold mb-4">
              {result === 'win' && <span className="text-green-400">You Win! 🎉</span>}
              {result === 'lose' && <span className="text-red-400">You Lose! 😢</span>}
              {result === 'tie' && <span className="text-yellow-400">It's a Tie! 🤝</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
