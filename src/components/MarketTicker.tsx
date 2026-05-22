import { markets, formatMoney } from "@/lib/market-data";
import { TrendingUp, TrendingDown } from "lucide-react";

export function MarketTicker() {
  return (
    <div className="border-y border-border bg-card/30 overflow-hidden">
      <div className="flex gap-8 animate-[scroll_60s_linear_infinite] py-3 whitespace-nowrap">
        {[...markets, ...markets].map((m, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{m.symbol}</span>
            <span className="font-mono">{formatMoney(m.price)}</span>
            <span className={`flex items-center gap-0.5 font-mono ${m.change >= 0 ? "ticker-up" : "ticker-down"}`}>
              {m.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
