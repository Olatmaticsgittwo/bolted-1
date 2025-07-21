import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Wallet, Shield, Clock } from 'lucide-react';

interface WalletAddressesProps {
  onNavigate: (page: string) => void;
}

export function WalletAddresses({ onNavigate }: WalletAddressesProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const walletAddresses = [
    {
      crypto: 'USDT (TRC20)',
      address: 'TEbbs4roSj2CdGqKzNvZHCXGv58Yzhv127',
      network: 'Tron Network',
      color: '#26A17B',
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
    },
    {
      crypto: 'Bitcoin (BTC)',
      address: '36Ds3LNDjmRMHDk2Y5r9vWbjTFUCTezruY',
      network: 'Bitcoin Network',
      color: '#F7931A',
      icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
    },
    {
      crypto: 'Ethereum (ERC20)',
      address: '0x6aa8f55a05af72f6bc98c72863fa955e6fc8e928',
      network: 'Ethereum Network',
      color: '#627EEA',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    }
  ];

  const copyToClipboard = (address: string, crypto: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(crypto);
    setTimeout(() => setCopiedAddress(null), 2000);
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
            <Wallet className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              BIANOTRADES Wallet Addresses
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Send your cryptocurrency to these verified BIANOTRADES wallet addresses for secure transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Addresses */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            {walletAddresses.map((wallet, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <img
                      src={wallet.icon}
                      alt={`${wallet.crypto} logo`}
                      className="w-12 h-12 mr-4"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{wallet.crypto}</h3>
                      <p className="text-gray-600">{wallet.network}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Wallet Address:
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4">
                        <code className="text-sm font-mono text-gray-900 break-all">
                          {wallet.address}
                        </code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(wallet.address, wallet.crypto)}
                        className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        {copiedAddress === wallet.crypto ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {copiedAddress === wallet.crypto && (
                      <p className="text-green-600 text-sm mt-2 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Address copied to clipboard!
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <Shield className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <p className="font-semibold text-blue-900">Secure</p>
                        <p className="text-sm text-blue-700">Verified Address</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-green-50 rounded-lg">
                      <Clock className="h-6 w-6 text-green-600 mr-3" />
                      <div>
                        <p className="font-semibold text-green-900">Fast</p>
                        <p className="text-sm text-green-700">Quick Processing</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                      <Wallet className="h-6 w-6 text-purple-600 mr-3" />
                      <div>
                        <p className="font-semibold text-purple-900">Official</p>
                        <p className="text-sm text-purple-700">BIANOTRADES Wallet</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Important Information
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">⚠️ Security Guidelines:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Always double-check the wallet address before sending</li>
                  <li>• Only send the specified cryptocurrency to each address</li>
                  <li>• Keep your transaction hash for reference</li>
                  <li>• Contact support if you need assistance</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">📞 Need More Addresses?</h4>
                <p className="text-gray-700 mb-4">
                  Other cryptocurrency addresses are available upon request. Contact our support team for:
                </p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Binance Coin (BNB)</li>
                  <li>• Cardano (ADA)</li>
                  <li>• Solana (SOL)</li>
                  <li>• And many more...</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button
                onClick={() => onNavigate('contact')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Contact Support for More Addresses
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}