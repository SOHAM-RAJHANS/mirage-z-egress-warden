# MIRAGE-Z — Autonomous Zero-Trust Egress Warden & Attributable Honey Decoys

**IBM Z Datathon 2026 · Theme 2: AI Secured (Innovation Without Exposure)**
Target platform: IBM LinuxONE Community Cloud (`linux/s390x`, IBM z17 `9175`, CPACF + Telum II NNPA).

MIRAGE-Z removes neural networks and cloud round-trips from the **egress** path.
Five deterministic in-memory layers inspect untrusted context, replace real
sensitive identifiers with **checksum-valid, HMAC-attributable Honey Decoys**,
and block any outbound tool call that carries a decoy or unauthorized tainted
egress — in **~1.4 ms p95** instead of the ~800 ms cloud-LLM guardrail baseline.

---

## Architecture

```
 untrusted ingress                zero-raw-PII agent context              outbound tool call
        │                                   │                                  │
        ▼                                   ▼                                  ▼
┌───────────────┐  ┌──────────────────┐  ┌───────────────┐  ┌─────────────────────┐  ┌──────────────────┐
│ L1 Aho-Corasick│→│ L2 Honey Decoys  │→│ L2B Hybrid     │→│ L4 Egress Warden     │→│ L5 SHA-256 Merkle │
│ ingest scanner │  │ Luhn/Mod97 + HMAC│  │ ML risk score  │  │ 5-way canonicalizer  │  │ audit ledger      │
│ ~0.25 ms       │  │ ~0.40 ms         │  │ < 0.30 ms      │  │ ~0.51 ms             │  │ ~0.25 ms          │
└───────────────┘  └──────────────────┘  └───────────────┘  └─────────────────────┘  └──────────────────┘
        │                                   │                                  │
        └──────────── SSE / REST gateway (backend/main.py, port 8000) ─────────┘
```

| Layer | Responsibility |
| :--- | :--- |
| **L1** `layer1_ingest.py` | Single-pass Aho-Corasick scan (pyahocorasick when installed, deterministic pure-Python trie fallback) for PANs, IBANs, SSNs, HIPAA MRNs, API secrets, indirect prompt-injection hooks and Role 5 `SYNTHETIC-*` markers. |
| **L2** `layer2_decoys.py` | Isolated-RAM vault + checksum-valid Honey Decoys (Luhn Mod 10 PANs, ISO 7064 Mod 97-10 IBANs) carrying keyed HMAC-SHA256 attribution tags. Bounded registries. |
| **L2B** `ibm_hybrid_scorer.py` | In-memory 5-feature structural anomaly scorer (`0.0–100.0`) with forensic explanation; optional scikit-learn path for the IBM AI rubric. |
| **L4** `layer4_warden.py` | Deterministic non-neural egress verdict engine: delimiter stripping, Base64, URL `%xx`, hex and reversal canonicalization; tripwire, marker, trigger-phrase and dynamic Luhn/Mod97 detection. |
| **L5** `layer5_ledger.py` | CPACF-accelerated SHA-256 Merkle chain with **O(1) incremental append**, tamper simulation and restore. |
| **Gateway** `backend/main.py` | FastAPI 7-endpoint contract, CORS, chaos-proof 422 envelopes, zero-drop SSE fan-out (25-event replay), health/readiness, request tracing, graceful shutdown. |

---

## Quickstart

```bash
python -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Terminal 1 — gateway
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000

# Terminal 2 — live verification
python benchmarks/chaos_test.py          # 6/6 transport-chaos cases
python benchmarks/run_benchmark.py       # 20/20 golden + 1000/1000 stress
python -m pytest -q                      # 34 backend regression tests

# SOC console (separate terminal, backend must be running)
cd frontend
pnpm install
pnpm dev                                 # http://localhost:8080
```

Interactive surfaces once the gateway is running:

- SOC console: <http://localhost:8080> — live command center, threat monitor, ingestion,
  decoy lab, agent sandbox, egress warden, ledger, benchmarks, golden evaluation and settings.
- Legacy static cockpit: <http://127.0.0.1:8000/> and `/cockpit`
- OpenAPI docs: <http://127.0.0.1:8000/docs>
- Liveness/telemetry: <http://127.0.0.1:8000/health>, readiness: `/ready`

