import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { markets, formatMoney } from "@/lib/market-data";
import { TrendingUp, TrendingDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/markets")({
  head: () => ({ meta: [{ title: "Markets — Nova Exchange" }, { name: "description", content: "Browse 600+ trading pairs live on Nova." }] }),
  component: MarketsPage,
});

function MarketsPage() {
  const [q, setQ] = useState("");
  const filtered = markets.filter((m) => m.symbol.toLowerCase().includes(q.toLowerCase()) || m.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Markets</h1>
            <p className="text-muted-foreground mt-2">Real-time prices across all listed pairs.</p>
          </div>
          <div className="relative md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pair…" className="pl-9" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-card overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-6 py-3 text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
            <div className="col-span-5 md:col-span-4">Pair</div>
            <div className="col-span-3 md:col-span-2 text-right">Price</div>
            <div className="col-span-4 md:col-span-2 text-right">24h</div>
            <div className="hidden md:block md:col-span-2 text-right">Volume</div>
            <div className="hidden md:block md:col-span-2 text-right">Market Cap</div>
          </div>
          {filtered.map((m) => (
            <Link key={m.symbol} to="/trade" className="grid grid-cols-12 gap-2 px-6 py-4 items-center hover:bg-muted/50 transition-colors border-b border-border last:border-0">
              <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center font-bold">{m.icon}</div>
                <div>
                  <div className="font-semibold text-sm">{m.symbol}</div>
                  <div className="text-xs text-muted-foreground">{m.name}</div>
                </div>
              </div>
              <div className="col-span-3 md:col-span-2 text-right font-mono">{formatMoney(m.price)}</div>
              <div className={`col-span-4 md:col-span-2 text-right font-mono inline-flex items-center justify-end gap-1 ${m.change >= 0 ? "ticker-up" : "ticker-down"}`}>
                {m.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%
              </div>
              <div className="hidden md:block md:col-span-2 text-right font-mono text-sm text-muted-foreground">{formatMoney(m.volume)}</div>
              <div className="hidden md:block md:col-span-2 text-right font-mono text-sm text-muted-foreground">{formatMoney(m.marketCap)}</div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
