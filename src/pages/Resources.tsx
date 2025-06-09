
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, BookOpen, Video, FileText, Users, Brain, Target, Award, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const resources = [
  {
    category: 'Guides & eBooks',
    items: [
      {
        title: 'Complete Guide to Brain Training',
        description: 'Comprehensive 50-page guide covering the science of cognitive enhancement, best practices, and recommended exercises.',
        type: 'PDF Guide',
        size: '2.3 MB',
        downloadUrl: '#',
        icon: <BookOpen className="h-5 w-5" />,
        popular: true
      },
      {
        title: 'Memory Enhancement Workbook',
        description: 'Practical exercises and techniques to improve memory, including worksheets and progress tracking templates.',
        type: 'PDF Workbook',
        size: '4.1 MB',
        downloadUrl: '#',
        icon: <FileText className="h-5 w-5" />
      },
      {
        title: 'Focus Training Manual',
        description: 'Step-by-step manual for improving attention and concentration through targeted exercises and lifestyle changes.',
        type: 'PDF Manual',
        size: '1.8 MB',
        downloadUrl: '#',
        icon: <Target className="h-5 w-5" />
      }
    ]
  },
  {
    category: 'Video Tutorials',
    items: [
      {
        title: 'Getting Started with Brain Training',
        description: 'Introduction video explaining the basics of cognitive training and how to use Brain Burst Arcade effectively.',
        type: 'Video Tutorial',
        duration: '12 minutes',
        watchUrl: '#',
        icon: <Video className="h-5 w-5" />,
        popular: true
      },
      {
        title: 'Advanced Memory Techniques',
        description: 'Learn advanced mnemonic techniques and memory palace methods from memory experts.',
        type: 'Video Series',
        duration: '45 minutes',
        watchUrl: '#',
        icon: <Video className="h-5 w-5" />
      },
      {
        title: 'Brain Training for Seniors',
        description: 'Specialized guidance for older adults starting their cognitive training journey.',
        type: 'Video Guide',
        duration: '18 minutes',
        watchUrl: '#',
        icon: <Video className="h-5 w-5" />
      }
    ]
  },
  {
    category: 'Research & Articles',
    items: [
      {
        title: 'Latest Brain Training Research',
        description: 'Curated collection of peer-reviewed studies on cognitive training effectiveness and best practices.',
        type: 'Research Collection',
        updates: 'Monthly',
        viewUrl: '#',
        icon: <Brain className="h-5 w-5" />
      },
      {
        title: 'Cognitive Assessment Tools',
        description: 'Professional-grade tools to assess your cognitive baseline and track improvements over time.',
        type: 'Assessment Suite',
        tests: '12 tests',
        accessUrl: '#',
        icon: <Award className="h-5 w-5" />
      }
    ]
  }
];

const faqs = [
  {
    question: 'How often should I practice brain training?',
    answer: 'Research shows that 15-30 minutes of daily practice, 4-5 times per week, provides optimal results. Consistency is more important than duration.'
  },
  {
    question: 'When will I see improvements?',
    answer: 'Most people notice improvements in trained skills within 2-4 weeks of consistent practice. Broader cognitive benefits may take 6-8 weeks to become apparent.'
  },
  {
    question: 'Can brain training help with ADHD?',
    answer: 'Studies show that targeted cognitive training can help improve attention, working memory, and impulse control in individuals with ADHD when used as part of a comprehensive treatment approach.'
  },
  {
    question: 'Are the games suitable for seniors?',
    answer: 'Yes! Our games are designed with adjustable difficulty levels and senior-friendly interfaces. Many studies show cognitive training benefits for older adults.'
  },
  {
    question: 'Do the benefits transfer to real life?',
    answer: 'Well-designed brain training can improve performance on similar cognitive tasks. The key is choosing games that target specific abilities you want to improve in daily life.'
  }
];

const tips = [
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Set a Routine',
    description: 'Practice at the same time each day to build a sustainable habit.'
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: 'Focus on Weaknesses',
    description: 'Identify your cognitive weak points and target them specifically.'
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: 'Track Progress',
    description: 'Monitor your improvements to stay motivated and adjust your training.'
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Join the Community',
    description: 'Connect with other players for motivation and support.'
  }
];

const Resources = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative">
      <Helmet>
        <title>Brain Training Resources | Brain Burst Arcade</title>
        <meta name="description" content="Free brain training resources, guides, tutorials, and research. Everything you need to maximize your cognitive enhancement journey." />
        <meta name="keywords" content="brain training resources, cognitive enhancement guides, memory improvement tutorials, focus training materials, brain health research" />
      </Helmet>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-white" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Brain Training Resources</h1>
              <p className="text-white/70">Everything you need to maximize your cognitive enhancement journey</p>
            </div>
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Quick Start Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4">
                <div className="text-blue-300 mb-2">{tip.icon}</div>
                <h3 className="font-medium text-white mb-2">{tip.title}</h3>
                <p className="text-white/80 text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resources by Category */}
        {resources.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-blue-300">{item.icon}</div>
                    {item.popular && (
                      <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full text-xs font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/80 text-sm mb-4">{item.description}</p>
                  <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                    <span>{item.type}</span>
                    <span>{item.size || item.duration || item.updates || item.tests}</span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                    {item.downloadUrl && (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </>
                    )}
                    {item.watchUrl && (
                      <>
                        <Video className="h-4 w-4" />
                        <span>Watch</span>
                      </>
                    )}
                    {(item.viewUrl || item.accessUrl) && (
                      <>
                        <ExternalLink className="h-4 w-4" />
                        <span>Access</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* FAQ Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-white/20 last:border-b-0 pb-4 last:pb-0">
                <h3 className="text-lg font-medium text-white mb-2">{faq.question}</h3>
                <p className="text-white/80">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community Section */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
          <div className="text-center">
            <Users className="h-12 w-12 text-purple-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Join Our Community</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Connect with thousands of brain training enthusiasts. Share progress, get tips, and stay motivated on your cognitive enhancement journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Join Discord Community</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg font-medium transition-colors border border-white/30">
                Follow on Social Media
              </button>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/blog" className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 group">
            <BookOpen className="h-8 w-8 text-blue-300 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">Read Our Blog</h3>
            <p className="text-white/80 text-sm">Discover the latest research and tips on brain training and cognitive enhancement.</p>
          </Link>
          
          <Link to="/games" className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 group">
            <Brain className="h-8 w-8 text-purple-300 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">Play Games</h3>
            <p className="text-white/80 text-sm">Start training with our collection of scientifically-designed brain games.</p>
          </Link>
          
          <Link to="/about" className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 group">
            <Award className="h-8 w-8 text-green-300 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-300 transition-colors">Learn More</h3>
            <p className="text-white/80 text-sm">Discover the science behind our brain training platform and methodology.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Resources;
