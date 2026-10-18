import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, EmptyState, Panel, Shell, Stat } from "@/components/shell";
import { formatMs, formatUsd, percentile } from "@/lib/mirage/api";
import { useTheme } from "@/components/theme";
import { useSoc } from "@/stores/soc";

export const Route = createFileRoute("/benchmarks")({ component: Bench });

function Bench() {
  const { resolved } = useTheme();
  const metrics = useSoc((s) => s.metrics);
  const health = useSoc((s) => s.health);
  const latencies = useSoc((s) => s.sessionLatencies);
  const roundTrips = useSoc((s) => s.roundTrips);
  const connection = useSoc((s) => s.connection);

  const axis = resolved === "light" ? "#55657c" : "#8fa2bd";
  const primary = resolved === "light" ? "#047857" : "#10b981";
  const secondary = resolved === "light" ? "#b45309" : "#f59e0b";
  const p50 = percentile(latencies, 50);
  const p95 = percentile(latencies, 95);
  const p99 = percentile(latencies, 99);
  const trip50 = percentile(roundTrips, 50);
  const trip95 = percentile(roundTrips, 95);
  const chartData = metrics
    ? [
        { name: "Cloud guardrail", ms: metrics.cloud_baseline_ms },
        { name: "MIRAGE-Z p95", ms: metrics.p95_latency_ms },
      ]
    : [];

  return (
    <Shell title="Performance Benchmarks">
      <p className="mb-4 max-w-3xl text-sm text-muted">
        Canonical numbers are served by the gateway (<span className="font-mono text-xs">GET /v1/mirage/metrics</span>
        ), and session measurements are computed from the real pipeline events this console receives.
        The two are deliberately separated: targets are the locked Dossier 00 figures, observations are
        live telemetry.
      </p>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="Canonical gateway metrics · Dossier 00"
          action={<Badge v={connection === "live" ? "LIVE" : "OFFLINE"} />}
        >
          {metrics ? (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                <Stat label="p95 pipeline latency" value={`${metrics.p95_latency_ms.toFixed(2)} ms`} tone="mint" unit="in-memory target" />
                <Stat label="Cloud guardrail baseline" value={`${metrics.cloud_baseline_ms.toFixed(0)} ms`} tone="warn" unit="secondary LLM round-trip" />
                <Stat label="Speedup factor" value={metrics.speedup_factor} tone="accent" unit="versus cloud baseline" />
                <Stat label="Golden suite pass rate" value={`${metrics.golden_suite_pass_rate.toFixed(0)}%`} tone="mint" unit="20 locked cases" />
                <Stat label="Breach cost mitigated" value={formatUsd(metrics.breach_cost_mitigated_usd)} tone="accent" unit="per avoided incident" />
                <Stat label="Shadow-AI premium saved" value={formatUsd(metrics.shadow_ai_saved_usd)} tone="accent" unit="enterprise risk premium" />
              </div>
              <p className="mt-3 text-xs text-muted">
                Access-control gap closed:{" "}
                <span className="font-mono text-fg">{metrics.access_gap_closed_pct.toFixed(1)}%</span> · Node:{" "}
                <span className="font-mono text-fg">{health?.node_arch ?? "—"}</span>
              </p>
            </>
          ) : (
            <EmptyState
              title="Waiting for gateway metrics"
              hint="Start the FastAPI gateway on port 8000; this panel loads the locked canonical metrics automatically."
            />
          )}
        </Panel>

        <Panel title="Canonical latency versus cloud guardrail">
          {chartData.length > 0 ? (
            <>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 18, right: 68 }}>
                    <XAxis type="number" stroke={axis} fontSize={11} tickFormatter={(value) => `${value} ms`} />
                    <YAxis type="category" dataKey="name" stroke={axis} fontSize={11} width={110} />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                      formatter={(value) => [`${Number(value)} ms`, "latency"]}
                    />
                    <Bar dataKey="ms" radius={4}>
                      <LabelList
                        dataKey="ms"
                        position="right"
                        formatter={(value: number) => `${value} ms`}
                        fill={axis}
                        fontSize={11}
                      />
                      {chartData.map((entry, index) => (
                        <Cell key={entry.name} fill={index === 0 ? secondary : primary} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-muted">
                The 563× gap is the product thesis: a deterministic in-memory pipeline replaces the
                external LLM round-trip on the enforcement path.
              </p>
            </>
          ) : (
            <EmptyState title="No canonical metrics" hint="Connect the console to the gateway to load /v1/mirage/metrics." />
          )}
        </Panel>

        <Panel
          title="Observed in this console session"
          action={<Badge v={connection === "live" ? "LIVE" : "OFFLINE"} />}
        >
          {latencies.length === 0 ? (
            <EmptyState
              title="No session measurements yet"
              hint="Launch the live demo or run a golden case; every evaluation contributes real pipeline latency here."
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                <Stat label="Samples" value={latencies.length} unit="pipeline events" />
                <Stat label="p50 latency" value={p50 === null ? "—" : formatMs(p50)} tone="mint" />
                <Stat label="p95 latency" value={p95 === null ? "—" : formatMs(p95)} tone={p95 !== null && p95 < 2 ? "mint" : "warn"} />
                <Stat label="p99 latency" value={p99 === null ? "—" : formatMs(p99)} />
                <Stat label="Console round-trip p50" value={trip50 === null ? "—" : formatMs(trip50)} unit="browser ↔ gateway" />
                <Stat label="Console round-trip p95" value={trip95 === null ? "—" : formatMs(trip95)} unit="browser ↔ gateway" />
              </div>
              <p className="mt-3 text-xs text-muted">
                Pipeline latency comes from each event's{" "}
                <span className="font-mono">latency_breakdown_ms.total</span>; round-trip includes HTTP and
                browser scheduling on this machine.
              </p>
            </>
          )}
        </Panel>

        <Panel title="How to reproduce the full benchmark">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted">
            <li>
              Start the gateway:{" "}
              <code className="rounded bg-bg-2 px-1.5 py-0.5 font-mono text-xs text-fg">
                python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
              </code>
            </li>
            <li>
              Run the live harness:{" "}
              <code className="rounded bg-bg-2 px-1.5 py-0.5 font-mono text-xs text-fg">
                python benchmarks/run_benchmark.py
              </code>{" "}
              — evaluates 20 golden cases and 1,000 stress traces, verifies zero raw-PII leakage, the
              12-field event contract, live Merkle tamper/restore, and p95 latency.
            </li>
            <li>
              Run transport chaos:{" "}
              <code className="rounded bg-bg-2 px-1.5 py-0.5 font-mono text-xs text-fg">
                python benchmarks/chaos_test.py
              </code>{" "}
              — malformed bodies must return clean 422 envelopes.
            </li>
          </ol>
          <p className="mt-3 border-t border-line pt-3 font-mono text-[11px] text-muted">
            Gateway: {health ? `v${health.version} · ${health.node_arch}` : "not connected"} · metrics
            source: /v1/mirage/metrics · observations source: /v1/mirage/stream
          </p>
        </Panel>
      </div>
    </Shell>
  );
}
