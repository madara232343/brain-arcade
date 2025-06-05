
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Calendar, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const blogPosts = [
  {
    id: 'top-5-brain-games-focus',
    title: 'Top 5 Brain Games for Focus (Backed by Science)',
    excerpt: 'Discover science-backed games that can significantly improve your focus and attention span with just minutes of play per day.',
    image: '/placeholder.svg',
    author: 'Dr. Cognitive',
    date: 'June 2, 2025',
    readTime: '7 min read',
    category: 'Focus Training',
    tags: ['focus', 'attention', 'science', 'brain games', 'cognitive improvement']
  },
  {
    id: 'games-help-adhd',
    title: 'How Playing Games Can Help ADHD',
    excerpt: 'Learn how specific types of brain games can help manage ADHD symptoms and improve executive functioning.',
    image: '/placeholder.svg',
    author: 'Neuroscience Team',
    date: 'May 28, 2025',
    readTime: '8 min read',
    category: 'Mental Health',
    tags: ['ADHD', 'executive function', 'concentration', 'brain training', 'attention deficit']
  },
  {
    id: 'free-online-brain-games',
    title: 'Free Online Brain Games You Can Play Anytime',
    excerpt: 'A curated collection of the best free online brain games that you can access anytime to boost your cognitive abilities.',
    image: '/placeholder.svg',
    author: 'Game Expert',
    date: 'May 20, 2025',
    readTime: '6 min read',
    category: 'Resources',
    tags: ['free games', 'online games', 'brain training', 'cognitive skills', 'memory games']
  },
  {
    id: 'memory-improvement-techniques',
    title: 'Memory Improvement Techniques That Actually Work',
    excerpt: 'Evidence-based strategies to enhance your memory, combined with recommended brain games that reinforce these techniques.',
    image: '/placeholder.svg',
    author: 'Memory Expert',
    date: 'May 15, 2025',
    readTime: '9 min read',
    category: 'Memory',
    tags: ['memory improvement', 'techniques', 'brain exercises', 'cognitive enhancement']
  },
  {
    id: 'brain-games-for-seniors',
    title: 'Best Brain Games for Seniors to Stay Mentally Sharp',
    excerpt: 'Specialized brain games designed to help seniors maintain cognitive function and prevent age-related decline.',
    image: '/placeholder.svg',
    author: 'Gerontology Specialist',
    date: 'May 10, 2025',
    readTime: '7 min read',
    category: 'Aging',
    tags: ['seniors', 'elderly', 'cognitive decline', 'brain health', 'memory games']
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative">
      <Helmet>
        <title>Brain Burst Arcade Blog | Brain Training Articles & Resources</title>
        <meta name="description" content="Discover articles, resources, and science-backed strategies for improving cognitive abilities, memory, focus, and mental agility through brain games and exercises." />
        <meta name="keywords" content="brain training articles, cognitive improvement, brain games blog, memory enhancement tips, focus improvement, mental agility, brain health, neuroscience games, cognitive science" />
      </Helmet>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-white" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Brain Burst Blog</h1>
              <p className="text-white/70">Articles and resources to boost your cognitive abilities</p>
            </div>
          </div>
        </div>
        
        {/* Featured Post */}
        <div className="mb-12">
          <Link to={`/blog/${blogPosts[0].id}`} className="block group">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300">
              <div className="md:flex">
                <div className="md:w-1/2 h-48 md:h-auto bg-gradient-to-br from-blue-500/30 to-purple-600/30">
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🧠
                  </div>
                </div>
                <div className="p-6 md:w-1/2">
                  <div className="flex items-center text-sm text-white/70 mb-3">
                    <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {blogPosts[0].date}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {blogPosts[0].readTime}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">{blogPosts[0].title}</h2>
                  <p className="text-white/80 mb-4">{blogPosts[0].excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70 flex items-center">
                      <User className="h-3 w-3 mr-1" /> {blogPosts[0].author}
                    </span>
                    <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                      {blogPosts[0].category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.slice(1).map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id} className="block group">
              <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                <div className="h-40 bg-gradient-to-br from-indigo-500/20 to-purple-600/20">
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🧠
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center text-xs text-white/70 mb-2">
                    <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {post.date}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{post.title}</h3>
                  <p className="text-white/80 text-sm mb-3 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-white/70">
                      By {post.author}
                    </span>
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="md:flex items-center justify-between">
            <div className="md:w-2/3 mb-4 md:mb-0">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Get Brain Training Tips in Your Inbox</h3>
              <p className="text-white/80">Subscribe to our newsletter for weekly brain training tips and new game announcements.</p>
            </div>
            <div className="md:w-1/3">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-white/10 border border-white/30 rounded-l-lg px-4 py-2 text-white w-full focus:outline-none focus:bg-white/15"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
