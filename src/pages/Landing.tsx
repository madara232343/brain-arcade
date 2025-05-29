
import React, { useState } from 'react';
import { Play, Star, Users, Trophy, Gamepad2, Brain, Zap, Target, Eye, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Brain,
      title: "60+ Brain Games",
      description: "2D and 3D interactive games to boost your cognitive abilities",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Unlock rewards and track your progress with detailed stats",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: Zap,
      title: "Power-ups & Items",
      description: "Buy and use power-ups to enhance your gaming experience",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Users,
      title: "Ranking System",
      description: "Compete with others and climb the global leaderboard",
      color: "from-pink-500 to-red-600"
    }
  ];

  const gameCategories = [
    { name: "2D Games", count: "30+", icon: Target, description: "Classic brain training games" },
    { name: "3D Games", count: "30+", icon: Eye, description: "Immersive 3D experiences" },
    { name: "Speed Games", count: "15+", icon: Timer, description: "Fast-paced challenges" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <header className="relative z-20 p-6">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Brain Burst Arcade</h1>
          </div>
          <Link
            to="/games"
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105"
          >
            Play Now
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 text-center py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Train Your Brain with
            <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent"> 60+ Games</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Challenge yourself with 2D classics and immersive 3D experiences. Track progress, unlock achievements, and compete globally!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link
              to="/games"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Play className="h-6 w-6" />
              <span>Start Playing</span>
            </Link>
            <Link
              to="/leaderboard"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 border border-white/30 flex items-center justify-center space-x-2"
            >
              <Trophy className="h-6 w-6" />
              <span>View Leaderboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Why Choose Brain Burst Arcade?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Game Categories */}
      <section className="relative z-10 py-20 px-6 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Game Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gameCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105 text-center">
                  <IconComponent className="h-16 w-16 text-white mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{category.count}</div>
                  <p className="text-white/70">{category.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <div className="text-4xl font-bold text-yellow-400 mb-2">60+</div>
              <div className="text-white/80">Brain Games</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <div className="text-4xl font-bold text-green-400 mb-2">50+</div>
              <div className="text-white/80">Achievements</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
              <div className="text-4xl font-bold text-blue-400 mb-2">10K+</div>
              <div className="text-white/80">Players</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Challenge Your Mind?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of players improving their cognitive abilities daily!
          </p>
          <Link
            to="/games"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white px-12 py-4 rounded-xl font-bold text-xl transition-all duration-300 hover:scale-105 inline-flex items-center space-x-3"
          >
            <Gamepad2 className="h-8 w-8" />
            <span>Start Your Journey</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/60">© 2024 Brain Burst Arcade. Train your brain, challenge your limits.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
