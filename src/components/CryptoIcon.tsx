import React from 'react';

interface CryptoIconProps {
  symbol: string;
  name: string;
  color: string;
  animationType?: 'spin' | 'bounce' | 'pulse' | 'float';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function CryptoIcon({ symbol, name, color, animationType = 'float', size = 'md' }: CryptoIconProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  const animationClasses = {
    spin: 'animate-spin',
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    float: 'animate-pulse hover:scale-110 transition-transform duration-300'
  };

  // Real crypto coin images from popular sources
  const getCryptoImage = (symbol: string) => {
    const images = {
      'BTC': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      'ETH': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      'USDT': 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      'BNB': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      'ADA': 'https://cryptologos.cc/logos/cardano-ada-logo.png',
      'DOT': 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
      'SOL': 'https://cryptologos.cc/logos/solana-sol-logo.png',
      'MATIC': 'https://cryptologos.cc/logos/polygon-matic-logo.png'
    };
    return images[symbol as keyof typeof images] || `https://via.placeholder.com/64/3B82F6/FFFFFF?text=${symbol}`;
  };

  return (
    <div className="flex flex-col items-center space-y-3 group">
      <div className={`${sizeClasses[size]} relative ${animationClasses[animationType]} cursor-pointer`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
        <img
          src={getCryptoImage(symbol)}
          alt={`${name} logo`}
          className="w-full h-full object-contain rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300"
          onError={(e) => {
            // Fallback to colored circle with symbol if image fails
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div 
          className="w-full h-full rounded-full flex items-center justify-center font-bold text-white shadow-lg hidden"
          style={{ backgroundColor: color }}
        >
          {symbol}
        </div>
      </div>
      <div className="text-center">
        <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{symbol}</span>
        <p className="text-xs text-gray-600">{name}</p>
      </div>
    </div>
  );
}