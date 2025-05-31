
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
    'Hello! Welcome to Brain Burst Arcade! How can I help you today?',
    'Hi there! Ready to challenge your brain with our amazing games?',
    'Welcome to the ultimate brain training experience! What would you like to know?'
  ],
  'hi': [
    'Hi there! I\'m here to help you with any questions about our games!',
    'Hello! Looking to boost your brain power today?',
    'Hey! Ready for some mind-bending challenges?'
  ],
  'help': [
    'I can help you with:\n• Game instructions and strategies\n• Account questions and progress\n• Technical issues and troubleshooting\n• Scoring system and XP calculation\n• Power-ups and shop items\n• Achievement unlocking tips',
    'Need assistance? I can explain:\n• How to play different game types\n• Tips for improving your scores\n• Understanding your profile stats\n• Using power-ups effectively\n• Navigating the interface',
    'I\'m here to help with:\n• Game rules and mechanics\n• Performance optimization tips\n• Account management\n• Reward system explanations\n• Any technical difficulties'
  ],
  'games': [
    'We have many exciting games including:\n• Memory challenges (Simon Says, Color Memory, Sequence Memory)\n• Puzzle games (Spatial Reasoning, Shape Rotator, Puzzle Blocks)\n• Speed tests (Reaction Time, Speed Typing, Math Sprint)\n• Strategy games (Tic Tac Toe, Chess-style games)\n• 3D adventures and maze runners\n• Intelligence assessments (IQ & EQ tests)',
    'Our game categories include:\n• 🧠 Memory Games - Test your recall abilities\n• 🧩 Puzzle Games - Challenge your problem-solving\n• ⚡ Speed Games - Quick reflexes and thinking\n• 🏁 Racing Games - Fast-paced action\n• 🎯 Shooting Games - Precision and accuracy\n• 🎮 Arcade Classics - Nostalgic fun\n• ♟️ Strategy Games - Deep thinking required\n• 🧪 Intelligence Tests - Measure your cognitive abilities',
    'Choose from over 100 unique games:\n• Memory training with increasing difficulty\n• Logic puzzles that adapt to your skill\n• Reaction time challenges\n• Creative problem-solving tasks\n• Pattern recognition games\n• Mathematical reasoning tests'
  ],
  'score': [
    'Your score is calculated based on:\n• Accuracy (how well you perform tasks)\n• Speed (completion time vs. target time)\n• Difficulty level multipliers\n• Perfect streaks and combo bonuses\n• Consistency across multiple attempts',
    'Scoring factors include:\n• Base points for completion\n• Accuracy percentage bonus\n• Time bonus for quick completion\n• Difficulty multiplier (Easy: 1x, Medium: 1.5x, Hard: 2x, Expert: 3x)\n• Streak bonuses for consecutive wins\n• Power-up effects',
    'To maximize your score:\n• Focus on accuracy first, speed second\n• Use power-ups strategically\n• Maintain winning streaks\n• Challenge yourself with harder difficulties\n• Practice regularly to improve baseline performance'
  ],
  'shop': [
    'In the shop you can buy:\n• Power-ups (Double XP, Time Freeze, Accuracy Boost, Error Shield)\n• Character avatars and customizations\n• Themes for the app interface\n• Special abilities and boosters\n• Unlock hints for difficult games',
    'Shop items include:\n• 💪 Power-ups for game advantages\n• 🎨 Visual themes and customizations\n• 👤 Avatar accessories and outfits\n• 🎯 Game-specific helpers and hints\n• 🚀 XP multipliers and boosters\n• 🛡️ Protective items for mistakes',
    'Spend your coins on:\n• Performance enhancers\n• Cosmetic upgrades\n• Convenience items\n• Exclusive game modes\n• Premium features and tools'
  ],
  'powerups': [
    'Power-ups give you advantages like:\n• Double XP - earn twice the experience points\n• Time Freeze - pause timers during critical moments\n• Accuracy Boost - get hints and guidance\n• Error Shield - ignore mistakes without penalties\n• Score Multiplier - increase point gains',
    'Available power-ups:\n• ⏰ Time Freeze (10 seconds of stopped time)\n• 🎯 Accuracy Boost (helpful hints appear)\n• 🛡️ Error Shield (1 mistake forgiven)\n• ⚡ Double XP (2x experience for the game)\n• 🔥 Score Multiplier (1.5x points)\n• 💡 Hint System (reveals partial solutions)',
    'Strategic power-up usage:\n• Save Time Freeze for complex puzzles\n• Use Accuracy Boost on new game types\n• Error Shield is great for high-stakes games\n• Double XP maximizes learning from practice\n• Combine multiple power-ups for best results'
  ],
  'profile': [
    'Your profile shows:\n• Total score and XP progression\n• Current level and rank status\n• Achievements earned and progress\n• Games played and completion stats\n• Playing streak and consistency\n• Detailed performance analytics',
    'Profile sections include:\n• 📊 Performance Dashboard\n• 🏆 Achievement Gallery\n• 📈 Progress Tracking\n• 🎮 Game History\n• ⭐ Skill Ratings\n• 🔥 Streak Information\n• 📅 Activity Calendar',
    'Track your improvement with:\n• Level progression and XP gains\n• Accuracy trends over time\n• Game-specific performance metrics\n• Comparative rankings\n• Personal best records\n• Achievement completion percentage'
  ],
  'mobile': [
    'Yes! Brain Burst Arcade is fully mobile responsive:\n• Touch-optimized controls for all games\n• Adaptive layouts for phones and tablets\n• Swipe gestures and tap interactions\n• Optimized performance on mobile devices\n• Full feature parity with desktop version',
    'Mobile features include:\n• 📱 Responsive design for all screen sizes\n• 👆 Touch-friendly game controls\n• 🔄 Portrait and landscape orientations\n• ⚡ Fast loading on mobile networks\n• 💾 Offline capability for some games\n• 🔔 Optional notifications for challenges',
    'Mobile optimization ensures:\n• Smooth gameplay on touchscreens\n• Readable text at all zoom levels\n• Easy navigation with thumb-friendly buttons\n• Battery-efficient performance\n• Works great on iOS and Android'
  ],
  'bugs': [
    'If you encounter any bugs:\n1. Try refreshing the page first\n2. Clear your browser cache and cookies\n3. Check your internet connection stability\n4. Disable browser extensions temporarily\n5. Try a different browser\n6. Contact support if issues persist with details',
    'Troubleshooting steps:\n1. 🔄 Hard refresh (Ctrl+F5 or Cmd+Shift+R)\n2. 🧹 Clear browser data\n3. 🌐 Test internet connection\n4. 🚫 Disable ad blockers\n5. 🔧 Update your browser\n6. 📧 Report persistent issues to support',
    'Common solutions:\n• Audio issues: Check browser sound permissions\n• Loading problems: Verify internet speed\n• Save issues: Enable local storage\n• Display problems: Update graphics drivers\n• Performance issues: Close other browser tabs'
  ],
  'contact': [
    'You can reach our support team through:\n• This chat bot for common questions\n• The review section on the homepage\n• Email: support@brainburstarcade.com\n• Social media @BrainBurstArcade\n• Community forums on our website',
    'Get help via:\n• 💬 This AI assistant (24/7 availability)\n• 📧 Email support (1-2 business days)\n• 🌟 Review system for feedback\n• 📱 Social media channels\n• 🌐 Community forums and guides',
    'Support options:\n• Instant help through this chat\n• Detailed email support\n• Community-driven solutions\n• Video tutorials and guides\n• Live help during peak hours'
  ],
  'tips': [
    'Pro tips for better gameplay:\n• Start with easier games to build confidence\n• Take breaks between intense sessions\n• Focus on accuracy before speed\n• Use power-ups strategically\n• Practice regularly for improvement\n• Review your performance stats',
    'Expert strategies:\n• 🎯 Master one game type before moving to others\n• ⏱️ Time your practice sessions (20-30 minutes ideal)\n• 📊 Analyze your performance patterns\n• 🧠 Challenge yourself gradually\n• 🎮 Mix different game types for variety\n• 🏆 Set achievable daily goals',
    'Success strategies:\n• Consistent practice beats marathon sessions\n• Learn from mistakes and failed attempts\n• Use the hint system when stuck\n• Compete with friends for motivation\n• Celebrate small improvements\n• Focus on personal progress over rankings'
  ],
  'thanks': [
    'You\'re welcome! Is there anything else I can help you with?',
    'Happy to help! Feel free to ask if you have more questions.',
    'Glad I could assist! Enjoy your brain training session!',
    'You\'re very welcome! Ready to challenge your mind?'
  ],
  'achievements': [
    'Achievements unlock based on:\n• Game completion milestones\n• Perfect score performances\n• Playing streaks and consistency\n• Trying new game types\n• Reaching score thresholds\n• Speed completion records',
    'Achievement categories:\n• 🏆 Mastery (perfect scores)\n• 🔥 Streaks (consecutive wins)\n• 🎮 Explorer (try all games)\n• ⚡ Speed Demon (fast completion)\n• 🧠 Genius (high difficulty wins)\n• 📅 Dedication (daily play)',
    'Unlock achievements by:\n• Playing different game categories\n• Maintaining daily streaks\n• Achieving high accuracy rates\n• Completing challenges quickly\n• Earning high scores consistently\n• Helping other players improve'
  ],
  'difficulty': [
    'Difficulty levels explained:\n• Easy: Great for beginners, basic mechanics\n• Medium: Moderate challenge, good for practice\n• Hard: Advanced players, complex patterns\n• Expert: Master level, maximum challenge\n• Each level offers different rewards',
    'Choose your difficulty:\n• 🟢 Easy: Learn the basics, build confidence\n• 🟡 Medium: Test your skills, balanced challenge\n• 🟠 Hard: Push your limits, advanced techniques\n• 🔴 Expert: Ultimate test, highest rewards\n• Difficulty affects XP and score multipliers',
    'Difficulty progression tips:\n• Master easy before moving up\n• Don\'t skip difficulty levels\n• Use power-ups on harder levels\n• Practice specific skills needed\n• Review mistakes to improve\n• Higher difficulty = better rewards'
  ],
  'leaderboard': [
    'Leaderboard features:\n• Global rankings by total score\n• Category-specific top players\n• Weekly and monthly competitions\n• Friend comparisons and challenges\n• Achievement showcases\n• Personal best tracking',
    'Ranking systems:\n• 🌍 Global: Compete with all players\n• 🏆 Category: Excel in specific game types\n• 📅 Seasonal: Limited-time competitions\n• 👥 Friends: Compare with connections\n• 🎯 Personal: Track your own progress',
    'Climb the rankings by:\n• Playing consistently every day\n• Mastering high-difficulty games\n• Maintaining accuracy and speed\n• Participating in special events\n• Building impressive streaks\n• Earning rare achievements'
  ],
  'default': [
    'I understand you\'re asking about that topic. Here are some helpful resources:\n• Try the help section for detailed guides\n• Check the game instructions for specific rules\n• Visit your profile for performance statistics\n• Use power-ups for better performance\n• Contact support for technical issues',
    'That\'s an interesting question! While I may not have specific information about that, I can help you with:\n• Game strategies and tips\n• Technical troubleshooting\n• Account and progress questions\n• Shop and power-up explanations\n• Performance improvement advice',
    'I\'d love to help you with that! For the most comprehensive assistance, you might want to:\n• Explore the help documentation\n• Check out community discussions\n• Try asking your question differently\n• Contact our support team for specialized help\n• Browse the FAQ section for common topics'
  ]
};

