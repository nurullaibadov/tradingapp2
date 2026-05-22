import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/providers";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShieldOff, Users, Coins, Activity, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { markets, formatMoney } from "@/lib/market-data";

type ProfileRow = { id: string; display_name: string | null; username: string | null; created_at: string };

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Nova" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, loading, user } = useAuth();
  const [users, setUsers] = useState<ProfileRow[]>([]);

  useEffect(() => {
    if (isAdmin) {
      supabase.from("profiles").select("id,display_name,username,created_at").order("created_at", { ascending: false }).then(({ data }) => {
        setUsers(data ?? []);
      });
    }
  }, [isAdmin]);

  if (loading) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <ShieldOff className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold">Admin access required</h1>
          <p className="text-muted-foreground mt-2">Your account doesn't have admin privileges.</p>
          {user && (
            <Button
              variant="outline"
              className="mt-6"
              onClick={async () => {
                const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: "admin" });
                if (error) toast.error(error.message);
                else { toast.success("Admin role granted — refresh to apply"); }
              }}
            >
              <ShieldCheck className="w-4 h-4 mr-2" /> Grant myself admin (dev)
            </Button>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  const stats = [
    { i: Users, l: "Total users", v: users.length.toLocaleString() },
    { i: Coins, l: "Listed pairs", v: markets.length },
    { i: Activity, l: "24h volume", v: formatMoney(markets.reduce((s, m) => s + m.volume, 0)) },
    { i: ShieldCheck, l: "System status", v: "Operational" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Admin Panel</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.l} className="rounded-2xl border border-border bg-gradient-card p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{s.l}</div>
                <s.i className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold mt-2">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-gradient-card overflow-hidden">
            <div className="p-5 font-semibold border-b border-border">Users</div>
            <div className="max-h-96 overflow-auto">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-5 py-3 border-b border-border last:border-0 text-sm">
                  <div>
                    <div className="font-medium">{u.display_name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground font-mono">{u.id.slice(0, 12)}…</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</div>
                </div>
              ))}
              {users.length === 0 && <div className="p-5 text-sm text-muted-foreground">No users yet.</div>}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-card overflow-hidden">
            <div className="p-5 font-semibold border-b border-border">Markets</div>
            <div className="max-h-96 overflow-auto">
              {markets.map((m) => (
                <div key={m.symbol} className="flex items-center justify-between px-5 py-3 border-b border-border last:border-0 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm">{m.icon}</div>
                    <div>
                      <div className="font-medium">{m.symbol}</div>
                      <div className="text-xs text-muted-foreground">{m.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono">{formatMoney(m.price)}</div>
                    <div className="text-xs text-muted-foreground">Vol {formatMoney(m.volume)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
