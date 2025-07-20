import React, { useState, useEffect } from 'react';

export function LoadingScreen() {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [showDots, setShowDots] = useState(false);
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
          return prev;
        }
      });
    }, 150);

    return () => clearInterval(letterTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="text-center z-10">
        {/* Company name with letter animation */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-wider">
            {companyName.split('').map((letter, index) => (
              <span
                key={index}
                className={`inline-block transition-all duration-500 ${
                  index < visibleLetters
                    ? 'opacity-100 transform translate-y-0'
                    : 'opacity-0 transform translate-y-8'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                  textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
          <p className={`text-xl md:text-2xl text-blue-200 mt-4 transition-opacity duration-1000 ${
            showDots ? 'opacity-100' : 'opacity-0'
          }`}>
            Your Trusted Crypto Trading Platform
          </p>
        </div>

        {/* Loading dots */}
        {showDots && (
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map(index => (
              <div
                key={index}
                className="w-4 h-4 bg-blue-400 rounded-full animate-bounce"
                style={{
                  animationDelay: `${index * 0.3}s`,
                  animationDuration: '1.4s'
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}