
import React, { useState } from 'react';
import { Brain, Zap, Trophy, Target, Users, Star, Play, BarChart3, MessageSquare, ChevronRight, Award, GamepadIcon, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReviewModal } from '@/components/ReviewModal';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Landing = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useLocalStorage<any[]>('gameReviews', []);

  const features = [
    {
      icon: Brain,
      title: "Memory Training",
      description: "Enhance your working memory with sequence and pattern games",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Speed Challenges", 
      description: "Improve reaction time and processing speed with fast-paced games",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Target,
      title: "Focus & Attention",
      description: "Sharpen your concentration with visual attention tasks",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Social Competition",
      description: "Compete with friends and climb the global leaderboards",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: GamepadIcon,
      title: "100+ Games",
      description: "Racing, shooting, puzzle, arcade and many more game categories",
      color: "from-red-500 to-rose-500"
    },
    {
      icon: Award,
      title: "Intelligence Tests",
      description: "Test your IQ, EQ, and SQ with scientifically designed assessments",
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

  return (
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
              <span className="text-xl text-white/90">The Ultimate Brain Training Experience</span>
              <Sparkles className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Challenge your mind with 100+ scientifically designed games across multiple categories.
            Improve memory, attention, and cognitive abilities through engaging gameplay.
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
        <div className="text-center text-white/60">
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
  );
};

export default Landing;
