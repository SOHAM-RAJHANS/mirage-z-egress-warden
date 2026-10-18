import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ActionButton, Badge, Panel, Shell, Stat } from "@/components/shell";
import { useTheme, type ThemePref } from "@/components/theme";
import { formatMs } from "@/lib/mirage/api";
import { useSoc } from "@/stores/soc";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

const THEMES: { id: ThemePref; label: string }[] = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
  { id: "system", label: "System" },
];

function SettingsPage() {
  const gatewayUrl = useSoc((s) => s.gatewayUrl);
  const setGatewayUrl = useSoc((s) => s.setGatewayUrl);
  const health = useSoc((s) => s.health);
  const metrics = useSoc((s) => s.metrics);
  const connection = useSoc((s) => s.connection);
  const golden = useSoc((s) => s.golden);
  const refresh = useSoc((s) => s.refreshTelemetry);
  const { pref, setPref } = useTheme();
  const [url, setUrl] = useState(gatewayUrl);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const ok = await setGatewayUrl(url);
    setMessage(ok ? "Gateway reachable — console reconnected." : "Could not reach that gateway. Check the URL and that the backend is running.");
    setSaving(false);
  };

  return (
    <Shell title="Settings">
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Gateway connection">
          <label className="block text-sm">
            <span className="text-muted">Backend base URL</span>
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="mt-1 w-full rounded-md border border-line bg-bg px-3 py-2 font-mono text-sm"
              placeholder="http://localhost:8000"
              spellCheck={false}
            />
          </label>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ActionButton variant="primary" onClick={() => void save()} disabled={saving}>
              {saving ? "Testing…" : "Save & test connection"}
            </ActionButton>
            <ActionButton variant="ghost" onClick={() => void refresh()}>
              Refresh telemetry
            </ActionButton>
            <Badge v={connection === "live" ? "LIVE" : connection === "offline" ? "OFFLINE" : "CONNECTING"} />
          </div>
          {message && <p className="mt-3 text-xs text-muted">{message}</p>}
          <p className="mt-3 border-t border-line pt-3 text-[11px] text-muted">
            Stored locally in this browser. The default is the value built from{" "}
            <span className="font-mono">VITE_MIRAGE_API_URL</span>, falling back to{" "}
            <span className="font-mono">http://localhost:8000</span>.
          </p>
        </Panel>

        <Panel title="Appearance">
          <p className="mb-2 text-sm text-muted">Theme preference is persisted locally.</p>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setPref(theme.id)}
                className={`rounded-md border px-3 py-2 text-sm ${
                  pref === theme.id ? "border-accent text-accent" : "border-line text-muted hover:text-fg"
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Gateway diagnostics" className="xl:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Status" value={health?.status ?? "—"} tone={health?.status === "ok" ? "mint" : "warn"} unit={health?.node_arch ?? "gateway"} />
            <Stat label="Version" value={health?.version ?? "—"} unit="gateway build" />
            <Stat label="Ledger blocks" value={health?.ledger.total_blocks.toLocaleString() ?? "—"} unit={`chain ${health?.ledger.chain_intact ? "intact" : "unverified"}`} />
            <Stat label="Uptime" value={health ? `${Math.round(health.uptime_seconds)}s` : "—"} unit="process" />
            <Stat label="Events evaluated" value={health?.stats.events_evaluated.toLocaleString() ?? "—"} unit="lifetime" />
            <Stat label="Replay buffer" value={health?.replay_buffer_events ?? "—"} unit="SSE events retained" />
            <Stat label="Tripwires" value={health?.tripwires ?? "—"} unit="O(1) registry" />
            <Stat label="Golden fixtures" value={golden.length || "—"} unit="locked cases" />
          </div>
          <div className="mt-3 grid gap-2 text-xs text-muted sm:grid-cols-2">
            <span>
              Canonical p95 target:{" "}
              <span className="font-mono text-fg">{metrics ? formatMs(metrics.p95_latency_ms) : "—"}</span>
            </span>
            <span>
              Current subscribers:{" "}
              <span className="font-mono text-fg">{health?.subscribers ?? "—"}</span>
            </span>
          </div>
        </Panel>

        <Panel title="About this deployment" className="xl:col-span-2">
          <ul className="space-y-2 text-sm text-muted">
            <li>
              MIRAGE-Z is an autonomous zero-trust egress warden: a deterministic five-layer in-memory
              pipeline on IBM LinuxONE s390x with cryptographic auditability.
            </li>
            <li>
              Enforcement path: ingestion ({`~0.25 ms`}), decoy minting ({`~0.40 ms`}), structural scoring
              ({`<0.30 ms`}), egress verdict ({`~0.51 ms`}), Merkle ledger ({`~0.25 ms`}).
            </li>
            <li>
              The console consumes the following contracts:{" "}
              <span className="font-mono text-xs">
                /v1/mirage/evaluate, /v1/mirage/stream, /v1/mirage/ledger, /v1/mirage/metrics,
                /v1/mirage/golden-suite, /health
              </span>
              .
            </li>
            <li>IBM Z Datathon 2026 · Theme 2: AI Secured (Innovation Without Exposure).</li>
          </ul>
        </Panel>
      </div>
    </Shell>
  );
}
