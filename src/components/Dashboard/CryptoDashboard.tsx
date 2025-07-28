import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  Home, 
  ShoppingCart, 
  TrendingDown, 
  RefreshCw, 
  History, 
  Wallet, 
  MapPin, 
  ArrowUp, 
  Settings, 
  User, 
  Shield, 
  HelpCircle,
  Moon,
  Sun,
  Copy,
  Download,
  Share,
  Send,
  Plus,
  Minus,
  DollarSign,
  Bitcoin,
  Coins
} from 'lucide-react';
import { CryptoRates } from '../CryptoRates';
import { StripePayment } from '../StripePayment';
import { fetchCryptoPrices, CryptoPrice } from '../../services/cryptoService';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  kyc_status: 'pending' | 'approved' | 'denied';
  tier: 'basic' | 'advanced';
  btc_balance: number;
  eth_balance: number;
  usdt_balance: number;
  usd_balance: number;
  avatar_url?: string;
}

interface Transaction {
  id: string;
  type: string;
  coin: string;
  amount: number;
  usd_amount: number;
  status: string;
  created_at: string;
  fee_amount?: number;
}

interface WalletAddress {
  id: string;
  coin: string;
  network: string;
  address: string;
  qr_code?: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export function CryptoDashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Buy/Sell/Convert states
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [convertAmount, setConvertAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [sellRecipient, setSellRecipient] = useState('bianotrades');
  const [friendWalletAddress, setFriendWalletAddress] = useState('');
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');

  // KYC states
  const [kycData, setKycData] = useState({
    fullName: '',
    selfieFile: null as File | null
  });

  // Support ticket states
  const [ticketData, setTicketData] = useState({
    subject: '',
    message: ''
  });

  const supportedCryptos = [
    { symbol: 'BTC', name: 'Bitcoin', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
    { symbol: 'ETH', name: 'Ethereum', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { symbol: 'USDT', name: 'Tether', logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
    { symbol: 'BNB', name: 'Binance Coin', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
    { symbol: 'ADA', name: 'Cardano', logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
    { symbol: 'SOL', name: 'Solana', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
    { symbol: 'DOT', name: 'Polkadot', logo: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png' },
    { symbol: 'MATIC', name: 'Polygon', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
    { symbol: 'AVAX', name: 'Avalanche', logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png' },
    { symbol: 'LINK', name: 'Chainlink', logo: 'https://cryptologos.cc/logos/chainlink-link-logo.png' }
  ];

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchCryptoData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch transactions
      const { data: transactionsData } = await supabase
        .from('user_transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      setTransactions(transactionsData || []);

      // Fetch wallet addresses
      const { data: walletsData } = await supabase
        .from('wallet_addresses')
        .select('*')
        .order('coin');

      setWalletAddresses(walletsData || []);

      // Fetch support tickets
      const { data: ticketsData } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      setSupportTickets(ticketsData || []);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCryptoData = async () => {
    try {
      const prices = await fetchCryptoPrices();
      setCryptoPrices(prices);
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
    }
  };

  const getCryptoPrice = (symbol: string): number => {
    const crypto = cryptoPrices.find(c => c.symbol === symbol);
    return crypto?.current_price || 0;
  };

  const calculateCryptoAmount = (usdAmount: string, cryptoSymbol: string): number => {
    const price = getCryptoPrice(cryptoSymbol);
    return price > 0 ? parseFloat(usdAmount) / price : 0;
  };

  const getTotalBalance = (): number => {
    if (!profile) return 0;
    return profile.usd_balance + 
           (profile.btc_balance * getCryptoPrice('BTC')) + 
           (profile.eth_balance * getCryptoPrice('ETH')) + 
           (profile.usdt_balance * getCryptoPrice('USDT'));
  };

  const handleBuyCrypto = async () => {
    if (!buyAmount || !selectedCrypto) return;

    try {
      const usdAmount = parseFloat(buyAmount);
      const cryptoAmount = calculateCryptoAmount(buyAmount, selectedCrypto);
      const platformFee = usdAmount * 0.05; // 5% fee
      const netAmount = usdAmount - platformFee;
      const netCryptoAmount = netAmount / getCryptoPrice(selectedCrypto);

      // Create transaction record
      const { data: transaction } = await supabase
        .from('user_transactions')
        .insert({
          user_id: user?.id,
          type: 'buy',
          coin: selectedCrypto,
          amount: netCryptoAmount,
          usd_amount: usdAmount,
          status: 'pending',
          payment_method: 'stripe',
          fee_amount: platformFee
        })
        .select()
        .single();

      // Proceed with Stripe payment
      // This would integrate with your StripePayment component
      alert(`Buy order created! Transaction ID: ${transaction.id}`);
      setBuyAmount('');
      
    } catch (error) {
      console.error('Error creating buy order:', error);
      alert('Failed to create buy order');
    }
  };

  const handleSellCrypto = async () => {
    if (!sellAmount || !selectedCrypto) return;

    try {
      const cryptoAmount = parseFloat(sellAmount);
      const usdValue = cryptoAmount * getCryptoPrice(selectedCrypto);
      
      // Check if user has enough balance
      const currentBalance = profile?.[`${selectedCrypto.toLowerCase()}_balance` as keyof UserProfile] as number || 0;
      if (cryptoAmount > currentBalance) {
        alert('Insufficient balance');
        return;
      }

      if (sellRecipient === 'bianotrades') {
        // Sell to Bianotrades
        const { error } = await supabase
          .from('user_transactions')
          .insert({
            user_id: user?.id,
            type: 'sell',
            coin: selectedCrypto,
            amount: cryptoAmount,
            usd_amount: usdValue,
            status: 'pending',
            payment_method: 'platform'
          });

        if (!error) {
          // Update user balance
          const balanceField = `${selectedCrypto.toLowerCase()}_balance`;
          await supabase
            .from('user_profiles')
            .update({
              [balanceField]: currentBalance - cryptoAmount,
              usd_balance: (profile?.usd_balance || 0) + usdValue
            })
            .eq('user_id', user?.id);

          alert('Crypto sold successfully!');
          fetchUserData();
        }
      } else {
        // Send to friend
        if (!friendWalletAddress || !friendName || !friendEmail) {
          alert('Please fill in all friend details');
          return;
        }

        const { error } = await supabase
          .from('user_transactions')
          .insert({
            user_id: user?.id,
            type: 'transfer',
            coin: selectedCrypto,
            amount: cryptoAmount,
            usd_amount: usdValue,
            status: 'completed',
            payment_method: 'transfer',
            recipient_wallet: friendWalletAddress,
            recipient_name: friendName,
            recipient_email: friendEmail
          });

        if (!error) {
          // Update user balance
          const balanceField = `${selectedCrypto.toLowerCase()}_balance`;
          await supabase
            .from('user_profiles')
            .update({
              [balanceField]: currentBalance - cryptoAmount
            })
            .eq('user_id', user?.id);

          alert(`${cryptoAmount} ${selectedCrypto} sent to ${friendName}!`);
          fetchUserData();
        }
      }

      setSellAmount('');
      setFriendWalletAddress('');
      setFriendName('');
      setFriendEmail('');
      
    } catch (error) {
      console.error('Error processing sell order:', error);
      alert('Failed to process sell order');
    }
  };

  const handleConvertUSD = async () => {
    if (!convertAmount || !selectedCrypto) return;

    try {
      const usdAmount = parseFloat(convertAmount);
      const conversionFee = (profile?.usd_balance || 0) * 0.01; // 1% of existing balance
      
      if (usdAmount > (profile?.usd_balance || 0)) {
        alert('Insufficient USD balance');
        return;
      }

      const cryptoAmount = calculateCryptoAmount(convertAmount, selectedCrypto);
      const netUsdAmount = usdAmount - conversionFee;
      const netCryptoAmount = netUsdAmount / getCryptoPrice(selectedCrypto);

      // Create conversion transaction
      const { error } = await supabase
        .from('user_transactions')
        .insert({
          user_id: user?.id,
          type: 'convert',
          coin: selectedCrypto,
          amount: netCryptoAmount,
          usd_amount: usdAmount,
          status: 'completed',
          payment_method: 'conversion',
          fee_amount: conversionFee
        });

      if (!error) {
        // Update balances
        const balanceField = `${selectedCrypto.toLowerCase()}_balance`;
        const currentCryptoBalance = profile?.[balanceField as keyof UserProfile] as number || 0;
        
        await supabase
          .from('user_profiles')
          .update({
            usd_balance: (profile?.usd_balance || 0) - usdAmount,
            [balanceField]: currentCryptoBalance + netCryptoAmount
          })
          .eq('user_id', user?.id);

        alert(`Converted $${usdAmount} to ${netCryptoAmount.toFixed(8)} ${selectedCrypto}!`);
        fetchUserData();
      }

      setConvertAmount('');
      
    } catch (error) {
      console.error('Error converting USD:', error);
      alert('Failed to convert USD');
    }
  };

  const handleKYCSubmit = async () => {
    if (!kycData.fullName || !kycData.selfieFile) {
      alert('Please fill in all KYC information');
      return;
    }

    try {
      // In a real implementation, you would upload the file to Supabase Storage
      // For now, we'll just update the profile
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: kycData.fullName,
          kyc_status: 'pending'
        })
        .eq('user_id', user?.id);

      if (!error) {
        alert('KYC information submitted for review!');
        fetchUserData();
      }
    } catch (error) {
      console.error('Error submitting KYC:', error);
      alert('Failed to submit KYC information');
    }
  };

  const handleSupportTicket = async () => {
    if (!ticketData.subject || !ticketData.message) {
      alert('Please fill in all ticket information');
      return;
    }

    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user?.id,
          subject: ticketData.subject,
          message: ticketData.message,
          status: 'open'
        });

      if (!error) {
        alert('Support ticket submitted successfully!');
        setTicketData({ subject: '', message: '' });
        fetchUserData();
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Failed to submit support ticket');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const generatePDFReceipt = (transaction: Transaction) => {
    // This would integrate with your existing PDF generator
    alert(`Generating PDF receipt for transaction ${transaction.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="https://ideogram.ai/assets/progressive-image/balanced/response/xPZBIySqQtGHWaStdXSEMQ"
                alt="BIANOTRADES"
                className="h-10 mr-4"
              />
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Crypto Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <div className="flex items-center space-x-2">
                {profile?.avatar_url && (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Welcome, {profile?.full_name}
                </span>
              </div>
              <button
                onClick={signOut}
                className={`text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <ul className="space-y-2">
                {[
                  { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
                  { id: 'buy', label: 'Buy Crypto', icon: <ShoppingCart className="h-5 w-5" /> },
                  { id: 'sell', label: 'Sell Crypto', icon: <TrendingDown className="h-5 w-5" /> },
                  { id: 'convert', label: 'Convert', icon: <RefreshCw className="h-5 w-5" /> },
                  { id: 'history', label: 'Transaction History', icon: <History className="h-5 w-5" /> },
                  { id: 'wallets', label: 'Wallets', icon: <Wallet className="h-5 w-5" /> },
                  { id: 'addresses', label: 'Wallet Addresses', icon: <MapPin className="h-5 w-5" /> },
                  { id: 'upgrade', label: 'Upgrade Account', icon: <ArrowUp className="h-5 w-5" /> },
                  { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
                  { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
                  { id: 'kyc', label: 'KYC', icon: <Shield className="h-5 w-5" /> },
                  { id: 'support', label: 'Support', icon: <HelpCircle className="h-5 w-5" /> },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Home Tab */}
            {activeTab === 'home' && (
              <div className="space-y-6">
                {/* Balance Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Balance</p>
                        <p className="text-2xl font-bold">${getTotalBalance().toLocaleString()}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-200" />
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>USD Balance</p>
                        <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          ${(profile?.usd_balance || 0).toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Account Tier</p>
                        <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {profile?.tier === 'basic' ? 'Tier 1' : 'Tier 2'}
                        </p>
                      </div>
                      <Shield className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Crypto Balances */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Cryptocurrency Balances
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { coin: 'BTC', balance: profile?.btc_balance || 0, logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
                      { coin: 'ETH', balance: profile?.eth_balance || 0, logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
                      { coin: 'USDT', balance: profile?.usdt_balance || 0, logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
                    ].map((crypto) => (
                      <div key={crypto.coin} className={`p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center mb-2">
                          <img src={crypto.logo} alt={crypto.coin} className="w-8 h-8 mr-2" />
                          <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {crypto.coin}
                          </span>
                        </div>
                        <p className={`text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {crypto.balance.toFixed(8)}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          ${(crypto.balance * getCryptoPrice(crypto.coin)).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Crypto Rates */}
                <CryptoRates />
              </div>
            )}

            {/* Buy Crypto Tab */}
            {activeTab === 'buy' && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Buy Cryptocurrency
                </h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Select Cryptocurrency
                      </label>
                      <select
                        value={selectedCrypto}
                        onChange={(e) => setSelectedCrypto(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}
                      >
                        {supportedCryptos.map((crypto) => (
                          <option key={crypto.symbol} value={crypto.symbol}>
                            {crypto.name} ({crypto.symbol}) - ${getCryptoPrice(crypto.symbol).toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Amount (USD)
                      </label>
                      <input
                        type="number"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        placeholder="Enter USD amount"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  {buyAmount && (
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-800'}`}>
                        You will receive: {calculateCryptoAmount(buyAmount, selectedCrypto).toFixed(8)} {selectedCrypto}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-800'}`}>
                        Platform fee (5%): ${(parseFloat(buyAmount) * 0.05).toFixed(2)}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-800'}`}>
                        Net amount: ${(parseFloat(buyAmount) * 0.95).toFixed(2)}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Payment Methods
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={handleBuyCrypto}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                      >
                        <div className="flex items-center justify-center">
                          <Bitcoin className="h-6 w-6 mr-2" />
                          Pay with Card (Stripe)
                        </div>
                      </button>

                      <button
                        onClick={() => alert('Please contact support for wire transfer details')}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
                      >
                        <div className="flex items-center justify-center">
                          <DollarSign className="h-6 w-6 mr-2" />
                          Wire Transfer
                        </div>
                      </button>

                      <button
                        onClick={() => alert('Please contact support for PayPal payment details')}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
                      >
                        <div className="flex items-center justify-center">
                          <Send className="h-6 w-6 mr-2" />
                          PayPal (On Request)
                        </div>
                      </button>

                      <button
                        onClick={() => alert('Please contact support for CashApp payment details')}
                        className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all"
                      >
                        <div className="flex items-center justify-center">
                          <Coins className="h-6 w-6 mr-2" />
                          CashApp (On Request)
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sell Crypto Tab */}
            {activeTab === 'sell' && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Sell Cryptocurrency
                </h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Select Cryptocurrency
                      </label>
                      <select
                        value={selectedCrypto}
                        onChange={(e) => setSelectedCrypto(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}
                      >
                        {supportedCryptos.map((crypto) => (
                          <option key={crypto.symbol} value={crypto.symbol}>
                            {crypto.name} ({crypto.symbol})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Amount ({selectedCrypto})
                      </label>
                      <input
                        type="number"
                        value={sellAmount}
                        onChange={(e) => setSellAmount(e.target.value)}
                        placeholder={`Enter ${selectedCrypto} amount`}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Sell To
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setSellRecipient('bianotrades')}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          sellRecipient === 'bianotrades'
                            ? 'border-blue-500 bg-blue-50'
                            : `border-gray-300 ${darkMode ? 'bg-gray-700' : 'bg-white'}`
                        }`}
                      >
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Sell to BIANOTRADES
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Convert to USD in your account
                        </p>
                      </button>

                      <button
                        onClick={() => setSellRecipient('friend')}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          sellRecipient === 'friend'
                            ? 'border-blue-500 bg-blue-50'
                            : `border-gray-300 ${darkMode ? 'bg-gray-700' : 'bg-white'}`
                        }`}
                      >
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Send to Friend
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Transfer to another wallet
                        </p>
                      </button>
                    </div>
                  </div>

                  {sellRecipient === 'friend' && (
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Friend's Name
                        </label>
                        <input
                          type="text"
                          value={friendName}
                          onChange={(e) => setFriendName(e.target.value)}
                          placeholder="Enter friend's name"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Friend's Email
                        </label>
                        <input
                          type="email"
                          value={friendEmail}
                          onChange={(e) => setFriendEmail(e.target.value)}
                          placeholder="Enter friend's email"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Friend's Wallet Address
                        </label>
                        <input
                          type="text"
                          value={friendWalletAddress}
                          onChange={(e) => setFriendWalletAddress(e.target.value)}
                          placeholder="Enter wallet address"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSellCrypto}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all"
                  >
                    {sellRecipient === 'bianotrades' ? 'Sell to BIANOTRADES' : 'Send to Friend'}
                  </button>
                </div>
              </div>
            )}

            {/* Convert Tab */}
            {activeTab === 'convert' && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Convert USD to Crypto
                </h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        USD Amount
                      </label>
                      <input
                        type="number"
                        value={convertAmount}
                        onChange={(e) => setConvertAmount(e.target.value)}
                        placeholder="Enter USD amount"
                        max={profile?.usd_balance || 0}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}
                      />
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Available: ${(profile?.usd_balance || 0).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Convert To
                      </label>
                      <select
                        value={selectedCrypto}
                        onChange={(e) => setSelectedCrypto(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}
                      >
                        {supportedCryptos.map((crypto) => (
                          <option key={crypto.symbol} value={crypto.symbol}>
                            {crypto.name} ({crypto.symbol})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {convertAmount && (
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-green-800'}`}>
                        You will receive: {calculateCryptoAmount(convertAmount, selectedCrypto).toFixed(8)} {selectedCrypto}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-green-800'}`}>
                        Conversion fee (1% of existing balance): ${((profile?.usd_balance || 0) * 0.01).toFixed(2)}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleConvertUSD}
                    disabled={!convertAmount || parseFloat(convertAmount) > (profile?.usd_balance || 0)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Convert USD to {selectedCrypto}
                  </button>
                </div>
              </div>
            )}

            {/* Transaction History Tab */}
            {activeTab === 'history' && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Transaction History
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <th className={`text-left py-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Date</th>
                        <th className={`text-left py-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Type</th>
                        <th className={`text-left py-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Coin</th>
                        <th className={`text-left py-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Amount</th>
                        <th className={`text-left py-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>USD Value</th>
                        <th className={`text-left py-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
                        <th className={`text-left py-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <td className={`py-3 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {new Date(tx.created_at).toLocaleDateString()}
                          </td>
                          <td className={`py-3 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              tx.type === 'buy' ? 'bg-green-100 text-green-800' :
                              tx.type === 'sell' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {tx.type.toUpperCase()}
                            </span>
                          </td>
                          <td className={`py-3 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{tx.coin}</td>
                          <td className={`py-3 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {tx.amount.toFixed(8)}
                          </td>
                          <td className={`py-3 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            ${tx.usd_amount.toLocaleString()}
                          </td>
                          <td className={`py-3 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                              tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => generatePDFReceipt(tx)}
                              className="text-blue-600 hover:text-blue-800 mr-2"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => copyToClipboard(tx.id)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Wallet Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Deposit Addresses
                </h2>
                
                <div className="grid gap-6">
                  {walletAddresses.map((wallet) => (
                    <div key={wallet.id} className={`border rounded-lg p-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <span className="font-bold text-blue-600">{wallet.coin}</span>
                          </div>
                          <div>
                            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {wallet.coin} ({wallet.network})
                            </h3>
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(wallet.address)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <div className={`bg-gray-50 rounded p-3 ${darkMode ? 'bg-gray-700' : ''}`}>
                        <code className={`text-sm break-all ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          {wallet.address}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KYC Tab */}
            {activeTab === 'kyc' && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  KYC Verification
                </h2>
                
                <div className="space-y-6">
                  <div className={`p-4 rounded-lg ${
                    profile?.kyc_status === 'approved' ? 'bg-green-50' :
                    profile?.kyc_status === 'denied' ? 'bg-red-50' :
                    'bg-yellow-50'
                  }`}>
                    <p className={`font-semibold ${
                      profile?.kyc_status === 'approved' ? 'text-green-800' :
                      profile?.kyc_status === 'denied' ? 'text-red-800' :
                      'text-yellow-800'
                    }`}>
                      Status: {profile?.kyc_status?.toUpperCase()}
                    </p>
                  </div>

                  {profile?.kyc_status !== 'approved' && (
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={kycData.fullName}
                          onChange={(e) => setKycData({...kycData, fullName: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Upload Selfie
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setKycData({...kycData, selfieFile: e.target.files?.[0] || null})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                          }`}
                        />
                      </div>

                      <button
                        onClick={handleKYCSubmit}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                      >
                        Submit KYC Information
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Support Tab */}
            {activeTab === 'support' && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Support Center
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Subject
                      </label>
                      <input
                        type="text"
                        value={ticketData.subject}
                        onChange={(e) => setTicketData({...ticketData, subject: e.target.value})}
                        placeholder="Enter ticket subject"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Message
                      </label>
                      <textarea
                        value={ticketData.message}
                        onChange={(e) => setTicketData({...ticketData, message: e.target.value})}
                        placeholder="Describe your issue..."
                        rows={6}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}
                      />
                    </div>

                    <button
                      onClick={handleSupportTicket}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
                    >
                      Submit Support Ticket
                    </button>
                  </div>

                  {/* Existing Tickets */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Your Tickets
                    </h3>
                    <div className="space-y-3">
                      {supportTickets.map((ticket) => (
                        <div key={ticket.id} className={`p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {ticket.subject}
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(ticket.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Settings
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Dark Mode
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Toggle between light and dark theme
                      </p>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        darkMode ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Language Selection
                    </h3>
                    <select className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                    }`}>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                      <option value="ja">日本語</option>
                      <option value="ko">한국어</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Upgrade Account Tab */}
            {activeTab === 'upgrade' && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Upgrade Account
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className={`p-6 border-2 rounded-lg ${
                    profile?.tier === 'basic' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Tier 1 (Basic)</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• USD Balance limit: $20,000</li>
                      <li>• Basic trading features</li>
                      <li>• Standard support</li>
                      <li>• Basic KYC required</li>
                    </ul>
                    {profile?.tier === 'basic' && (
                      <div className="mt-4 text-blue-600 font-semibold">Current Plan</div>
                    )}
                  </div>

                  <div className={`p-6 border-2 rounded-lg ${
                    profile?.tier === 'advanced' ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Tier 2 (Advanced)</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Unlimited USD Balance</li>
                      <li>• Advanced trading features</li>
                      <li>• Priority support</li>
                      <li>• Enhanced KYC required</li>
                      <li>• Lower fees</li>
                    </ul>
                    {profile?.tier === 'basic' ? (
                      <button className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all">
                        Upgrade to Tier 2
                      </button>
                    ) : (
                      <div className="mt-4 text-green-600 font-semibold">Current Plan</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}