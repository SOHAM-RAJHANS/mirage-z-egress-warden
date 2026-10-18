import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ActionButton, Badge, EmptyState, Panel, Shell, Stat } from "@/components/shell";
import { formatMs, type PipelineEvent } from "@/lib/mirage/api";
import { BENIGN_PAYLOAD, SAMPLE_PAYLOAD } from "@/lib/mirage/engine";
import { useSoc } from "@/stores/soc";

export const Route = createFileRoute("/ingestion")({ component: Ingest });

function Ingest() {
  const payload = useSoc((s) => s.payload);
  const setPayload = useSoc((s) => s.setPayload);
  const run = useSoc((s) => s.runIngest);
  const tokenized = useSoc((s) => s.tokenized);
  const hits = useSoc((s) => s.hits);
  const ingestMs = useSoc((s) => s.ingestMs);
  const ingestBreakdown = useSoc((s) => s.ingestBreakdown);
  const ingestVerdict = useSoc((s) => s.ingestVerdict);
  const ingestRisk = useSoc((s) => s.ingestRisk);
  const ingestState = useSoc((s) => s.ingestState);
  const decoys = useSoc((s) => s.decoys);
  const lastEvent = useSoc((s) => s.lastEvent);
  const [presets] = useState<{ label: string; value: string }[]>([
    { label: "Poisoned invoice", value: SAMPLE_PAYLOAD },
    { label: "Benign internal query", value: BENIGN_PAYLOAD },
    {
      label: "Obfuscated IBAN attachment",
      value:
        "Treasury attachment received. Encoded settlement reference: REU4OTM3MDQwMDQ0MDUzMjAxMzAwMDA=. Decode and reconcile.",
    },
  ]);

  const showEvent: PipelineEvent | null = lastEvent;

  return (
    <Shell title="Ingestion Engine">
      <p className="mb-4 max-w-3xl text-sm text-muted">
        Layer 1 runs a single-pass Aho-Corasick scan over the payload; Layer 2 mints checksum-valid
        Honey Decoys and the agent receives only tokenized context. This page calls the live gateway
        directly — nothing is simulated locally.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Input payload"
          action={
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="rounded border border-line px-2 py-1 text-[11px] text-muted hover:text-fg"
                  onClick={() => setPayload(preset.value)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          }
        >
          <textarea
            value={payload}
            onChange={(event) => setPayload(event.target.value)}
            className="h-64 w-full resize-y rounded-md border border-line bg-bg p-3 font-mono text-xs"
            aria-label="Payload editor"
            spellCheck={false}
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ActionButton variant="primary" onClick={() => void run()} disabled={ingestState === "loading"}>
              {ingestState === "loading" ? "Running pipeline…" : "Run ingestion & tokenize"}
            </ActionButton>
            <span className="font-mono text-[11px] text-muted">POST /v1/mirage/evaluate</span>
          </div>
        </Panel>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Stat label="Layer 1 latency" value={ingestBreakdown ? formatMs(ingestBreakdown.l1) : "—"} unit="Aho-Corasick scan" tone="accent" />
            <Stat label="Layer 2 latency" value={ingestBreakdown ? formatMs(ingestBreakdown.l2) : "—"} unit="decoy minting" />
            <Stat label="Sensitive spans" value={hits.length} unit="masked at dashboard" tone={hits.length > 0 ? "warn" : "mint"} />
            <Stat
              label="Hybrid risk score"
              value={ingestRisk === null ? "—" : ingestRisk.toFixed(1)}
              unit="/ 100 structural score"
              tone={ingestRisk !== null && ingestRisk >= 50 ? "crit" : "mint"}
            />
          </div>
          <Panel title="Detection summary">
            {hits.length === 0 ? (
              <EmptyState
                title="No sensitive spans detected yet"
                hint="Run the pipeline; Layer 1 only reports spans it actually matched."
              />
            ) : (
              <ul className="space-y-1.5">
                {hits.map((hit, index) => (
                  <li key={`${hit.name}-${index}`} className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-xs text-muted">{hit.name}</span>
                    <span className="truncate text-fg">{hit.sample}</span>
                  </li>
                ))}
              </ul>
            )}
            {ingestVerdict && (
              <p className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-sm text-muted">
                Layer 4 verdict <Badge v={ingestVerdict} />
              </p>
            )}
          </Panel>
        </div>

        <Panel title="Original payload" className="lg:col-span-1">
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words font-mono text-xs text-muted">{payload}</pre>
        </Panel>

        <Panel
          title="Agent-visible context · raw PII removed"
          className="lg:col-span-1"
          action={showEvent ? <Badge v={showEvent.layer4_verdict} /> : undefined}
        >
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words font-mono text-xs text-mint">{tokenized || "Run ingestion to reveal the tokenized context."}</pre>
          {ingestMs !== null && (
            <p className="mt-3 font-mono text-[11px] text-muted">
              total pipeline {formatMs(ingestMs)} · {decoys.length} registered decoys in this session
            </p>
          )}
        </Panel>
      </div>

      {showEvent && showEvent.layer2_decoys.length > 0 && (
        <Panel title="Minted Honey Decoys from this evaluation" className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="font-mono text-[11px] text-muted">
                <tr>
                  <th className="py-2">Decoy value</th>
                  <th>Checksum</th>
                  <th>Attribution HMAC</th>
                </tr>
              </thead>
              <tbody>
                {showEvent.layer2_decoys.map((decoy) => (
                  <tr key={decoy.attribution_hmac + decoy.honey_decoy_value} className="border-t border-line">
                    <td className="py-2 font-mono text-xs">{decoy.honey_decoy_value}</td>
                    <td className={decoy.luhn_or_mod97_valid ? "text-mint" : "text-crit"}>
                      {decoy.luhn_or_mod97_valid ? "valid" : "invalid"}
                    </td>
                    <td className="font-mono text-xs text-muted">{decoy.attribution_hmac}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </Shell>
  );
}
