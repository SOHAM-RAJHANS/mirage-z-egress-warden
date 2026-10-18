# Mirage-Z — Role 5: Red Team & Auditing

## Overview
This repository contains the Red Team and Auditing component of Mirage-Z. It includes security test cases, benchmark datasets, checksum validation, and offline audit-chain verification.

## Project Structure

- `demo_traps/poisoned_enterprise_context/` — Synthetic test files for evaluating potentially poisoned enterprise context.
- `benchmarks/generate_golden_suite.py` — Generates golden test cases and stress-test data.
- `benchmarks/mirage_golden_20_suite.json` — 20 golden test cases.
- `benchmarks/stress_1000.json` — 1,000 stress-test records.
- `benchmarks/run_benchmark.py` — Offline validation and audit-chain checks.
- `benchmarks/chaos_test.py` — Chaos tests intended for use when the backend is available.
- `benchmarks/generate_telemetry_fallback.py` — Generates synthetic fallback telemetry.
- `benchmarks/telemetry_fallback_mirage.json` — Generated fallback telemetry.
- `benchmarks/offline_audit.json` — Locally generated audit records.
- `benchmarks/BENCHMARK_AND_AUDIT_REPORT.md` — Offline benchmark report.

## Running the Offline Checks

Run these commands from the project directory:

```bash
python3 benchmarks/generate_golden_suite.py
python3 benchmarks/run_benchmark.py
python3 benchmarks/generate_telemetry_fallback.py
```

## Current Status

### Completed locally
- Golden and stress-test dataset generation.
- PAN and IBAN checksum test cases.
- Offline SHA-256 audit-chain verification and tamper-detection test.
- Synthetic telemetry fallback generation.

### Pending
- Testing security verdicts against the integrated backend.
- Running chaos tests against the actual API.
- Measuring real API latency and validating the application's audit ledger.

## Important Note
The results represent local offline preparation and validation. They do not establish that the integrated application blocks attacks or has passed live security testing.

**Role:** Role 5 — Red Team & Auditing