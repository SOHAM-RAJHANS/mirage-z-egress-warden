import { createFileRoute } from "@tanstack/react-router";
import { Badge, EmptyState, Panel, Shell, Stat } from "@/components/shell";
import { useSoc } from "@/stores/soc";

export const Route = createFileRoute("/agents")({ component: Agents });

function Agents() {
  const agents = useSoc((s) => s.agents);
  const events = useSoc((s) => s.events);
  const connection = useSoc((s) => s.connection);
  const sel = useSoc((s) => s.selectedAgent);
  const setAgent = useSoc((s) => s.setAgent);
  const open = agents.find((agent) => agent.id === sel) ?? agents[0];

  const blockedCalls = agents.reduce(
    (total, agent) => total + agent.calls.filter((call) => call.kind === "unauthorized").length,
    0
  );
  const totalCalls = agents.reduce((total, agent) => total + agent.calls.length, 0);
  const recentBlocked = events.filter((event) => event.severity === "CRITICAL").slice(0, 4);

  return (
    <Shell title="Agent Sandbox">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-3xl text-sm text-muted">
          The sandbox is the zero-raw-PII boundary: agents receive tokenized context, never the vaulted
          identifiers. Every tool call they attempt is canonicalized and judged by the deterministic
          egress warden before it can leave the process.
        </p>
        <Badge v={connection === "live" ? "LIVE" : "OFFLINE"} />
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Declared agents" value={agents.length} unit="tool policies" tone="accent" />
        <Stat label="Observed tool calls" value={totalCalls} unit="this console session" />
        <Stat label="Blocked calls" value={blockedCalls} tone={blockedCalls > 0 ? "crit" : "mint"} unit="terminated by warden" />
        <Stat label="Raw PII in context" value="0" tone="mint" unit="tokenized by design" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Panel title="Agent policies">
          <ul className="space-y-2">
            {agents.map((agent) => (
              <li key={agent.id}>
                <button
                  type="button"
                  onClick={() => setAgent(agent.id)}
                  className={`w-full rounded-md border p-3 text-left transition-colors ${
                    open?.id === agent.id ? "border-accent bg-bg-2" : "border-line hover:border-accent/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{agent.name}</span>
                    <Badge v={agent.status.toUpperCase()} />
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-muted">{agent.id}</div>
                  <div className="mt-1 text-[11px] text-muted">{agent.permissions.join(" · ")}</div>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        {open ? (
          <Panel title={`Inspection · ${open.id}`}>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span>Status <Badge v={open.status.toUpperCase()} /></span>
              <span className="text-muted">Permissions:</span>
              <span className="font-mono text-xs">{open.permissions.join(", ")}</span>
            </div>
            <h3 className="mt-4 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
              Tool timeline (observed from live pipeline events)
            </h3>
            {open.calls.length === 0 ? (
              <div className="mt-2">
                <EmptyState
                  title="No tool calls observed for this agent yet"
                  hint="Launch the live demo or run a golden case; resolved egress rows appear here in real time."
                />
              </div>
            ) : (
              <ol className="mt-2 space-y-2">
                {open.calls
                  .slice()
                  .reverse()
                  .map((call, index) => (
                    <li key={`${call.tool}-${index}`} className="rounded-md border border-line bg-bg-2 p-2 text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs">{call.tool}</span>
                        <Badge v={call.kind.toUpperCase() === "AUTHORIZED" ? "ALLOWED_CLEAN" : "BLOCKED_HONEY_TRIPWIRE"} />
                      </div>
                      <div className="mt-1 break-all text-xs text-muted">{call.detail}</div>
                    </li>
                  ))}
              </ol>
            )}
          </Panel>
        ) : (
          <Panel title="Inspection">
            <EmptyState title="Select an agent" hint="Choose a declared agent policy to inspect its tool timeline." />
          </Panel>
        )}
      </div>

      <Panel title="Recent warden interceptions" className="mt-4">
        {recentBlocked.length === 0 ? (
          <EmptyState
            title="No interceptions in this session"
            hint="Blocked tool calls from the live stream are listed here with their rule and destination."
          />
        ) : (
          <ul className="divide-y divide-line text-sm">
            {recentBlocked.map((event) => (
              <li key={event.id} className="flex flex-wrap items-center gap-2 py-2">
                <span className="font-mono text-[11px] text-muted">{event.id}</span>
                <span>{event.type}</span>
                <span className="font-mono text-[11px] text-muted">{event.destination}</span>
                <span className="ml-auto font-mono text-[11px] text-crit">{event.rule}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </Shell>
  );
}
