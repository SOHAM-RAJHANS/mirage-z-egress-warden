import { createFileRoute } from "@tanstack/react-router";
import { Badge, EmptyState, Panel, Shell, Stat } from "@/components/shell";
import { formatMs, percentile } from "@/lib/mirage/api";
import { useSoc } from "@/stores/soc";

export const Route = createFileRoute("/egress")({ component: Egress });

function Egress() {
  const rows = useSoc((s) => s.egress);
  const connection = useSoc((s) => s.connection);
  const q = useSoc((s) => s.query).toLowerCase();
  const sel = useSoc((s) => s.selectedEgress);
  const setEgress = useSoc((s) => s.setEgress);
  const filtered = rows.filter((row) =>
    `${row.id} ${row.agent} ${row.destination} ${row.rule}`.toLowerCase().includes(q)
  );
  const open = rows.find((row) => row.id === sel);
  const blocked = rows.filter((row) => row.verdict === "BLOCK").length;
  const allowed = rows.filter((row) => row.verdict === "ALLOW" || row.verdict === "REVIEW").length;
  const l4Latencies = rows.map((row) => row.ms);
  const p50 = percentile(l4Latencies, 50);
  const p95 = percentile(l4Latencies, 95);

  return (
    <Shell title="Egress Warden">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-3xl text-sm text-muted">
          Layer 4 is the enforcement point. It canonicalizes outbound tool calls across five
          obfuscation channels (delimiter stripping, Base64, URL encoding, hex, reversal) and renders a
          deterministic verdict against the live tripwire registry — no model sits on this path.
        </p>
        <Badge v={connection === "live" ? "LIVE" : "OFFLINE"} />
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Calls inspected" value={rows.length} unit="this console session" />
        <Stat label="Blocked" value={blocked} tone={blocked > 0 ? "crit" : "default"} unit="tripwire or tainted egress" />
        <Stat label="Allowed / detokenized" value={allowed} unit="authorized paths" tone="mint" />
        <Stat
          label="Warden p50 / p95"
          value={`${p50 === null ? "—" : formatMs(p50)} / ${p95 === null ? "—" : formatMs(p95)}`}
          unit="Layer 4 latency"
          tone="accent"
        />
      </div>

      <div className="overflow-x-auto rounded-md border border-line bg-card">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-line bg-bg-2/60 font-mono text-[11px] text-muted">
            <tr>
              <th className="px-3 py-2">Request</th>
              <th className="px-3 py-2">Agent</th>
              <th className="px-3 py-2">Destination</th>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Rule</th>
              <th className="px-3 py-2">Verdict</th>
              <th className="px-3 py-2">Latency</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.id}
                className="cursor-pointer border-t border-line/70 hover:bg-bg-2/60"
                onClick={() => setEgress(row.id)}
              >
                <td className="px-3 py-2 font-mono text-xs">{row.id}</td>
                <td className="px-3 py-2 text-xs">{row.agent}</td>
                <td className="px-3 py-2 text-xs">{row.destination}</td>
                <td className="px-3 py-2 font-mono text-[11px] text-muted">{row.ts}</td>
                <td className="px-3 py-2 font-mono text-[11px]">{row.rule}</td>
                <td className="px-3 py-2"><Badge v={row.verdict} /></td>
                <td className="tnum px-3 py-2 font-mono text-xs">{formatMs(row.ms)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-4">
            <EmptyState
              title={rows.length === 0 ? "No outbound calls observed" : "No calls match this filter"}
              hint={
                rows.length === 0
                  ? "Launch the live demo or run the golden suite; every evaluated tool call appears here with its real verdict."
                  : "Adjust the console search query."
              }
            />
          </div>
        )}
      </div>

      {open && (
        <Panel title="Request inspection" className="mt-4">
          <p className="text-sm">
            Rule <span className="font-mono">{open.rule}</span> produced <Badge v={open.verdict} /> for{" "}
            {open.agent} → <span className="font-mono">{open.destination}</span>.
          </p>
          <p className="mt-2 text-sm text-muted">
            {open.verdict === "BLOCK"
              ? "Match resolved against a registered honey-decoy tripwire; the outbound call was terminated before transmission. The SHA-256 ledger records the decision."
              : "No tripwire hit and no unapproved external egress; the call was allowed by the deterministic rule ladder."}
          </p>
          <button type="button" className="mt-2 text-xs text-accent" onClick={() => setEgress(null)}>
            Close
          </button>
        </Panel>
      )}
    </Shell>
  );
}
