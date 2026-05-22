import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceChart } from "@/components/PriceChart";
import { markets, formatMoney } from "@/lib/market-data";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/lib/providers";
import { toast } from "sonner";
import { TrendingUp, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/trade")({
  head: () => ({ meta: [{ title: "Trade — Nova Exchange" }] }),
  component: TradePage,
});

function TradePage() {
  const [selected, setSelected] = useState(markets[0]);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const { user } = useAuth();

  const orderBook = Array.from({ length: 10 }, (_, i) => ({
    askPrice: selected.price * (1 + (i + 1) * 0.0008),
    askSize: Math.random() * 5,
    bidPrice: selected.price * (1 - (i + 1) * 0.0008),
    bidSize: Math.random() * 5,
  }));

  const place = () => {
    if (!user) return toast.error("Please sign in to place orders");
    if (!amount || Number(amount) <= 0) return toast.error("Enter an amount");
    toast.success(`${side === "buy" ? "Buy" : "Sell"} order placed: ${amount} ${selected.symbol.split("/")[0]}`);
    setAmount("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Pair selector */}
          <aside className="col-span-12 lg:col-span-2 rounded-2xl border border-border bg-gradient-card p-2 max-h-[600px] overflow-auto">
            {markets.map((m) => (
              <button key={m.symbol} onClick={() => setSelected(m)} className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${selected.symbol === m.symbol ? "bg-accent" : "hover:bg-muted"}`}>
                <div className="font-semibold">{m.symbol}</div>
                <div className="flex justify-between text-xs mt-0.5">
                  <span className="font-mono text-muted-foreground">{formatMoney(m.price)}</span>
                  <span className={`font-mono ${m.change >= 0 ? "ticker-up" : "ticker-down"}`}>{m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%</span>
                </div>
              </button>
            ))}
          </aside>

          {/* Chart */}
          <div className="col-span-12 lg:col-span-7 rounded-2xl border border-border bg-gradient-card p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div>
                <div className="text-sm text-muted-foreground">{selected.name}</div>
                <div className="text-3xl font-bold font-mono">{formatMoney(selected.price)}</div>
              </div>
              <div className={`text-lg font-mono flex items-center gap-1 ${selected.change >= 0 ? "ticker-up" : "ticker-down"}`}>
                {selected.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {selected.change >= 0 ? "+" : ""}{selected.change.toFixed(2)}%
              </div>
            </div>
            <PriceChart basePrice={selected.price} height={400} />
          </div>

          {/* Order form */}
          <div className="col-span-12 lg:col-span-3 rounded-2xl border border-border bg-gradient-card p-5">
            <Tabs value={side} onValueChange={(v) => setSide(v as "buy" | "sell")}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="buy" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">Buy</TabsTrigger>
                <TabsTrigger value="sell" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">Sell</TabsTrigger>
              </TabsList>
              <TabsContent value="buy" className="mt-4 space-y-4">
                <OrderFields amount={amount} setAmount={setAmount} price={selected.price} />
                <Button onClick={place} className="w-full bg-success text-success-foreground hover:opacity-90">Buy {selected.symbol.split("/")[0]}</Button>
              </TabsContent>
              <TabsContent value="sell" className="mt-4 space-y-4">
                <OrderFields amount={amount} setAmount={setAmount} price={selected.price} />
                <Button onClick={place} className="w-full bg-destructive text-destructive-foreground hover:opacity-90">Sell {selected.symbol.split("/")[0]}</Button>
              </TabsContent>
            </Tabs>
          </div>

          {/* Order book */}
          <div className="col-span-12 rounded-2xl border border-border bg-gradient-card p-5">
            <h3 className="font-semibold mb-3">Order Book</h3>
            <div className="grid grid-cols-2 gap-6 text-xs font-mono">
              <div>
                <div className="grid grid-cols-2 text-muted-foreground mb-2"><span>Bid Price</span><span className="text-right">Size</span></div>
                {orderBook.map((o, i) => (
                  <div key={i} className="grid grid-cols-2 py-1">
                    <span className="ticker-up">{o.bidPrice.toFixed(2)}</span>
                    <span className="text-right">{o.bidSize.toFixed(4)}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="grid grid-cols-2 text-muted-foreground mb-2"><span>Ask Price</span><span className="text-right">Size</span></div>
                {orderBook.map((o, i) => (
                  <div key={i} className="grid grid-cols-2 py-1">
                    <span className="ticker-down">{o.askPrice.toFixed(2)}</span>
                    <span className="text-right">{o.askSize.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function OrderFields({ amount, setAmount, price }: { amount: string; setAmount: (v: string) => void; price: number }) {
  return (
    <>
      <div>
        <Label className="text-xs">Price (USDT)</Label>
        <Input value={price.toFixed(2)} disabled className="font-mono" />
      </div>
      <div>
        <Label className="text-xs">Amount</Label>
        <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="font-mono" inputMode="decimal" />
      </div>
      <div className="text-xs text-muted-foreground">
        Total: <span className="font-mono">${((Number(amount) || 0) * price).toFixed(2)}</span>
      </div>
    </>
  );
}
