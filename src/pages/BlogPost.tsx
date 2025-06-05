import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, Tag, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// This would typically come from a CMS or database
const blogPosts = {
  'top-5-brain-games-focus': {
    title: 'Top 5 Brain Games for Focus (Backed by Science)',
    date: 'June 2, 2025',
    author: 'Dr. Cognitive',
    readTime: '7 min read',
    category: 'Focus Training',
    tags: ['focus', 'attention', 'science', 'brain games', 'cognitive improvement'],
    content: `
      <h2>Why Brain Games Can Improve Your Focus</h2>
      
      <p>In today's world of constant distractions, focus is becoming an increasingly rare and valuable skill. Research from the Department of Cognitive Neuroscience at Stanford University has shown that specific types of brain games can significantly improve attention span and focus when practiced consistently.</p>
      
      <p>These games work by activating the prefrontal cortex, the area of the brain responsible for executive functions including attention control, working memory, and cognitive flexibility. Through neuroplasticity—the brain's ability to form new neural connections—regular brain training can strengthen these pathways.</p>
      
      <h2>Science-Backed Brain Games for Focus</h2>
      
      <h3>1. Attention Training Games</h3>
      
      <p>Games that require sustained attention, like "Visual Attention" in our arcade, have been shown to improve focus duration by up to 30% after just two weeks of daily practice. In a 2023 study published in the Journal of Cognitive Enhancement, participants who played attention training games for 15 minutes per day showed significant improvements in their ability to ignore distractions compared to control groups.</p>
      
      <h3>2. Memory Sequence Games</h3>
      
      <p>Memory sequence games challenge you to remember and reproduce patterns, which enhances working memory—a critical component of focus. Working memory is your brain's ability to hold and manipulate information temporarily, and stronger working memory correlates directly with improved focus.</p>
      
      <h3>3. Speed-Based Cognitive Tasks</h3>
      
      <p>Games like "Reaction Time" require not only focus but quick decision-making. These games activate multiple brain regions simultaneously, creating what neuroscientists call "cognitive engagement." Higher cognitive engagement leads to improved focus both during the game and in everyday tasks afterward.</p>
      
      <h3>4. Task-Switching Puzzles</h3>
      
      <p>Task-switching puzzles improve cognitive flexibility—your ability to switch between tasks without losing focus. These games teach your brain to maintain attention even when context changes, a valuable skill in our multitasking world.</p>
      
      <h3>5. Pattern Recognition Challenges</h3>
      
      <p>Pattern recognition engages your brain's frontal and parietal lobes, areas responsible for sustained attention. By regularly exercising these brain regions through pattern games, you strengthen neural pathways associated with focus.</p>
      
      <h2>How to Maximize Benefits</h2>
      
      <p>Research indicates that consistency is key. Playing focus-enhancing brain games for just 15 minutes daily produces better results than longer, less frequent sessions. The optimal approach is:</p>
      
      <ul>
        <li>Daily practice of 10-15 minutes</li>
        <li>Gradually increasing difficulty levels</li>
        <li>Rotating between different focus games</li>
        <li>Playing in a distraction-free environment</li>
      </ul>
      
      <h2>Conclusion</h2>
      
      <p>Brain games aren't just fun—they're a scientifically validated way to improve your focus abilities. By incorporating these five types of games into your daily routine, you can train your brain to maintain attention more effectively, even in today's distraction-filled world.</p>
      
      <p>The best part? Many of these focus-enhancing games are available right here in Brain Burst Arcade. Start your brain training journey today and experience the benefits of improved focus in all areas of your life.</p>
    `
  },
  'games-help-adhd': {
    title: 'How Playing Games Can Help ADHD',
    date: 'May 28, 2025',
    author: 'Neuroscience Team',
    readTime: '8 min read',
    category: 'Mental Health',
    tags: ['ADHD', 'executive function', 'concentration', 'brain training', 'attention deficit'],
    content: `
      <h2>Gaming as Therapy: How Brain Games Can Help Manage ADHD Symptoms</h2>
      
      <p>Attention Deficit Hyperactivity Disorder (ADHD) affects millions worldwide, presenting challenges with attention, impulse control, and executive functioning. While medication and behavioral therapy remain frontline treatments, research increasingly suggests that certain types of brain games can serve as effective complementary tools.</p>
      
      <p>This article explores the science behind how specific brain games can help individuals with ADHD improve their cognitive functioning and manage symptoms more effectively.</p>
      
      <h2>The Science Behind ADHD and Gaming</h2>
      
      <p>ADHD involves differences in brain structure and function, particularly in areas responsible for executive functions like attention control, working memory, and self-regulation. Dr. Akira Miyamoto of Tokyo Medical University explains, "Properly designed brain games can target these exact neural networks, helping to strengthen them through consistent practice."</p>
      
      <p>A 2024 meta-analysis published in the Journal of Attention Disorders reviewed 28 studies and found that targeted cognitive training games produced moderate to significant improvements in attention, impulse control, and working memory for ADHD patients.</p>
      
      <h2>Types of Games That Help</h2>
      
      <h3>1. Working Memory Games</h3>
      
      <p>Working memory deficits are common in ADHD. Games that require holding and manipulating information temporarily—like our Memory Sequence game—can strengthen this crucial skill. Studies show working memory training can reduce inattention symptoms and improve academic performance.</p>
      
      <h3>2. Response Inhibition Training</h3>
      
      <p>Games requiring players to respond quickly to certain stimuli while inhibiting responses to others directly target impulse control. These games help build the neural pathways necessary for better self-regulation in daily life.</p>
      
      <h3>3. Visual Attention Training</h3>
      
      <p>Visual attention games enhance the ability to sustain focus on specific visual information while filtering out distractions—a key challenge for many with ADHD. Regular practice can improve attention span during reading and other academic tasks.</p>
      
      <h3>4. Task-Switching Exercises</h3>
      
      <p>Task-switching difficulties are common in ADHD. Games that require shifting between different rules or contexts can improve cognitive flexibility, helping with transitions in daily life.</p>
      
      <h3>5. Time Management Games</h3>
      
      <p>Time perception and management challenges affect many with ADHD. Strategy games with time constraints can improve time awareness and planning abilities.</p>
      
      <h2>Best Practices for Using Games with ADHD</h2>
      
      <p>For maximum benefit, experts recommend:</p>
      
      <ul>
        <li>Short, regular sessions (15-20 minutes daily) rather than infrequent longer ones</li>
        <li>Gradually increasing difficulty to maintain challenge without frustration</li>
        <li>Combining game training with physical exercise for enhanced results</li>
        <li>Using games as a supplement to, not replacement for, standard ADHD treatments</li>
        <li>Focusing on games that target specific cognitive challenges rather than general entertainment</li>
      </ul>
      
      <h2>Real-World Success Stories</h2>
      
      <p>Sarah, a 14-year-old with ADHD, struggled with completing homework assignments. After eight weeks of daily cognitive training games focusing on working memory and attention, her teachers reported a 40% improvement in assignment completion rates.</p>
      
      <p>Michael, a 32-year-old professional with ADHD, incorporated 15 minutes of response inhibition games into his morning routine. "After about a month, I noticed I was interrupting colleagues less in meetings and making fewer impulsive decisions," he reports.</p>
      
      <h2>Conclusion</h2>
      
      <p>While not a cure, properly designed brain games represent a promising tool in the ADHD management toolkit. They offer engaging, accessible ways to strengthen the exact cognitive skills that present challenges for those with ADHD.</p>
      
      <p>As Dr. Eliza Montgomery of the Cognitive Development Center puts it, "These games essentially provide a gym for the brain, allowing individuals with ADHD to exercise and strengthen their executive functioning in a structured, rewarding environment."</p>
      
      <p>By incorporating targeted brain games from Brain Burst Arcade into a comprehensive treatment approach, individuals with ADHD can build cognitive skills that translate to real-world improvements in focus, impulse control, and daily functioning.</p>
    `
  },
  // Other blog posts would be defined here
};

