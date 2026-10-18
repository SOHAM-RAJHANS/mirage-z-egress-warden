import { createFileRoute } from "@tanstack/react-router";
import {
  Binary,
  Bug,
  Fingerprint,
  ShieldAlert,
  ShieldCheck,
  Waypoints,
} from "lucide-react";
import { ActionButton, Badge, EmptyState, Panel, Shell, Stat } from "@/components/shell";
import { formatMs, percentile, type PipelineEvent } from "@/lib/mirage/api";
import { SIM_STEPS, useSoc } from "@/stores/soc";

export const Route = createFileRoute("/")({ component: Command });

const LAYERS = [
  { n: "01", name: "Ingest Engine", info: "Single-pass Aho-Corasick scan", icon: Waypoints, key: "l1" },
  { n: "02", name: "Decoy Engine", info: "Luhn / ISO-97 attributable decoys", icon: Bug, key: "l2" },
  { n: "03", name: "Agent Sandbox", info: "Zero-raw-PII tokenized context", icon: Fingerprint, key: "l3" },
  { n: "04", name: "Egress Warden", info: "Deterministic 5-channel verdict", icon: ShieldAlert, key: "l4" },
  { n: "05", name: "Hash Ledger", info: "SHA-256 Merkle audit chain", icon: Binary, key: "l5" },
] as const;

function latestLatency(event: PipelineEvent | null, key: (typeof LAYERS)[number]["key"]): string {
  if (!event) return "—";
  const breakdown = event.latency_breakdown_ms;
  switch (key) {
    case "l1":
      return formatMs(breakdown.l1_ingest);
    case "l2":
      return formatMs(breakdown.l2_decoy);
    case "l3":
      return event.layer1_matches.length === 0 ? "clean" : `${event.layer1_matches.length} masked`;
    case "l4":
      return formatMs(breakdown.l4_warden);
    default:
      return formatMs(breakdown.l5_merkle);
  }
}

