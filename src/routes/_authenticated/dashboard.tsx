import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceChart } from "@/components/PriceChart";
import { useAuth } from "@/lib/providers";
import { markets, formatMoney } from "@/lib/market-data";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Nova" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const portfolio = [
    { ...markets[0], amount: 0.4521 },
    { ...markets[1], amount: 3.21 },
    { ...markets[2], amount: 28.5 },
  ];
  const totalValue = portfolio.reduce((sum, p) => sum + p.amount * p.price, 0);
  const change24h = 2.87;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.email?.split("@")[0]}</h1>
            <p className="text-muted-foreground mt-1">Here's your portfolio at a glance.</p>
          </div>
          <Button asChild className="bg-gradient-hero shadow-glow text-primary-foreground"><Link to="/trade">Trade now</Link></Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2 rounded-2xl border border-border bg-gradient-card p-6 shadow-elegant">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Total balance</div>
              <Wallet className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-4xl font-bold font-mono">{formatMoney(totalValue)}</div>
            <div className={`text-sm font-mono mt-1 flex items-center gap-1 ${change24h >= 0 ? "ticker-up" : "ticker-down"}`}>
              {change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {change24h >= 0 ? "+" : ""}{change24h.toFixed(2)}% today
            </div>
            <div className="mt-6">
              <PriceChart basePrice={totalValue} color="var(--color-primary)" height={200} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-card p-6 space-y-4">
            <h3 className="font-semibold">Quick actions</h3>
            <Button asChild className="w-full justify-between"><Link to="/trade"><span>Trade</span><ArrowUpRight className="w-4 h-4" /></Link></Button>
            <Button asChild variant="outline" className="w-full justify-between"><Link to="/wallet"><span>Deposit</span><ArrowDownRight className="w-4 h-4" /></Link></Button>
            <Button asChild variant="outline" className="w-full justify-between"><Link to="/wallet"><span>Withdraw</span><ArrowUpRight className="w-4 h-4" /></Link></Button>
            <Button asChild variant="outline" className="w-full justify-between"><Link to="/markets"><span>Browse markets</span><ArrowUpRight className="w-4 h-4" /></Link></Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-card overflow-hidden">
          <h3 className="font-semibold p-6 pb-3">Your assets</h3>
          <div className="grid grid-cols-12 gap-2 px-6 py-3 text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
            <div className="col-span-4">Asset</div>
            <div className="col-span-3 text-right">Holdings</div>
            <div className="col-span-3 text-right">Value</div>
            <div className="col-span-2 text-right">24h</div>
          </div>
          {portfolio.map((p) => (
            <div key={p.symbol} className="grid grid-cols-12 gap-2 px-6 py-4 items-center border-b border-border last:border-0">
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center font-bold">{p.icon}</div>
                <div><div className="font-semibold text-sm">{p.name}</div><div className="text-xs text-muted-foreground">{p.symbol}</div></div>
              </div>
              <div className="col-span-3 text-right font-mono">{p.amount.toFixed(4)}</div>
              <div className="col-span-3 text-right font-mono">{formatMoney(p.amount * p.price)}</div>
              <div className={`col-span-2 text-right font-mono ${p.change >= 0 ? "ticker-up" : "ticker-down"}`}>{p.change >= 0 ? "+" : ""}{p.change.toFixed(2)}%</div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
