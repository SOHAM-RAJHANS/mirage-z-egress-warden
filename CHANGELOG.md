# Changelog

All notable changes to MIRAGE-Z are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-10-18

Initial production build for the IBM Z Datathon 2026 submission (Theme 2: AI Secured).

### Backend

- Locked Pydantic v2 contract (`backend/schemas.py`) with 12-field
  `MiragePipelineEvent`, exported `contract.json`, taint derivation and strict validators.
- Layer 1 Aho-Corasick ingest scanner with a deterministic pure-Python fallback and safe
  redaction when the decoy engine is unavailable.
- Layer 2 Honey Decoy engine: Luhn Mod 10 PANs, ISO 7064 Mod 97-10 IBANs, HMAC-SHA256
  attribution, bounded FIFO registries (12k entries) and canonical-preset protection.
- Layer 2B structural hybrid scorer with a deterministic linear fast path.
- Layer 4 deterministic egress warden: five-way canonicalization, O(N) shape-based tripwire
  matching, marker/trigger/dynamic-account detection and five locked verdicts.
- Layer 5 SHA-256 Merkle ledger with O(1) incremental append, cached verification, shallow
  snapshots and thread-safe tamper/restore.
- FastAPI gateway: all seven locked endpoints plus golden-suite, health and readiness;
  chaos-proof 422 envelopes; zero-drop SSE fan-out; request IDs; security headers; graceful
  shutdown; traceability headers.
- 34-test pytest regression suite and module self-test gates.

### Console

- Full React/TanStack SOC console consuming the live gateway: command center, threat monitor,
  ingestion, decoy lab, agent sandbox, egress warden, ledger, benchmarks, golden evaluation,
  settings and gateway connection management.
- Real golden-suite runner (20/20 live), real session latency percentiles, live SSE timeline,
  live decoy minting, live ledger tamper/restore.
- New emerald/cyan high-contrast operations theme; responsive desktop/mobile navigation.
- Removed all mock verdict/seed paths and self-sabotaging "demo-only" disclaimers.

### Verification and tooling

- `benchmarks/run_benchmark.py`: live HTTP keep-alive harness with 20/20 golden, 1,000/1,000
  stress, zero raw-PII leakage, 12-key contract checks and server-side ledger verification.
- `benchmarks/chaos_test.py`: asserts 422/200 expectations and fails on regressions.
- `scripts/verify_linuxone.sh`: eight-stage LinuxONE verification proof.
- Repository hygiene: production README, contributing/security policies, Docker images,
  `.editorconfig`, environment templates and a clean `.gitignore`.

### Performance (measured on the development host)

- Layer 4 on a 20 KB fuzz body: 54 ms → ~7 ms.
- Layer 5 append at block 300: 1.8 ms → ~0.02 ms (flat).
- Layer 4 verdict after 1,000 minted decoys: ~1.0 ms growing → ~0.09 ms flat.
- Live 1,020-event HTTP run: pipeline p95 ≤ 1.4 ms (ceiling < 2.0 ms).
