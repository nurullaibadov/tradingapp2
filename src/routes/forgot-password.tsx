import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AuthShell } from "./login";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — Nova" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
    toast.success("Reset link sent");
  };
  return <AuthShell title="Reset password" subtitle="We'll email you a reset link">
    {sent ? (
      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground">Check your inbox for the reset link.</p>
        <Button asChild variant="outline" className="mt-4"><Link to="/login">Back to sign in</Link></Button>
      </div>
    ) : (
      <form onSubmit={submit} className="space-y-4">
        <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <Button type="submit" disabled={loading} className="w-full bg-gradient-hero text-primary-foreground h-11">{loading ? "Sending…" : "Send reset link"}</Button>
        <p className="text-sm text-center text-muted-foreground">
          <Link to="/login" className="text-primary hover:underline">Back to sign in</Link>
        </p>
      </form>
    )}
  </AuthShell>;
}
