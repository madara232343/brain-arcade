
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

const botResponses: { [key: string]: string } = {
  'hello': 'Hello! Welcome to Brain Burst Arcade! How can I help you today?',
  'hi': 'Hi there! I\'m here to help you with any questions about our games!',
  'help': 'I can help you with:\n• Game instructions\n• Account questions\n• Technical issues\n• Scoring system\n• Power-ups and shop items',
  'games': 'We have many exciting games including:\n• Memory games\n• Puzzle challenges\n• 3D adventures\n• Speed tests\n• IQ assessment\n• And much more!',
  'score': 'Your score is calculated based on:\n• Accuracy (how well you perform)\n• Speed (how quickly you complete tasks)\n• Difficulty level\n• Perfect streaks and bonuses',
  'shop': 'In the shop you can buy:\n• Power-ups (Double XP, Time Freeze, etc.)\n• Character avatars\n• Themes for the app\n• Special abilities',
  'powerups': 'Power-ups give you advantages like:\n• Double XP - earn twice the experience\n• Time Freeze - pause timers\n• Accuracy Boost - get hints\n• Error Shield - ignore mistakes',
  'profile': 'Your profile shows:\n• Total score and XP\n• Current level and rank\n• Achievements earned\n• Games played\n• Playing streak',
  'mobile': 'Yes! Brain Burst Arcade is fully mobile responsive. You can play all games on your phone or tablet.',
  'bugs': 'If you encounter any bugs:\n1. Try refreshing the page\n2. Clear your browser cache\n3. Check your internet connection\n4. Contact support if issues persist',
  'contact': 'You can reach our support team through:\n• The review section on the homepage\n• This chat bot for common questions\n• Email: support@brainburstarcade.com',
  'thanks': 'You\'re welcome! Is there anything else I can help you with?',
  'default': 'I understand you\'re asking about that topic. Here are some helpful resources:\n• Try the help section\n• Check the game instructions\n• Visit your profile for statistics\n• Use power-ups for better performance!'
};

export const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Brain Burst Arcade assistant. How can I help you today?',
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
    if (botResponses[input]) {
      return botResponses[input];
    }
    
    // Check for partial matches
    for (const keyword in botResponses) {
      if (input.includes(keyword)) {
        return botResponses[keyword];
      }
    }
    
    // Default response
    return botResponses['default'];
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

    // Simulate bot thinking time
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
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 h-96 bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl z-50 flex flex-col animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/5 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="h-6 w-6 text-purple-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-white font-bold">AI Assistant</h3>
            <p className="text-white/70 text-xs">Online</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
              className={`max-w-[70%] p-3 rounded-2xl ${
                message.isBot
                  ? 'bg-white/10 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
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
            <div className="bg-white/10 p-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/20">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            maxLength={200}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300 hover:scale-105"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
