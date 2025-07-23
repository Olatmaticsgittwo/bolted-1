import React, { useState } from 'react';
import { ArrowLeft, Search, ChevronDown, HelpCircle } from 'lucide-react';

interface FAQProps {
  onNavigate: (page: string) => void;
}

export function FAQ({ onNavigate }: FAQProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'buying', label: 'Buying Crypto' },
    { id: 'selling', label: 'Selling Crypto' },
    { id: 'security', label: 'Security' },
    { id: 'payments', label: 'Payments' },
    { id: 'technical', label: 'Technical Issues' }
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I get started with BIANOTRADES?',
      answer: 'Getting started is easy! Simply navigate to our Buy Crypto or Sell Crypto pages, fill out the required information, and follow the step-by-step process. No account registration is required for individual transactions.'
    },
    {
      category: 'getting-started',
      question: 'Do I need to create an account?',
      answer: 'No, you don\'t need to create an account for individual transactions. We process each buy/sell order independently with the information you provide during the transaction process.'
    },
    {
      category: 'buying',
      question: 'What cryptocurrencies can I buy?',
      answer: 'We currently support Bitcoin (BTC), Ethereum (ETH), Tether (USDT), and Binance Coin (BNB). We\'re constantly working to add more cryptocurrencies to our platform.'
    },
    {
      category: 'buying',
      question: 'What is the minimum amount I can buy?',
      answer: 'The minimum purchase amount is $50 USD equivalent for any cryptocurrency. This helps us maintain efficient processing while keeping fees competitive.'
    },
    {
      category: 'buying',
      question: 'How long does it take to receive my crypto?',
      answer: 'All verified buyers will receive their purchased asset in less than 3 hours. BIANOTRADES processes all confirmed payments quickly and efficiently.'
    },
    {
      category: 'selling',
      question: 'How do I sell my cryptocurrency?',
      answer: 'Visit our Sell Crypto page, provide your details, specify the amount you want to sell, send your crypto to our provided wallet address, upload proof of transfer, and provide your payout information.'
    },
    {
      category: 'selling',
      question: 'How long does it take to receive payment for sold crypto?',
      answer: 'Sellers also receive payment within 3 hours. BIANOTRADES verifies all incoming transactions and processes payments quickly to your specified account.'
    },
    {
      category: 'selling',
      question: 'What proof of transfer do I need to provide?',
      answer: 'Please provide a clear screenshot showing the transaction hash, amount sent, destination address (our wallet), and transaction status. This helps us quickly verify and process your sell order.'
    },
    {
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept CashApp, PayPal, Wire Transfers, and Cryptocurrency payments. Choose the method that\'s most convenient for you during the checkout process.'
    },
    {
      category: 'payments',
      question: 'Do you charge any fees?',
      answer: 'We maintain transparent pricing with competitive rates. Any applicable fees are clearly displayed before you complete your transaction. We never charge hidden fees.'
    },
    {
      category: 'payments',
      question: 'Can I use international payment methods?',
      answer: 'Absolutely! We accept international wire transfers, cryptocurrency payments, and various local payment methods from customers in 190+ countries worldwide. We serve global customers with localized payment options.'
    },
    {
      category: 'security',
      question: 'How secure is BIANOTRADES?',
      answer: 'We use bank-level security measures including SSL encryption, cold storage for funds, and multi-signature wallets. Your personal information is encrypted and never shared with third parties.'
    },
    {
      category: 'security',
      question: 'How do you protect my personal information?',
      answer: 'All personal information is encrypted using industry-standard protocols. We only collect information necessary to process your transactions and comply with regulatory requirements.'
    },
    {
      category: 'security',
      question: 'What should I do if I suspect fraudulent activity?',
      answer: 'Contact our emergency support immediately at +1 (555) 123-4567 or emergency@bianotrades.com. We take security very seriously and will investigate any suspicious activity promptly.'
    },
    {
      category: 'technical',
      question: 'I sent crypto but it\'s not showing up. What should I do?',
      answer: 'First, check the transaction status on the blockchain explorer. If the transaction is confirmed but we haven\'t processed it, please contact our support team with your transaction hash.'
    },
    {
      category: 'technical',
      question: 'Can I cancel a transaction?',
      answer: 'Once a cryptocurrency transaction is sent, it cannot be reversed due to the nature of blockchain technology. Please double-check all details before confirming any transaction.'
    },
    {
      category: 'technical',
      question: 'What if I sent crypto to the wrong address?',
      answer: 'Unfortunately, cryptocurrency transactions are irreversible. Always double-check the wallet address before sending. If you sent to our old address, contact support immediately with your transaction details.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

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
          <div className="text-center">
            <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about BIANOTRADES and cryptocurrency trading.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or browse different categories.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                        openFAQ === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-4">
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Still need help?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Contact Support
            </button>
            <a
              href="mailto:support@bianotrades.com"
              className="border-2 border-blue-600 text-blue-600 font-bold py-4 px-8 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-300"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}