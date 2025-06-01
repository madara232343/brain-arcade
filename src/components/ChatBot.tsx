
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const botResponses: { [key: string]: string[] } = {
  'hello': [
    'Hello! Welcome to Brain Burst Arcade! I\'m here to help you with this amazing platform created by Raval Dhwanil. How can I assist you today?',
    'Hi there! Ready to challenge your brain with our amazing games? This incredible platform was developed by Raval Dhwanil!',
    'Welcome to the ultimate brain training experience created by Raval Dhwanil! What would you like to know?',
    'Greetings! I\'m here to assist you with your brain training journey on this platform built by Raval Dhwanil!',
    'Hello and welcome! Looking forward to helping you master these brain games on Raval Dhwanil\'s amazing platform!'
  ],
  'hi': [
    'Hi there! I\'m here to help you with any questions about our games on this platform created by Raval Dhwanil!',
    'Hello! Looking to boost your brain power today on Raval Dhwanil\'s amazing platform?',
    'Hey! Ready for some mind-bending challenges? This platform was developed by the talented Raval Dhwanil!',
    'Hi! Welcome to Brain Burst Arcade - your cognitive training headquarters, created by Raval Dhwanil!',
    'Hey there! What brain challenge can I help you with today on this fantastic platform by Raval Dhwanil?'
  ],
  'creator': [
    'Brain Burst Arcade was created by Raval Dhwanil, a passionate and innovative developer who wanted to make brain training fun and accessible for everyone! He put incredible effort into designing every aspect of this platform.',
    'This amazing platform was developed by Raval Dhwanil with the vision of combining entertainment with cognitive enhancement. He\'s truly a visionary in the field of brain training technology!',
    'Raval Dhwanil is the brilliant mastermind behind Brain Burst Arcade - bringing you the best in brain training technology! His dedication to creating engaging cognitive games is truly remarkable.'
  ],
  'developer': [
    'Brain Burst Arcade was developed by Raval Dhwanil, who put incredible effort and expertise into creating this comprehensive brain training platform. His programming skills and vision made this possible!',
    'The developer behind this fantastic brain training experience is Raval Dhwanil - a true innovator in cognitive gaming and web development!',
    'Raval Dhwanil developed this entire platform from scratch to help people improve their cognitive abilities through engaging games. His technical expertise shines through every feature!'
  ],
  'made': [
    'Brain Burst Arcade was made by Raval Dhwanil, combining cutting-edge technology with proven cognitive training methods. His attention to detail and user experience is exceptional!',
    'This platform was carefully crafted by Raval Dhwanil to provide the ultimate brain training experience. Every game and feature was thoughtfully designed!',
    'Raval Dhwanil made Brain Burst Arcade to revolutionize how we approach mental fitness and cognitive enhancement. His innovative approach sets this platform apart!'
  ],
  'who': [
    'If you\'re asking about the creator, Brain Burst Arcade was built by Raval Dhwanil - a visionary developer passionate about cognitive enhancement and creating engaging user experiences!',
    'The brilliant mind behind Brain Burst Arcade is Raval Dhwanil, who designed every aspect to maximize your brain training potential. His expertise in both development and UX is evident!',
    'Raval Dhwanil is the talented creator who brought this incredible brain training platform to life! His dedication to quality and innovation is truly inspiring.'
  ],
  'built': [
    'Brain Burst Arcade was built by Raval Dhwanil using modern web technologies and a deep understanding of cognitive science principles!',
    'This platform was built from the ground up by Raval Dhwanil, who combined his programming expertise with research-backed brain training methodologies!',
    'Raval Dhwanil built this entire ecosystem to provide comprehensive brain training in an engaging, gamified format!'
  ],
  'help': [
    'I can help you with:\n• Game instructions and strategies for all 50+ unique games\n• Account questions and progress tracking\n• Technical issues and troubleshooting\n• Scoring system and XP calculation details\n• Power-ups and shop items usage\n• Achievement unlocking tips and strategies\n• Mobile responsiveness and touch controls\n• Understanding different game categories and mechanics',
    'Need assistance? I can explain:\n• How to play different game types (Memory, Puzzle, Speed, etc.)\n• Tips for improving your scores and accuracy\n• Understanding your profile stats and progress\n• Using power-ups effectively in games\n• Navigating the mobile-friendly interface\n• Shop items and their benefits\n• Daily challenges and streak bonuses',
    'I\'m here to help with:\n• Detailed game rules and mechanics\n• Performance optimization tips for better scores\n• Account management and profile customization\n• Reward system and achievement explanations\n• Any technical difficulties or bugs\n• Mobile gaming tips and tricks\n• Strategy guides for specific game types',
    'My assistance covers:\n• Comprehensive game walkthroughs for all categories\n• Strategy tips for achieving high scores\n• Profile and progress tracking explanations\n• Shop and power-up guidance and recommendations\n• Technical support and troubleshooting\n• Mobile optimization and touch controls\n• Understanding the leveling and XP system'
  ],
  'games': [
    'We have 50+ unique games across 8 categories:\n\n🧠 Memory Games:\n• Memory Sequence - Progressive color patterns\n• Color Memory - Advanced pattern recognition\n• Simon Says - Classic sequence repetition\n• Memory Cards - Flip and match pairs\n• Number Memory - Sequence recall challenges\n\n🔢 Math Games:\n• Math Sprint - Fast arithmetic challenges\n• Quick Math - Rapid calculation tests\n• Number Sequences - Pattern recognition\n\n🧩 Puzzle Games:\n• Brain Teasers - Logic problems\n• Sudoku - 4x4 number puzzles\n• Logic Puzzles - Reasoning challenges\n• Spatial Reasoning - 3D thinking\n\n📝 Word Games:\n• Word Scramble - Unscramble letters\n• Word Association - Connect concepts\n• Word Chain - Link related words\n• Speed Typing - Improve typing skills\n\n⚡ Speed Games:\n• Reaction Time - Lightning-fast responses\n• Visual Attention - Spot differences\n\n🏎️ Racing Games:\n• Space Racer - Navigate through space obstacles\n\n🎯 Shooting Games:\n• Bubble Shooter - Match colored bubbles\n\n🕹️ Arcade Games:\n• Snake Game - Classic arcade action\n• Tetris - Block-stacking puzzle\n\n♟️ Strategy Games:\n• Chess - Classic board game\n• Tic Tac Toe - Strategic placement\n\n🎓 Intelligence Tests:\n• IQ Test - Comprehensive cognitive assessment\n• EQ Test - Emotional intelligence evaluation',
    'Our diverse game library features unique mechanics:\n\n• 🧠 Memory Training - Progressive difficulty with visual and auditory challenges\n• 🔢 Mathematical Reasoning - From basic arithmetic to complex problem-solving\n• 🧩 Logic Puzzles - Adaptive difficulty based on performance\n• 📝 Language Skills - Vocabulary, typing, and word association\n• ⚡ Reaction Training - Improve processing speed and attention\n• 🎮 Strategic Thinking - Chess-like games and tactical challenges\n• 🌐 Spatial Awareness - 3D navigation and visualization\n• 🎓 Cognitive Assessment - Professional-grade intelligence testing\n\nEach game is fully responsive and works perfectly on both mobile and desktop!',
    'Choose from our extensive collection of brain training games:\n\n• Memory games with progressive difficulty and power-up integration\n• Math games ranging from simple arithmetic to complex calculations\n• Puzzle games that adapt to your skill level with hint systems\n• Word games that enhance vocabulary and language processing\n• Speed games for improving reaction time and visual processing\n• Strategy games that develop tactical thinking and planning\n• Arcade games with classic gameplay and modern features\n• Intelligence tests for comprehensive cognitive evaluation\n\nAll games feature mobile-optimized controls, power-up integration, and detailed scoring systems!'
  ],
  'score': [
    'Your score is calculated using multiple factors:\n\n📊 Base Scoring:\n• Accuracy percentage (0-100%)\n• Speed bonus for quick completion\n• Difficulty multipliers (Easy: 1x, Medium: 1.5x, Hard: 2x, Expert: 3x)\n\n🎯 Bonus Systems:\n• Perfect streaks and combo bonuses\n• Power-up effectiveness multipliers\n• Time-based performance bonuses\n• Consistency across multiple attempts\n\n💎 Power-up Effects:\n• Double XP Boost - 2x experience points\n• Time Freeze - Extra time for completion\n• Accuracy Boost - Hints for better performance\n• Error Shield - Protection from mistakes\n\n🏆 Achievement Bonuses:\n• Special milestone rewards\n• Category mastery bonuses\n• Daily challenge completions',
    'Scoring system breakdown:\n\n• Base points for task completion (varies by game)\n• Accuracy percentage bonus (up to 100% extra)\n• Speed completion bonus (faster = higher score)\n• Difficulty multipliers increase rewards significantly\n• Streak bonuses for consecutive perfect scores\n• Power-up bonuses when items are used effectively\n• Achievement bonuses for reaching milestones\n• Mobile optimization ensures fair scoring across devices',
    'To maximize your score:\n\n💡 Strategy Tips:\n• Focus on accuracy first, then improve speed\n• Use power-ups strategically (save for difficult levels)\n• Maintain winning streaks for bonus multipliers\n• Challenge yourself with harder difficulties\n• Practice regularly to improve baseline performance\n• Complete daily challenges for bonus points\n• Purchase helpful items from the shop\n• Play on the device you\'re most comfortable with\n\n🎮 Game-Specific Tips:\n• Memory games: Use visualization techniques\n• Math games: Practice mental arithmetic\n• Puzzle games: Take time to think before acting\n• Speed games: Stay relaxed and focused'
  ],
  'powerups': [
    'Power-ups available in the shop:\n\n⚡ Double XP Boost (100 coins)\n• Earn 2x XP for the next 5 games\n• Perfect for leveling up quickly\n• Stack with other bonuses\n\n⏱️ Time Freeze (150 coins)\n• Stop the timer for 10 seconds in timed games\n• Great for difficult levels\n• Can be activated mid-game\n\n🎯 Accuracy Boost (120 coins)\n• Get hints in pattern and memory games\n• Reveals next correct move\n• Perfect for learning new strategies\n\n🛡️ Error Shield (80 coins)\n• Protect against one wrong answer\n• Ideal for high-stakes games\n• Automatically activates when needed\n\nAll power-ups are fully integrated into gameplay and work on both mobile and desktop!'
  ],
  'shop': [
    'The Brain Shop offers amazing items:\n\n💰 Power-ups:\n• Double XP Boost - 100 coins\n• Time Freeze - 150 coins\n• Accuracy Boost - 120 coins\n• Error Shield - 80 coins\n\n🎭 Characters:\n• Cyber Brain - 500 coins\n• Brain Wizard - 750 coins\n• Mad Scientist - 600 coins\n\n🎨 Themes:\n• Neon Nights - 300 coins\n• Forest Calm - 250 coins\n• Cosmic Explorer - 400 coins\n• Ocean Depths - 350 coins\n• Phoenix Flame - 380 coins\n\nEarn coins by playing games and achieving high scores! All purchased items are saved to your account and can be used across all games.'
  ],
  'mobile': [
    'Mobile gaming features:\n\n📱 Responsive Design:\n• All games work perfectly on phones and tablets\n• Touch-optimized controls for every game type\n• Adaptive layouts for different screen sizes\n• Gesture support for intuitive gameplay\n\n🎮 Mobile-Specific Features:\n• Touch and drag controls for Space Racer\n• Tap-to-select for memory games\n• Swipe gestures for puzzle games\n• Virtual keyboards for word games\n\n⚡ Performance:\n• Smooth 60fps gameplay on modern devices\n• Optimized graphics for mobile GPUs\n• Efficient battery usage\n• Quick loading times\n\n🎯 Same Features:\n• Full power-up integration\n• Complete shop functionality\n• All achievements available\n• Cloud save progress sync'
  ],
  'responsive': [
    'Brain Burst Arcade is fully responsive:\n\n📱 Mobile (320px+):\n• Optimized layouts for small screens\n• Touch-friendly button sizes\n• Swipe navigation\n• Compact game interfaces\n\n📲 Tablet (768px+):\n• Enhanced touch controls\n• Larger game areas\n• Split-screen friendly\n• Landscape mode support\n\n💻 Desktop (1024px+):\n• Full-sized interfaces\n• Keyboard shortcuts\n• Hover effects\n• Multi-monitor support\n\n🔄 Adaptive Features:\n• Dynamic font scaling\n• Flexible grid layouts\n• Context-aware controls\n• Progressive enhancement'
  ],
  'achievements': [
    'Unlock amazing achievements:\n\n🏆 Beginner Achievements:\n• First Game - Play your first game\n• Quick Learner - Complete 5 games\n• Persistent Player - Play for 3 days straight\n\n🌟 Intermediate Achievements:\n• Score Hunter - Reach 1000 total score\n• Memory Master - Perfect score in memory game\n• Speed Demon - Complete speed game in under 30s\n\n💎 Advanced Achievements:\n• Brain Surgeon - 95%+ accuracy in 10 games\n• Combo King - 5-game winning streak\n• Category Master - Excel in all game types\n\n🏅 Legendary Achievements:\n• Perfectionist - 100% accuracy in 50 games\n• Time Lord - Complete 100 timed games\n• Ultimate Brain - Reach max level in all categories\n\nEach achievement gives XP bonuses and bragging rights!'
  ],
  'thanks': [
    'You\'re welcome! Is there anything else I can help you with regarding this amazing platform created by Raval Dhwanil?',
    'Happy to help! Feel free to ask if you have more questions about the games or features!',
    'Glad I could assist! Enjoy your brain training session on Raval Dhwanil\'s fantastic platform!',
    'You\'re very welcome! Ready to challenge your mind with more games?',
    'My pleasure! Let me know if you need any other assistance with the platform.',
    'Always here to help! Good luck with your cognitive training on Brain Burst Arcade!'
  ],
  'bug': [
    'If you\'re experiencing bugs or issues:\n\n🔧 Quick Fixes:\n• Refresh the page/app\n• Clear browser cache\n• Check internet connection\n• Try a different browser\n\n📱 Mobile Issues:\n• Ensure you have enough free storage\n• Close other apps to free memory\n• Try landscape/portrait mode\n• Update your browser\n\n🎮 Game-Specific Issues:\n• Some games require keyboard (use virtual keyboard)\n• Touch games work best with clean screen\n• Audio issues? Check device volume\n\n💬 Report Issues:\n• Describe what happened\n• Include device/browser info\n• Mention which game\n• I\'ll help troubleshoot!\n\nRaval Dhwanil built this platform with extensive testing, but if you find issues, please let me know!'
  ],
  'default': [
    'That\'s an interesting question! While I may not have specific information about that topic, I can help you with:\n\n🎮 Game-related questions\n• Strategies and tips for all 50+ games\n• Understanding scoring and progression\n• Mobile gameplay optimization\n\n🛍️ Shop and Power-ups\n• Item descriptions and costs\n• Best power-up combinations\n• Earning more coins\n\n📊 Progress and Stats\n• Understanding your performance\n• Achievement requirements\n• Leveling system explanation\n\n🔧 Technical Support\n• Troubleshooting issues\n• Mobile responsiveness\n• Performance optimization\n\nRemember, this amazing platform was created by Raval Dhwanil with attention to every detail! What specific aspect would you like to know more about?',
    'I\'d love to help you with that! For comprehensive assistance with Brain Burst Arcade (created by Raval Dhwanil), you might want to:\n\n• Ask about specific games and their mechanics\n• Learn about power-ups and shop items\n• Get tips for improving your scores\n• Understand the mobile gaming features\n• Explore the achievement system\n• Get help with technical issues\n\nFeel free to rephrase your question or ask about any of these topics!',
    'While I might not have the exact answer to that specific question, I\'m here to help with everything related to Brain Burst Arcade:\n\n🧠 All about the games and strategies\n💰 Shop items and power-up usage\n📱 Mobile gaming optimization\n🏆 Achievements and progression\n🔧 Technical support and troubleshooting\n📊 Understanding your stats and performance\n\nThis platform was lovingly crafted by Raval Dhwanil to provide the best brain training experience. What would you like to explore?'
  ]
};