function Command() {
  const connection = useSoc((s) => s.connection);
  const health = useSoc((s) => s.health);
  const metrics = useSoc((s) => s.metrics);
  const events = useSoc((s) => s.events);
  const egress = useSoc((s) => s.egress);
  const decoys = useSoc((s) => s.decoys);
  const lastEvent = useSoc((s) => s.lastEvent);
  const sessionLatencies = useSoc((s) => s.sessionLatencies);
  const chainOk = useSoc((s) => s.chainOk);
  const layer = useSoc((s) => s.selectedLayer);
  const setLayer = useSoc((s) => s.setLayer);
  const idx = useSoc((s) => s.simIndex);
  const status = useSoc((s) => s.simStatus);
  const launch = useSoc((s) => s.launch);
  const pause = useSoc((s) => s.pause);
  const resume = useSoc((s) => s.resume);
  const reset = useSoc((s) => s.resetSim);
  const step = useSoc((s) => s.step);
  const replay = useSoc((s) => s.replay);

  const blocked = egress.filter((row) => row.verdict === "BLOCK").length;
  const p50 = percentile(sessionLatencies, 50);
  const p95 = percentile(sessionLatencies, 95);
  const activeLayer =
    idx < 0 ? -1 : idx <= 1 ? 0 : idx === 2 ? 2 : idx === 3 ? 3 : idx === 4 ? 3 : 4;
  const bootstrapped = connection !== "connecting";

  return (
    <Shell title="Command Center">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] text-accent">MIRAGE-Z · COMMAND CENTER</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
            Autonomous Zero-Trust Egress Warden
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Five deterministic in-memory layers scan untrusted context, replace regulated identifiers
            with checksum-valid attributable decoys, and block tainted egress before an autonomous
            agent can exfiltrate data.
          </p>
        </div>
        <div className="rounded-md border border-line bg-card px-3 py-2 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className={connection === "live" ? "text-mint" : connection === "offline" ? "text-crit" : "text-warn"}>
              {connection === "live" ? "LIVE" : connection === "offline" ? "OFFLINE" : "CONNECTING"}
            </span>
            <span className="text-muted">·</span>
            <span className="text-fg">{health?.node_arch ?? "gateway"}</span>
          </div>
          <div className="mt-1 text-muted">
            v{health?.version ?? "1.0.0"} · uptime {health ? `${Math.round(health.uptime_seconds)}s` : "—"} · pipeline{" "}
            {metrics ? `${metrics.p95_latency_ms.toFixed(2)} ms p95 target` : "—"}
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <ActionButton variant="primary" onClick={() => void launch()} disabled={status === "running"}>
          {status === "running" ? "Live demo running…" : "Launch live demo"}
        </ActionButton>
        <ActionButton onClick={pause} disabled={status !== "running"}>
          Pause
        </ActionButton>
        <ActionButton onClick={resume} disabled={status !== "paused"}>
          Resume
        </ActionButton>
        <ActionButton onClick={() => void step()} disabled={status === "running"}>
          Step
        </ActionButton>
        <ActionButton onClick={() => void replay()}>Replay</ActionButton>
        <ActionButton variant="ghost" onClick={reset}>
          Reset
        </ActionButton>
        <span className="ml-auto font-mono text-[11px] text-muted">
          demo drives the live gateway · {SIM_STEPS.length} steps
        </span>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Stat
          label="Pipeline events evaluated"
          value={health ? health.stats.events_evaluated.toLocaleString() : "—"}
          unit="gateway lifetime"
          tone="accent"
          hint={health ? `${health.stats.events_broadcast} broadcast` : undefined}
        />
        <Stat
          label="Merkle ledger blocks"
          value={(health?.ledger.total_blocks ?? 0).toLocaleString()}
          unit="SHA-256 chain"
          tone={chainOk === false ? "crit" : "mint"}
          hint={chainOk === false ? "integrity broken" : "chain intact"}
        />
        <Stat
          label="Exfil blocked this session"
          value={blocked}
          unit="outbound calls"
          tone={blocked > 0 ? "crit" : "default"}
          hint={`${egress.length} inspected`}
        />
        <Stat label="Session p50 latency" value={p50 === null ? "—" : formatMs(p50)} unit="pipeline ms" hint="this console" />
        <Stat
          label="Session p95 latency"
          value={p95 === null ? "—" : formatMs(p95)}
          unit="pipeline ms"
          tone={p95 !== null && p95 < 2 ? "mint" : "default"}
          hint={metrics ? `canonical ${metrics.p95_latency_ms} ms` : undefined}
        />
        <Stat
          label="Honey decoys registered"
          value={health?.tripwires ?? decoys.length}
          unit="O(1) tripwires"
          tone="warn"
          hint={lastEvent ? `${lastEvent.layer2_decoys.length} in last event` : undefined}
        />
      </div>

      <Panel
        title="Five-layer deterministic pipeline · live telemetry"
        action={
          <span className="font-mono text-[10px] text-muted">
            last event {lastEvent ? lastEvent.event_id.slice(0, 8) : "—"}
          </span>
        }
      >
        <div className="overflow-x-auto">
          <div className="flex min-w-[760px] items-stretch gap-2">
            {LAYERS.map((layerDef, i) => {
              const Icon = layerDef.icon;
              const hot = i === activeLayer && status !== "idle";
              const blockedLayer = i === 3 && idx >= 4;
              return (
                <button
                  key={layerDef.n}
                  type="button"
                  onClick={() => setLayer(layer === i ? null : i)}
                  className={`flex-1 rounded-md border p-3 text-left transition-colors ${
                    hot ? "border-accent bg-elev" : "border-line bg-bg-2 hover:border-accent/40"
                  } ${blockedLayer ? "ring-1 ring-crit/60" : ""}`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-accent">
                    <span>LAYER {layerDef.n}</span>
                    <span className={hot ? "text-accent" : "text-muted"}>{hot ? "ACTIVE" : "STANDBY"}</span>
                  </div>
                  <Icon className="my-2 size-4 text-muted" aria-hidden />
                  <div className="text-sm font-medium">{layerDef.name}</div>
                  <div className="text-[11px] text-muted">{layerDef.info}</div>
                  <div className="tnum mt-2 font-mono text-[11px] text-fg">{latestLatency(lastEvent, layerDef.key)}</div>
                </button>
              );
            })}
          </div>
        </div>
        <svg viewBox="0 0 760 16" className="mt-3 h-4 w-full" aria-hidden>
          <line x1="20" y1="8" x2="740" y2="8" className="flow-dash" strokeWidth="1.5" />
        </svg>
        {layer !== null ? (
          <p className="mt-3 rounded-md border border-line bg-bg-2 p-3 text-sm text-muted">
            <span className="text-fg">{LAYERS[layer].name}</span> — {LAYERS[layer].info}. Every evaluation
            executes all five layers inside the gateway; this panel exposes their measured latency and
            telemetry for the most recent event.
          </p>
        ) : (
          <p className="mt-3 text-xs text-muted">
            Layer specifics: L1 detects spans, L2 mints decoys, L3 keeps raw PII out of agent context,
            L4 renders the egress verdict, L5 records the decision on the Merkle chain.
          </p>
        )}
        <ol className="mt-3 grid gap-1 text-[12px] text-muted md:grid-cols-2">
          {SIM_STEPS.map((stepLabel, i) => (
            <li key={stepLabel} className={i === idx ? "text-accent" : ""}>
              {i + 1}. {stepLabel}
            </li>
          ))}
        </ol>
      </Panel>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Recent security timeline">
          {events.length === 0 ? (
            <EmptyState
              title={bootstrapped ? "No pipeline events yet" : "Connecting to the gateway…"}
              hint={
                bootstrapped
                  ? "Launch the live demo or run an evaluation from the Ingestion page to populate the SOC timeline."
                  : "The console will replay the gateway's recent events as soon as the SSE stream connects."
              }
            />
          ) : (
            <ul className="divide-y divide-line">
              {events.slice(0, 8).map((event) => (
                <li key={event.id} className="flex flex-wrap items-center gap-2 py-2 text-sm first:pt-0 last:pb-0">
                  <span className="font-mono text-[11px] text-muted">{event.id}</span>
                  <span className="truncate">{event.type}</span>
                  <Badge v={event.severity} />
                  <span className="ml-auto font-mono text-[11px] text-muted">{event.destination}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Session verifications">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-mint" />
              <span className="text-muted">Zero raw PII in agent context</span>
              <span className="ml-auto font-mono text-[11px] text-mint">
                {lastEvent ? (lastEvent.taint_flag ? "taint isolated" : "trusted") : "—"}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-crit" />
              <span className="text-muted">Decoy egress blocked</span>
              <span className="ml-auto font-mono text-[11px] text-crit">{blocked}</span>
            </li>
            <li className="flex items-center gap-2">
              <Binary className="size-4 text-info" />
              <span className="text-muted">Merkle chain</span>
              <span className="ml-auto font-mono text-[11px] text-info">
                {chainOk === null ? "unverified" : chainOk ? "intact" : "broken"}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Fingerprint className="size-4 text-warn" />
              <span className="text-muted">Checksum-valid decoys</span>
              <span className="ml-auto font-mono text-[11px] text-warn">
                {decoys.length > 0 ? `${decoys.filter((decoy) => decoy.valid).length}/${decoys.length}` : "—"}
              </span>
            </li>
          </ul>
          <p className="mt-3 border-t border-line pt-3 text-[11px] text-muted">
            The console renders only data returned by the live gateway. There is no local verdict
            engine, so an offline state is shown explicitly rather than fabricated results.
          </p>
        </Panel>
      </div>
    </Shell>
  );
}
