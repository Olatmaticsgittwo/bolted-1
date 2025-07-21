import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { LoadingScreen } from './components/LoadingScreen';
import { Homepage } from './pages/Homepage';
import { BuyCrypto } from './pages/BuyCrypto';
import { SellCrypto } from './pages/SellCrypto';
import { AboutUs } from './pages/AboutUs';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { WalletAddresses } from './pages/WalletAddresses';
import { Footer } from './components/Footer';
import { CookieConsent } from './components/CookieConsent';
import { ChatBot } from './components/ChatBot';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Show loading screen for 5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Homepage onNavigate={setCurrentPage} />;
      case 'buy':
        return <BuyCrypto onNavigate={setCurrentPage} />;
      case 'sell':
        return <SellCrypto onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutUs onNavigate={setCurrentPage} />;
      case 'contact':
        return <Contact onNavigate={setCurrentPage} />;
      case 'faq':
        return <FAQ onNavigate={setCurrentPage} />;
      case 'wallet':
        return <WalletAddresses onNavigate={setCurrentPage} />;
      case 'trading':
      case 'portfolio':
      case 'careers':
      case 'blog':
      case 'press':
      case 'status':
      case 'security':
      case 'privacy':
      case 'terms':
      case 'licenses':
        // For now, redirect to contact for these pages
        return <Contact onNavigate={setCurrentPage} />;
      default:
        return <Homepage onNavigate={setCurrentPage} />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="pt-16">
        {renderPage()}
        <Footer onNavigate={setCurrentPage} />
        <ChatBot />
        <CookieConsent />
      </main>
    </div>
  );
}

export default App;