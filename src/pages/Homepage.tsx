import React from 'react';
import { ArrowRight, Shield, Zap, Users, Star, ChevronRight, Award, Globe, Clock, DollarSign, TrendingUp, Smartphone, CreditCard, Building } from 'lucide-react';
import { HeroCarousel } from '../components/HeroCarousel';
import { CryptoRates } from '../components/CryptoRates';
import { TrustIndicators } from '../components/TrustIndicators';
import { SEOHead } from '../components/SEOHead';
import { ScrollAnimation, FloatingElements } from '../components/ScrollAnimations';

interface HomepageProps {
  onNavigate: (page: string) => void;
}

export function Homepage({ onNavigate }: HomepageProps) {
  const features = [
    {
      icon: <Shield className="h-12 w-12" />,
      title: 'Bank-Level Security',
      description: 'Your funds and data are protected with military-grade encryption, cold storage, and multi-signature wallets.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Zap className="h-12 w-12" />,
      title: 'Lightning Fast',
      description: 'Execute trades in seconds with our high-performance engine. Buy orders processed within 30 minutes.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: '24/7 Expert Support',
      description: 'Our professional team is available around the clock via live chat, email, and phone support.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Award className="h-12 w-12" />,
      title: 'Industry Leading',
      description: 'Trusted by 50,000+ customers with $100M+ in trading volume and 99.9% uptime reliability.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Globe className="h-12 w-12" />,
      title: 'Global Reach',
      description: 'Serving customers worldwide with multiple payment methods and currencies. Available 24/7.',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: <Clock className="h-12 w-12" />,
      title: 'Instant Processing',
      description: 'Real-time transaction processing with immediate confirmations and transparent fee structure.',
      color: 'from-red-500 to-pink-500'
    }
  ];

  const paymentMethods = [
    { 
      name: 'Credit/Debit Cards', 
      icon: <CreditCard className="h-8 w-8" />,
      description: 'Instant payments via Stripe',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    { 
      name: 'CashApp', 
      icon: <Smartphone className="h-8 w-8" />,
      description: 'Quick mobile payments',
      color: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    { 
      name: 'PayPal', 
      icon: <DollarSign className="h-8 w-8" />,
      description: 'Secure online payments',
      color: 'bg-gradient-to-r from-indigo-500 to-purple-600'
    },
    { 
      name: 'Wire Transfer', 
      icon: <Building className="h-8 w-8" />,
      description: 'Traditional bank transfers',
      color: 'bg-gradient-to-r from-orange-500 to-red-500'
    },
    { 
      name: 'Cryptocurrency', 
      icon: <TrendingUp className="h-8 w-8" />,
      description: 'Pay with your crypto wallet',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Crypto Investor',
      rating: 5,
      text: 'BIANOTRADES made crypto trading simple and secure. The platform is professional and the support team is incredibly helpful. Highly recommended!',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
    },
    {
      name: 'Michael Chen',
      role: 'Day Trader',
      rating: 5,
      text: 'Fast transactions and excellent customer support. The real-time prices and instant processing make this my go-to platform for crypto trading.',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
    },
    {
      name: 'Emma Davis',
      role: 'Business Owner',
      rating: 5,
      text: 'User-friendly interface and competitive rates. Perfect for beginners and experienced traders alike. The security features give me peace of mind.',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
    },
    {
      name: 'David Rodriguez',
      role: 'Tech Entrepreneur',
      rating: 5,
      text: 'The multiple payment options and instant processing are game-changers. BIANOTRADES has revolutionized how I handle crypto transactions.',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Active Users', icon: <Users className="h-8 w-8" /> },
    { number: '$100M+', label: 'Trading Volume', icon: <TrendingUp className="h-8 w-8" /> },
    { number: '99.9%', label: 'Uptime', icon: <Shield className="h-8 w-8" /> },
    { number: '24/7', label: 'Support', icon: <Clock className="h-8 w-8" /> }
  ];

  return (
    <div className="min-h-screen relative">
      <SEOHead />
      <FloatingElements />
      
      {/* Hero Carousel Section */}
      <HeroCarousel onNavigate={onNavigate} />

      {/* Stats Section */}
      <ScrollAnimation animation="fadeInUp">
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by Thousands</h2>
              <p className="text-xl text-blue-100">Join the revolution in cryptocurrency trading</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <ScrollAnimation key={index} animation="scaleIn" delay={index * 200}>
                  <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <div className="text-blue-300 mb-4 flex justify-center">
                      {stat.icon}
                    </div>
                    <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                    <div className="text-blue-100 font-medium">{stat.label}</div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Live Crypto Rates Section */}
      <ScrollAnimation animation="fadeInUp">
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CryptoRates />
          </div>
        </section>
      </ScrollAnimation>

      {/* Features Section */}
      <ScrollAnimation animation="fadeInUp">
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose BIANOTRADES?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We provide a secure, fast, and user-friendly platform for all your cryptocurrency needs with industry-leading features.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <ScrollAnimation key={index} animation="fadeInUp" delay={index * 100}>
                  <div className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Payment Methods Section */}
      <ScrollAnimation animation="fadeInUp">
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Global Payment Options - Worldwide Access
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Trade crypto from anywhere in the world! We support global payment methods and serve customers in 190+ countries.
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {paymentMethods.map((method, index) => (
                <ScrollAnimation key={index} animation="scaleIn" delay={index * 100}>
                  <div className={`${method.color} text-white p-6 rounded-2xl text-center transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
                    <div className="flex justify-center mb-4">
                      {method.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{method.name}</h3>
                    <p className="text-sm opacity-90">{method.description}</p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 max-w-2xl mx-auto">
                <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Minimum Order: $500 USD</h3>
                <p className="text-gray-600">All cryptocurrency transactions require a minimum order of $500 USD equivalent for optimal processing and security.</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Trust Indicators */}
      <ScrollAnimation animation="fadeInUp">
        <TrustIndicators />
      </ScrollAnimation>

      {/* Customer Testimonials */}
      <ScrollAnimation animation="fadeInUp">
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-600">
                Join thousands of satisfied customers who trust BIANOTRADES
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {testimonials.map((testimonial, index) => (
                <ScrollAnimation key={index} animation="fadeInUp" delay={index * 150}>
                  <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                    <div className="flex items-center mb-6">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full mr-4 object-cover shadow-md"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 italic leading-relaxed">"{testimonial.text}"</p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimation>

      <ScrollAnimation animation="fadeInUp">
        <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border-2 border-green-200">
              <div className="flex items-center justify-center mb-6">
                <Clock className="h-12 w-12 text-green-600 mr-4" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Lightning Fast Delivery
                </h2>
              </div>
              <div className="text-xl md:text-2xl text-gray-700 font-semibold mb-4">
                <span className="text-green-600">All verified buyers</span> will receive their purchased asset in <span className="text-blue-600">less than 3 hours</span>.
              </div>
              <div className="text-xl md:text-2xl text-gray-700 font-semibold">
                <span className="text-orange-600">Sellers</span> also receive payment within the <span className="text-purple-600">same timeframe</span>.
              </div>
              <div className="mt-6 flex items-center justify-center text-gray-600">
                <Shield className="h-6 w-6 mr-2" />
                <span>Guaranteed by BIANOTRADES</span>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* CTA Section */}
      <ScrollAnimation animation="fadeInUp">
        <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Ready to Start Trading?
            </h2>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-blue-100">
              Join BIANOTRADES today and experience the future of cryptocurrency trading with professional-grade security and lightning-fast processing.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => onNavigate('buy')}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3 text-lg"
              >
                Start Trading Now <ChevronRight className="h-6 w-6" />
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold py-6 px-12 rounded-2xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 text-lg"
              >
                Contact Support
              </button>
            </div>
          </div>
        </section>
      </ScrollAnimation>
    </div>
  );
}