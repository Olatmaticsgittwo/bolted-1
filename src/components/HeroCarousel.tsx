import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Shield, Zap } from 'lucide-react';

interface HeroCarouselProps {
  onNavigate: (page: string) => void;
}

export function HeroCarousel({ onNavigate }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Trade Crypto with Confidence",
      subtitle: "Your Gateway to Digital Assets",
      description: "Buy and sell Bitcoin, Ethereum, USDT, BNB, and Solana with bank-level security and instant processing.",
      image: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      gradient: "from-blue-900 via-purple-900 to-indigo-900",
      cta: { text: "Start Trading", action: "buy" }
    },
    {
      id: 2,
      title: "Secure Cryptocurrency Exchange",
      subtitle: "Professional Trading Platform",
      description: "Join thousands of traders who trust BIANOTRADES for secure, fast, and reliable crypto transactions.",
      image: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      gradient: "from-green-900 via-blue-900 to-purple-900",
      cta: { text: "Learn More", action: "about" }
    },
    {
      id: 3,
      title: "Multiple Payment Methods",
      subtitle: "Flexible & Convenient",
      description: "Pay with credit cards, CashApp, PayPal, wire transfers, or cryptocurrency. Choose what works for you.",
      image: "https://images.pexels.com/photos/5980856/pexels-photo-5980856.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      gradient: "from-orange-900 via-red-900 to-pink-900",
      cta: { text: "View Methods", action: "buy" }
    },
    {
      id: 4,
      title: "24/7 Customer Support",
      subtitle: "We're Always Here",
      description: "Get instant help from our expert team. Live chat, email, and phone support available around the clock.",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      gradient: "from-teal-900 via-cyan-900 to-blue-900",
      cta: { text: "Get Support", action: "contact" }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-105'
          }`}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-85`}></div>
          </div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                  <div className="mb-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      {slide.subtitle}
                    </span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white">
                    {slide.title.split(' ').map((word, i) => (
                      <span
                        key={i}
                        className="inline-block animate-fadeInUp"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      >
                        {word}{' '}
                      </span>
                    ))}
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
                    {slide.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fadeInUp" style={{ animationDelay: '1s' }}>
                    <button
                      onClick={() => onNavigate(slide.cta.action)}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
                    >
                      {slide.cta.text}
                      <TrendingUp className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onNavigate('sell')}
                      className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold py-4 px-8 rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                    >
                      Sell Crypto
                    </button>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 gap-6 animate-fadeInUp" style={{ animationDelay: '1.2s' }}>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <Shield className="h-12 w-12 text-green-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Bank-Level Security</h3>
                    <p className="text-blue-100">Your funds are protected with military-grade encryption and cold storage.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <Zap className="h-12 w-12 text-yellow-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Instant Processing</h3>
                    <p className="text-blue-100">Complete your trades in minutes with our optimized system.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}