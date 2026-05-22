import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

// ============ Theme ============
type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("theme")) as Theme | null;
    const initial = saved || "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);
  const toggle = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
      return next;
    });
  };
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

// ============ i18n ============
export type Lang = "en" | "es" | "ar" | "zh";
const dict: Record<Lang, Record<string, string>> = {
  en: {
    "nav.markets": "Markets", "nav.trade": "Trade", "nav.dashboard": "Dashboard", "nav.wallet": "Wallet", "nav.admin": "Admin",
    "nav.login": "Sign in", "nav.register": "Get started", "nav.logout": "Sign out",
    "hero.tag": "The next generation exchange",
    "hero.title": "Trade the future of finance",
    "hero.sub": "Lightning-fast execution, deep liquidity, and institutional-grade security. Built for traders who demand more.",
    "hero.cta": "Start trading", "hero.cta2": "Explore markets",
    "stats.volume": "24h Volume", "stats.users": "Active Traders", "stats.pairs": "Trading Pairs", "stats.uptime": "Uptime",
    "features.title": "A platform unlike any other",
    "features.sub": "Every detail engineered for performance, clarity, and trust.",
    "f1.t": "Sub-millisecond engine", "f1.d": "Our matching engine processes 1.4M orders per second with zero downtime.",
    "f2.t": "Bank-grade custody", "f2.d": "Multi-sig cold storage, SOC 2 certified, with $250M insurance fund coverage.",
    "f3.t": "Pro charting tools", "f3.d": "TradingView integration, 100+ indicators, custom strategy backtesting.",
    "f4.t": "Global liquidity", "f4.d": "Tightest spreads in the industry across 600+ trading pairs worldwide.",
    "cta.title": "Ready to begin?", "cta.sub": "Join over 2 million traders building wealth on Nova.",
    "footer.rights": "All rights reserved.",
  },
  es: {
    "nav.markets": "Mercados", "nav.trade": "Operar", "nav.dashboard": "Panel", "nav.wallet": "Cartera", "nav.admin": "Admin",
    "nav.login": "Iniciar sesión", "nav.register": "Empezar", "nav.logout": "Cerrar sesión",
    "hero.tag": "El intercambio de nueva generación",
    "hero.title": "Negocia el futuro de las finanzas",
    "hero.sub": "Ejecución ultrarrápida, liquidez profunda y seguridad institucional.",
    "hero.cta": "Empezar a operar", "hero.cta2": "Explorar mercados",
    "stats.volume": "Volumen 24h", "stats.users": "Traders activos", "stats.pairs": "Pares", "stats.uptime": "Disponibilidad",
    "features.title": "Una plataforma única", "features.sub": "Cada detalle diseñado para rendimiento y confianza.",
    "f1.t": "Motor sub-milisegundo", "f1.d": "1.4M órdenes por segundo sin tiempo de inactividad.",
    "f2.t": "Custodia bancaria", "f2.d": "Almacenamiento en frío multi-sig, certificado SOC 2.",
    "f3.t": "Gráficos profesionales", "f3.d": "TradingView, más de 100 indicadores, backtesting.",
    "f4.t": "Liquidez global", "f4.d": "Spreads más estrechos en 600+ pares.",
    "cta.title": "¿Listo para empezar?", "cta.sub": "Únete a 2 millones de traders en Nova.",
    "footer.rights": "Todos los derechos reservados.",
  },
  ar: {
    "nav.markets": "الأسواق", "nav.trade": "تداول", "nav.dashboard": "لوحة", "nav.wallet": "محفظة", "nav.admin": "المسؤول",
    "nav.login": "تسجيل الدخول", "nav.register": "ابدأ الآن", "nav.logout": "خروج",
    "hero.tag": "بورصة الجيل القادم", "hero.title": "تداول مستقبل المال",
    "hero.sub": "تنفيذ فائق السرعة وسيولة عميقة وأمان مؤسسي.",
    "hero.cta": "ابدأ التداول", "hero.cta2": "استكشف الأسواق",
    "stats.volume": "حجم 24س", "stats.users": "متداولون نشطون", "stats.pairs": "أزواج", "stats.uptime": "وقت التشغيل",
    "features.title": "منصة فريدة", "features.sub": "كل تفصيل مصمم للأداء والثقة.",
    "f1.t": "محرك دون مللي ثانية", "f1.d": "1.4 مليون أمر في الثانية.",
    "f2.t": "حفظ مصرفي", "f2.d": "تخزين بارد متعدد التواقيع، معتمد SOC 2.",
    "f3.t": "أدوات الرسم البياني", "f3.d": "تكامل TradingView وأكثر من 100 مؤشر.",
    "f4.t": "سيولة عالمية", "f4.d": "أضيق الفروق على 600+ زوج.",
    "cta.title": "جاهز للبدء؟", "cta.sub": "انضم إلى مليوني متداول على Nova.",
    "footer.rights": "كل الحقوق محفوظة.",
  },
  zh: {
    "nav.markets": "市场", "nav.trade": "交易", "nav.dashboard": "面板", "nav.wallet": "钱包", "nav.admin": "管理",
    "nav.login": "登录", "nav.register": "开始", "nav.logout": "退出",
    "hero.tag": "下一代交易所", "hero.title": "交易金融的未来",
    "hero.sub": "极速执行、深度流动性和机构级安全。",
    "hero.cta": "开始交易", "hero.cta2": "浏览市场",
    "stats.volume": "24小时成交量", "stats.users": "活跃交易者", "stats.pairs": "交易对", "stats.uptime": "正常运行",
    "features.title": "与众不同的平台", "features.sub": "每一处细节都为性能与信任而设计。",
    "f1.t": "亚毫秒引擎", "f1.d": "每秒处理 140 万笔订单。",
    "f2.t": "银行级托管", "f2.d": "多签冷存储，SOC 2 认证。",
    "f3.t": "专业图表", "f3.d": "TradingView、100+ 指标、策略回测。",
    "f4.t": "全球流动性", "f4.d": "600+ 交易对最窄点差。",
    "cta.title": "准备好了吗？", "cta.sub": "与超过 200 万交易者一起。",
    "footer.rights": "版权所有。",
  },
};

const I18nContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: "en", setLang: () => {}, t: (k) => k,
});
export const useI18n = () => useContext(I18nContext);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (saved && dict[saved]) {
      setLangState(saved);
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = saved;
    }
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = l;
  };
  const t = (k: string) => dict[lang][k] ?? dict.en[k] ?? k;
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

// ============ Auth ============
type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
};
const AuthContext = createContext<AuthCtx>({ user: null, session: null, loading: true, isAdmin: false });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user) {
        setTimeout(async () => {
          const { data } = await supabase.from("user_roles").select("role").eq("user_id", s.user.id);
          setIsAdmin(!!data?.some((r) => r.role === "admin"));
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
      if (s?.user) {
        supabase.from("user_roles").select("role").eq("user_id", s.user.id).then(({ data }) => {
          setIsAdmin(!!data?.some((r) => r.role === "admin"));
        });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, session, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
