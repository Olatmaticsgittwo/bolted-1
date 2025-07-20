import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface CryptoRate {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  color: string;
}

export function CryptoRates() {
  const [rates, setRates] = useState<CryptoRate[]>([
    { symbol: 'BTC', name: 'Bitcoin', price: 45000, change24h: 2.5, color: '#F7931A' },
    { symbol: 'ETH', name: 'Ethereum', price: 3200, change24h: -1.2, color: '#627EEA' },
    { symbol: 'USDT', name: 'Tether', price: 1.00, change24h: 0.1, color: '#26A17B' },
    { symbol: 'BNB', name: 'Binance', price: 320, change24h: 3.8, color: '#F3BA2F' },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const refreshRates = () => {
    setIsLoading(true);
    // Simulate API call with random price changes
    setTimeout(() => {
      setRates(prevRates => 
        prevRates.map(rate => ({
          ...rate,
          price: rate.price * (1 + (Math.random() - 0.5) * 0.1),
          change24h: (Math.random() - 0.5) * 10
        }))
      );
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshRates, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Live Crypto Rates</h2>
        <button
          onClick={refreshRates}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {rates.map((rate) => (
          <div
            key={rate.symbol}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3"
                  style={{ backgroundColor: rate.color }}
                >
                  {rate.symbol.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{rate.symbol}</h3>
                  <p className="text-xs text-gray-600">{rate.name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-lg font-bold text-gray-900">
                ${rate.price.toLocaleString(undefined, { 
                  minimumFractionDigits: rate.symbol === 'USDT' ? 2 : 0,
                  maximumFractionDigits: rate.symbol === 'USDT' ? 2 : 0
                })}
              </p>
              <div className="flex items-center">
                {rate.change24h >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  rate.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {rate.change24h >= 0 ? '+' : ''}{rate.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Rates update every 30 seconds • Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}