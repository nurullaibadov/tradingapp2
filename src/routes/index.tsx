import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Zap, Shield, BarChart3, Globe, Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MarketTicker } from "@/components/MarketTicker";
import { PriceChart } from "@/components/PriceChart";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/providers";
import { markets, formatMoney } from "@/lib/market-data";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const { t } = useI18n();
  const top = markets.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MarketTicker />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-glow pointer-events-none" />
        <div
          className="absolute inset-0 opacity-30 dark:opacity-50 pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})`, maskImage: "linear-gradient(180deg, black 0%, transparent 100%)" }}
        />
        <div className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur text-xs font-medium mb-6 animate-pulse-glow">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {t("hero.tag")}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              <span className="text-gradient">{t("hero.title")}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">{t("hero.sub")}</p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-gradient-hero shadow-glow text-primary-foreground hover:opacity-90 h-12 px-6" asChild>
                <Link to="/register">{t("hero.cta")} <ArrowRight className="ml-1 w-4 h-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6" asChild>
                <Link to="/markets">{t("hero.cta2")}</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              { v: "$84B", k: t("stats.volume") },
              { v: "2.4M+", k: t("stats.users") },
              { v: "600+", k: t("stats.pairs") },
              { v: "99.99%", k: t("stats.uptime") },
            ].map((s) => (
              <div key={s.k} className="p-5 rounded-2xl border border-border bg-gradient-card backdrop-blur">
                <div className="text-2xl md:text-3xl font-bold text-gradient">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-[1fr_360px] gap-4">
          <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-elegant">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-muted-foreground">BTC / USDT</div>
                <div className="text-3xl font-bold font-mono">{formatMoney(markets[0].price)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">24h Change</div>
                <div className="text-lg font-mono ticker-up flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> +2.34%
                </div>
              </div>
            </div>
            <PriceChart basePrice={markets[0].price} />
          </div>

          <div className="rounded-2xl border border-border bg-gradient-card p-4">
            <h3 className="font-semibold mb-3 px-2">Top movers</h3>
            <div className="space-y-1">
              {top.map((m) => (
                <Link key={m.symbol} to="/markets" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center font-bold">{m.icon}</div>
                    <div>
                      <div className="font-medium text-sm">{m.symbol}</div>
                      <div className="text-xs text-muted-foreground">{m.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">{formatMoney(m.price)}</div>
                    <div className={`text-xs font-mono ${m.change >= 0 ? "ticker-up" : "ticker-down"}`}>
                      {m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{t("features.title")}</h2>
          <p className="text-muted-foreground text-lg">{t("features.sub")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { i: Zap, t: t("f1.t"), d: t("f1.d") },
            { i: Shield, t: t("f2.t"), d: t("f2.d") },
            { i: BarChart3, t: t("f3.t"), d: t("f3.d") },
            { i: Globe, t: t("f4.t"), d: t("f4.d") },
          ].map((f, i) => (
            <div key={i} className="group p-6 rounded-2xl border border-border bg-gradient-card hover:shadow-glow transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-hero shadow-glow flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.i className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.t}</h3>
              <p className="text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-border p-12 md:p-20 text-center bg-gradient-hero">
          <div className="absolute inset-0 bg-glow" />
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4">{t("cta.title")}</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">{t("cta.sub")}</p>
            <Button size="lg" variant="secondary" className="h-12 px-8" asChild>
              <Link to="/register">{t("hero.cta")} <ArrowRight className="ml-1 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
