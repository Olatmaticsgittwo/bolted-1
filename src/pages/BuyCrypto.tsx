import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Building, DollarSign } from 'lucide-react';
import { StripePayment } from '../components/StripePayment';
import { createTransaction } from '../services/transactionService';
import { generateTransactionReceipt, downloadReceipt } from '../utils/pdfGenerator';

interface BuyCryptoProps {
  onNavigate: (page: string) => void;
}

export function BuyCrypto({ onNavigate }: BuyCryptoProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cryptoType: 'BTC',
    amount: '',
    paymentMethod: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cryptoOptions = [
    { value: 'BTC', label: 'Bitcoin (BTC)', rate: '45000' },
    { value: 'ETH', label: 'Ethereum (ETH)', rate: '3200' },
    { value: 'USDT', label: 'Tether (USDT)', rate: '1.00' },
    { value: 'BNB', label: 'Binance Coin (BNB)', rate: '320' },
    { value: 'SOL', label: 'Solana (SOL) - Available on Request', rate: '95' },
  ];

  const paymentMethods = [
    { 
      id: 'cashapp', 
      name: 'CashApp', 
      icon: <Smartphone className="h-6 w-6" />,
      description: 'Send payment via CashApp'
    },
    { 
      id: 'crypto', 
      name: 'Cryptocurrency', 
      icon: <DollarSign className="h-6 w-6" />,
      description: 'Pay with your crypto wallet'
    },
    { 
      id: 'wire', 
      name: 'Wire Transfer', 
      icon: <Building className="h-6 w-6" />,
      description: 'Bank wire transfer'
    },
    { 
      id: 'paypal', 
      name: 'PayPal', 
      icon: <CreditCard className="h-6 w-6" />,
      description: 'Pay with PayPal'
    },
    { 
      id: 'stripe', 
      name: 'Credit/Debit Card', 
      icon: <CreditCard className="h-6 w-6" />,
      description: 'Pay with credit or debit card'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCreateTransaction();
    }
  };

  const handleCreateTransaction = async () => {
    setIsSubmitting(true);
    
    try {
      const selectedCrypto = cryptoOptions.find(c => c.value === formData.cryptoType);
      const cryptoRate = parseFloat(selectedCrypto?.rate.replace(',', '') || '0');
      const usdAmount = parseFloat(formData.amount);
      const cryptoAmount = usdAmount / cryptoRate;

      const transactionData = {
        userEmail: formData.email,
        userName: `${formData.firstName} ${formData.lastName}`,
        userPhone: formData.phone,
        transactionType: 'buy' as const,
        cryptoType: formData.cryptoType,
        amount: cryptoAmount,
        usdAmount: usdAmount,
        paymentMethod: formData.paymentMethod,
      };

      const result = await createTransaction(transactionData);
      setTransactionId(result.transactionId);
      
      // Generate and download PDF receipt
      const receiptData = {
        id: result.transactionId,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        transactionType: 'buy' as const,
        cryptoType: formData.cryptoType,
        cryptoAmount: cryptoAmount,
        usdAmount: usdAmount,
        paymentMethod: formData.paymentMethod,
        timestamp: new Date().toLocaleString()
      };
      
      // Auto-download receipt
      setTimeout(() => {
        downloadReceipt(receiptData);
      }, 1000);
      
      if (formData.paymentMethod === 'stripe') {
        // Handle Stripe payment in the next step
        setCurrentStep(4);
      } else {
        // Show payment instructions for other methods
        alert('Order submitted! Your receipt is downloading. You will receive payment instructions via email.');
        onNavigate('home');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Failed to create transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStripeSuccess = (paymentIntentId: string) => {
    alert('Payment successful! Your receipt has been downloaded. Your cryptocurrency will be sent within 3 hours.');
    onNavigate('home');
  };

  const handleStripeError = (error: string) => {
    alert(`Payment failed: ${error}`);
  };

  const getPaymentInstructions = () => {
    switch (formData.paymentMethod) {
      case 'cashapp':
        return {
          title: 'CashApp Payment Instructions',
          instructions: [
            'Send payment to our CashApp: $BIANOTRADES',
            'Include your order reference in the note',
            'Send screenshot of payment confirmation',
            'Your crypto will be sent within 30 minutes'
          ]
        };
      case 'crypto':
        return {
          title: 'Cryptocurrency Payment Instructions',
          instructions: [
            'USDT (TRC20): TEbbs4roSj2CdGqKzNvZHCXGv58Yzhv127',
            'Bitcoin (BTC): 36Ds3LNDjmRMHDk2Y5r9vWbjTFUCTezruY',
            'Ethereum (ERC20): 0x6aa8f55a05af72f6bc98c72863fa955e6fc8e928',
            'Include transaction hash in confirmation email',
            'Other addresses available on request'
          ]
        };
      case 'wire':
        return {
          title: 'Wire Transfer Instructions',
          instructions: [
            'Bank: BIANOTRADES Financial',
            'Account: 123456789',
            'Routing: 987654321',
            'Include your name and order reference',
            'Processing time: 1-3 business days'
          ]
        };
      case 'paypal':
        return {
          title: 'PayPal Payment Instructions',
          instructions: [
            'Send payment to: payments@bianotrades.com',
            'Mark as "Goods & Services"',
            'Include order reference in notes',
            'Your crypto will be sent within 1 hour'
          ]
        };
      default:
        return { title: '', instructions: [] };
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Buy Cryptocurrency</h1>
          <p className="text-gray-600 mt-2">Complete your purchase in just a few steps</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3, ...(formData.paymentMethod === 'stripe' ? [4] : [])].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < (formData.paymentMethod === 'stripe' ? 4 : 3) && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Personal Info</span>
            <span>Payment Method</span>
            <span>Confirmation</span>
            {formData.paymentMethod === 'stripe' && <span>Payment</span>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
              
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cryptocurrency *
                  </label>
                  <select
                    name="cryptoType"
                    value={formData.cryptoType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    Amount (USD) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min="500"
                    placeholder="Minimum $500"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Payment Method</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                      formData.paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                  >
                    <div className="flex items-center mb-3">
                      <div className="text-blue-600 mr-3">
                        {method.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Confirmation</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span>{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span>{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cryptocurrency:</span>
                    <span>{formData.cryptoType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>${formData.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>{paymentMethods.find(m => m.id === formData.paymentMethod)?.name}</span>
                  </div>
                </div>
              </div>

              {formData.paymentMethod && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">
                    {getPaymentInstructions().title}
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    {getPaymentInstructions().instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">{index + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Stripe Payment (only for Stripe payments) */}
          {currentStep === 4 && formData.paymentMethod === 'stripe' && transactionId && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h2>
              
              <StripePayment
                amount={parseFloat(formData.amount)}
                currency="USD"
                transactionId={transactionId}
                customerEmail={formData.email}
                customerName={`${formData.firstName} ${formData.lastName}`}
                onSuccess={handleStripeSuccess}
                onError={handleStripeError}
              />
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
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
              disabled={(currentStep === 2 && !formData.paymentMethod) || isSubmitting}
              className="ml-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? 'Processing...' : currentStep === 3 ? 'Confirm Order' : 'Next'}
            </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}