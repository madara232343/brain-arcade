
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Gamepad2, Trophy, Users, Star, ChevronRight, Play, Zap, Target } from 'lucide-react';

const Landing = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Alex Johnson",
      rating: 5,
      comment: "Amazing brain training games! I've improved my memory and reaction time significantly.",
      avatar: "👨‍💻"
    },
    {
      name: "Sarah Chen",
      rating: 5,
      comment: "The variety of games is incredible. Each one challenges different cognitive skills.",
      avatar: "👩‍🎓"
    },
    {
      name: "Mike Rodriguez",
      rating: 5,
      comment: "Perfect for daily brain exercise. The progress tracking keeps me motivated!",
      avatar: "🧑‍🔬"
    },
    {
      name: "Emma Wilson",
      rating: 5,
      comment: "Love the clean interface and smooth gameplay. Highly recommended!",
      avatar: "👩‍🎨"
    }
  ];

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "100+ Brain Games",
      description: "Diverse collection of cognitive training games"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Skill Assessment",
      description: "Track your IQ, EQ, and cognitive abilities"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Achievement System",
      description: "Unlock rewards and track your progress"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Daily Challenges",
      description: "Fresh challenges every day to keep you engaged"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8 animate-pulse">
              <Gamepad2 className="h-5 w-5 text-yellow-400" />
              <span className="text-white font-medium">100+ Games Available</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
              Brain Burst
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Arcade
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto animate-fade-in-up delay-200">
              Challenge your mind with our collection of brain-training games. 
              Improve memory, reaction time, and cognitive skills while having fun!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
              <Link
                to="/games"
                className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Start Playing</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/profile"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Why Choose Brain Burst Arcade?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-cyan-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            What Players Say
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">{testimonials[currentTestimonial].avatar}</div>
              
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              <p className="text-xl text-white/90 mb-6 italic">
                "{testimonials[currentTestimonial].comment}"
              </p>
              
              <h4 className="text-lg font-bold text-white">
                {testimonials[currentTestimonial].name}
              </h4>
            </div>
            
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-cyan-400' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Challenge Your Mind?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of players improving their cognitive abilities every day
          </p>
          
          <Link
            to="/games"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 hover:scale-105"
          >
            <Gamepad2 className="h-6 w-6" />
            <span>Play Now</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Brain className="h-6 w-6 text-cyan-400" />
            <span className="text-white font-bold text-lg">Brain Burst Arcade</span>
          </div>
          <p className="text-white/60">
            © 2025 Brain Burst Arcade. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
