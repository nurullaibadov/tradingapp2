export type Market = {
  symbol: string;
  name: string;
  price: number;
  change: number; // percent
  volume: number;
  marketCap: number;
  icon: string;
};

const seed = [
  { symbol: "BTC/USDT", name: "Bitcoin", price: 67432.21, change: 2.34, volume: 28400000000, marketCap: 1330000000000, icon: "₿" },
  { symbol: "ETH/USDT", name: "Ethereum", price: 3521.78, change: 1.12, volume: 14200000000, marketCap: 423000000000, icon: "Ξ" },
  { symbol: "SOL/USDT", name: "Solana", price: 178.45, change: 5.67, volume: 3200000000, marketCap: 82000000000, icon: "◎" },
  { symbol: "BNB/USDT", name: "BNB", price: 612.34, change: -0.89, volume: 1800000000, marketCap: 89000000000, icon: "◆" },
  { symbol: "XRP/USDT", name: "XRP", price: 0.5832, change: -1.45, volume: 2100000000, marketCap: 32000000000, icon: "✕" },
  { symbol: "ADA/USDT", name: "Cardano", price: 0.4521, change: 3.21, volume: 890000000, marketCap: 16000000000, icon: "₳" },
  { symbol: "DOGE/USDT", name: "Dogecoin", price: 0.1623, change: 7.89, volume: 1500000000, marketCap: 23000000000, icon: "Ð" },
  { symbol: "AVAX/USDT", name: "Avalanche", price: 38.92, change: 4.12, volume: 720000000, marketCap: 15000000000, icon: "▲" },
  { symbol: "DOT/USDT", name: "Polkadot", price: 7.23, change: -2.11, volume: 410000000, marketCap: 10000000000, icon: "●" },
  { symbol: "LINK/USDT", name: "Chainlink", price: 14.56, change: 1.78, volume: 580000000, marketCap: 8600000000, icon: "⬡" },
  { symbol: "MATIC/USDT", name: "Polygon", price: 0.7234, change: 0.45, volume: 390000000, marketCap: 7100000000, icon: "⬢" },
  { symbol: "UNI/USDT", name: "Uniswap", price: 9.87, change: -0.67, volume: 260000000, marketCap: 5900000000, icon: "🦄" },
];

export const markets: Market[] = seed;

export function generateChartData(basePrice: number, points = 60) {
  const data: { time: string; price: number }[] = [];
  let price = basePrice * 0.97;
  for (let i = 0; i < points; i++) {
    price = price * (1 + (Math.random() - 0.48) * 0.012);
    data.push({
      time: `${String(Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`,
      price: Number(price.toFixed(2)),
    });
  }
  return data;
}

export function formatMoney(n: number) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}
