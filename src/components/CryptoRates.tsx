import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, DollarSign } from 'lucide-react';
import { fetchCryptoPrices, CryptoPrice } from '../services/cryptoService';

export function CryptoRates() {
  const [rates, setRates] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const cryptoRates = await fetchCryptoPrices();
      setRates(cryptoRates);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching crypto rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number, symbol: string) => {
    if (symbol === 'USDT') {
      return price.toFixed(3);
    }
    return price.toLocaleString(undefined, { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Live Crypto Rates</h2>
          <p className="text-gray-600">Real-time cryptocurrency prices powered by CoinGecko</p>
        </div>
        <button
          onClick={fetchRates}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {isLoading && rates.length === 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl p-6 h-48"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {rates.map((rate) => (
            <div
              key={rate.id}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={rate.image}
                    alt={`${rate.name} logo`}
                    className="w-12 h-12 rounded-full mr-3 shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/48/3B82F6/FFFFFF?text=${rate.symbol}`;
                    }}
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{rate.symbol}</h3>
                    <p className="text-sm text-gray-600">{rate.name}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${formatPrice(rate.current_price, rate.symbol)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {rate.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm font-semibold ${
                      rate.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {rate.price_change_percentage_24h >= 0 ? '+' : ''}
                      {rate.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">24h</span>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>Market Cap</span>
                    <span className="font-semibold">{formatMarketCap(rate.market_cap)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-600 mt-1">
                    <span>Volume 24h</span>
                    <span className="font-semibold">{formatMarketCap(rate.volume_24h)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live data updates every 30 seconds</span>
        </div>
        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
      </div>

      {/* Minimum Order Notice */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-blue-600" />
          <div>
            <h4 className="font-semibold text-blue-900">Minimum Order</h4>
            <p className="text-blue-700 text-sm">$500 USD minimum for all cryptocurrency transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}