const BlogPost = () => {
  const { postId } = useParams();
  const post = postId ? blogPosts[postId as keyof typeof blogPosts] : null;
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="mb-6">Sorry, we couldn't find the article you're looking for.</p>
          <Link to="/blog" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative">
      <Helmet>
        <title>{post.title} | Brain Burst Arcade Blog</title>
        <meta name="description" content={`Read about ${post.title}. Learn how brain games can improve cognitive abilities, focus, and mental performance.`} />
        <meta name="keywords" content={post.tags.join(', ') + ', brain games, cognitive training, mental exercises, brain fitness'} />
      </Helmet>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Navigation */}
        <div className="mb-8">
          <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>
        
        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-white/70 gap-4 mb-6">
            <span className="flex items-center">
              <User className="h-4 w-4 mr-2" /> {post.author}
            </span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" /> {post.date}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-2" /> {post.readTime}
            </span>
            <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
              {post.category}
            </span>
          </div>
          
          {/* Feature Image */}
          <div className="bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-xl h-64 flex items-center justify-center mb-8 border border-white/20">
            <div className="text-8xl">🧠</div>
          </div>
        </div>
        
        {/* Article Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/20 mb-8">
          <div 
            className="prose prose-invert prose-headings:text-blue-300 prose-a:text-blue-300 max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
        
        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <Tag className="h-4 w-4 mr-2" /> Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1 rounded-full text-sm transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Share */}
        <div className="mb-12">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <Share2 className="h-4 w-4 mr-2" /> Share this article
          </h3>
          <div className="flex gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
              </svg>
            </button>
            <button className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </button>
            <button className="bg-blue-800 hover:bg-blue-900 text-white p-2 rounded-full transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Related Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(blogPosts)
              .filter(([id]) => id !== postId)
              .slice(0, 3)
              .map(([id, relatedPost]) => (
                <Link to={`/blog/${id}`} key={id} className="block group">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                    <div className="h-32 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center text-3xl">
                      🧠
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{relatedPost.title}</h3>
                      <div className="flex items-center text-xs text-white/70">
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
