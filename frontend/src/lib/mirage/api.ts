/**
 * Typed client for the MIRAGE-Z gateway.
 *
 * The console is a pure consumer of the live FastAPI contract from
 * `backend/main.py`; there is no local policy engine or mock decision path. If
 * the gateway is unreachable the UI surfaces an explicit offline state instead
 * of fabricating results.
 *
 * Base URL resolution order:
 *   1. VITE_MIRAGE_API_URL (build/dev environment)
 *   2. operator override saved in localStorage (Settings → Gateway)
 *   3. http://localhost:8000
 */

export type SourceChannel =
  | "TRUSTED_INTERNAL_DB"
  | "UNTRUSTED_EMAIL_INGEST"
  | "UNTRUSTED_WEB_DOC"
  | "SYNTHETIC_TEST";

export type Layer4Verdict =
  | "ALLOWED_CLEAN"
  | "ALLOWED_DETOKENIZED"
  | "BLOCKED_HONEY_TRIPWIRE"
  | "BLOCKED_TAINTED_EGRESS"
  | "DETECT_TAMPERING";

export interface Layer1Match {
  entity_type: string;
  redacted_preview: string;
  scan_time_us: number;
}

export interface Layer2Decoy {
  honey_decoy_value: string;
  luhn_or_mod97_valid: boolean;
  attribution_hmac: string;
}

export interface LatencyBreakdown {
  l1_ingest: number;
  l2_decoy: number;
  l4_warden: number;
  l5_merkle: number;
  total: number;
}

export interface Layer5MerkleBlock {
  block_index: number;
  prev_hash: string;
  event_hash: string;
  chain_intact: boolean;
}

export interface PipelineEvent {
  event_id: string;
  timestamp: string;
  node_arch: string;
  source_channel: SourceChannel;
  taint_flag: boolean;
  layer1_matches: Layer1Match[];
  layer2_decoys: Layer2Decoy[];
  hybrid_onnx_risk_score: number;
  agent_tool_call: string;
  layer4_verdict: Layer4Verdict;
  latency_breakdown_ms: LatencyBreakdown;
  layer5_merkle_block: Layer5MerkleBlock;
}

export interface LedgerBlock {
  block_index: number;
  prev_hash: string;
  timestamp: string;
  event_id: string;
  decoy_hmacs: string[] | string;
  layer4_verdict: string;
  event_hash: string;
}

export interface LedgerStatus {
  chain_intact: boolean;
  total_blocks: number;
  corrupted_block_index: number | null;
  blocks: LedgerBlock[];
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  node_arch: string;
  uptime_seconds: number;
  ledger: {
    chain_intact: boolean;
    total_blocks: number;
    chain_tip_hash: string;
    genesis_hash: string;
  };
  tripwires: number;
  replay_buffer_events: number;
  subscribers: number;
  stats: { events_evaluated: number; events_broadcast: number; subscribers_peak: number };
}

export interface CanonicalMetrics {
  p95_latency_ms: number;
  cloud_baseline_ms: number;
  speedup_factor: string;
  golden_suite_pass_rate: number;
  breach_cost_mitigated_usd: number;
  shadow_ai_saved_usd: number;
  access_gap_closed_pct: number;
}

export interface GoldenCase {
  case_id: string;
  category: string;
  payload: string;
  expected_verdict: Layer4Verdict;
  test_type?: string;
}

export interface GoldenSuiteResponse {
  source: string;
  total: number;
  cases: GoldenCase[];
}

export interface EvaluateBody {
  payload: string;
  source_channel?: SourceChannel;
  agent_tool_call?: string;
  trap_name?: string;
  case_id?: string;
  test_type?: string;
}

export class ApiError extends Error {
  readonly status: number | null;
  readonly code: string;

