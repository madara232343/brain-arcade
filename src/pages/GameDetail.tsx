
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Brain, Star, Trophy, Clock, User, Share2, BookmarkPlus } from 'lucide-react';
import { useSounds } from '@/components/SoundManager';
import { useTheme } from '@/components/ThemeManager';
import { gameData } from '@/data/gameData';
import { GameModal } from '@/components/GameModal';
import { GameResult } from '@/types/game';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Helmet } from 'react-helmet';

export interface UserProgress {
  totalScore: number;
  totalXP: number;
  level: number;
  gamesPlayed: string[];
  achievements: string[];
  rank: string;
  streak: number;
  purchasedItems: string[];
  activeTheme: string;
  activePowerUps: string[];
  xp: number;
  lastPlayDate: string;
  playedGames: string[];
  ownedItems: string[];
  totalPlayTime: number;
  theme: string;
  avatar: string;
}

const GameDetail = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const game = gameData.find(g => g.id === gameId);
  const [showGameModal, setShowGameModal] = useState(false);
  const [activePowerUps, setActivePowerUps] = useState<Set<string>>(new Set());
  const { playSound } = useSounds();
  const { currentTheme } = useTheme();

  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('brainArcadeProgress', {
    totalScore: 0,
    totalXP: 0,
    level: 1,
    gamesPlayed: [],
    achievements: [],
    rank: 'Bronze',
    streak: 0,
    purchasedItems: [],
    activeTheme: 'default',
    activePowerUps: [],
    xp: 0,
    lastPlayDate: '',
    playedGames: [],
    ownedItems: [],
    totalPlayTime: 0,
    theme: 'default',
    avatar: 'default'
  });

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-pink-800 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Game Not Found</h1>
          <p className="mb-6">Sorry, we couldn't find the game you're looking for.</p>
          <Link 
            to="/games" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Games
          </Link>
        </div>
      </div>
    );
  }

  const relatedGames = gameData
    .filter(g => g.id !== game.id && g.category === game.category)
    .slice(0, 3);

  const isGamePlayed = Array.isArray(userProgress.playedGames) && 
    userProgress.playedGames.includes(game.id);

  const calculateRank = (totalScore: number) => {
    if (totalScore >= 500000) return 'Legendary';
    if (totalScore >= 250000) return 'Master';
    if (totalScore >= 100000) return 'Diamond';
    if (totalScore >= 50000) return 'Platinum';
    if (totalScore >= 25000) return 'Gold';
    if (totalScore >= 10000) return 'Silver';
    if (totalScore >= 5000) return 'Bronze';
    return 'Bronze';
  };

  const handleGameComplete = (result: GameResult) => {
    const today = new Date().toDateString();
    const isNewDay = userProgress.lastPlayDate !== today;
    
    let xpMultiplier = 1;
    if (activePowerUps.has('doubleXP')) {
      xpMultiplier = 2;
    }
    
    const finalXP = result.xpEarned * xpMultiplier;
    const newXP = userProgress.totalXP + finalXP;
    const newLevel = Math.floor(newXP / 100) + 1;
    const newTotalScore = userProgress.totalScore + result.score;
    const newRank = calculateRank(newTotalScore);
    
    const updatedPlayedGames = Array.isArray(userProgress.playedGames) 
      ? [...userProgress.playedGames] 
      : [];
    
    if (!updatedPlayedGames.includes(result.gameId)) {
      updatedPlayedGames.push(result.gameId);
    }

    const updatedGamesPlayed = Array.isArray(userProgress.gamesPlayed) 
      ? [...userProgress.gamesPlayed] 
      : [];
    
    if (!updatedGamesPlayed.includes(result.gameId)) {
      updatedGamesPlayed.push(result.gameId);
    }
    
    const newProgress = {
      ...userProgress,
      totalXP: newXP,
      xp: newXP,
      level: newLevel,
      streak: isNewDay ? userProgress.streak + 1 : userProgress.streak,
      lastPlayDate: today,
      gamesPlayed: updatedGamesPlayed,
      totalScore: newTotalScore,
      playedGames: updatedPlayedGames,
      totalPlayTime: userProgress.totalPlayTime + result.timeSpent,
      rank: newRank
    };
    
    setUserProgress(newProgress);
    playSound('success');
    setShowGameModal(false);
  };

  const handlePlayGame = () => {
    playSound('click');
    setShowGameModal(true);
  };

  const handlePowerUpUsed = (type: string) => {
    setActivePowerUps(prev => new Set([...prev, type]));
    playSound('powerup');
  };

  return (
    <>
      <Helmet>
        <title>{`${game.title} - Brain Burst Arcade | Free Online Brain Training Game`}</title>
        <meta name="description" content={`Play ${game.title} - ${game.description}. Improve your cognitive abilities with this free brain training game. Boost your memory, focus, and mental agility.`} />
        <meta name="keywords" content={`${game.title}, brain games, brain training, cognitive skills, mental exercise, memory improvement, focus training, ${game.category} games, free online games, brain fitness, mental agility, IQ improvement, concentration games, mind games, brain health, cognitive enhancement, brain burst arcade`} />
        <meta property="og:title" content={`${game.title} - Free Brain Training Game | Brain Burst Arcade`} />
        <meta property="og:description" content={`Play ${game.title} - ${game.description}. A free brain training game to improve your cognitive abilities.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://brainburstarcade.com/games/${game.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${game.title} - Brain Burst Arcade`} />
        <meta name="twitter:description" content={`Play ${game.title} - ${game.description}. A free brain training game to improve your cognitive abilities.`} />
      </Helmet>

      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} relative`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 md:w-96 h-32 md:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-24 md:w-80 h-24 md:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-16 md:w-64 h-16 md:h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-6xl relative z-10">
          <div className="mb-6">
            <Link to="/games" className="inline-flex items-center text-white hover:text-blue-300 transition-colors mb-4">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Games
            </Link>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-8 border border-white/20 mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                <div className="p-3 md:p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex-shrink-0">
                  <game.icon className="h-8 w-8 md:h-12 md:w-12 text-white" />
                </div>
                <div className="flex-grow">
                  <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">{game.title}</h1>
                  <div className="flex items-center mb-1 md:mb-2">
                    <div className="flex space-x-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-white/70 ml-2 text-sm">5.0</span>
                    <span className="mx-2 text-white/40">•</span>
                    <span className="text-white/70 text-sm">{game.category} Game</span>
                  </div>
                  <p className="text-white/80 text-sm md:text-base mb-3">{game.description}</p>
                  <div className="flex flex-wrap gap-2 md:gap-4">
                    <span className="text-xs md:text-sm bg-white/20 text-white px-2 py-1 rounded-full flex items-center">
                      <Trophy className="h-3 w-3 md:h-4 md:w-4 mr-1" /> 15k+ plays
                    </span>
                    <span className="text-xs md:text-sm bg-white/20 text-white px-2 py-1 rounded-full flex items-center">
                      <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1" /> 2-5 min
                    </span>
                    <span className="text-xs md:text-sm bg-white/20 text-white px-2 py-1 rounded-full flex items-center">
                      <User className="h-3 w-3 md:h-4 md:w-4 mr-1" /> All ages
                    </span>
                  </div>
                </div>
                <div className="w-full md:w-auto">
                  <button
                    onClick={handlePlayGame}
                    className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105"
                  >
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">About This Game</h2>
                <div className="prose prose-invert max-w-none">
                  {game.id === 'memory-sequence' && (
                    <>
                      <p>Memory Sequence is a scientifically-designed cognitive training game that enhances your working memory capacity through engaging sequence memorization challenges. Based on principles used in neuroscientific research, this game gradually increases in difficulty to continually challenge your brain.</p>
                      
                      <p>Working memory is crucial for everyday tasks like remembering instructions, solving problems, and learning new information. Regular training with Memory Sequence has been shown to improve working memory capacity, which may transfer to benefits in academic performance, professional productivity, and general cognitive function.</p>
                      
                      <h3 className="text-lg font-medium mt-4 mb-2">How It Works</h3>
                      <p>In each round, you'll be presented with a sequence of highlighted tiles that you must memorize and repeat back in the exact same order. As you progress, sequences become longer and more complex, requiring greater mental effort and concentration.</p>
                      
                      <h3 className="text-lg font-medium mt-4 mb-2">Benefits</h3>
                      <ul className="list-disc ml-5 space-y-1">
                        <li>Enhances working memory capacity</li>
                        <li>Improves attention and focus</li>
                        <li>Strengthens pattern recognition abilities</li>
                        <li>Develops sequential processing skills</li>
                        <li>Builds mental resilience and cognitive stamina</li>
                      </ul>
                      
                      <h3 className="text-lg font-medium mt-4 mb-2">Who It's For</h3>
                      <p>Memory Sequence is perfect for students looking to improve academic performance, professionals wanting to enhance productivity, seniors maintaining cognitive health, and anyone interested in strengthening their mental capabilities through evidence-based brain training.</p>
                      
                      <p>For best results, we recommend playing Memory Sequence for 10-15 minutes at least 3 times per week as part of a comprehensive brain training regimen.</p>
                    </>
                  )}
                  
                  {game.id !== 'memory-sequence' && (
                    <>
                      <p>The {game.title} game is designed to enhance your cognitive abilities through engaging and challenging gameplay. Based on principles of neuroscience and cognitive psychology, this game targets specific mental functions to help strengthen your brain.</p>
                      
                      <p>Regular gameplay can help improve your attention, memory, processing speed, and problem-solving abilities. The adaptive difficulty ensures you're always challenged at the right level for optimal cognitive training.</p>
                      
                      <h3 className="text-lg font-medium mt-4 mb-2">How It Works</h3>
                      <p>Each session presents you with increasingly challenging tasks that require focus, quick thinking, and mental agility. The game adapts to your performance, ensuring you're always working at your optimal challenge level.</p>
                      
                      <h3 className="text-lg font-medium mt-4 mb-2">Benefits</h3>
                      <ul className="list-disc ml-5 space-y-1">
                        <li>Enhances cognitive processing speed</li>
                        <li>Improves working memory capacity</li>
                        <li>Strengthens attention and focus</li>
                        <li>Develops problem-solving abilities</li>
                        <li>Supports overall brain health</li>
                      </ul>
                      
                      <h3 className="text-lg font-medium mt-4 mb-2">Who It's For</h3>
                      <p>{game.title} is perfect for students looking to improve academic performance, professionals wanting to enhance productivity, seniors maintaining cognitive health, and anyone interested in strengthening their mental capabilities through evidence-based brain training.</p>
                      
                      <p>For best results, we recommend playing for 10-15 minutes at least 3 times per week as part of a comprehensive brain training regimen.</p>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">How to Play</h2>
                <ol className="list-decimal ml-5 space-y-2 text-white/90">
                  <li>Click the "Play Now" button to start the game.</li>
                  <li>Pay close attention to the instructions provided at the beginning of the game.</li>
                  <li>Complete the challenges to earn points and improve your cognitive abilities.</li>
                  <li>Your score will be saved and will contribute to your overall progress on Brain Burst Arcade.</li>
                  <li>Challenge yourself to beat your previous high score with each play session.</li>
                </ol>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">The Science</h2>
                <p className="text-white/90 mb-4">
                  {game.title} is based on established principles from cognitive psychology and neuroscience research. Studies have shown that targeted cognitive training can help improve specific mental functions and may transfer to real-world tasks.
                </p>
                <p className="text-white/90">
                  Our games are designed in collaboration with cognitive scientists to ensure they effectively target key cognitive domains while remaining engaging and enjoyable to play. The adaptive difficulty system ensures you're always training at your optimal challenge point - not too easy to be boring, not too hard to be frustrating.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4">Share</h2>
                <div className="flex gap-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors">
                    <BookmarkPlus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4">Similar Games</h2>
                <div className="space-y-4">
                  {relatedGames.map(relatedGame => (
                    <Link 
                      key={relatedGame.id}
                      to={`/game/${relatedGame.id}`}
                      className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                        <relatedGame.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{relatedGame.title}</h3>
                        <p className="text-xs text-white/60">{relatedGame.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4">Support</h2>
                <p className="text-white/90 mb-3">
                  Having issues with {game.title}? Our support team is here to help!
                </p>
                <a 
                  href="mailto:brain.burst0777@gmail.com" 
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  brain.burst0777@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {showGameModal && (
          <GameModal
            game={game}
            onComplete={handleGameComplete}
            onClose={() => {
              playSound('click');
              setShowGameModal(false);
            }}
            activePowerUps={activePowerUps}
            onPowerUpUsed={handlePowerUpUsed}
          />
        )}
      </div>
    </>
  );
};

export default GameDetail;
