# Security Policy

MIRAGE-Z is a security control plane: an autonomous zero-trust egress warden with
attributable honey decoys and a tamper-evident audit ledger.

## Supported versions

| Version | Supported |
| :--- | :--- |
| 1.x | Yes |

## Reporting a vulnerability

Please do **not** open a public issue for a vulnerability. Report privately to the
maintainers (`security@mirage-z.invalid` is a placeholder for the competition build) with:

- affected component (backend layer, gateway, console, harness),
- reproduction steps or a minimal payload,
- observed vs expected behaviour,
- impact assessment (data exposure, bypass, denial of service).

We aim to acknowledge within 3 business days and coordinate disclosure after a fix.

## Security model (what is enforced)

- **Zero raw PII in agent context**: Layer 1 detection + Layer 2 vaulting replace sensitive spans
  before context reaches an agent; only masked previews leave the process.
- **Deterministic egress**: Layer 4 canonicalizes five obfuscation channels and blocks decoy,
  marker, trigger-phrase and tainted-external egress without any neural model in the path.
- **Attribution**: decoys embed keyed HMAC-SHA256 tags surfaced as `matched_hmac`.
- **Tamper-evident audit**: every event links into a SHA-256 Merkle chain with verification,
  tamper simulation and restore.
- **Transport hardening**: strict Pydantic v2 validation, chaos-proof 422 envelopes, security
  headers, request IDs, bounded in-memory registries and graceful SSE shutdown.

## Hardening guidance for operators

- Set a strong `MIRAGE_SECRET` in production; the shipped value is for the demo only.
- Terminate TLS in front of the gateway and restrict CORS to your console origin.
- Keep `MIRAGE_MAX_TRIPWIRES` / `MIRAGE_MAX_VAULT_ENTRIES` sized to your workload.
- Do not persist raw payloads or vault contents; the vault is intentionally in-memory only.
- Run the verification harness (`benchmarks/run_benchmark.py`) after deployment.

## Out of scope

- The simulated agent sandbox is an application-layer context boundary, not a hardware VM isolate.
- Decoy identifiers are synthetic test data; they are not real financial accounts.
- Benchmark fixtures are synthetic and deterministically generated.
