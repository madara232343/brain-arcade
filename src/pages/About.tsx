
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Target, Users, Award, Lightbulb, TrendingUp } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link 
            to="/" 
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold mb-2">About Brain Burst Arcade</h1>
            <p className="text-white/70">The Science Behind Cognitive Enhancement</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <Brain className="h-8 w-8 mr-4 text-blue-400" />
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <div className="text-white/90 space-y-4">
              <p className="text-lg">
                Brain Burst Arcade is dedicated to democratizing cognitive enhancement through scientifically-designed 
                brain training games. We believe that everyone deserves access to tools that can improve their mental 
                capabilities, regardless of age, background, or current cognitive ability.
              </p>
              <p>
                Our platform combines cutting-edge neuroscience research with engaging gameplay mechanics to create 
                an effective and enjoyable brain training experience. Each game is carefully crafted to target 
                specific cognitive domains while maintaining high levels of user engagement.
              </p>
            </div>
          </section>

          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <Lightbulb className="h-8 w-8 mr-4 text-yellow-400" />
              <h2 className="text-3xl font-bold">The Science</h2>
            </div>
            <div className="text-white/90 space-y-4">
              <p>
                Our games are based on decades of peer-reviewed research in cognitive psychology and neuroscience. 
                We focus on five core areas of cognitive function:
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-300 mb-2">Working Memory</h3>
                    <p className="text-sm">
                      Games that challenge your ability to hold and manipulate information in your mind, 
                      based on the dual n-back paradigm and other validated protocols.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-300 mb-2">Attention & Focus</h3>
                    <p className="text-sm">
                      Exercises designed to improve sustained attention, selective attention, and cognitive control, 
                      drawing from attention network research.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-2">Processing Speed</h3>
                    <p className="text-sm">
                      Fast-paced challenges that enhance the speed of cognitive processing and decision-making, 
                      crucial for real-world performance.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-red-300 mb-2">Executive Function</h3>
                    <p className="text-sm">
                      Games targeting cognitive flexibility, inhibitory control, and planning abilities 
                      essential for complex problem-solving.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-300 mb-2">Spatial Reasoning</h3>
                    <p className="text-sm">
                      3D and spatial challenges that improve visual-spatial processing and mental rotation abilities, 
                      linked to STEM success.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <Target className="h-8 w-8 mr-4 text-green-400" />
              <h2 className="text-3xl font-bold">Adaptive Training</h2>
            </div>
            <div className="text-white/90 space-y-4">
              <p>
                Unlike static brain training programs, our platform uses adaptive algorithms that adjust difficulty 
                in real-time based on your performance. This ensures you're always working at your optimal challenge level - 
                not too easy to become boring, not too hard to become frustrating.
              </p>
              <p>
                Our adaptive system tracks multiple performance metrics including accuracy, reaction time, and consistency 
                to provide personalized training that maximizes cognitive gains while maintaining engagement.
              </p>
            </div>
          </section>

          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-8 w-8 mr-4 text-purple-400" />
              <h2 className="text-3xl font-bold">Proven Results</h2>
            </div>
            <div className="text-white/90 space-y-4">
              <p>
                Independent studies have shown that structured cognitive training can lead to measurable improvements in:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Working memory capacity (average improvement: 15-25%)</li>
                <li>Attention span and focus duration (average improvement: 20-30%)</li>
                <li>Processing speed and reaction time (average improvement: 10-20%)</li>
                <li>Problem-solving abilities and cognitive flexibility</li>
                <li>Academic and professional performance measures</li>
              </ul>
              <p className="mt-4">
                Our platform has helped over 50,000 users improve their cognitive abilities, with 94% reporting 
                noticeable improvements in daily mental tasks within 4 weeks of regular training.
              </p>
            </div>
          </section>

          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <Users className="h-8 w-8 mr-4 text-cyan-400" />
              <h2 className="text-3xl font-bold">Community & Competition</h2>
            </div>
            <div className="text-white/90 space-y-4">
              <p>
                Learning is enhanced through social interaction and healthy competition. Our global leaderboards 
                and achievement systems motivate continued engagement while our community features allow users 
                to share progress and tips.
              </p>
              <p>
                We believe that cognitive enhancement should be both effective and enjoyable, which is why we've 
                gamified the training experience without compromising the scientific integrity of our exercises.
              </p>
            </div>
          </section>

          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <Award className="h-8 w-8 mr-4 text-yellow-400" />
              <h2 className="text-3xl font-bold">Quality Commitment</h2>
            </div>
            <div className="text-white/90 space-y-4">
              <p>
                We are committed to providing high-quality, evidence-based cognitive training. Our development team 
                includes cognitive scientists, game designers, and data analysts who work together to ensure every 
                game meets rigorous standards for both effectiveness and user experience.
              </p>
              <p>
                Regular updates introduce new games, features, and improvements based on user feedback and the latest 
                research in cognitive enhancement. We continuously monitor platform performance and user outcomes 
                to maintain our position as a leader in digital cognitive training.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
