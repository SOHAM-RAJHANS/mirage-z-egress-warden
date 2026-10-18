import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Binary,
  Bug,
  ChevronLeft,
  FlaskConical,
  Gauge,
  Hexagon,
  LayoutDashboard,
  Menu,
  Radar,
  Search,
  Settings,
  Shield,
  Siren,
  Waypoints,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { ThemeSwitcher } from "@/components/theme";
import { SIM_STEPS, useSoc } from "@/stores/soc";

const NAV = [
  { to: "/", label: "Command Center", icon: LayoutDashboard },
  { to: "/threats", label: "Live Threat Monitor", icon: Siren },
  { to: "/ingestion", label: "Ingestion Engine", icon: Waypoints },
  { to: "/decoys", label: "Honey Decoy Lab", icon: Bug },
  { to: "/agents", label: "Agent Sandbox", icon: Hexagon },
  { to: "/egress", label: "Egress Warden", icon: Shield },
  { to: "/ledger", label: "Cryptographic Ledger", icon: Binary },
  { to: "/benchmarks", label: "Performance Benchmarks", icon: Gauge },
  { to: "/evaluation", label: "Golden Evaluation Suite", icon: FlaskConical },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Shell({ title, children }: { title: string; children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const collapsed = useSoc((s) => s.collapsed);
  const toggle = useSoc((s) => s.toggleNav);
  const [mobileOpen, setMobileOpen] = useState(false);
  const query = useSoc((s) => s.query);
  const setQuery = useSoc((s) => s.setQuery);
  const notif = useSoc((s) => s.notifOpen);
  const setNotif = useSoc((s) => s.setNotif);
  const events = useSoc((s) => s.events);
  const egress = useSoc((s) => s.egress);
  const sim = useSoc((s) => s.simStatus);
  const idx = useSoc((s) => s.simIndex);
  const connection = useSoc((s) => s.connection);
  const health = useSoc((s) => s.health);
  const lastError = useSoc((s) => s.lastError);
  const dismissError = useSoc((s) => s.dismissError);
  const refresh = useSoc((s) => s.refreshTelemetry);
  const bootstrap = useSoc((s) => s.bootstrap);
  const gatewayUrl = useSoc((s) => s.gatewayUrl);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  const blocked = egress.filter((row) => row.verdict === "BLOCK").length;
  const statusLabel =
    connection === "live" ? "LIVE" : connection === "connecting" ? "CONNECTING" : "OFFLINE";
  const statusTone =
    connection === "live"
      ? "text-mint border-mint/40"
      : connection === "connecting"
        ? "text-warn border-warn/40"
        : "text-crit border-crit/40";
  const nodeArch = health?.node_arch ?? "—";
  const chain = health?.ledger.chain_intact;

  const navList = (onNavigate?: () => void) => (
    <nav className="flex-1 space-y-0.5 overflow-y-auto p-2" aria-label="Primary">
      {NAV.map((item) => {
        const on = path === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            title={item.label}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
              on ? "bg-elev text-accent ring-1 ring-accent/25" : "text-muted hover:bg-card hover:text-fg"
            }`}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{item.label}</span>
            {on && <span className="ml-auto size-1.5 rounded-full bg-accent" aria-hidden />}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="grid-bg flex min-h-screen bg-bg text-fg">
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-line bg-bg-2/95 backdrop-blur md:flex ${
          collapsed ? "md:w-16" : "md:w-64"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-line px-3 py-4">
          <span className="grid size-8 place-items-center rounded-md bg-accent/10 ring-1 ring-accent/30">
            <Radar className="size-4 text-accent" aria-hidden />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-wide">MIRAGE-Z</div>
              <div className="font-mono text-[10px] tracking-[0.18em] text-muted">EGRESS WARDEN</div>
            </div>
          )}
        </div>
        {navList()}
        <div className="space-y-2 border-t border-line p-2">
          {!collapsed && (
            <div className="rounded-md border border-line bg-card px-2.5 py-2 font-mono text-[10px] leading-relaxed text-muted">
              <div className="flex items-center justify-between gap-2">
                <span>NODE</span>
                <span className="truncate text-fg" title={nodeArch}>{nodeArch}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span>CHAIN</span>
                <span className={chain ? "text-mint" : "text-crit"}>
                  {chain === undefined ? "—" : chain ? "INTACT" : "BROKEN"}
                </span>
              </div>
              <div className="mt-1 truncate" title={gatewayUrl}>{gatewayUrl}</div>
            </div>
          )}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-md border border-line py-2 text-xs text-muted hover:text-fg"
            onClick={toggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={`size-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-line bg-bg-2">
            <div className="flex items-center justify-between border-b border-line px-3 py-4">
              <div>
                <div className="text-sm font-semibold tracking-wide">MIRAGE-Z</div>
                <div className="font-mono text-[10px] tracking-[0.18em] text-muted">EGRESS WARDEN</div>
              </div>
              <button type="button" className="rounded-md border border-line p-1.5" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
                <X className="size-4" />
              </button>
            </div>
            {navList(() => setMobileOpen(false))}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-line bg-bg/85 px-4 py-3 backdrop-blur">
          <button
            type="button"
            className="rounded-md border border-line px-2 py-1.5 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-label="Open navigation"
          >
            <Menu className="size-4" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold">{title}</h1>
            <div className="hidden font-mono text-[10px] text-muted sm:block">
              IBM LinuxONE s390x · deterministic egress control
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] ${statusTone}`}>
            <span className={`size-1.5 rounded-full ${connection === "live" ? "bg-mint pulse-dot" : connection === "offline" ? "bg-crit" : "bg-warn"}`} />
            {statusLabel}
          </span>
          <span className="hidden items-center gap-1.5 font-mono text-[11px] text-muted lg:inline-flex">
            <Activity className="size-3 text-info" />
            {health ? `${health.stats.events_evaluated} evaluated · ${health.ledger.total_blocks} ledger blocks` : "waiting for gateway"}
          </span>
          <label className="ml-auto flex min-w-40 flex-1 items-center gap-2 rounded-md border border-line bg-card px-2.5 py-1.5 md:max-w-xs">
            <Search className="size-3.5 shrink-0 text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter this view"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
              aria-label="Search"
            />
          </label>
          <button
            type="button"
            className="relative rounded-md border border-line px-2.5 py-1.5 text-xs hover:text-fg"
            onClick={() => setNotif(!notif)}
            aria-expanded={notif}
          >
            Alerts
            <span className="ml-1.5 rounded bg-crit/15 px-1.5 py-0.5 font-mono text-[10px] text-crit">{blocked}</span>
          </button>
          <ThemeSwitcher />
        </header>

        {lastError && (
          <div className="border-b border-crit/30 bg-crit/10 px-4 py-2 text-xs text-crit" role="alert">
            <span className="font-mono">GATEWAY</span> · {lastError}
            <button type="button" className="ml-3 underline decoration-dotted" onClick={() => void refresh()}>
              Retry
            </button>
            <button type="button" className="ml-3 underline decoration-dotted" onClick={dismissError}>
              Dismiss
            </button>
          </div>
        )}

        {notif && (
          <div className="border-b border-line bg-card px-4 py-2 text-sm" role="region" aria-label="Notifications">
            {events.length === 0 ? (
              <span className="text-muted">No pipeline events yet. Run an evaluation from the Command Center.</span>
            ) : (
              <span>
                Latest: <span className="text-fg">{events[0]?.type}</span>{" "}
                <span className="font-mono text-[11px] text-muted">
                  {events[0]?.rule} · {events[0]?.id}
                </span>
              </span>
            )}
            <button type="button" className="ml-3 text-xs text-accent" onClick={() => setNotif(false)}>
              Dismiss
            </button>
          </div>
        )}

        {sim !== "idle" && (
          <div className="border-b border-accent/25 bg-accent/8 px-4 py-2 font-mono text-[11px] text-accent">
            Simulation {sim} · step {Math.max(idx + 1, 0)}/{SIM_STEPS.length}
            {idx >= 0 ? ` — ${SIM_STEPS[idx]}` : ""}
          </div>
        )}

        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>

        <footer className="border-t border-line px-4 py-3 font-mono text-[10px] text-muted md:px-6">
          MIRAGE-Z · IBM Z Datathon 2026 · deterministic 5-layer pipeline · no neural model on the egress path
        </footer>
      </div>
    </div>
  );
}

export function Panel({
  title,
  children,
  className = "",
  action,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={`lift rounded-md border border-line bg-card p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

const BADGE_TONES: Record<string, string> = {
  ALLOW: "text-mint border-mint/40 bg-mint/10",
  BLOCK: "text-crit border-crit/40 bg-crit/10",
  REVIEW: "text-warn border-warn/40 bg-warn/10",
  ALLOWED_CLEAN: "text-mint border-mint/40 bg-mint/10",
  ALLOWED_DETOKENIZED: "text-info border-info/40 bg-info/10",
  BLOCKED_HONEY_TRIPWIRE: "text-crit border-crit/40 bg-crit/10",
  BLOCKED_TAINTED_EGRESS: "text-warn border-warn/40 bg-warn/10",
  DETECT_TAMPERING: "text-crit border-crit/40 bg-crit/10",
  CRITICAL: "text-crit border-crit/40 bg-crit/10",
  HIGH: "text-warn border-warn/40 bg-warn/10",
  MEDIUM: "text-info border-info/40 bg-info/10",
  LOW: "text-muted border-line bg-elev",
  INFO: "text-info border-info/30 bg-info/5",
  RUNNING: "text-info border-info/40 bg-info/10",
  IDLE: "text-muted border-line",
  BLOCKED: "text-crit border-crit/40 bg-crit/10",
};

export function Badge({ v }: { v: string }) {
  return (
    <span className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] ${BADGE_TONES[v] ?? "text-muted border-line"}`}>
      {v.replaceAll("_", " ")}
    </span>
  );
}

export function Stat({
  label,
  value,
  unit,
  tone = "default",
  hint,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  tone?: "default" | "accent" | "mint" | "crit" | "warn";
  hint?: string;
}) {
  const toneClass =
    tone === "accent"
      ? "text-accent"
      : tone === "mint"
        ? "text-mint"
        : tone === "crit"
          ? "text-crit"
          : tone === "warn"
            ? "text-warn"
            : "text-fg";
  return (
    <div className="lift rounded-md border border-line bg-card p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className={`tnum mt-1 font-mono text-2xl ${toneClass}`}>{value}</div>
      <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-muted">
        <span>{unit ?? "\u00A0"}</span>
        {hint && <span className="truncate">{hint}</span>}
      </div>
    </div>
  );
}

export function ActionButton({
  children,
  onClick,
  variant = "secondary",
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const classes: Record<string, string> = {
    primary: "bg-accent text-on hover:brightness-110 border border-accent",
    secondary: "border border-line bg-card hover:border-accent/50",
    danger: "border border-crit/40 bg-crit/10 text-crit hover:bg-crit/15",
    ghost: "border border-transparent text-muted hover:text-fg hover:border-line",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${classes[variant]}`}
    >
      {children}
    </button>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-md border border-dashed border-line bg-bg-2/60 px-4 py-8 text-center">
      <p className="text-sm font-medium text-fg">{title}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}
