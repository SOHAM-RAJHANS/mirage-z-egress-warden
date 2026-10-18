import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Badge, EmptyState, Panel, Shell } from "@/components/shell";
import { useTheme } from "@/components/theme";
import type { Severity } from "@/lib/mirage/engine";
import { useSoc } from "@/stores/soc";

export const Route = createFileRoute("/threats")({ component: Threats });

const SEV = ["INFO", "LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

function Threats() {
  const events = useSoc((s) => s.events);
  const connection = useSoc((s) => s.connection);
  const q = useSoc((s) => s.query).toLowerCase();
  const sel = useSoc((s) => s.selectedEvent);
  const setEvent = useSoc((s) => s.setEvent);
  const [sev, setSev] = useState<string>("ALL");
  const { resolved } = useTheme();
  const fills =
    resolved === "light"
      ? ["#55657c", "#0e7490", "#b45309", "#047857", "#be123c"]
      : ["#8fa2bd", "#06b6d4", "#f59e0b", "#10b981", "#fb7185"];
  const filtered = events.filter(
    (event) =>
      (sev === "ALL" || event.severity === sev) &&
      `${event.type} ${event.agentId} ${event.rule} ${event.id} ${event.destination}`
        .toLowerCase()
        .includes(q)
  );
  const dist = SEV.map((severity) => ({
    name: severity,
    value: events.filter((event) => event.severity === severity).length,
  }));
  const open = events.find((event) => event.id === sel);

  return (
    <Shell title="Live Threat Monitor">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-3xl text-sm text-muted">
          Real-time timeline fed by the gateway's zero-drop SSE stream. Every row is a pipeline event
          produced by Layers 1–5; sensitive values arrive already masked.
        </p>
        <Badge v={connection === "live" ? "LIVE" : "OFFLINE"} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["ALL", ...SEV].map((severity) => (
          <button
            key={severity}
            type="button"
            onClick={() => setSev(severity)}
            className={`rounded-md border px-2.5 py-1.5 font-mono text-[11px] ${
              sev === severity ? "border-accent text-accent" : "border-line text-muted hover:text-fg"
            }`}
          >
            {severity}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <Panel title="Severity mix">
          {events.length === 0 ? (
            <EmptyState title="No events yet" hint="Launch the live demo to stream real pipeline events." />
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dist} dataKey="value" nameKey="name" innerRadius={42} outerRadius={68} strokeWidth={0}>
                    {dist.map((entry, index) => (
                      <Cell key={`${resolved}-${entry.name}`} fill={fills[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>
        <Panel title="Events">
          {filtered.length === 0 ? (
            <EmptyState
              title={events.length === 0 ? "Waiting for the live stream" : "No events match this filter"}
              hint={
                events.length === 0
                  ? "The SSE stream replays the most recent events on connect; then every evaluation appears here instantly."
                  : "Adjust the severity filter or the console search query."
              }
            />
          ) : (
            <ul className="max-h-[520px] space-y-2 overflow-auto pr-1">
              {filtered.map((event) => (
                <li key={event.id}>
                  <button
                    type="button"
                    className="w-full rounded-md border border-line bg-bg-2 p-3 text-left transition-colors hover:border-accent/40"
                    onClick={() => setEvent(event.id)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] text-muted">{event.id}</span>
                      <Badge v={event.severity as Severity} />
                      <span className="text-sm">{event.type}</span>
                      <span className="ml-auto font-mono text-[11px] text-muted">{event.ledgerId ?? "—"}</span>
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-muted">
                      {event.ts} · {event.agentId} · {event.source} → {event.destination}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {open && (
        <Panel title="Incident drawer" className="mt-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-muted">Event</dt><dd className="font-mono">{open.id}</dd></div>
            <div><dt className="text-muted">Time</dt><dd className="font-mono">{open.ts}</dd></div>
            <div><dt className="text-muted">Agent</dt><dd>{open.agentId}</dd></div>
            <div><dt className="text-muted">Rule</dt><dd className="font-mono text-xs">{open.rule}</dd></div>
            <div><dt className="text-muted">Decision</dt><dd><Badge v={open.decision} /></dd></div>
            <div><dt className="text-muted">Ledger entry</dt><dd className="font-mono">{open.ledgerId ?? "—"}</dd></div>
            <div className="sm:col-span-2"><dt className="text-muted">Masked preview</dt><dd className="break-all">{open.preview}</dd></div>
          </dl>
          <button type="button" className="mt-3 text-xs text-accent" onClick={() => setEvent(null)}>
            Close
          </button>
        </Panel>
      )}
    </Shell>
  );
}
