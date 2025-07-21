import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

export function LoadingScreen() {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [showDots, setShowDots] = useState(false);
  const [showSubtext, setShowSubtext] = useState(false);
  const companyName = "BIANOTRADES";

  useEffect(() => {
    // Animate letters appearing one by one
    const letterTimer = setInterval(() => {
      setVisibleLetters(prev => {
        if (prev < companyName.length) {
          return prev + 1;
        } else {
          clearInterval(letterTimer);
          setShowDots(true);
          setTimeout(() => setShowSubtext(true), 500);
          return prev;
        }
      });
    }, 120);

    return () => clearInterval(letterTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
        <div className="absolute top-3/4 right-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-3000"></div>
      </div>

      {/* Floating crypto symbols */}
      <div className="absolute inset-0 overflow-hidden">
        {['₿', 'Ξ', '₮', 'Ⓑ'].map((symbol, index) => (
          <div
            key={index}
            className="absolute text-white/10 text-6xl font-bold animate-bounce"
            style={{
              left: `${20 + index * 20}%`,
              top: `${30 + index * 15}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: '3s'
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      <div className="text-center z-10 relative">
        {/* Logo with enhanced animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <TrendingUp className="h-20 w-20 text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
          </div>
        </div>

        {/* Company name with enhanced letter animation */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-8xl font-bold text-white tracking-wider mb-4">
            {companyName.split('').map((letter, index) => (
              <span
                key={index}
                className={`inline-block transition-all duration-700 ${
                  index < visibleLetters
                    ? 'opacity-100 transform translate-y-0 scale-100'
                    : 'opacity-0 transform translate-y-8 scale-75'
                }`}
                style={{
                  transitionDelay: `${index * 120}ms`,
                  textShadow: '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(147, 51, 234, 0.4)'
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
          
          <div className={`transition-all duration-1000 ${
            showSubtext ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}>
            <p className="text-xl md:text-3xl text-blue-200 mb-2 font-light">
              Your Trusted Crypto Trading Platform
            </p>
            <p className="text-lg md:text-xl text-purple-200 font-light">
              Secure • Fast • Professional
            </p>
          </div>
        </div>

        {/* Enhanced loading animation */}
        {showDots && (
          <div className="flex justify-center space-x-3 mb-8">
            {[0, 1, 2, 3, 4].map(index => (
              <div
                key={index}
                className="relative"
              >
                <div
                  className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    animationDuration: '1.4s'
                  }}
                ></div>
                <div
                  className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 animate-ping"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    animationDuration: '2s'
                  }}
                ></div>
              </div>
            ))}
          </div>
        )}

        {/* Progress bar */}
        {showDots && (
          <div className="w-64 mx-auto">
            <div className="bg-white/20 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-full rounded-full animate-pulse" 
                   style={{ width: '75%', transition: 'width 2s ease-in-out' }}>
              </div>
            </div>
            <p className="text-blue-200 text-sm mt-3 animate-pulse">Loading your crypto experience...</p>
          </div>
        )}
      </div>
    </div>
  );
}