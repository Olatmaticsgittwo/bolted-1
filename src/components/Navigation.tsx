import React, { useState } from 'react';
import { Menu, X, TrendingUp, ChevronDown } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navItems = [
    {
      id: 'products',
      label: 'Products',
      hasDropdown: true,
      items: [
        { id: 'buy', label: 'Buy Crypto', description: 'Purchase cryptocurrencies instantly' },
        { id: 'sell', label: 'Sell Crypto', description: 'Convert crypto to cash' },
        { id: 'trading', label: 'Trading API', description: 'Advanced trading tools' },
        { id: 'wallet', label: 'Wallet', description: 'Secure crypto storage' },
        { id: 'portfolio', label: 'Portfolio', description: 'Track your investments' }
      ]
    },
    {
      id: 'company',
      label: 'Company',
      hasDropdown: true,
      items: [
        { id: 'about', label: 'About Us', description: 'Learn about BIANOTRADES' },
        { id: 'careers', label: 'Careers', description: 'Join our team' },
        { id: 'blog', label: 'Blog', description: 'Latest crypto insights' },
        { id: 'press', label: 'Press', description: 'Media resources' }
      ]
    },
    {
      id: 'support',
      label: 'Support',
      hasDropdown: true,
      items: [
        { id: 'contact', label: 'Contact Us', description: 'Get in touch' },
        { id: 'faq', label: 'Help Center', description: 'Find answers' },
        { id: 'complaints', label: 'File Complaint', description: 'Report issues' },
        { id: 'status', label: 'Status', description: 'System status' },
        { id: 'security', label: 'Security', description: 'Security measures' }
      ]
    },
    {
      id: 'legal',
      label: 'Legal',
      hasDropdown: true,
      items: [
        { id: 'privacy', label: 'Privacy Policy', description: 'Data protection' },
        { id: 'terms', label: 'Terms of Service', description: 'Usage terms' },
        { id: 'licenses', label: 'Licenses', description: 'Legal compliance' }
      ]
    }
  ];

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleDropdownToggle = (itemId: string) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with Animation */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <div className="relative">
              <TrendingUp className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-300 group-hover:scale-110 transform" />
              <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
              BIANOTRADES
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => item.hasDropdown ? handleDropdownToggle(item.id) : handleNavClick(item.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === item.id || activeDropdown === item.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                      activeDropdown === item.id ? 'rotate-180' : ''
                    }`} />
                  )}
                </button>

                {/* Dropdown Menu */}
                {item.hasDropdown && activeDropdown === item.id && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    {item.items?.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleNavClick(subItem.id)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 group"
                      >
                        <div className="font-medium text-gray-900 group-hover:text-blue-600">
                          {subItem.label}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {subItem.description}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => handleNavClick('buy')}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Buy Crypto
            </button>
            <button
              onClick={() => handleNavClick('sell')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Sell Crypto
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              {navItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => item.hasDropdown ? handleDropdownToggle(item.id) : handleNavClick(item.id)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      currentPage === item.id || activeDropdown === item.id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === item.id ? 'rotate-180' : ''
                      }`} />
                    )}
                  </button>
                  
                  {item.hasDropdown && activeDropdown === item.id && (
                    <div className="ml-4 mt-2 space-y-1">
                      {item.items?.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleNavClick(subItem.id)}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile CTA Buttons */}
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => handleNavClick('buy')}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg font-semibold"
                >
                  Buy Crypto
                </button>
                <button
                  onClick={() => handleNavClick('sell')}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg font-semibold"
                >
                  Sell Crypto
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for dropdowns */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </nav>
  );
}