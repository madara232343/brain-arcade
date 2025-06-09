
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Calendar, User, TrendingUp, BookOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const blogPosts = [
  {
    id: 'complete-guide-brain-training-science',
    title: 'The Complete Guide to Brain Training: What Science Actually Says About Cognitive Enhancement',
    excerpt: 'A comprehensive deep-dive into the neuroscience behind brain training, examining 50+ peer-reviewed studies to separate fact from fiction. Learn which techniques actually work and how to maximize your cognitive potential.',
    image: '/placeholder.svg',
    author: 'Dr. Sarah Chen, Neuroscientist',
    date: 'June 10, 2025',
    readTime: '15 min read',
    category: 'Research',
    tags: ['neuroscience', 'cognitive enhancement', 'brain plasticity', 'research', 'evidence-based'],
    featured: true
  },
  {
    id: 'neuroplasticity-brain-games-comprehensive-analysis',
    title: 'Neuroplasticity and Brain Games: A Comprehensive Analysis of Cognitive Transfer',
    excerpt: 'Explore how neuroplasticity enables cognitive improvement through targeted training. This in-depth analysis covers the mechanisms of brain change, optimal training protocols, and real-world applications of cognitive enhancement.',
    image: '/placeholder.svg',
    author: 'Dr. Michael Rodriguez, Cognitive Psychologist',
    date: 'June 8, 2025',
    readTime: '12 min read',
    category: 'Neuroscience',
    tags: ['neuroplasticity', 'cognitive transfer', 'brain development', 'psychology', 'training protocols'],
    featured: true
  },
  {
    id: 'working-memory-training-executive-function',
    title: 'Working Memory Training and Executive Function: Clinical Evidence and Practical Applications',
    excerpt: 'A detailed examination of working memory training effectiveness, including clinical studies, training methodologies, and practical applications for ADHD, aging, and cognitive enhancement.',
    image: '/placeholder.svg',
    author: 'Dr. Emily Watson, Clinical Neuropsychologist',
    date: 'June 5, 2025',
    readTime: '14 min read',
    category: 'Clinical Research',
    tags: ['working memory', 'executive function', 'ADHD', 'clinical studies', 'cognitive therapy'],
    featured: true
  },
  {
    id: 'brain-training-aging-cognitive-decline-prevention',
    title: 'Brain Training for Healthy Aging: Preventing Cognitive Decline Through Targeted Exercises',
    excerpt: 'Comprehensive guide to maintaining cognitive health through aging. Covers the latest research on cognitive reserve, effective training programs, and lifestyle factors that support brain health.',
    image: '/placeholder.svg',
    author: 'Dr. James Thompson, Gerontologist',
    date: 'June 2, 2025',
    readTime: '16 min read',
    category: 'Aging & Health',
    tags: ['healthy aging', 'cognitive decline', 'brain health', 'cognitive reserve', 'prevention'],
    featured: false
  },
  {
    id: 'attention-training-digital-age-focus-enhancement',
    title: 'Attention Training in the Digital Age: Combating Information Overload and Enhancing Focus',
    excerpt: 'Learn how digital environments affect attention and concentration, plus evidence-based strategies for improving focus in our connected world. Includes practical exercises and digital wellness tips.',
    image: '/placeholder.svg',
    author: 'Dr. Lisa Park, Attention Researcher',
    date: 'May 30, 2025',
    readTime: '11 min read',
    category: 'Digital Wellness',
    tags: ['attention training', 'digital wellness', 'focus enhancement', 'information overload', 'mindfulness'],
    featured: false
  },
  {
    id: 'memory-enhancement-techniques-scientific-validation',
    title: 'Memory Enhancement Techniques: Scientific Validation of Classical and Modern Methods',
    excerpt: 'In-depth analysis of memory improvement techniques from ancient memory palaces to modern spaced repetition systems. Includes step-by-step implementation guides and effectiveness comparisons.',
    image: '/placeholder.svg',
    author: 'Dr. Robert Kim, Memory Researcher',
    date: 'May 25, 2025',
    readTime: '13 min read',
    category: 'Memory Training',
    tags: ['memory enhancement', 'memory palace', 'spaced repetition', 'mnemonics', 'learning techniques'],
    featured: false
  },
  {
    id: 'cognitive-assessment-tools-brain-training-measurement',
    title: 'Cognitive Assessment Tools: How to Measure Your Brain Training Progress Effectively',
    excerpt: 'Complete guide to cognitive assessment methods, from standardized tests to modern digital assessments. Learn how to track your progress and optimize your training regimen.',
    image: '/placeholder.svg',
    author: 'Dr. Anna Kowalski, Psychometrics Expert',
    date: 'May 20, 2025',
    readTime: '10 min read',
    category: 'Assessment',
    tags: ['cognitive assessment', 'progress tracking', 'psychometrics', 'brain testing', 'evaluation methods'],
    featured: false
  },
  {
    id: 'brain-training-children-developmental-considerations',
    title: 'Brain Training for Children: Developmental Considerations and Age-Appropriate Strategies',
    excerpt: 'Specialized guide for cognitive training in children and adolescents. Covers developmental neuroscience, age-appropriate exercises, and how to support healthy brain development.',
    image: '/placeholder.svg',
    author: 'Dr. Maria Gonzalez, Developmental Psychologist',
    date: 'May 15, 2025',
    readTime: '12 min read',
    category: 'Child Development',
    tags: ['child development', 'developmental neuroscience', 'age-appropriate training', 'brain development', 'educational psychology'],
    featured: false
  },
  {
    id: 'stress-anxiety-cognitive-performance-brain-training',
    title: 'Stress, Anxiety, and Cognitive Performance: How Brain Training Can Help Mental Health',
    excerpt: 'Explore the relationship between stress, anxiety, and cognitive function. Learn how targeted brain training can support mental health and improve emotional regulation.',
    image: '/placeholder.svg',
    author: 'Dr. David Lee, Clinical Psychologist',
    date: 'May 10, 2025',
    readTime: '14 min read',
    category: 'Mental Health',
    tags: ['stress management', 'anxiety', 'mental health', 'emotional regulation', 'cognitive behavioral therapy'],
    featured: false
  },
  {
    id: 'brain-training-sports-performance-cognitive-athletics',
    title: 'Brain Training for Sports Performance: Cognitive Enhancement in Athletic Training',
    excerpt: 'Discover how cognitive training enhances athletic performance. Covers reaction time, decision-making, visual processing, and mental resilience training for athletes.',
    image: '/placeholder.svg',
    author: 'Dr. Alex Johnson, Sports Psychologist',
    date: 'May 5, 2025',
    readTime: '11 min read',
    category: 'Sports Psychology',
    tags: ['sports psychology', 'athletic performance', 'reaction time', 'decision making', 'mental training'],
    featured: false
  }
];

