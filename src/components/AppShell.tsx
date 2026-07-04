import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Factory,
  Film,
  Brain,
  BarChart3,
  CalendarDays,
  CreditCard,
  Settings,
  Search,
  Bell,
  Command,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/content-factory", label: "Content Factory", icon: Factory },
  { to: "/clips", label: "Generated Clips", icon: Film },
  { to: "/learning", label: "Learning Engine", icon: Brain, badge: "AI" },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/publishing", label: "Publishing", icon: CalendarDays },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 px-5 border-b border-sidebar-border">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="absolute inset-0 rounded-lg bg-primary/20 blur-md -z-10" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight">AutoEvolve</span>
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Content OS</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="px-2 mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Workspace
        </div>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors ${
                    active
                      ? "bg-sidebar-accent text-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-primary"
                    />
                  )}
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  {"badge" in item && item.badge && (
                    <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-3 rounded-lg border border-sidebar-border bg-card p-3">
        <div className="flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_#22C55E]" />
          <span className="text-muted-foreground">Learning Engine</span>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-semibold tracking-tight tabular-nums">—</span>
          <span className="text-xs text-muted-foreground">/100 score</span>
        </div>
        <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary" style={{ width: "0%" }} />
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">No data yet</div>
      </div>
    </aside>
  );
}

function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h1 className="text-sm font-semibold tracking-tight truncate">{title}</h1>
          {subtitle && (
            <span className="text-xs text-muted-foreground truncate">— {subtitle}</span>
          )}
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground w-72">
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1">Search anything…</span>
        <kbd className="flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
          <Command className="h-2.5 w-2.5" /> K
        </kbd>
      </div>

      <button className="relative rounded-md border border-border bg-card p-2 text-muted-foreground hover:text-foreground transition">
        <Bell className="h-4 w-4" />
        <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_#22C55E]" />
      </button>

      <button className="flex items-center gap-2 rounded-md border border-border bg-card pl-1 pr-2 py-1 hover:bg-sidebar-accent transition">
        <div className="h-6 w-6 rounded bg-gradient-to-br from-primary to-emerald-700 grid place-items-center text-[10px] font-semibold text-primary-foreground">
          ?
        </div>
        <span className="text-xs">Account</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
    </header>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={title} subtitle={subtitle} />
        <motion.main
          key={title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex-1 p-6 lg:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card relative overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const positive = delta?.startsWith("+");
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {Icon && (
          <div className="rounded-md bg-muted p-1.5">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{value}</span>
        {delta && (
          <span
            className={`text-xs font-medium tabular-nums ${
              positive ? "text-primary" : "text-destructive"
            }`}
          >
            {delta}
          </span>
        )}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </Card>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
