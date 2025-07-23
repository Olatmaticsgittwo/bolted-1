import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Wallet, TrendingUp, History, Settings, CreditCard, Send, RadioReceiver as Receive, LogOut, Shield, User, DollarSign } from 'lucide-react';
import { CryptoRates } from '../CryptoRates';

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
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  coin: string;
  status: string;
  payment_method: string;
  created_at: string;
}

export function UserDashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchTransactions();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const getTotalBalance = () => {
    if (!profile) return 0;
    return profile.usd_balance + 
           (profile.btc_balance * 45000) + 
           (profile.eth_balance * 3200) + 
           (profile.usdt_balance * 1);
  };

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'denied': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="https://ideogram.ai/assets/progressive-image/balanced/response/xPZBIySqQtGHWaStdXSEMQ"
                alt="BIANOTRADES"
                className="h-10 mr-4"
              />
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {profile?.full_name}</span>
              <button
                onClick={signOut}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-1" />
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
            <nav className="bg-white rounded-lg shadow p-6">
              <ul className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp className="h-5 w-5" /> },
                  { id: 'wallet', label: 'Wallet', icon: <Wallet className="h-5 w-5" /> },
                  { id: 'deposit', label: 'Deposit', icon: <Receive className="h-5 w-5" /> },
                  { id: 'trade', label: 'Trade', icon: <CreditCard className="h-5 w-5" /> },
                  { id: 'history', label: 'History', icon: <History className="h-5 w-5" /> },
                  { id: 'kyc', label: 'KYC/Settings', icon: <Settings className="h-5 w-5" /> },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
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
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Balance Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Balance</p>
                        <p className="text-2xl font-bold">${getTotalBalance().toLocaleString()}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">Bitcoin</p>
                        <p className="text-xl font-bold">{profile?.btc_balance || 0} BTC</p>
                      </div>
                      <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="BTC" className="h-8 w-8" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">Ethereum</p>
                        <p className="text-xl font-bold">{profile?.eth_balance || 0} ETH</p>
                      </div>
                      <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" className="h-8 w-8" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">USDT</p>
                        <p className="text-xl font-bold">{profile?.usdt_balance || 0} USDT</p>
                      </div>
                      <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" alt="USDT" className="h-8 w-8" />
                    </div>
                  </div>
                </div>

                {/* KYC Status */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold">KYC Verification</h3>
                        <p className="text-gray-600">Current tier: {profile?.tier}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getKYCStatusColor(profile?.kyc_status || 'pending')}`}>
                      {profile?.kyc_status?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Live Prices */}
                <CryptoRates />
              </div>
            )}

            {activeTab === 'wallet' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">My Wallet</h2>
                <div className="space-y-4">
                  {[
                    { coin: 'Bitcoin', symbol: 'BTC', balance: profile?.btc_balance || 0, price: 45000, logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
                    { coin: 'Ethereum', symbol: 'ETH', balance: profile?.eth_balance || 0, price: 3200, logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
                    { coin: 'Tether', symbol: 'USDT', balance: profile?.usdt_balance || 0, price: 1, logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
                    { coin: 'USD Balance', symbol: 'USD', balance: profile?.usd_balance || 0, price: 1, logo: '💵' }
                  ].map((asset) => (
                    <div key={asset.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        {asset.logo.startsWith('http') ? (
                          <img src={asset.logo} alt={asset.symbol} className="h-10 w-10 mr-4" />
                        ) : (
                          <span className="text-2xl mr-4">{asset.logo}</span>
                        )}
                        <div>
                          <h3 className="font-semibold">{asset.coin}</h3>
                          <p className="text-gray-600">{asset.balance} {asset.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(asset.balance * asset.price).toLocaleString()}</p>
                        <p className="text-gray-600">${asset.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'deposit' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Deposit Funds</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { method: 'PayPal', description: 'Instant deposit via PayPal', icon: '💳' },
                    { method: 'CashApp', description: 'Send to our $cashtag', icon: '📱' },
                    { method: 'Wire Transfer', description: 'US Bank transfer', icon: '🏦' },
                    { method: 'Crypto Deposit', description: 'Deposit cryptocurrency', icon: '₿' }
                  ].map((method) => (
                    <div key={method.method} className="border rounded-lg p-6 hover:border-blue-500 cursor-pointer transition-colors">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-4">{method.icon}</span>
                        <div>
                          <h3 className="font-semibold text-lg">{method.method}</h3>
                          <p className="text-gray-600">{method.description}</p>
                        </div>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                        Select {method.method}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'trade' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Buy & Sell Crypto</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-green-600 mb-4">Buy Crypto</h3>
                    <p className="text-gray-600 mb-4">Purchase cryptocurrency using your deposited funds</p>
                    <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
                      Buy Crypto
                    </button>
                  </div>
                  <div className="border rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-orange-600 mb-4">Sell Crypto</h3>
                    <p className="text-gray-600 mb-4">Convert your crypto to USD and withdraw</p>
                    <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700">
                      Sell Crypto
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Date</th>
                        <th className="text-left py-3">Type</th>
                        <th className="text-left py-3">Amount</th>
                        <th className="text-left py-3">Coin</th>
                        <th className="text-left py-3">Status</th>
                        <th className="text-left py-3">Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-500">
                            No transactions yet
                          </td>
                        </tr>
                      ) : (
                        transactions.map((tx) => (
                          <tr key={tx.id} className="border-b">
                            <td className="py-3">{new Date(tx.created_at).toLocaleDateString()}</td>
                            <td className="py-3 capitalize">{tx.type}</td>
                            <td className="py-3">${tx.amount}</td>
                            <td className="py-3">{tx.coin}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                                tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {tx.status}
                              </span>
                            </td>
                            <td className="py-3">{tx.payment_method}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'kyc' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">KYC Verification & Settings</h2>
                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Current Status</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Tier: {profile?.tier}</p>
                        <p className="text-gray-600">Status: {profile?.kyc_status}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getKYCStatusColor(profile?.kyc_status || 'pending')}`}>
                        {profile?.kyc_status?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Upgrade to Advanced Tier</h3>
                    <p className="text-gray-600 mb-4">Upload ID and complete facial verification for higher limits</p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                      Start Verification
                    </button>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          type="text"
                          value={profile?.full_name || ''}
                          disabled
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={profile?.email || ''}
                          disabled
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          type="tel"
                          value={profile?.phone || ''}
                          disabled
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <input
                          type="text"
                          value={profile?.country || ''}
                          disabled
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                    </div>
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