export const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Brain Burst Arcade assistant. I can help you with game strategies, technical issues, and much more! What would you like to know?',
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
    
    // Check for exact matches first
    for (const keyword in botResponses) {
      if (input === keyword) {
        const responses = botResponses[keyword];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // Check for partial matches with priority
    const keywords = Object.keys(botResponses);
    const matches = keywords.filter(keyword => 
      input.includes(keyword) || keyword.includes(input)
    );
    
    if (matches.length > 0) {
      // Prioritize longer matches
      const bestMatch = matches.reduce((a, b) => a.length > b.length ? a : b);
      const responses = botResponses[bestMatch];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Special handling for common question patterns
    if (input.includes('how') && (input.includes('play') || input.includes('work'))) {
      const responses = botResponses['help'];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('what') && input.includes('game')) {
      const responses = botResponses['games'];
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

    // Simulate bot thinking time with variation
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
    }, 800 + Math.random() * 1200); // 0.8-2.0 seconds delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 h-[500px] md:h-[600px] bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl z-50 flex flex-col animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-white/20 bg-white/5 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm md:text-base">AI Assistant</h3>
            <p className="text-white/70 text-xs">Online</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="h-4 w-4 md:h-5 md:w-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-2 ${
              message.isBot ? 'justify-start' : 'justify-end'
            }`}
          >
            {message.isBot && (
              <div className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <Bot className="h-3 w-3 text-white" />
              </div>
            )}
            <div
              className={`max-w-[75%] p-2 md:p-3 rounded-2xl ${
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
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <Bot className="h-3 w-3 text-white" />
            </div>
            <div className="bg-white/10 p-2 md:p-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/60 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 md:p-4 border-t border-white/20">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 px-2 md:px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs md:text-sm"
            maxLength={300}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300 hover:scale-105"
          >
            <Send className="h-3 w-3 md:h-4 md:w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
