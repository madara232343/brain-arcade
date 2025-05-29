import React from 'react';
import { Brain, Zap, Trophy, Target, Users, Star, Play, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: "Memory Training",
      description: "Enhance your working memory with sequence and pattern games"
    },
    {
      icon: Zap,
      title: "Speed Challenges",
      description: "Improve reaction time and processing speed with fast-paced games"
    },
    {
      icon: Target,
      title: "Focus & Attention",
      description: "Sharpen your concentration with visual attention tasks"
    },
    {
      icon: Users,
      title: "Social Competition",
      description: "Compete with friends and climb the global leaderboards"
    }
  ];

  const stats = [
    { number: "50+", label: "Brain Games", icon: Play },
    { number: "10k+", label: "Active Players", icon: Users },
    { number: "1M+", label: "Games Played", icon: Trophy },
    { number: "98%", label: "User Satisfaction", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold">Brain Burst Arcade</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/leaderboard"
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Leaderboard</span>
            </Link>
            <Link 
              to="/games" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Play Now
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Train Your Brain
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
            Challenge your mind with scientifically designed games that improve memory, 
            attention, and cognitive abilities through engaging gameplay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/games" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Start Training</span>
            </Link>
            <Link 
              to="/leaderboard" 
              className="bg-white/10 hover:bg-white/20 border border-white/30 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Trophy className="h-5 w-5" />
              <span>View Leaderboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <IconComponent className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-white/70">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Brain Burst?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Our platform combines neuroscience research with engaging gameplay to deliver 
            the most effective brain training experience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-12 border border-white/20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of players already improving their cognitive abilities. 
            Start your brain training journey today!
          </p>
          <Link 
            to="/games" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105 inline-flex items-center space-x-2"
          >
            <Brain className="h-5 w-5" />
            <span>Begin Training</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/20">
        <div className="text-center text-white/60">
          <p>&copy; 2024 Brain Burst Arcade. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
