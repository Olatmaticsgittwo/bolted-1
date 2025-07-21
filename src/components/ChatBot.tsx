import React, { useState } from 'react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm Bianca from BIANOTRADES. How can I help you with your crypto trading today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const botResponses = {
    greeting: [
      "Hello! Welcome to BIANOTRADES. I'm Bianca, your crypto trading assistant.",
      "Hi there! I'm Bianca from BIANOTRADES. Ready to help with your crypto needs!",
      "Welcome to BIANOTRADES! I'm Bianca, here to assist you."
    ],
    buy: [
      "Great choice! BIANOTRADES makes buying crypto simple and secure. You can purchase Bitcoin, Ethereum, USDT, and BNB with multiple payment methods including credit cards, CashApp, PayPal, and wire transfers.",
      "To buy crypto on BIANOTRADES, just click 'Buy Crypto' and follow our simple 3-step process. We support BTC, ETH, USDT, and BNB with instant processing!"
    ],
    sell: [
      "Selling crypto on BIANOTRADES is easy! We accept Bitcoin, Ethereum, USDT, and BNB. Just upload your transaction proof and we'll process your payment within 24 hours.",
      "Ready to sell? BIANOTRADES offers competitive rates for BTC, ETH, USDT, and BNB. Our secure process ensures you get paid quickly and safely."
    ],
    security: [
      "Security is our top priority at BIANOTRADES. We use bank-level encryption, cold storage for funds, and multi-signature wallets to keep your assets safe.",
      "BIANOTRADES employs military-grade security measures including SSL encryption, PCI compliance, and SOC 2 certification to protect your transactions."
    ],
    fees: [
      "BIANOTRADES maintains transparent pricing with competitive rates. All fees are clearly displayed before you complete any transaction - no hidden charges!",
      "We believe in transparency at BIANOTRADES. Our competitive fees are always shown upfront, so you know exactly what you're paying."
    ],
    support: [
      "BIANOTRADES offers 24/7 customer support. You can contact us through this chat, email support@bianotrades.com, or call +1 (555) 123-4567.",
      "Need help? BIANOTRADES support team is available around the clock. We're here via chat, email, or phone whenever you need assistance."
    ],
    default: [
      "I'm here to help with any BIANOTRADES questions! You can ask about buying crypto, selling crypto, security, fees, or our services.",
      "Thanks for reaching out! As your BIANOTRADES assistant, I can help with trading questions, account issues, or general crypto information.",
      "How can I assist you with BIANOTRADES today? I'm here to help with all your crypto trading needs!"
    ]
  };

  const getResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
    }
    if (lowerInput.includes('buy') || lowerInput.includes('purchase')) {
      return botResponses.buy[Math.floor(Math.random() * botResponses.buy.length)];
    }
    if (lowerInput.includes('sell')) {
      return botResponses.sell[Math.floor(Math.random() * botResponses.sell.length)];
    }
    if (lowerInput.includes('security') || lowerInput.includes('safe') || lowerInput.includes('secure')) {
      return botResponses.security[Math.floor(Math.random() * botResponses.security.length)];
    }
    if (lowerInput.includes('fee') || lowerInput.includes('cost') || lowerInput.includes('price')) {
      return botResponses.fees[Math.floor(Math.random() * botResponses.fees.length)];
    }
    if (lowerInput.includes('support') || lowerInput.includes('help') || lowerInput.includes('contact')) {
      return botResponses.support[Math.floor(Math.random() * botResponses.support.length)];
    }
    
    return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: getResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 ${
          isOpen ? 'hidden' : 'block'
        }`}
      >
        <MessageCircle className="h-6 w-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Bianca</h3>
                <p className="text-sm opacity-90">BIANOTRADES Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${
                  message.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isBot 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {message.isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-white/70'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about BIANOTRADES..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}