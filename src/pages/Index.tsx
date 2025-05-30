
import React, { useState } from 'react';
import { Brain, ArrowRight, Star, MessageCircle, Send, Trophy, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReviewModal } from '@/components/ReviewModal';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Alex Chen',
      rating: 5,
      comment: 'Amazing brain training games! The 3D graphics are stunning and the difficulty progression is perfect. My memory has definitely improved!',
      date: '2024-01-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      rating: 4,
      comment: 'Love the variety of games available. The IQ test feature is really well designed and the power-ups make it even more engaging.',
      date: '2024-01-12'
    },
    {
      id: 3,
      name: 'Mike Rodriguez',
      rating: 5,
      comment: 'Best brain training app I\'ve used! The mobile responsiveness is excellent and the achievement system keeps me motivated.',
      date: '2024-01-10'
    }
  ]);

  const handleReviewSubmit = (review: { rating: number; comment: string; name: string }) => {
    const newReview = {
      id: reviews.length + 1,
      ...review,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const stats = [
    { icon: Users, label: 'Active Players', value: '50K+', color: 'from-blue-500 to-cyan-500' },
    { icon: Trophy, label: 'Games Completed', value: '1M+', color: 'from-green-500 to-emerald-500' },
    { icon: Brain, label: 'Brain Boost', value: '98%', color: 'from-purple-500 to-pink-500' },
    { icon: Zap, label: 'Avg. Score Gain', value: '45%', color: 'from-orange-500 to-red-500' }
  ];

  const features = [
    {
      icon: Brain,
      title: 'Advanced 3D Games',
      description: 'Immersive 3D brain training games with stunning graphics and realistic physics.',
      gradient: 'from-purple-500 to-blue-500'
    },
    {
      icon: Trophy,
      title: 'IQ Assessment',
      description: 'Comprehensive IQ test with accurate scoring and detailed performance analysis.',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: Zap,
      title: 'Power-ups & Rewards',
      description: 'Unlock special abilities, themes, and characters to enhance your gaming experience.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Users,
      title: 'Global Leaderboards',
      description: 'Compete with players worldwide and track your progress against the best.',
      gradient: 'from-pink-500 to-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-48 md:w-80 h-48 md:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-32 md:w-64 h-32 md:h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Navigation */}
        <nav className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Brain Burst Arcade</span>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/games"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Play Games
            </Link>
            <Link
              to="/leaderboard"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-xl font-semibold border border-white/30 transition-all duration-300 hover:scale-105"
            >
              Leaderboard
            </Link>
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Write Review</span>
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Train Your{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Brain
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Like Never Before
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the ultimate brain training platform with immersive 3D games, 
            comprehensive IQ testing, and gamified learning that makes improvement fun and engaging.
          </p>
          <Link
            to="/games"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-400 hover:via-blue-400 hover:to-cyan-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-110 shadow-2xl animate-pulse-glow"
          >
            <span>Start Training Now</span>
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center p-4 md:p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-3`}>
                  <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm md:text-base">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="p-6 md:p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Players Say</h2>
            <p className="text-white/80 text-lg">Join thousands of satisfied brain trainers worldwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <div className="flex space-x-1 mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-semibold">{review.name}</span>
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-3">{review.comment}</p>
                <p className="text-white/60 text-xs">{new Date(review.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
            >
              <Send className="h-5 w-5" />
              <span>Share Your Experience</span>
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center p-8 md:p-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-3xl border border-white/30">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Boost Your Brain Power?</h2>
          <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join the brain training revolution and unlock your cognitive potential with our cutting-edge games and assessments.
          </p>
          <Link
            to="/games"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-110 shadow-2xl"
          >
            <Brain className="h-6 w-6" />
            <span>Start Your Journey</span>
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </div>

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

export default Index;
