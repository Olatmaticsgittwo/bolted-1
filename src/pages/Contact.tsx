import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { submitContactMessage } from '../services/contactService';

interface ContactProps {
  onNavigate: (page: string) => void;
}

export function Contact({ onNavigate }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmitMessage();
  };

  const handleSubmitMessage = async () => {
    try {
      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting contact message:', error);
      alert('Failed to submit message. Please try again.');
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      info: 'bianotrades@hotmail.com',
      description: 'Send us an email anytime'
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Phone',
      info: '+1 (555) 123-4567',
      description: '24/7 customer support'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Address',
      info: 'Bianotrades Inc, 158 Market Street, Suite 437, San Francisco, CA 94047, United States',
      description: 'Our headquarters'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Business Hours',
      info: '24/7 Available',
      description: 'We never sleep'
    }
  ];

  const faqItems = [
    {
      question: 'How long does it take to process transactions?',
      answer: 'Buy orders are typically processed within 30 minutes to 1 hour. Sell orders are verified and processed within 24 hours.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept CashApp, PayPal, Wire Transfers, and Cryptocurrency payments.'
    },
    {
      question: 'Is my money safe with BIANOTRADES?',
      answer: 'Yes, we use bank-level security measures and store funds in cold storage wallets for maximum security.'
    },
    {
      question: 'Do you charge any fees?',
      answer: 'We maintain transparent pricing with competitive rates. All fees are clearly displayed before you complete any transaction.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Get in touch with our team. We're here to help you with all your cryptocurrency trading needs.
          </p>
        </div>
      </div>

      {/* Contact Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-blue-600 font-semibold mb-1">{info.info}</p>
                <p className="text-sm text-gray-600">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Chatbot Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="trading">Trading Questions</option>
                      <option value="account">Account Issues</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    Send Message <Send className="h-5 w-5" />
                  </button>
                </form>
              )}
            </div>

            {/* Live Chat and FAQ */}
            <div className="space-y-8">
              {/* Live Chat Widget */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Live Chat Support</h3>
                  <p className="text-gray-600 mb-6">
                    Need immediate help? Start a live chat with our global support team available 24/7 worldwide.
                  </p>
                  <button className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300">
                    Start Chat Now
                  </button>
                </div>
              </div>

              {/* Quick FAQ */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Answers</h3>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <details key={index} className="group">
                      <summary className="flex justify-between items-center font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                        {item.question}
                        <span className="ml-2 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="mt-3 text-gray-600 text-sm">{item.answer}</p>
                    </details>
                  ))}
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => onNavigate('faq')}
                    className="text-blue-600 font-semibold hover:text-blue-800"
                  >
                    View all FAQs →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-red-900 mb-4">Emergency Support</h2>
          <p className="text-red-700 mb-6">
            If you're experiencing urgent issues with your account or transactions, please contact us immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:bianotrades@hotmail.com"
              className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Email: bianotrades@hotmail.com
            </a>
            <a
              href="https://instagram.com/bianotrades"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-red-600 text-red-600 font-bold py-3 px-6 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-300"
            >
              Instagram @bianotrades
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}