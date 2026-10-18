# MIRAGE-Z SOC Console

Live security-operations console for **MIRAGE-Z**, the autonomous zero-trust egress
warden. The console is a faithful client of the FastAPI gateway in `../backend`:
every verdict, decoy, latency and Merkle block shown in the UI comes from the real
five-layer pipeline — there is no local mock decision engine.

## What it does

- **Command Center** — one-click live demo of the six-event pipeline choreography, five-layer
  telemetry, session latency percentiles and chain integrity.
- **Live Threat Monitor** — real-time timeline streamed over the gateway's zero-drop SSE fan-out.
- **Ingestion Engine** — send any payload, inspect Layer 1 detections, Layer 2 decoys and the
  tokenized agent-visible context (raw PII never reaches the browser).
- **Honey Decoy Lab** — mint checksum-valid Luhn PAN / ISO 7064 IBAN decoys through the live pipeline.
- **Agent Sandbox** — declared agent policies and the tool-call timeline observed by Layer 4.
- **Egress Warden** — every inspected outbound call with its deterministic verdict and latency.
- **Cryptographic Ledger** — SHA-256 Merkle chain with live integrity verification,
  tamper simulation and restore.
- **Performance Benchmarks** — canonical gateway metrics plus latency measured in this session.
- **Golden Evaluation Suite** — runs the locked 20-case Role 5 suite through the live API and
  reports actual vs expected verdicts.

## Stack

React 19, TypeScript, TanStack Start + Router, Tailwind CSS v4, Zustand, Recharts,
Lucide, IBM Plex typography. No database or authentication is required: the console is
an operator view over the gateway's HTTP/SSE contracts.

## Run it

The backend must be running first (from the repository root):

```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

Then start the console:

```bash
cd frontend
pnpm install          # or: npm install
pnpm dev              # http://localhost:8080
```

The backend base URL defaults to `http://localhost:8000`. Override it at build time with
`VITE_MIRAGE_API_URL`, or change it at runtime from **Settings → Gateway connection**.

## Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Vite dev server on `0.0.0.0:8080` |
| `pnpm build` | Production build (`dist/`) |
| `pnpm preview` | Serve the production build on `127.0.0.1:8081` |
| `pnpm typecheck` | Strict TypeScript check |
| `pnpm lint` | ESLint (zero errors required) |
| `pnpm format` | Prettier |

## Verification

- `pnpm typecheck` — clean
- `pnpm lint` — zero errors
- `pnpm build` — clean production bundle
- Browser QA (desktop 1440×1000, mobile 390×844): all routes render with **zero console/runtime
  errors**, no horizontal overflow, and the in-app golden runner reports **20/20 passing**
  against the live gateway.

## Environment

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `VITE_MIRAGE_API_URL` | `http://localhost:8000` | Gateway base URL baked into the build |

A runtime override can be saved from Settings; it is stored in `localStorage` only.