  constructor(message: string, status: number | null = null, code = "GATEWAY_ERROR") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const DEFAULT_API_BASE =
  (import.meta.env.VITE_MIRAGE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "http://localhost:8000";
const API_BASE_STORAGE_KEY = "mirage-api-base";

export function getApiBase(): string {
  if (typeof window === "undefined") return DEFAULT_API_BASE;
  try {
    const stored = window.localStorage.getItem(API_BASE_STORAGE_KEY);
    if (stored && /^https?:\/\//.test(stored)) return stored.replace(/\/+$/, "");
  } catch {
    /* storage may be unavailable in private mode */
  }
  return DEFAULT_API_BASE;
}

export function setApiBase(value: string): void {
  if (typeof window === "undefined") return;
  const normalized = value.trim().replace(/\/+$/, "");
  if (!/^https?:\/\/.+/.test(normalized)) {
    throw new ApiError("Gateway URL must start with http:// or https://", null, "INVALID_URL");
  }
  window.localStorage.setItem(API_BASE_STORAGE_KEY, normalized);
}

export function resetApiBase(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(API_BASE_STORAGE_KEY);
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  timeoutMs = 10_000
): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${getApiBase()}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...(init.headers ?? {}),
      },
      signal: controller.signal,
    });
    const text = await response.text();
    let parsed: unknown = null;
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = null;
      }
    }
    if (!response.ok) {
      const envelope = parsed as { error?: { code?: string; message?: string } } | null;
      throw new ApiError(
        envelope?.error?.message ?? `Gateway returned HTTP ${response.status}`,
        response.status,
        envelope?.error?.code ?? "GATEWAY_ERROR"
      );
    }
    return parsed as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Gateway request timed out", null, "TIMEOUT");
    }
    throw new ApiError(
      `Gateway unreachable at ${getApiBase()}`,
      null,
      "UNREACHABLE"
    );
  } finally {
    window.clearTimeout(timeout);
  }
}

export function health(): Promise<HealthResponse> {
  return request<HealthResponse>("/health", {}, 4_000);
}

export function metrics(): Promise<CanonicalMetrics> {
  return request<CanonicalMetrics>("/v1/mirage/metrics");
}

export function goldenSuite(): Promise<GoldenSuiteResponse> {
  return request<GoldenSuiteResponse>("/v1/mirage/golden-suite");
}

export function evaluate(body: EvaluateBody): Promise<PipelineEvent> {
  return request<PipelineEvent>("/v1/mirage/evaluate", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function ledger(): Promise<LedgerStatus> {
  return request<LedgerStatus>("/v1/mirage/ledger", {}, 15_000);
}

export function simulateTamper(blockIndex?: number): Promise<LedgerStatus> {
  return request<LedgerStatus>("/v1/mirage/ledger/simulate-tamper", {
    method: "POST",
    body: JSON.stringify(blockIndex === undefined ? {} : { block_index: blockIndex }),
  });
}

export function restoreLedger(): Promise<LedgerStatus> {
  return request<LedgerStatus>("/v1/mirage/ledger/restore", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export type StreamStatus = "connecting" | "live" | "offline";

/**
 * Subscribe to the zero-drop SSE fan-out. Returns a disposer.
 * The gateway replays its last ten events on connect, so a fresh dashboard
 * immediately reflects recent pipeline activity.
 */
export function openEventStream(
  onEvent: (event: PipelineEvent) => void,
  onStatus: (status: StreamStatus) => void
): () => void {
  if (typeof window === "undefined" || typeof EventSource === "undefined") {
    return () => undefined;
  }
  let source: EventSource | null = null;
  let disposed = false;

  const connect = () => {
    if (disposed) return;
    onStatus("connecting");
    try {
      source = new EventSource(`${getApiBase()}/v1/mirage/stream`);
      source.onopen = () => onStatus("live");
      source.onmessage = (message) => {
        if (!message.data || message.data.startsWith(":")) return;
        try {
          const parsed = JSON.parse(message.data) as PipelineEvent;
          if (parsed && typeof parsed === "object" && parsed.event_id) {
            onEvent(parsed);
          }
        } catch {
          /* heartbeats / keep-alive frames */
        }
      };
      source.onerror = () => {
        onStatus("offline");
        // EventSource reconnects automatically; expose the state honestly.
      };
    } catch {
      onStatus("offline");
    }
  };

  connect();
  return () => {
    disposed = true;
    source?.close();
    source = null;
  };
}

export function percentile(values: number[], pct: number): number | null {
  if (values.length === 0) return null;
  const ordered = [...values].sort((a, b) => a - b);
  const index = Math.min(
    ordered.length - 1,
    Math.max(0, Math.round((pct / 100) * (ordered.length - 1)))
  );
  return ordered[index] ?? null;
}

export function formatMs(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${value.toFixed(value < 1 ? 3 : 2)} ms`;
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
