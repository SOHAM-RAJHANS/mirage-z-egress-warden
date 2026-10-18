---
name: vibe-code-auditor
description: Audit rapidly generated AI code for structural flaws, mock disclaimers, fragility, and integration mismatches.
---
# Vibe Code Auditor

## Phase 2 Muscle & Antislop Checklist
1. **Strip Self-Sabotaging Mock Disclaimers**: Remove `"local mock · not enforcement"`, `"not a Merkle tree"`, and `"Not yet measured"` from Frontend components and Benchmark reports.
2. **Verify Real Wiring**: Confirm `frontend/src/stores/soc.ts` actually calls `http://localhost:8000/v1/mirage/*` and `benchmarks/run_benchmark.py` evaluates against the live backend pipeline.
3. **Performance Invariants**: Ensure no $O(N^2)$ string copying or blocking disk I/O exists inside the request path.