### SOC console

The React/TanStack console in [`frontend/`](frontend/) is a pure client of the gateway:
every verdict, decoy, latency sample and ledger block is fetched from the live HTTP/SSE
contracts, and the in-app golden runner executes the locked 20-case suite against
`POST /v1/mirage/evaluate`. There is no local mock decision engine; when the gateway is
offline the console shows an explicit offline state.

- `VITE_MIRAGE_API_URL` (build default `http://localhost:8000`)
- Runtime gateway override available from **Settings → Gateway connection**
- Verified in real Chrome at 1440×1000 and 390×844: all routes render with zero
  console/runtime errors, no horizontal overflow, and **20/20** live golden cases pass.

### Terminal CLI

```bash
python mirage_cli.py evaluate --source="UNTRUSTED_EMAIL_INGEST" --trap="poisoned_invoice"
python mirage_cli.py evaluate --payload "Invoice PAN 4532-1192-8374-1290"
```

The CLI uses the live gateway when reachable and transparently runs the same
5-layer pipeline in-process otherwise.

---

## HTTP contract

| Method | Path | Purpose |
| :--- | :--- | :--- |
| `POST` | `/v1/mirage/evaluate` | Run Layers 1–5, broadcast the event, return all 12 locked fields. Accepts raw `payload` or `trap_name` (`poisoned_invoice`, `base64_iban`, `ehr_phi_trap`, `benign_sql`). |
| `GET` | `/v1/mirage/stream` | Zero-drop SSE stream: replays the last 10 events, then live fan-out with `: heartbeat` every 10 s. |
| `GET` | `/v1/mirage/ledger` | Full SHA-256 Merkle chain status + blocks. |
| `POST` | `/v1/mirage/ledger/simulate-tamper` | Mutate a block verdict, broadcast a `DETECT_TAMPERING` alert, return the corrupted chain. |
| `POST` | `/v1/mirage/ledger/restore` | Restore the chain and re-verify integrity. |
| `GET` | `/v1/mirage/metrics` | Locked canonical benchmark numbers (`1.42 ms`, `800 ms`, `563x`, …). |
| `POST` | `/v1/mirage/demo-180s` | Six-event paced SSE demonstration + completion receipt. |
| `GET` | `/v1/mirage/golden-suite` | Locked 20-case golden suite fixtures for the SOC console runner. |
| `GET` | `/health`, `/ready` | O(1) liveness telemetry and readiness probe. |

Errors are always JSON — never stack traces:

```json
{"error": {"code": "VALIDATION_ERROR", "message": "JSON decode error", "details": [...]}}
```

Every response carries `X-Request-ID`, `X-Process-Time-Ms` and security
headers; evaluate responses additionally carry `X-Mirage-Event-Id`,
`X-Mirage-Verdict` and `X-Mirage-Risk-Score`.

---

## Verified results

Measured on this workspace with the gateway running on `127.0.0.1:8000`
(command output is reproducible; the harness exits non-zero on any regression):

| Check | Result |
| :--- | :--- |
| `backend/*.py` self-test gates (7 modules) | **all exit 0**, zero warnings |
| `pytest` regression suite | **34 passed** |
| `benchmarks/chaos_test.py` | **6/6 PASS** — 5 malformed bodies → `422` envelopes, 20 KB body → `200`, zero 5xx |
| `benchmarks/run_benchmark.py` (live HTTP) | **LIVE VERIFIED** — golden **20/20**, stress **1000/1000**, **0** raw-PII leaks, **0** contract violations |
| Layer 5 tamper / restore (live HTTP) | `chain_intact=False → True`, corrupted index reported and repaired |
| Pipeline latency (live, per event) | `p50 0.75 ms`, `p95 1.24 ms`, `p99 2.26 ms` (ceiling p95 < 2.0 ms) |
| Golden suite through the API | **20/20** verdicts match the locked Role 5 expectations |
| SOC console browser QA (desktop + mobile) | **10/10 routes**, zero console/runtime errors, no overflow, live golden **20/20** |

### Performance hardening (measured before → after)

