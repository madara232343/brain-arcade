
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
    'Welcome to the ultimate brain training experience! What would you like to know?',
    'Greetings! I\'m here to assist you with your brain training journey!',
    'Hello and welcome! Looking forward to helping you master these brain games!'
  ],
  'hi': [
    'Hi there! I\'m here to help you with any questions about our games!',
    'Hello! Looking to boost your brain power today?',
    'Hey! Ready for some mind-bending challenges?',
    'Hi! Welcome to Brain Burst Arcade - your cognitive training headquarters!',
    'Hey there! What brain challenge can I help you with today?'
  ],
  'creator': [
    'Brain Burst Arcade was created by Dhwanil Raval, a passionate developer who wanted to make brain training fun and accessible for everyone!',
    'This amazing platform was developed by Dhwanil Raval with the vision of combining entertainment with cognitive enhancement.',
    'Dhwanil Raval is the mastermind behind Brain Burst Arcade - bringing you the best in brain training technology!'
  ],
  'developer': [
    'Brain Burst Arcade was developed by Dhwanil Raval, who put incredible effort into creating this comprehensive brain training platform.',
    'The developer behind this fantastic brain training experience is Dhwanil Raval - a true innovator in cognitive gaming!',
    'Dhwanil Raval developed this entire platform to help people improve their cognitive abilities through engaging games.'
  ],
  'made': [
    'Brain Burst Arcade was made by Dhwanil Raval, combining cutting-edge technology with proven cognitive training methods.',
    'This platform was crafted by Dhwanil Raval to provide the ultimate brain training experience.',
    'Dhwanil Raval made Brain Burst Arcade to revolutionize how we approach mental fitness and cognitive enhancement.'
  ],
  'who': [
    'If you\'re asking about the creator, Brain Burst Arcade was built by Dhwanil Raval - a visionary developer passionate about cognitive enhancement!',
    'The brilliant mind behind Brain Burst Arcade is Dhwanil Raval, who designed every aspect to maximize your brain training potential.',
    'Dhwanil Raval is the creator who brought this incredible brain training platform to life!'
  ],
  'help': [
    'I can help you with:\n• Game instructions and strategies\n• Account questions and progress\n• Technical issues and troubleshooting\n• Scoring system and XP calculation\n• Power-ups and shop items\n• Achievement unlocking tips',
    'Need assistance? I can explain:\n• How to play different game types\n• Tips for improving your scores\n• Understanding your profile stats\n• Using power-ups effectively\n• Navigating the interface',
    'I\'m here to help with:\n• Game rules and mechanics\n• Performance optimization tips\n• Account management\n• Reward system explanations\n• Any technical difficulties',
    'My assistance covers:\n• Detailed game walkthroughs\n• Strategy tips for high scores\n• Profile and progress tracking\n• Shop and power-up guidance\n• Technical support and troubleshooting'
  ],
  'games': [
    'We have 50+ unique games including:\n• Memory challenges (Simon Says, Color Memory, Pattern Match)\n• Math games (Math Sprint, Quick Math, Number Sequences)\n• Puzzle games (Brain Teasers, Logic Puzzles, Spatial Reasoning)\n• Word games (Word Association, Word Chain, Speed Typing)\n• Reaction games (Reaction Time, Visual Attention)\n• Strategy games (Tic Tac Toe, Chess-style games)\n• 3D adventures (Maze Runner, Tower Builder, Orbit Navigator)\n• Intelligence tests (IQ & EQ assessments)',
    'Our diverse game library features:\n• 🧠 Memory Games - Test recall and pattern recognition\n• 🔢 Math Games - Sharpen arithmetic and logic skills\n• 🧩 Puzzle Games - Challenge problem-solving abilities\n• 📝 Word Games - Enhance vocabulary and language skills\n• ⚡ Speed Games - Improve reaction time and processing\n• 🎯 Strategy Games - Develop tactical thinking\n• 🌐 3D Games - Spatial awareness and navigation\n• 🎓 Intelligence Tests - Comprehensive cognitive assessment',
    'Choose from our extensive collection:\n• Memory training with progressive difficulty\n• Mathematical reasoning and quick calculations\n• Logic puzzles that adapt to your skill level\n• Creative word and language challenges\n• Fast-paced reaction and attention games\n• Strategic thinking and planning exercises\n• Immersive 3D spatial challenges\n• Professional-grade intelligence assessments'
  ],
  'score': [
    'Your score is calculated based on:\n• Accuracy (correctness of your responses)\n• Speed (completion time vs optimal time)\n• Difficulty level multipliers\n• Perfect streaks and combo bonuses\n• Consistency across multiple attempts\n• Power-up effects and bonuses',
    'Scoring factors include:\n• Base points for task completion\n• Accuracy percentage bonus (up to 100%)\n• Time bonus for quick completion\n• Difficulty multipliers (Easy: 1x, Medium: 1.5x, Hard: 2x, Expert: 3x)\n• Streak bonuses for consecutive perfect scores\n• Special achievement bonuses',
    'To maximize your score:\n• Focus on accuracy first, then speed\n• Use power-ups strategically\n• Maintain winning streaks\n• Challenge yourself with harder difficulties\n• Practice regularly to improve baseline performance\n• Complete daily challenges for bonus points'
  ],
  'thanks': [
    'You\'re welcome! Is there anything else I can help you with?',
    'Happy to help! Feel free to ask if you have more questions.',
    'Glad I could assist! Enjoy your brain training session!',
    'You\'re very welcome! Ready to challenge your mind?',
    'My pleasure! Let me know if you need any other assistance.',
    'Always here to help! Good luck with your cognitive training!'
  ],
  'default': [
    'I understand you\'re asking about that topic. Here are some helpful resources:\n• Try the help section for detailed guides\n• Check the game instructions for specific rules\n• Visit your profile for performance statistics\n• Use power-ups for better performance\n• Contact support for technical issues',
    'That\'s an interesting question! While I may not have specific information about that, I can help you with:\n• Game strategies and tips\n• Technical troubleshooting\n• Account and progress questions\n• Shop and power-up explanations\n• Performance improvement advice',
    'I\'d love to help you with that! For comprehensive assistance, you might want to:\n• Explore the help documentation\n• Check out community discussions\n• Try asking your question differently\n• Browse the game-specific tutorials\n• Contact our support team for specialized help',
    'While I might not have the exact answer, I\'m here to help with:\n• Gameplay mechanics and strategies\n• Account management and progress\n• Technical issues and solutions\n• Performance optimization tips\n• General platform navigation'
  ]
};

