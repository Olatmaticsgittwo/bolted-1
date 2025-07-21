import React, { useState } from 'react';
import { ArrowLeft, Upload, Wallet, Check } from 'lucide-react';
import { createTransaction } from '../services/transactionService';

interface SellCryptoProps {
  onNavigate: (page: string) => void;
}

export function SellCrypto({ onNavigate }: SellCryptoProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cryptoType: 'BTC',
    amount: '',
    walletAddress: '',
    paymentMethod: '',
    accountDetails: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cryptoOptions = [
    { value: 'BTC', label: 'Bitcoin (BTC)', rate: '45,000' },
    { value: 'ETH', label: 'Ethereum (ETH)', rate: '3,200' },
    { value: 'USDT', label: 'Tether (USDT)', rate: '1.00' },
    { value: 'BNB', label: 'Binance Coin (BNB)', rate: '320' },
  ];

  const payoutMethods = [
    { id: 'cashapp', name: 'CashApp', description: 'Receive payment via CashApp' },
    { id: 'paypal', name: 'PayPal', description: 'Receive payment via PayPal' },
    { id: 'wire', name: 'Wire Transfer', description: 'Bank wire transfer' },
    { id: 'crypto', name: 'Cryptocurrency', description: 'Receive payment in crypto' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCreateSellOrder();
    }
  };

  const handleCreateSellOrder = async () => {
    setIsSubmitting(true);
    
    try {
      const selectedCrypto = cryptoOptions.find(c => c.value === formData.cryptoType);
      const cryptoRate = parseFloat(selectedCrypto?.rate.replace(',', '') || '0');
      const cryptoAmount = parseFloat(formData.amount);
      const usdAmount = cryptoAmount * cryptoRate;

      const transactionData = {
        userEmail: formData.email,
        userName: `${formData.firstName} ${formData.lastName}`,
        userPhone: formData.phone,
        transactionType: 'sell' as const,
        cryptoType: formData.cryptoType,
        amount: cryptoAmount,
        usdAmount: usdAmount,
        paymentMethod: formData.paymentMethod,
        walletAddress: formData.walletAddress,
        payoutDetails: { accountDetails: formData.accountDetails },
      };

      await createTransaction(transactionData);
      alert('Sell order submitted! We will verify your transfer and process payment within 24 hours.');
      onNavigate('home');
    } catch (error) {
      console.error('Error creating sell order:', error);
      alert('Failed to create sell order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWalletAddress = () => {
    switch (formData.cryptoType) {
      case 'BTC':
        return '36Ds3LNDjmRMHDk2Y5r9vWbjTFUCTezruY';
      case 'ETH':
        return '0x6aa8f55a05af72f6bc98c72863fa955e6fc8e928';
      case 'USDT':
        return 'TEbbs4roSj2CdGqKzNvZHCXGv58Yzhv127';
      case 'BNB':
        return 'Available on request - Contact support';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Sell Cryptocurrency</h1>
          <p className="text-gray-600 mt-2">Convert your crypto to cash quickly and securely</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step <= currentStep ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step < currentStep ? 'bg-orange-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Sell Details</span>
            <span>Transfer Proof</span>
            <span>Payout Info</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {/* Step 1: Sell Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sell Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cryptocurrency to Sell *
                  </label>
                  <select
                    name="cryptoType"
                    value={formData.cryptoType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {cryptoOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label} - ${option.rate}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Sell *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min="0.001"
                    step="0.001"
                    placeholder="0.001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Wallet className="h-6 w-6 text-orange-600 mr-3" />
                  <h3 className="font-semibold text-orange-900">Our {formData.cryptoType} Wallet Address</h3>
                </div>
                <p className="text-sm text-orange-800 mb-2">Send your {formData.cryptoType} to this address:</p>
                <div className="bg-white rounded p-3 border border-orange-200">
                  <code className="text-sm break-all">{getWalletAddress()}</code>
                </div>
                <p className="text-xs text-orange-700 mt-2">
                  ⚠️ Make sure to send the exact amount you specified above
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Transfer Proof */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Transfer Proof</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Wallet Address *
                </label>
                <input
                  type="text"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter the wallet address you're sending from"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-600 mt-1">
                  This helps us verify the transaction
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Transaction Screenshot *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Upload a screenshot of your transaction
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      required
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                  {uploadedFile && (
                    <div className="mt-4 flex items-center justify-center text-green-600">
                      <Check className="h-5 w-5 mr-2" />
                      <span className="text-sm">{uploadedFile.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">What to include in your screenshot:</h3>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Transaction hash/ID</li>
                  <li>• Amount sent</li>
                  <li>• Destination address (our wallet)</li>
                  <li>• Transaction status (pending/confirmed)</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Payout Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payout Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  How would you like to receive payment? *
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {payoutMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        formData.paymentMethod === method.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                    >
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Details *
                </label>
                <textarea
                  name="accountDetails"
                  value={formData.accountDetails}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Enter your account details (email, phone, account number, etc.)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Provide the necessary details for us to send your payment
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span>{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cryptocurrency:</span>
                    <span>{formData.amount} {formData.cryptoType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Value:</span>
                    <span>${(parseFloat(formData.amount) * parseFloat(cryptoOptions.find(c => c.value === formData.cryptoType)?.rate.replace(',', '') || '0')).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payout Method:</span>
                    <span>{payoutMethods.find(m => m.id === formData.paymentMethod)?.name}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> We will verify your transaction and process payment within 24 hours. 
                  You will receive a confirmation email once the payment is sent.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            
            <button
              type="submit"
              disabled={(currentStep === 2 && !uploadedFile) || (currentStep === 3 && !formData.paymentMethod) || isSubmitting}
              className="ml-auto px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? 'Processing...' : currentStep === 3 ? 'Submit Sell Order' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}