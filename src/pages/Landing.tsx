
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Gamepad2, Trophy, Users, Star, ChevronRight, Play, Award, Zap, Shield, Target } from 'lucide-react';
import { ReviewModal } from '@/components/ReviewModal';

export const Landing: React.FC = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);

  const testimonials = [
    {
      name: "Alex Johnson",
      rating: 5,
      comment: "Brain Burst Arcade is amazing! The games are challenging and fun. I've improved my memory and reaction time significantly.",
      avatar: "🧠"
    },
    {
      name: "Sarah Chen", 
      rating: 5,
      comment: "Love the variety of games! The daily challenges keep me coming back. Great way to exercise your brain while having fun.",
      avatar: "🎯"
    },
    {
      name: "Mike Rodriguez",
      rating: 4,
      comment: "Fantastic game collection! The IQ and EQ tests are surprisingly accurate. Perfect for brain training and entertainment.",
      avatar: "⚡"
    },
    {
      name: "Emma Wilson",
      rating: 5,
      comment: "The most comprehensive brain training platform I've used. Games are well-designed and the progression system is motivating.",
      avatar: "🏆"
    },
    {
      name: "David Kumar",
      rating: 5,
      comment: "Incredible variety of cognitive games! The 3D games are stunning and the 2D games are perfectly crafted. Highly recommended!",
      avatar: "🎮"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "100+ Brain Games",
      description: "Memory, puzzle, speed, racing, and shooting games designed by cognitive experts",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Trophy,
      title: "IQ & EQ Testing",
      description: "Accurate intelligence and emotional quotient assessments with detailed analysis",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Power-ups & Rewards",
      description: "Earn XP, unlock achievements, and use power-ups to enhance your gameplay",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Users,
      title: "Global Leaderboards",
      description: "Compete with players worldwide and track your cognitive improvement",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const gameCategories = [
    { name: "Memory Games", icon: "🧠", count: "25+", color: "from-blue-500 to-blue-600" },
    { name: "Puzzle Games", icon: "🧩", count: "20+", color: "from-green-500 to-green-600" },
    { name: "Speed Games", icon: "⚡", count: "15+", color: "from-yellow-500 to-yellow-600" },
    { name: "Racing Games", icon: "🏎️", count: "15+", color: "from-red-500 to-red-600" },
    { name: "Shooting Games", icon: "🎯", count: "15+", color: "from-purple-500 to-purple-600" },
    { name: "Strategy Games", icon: "♟️", count: "10+", color: "from-indigo-500 to-indigo-600" }
  ];

  const handleReviewSubmit = (review: { rating: number; comment: string; name: string }) => {
    console.log('Review submitted:', review);
    // In a real app, this would send to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6 animate-bounce">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                <Brain className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Brain Burst
              </span>
              <br />
              <span className="text-white">Arcade</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Challenge your mind with 100+ cognitive games designed to boost memory, 
              speed, and problem-solving skills
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link
                to="/games"
                className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-2"
              >
                <Play className="h-6 w-6" />
                <span>Start Playing</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button
                onClick={() => setShowReviewModal(true)}
                className="group bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 border border-white/20 flex items-center space-x-2"
              >
                <Star className="h-6 w-6" />
                <span>Write Review</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              {[
                { label: "Brain Games", value: "100+" },
                { label: "Active Players", value: "50K+" },
                { label: "Countries", value: "120+" },
                { label: "Success Rate", value: "95%" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Brain Burst Arcade?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Scientifically designed games that make cognitive training fun and effective
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Categories */}
      <section className="py-16 md:py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explore Game Categories
            </h2>
            <p className="text-xl text-white/70">
              Diverse collection of games targeting different cognitive skills
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {gameCategories.map((category, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{category.name}</h3>
                <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${category.color} text-white text-sm font-medium`}>
                  {category.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Players Say
            </h2>
            <p className="text-xl text-white/70">
              Join thousands of satisfied brain training enthusiasts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <div className="flex space-x-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-white/80">{testimonial.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Boost Your Brainpower?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join our community of cognitive athletes and start your brain training journey today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/games"
              className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-2"
            >
              <Gamepad2 className="h-6 w-6" />
              <span>Play Now - It's Free!</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black/40 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Brain className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">Brain Burst Arcade</span>
            </div>
            
            <p className="text-white/70 mb-6">
              Elevating minds through intelligent gaming since 2025
            </p>
            
            <div className="flex justify-center space-x-8 mb-6">
              <a href="#" className="text-white/70 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Support</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a>
            </div>
            
            <p className="text-white/50 text-sm">
              © 2025 Brain Burst Arcade. All rights reserved.
            </p>
          </div>
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
