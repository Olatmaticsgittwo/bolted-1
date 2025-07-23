import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Eye,
  Settings
} from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  ip_address: string;
  kyc_status: string;
  tier: string;
  btc_balance: number;
  eth_balance: number;
  usdt_balance: number;
  usd_balance: number;
  created_at: string;
  last_login: string;
}

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  coin: string;
  status: string;
  payment_method: string;
  created_at: string;
  user_profiles: {
    full_name: string;
    email: string;
  };
}

interface DepositRequest {
  id: string;
  user_id: string;
  amount: number;
  method: string;
  status: string;
  proof_url: string;
  created_at: string;
  user_profiles: {
    full_name: string;
    email: string;
  };
}

export function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVolume: 0,
    pendingKYC: 0,
    pendingDeposits: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch users
      const { data: usersData } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch transactions
      const { data: transactionsData } = await supabase
        .from('user_transactions')
        .select(`
          *,
          user_profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Fetch deposit requests
      const { data: depositsData } = await supabase
        .from('deposit_requests')
        .select(`
          *,
          user_profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      setUsers(usersData || []);
      setTransactions(transactionsData || []);
      setDeposits(depositsData || []);

      // Calculate stats
      const totalVolume = transactionsData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const pendingKYC = usersData?.filter(u => u.kyc_status === 'pending').length || 0;
      const pendingDeposits = depositsData?.filter(d => d.status === 'pending').length || 0;

      setStats({
        totalUsers: usersData?.length || 0,
        totalVolume,
        pendingKYC,
        pendingDeposits
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateKYCStatus = async (userId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ kyc_status: status })
        .eq('user_id', userId);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating KYC status:', error);
    }
  };

  const updateDepositStatus = async (depositId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('deposit_requests')
        .update({ status })
        .eq('id', depositId);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating deposit status:', error);
    }
  };

  const creditUserBalance = async (userId: string, amount: number, coin: string) => {
    try {
      const balanceField = `${coin.toLowerCase()}_balance`;
      const { data: currentProfile } = await supabase
        .from('user_profiles')
        .select(balanceField)
        .eq('user_id', userId)
        .single();

      const currentBalance = currentProfile?.[balanceField] || 0;
      const newBalance = currentBalance + amount;

      const { error } = await supabase
        .from('user_profiles')
        .update({ [balanceField]: newBalance })
        .eq('user_id', userId);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error crediting balance:', error);
    }
  };

  const exportData = () => {
    const csvContent = users.map(user => 
      `${user.full_name},${user.email},${user.phone},${user.country},${user.kyc_status},${user.tier},${user.created_at}`
    ).join('\n');
    
    const blob = new Blob([`Name,Email,Phone,Country,KYC Status,Tier,Created At\n${csvContent}`], 
      { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
  };

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
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button
              onClick={exportData}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalVolume.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending KYC</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingKYC}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Deposits</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingDeposits}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'users', label: 'Users' },
                { id: 'kyc', label: 'KYC Requests' },
                { id: 'deposits', label: 'Deposits' },
                { id: 'transactions', label: 'Transactions' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.kyc_status === 'approved' ? 'bg-green-100 text-green-800' :
                            user.kyc_status === 'denied' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.kyc_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.tier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${((user.usd_balance || 0) + (user.btc_balance || 0) * 45000 + (user.eth_balance || 0) * 3200 + (user.usdt_balance || 0)).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {user.kyc_status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateKYCStatus(user.user_id, 'approved')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateKYCStatus(user.user_id, 'denied')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Deny
                                </button>
                              </>
                            )}
                            <button className="text-blue-600 hover:text-blue-900">
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'deposits' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {deposits.map((deposit) => (
                      <tr key={deposit.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{deposit.user_profiles?.full_name}</div>
                            <div className="text-sm text-gray-500">{deposit.user_profiles?.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${deposit.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {deposit.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            deposit.status === 'approved' ? 'bg-green-100 text-green-800' :
                            deposit.status === 'denied' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {deposit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(deposit.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {deposit.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => {
                                    updateDepositStatus(deposit.id, 'approved');
                                    creditUserBalance(deposit.user_id, deposit.amount, 'usd');
                                  }}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateDepositStatus(deposit.id, 'denied')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Deny
                                </button>
                              </>
                            )}
                            {deposit.proof_url && (
                              <a
                                href={deposit.proof_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View Proof
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coin</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{tx.user_profiles?.full_name}</div>
                            <div className="text-sm text-gray-500">{tx.user_profiles?.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            tx.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {tx.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${tx.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tx.coin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                            tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}