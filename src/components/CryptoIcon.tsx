import React from 'react';

interface CryptoIconProps {
  symbol: string;
  name: string;
  color: string;
  animationType?: 'spin' | 'bounce' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
}

export function CryptoIcon({ symbol, name, color, animationType = 'spin', size = 'md' }: CryptoIconProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl'
  };

  const animationClasses = {
    spin: 'animate-spin',
    bounce: 'animate-bounce',
    pulse: 'animate-pulse'
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div 
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shadow-lg ${animationClasses[animationType]}`}
        style={{ backgroundColor: color }}
      >
        {symbol}
      </div>
      <span className="text-sm font-medium text-gray-600">{name}</span>
    </div>
  );
}