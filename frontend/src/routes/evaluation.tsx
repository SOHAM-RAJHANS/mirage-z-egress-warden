import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ActionButton, Badge, EmptyState, Panel, Shell, Stat } from "@/components/shell";
import { formatMs } from "@/lib/mirage/api";
import { useSoc } from "@/stores/soc";

export const Route = createFileRoute("/evaluation")({ component: EvalPage });

function EvalPage() {
  const golden = useSoc((s) => s.golden);
  const goldenState = useSoc((s) => s.goldenState);
  const goldenRunning = useSoc((s) => s.goldenRunning);
  const goldenRunAt = useSoc((s) => s.goldenRunAt);
  const connection = useSoc((s) => s.connection);
  const runOne = useSoc((s) => s.runOneEval);
  const runAll = useSoc((s) => s.runAllEval);
  const reset = useSoc((s) => s.resetEval);
  const [only, setOnly] = useState<"all" | "open" | "fail">("all");
  const [open, setOpen] = useState<string | null>(null);

  const rows = golden.filter((entry) =>
    only === "open" ? entry.pass === undefined : only === "fail" ? entry.pass === false : true
  );
  const detail = golden.find((entry) => entry.id === open);
  const passed = golden.filter((entry) => entry.pass === true).length;
  const failed = golden.filter((entry) => entry.pass === false).length;
  const pending = golden.filter((entry) => entry.pass === undefined).length;
  const passRate = passed + failed > 0 ? Math.round((passed / (passed + failed)) * 1000) / 10 : null;

  return (
    <Shell title="Golden Evaluation Suite">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-3xl text-sm text-muted">
          The locked 20-case Role 5 golden suite, executed live against{" "}
          <span className="font-mono text-xs">POST /v1/mirage/evaluate</span>. Expected verdicts come
          from <span className="font-mono text-xs">benchmarks/mirage_golden_20_suite.json</span> via the
          gateway; actual verdicts are the pipeline's own responses.
        </p>
        <Badge v={connection === "live" ? "LIVE" : "OFFLINE"} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <ActionButton variant="primary" onClick={() => void runAll()} disabled={goldenRunning || golden.length === 0}>
          {goldenRunning ? "Running live suite…" : "Run full suite"}
        </ActionButton>
        <ActionButton onClick={reset} disabled={goldenRunning}>
          Reset results
        </ActionButton>
        {(["all", "open", "fail"] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setOnly(filter)}
            className={`rounded-md border px-3 py-2 text-sm capitalize ${
              only === filter ? "border-accent text-accent" : "border-line text-muted hover:text-fg"
            }`}
          >
            {filter}
          </button>
        ))}
        <span className="ml-auto font-mono text-[11px] text-muted">
          {goldenRunAt ? `last run ${new Date(goldenRunAt).toLocaleTimeString()}` : "not run in this session"}
        </span>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Cases in suite" value={golden.length || "—"} unit="locked fixtures" />
        <Stat label="Passed" value={passed} tone="mint" unit="actual === expected" />
        <Stat label="Failed" value={failed} tone={failed > 0 ? "crit" : "default"} unit="regressions" />
        <Stat
          label="Pass rate"
          value={passRate === null ? "—" : `${passRate}%`}
          tone={passRate === null ? "default" : passRate >= 100 ? "mint" : "warn"}
          unit={`${pending} pending`}
        />
      </div>

      <div className="overflow-x-auto rounded-md border border-line bg-card">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-line bg-bg-2/60 font-mono text-[11px] text-muted">
            <tr>
              <th className="px-3 py-2">Case</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Expected</th>
              <th className="px-3 py-2">Actual</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Latency</th>
              <th className="px-3 py-2">Ledger</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((entry) => (
              <tr key={entry.id} className="border-t border-line/70">
                <td className="px-3 py-2 font-mono text-xs">{entry.id}</td>
                <td className="px-3 py-2 text-xs text-muted">{entry.category}</td>
                <td className="px-3 py-2"><Badge v={entry.expected} /></td>
                <td className="px-3 py-2">{entry.actual ? <Badge v={entry.actual} /> : <span className="text-muted">—</span>}</td>
                <td className="px-3 py-2">
                  {entry.pass === undefined ? (
                    <span className="font-mono text-[11px] text-muted">pending</span>
                  ) : entry.pass ? (
                    <span className="font-mono text-[11px] text-mint">pass</span>
                  ) : (
                    <span className="font-mono text-[11px] text-crit">fail</span>
                  )}
                </td>
                <td className="tnum px-3 py-2 font-mono text-xs">{entry.ms === undefined ? "—" : formatMs(entry.ms)}</td>
                <td className="px-3 py-2 font-mono text-[11px] text-muted">{entry.merkleBlock ?? "—"}</td>
                <td className="space-x-2 px-3 py-2">
                  <button
                    type="button"
                    className="text-xs text-accent disabled:opacity-40"
                    disabled={goldenRunning}
                    onClick={() => void runOne(entry.id)}
                  >
                    Run
                  </button>
                  <button type="button" className="text-xs text-accent" onClick={() => setOpen(entry.id)}>
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="p-4">
            <EmptyState
              title={goldenState === "loading" ? "Loading golden suite from the gateway…" : "No cases match this filter"}
              hint={
                goldenState === "loading"
                  ? "The console is fetching /v1/mirage/golden-suite."
                  : golden.length === 0
                    ? "Start the gateway; the console loads the locked fixture set automatically."
                    : "Switch back to the All filter to see every case."
              }
            />
          </div>
        )}
      </div>

      {detail && (
        <Panel title={`Case detail · ${detail.id}`} className="mt-4">
          <p className="text-sm">{detail.scenario}</p>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
            <div><span className="text-muted">Expected</span> <Badge v={detail.expected} /></div>
            <div><span className="text-muted">Actual</span> {detail.actual ? <Badge v={detail.actual} /> : "—"}</div>
            <div><span className="text-muted">Merkle block</span> <span className="font-mono">{detail.merkleBlock ?? "—"}</span></div>
          </div>
          {detail.breakdown && (
            <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs text-muted sm:grid-cols-4">
              <span>L1 ingest {formatMs(detail.breakdown.l1_ingest)}</span>
              <span>L2 decoy {formatMs(detail.breakdown.l2_decoy)}</span>
              <span>L4 warden {formatMs(detail.breakdown.l4_warden)}</span>
              <span>L5 ledger {formatMs(detail.breakdown.l5_merkle)}</span>
            </div>
          )}
          <button type="button" className="mt-3 text-xs text-accent" onClick={() => setOpen(null)}>
            Close
          </button>
        </Panel>
      )}
    </Shell>
  );
}
