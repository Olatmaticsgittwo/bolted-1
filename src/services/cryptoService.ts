// Real-time crypto price service
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
  image: string;
}

export const fetchCryptoPrices = async (): Promise<CryptoPrice[]> => {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin,solana&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto prices');
    }
    
    const data = await response.json();
    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      volume_24h: coin.total_volume,
      image: coin.image
    }));
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    // Fallback to mock data
    return [
      {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        current_price: 45000,
        price_change_percentage_24h: 2.5,
        market_cap: 850000000000,
        volume_24h: 25000000000,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
      },
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        current_price: 3200,
        price_change_percentage_24h: -1.2,
        market_cap: 380000000000,
        volume_24h: 15000000000,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
      },
      {
        id: 'tether',
        symbol: 'USDT',
        name: 'Tether',
        current_price: 1.00,
        price_change_percentage_24h: 0.1,
        market_cap: 95000000000,
        volume_24h: 45000000000,
        image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png'
      },
      {
        id: 'binancecoin',
        symbol: 'BNB',
        name: 'Binance Coin',
        current_price: 320,
        price_change_percentage_24h: 3.8,
        market_cap: 48000000000,
        volume_24h: 1200000000,
        image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png'
      },
      {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        current_price: 95,
        price_change_percentage_24h: 5.2,
        market_cap: 42000000000,
        volume_24h: 2800000000,
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
      }
    ];
  }
};

export const getCryptoPrice = async (symbol: string): Promise<number> => {
  const prices = await fetchCryptoPrices();
  const crypto = prices.find(p => p.symbol === symbol.toUpperCase());
  return crypto?.current_price || 0;
};