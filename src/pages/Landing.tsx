
import React, { useState } from 'react';
import { Brain, Zap, Trophy, Target, Users, Star, Play, BarChart3, MessageSquare, ChevronRight, Award, GamepadIcon, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReviewModal } from '@/components/ReviewModal';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { gameData } from '@/data/gameData';
import { Helmet } from 'react-helmet-async';

const Landing = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useLocalStorage<any[]>('gameReviews', []);

  const features = [
    {
      icon: Brain,
      title: "Memory Training",
      description: "Enhance your working memory with sequence and pattern games based on the dual n-back paradigm",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Speed Challenges", 
      description: "Improve reaction time and processing speed with fast-paced games that enhance cognitive agility",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Target,
      title: "Focus & Attention",
      description: "Sharpen your concentration with visual attention tasks and sustained focus exercises",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Social Competition",
      description: "Compete with friends and climb global leaderboards while tracking cognitive improvements",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: GamepadIcon,
      title: "100+ Scientific Games",
      description: "Racing, shooting, puzzle, arcade and cognitive assessment games designed by neuroscientists",
      color: "from-red-500 to-rose-500"
    },
    {
      icon: Award,
      title: "Intelligence Testing",
      description: "Comprehensive IQ, EQ, and SQ assessments with detailed cognitive ability analysis",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const stats = [
    { number: "100+", label: "Brain Games", icon: Play, delay: "0s" },
    { number: "50k+", label: "Active Players", icon: Users, delay: "0.2s" },
    { number: "5M+", label: "Games Played", icon: Trophy, delay: "0.4s" },
    { number: "99%", label: "User Satisfaction", icon: Star, delay: "0.6s" }
  ];

  const handleReviewSubmit = (review: { rating: number; comment: string; name: string }) => {
    const newReview = {
      ...review,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  // Group games by category for homepage display
  const gameCategories = [...new Set(gameData.map(game => game.category))];
  const featuredGames = gameData.slice(0, 6); // Just get a few games to feature

  return (
    <>
      <Helmet>
        <title>Brain Burst Arcade - Free Online Brain Training Games</title>
        <meta name="description" content="Improve your memory, focus, and cognitive abilities with 100+ free online brain training games. Science-backed exercises for all ages. Start training today!" />
        <meta name="keywords" content="brain training, brain games, memory games, puzzle games, focus games, cognitive training, mental exercises, free brain games, IQ improvement, brain fitness, mental agility, concentration games, reaction time, spatial reasoning" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }} />
        </div>

        {/* Header */}
        <header className="container mx-auto px-4 py-6 relative z-10">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Brain Burst Arcade
              </span>
            </div>
            <div className="flex items-center space-x-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Link 
                to="/about"
                className="hidden md:flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105"
              >
                <span>About</span>
              </Link>
              <Link 
                to="/faq"
                className="hidden md:flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105"
              >
                <span>FAQ</span>
              </Link>
              <button
                onClick={() => setShowReviewModal(true)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Review</span>
              </button>
              <Link 
                to="/leaderboard"
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/30 transition-all duration-300 hover:scale-105"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
              <Link 
                to="/games" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Play Now</span>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="animate-fade-in">
              <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                Train Your Brain
              </h1>
              <div className="flex items-center justify-center space-x-2 mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Sparkles className="h-6 w-6 text-yellow-400" />
                <span className="text-xl text-white/90">Scientifically Designed Cognitive Enhancement</span>
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Enhance your memory, attention, and cognitive abilities with over 100 research-based brain training games. 
              Join 50,000+ users improving their mental performance through engaging, adaptive gameplay designed by neuroscientists.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Link 
                to="/games" 
                className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 hover:scale-110 flex items-center justify-center space-x-3 shadow-2xl"
              >
                <Play className="h-6 w-6 group-hover:animate-pulse" />
                <span>Start Training</span>
                <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/leaderboard" 
                className="bg-white/10 hover:bg-white/20 border-2 border-white/30 px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 hover:scale-110 flex items-center justify-center space-x-3 backdrop-blur-lg"
              >
                <Trophy className="h-6 w-6" />
                <span>Leaderboard</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Games Section */}
        <section className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Featured Games
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Explore our most popular brain training games designed to boost your cognitive abilities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredGames.map((game) => {
              const IconComponent = game.icon;
              return (
                <Link 
                  key={game.id}
                  to={`/game/${game.id}`}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/10 group"
                >
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{game.title}</h3>
                  <p className="text-white/70 mb-4">{game.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/50">{game.category}</span>
                    <span className="text-sm bg-blue-500/20 px-2 py-1 rounded text-blue-300">{game.difficulty}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/games"
              className="inline-flex items-center bg-white/10 hover:bg-white/20 backdrop-blur-lg px-6 py-3 rounded-xl border border-white/30 transition-all duration-300 hover:scale-105 font-medium"
            >
              <span>View All Games</span>
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Game Categories
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Train different aspects of your cognitive abilities with our specialized game categories
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gameCategories.slice(0, 8).map((category, index) => {
              const categoryGamesCount = gameData.filter(game => game.category === category).length;
              return (
                <Link 
                  key={category}
                  to={`/games?category=${category.toLowerCase()}`}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/10"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{category} Games</h3>
                  <p className="text-white/70 mb-4">
                    {categoryGamesCount} games to improve your {category.toLowerCase()} skills
                  </p>
                  <div className="flex justify-end">
                    <ChevronRight className="h-6 w-6 text-white/50" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className="text-center bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: stat.delay }}
                >
                  <IconComponent className="h-10 w-10 text-blue-400 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-white/70 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Why Choose Brain Burst?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Our platform combines cutting-edge neuroscience research with engaging gameplay 
              to deliver the most effective brain training experience available.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index} 
                  className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/10 transition-all duration-500 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`bg-gradient-to-r ${feature.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-300 transition-colors">{feature.title}</h3>
                  <p className="text-white/80 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              What Players Say
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-8">
              <div className="flex space-x-1">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-2xl font-bold text-white">{avgRating}</span>
              <span className="text-white/70">({reviews.length} reviews)</span>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {reviews.slice(0, 6).map((review) => (
                <div key={review.id} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 animate-fade-in">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-1 mr-3">
                      {[1,2,3,4,5].map(star => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-white">{review.name}</span>
                  </div>
                  <p className="text-white/80 italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mb-12">
              <p className="text-white/60 text-lg">Be the first to share your experience!</p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300 hover:scale-105 flex items-center space-x-3 mx-auto"
            >
              <MessageSquare className="h-6 w-6" />
              <span>Write a Review</span>
            </button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-lg rounded-3xl p-16 border border-white/20 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ready to Get Started?
            </h2>
            <p className="text-2xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join hundreds of thousands of players already improving their cognitive abilities. 
              Start your brain training journey today!
            </p>
            <Link 
              to="/games" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 px-12 py-6 rounded-2xl text-2xl font-bold transition-all duration-300 hover:scale-110 inline-flex items-center space-x-3 shadow-2xl"
            >
              <Brain className="h-8 w-8" />
              <span>Begin Training</span>
              <ChevronRight className="h-8 w-8" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 border-t border-white/20 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Brain Burst Arcade</h3>
              <p className="text-white/70 text-sm">
                Evidence-based cognitive training games designed to enhance memory, attention, and mental agility.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link to="/games" className="hover:text-white transition-colors">Games</Link></li>
                <li><Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="mailto:brain.burst0777@gmail.com" className="hover:text-white transition-colors">brain.burst0777@gmail.com</a></li>
                <li>Response within 24 hours</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-white/60 border-t border-white/20 pt-8">
            <p className="text-lg">&copy; 2025 Brain Burst Arcade. All rights reserved.</p>
            <p className="mt-2">Enhance your mind, one game at a time.</p>
          </div>
        </footer>

        {/* Review Modal */}
        {showReviewModal && (
          <ReviewModal
            onClose={() => setShowReviewModal(false)}
            onSubmit={handleReviewSubmit}
          />
        )}
      </div>
    </>
  );
};

export default Landing;