export const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Brain Burst Arcade assistant. I can help you with game strategies, technical issues, and answer questions about our platform created by Dhwanil Raval. What would you like to know?',
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
    
    // Check for creator/developer questions first
    if (input.includes('created') || input.includes('creator') || 
        input.includes('who made') || input.includes('who built') ||
        input.includes('dhwanil') || input.includes('raval')) {
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
    
    if (input.includes('who') && (input.includes('created') || input.includes('made') || 
        input.includes('developed') || input.includes('built'))) {
      const responses = botResponses['who'];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Check for exact matches
    for (const keyword in botResponses) {
      if (input === keyword) {
        const responses = botResponses[keyword];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // Check for partial matches
    const keywords = Object.keys(botResponses);
    const matches = keywords.filter(keyword => 
      input.includes(keyword) || keyword.includes(input)
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
    <div className="fixed inset-0 md:inset-auto md:bottom-4 md:right-4 md:w-80 lg:w-96 md:h-[500px] lg:h-[600px] bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg md:rounded-2xl border border-white/30 shadow-2xl z-50 flex flex-col animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-white/20 bg-white/5 md:rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm md:text-base">AI Assistant</h3>
            <p className="text-white/70 text-xs">Online • Created by Dhwanil Raval</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-target"
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
              className={`max-w-[85%] md:max-w-[75%] p-2 md:p-3 rounded-2xl ${
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
      <div className="p-3 md:p-4 border-t border-white/20 bg-white/5">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 px-2 md:px-3 py-2 md:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
            maxLength={300}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="p-2 md:p-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300 hover:scale-105 touch-target"
          >
            <Send className="h-3 w-3 md:h-4 md:w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
