
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Sparkles, HelpCircle, Gamepad2, Trophy } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  quickReplies?: string[];
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { icon: HelpCircle, text: "How to play?", color: "from-blue-500 to-cyan-500" },
    { icon: Gamepad2, text: "Game rules", color: "from-green-500 to-emerald-500" },
    { icon: Trophy, text: "How to earn XP?", color: "from-yellow-500 to-orange-500" },
    { icon: Sparkles, text: "Power-ups guide", color: "from-purple-500 to-pink-500" }
  ];

  const botResponses = {
    greeting: {
      text: "Hi! I'm Brain Burst Assistant! 🧠✨ I'm here to help you master all our games. What would you like to know?",
      quickReplies: ["How to play games", "Scoring system", "Power-ups", "Account help"]
    },
    howToPlay: {
      text: "Great question! 🎮 Each game has unique controls and objectives:\n\n• Memory games: Watch patterns and repeat them\n• Puzzle games: Solve challenges using logic\n• Speed games: React quickly and accurately\n• Racing games: Navigate obstacles and collect items\n\nWant details about a specific game category?",
      quickReplies: ["Memory games", "Puzzle games", "Speed games", "Racing games"]
    },
    scoring: {
      text: "Here's how scoring works! 🏆\n\n• Base points for completing games\n• Accuracy bonuses (higher % = more points)\n• Speed bonuses for quick completion\n• Streak multipliers for consecutive wins\n• XP converts to levels and unlocks rewards\n\nYour profile tracks all stats!",
      quickReplies: ["XP system", "Achievements", "Leaderboards", "Back to main"]
    },
    powerUps: {
      text: "Power-ups give you amazing advantages! ⚡\n\n• 🛡️ Shield: Protects from one mistake\n• ⚡ Speed Boost: Slows down time\n• 🎯 Accuracy Boost: Shows hints\n• 💎 Double XP: 2x experience points\n• ⏱️ Time Freeze: Pauses countdown\n\nEarn them through gameplay or buy in shop!",
      quickReplies: ["How to earn power-ups", "Shop items", "Using power-ups", "Back to main"]
    },
    memoryGames: {
      text: "Memory games test your recall abilities! 🧠\n\n• Simon Says: Repeat color sequences\n• Memory Cards: Match pairs of cards\n• Number Sequence: Find mathematical patterns\n• Pattern Match: Identify matching shapes\n\nTips: Stay focused, use power-ups wisely, and practice daily!",
      quickReplies: ["Other game types", "Memory tips", "Back to games"]
    },
    puzzleGames: {
      text: "Puzzle games challenge your problem-solving! 🧩\n\n• Logic puzzles with increasing difficulty\n• Spatial reasoning challenges\n• Pattern recognition tasks\n• Mathematical sequences\n\nTips: Take your time, think step by step, and don't rush!",
      quickReplies: ["Other game types", "Puzzle strategies", "Back to games"]
    },
    account: {
      text: "Account & Profile Help! 👤\n\n• View stats in your profile\n• Track progress and achievements\n• Customize with shop items\n• Check leaderboard rankings\n• Review game history\n\nYour data is automatically saved!",
      quickReplies: ["Profile features", "Shop items", "Achievements", "Back to main"]
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(botResponses.greeting.text, botResponses.greeting.quickReplies);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text: string, quickReplies?: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text,
        isBot: true,
        timestamp: new Date(),
        quickReplies
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      isBot: false,
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    addUserMessage(inputValue);
    const userMessage = inputValue.toLowerCase();
    
    // Simple keyword matching for responses
    if (userMessage.includes('how to play') || userMessage.includes('game rule')) {
      addBotMessage(botResponses.howToPlay.text, botResponses.howToPlay.quickReplies);
    } else if (userMessage.includes('scoring') || userMessage.includes('point') || userMessage.includes('xp')) {
      addBotMessage(botResponses.scoring.text, botResponses.scoring.quickReplies);
    } else if (userMessage.includes('power') || userMessage.includes('boost')) {
      addBotMessage(botResponses.powerUps.text, botResponses.powerUps.quickReplies);
    } else if (userMessage.includes('memory')) {
      addBotMessage(botResponses.memoryGames.text, botResponses.memoryGames.quickReplies);
    } else if (userMessage.includes('puzzle')) {
      addBotMessage(botResponses.puzzleGames.text, botResponses.puzzleGames.quickReplies);
    } else if (userMessage.includes('account') || userMessage.includes('profile')) {
      addBotMessage(botResponses.account.text, botResponses.account.quickReplies);
    } else {
      // Default helpful response
      addBotMessage(
        "I understand you're asking about: \"" + inputValue + "\"\n\nI can help you with:\n• Game instructions and strategies\n• Scoring and XP system\n• Power-ups and shop items\n• Account and profile features\n• Technical support\n\nWhat specific topic interests you?",
        ["How to play games", "Scoring system", "Power-ups", "Account help"]
      );
    }
    
    setInputValue('');
  };

  const handleQuickReply = (reply: string) => {
    addUserMessage(reply);
    
    const replyLower = reply.toLowerCase();
    if (replyLower.includes('how to play')) {
      addBotMessage(botResponses.howToPlay.text, botResponses.howToPlay.quickReplies);
    } else if (replyLower.includes('scoring')) {
      addBotMessage(botResponses.scoring.text, botResponses.scoring.quickReplies);
    } else if (replyLower.includes('power')) {
      addBotMessage(botResponses.powerUps.text, botResponses.powerUps.quickReplies);
    } else if (replyLower.includes('memory')) {
      addBotMessage(botResponses.memoryGames.text, botResponses.memoryGames.quickReplies);
    } else if (replyLower.includes('account')) {
      addBotMessage(botResponses.account.text, botResponses.account.quickReplies);
    } else {
      addBotMessage(botResponses.greeting.text, botResponses.greeting.quickReplies);
    }
  };

  const handleQuickAction = (action: string) => {
    setIsOpen(true);
    setTimeout(() => {
      handleQuickReply(action);
    }, 100);
  };

  return (
    <>
      {/* Quick Action Buttons (when chat is closed) */}
      {!isOpen && (
        <div className="fixed bottom-20 right-4 flex flex-col space-y-2 z-40">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.text)}
              className={`group bg-gradient-to-r ${action.color} text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 animate-bounce`}
              style={{ animationDelay: `${index * 200}ms` }}
              title={action.text}
            >
              <action.icon className="h-5 w-5" />
            </button>
          ))}
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-50"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 md:w-96 h-96 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex flex-col z-50 animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">Brain Burst Assistant</h3>
                <p className="text-green-400 text-xs flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  message.isBot
                    ? 'bg-white/10 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                }`}>
                  <div className="flex items-start space-x-2">
                    {message.isBot && (
                      <Bot className="h-4 w-4 mt-0.5 text-blue-400 flex-shrink-0" />
                    )}
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    {!message.isBot && (
                      <User className="h-4 w-4 mt-0.5 text-white/80 flex-shrink-0" />
                    )}
                  </div>
                  
                  {/* Quick Replies */}
                  {message.quickReplies && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white p-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-blue-400" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
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
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about the games..."
                className="flex-1 bg-white/10 text-white placeholder-white/50 px-4 py-2 rounded-xl border border-white/20 focus:outline-none focus:border-blue-400 transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-all duration-300"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
