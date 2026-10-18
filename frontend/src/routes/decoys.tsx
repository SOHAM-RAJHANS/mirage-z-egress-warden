import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ActionButton, Badge, EmptyState, Panel, Shell, Stat } from "@/components/shell";
import { useSoc } from "@/stores/soc";

export const Route = createFileRoute("/decoys")({ component: Decoys });

function Decoys() {
  const decoys = useSoc((s) => s.decoys);
  const lastEvent = useSoc((s) => s.lastEvent);
  const mintDecoy = useSoc((s) => s.mintDecoy);
  const connection = useSoc((s) => s.connection);
  const [copied, setCopied] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);

  const mint = async (kind: "luhn" | "iban") => {
    setMinting(true);
    try {
      await mintDecoy(kind);
    } finally {
      setMinting(false);
    }
  };

  const counts = {
    total: decoys.length,
    luhn: decoys.filter((decoy) => decoy.kind === "luhn").length,
    iban: decoys.filter((decoy) => decoy.kind === "iban").length,
    invalid: decoys.filter((decoy) => !decoy.valid).length,
  };

  return (
    <Shell title="Honey Decoy Lab">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-3xl text-sm text-muted">
          Layer 2 replaces regulated identifiers with mathematically valid decoys: Luhn Mod 10 PANs and
          ISO 7064 Mod 97-10 IBANs carrying a keyed HMAC-SHA256 attribution tag. The decoys below were
          minted by the live gateway and registered as O(1) tripwires for the egress warden.
        </p>
        <Badge v={connection === "live" ? "LIVE" : "OFFLINE"} />
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Decoys registered" value={counts.total} tone="accent" unit="this console session" />
        <Stat label="Luhn PAN decoys" value={counts.luhn} unit="Mod 10 valid" />
        <Stat label="ISO-97 IBAN decoys" value={counts.iban} unit="Mod 97 valid" />
        <Stat label="Checksum failures" value={counts.invalid} tone={counts.invalid > 0 ? "crit" : "mint"} unit="must be zero" />
      </div>

      <Panel title="Mint live decoys through the pipeline">
        <div className="flex flex-wrap items-center gap-2">
          <ActionButton variant="primary" onClick={() => void mint("luhn")} disabled={minting || connection !== "live"}>
            Mint Luhn PAN decoy
          </ActionButton>
          <ActionButton onClick={() => void mint("iban")} disabled={minting || connection !== "live"}>
            Mint ISO-97 IBAN decoy
          </ActionButton>
          <span className="font-mono text-[11px] text-muted">
            eval payload → Layer 1 detection → Layer 2 checksum-valid minting
          </span>
        </div>
        {lastEvent && lastEvent.layer2_decoys.length > 0 && (
          <p className="mt-3 border-t border-line pt-3 text-xs text-muted">
            Last mint: <span className="font-mono text-fg">{lastEvent.layer2_decoys.length}</span> decoy(s) from{" "}
            event <span className="font-mono text-fg">{lastEvent.event_id.slice(0, 8)}</span>.
          </p>
        )}
      </Panel>

      <div className="mt-4 overflow-x-auto rounded-md border border-line bg-card">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line bg-bg-2/60 font-mono text-[11px] text-muted">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Kind</th>
              <th className="px-3 py-2">Decoy value</th>
              <th className="px-3 py-2">Checksum</th>
              <th className="px-3 py-2">Attribution</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {decoys.map((decoy) => (
              <tr key={decoy.id + decoy.value} className="border-t border-line/70">
                <td className="px-3 py-2 font-mono text-xs">{decoy.id}</td>
                <td className="px-3 py-2 text-xs uppercase text-muted">{decoy.kind}</td>
                <td className="px-3 py-2 font-mono text-xs">{decoy.value}</td>
                <td className={`px-3 py-2 font-mono text-[11px] ${decoy.valid ? "text-mint" : "text-crit"}`}>
                  {decoy.valid ? "valid" : "invalid"}
                </td>
                <td className="px-3 py-2 font-mono text-[11px] text-muted">{decoy.meta}</td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className="text-xs text-accent"
                    onClick={() => {
                      void navigator.clipboard.writeText(decoy.value);
                      setCopied(decoy.id + decoy.value);
                    }}
                  >
                    {copied === decoy.id + decoy.value ? "Copied" : "Copy"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {decoys.length === 0 && (
          <div className="p-4">
            <EmptyState
              title="No decoys minted yet"
              hint="Mint a synthetic PAN or IBAN above, or run the live demo from the Command Center."
            />
          </div>
        )}
      </div>

      <p className="mt-3 text-[11px] text-muted">
        Decoy values are synthetic test data. Checksum validity makes them plausible to exfiltrating
        tooling; it does not represent a real account. Any outbound call carrying one is blocked by
        Layer 4 and attributed through the HMAC tag.
      </p>
    </Shell>
  );
}