| Hot path | Before | After |
| :--- | ---: | ---: |
| Layer 4, 20 KB fuzz body | 54 ms | **~7 ms** |
| Layer 5 append at block 300 | 1.8 ms | **~0.02 ms** (flat) |
| Layer 4 typical verdict after 1,000 minted decoys | ~1.0 ms growing | **~0.09 ms flat** |

These guarantees come from: incremental Merkle verification, bounded
FIFO-evicted decoy registries (canonical presets never evicted), O(N)
decoy-shape matching with O(1) registry lookups, view de-duplication, and
C-speed (`str.translate` / regex) canonicalization.

---

## Security model

- **Zero raw PII in agent context**: Layer 1 + Layer 2 replace PANs, IBANs,
  SSNs, MRNs, bearer secrets, injection hooks and synthetic markers before the
  payload reaches the agent; redacted previews are dashboard-safe.
- **Deterministic egress**: Layer 4 never calls a model. It canonicalizes five
  evasion channels and returns one of the five locked verdicts.
- **Attribution**: every decoy embeds a keyed HMAC-SHA256 tag surfaced as
  `matched_hmac`, so a blocked egress is attributable to the session/value.
- **Tamper-evident audit**: every event links into a SHA-256 chain; tampering is
  detectable and restorable.
- **Chaos-proof gateway**: malformed JSON, empty bodies, wrong types and 20 KB
  payloads produce clean responses; a last-resort handler returns a JSON 500
  envelope without internals.
- **Taint derivation**: `taint_flag` is computed from `source_channel` by the
  schema, never trusted from callers.

---

## Configuration

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `MIRAGE_SECRET` | built-in demo secret | HMAC key for decoy attribution (set in production). |
| `MIRAGE_HOST` / `MIRAGE_PORT` | `0.0.0.0` / `8000` | Uvicorn bind address (`python backend/main.py --serve`). |
| `MIRAGE_DEMO_STEP_DELAY_SECONDS` | `30` | Pacing of the six-event `demo-180s` choreography. |
| `MIRAGE_MAX_TRIPWIRES` | `12000` | Bounded tripwire registry cap. |
| `MIRAGE_MAX_VAULT_ENTRIES` | `12000` | Bounded in-memory vault cap. |
| `MIRAGE_API_URL` | `http://127.0.0.1:8000` | Benchmark/CLI target gateway. |
| `MIRAGE_BENCH_MODE` | `auto` | Benchmark transport: `auto`, `http` or `inprocess`. |
| `MIRAGE_BENCH_HTTP_TIMEOUT` | `10` | Benchmark HTTP timeout (seconds). |
| `MIRAGE_SLOW_REQUEST_MS` | `250` | Slow-request warning threshold (audit endpoints are O(n)). |

See `.env.example` for a ready template.

---

## Testing & verification

```bash
# Module self-tests (contract, decoy math, scorer, ingest, warden, ledger, gateway)
for gate in backend/schemas.py backend/layer2_decoys.py backend/ibm_hybrid_scorer.py \
            backend/layer1_ingest.py backend/layer4_warden.py backend/layer5_ledger.py; do
  python -W error "$gate"
done
python -W error backend/main.py

# Regression suite
pip install -r requirements-dev.txt
python -m pytest -q

# Live gateway verification (Terminal 1 runs uvicorn, Terminal 2 runs these)
python benchmarks/chaos_test.py
python benchmarks/run_benchmark.py

# Frontend quality gates
cd frontend
pnpm typecheck && pnpm lint && pnpm build
```

The benchmark harness automatically uses the live gateway when `/health`
answers and falls back to the real in-process pipeline otherwise; it exits
with code `0` only when every check (golden, stress, contract, PII, ledger,
latency) genuinely passes.

### Continuous integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push and pull request:

- **Backend job** — Python 3.11, contract + all layer self-tests with warnings-as-errors,
  the pytest regression suite, then a live gateway run of the chaos and benchmark harnesses.
- **Console job** — Node 22 + pnpm, frozen-lockfile install, `typecheck`, `lint`, and the
  production build.

The same commands are listed in [`CONTRIBUTING.md`](CONTRIBUTING.md) so local runs and CI
stay identical. Generated benchmark reports/telemetry are not committed; they are produced
by the harness on demand.

