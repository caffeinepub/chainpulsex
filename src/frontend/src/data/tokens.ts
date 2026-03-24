export interface Token {
  rank: number;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  color: string;
  sparkline: number[];
}

export const tokens: Token[] = [
  {
    rank: 1,
    symbol: "BTC",
    name: "Bitcoin",
    price: 67420.5,
    change24h: 2.34,
    change7d: 5.12,
    marketCap: 1.32e12,
    volume24h: 28.5e9,
    color: "#F7931A",
    sparkline: [62000, 63500, 65000, 64200, 66800, 67000, 67420],
  },
  {
    rank: 2,
    symbol: "ETH",
    name: "Ethereum",
    price: 3510.2,
    change24h: -1.22,
    change7d: 3.45,
    marketCap: 421e9,
    volume24h: 14.2e9,
    color: "#627EEA",
    sparkline: [3200, 3350, 3480, 3300, 3550, 3520, 3510],
  },
  {
    rank: 3,
    symbol: "BNB",
    name: "BNB",
    price: 598.4,
    change24h: 1.05,
    change7d: 2.8,
    marketCap: 89e9,
    volume24h: 2.1e9,
    color: "#F3BA2F",
    sparkline: [560, 575, 590, 580, 595, 600, 598],
  },
  {
    rank: 4,
    symbol: "SOL",
    name: "Solana",
    price: 178.9,
    change24h: 4.67,
    change7d: 12.3,
    marketCap: 82e9,
    volume24h: 3.8e9,
    color: "#9945FF",
    sparkline: [148, 155, 162, 170, 175, 180, 178],
  },
  {
    rank: 5,
    symbol: "MATIC",
    name: "Polygon",
    price: 0.892,
    change24h: -2.45,
    change7d: -4.1,
    marketCap: 8.9e9,
    volume24h: 412e6,
    color: "#8247E5",
    sparkline: [0.95, 0.93, 0.91, 0.9, 0.89, 0.88, 0.89],
  },
  {
    rank: 6,
    symbol: "ADA",
    name: "Cardano",
    price: 0.458,
    change24h: 0.88,
    change7d: 1.2,
    marketCap: 16.2e9,
    volume24h: 380e6,
    color: "#0033AD",
    sparkline: [0.43, 0.44, 0.45, 0.46, 0.45, 0.46, 0.458],
  },
  {
    rank: 7,
    symbol: "DOT",
    name: "Polkadot",
    price: 7.82,
    change24h: -0.55,
    change7d: 2.1,
    marketCap: 10.5e9,
    volume24h: 210e6,
    color: "#E6007A",
    sparkline: [7.5, 7.6, 7.8, 7.7, 7.9, 7.85, 7.82],
  },
  {
    rank: 8,
    symbol: "AVAX",
    name: "Avalanche",
    price: 38.2,
    change24h: 3.2,
    change7d: 8.5,
    marketCap: 15.8e9,
    volume24h: 540e6,
    color: "#E84142",
    sparkline: [34, 35, 36, 37, 38, 39, 38.2],
  },
  {
    rank: 9,
    symbol: "LINK",
    name: "Chainlink",
    price: 14.55,
    change24h: 1.8,
    change7d: 5.4,
    marketCap: 8.5e9,
    volume24h: 320e6,
    color: "#2A5ADA",
    sparkline: [13, 13.5, 14, 14.2, 14.5, 14.6, 14.55],
  },
  {
    rank: 10,
    symbol: "UNI",
    name: "Uniswap",
    price: 10.2,
    change24h: -0.95,
    change7d: 3.2,
    marketCap: 7.7e9,
    volume24h: 180e6,
    color: "#FF007A",
    sparkline: [9.5, 9.8, 10, 10.3, 10.2, 10.1, 10.2],
  },
];

export function formatPrice(price: number): string {
  if (price >= 1000)
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  return `$${price.toFixed(4)}`;
}

export function formatMarketCap(val: number): string {
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  return `$${val.toFixed(0)}`;
}
