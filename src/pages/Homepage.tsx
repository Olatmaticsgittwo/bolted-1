import React from 'react';
import { ArrowRight, Shield, Zap, Users, Star, ChevronRight } from 'lucide-react';
import { CryptoIcon } from '../components/CryptoIcon';
import { CryptoRates } from '../components/CryptoRates';
import { TrustIndicators } from '../components/TrustIndicators';
import { SEOHead } from '../components/SEOHead';

interface HomepageProps {
  onNavigate: (page: string) => void;
}

export function Homepage({ onNavigate }: HomepageProps) {
  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
    { symbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
    { symbol: 'USDT', name: 'Tether', color: '#26A17B' },
    { symbol: 'BNB', name: 'Binance', color: '#F3BA2F' },
    { symbol: 'ADA', name: 'Cardano', color: '#0D1E30' },
    { symbol: 'DOT', name: 'Polkadot', color: '#E6007A' },
  ];

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Bank-Level Security',
      description: 'Your funds and data are protected with military-grade encryption and cold storage.'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Instant Transactions',
      description: 'Execute trades in seconds with our high-performance trading engine.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: '24/7 Support',
      description: 'Our expert team is available around the clock to assist you.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      text: 'BIANOTRADES made crypto trading simple and secure. Highly recommended!'
    },
    {
      name: 'Michael Chen',
      rating: 5,
      text: 'Fast transactions and excellent customer support. My go-to platform.'
    },
    {
      name: 'Emma Davis',
      rating: 5,
      text: 'User-friendly interface and competitive rates. Perfect for beginners.'
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Trade Crypto with
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {" "}Confidence
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                Buy and sell cryptocurrencies safely and efficiently with BIANOTRADES. 
                Multiple payment methods, instant transfers, and 24/7 support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => onNavigate('buy')}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Buy Crypto <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onNavigate('sell')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Sell Crypto <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Animated Crypto Icons */}
            <div className="grid grid-cols-3 gap-8 justify-items-center">
              {cryptos.map((crypto, index) => (
                <div
                  key={crypto.symbol}
                  className="transform transition-all duration-1000"
                  style={{
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <CryptoIcon
                    symbol={crypto.symbol}
                    name={crypto.name}
                    color={crypto.color}
                    animationType={index % 3 === 0 ? 'spin' : index % 3 === 1 ? 'bounce' : 'pulse'}
                    size="lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Live Crypto Rates */}
          <div className="mb-16">
            <CryptoRates />
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BIANOTRADES?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide a secure, fast, and user-friendly platform for all your cryptocurrency needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Multiple Payment Options
            </h2>
            <p className="text-xl text-gray-600">
              Choose the payment method that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'CashApp', color: 'bg-green-500' },
              { name: 'Crypto Wallet', color: 'bg-orange-500' },
              { name: 'Wire Transfer', color: 'bg-blue-500' },
              { name: 'PayPal', color: 'bg-indigo-500' }
            ].map((method, index) => (
              <div
                key={index}
                className={`${method.color} text-white p-6 rounded-xl text-center transform hover:scale-105 transition-all duration-300`}
              >
                <h3 className="font-bold text-lg">{method.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <TrustIndicators />
      </section>

      {/* Customer Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust BIANOTRADES for their crypto needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('buy')}
              className="bg-white text-blue-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Get Started <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}