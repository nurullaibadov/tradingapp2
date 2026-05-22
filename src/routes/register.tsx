import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AuthShell } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Sign up — Nova" }] }),
  component: RegisterPage,
});

const schema = z.object({
  displayName: z.string().trim().min(2, "Name too short").max(50),
  email: z.string().email().max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
});

function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ displayName, email, password });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { display_name: displayName } },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — check your email to confirm");
    navigate({ to: "/login" });
  };

  return <AuthShell title="Create your account" subtitle="Start trading in minutes">
    <form onSubmit={submit} className="space-y-4">
      <div><Label>Display name</Label><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required maxLength={50} /></div>
      <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></div>
      <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" /></div>
      <Button type="submit" disabled={loading} className="w-full bg-gradient-hero shadow-glow text-primary-foreground hover:opacity-90 h-11">
        {loading ? "Creating…" : "Create account"}
      </Button>
      <p className="text-sm text-center text-muted-foreground">
        Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </form>
  </AuthShell>;
}
