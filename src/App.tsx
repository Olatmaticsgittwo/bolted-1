import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SignUp } from './components/Auth/SignUp';
import { UserDashboard } from './components/Dashboard/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Navigation } from './components/Navigation';
import { LoadingScreen } from './components/LoadingScreen';
import { Homepage } from './pages/Homepage';
import { BuyCrypto } from './pages/BuyCrypto';
import { SellCrypto } from './pages/SellCrypto';
import { AboutUs } from './pages/AboutUs';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { WalletAddresses } from './pages/WalletAddresses';
import { Complaints } from './pages/Complaints';
import { Footer } from './components/Footer';
import { CookieConsent } from './components/CookieConsent';
import { ChatBot } from './components/ChatBot';

function AppContent() {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Show loading screen for 5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading while auth is initializing
  if (loading) {
    return <LoadingScreen />;
  }

  // Show signup/login if not authenticated
  if (!user && currentPage !== 'home' && currentPage !== 'about' && currentPage !== 'contact' && currentPage !== 'faq' && currentPage !== 'wallet' && currentPage !== 'complaints') {
    return <SignUp onSuccess={() => setCurrentPage('dashboard')} />;
  }

  // Show user dashboard if authenticated and on dashboard page
  if (user && currentPage === 'dashboard') {
    return <UserDashboard />;
  }

  // Show admin dashboard for admin user
  if (user?.email === 'bianotrades@hotmail.com' && currentPage === 'admin') {
    return <AdminDashboard />;
  }

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
      case 'complaints':
        return <Complaints onNavigate={setCurrentPage} />;
      case 'dashboard':
        return user ? <UserDashboard /> : <SignUp onSuccess={() => setCurrentPage('dashboard')} />;
      case 'admin':
        return user?.email === 'bianotrades@hotmail.com' ? <AdminDashboard /> : <Homepage onNavigate={setCurrentPage} />;
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
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} user={user} />
      <main className="pt-16">
        {renderPage()}
        <Footer onNavigate={setCurrentPage} />
        <ChatBot />
        <CookieConsent />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;