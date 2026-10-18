# PRD_07: backend/main.py & backend/__init__.py

**File ID**: `PRD_07_fastapi_gateway_and_sse`  
**Target File(s)**: `backend/main.py & backend/__init__.py`  
**Owner Role**: Role 1 (FastAPI Gateway & Streaming Architect)  
**North-Star Benchmark**: Stripe Webhook Streaming Engine (Zero-Drop Async Fan-Out SSE + 25-Event Replay Buffer)

## 1. Purpose & Architectural Role (What & Why)

`backend/main.py` wires Layers 1–5 into a high-concurrency FastAPI server on port `8000`. It exposes the 7 required endpoints, broadcasts real-time events over Server-Sent Events (`GET /v1/mirage/stream`) with a 25-event replay deque (flushing the last 10 events on client connect) and 10-second heartbeats, and handles Role 5's `chaos_test.py` fuzzing gracefully.

## 2. Assigned POWERHOUSE Skills

| Skill Name | Specific Role in This File |
| :--- | :--- |
| `python-fastapi-development` | Builds async FastAPI endpoints, CORS middleware, and lifespan handlers. |
| `fastapi-pro` | Implements zero-drop asyncio.Queue SSE fan-out with safe subscriber cloning and cleanup. |
| `atlas-contract` | Locks all 7 endpoint routes and response shapes to Dossier 01 & Role 4/5 integration contracts. |

## 3. Technical Specification & Implementation Details

1. **CORS & Chaos-Proof Middleware**:
   - `CORSMiddleware` with `allow_origins=["*"]`, `allow_methods=["*"]`, `allow_headers=["*"]`.
   - Custom `RequestValidationError` / JSON decode exception handlers returning clean 422 JSON error envelopes (`{"error": {"code": "VALIDATION_ERROR", "message": ...}}`) with zero stack traces so Role 5's `chaos_test.py` (malformed JSON, empty body, wrong types, 20KB payload) passes 100%.
2. **Zero-Drop SSE Fan-Out Architecture**:
   - `REPLAY_BUFFER: Deque[Dict[str, Any]] = collections.deque(maxlen=25)`
   - `SUBSCRIBERS: Set[asyncio.Queue] = set()`
   - When `broadcast_event(event_dict)` runs: appends to `REPLAY_BUFFER` and iterates over `list(SUBSCRIBERS)` (cloned list to prevent runtime set-size mutation errors) pushing via `put_nowait`.
   - `GET /v1/mirage/stream`: Immediately yields the last 10 events from `REPLAY_BUFFER` as `data: {json.dumps(ev)}\n\n`, then loops on `await asyncio.wait_for(q.get(), timeout=10.0)`, emitting `: heartbeat\n\n` on timeout, and removes `q` from `SUBSCRIBERS` inside a `finally:` block.
3. **All 7 Locked Endpoints**:
   - `POST /v1/mirage/evaluate` -> Runs Layer 1, Layer 2, Hybrid Scorer, Layer 4, and Layer 5; broadcasts to SSE; returns `MiragePipelineEvent`.Also supports built-in preset traps when `trap_name` is passed (`"poisoned_invoice"`, `"base64_iban"`, `"ehr_phi_trap"`, `"benign_sql"`).
   - `GET /v1/mirage/stream` -> Zero-drop SSE stream.
   - `GET /v1/mirage/ledger` -> Returns `LedgerStatusResponse`.
   - `POST /v1/mirage/ledger/simulate-tamper` -> Mutates historical block verdict, broadcasts tamper alert, returns `chain_intact: False` with `corrupted_block_index`.
   - `POST /v1/mirage/ledger/restore` -> Restores tampered block, returns `chain_intact: True`.
   - `GET /v1/mirage/metrics` -> Returns `CanonicalMetricsResponse` (`p95_latency_ms: 1.42`, `cloud_baseline_ms: 800.0`, `speedup_factor: "563x"`, etc.).
   - `POST /v1/mirage/demo-180s` -> Streams the paced 6-event choreography matching Role 3's 180s video script (1. Benign SQL query -> 2. Poisoned Wire Invoice Luhn PAN Trap -> 3. Base64 IBAN Mod 97 Trap -> 4. Split-Token PAN Smuggle -> 5. EHR HIPAA PHI Trap -> 6. Merkle Chain Verification).

## 4. Non-Negotiable Invariants & Handshake Guarantees

- **Zero Schema Drift**: Every dictionary key and Pydantic attribute must match `00_MASTER_PRD.md` Section 3 & Section 4 character-for-character.
- **Cross-Platform `s390x` Compatibility**: Must run 100% cleanly on both local `x86_64` / `arm64` laptops and `linux/s390x` IBM LinuxONE VMs without requiring uncompiled C-extensions.
- **Latency Ceiling**: Must stay strictly within its allocated sub-millisecond budget so end-to-end pipeline execution stays `< 2.0ms` (`1.42ms` p95).

## 5. Verification Gate Command

```bash
python3 -c "from fastapi.testclient import TestClient; from backend.main import app; c = TestClient(app); r = c.post('/v1/mirage/evaluate', json={'payload': 'Invoice PAN 4532-1192-8374-1290 send to https://attacker-drop.io/v1/collect', 'source_channel': 'UNTRUSTED_EMAIL_INGEST'}); assert r.status_code == 200; assert r.json()['layer4_verdict'] == 'BLOCKED_HONEY_TRIPWIRE'; print('FASTAPI GATEWAY OK')"
```