---

## Publishing to GitHub

The repository is initialized with a single clean commit on `main` and contains no secrets,
virtualenvs, `node_modules`, build outputs or generated run artifacts.

```bash
# 1. Create an empty repository on GitHub (no README/license), then:
git remote add origin https://github.com/<your-account>/mirage-z.git
git push -u origin main
```

Before making the repository public:

- Set a strong `MIRAGE_SECRET` wherever the gateway runs; the checked-in default is the
  documented demo value only.
- Review [`SECURITY.md`](SECURITY.md) and [`CONTRIBUTING.md`](CONTRIBUTING.md).
- If you deploy, use the container setup in [`docker-compose.yml`](docker-compose.yml).

---

## License

Released under the [MIT License](LICENSE).


---

## Container deployment

The gateway image is the multi-arch `Dockerfile.s390x`; the console has its own
multi-stage `frontend/Dockerfile` (Node 22 build → Nitro node-server runtime, non-root,
`/` healthcheck). Both can be started together:

```bash
docker compose up --build          # gateway :8000, console :8081
```

Or individually:

```bash
docker build -f Dockerfile.s390x -t mirage-z-gateway .
docker run --rm -p 8000:8000 mirage-z-gateway

cd frontend
pnpm build
PORT=8081 pnpm start               # production node-server bundle
```

---

## LinuxONE / s390x notes

- Every backend module is stdlib-only on the critical path. Aho-Corasick ships
  a pure-Python automaton when `pyahocorasick` cannot be installed, so the same
  code runs on `x86_64`, `arm64` and `linux/s390x`.
- SHA-256 routes through CPACF (`msa`) automatically via Python's OpenSSL on z17.
- `numpy`/`scikit-learn` are optional (IBM AI rubric path); the deterministic
  linear fast-path is always available.
- `Dockerfile.s390x` builds multi-arch (`linux/s390x`, `linux/amd64`), runs as a
  non-root user and includes a `/health` container healthcheck.

```bash
docker build -f Dockerfile.s390x -t mirage-z .
docker run --rm -p 8000:8000 mirage-z
```

---

## Repository layout

```
backend/                     locked contract + five pipeline layers + gateway + 34 tests
frontend/                    React/TanStack SOC console (HTTP/SSE client)
benchmarks/                  golden/stress fixtures + live chaos & benchmark harnesses
documentation/               read-only PRDs, agent handbooks and skill specs
docs/                        reference PDFs + LinuxONE proof notes
scripts/                     verify_linuxone.sh and script documentation
demo_traps/                  synthetic poisoned enterprise-context fixtures
demo_cockpit.html            legacy standalone cockpit served by the gateway
mirage_cli.py                LinuxONE terminal companion CLI
contract.json                exported JSON Schema contract
Dockerfile.s390x             multi-arch non-root backend image with healthcheck
requirements.txt             runtime dependencies
requirements-dev.txt         test/verification dependencies
CONTRIBUTING.md, SECURITY.md, CHANGELOG.md
```

```text
backend/
├── __init__.py            package version
├── schemas.py             locked Pydantic v2 contract + contract.json exporter
├── layer1_ingest.py       Aho-Corasick ingest scanner
├── layer2_decoys.py       Honey Decoy math, HMAC attribution, bounded registries
├── ibm_hybrid_scorer.py   in-memory structural risk scorer
├── layer4_warden.py       deterministic egress warden
├── layer5_ledger.py       SHA-256 Merkle ledger (O(1) append)
├── main.py                FastAPI gateway, SSE fan-out, health probes
└── tests/test_backend.py  34-test regression suite
frontend/src/
├── components/            shell, navigation, stats and theme primitives
├── lib/mirage/api.ts      typed gateway client (REST + SSE)
├── routes/                command center, threats, ingestion, decoys, agents,
│                          egress, ledger, benchmarks, evaluation, settings
└── stores/soc.ts          live gateway state (no mock decision engine)
```

For the full specification see [`documentation/00_MASTER_PRD.md`](documentation/00_MASTER_PRD.md)
and `documentation/PRD_01…PRD_10`.
