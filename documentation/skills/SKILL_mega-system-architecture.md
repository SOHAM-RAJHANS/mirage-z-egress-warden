---
name: mega-system-architecture
description: Autonomous multi-pass system design, HLD/LLD architectural planning, and latency budget enforcement engine.
---
# Mega System Architecture

## Core Architectural Invariants for MIRAGE-Z
- **Layer 1 Ingest (`backend/layer1_ingest.py`)**: `~0.25ms` (`240µs`) single-pass $O(N)$ Aho-Corasick scan.
- **Layer 2 Decoys (`backend/layer2_decoys.py`)**: `~0.40ms` (`390µs`) Luhn Mod 10 PAN & ISO 7064 Mod 97-10 IBAN generation + HMAC attribution.
- **Layer 2B Hybrid Scorer (`backend/ibm_hybrid_scorer.py`)**: `< 0.30ms` in-memory structural anomaly scoring (`0.0–100.0`).
- **Layer 4 Egress Warden (`backend/layer4_warden.py`)**: `~0.50ms` (`510µs`) 5-way canonicalization + $O(1)$ tripwire lookup.
- **Layer 5 Merkle Ledger (`backend/layer5_ledger.py`)**: `~0.25ms` (`240µs`) CPACF SHA-256 hash chaining.
- **Total End-to-End P95 Latency**: `< 2.0ms` (`1.42ms` p95 vs. `800.0ms` cloud LLM guardrail baseline = `563x` speedup).