const categories = [
  { name: 'All', count: blogPosts.length },
  { name: 'Research', count: blogPosts.filter(post => post.category === 'Research').length },
  { name: 'Neuroscience', count: blogPosts.filter(post => post.category === 'Neuroscience').length },
  { name: 'Clinical Research', count: blogPosts.filter(post => post.category === 'Clinical Research').length },
  { name: 'Aging & Health', count: blogPosts.filter(post => post.category === 'Aging & Health').length },
  { name: 'Digital Wellness', count: blogPosts.filter(post => post.category === 'Digital Wellness').length },
  { name: 'Memory Training', count: blogPosts.filter(post => post.category === 'Memory Training').length },
  { name: 'Assessment', count: blogPosts.filter(post => post.category === 'Assessment').length },
  { name: 'Child Development', count: blogPosts.filter(post => post.category === 'Child Development').length },
  { name: 'Mental Health', count: blogPosts.filter(post => post.category === 'Mental Health').length },
  { name: 'Sports Psychology', count: blogPosts.filter(post => post.category === 'Sports Psychology').length }
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
        <title>Brain Training Research & Articles | Brain Burst Arcade - Evidence-Based Cognitive Enhancement</title>
        <meta name="description" content="Comprehensive brain training research articles, cognitive enhancement guides, and evidence-based strategies. Discover the latest neuroscience research on brain training, memory improvement, focus enhancement, and cognitive development." />
        <meta name="keywords" content="brain training research, cognitive enhancement articles, neuroscience studies, memory improvement techniques, focus training methods, brain health, cognitive psychology, neuroplasticity research, brain games science, cognitive development" />
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
              <h1 className="text-3xl md:text-4xl font-bold text-white">Brain Training Research & Articles</h1>
              <p className="text-white/70">Evidence-based insights for cognitive enhancement and brain health</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-white/70">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>{blogPosts.length} Research Articles</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Weekly Updates</span>
            </div>
          </div>
        </div>

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
              Featured Research Articles
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
            {selectedCategory === 'All' ? 'All Research Articles' : `${selectedCategory} Articles`}
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

        {/* Enhanced Research Section */}
        <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Latest Research Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Evidence-Based Training</h4>
              <p className="text-white/80 text-sm">All our methods are backed by peer-reviewed neuroscience research and clinical studies.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Cognitive Transfer</h4>
              <p className="text-white/80 text-sm">Learn about the latest findings on how brain training transfers to real-world cognitive abilities.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Neuroplasticity Science</h4>
              <p className="text-white/80 text-sm">Discover how your brain changes and adapts through targeted cognitive training exercises.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Clinical Applications</h4>
              <p className="text-white/80 text-sm">Explore therapeutic applications for ADHD, aging, memory disorders, and cognitive rehabilitation.</p>
            </div>
          </div>
        </div>
        
        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="md:flex items-center justify-between">
            <div className="md:w-2/3 mb-4 md:mb-0">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Get Brain Training Research Updates</h3>
              <p className="text-white/80">Subscribe to receive the latest neuroscience research, evidence-based training tips, and cognitive enhancement insights directly in your inbox.</p>
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
              <p className="text-xs text-white/60 mt-2">No spam. Evidence-based content only. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
