import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { markets, formatMoney } from "@/lib/market-data";
import { ArrowDownToLine, ArrowUpFromLine, Copy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/wallet")({
  head: () => ({ meta: [{ title: "Wallet — Nova" }] }),
  component: WalletPage,
});

function WalletPage() {
  const holdings = [
    { ...markets[0], amount: 0.4521 },
    { ...markets[1], amount: 3.21 },
    { ...markets[2], amount: 28.5 },
    { ...markets[6], amount: 5200 },
  ];
  const addr = "0x9aF7e4B2a4D6c3aD5E8f1234567890aBcDef0123";
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Wallet</h1>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-gradient-card overflow-hidden">
            <div className="p-6 pb-3 font-semibold">Balances</div>
            {holdings.map((h) => (
              <div key={h.symbol} className="grid grid-cols-12 gap-2 px-6 py-4 items-center border-t border-border">
                <div className="col-span-6 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center font-bold">{h.icon}</div>
                  <div><div className="font-semibold text-sm">{h.name}</div><div className="text-xs text-muted-foreground">{h.symbol.split("/")[0]}</div></div>
                </div>
                <div className="col-span-3 text-right font-mono text-sm">{h.amount.toFixed(4)}</div>
                <div className="col-span-3 text-right font-mono text-sm text-muted-foreground">{formatMoney(h.amount * h.price)}</div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-gradient-card p-6">
            <Tabs defaultValue="deposit">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="deposit"><ArrowDownToLine className="w-4 h-4 mr-1.5" />Deposit</TabsTrigger>
                <TabsTrigger value="withdraw"><ArrowUpFromLine className="w-4 h-4 mr-1.5" />Withdraw</TabsTrigger>
              </TabsList>
              <TabsContent value="deposit" className="space-y-4 mt-4">
                <div><Label>Asset</Label><Input value="BTC" disabled /></div>
                <div>
                  <Label>Deposit address</Label>
                  <div className="flex gap-2">
                    <Input value={addr} readOnly className="font-mono text-xs" />
                    <Button size="icon" variant="outline" onClick={() => { navigator.clipboard.writeText(addr); toast.success("Copied"); }}><Copy className="w-4 h-4" /></Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Send only BTC to this address. Minimum deposit: 0.0001 BTC.</p>
              </TabsContent>
              <TabsContent value="withdraw" className="space-y-4 mt-4">
                <div><Label>Asset</Label><Input value="BTC" /></div>
                <div><Label>Destination address</Label><Input placeholder="0x…" /></div>
                <div><Label>Amount</Label><Input placeholder="0.00" /></div>
                <Button className="w-full bg-gradient-hero text-primary-foreground" onClick={() => toast.success("Withdrawal request submitted")}>Withdraw</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
