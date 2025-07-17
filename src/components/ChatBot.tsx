
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  X, 
  Send,
  Bot,
  User
} from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hi! I'm your civic assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const predefinedSuggestions = [
    "What are today's active events?",
    "Show me issues in Kochi North.",
    "Where can I redeem points?",
    "How do I report a pothole?"
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content: getBotResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes("event") || input.includes("activity")) {
      return "Today you have 2 volunteer events: Beach Cleanup at Marina Beach (9 AM) and Tree Planting at Central Park (2 PM). Would you like to register for any of these?";
    } else if (input.includes("kochi") || input.includes("location")) {
      return "In Kochi North, there are currently 12 active issues: 5 potholes, 3 streetlight problems, 2 garbage collection issues, and 2 water supply concerns. Would you like to see the map view?";
    } else if (input.includes("points") || input.includes("redeem")) {
      return "You have 1,247 CIVI points! You can redeem them for metro cards (200 points), restaurant vouchers (400 points), or utility bill discounts (250 points). Check the Redeem Points page for more options.";
    } else if (input.includes("pothole") || input.includes("report")) {
      return "To report a pothole: 1) Take a photo, 2) Click 'Report Issue' on the home page, 3) Our AI will automatically detect the category and severity. You'll earn 25 CIVI points for each verified report!";
    } else if (input.includes("hello") || input.includes("hi")) {
      return "Hello! I'm here to help you navigate Civixity. You can ask me about reporting issues, finding events, redeeming points, or anything else related to civic engagement.";
    } else {
      return "I understand you're asking about civic matters. I can help you with reporting issues, finding volunteer events, redeeming CIVI points, or checking the status of reports in your area. What specific information do you need?";
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">Civic Assistant</div>
                <div className="text-xs opacity-90">Online</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.type === 'user'
                    ? 'bg-teal-500 dark:bg-cyan-500 text-white'
                    : 'bg-yellow-100 dark:bg-yellow-900/50 text-slate-900 dark:text-slate-100 border border-yellow-200 dark:border-yellow-800'
                }`}>
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && (
                      <Bot className="h-4 w-4 mt-0.5 text-slate-600 dark:text-slate-400" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm">{message.content}</div>
                      <div className={`text-xs mt-1 ${
                        message.type === 'user' 
                          ? 'text-teal-100' 
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-yellow-100 dark:bg-yellow-900/50 text-slate-900 dark:text-slate-100 border border-yellow-200 dark:border-yellow-800 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Try asking:</div>
              <div className="flex flex-wrap gap-1">
                {predefinedSuggestions.slice(0, 2).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-4">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about your city..."
                className="flex-1 bg-white dark:bg-slate-700 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatBot;
