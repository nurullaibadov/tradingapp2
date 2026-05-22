import { Link, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, Globe, Menu, X, Zap, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useTheme, useI18n, useAuth, type Lang } from "@/lib/providers";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

const langs: { code: Lang; label: string }[] = [
  { code: "en", label: "English" }, { code: "es", label: "Español" }, { code: "ar", label: "العربية" }, { code: "zh", label: "中文" },
];

export function Header() {
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useI18n();
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: "/markets", label: t("nav.markets") },
    { to: "/trade", label: t("nav.trade") },
    ...(user ? [{ to: "/dashboard", label: t("nav.dashboard") }, { to: "/wallet", label: t("nav.wallet") }] : []),
    ...(isAdmin ? [{ to: "/admin", label: t("nav.admin") }] : []),
  ];

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-hero shadow-glow flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight">Nova</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="language"><Globe className="w-5 h-5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {langs.map((l) => (
                <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)} className={lang === l.code ? "bg-accent" : ""}>
                  {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={toggle} aria-label="theme">
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  {user.email?.split("@")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link to="/dashboard">{t("nav.dashboard")}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/wallet">{t("nav.wallet")}</Link></DropdownMenuItem>
                {isAdmin && <DropdownMenuItem asChild><Link to="/admin">{t("nav.admin")}</Link></DropdownMenuItem>}
                <DropdownMenuItem onClick={signOut}><LogOut className="w-4 h-4 mr-2" />{t("nav.logout")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild><Link to="/login">{t("nav.login")}</Link></Button>
              <Button size="sm" className="bg-gradient-hero shadow-glow text-primary-foreground hover:opacity-90" asChild>
                <Link to="/register">{t("nav.register")}</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-md hover:bg-muted text-sm font-medium">
                {l.label}
              </Link>
            ))}
            {!user && (
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" asChild><Link to="/login">{t("nav.login")}</Link></Button>
                <Button className="flex-1 bg-gradient-hero text-primary-foreground" asChild><Link to="/register">{t("nav.register")}</Link></Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
