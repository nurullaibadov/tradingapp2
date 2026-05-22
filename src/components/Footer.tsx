import { Link } from "@tanstack/react-router";
import { Zap, Twitter, Github, Linkedin } from "lucide-react";
import { useI18n } from "@/lib/providers";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border bg-card/50 mt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Nova Exchange</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Institutional-grade infrastructure. Built for the next generation of finance.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          {[
            { title: "Product", links: [["Markets", "/markets"], ["Trade", "/trade"], ["Dashboard", "/dashboard"]] },
            { title: "Company", links: [["About", "/"], ["Blog", "/"], ["Careers", "/"]] },
            { title: "Legal", links: [["Terms", "/"], ["Privacy", "/"], ["Security", "/"]] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold mb-3 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(([label, to]) => (
                  <li key={label}><Link to={to} className="text-sm text-muted-foreground hover:text-foreground">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-10 pt-6 text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} Nova Exchange. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