export const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Brain Burst Arcade assistant! This amazing brain training platform was created by Raval Dhwanil, a talented developer passionate about cognitive enhancement. I can help you with game strategies, technical issues, shop items, achievements, and much more! What would you like to know?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase().trim();
    
    // Creator/developer questions (highest priority)
    if (input.includes('created') || input.includes('creator')) {
      const responses = botResponses['creator'];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('developed') || input.includes('developer')) {
      const responses = botResponses['developer'];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('made') || input.includes('maker')) {
      const responses = botResponses['made'];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('built') || input.includes('builder')) {
      const responses = botResponses['built'];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('who') && (input.includes('created') || input.includes('made') || input.includes('developed') || input.includes('built'))) {
      const responses = botResponses['who'];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Feature-specific questions
    if (input.includes('power') && input.includes('up')) {
      const responses = botResponses['powerups'];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('shop') || input.includes('buy') || input.includes('purchase')) {
      const responses = botResponses['shop'];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('mobile') || input.includes('phone') || input.includes('tablet')) {
      const responses = botResponses['mobile'];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('responsive') || input.includes('screen') || input.includes('layout')) {
      const responses = botResponses['responsive'];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('achievement') || input.includes('unlock') || input.includes('badge')) {
      const responses = botResponses['achievements'];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('bug') || input.includes('error') || input.includes('problem') || input.includes('issue')) {
      const responses = botResponses['bug'];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Exact matches
    for (const keyword in botResponses) {
      if (input === keyword) {
        const responses = botResponses[keyword];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // Partial matches
    const keywords = Object.keys(botResponses);
    const matches = keywords.filter(keyword => 
      input.includes(keyword) || keyword.includes(input.split(' ')[0])
    );
    
    if (matches.length > 0) {
      const bestMatch = matches.reduce((a, b) => a.length > b.length ? a : b);
      const responses = botResponses[bestMatch];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Default response
    const responses = botResponses['default'];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-2 md:bottom-4 right-2 md:right-4 w-[calc(100vw-16px)] max-w-sm md:w-80 lg:w-96 h-[calc(100vh-100px)] max-h-[500px] md:max-h-[600px] bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg rounded-xl md:rounded-2xl border border-white/30 shadow-2xl z-50 flex flex-col animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between p-2 md:p-3 lg:p-4 border-b border-white/20 bg-white/5 rounded-t-xl md:rounded-t-2xl">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="relative">
            <Bot className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-purple-400" />
            <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-white font-bold text-xs md:text-sm lg:text-base">AI Assistant</h3>
            <p className="text-white/70 text-xs">Online</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 md:p-1.5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="h-4 w-4 md:h-5 md:w-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 md:p-3 lg:p-4 space-y-2 md:space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-1 md:space-x-2 ${
              message.isBot ? 'justify-start' : 'justify-end'
            }`}
          >
            {message.isBot && (
              <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <Bot className="h-2.5 w-2.5 md:h-3 md:w-3 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] md:max-w-[75%] p-2 md:p-3 rounded-xl md:rounded-2xl ${
                message.isBot
                  ? 'bg-white/10 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              }`}
            >
              <p className="text-xs md:text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {!message.isBot && (
              <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-2.5 w-2.5 md:h-3 md:w-3 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start space-x-1 md:space-x-2">
            <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <Bot className="h-2.5 w-2.5 md:h-3 md:w-3 text-white" />
            </div>
            <div className="bg-white/10 p-2 md:p-3 rounded-xl md:rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 lg:w-2 lg:h-2 bg-white/60 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 lg:w-2 lg:h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 lg:w-2 lg:h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 md:p-3 lg:p-4 border-t border-white/20">
        <div className="flex space-x-1 md:space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 px-2 md:px-3 py-1.5 md:py-2 bg-white/10 border border-white/20 rounded-lg md:rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs md:text-sm"
            maxLength={300}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="p-1.5 md:p-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg md:rounded-xl transition-all duration-300 hover:scale-105"
          >
            <Send className="h-3 w-3 md:h-4 md:w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
