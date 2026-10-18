import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ActionButton, Badge, EmptyState, Panel, Shell, Stat } from "@/components/shell";
import { useSoc } from "@/stores/soc";

export const Route = createFileRoute("/ledger")({ component: LedgerPage });

function LedgerPage() {
  const ledger = useSoc((s) => s.ledger);
  const total = useSoc((s) => s.ledgerTotal);
  const chainOk = useSoc((s) => s.chainOk);
  const connection = useSoc((s) => s.connection);
  const verify = useSoc((s) => s.verify);
  const simulateTamper = useSoc((s) => s.simulateTamper);
  const restoreChain = useSoc((s) => s.restoreChain);
  const [focus, setFocus] = useState<string | null>(null);
  const [busy, setBusy] = useState<"verify" | "tamper" | "restore" | null>(null);
  const open = ledger.find((entry) => entry.id === focus);
  const latest = ledger[ledger.length - 1];

  useEffect(() => {
    void verify();
  }, [verify]);

  const act = async (kind: "verify" | "tamper" | "restore") => {
    setBusy(kind);
    try {
      if (kind === "verify") await verify();
      if (kind === "tamper") await simulateTamper();
      if (kind === "restore") await restoreChain();
    } finally {
      setBusy(null);
    }
  };

  return (
    <Shell title="Cryptographic Ledger">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-3xl text-sm text-muted">
          Layer 5 links every evaluated event into a SHA-256 Merkle chain (CPACF-accelerated on IBM
          LinuxONE s390x). The console reads the live chain over HTTP and can exercise the gateway's
          tamper simulation and restore paths end to end.
        </p>
        <Badge v={connection === "live" ? "LIVE" : "OFFLINE"} />
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total blocks" value={total.toLocaleString()} unit="including genesis" tone="accent" />
        <Stat
          label="Chain integrity"
          value={chainOk === null ? "unverified" : chainOk ? "INTACT" : "BROKEN"}
          tone={chainOk ? "mint" : chainOk === false ? "crit" : "default"}
          unit="verified over HTTP"
        />
        <Stat label="Latest hash" value={latest ? `${latest.hash.slice(0, 14)}…` : "—"} unit="SHA-256" />
        <Stat label="Entries shown" value={ledger.length} unit="most recent blocks" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <ActionButton variant="primary" onClick={() => void act("verify")} disabled={busy !== null}>
          {busy === "verify" ? "Verifying…" : "Verify integrity"}
        </ActionButton>
        <ActionButton variant="danger" onClick={() => void act("tamper")} disabled={busy !== null}>
          {busy === "tamper" ? "Tampering…" : "Simulate tamper"}
        </ActionButton>
        <ActionButton onClick={() => void act("restore")} disabled={busy !== null}>
          {busy === "restore" ? "Restoring…" : "Restore chain"}
        </ActionButton>
        <span className="ml-auto font-mono text-[11px] text-muted">
          GET /v1/mirage/ledger · POST /v1/mirage/ledger/simulate-tamper · POST /v1/mirage/ledger/restore
        </span>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {ledger.slice(-12).map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setFocus(entry.id)}
            className={`min-w-36 rounded-md border p-2 text-left transition-colors ${
              focus === entry.id ? "border-accent bg-card" : "border-line bg-card hover:border-accent/40"
            }`}
          >
            <div className="font-mono text-[10px] text-accent">{entry.id}</div>
            <div className="truncate text-xs">{entry.eventType}</div>
            <div className="truncate font-mono text-[10px] text-muted">{entry.hash.slice(0, 12)}…</div>
          </button>
        ))}
        {ledger.length === 0 && (
          <p className="text-sm text-muted">No ledger entries loaded yet — verify the chain to fetch the latest blocks.</p>
        )}
      </div>

      <div className="overflow-x-auto rounded-md border border-line bg-card">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="border-b border-line bg-bg-2/60 font-mono text-[11px] text-muted">
            <tr>
              <th className="px-3 py-2">Block</th>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Verdict</th>
              <th className="px-3 py-2">Prev hash</th>
              <th className="px-3 py-2">Event hash</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((entry) => (
              <tr key={entry.id} className="border-t border-line/70">
                <td className="px-3 py-2 font-mono text-xs">{entry.id}</td>
                <td className="px-3 py-2 font-mono text-[11px] text-muted">{entry.ts}</td>
                <td className="px-3 py-2 text-xs">{entry.eventType}</td>
                <td className="px-3 py-2 font-mono text-[11px] text-muted">{entry.prevHash.slice(0, 16)}…</td>
                <td className="px-3 py-2 font-mono text-[11px]">{entry.hash.slice(0, 16)}…</td>
              </tr>
            ))}
          </tbody>
        </table>
        {ledger.length === 0 && (
          <div className="p-4">
            <EmptyState
              title="Ledger not loaded"
              hint="Start the gateway and press Verify integrity; the console fetches the authoritative chain status."
            />
          </div>
        )}
      </div>

      {open && (
        <Panel title={`Linked block · ${open.id}`} className="mt-4">
          <p className="break-all font-mono text-xs">{open.hash}</p>
          <p className="mt-2 break-all font-mono text-xs text-muted">{open.payload}</p>
          <button type="button" className="mt-2 text-xs text-accent" onClick={() => setFocus(null)}>
            Close
          </button>
        </Panel>
      )}
    </Shell>
  );
}
