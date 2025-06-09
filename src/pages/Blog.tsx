
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Calendar, User, TrendingUp, BookOpen } from 'lucide-react';
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
    tags: ['focus', 'attention', 'science', 'brain games', 'cognitive improvement'],
    featured: true
  },
  {
    id: 'brain-training-myths-facts',
    title: 'Brain Training Myths vs. Facts: What Really Works',
    excerpt: 'Separate science from marketing in brain training. Learn what research actually says about cognitive enhancement.',
    image: '/placeholder.svg',
    author: 'Cognitive Researcher',
    date: 'June 8, 2025',
    readTime: '10 min read',
    category: 'Research',
    tags: ['brain training', 'myths', 'facts', 'cognitive science', 'debunking'],
    featured: true
  },
  {
    id: 'cognitive-benefits-puzzle-games',
    title: 'The Cognitive Benefits of Puzzle Games: What Science Says',
    excerpt: 'Explore the latest neuroscience research on how puzzle games enhance brain function and cognitive abilities.',
    image: '/placeholder.svg',
    author: 'Dr. Neuroscience',
    date: 'June 5, 2025',
    readTime: '8 min read',
    category: 'Research',
    tags: ['puzzle games', 'cognitive benefits', 'neuroscience', 'brain research', 'mental health'],
    featured: false
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
    tags: ['ADHD', 'executive function', 'concentration', 'brain training', 'attention deficit'],
    featured: false
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
    tags: ['free games', 'online games', 'brain training', 'cognitive skills', 'memory games'],
    featured: false
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
    tags: ['memory improvement', 'techniques', 'brain exercises', 'cognitive enhancement'],
    featured: false
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
    tags: ['seniors', 'elderly', 'cognitive decline', 'brain health', 'memory games'],
    featured: false
  }
];

const categories = [
  { name: 'All', count: blogPosts.length },
  { name: 'Research', count: blogPosts.filter(post => post.category === 'Research').length },
  { name: 'Focus Training', count: blogPosts.filter(post => post.category === 'Focus Training').length },
  { name: 'Mental Health', count: blogPosts.filter(post => post.category === 'Mental Health').length },
  { name: 'Memory', count: blogPosts.filter(post => post.category === 'Memory').length },
  { name: 'Resources', count: blogPosts.filter(post => post.category === 'Resources').length },
  { name: 'Aging', count: blogPosts.filter(post => post.category === 'Aging').length }
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  
  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);
    
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

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
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-white" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Brain Burst Blog</h1>
              <p className="text-white/70">Science-backed articles to boost your cognitive abilities</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-white/70">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>{blogPosts.length} Articles</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Weekly Updates</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  selectedCategory === category.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
        
        {/* Featured Posts */}
        {selectedCategory === 'All' && featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <Link to={`/blog/${post.id}`} key={post.id} className="block group">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300">
                    <div className="h-48 bg-gradient-to-br from-blue-500/30 to-purple-600/30">
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        🧠
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-white/70 mb-3">
                        <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {post.date}</span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">{post.title}</h3>
                      <p className="text-white/80 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70 flex items-center">
                          <User className="h-3 w-3 mr-1" /> {post.author}
                        </span>
                        <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Regular Blog Posts Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            {selectedCategory === 'All' ? 'All Articles' : `${selectedCategory} Articles`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedCategory === 'All' ? regularPosts : filteredPosts).map((post) => (
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
        </div>

        {/* Quick Tips Section */}
        <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Quick Brain Training Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Daily Practice</h4>
              <p className="text-white/80 text-sm">15-30 minutes of consistent brain training yields the best results.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Variety Matters</h4>
              <p className="text-white/80 text-sm">Mix different game types to challenge various cognitive abilities.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Progressive Challenge</h4>
              <p className="text-white/80 text-sm">Gradually increase difficulty to maintain cognitive growth.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Track Progress</h4>
              <p className="text-white/80 text-sm">Monitor improvements to stay motivated and identify strengths.</p>
            </div>
          </div>
        </div>
        
        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="md:flex items-center justify-between">
            <div className="md:w-2/3 mb-4 md:mb-0">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Get Brain Training Tips in Your Inbox</h3>
              <p className="text-white/80">Subscribe to our newsletter for weekly brain training tips, research updates, and new game announcements.</p>
            </div>
            <div className="md:w-1/3">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-white/10 border border-white/30 rounded-l-lg px-4 py-2 text-white w-full focus:outline-none focus:bg-white/15 placeholder-white/50"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg font-medium transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-white/60 mt-2">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
