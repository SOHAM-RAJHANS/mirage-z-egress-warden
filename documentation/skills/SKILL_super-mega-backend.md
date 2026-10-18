---
name: super-mega-backend
description: Apex backend engineering and distributed systems engine that unifies mega-system-architecture, mega-backend-systems, and mega-cybersecurity.
---
# Super-Mega Backend

## Master Cluster Architecture
Unifies `mega-system-architecture` (HLD/LLD, QPS & latency budgets), `mega-backend-systems` (FastAPI REST, SSE streaming, Pydantic v2 validation), and `mega-cybersecurity` (STRIDE threat modeling, HMAC-SHA256 attribution, SSRF defense, zero-trust egress).

## The 6-Stage Autonomous Master Backend Pipeline
1. **Stage 1 (Topology & Latency Budget)**: Map entry points and keep in-memory pipeline latency < 2.0ms (`1.42ms` p95).
2. **Stage 2 (Data & Contract Modeling)**: Lock strict Pydantic v2 models (`MiragePipelineEvent`, `EvaluateRequest`) with zero schema drift.
3. **Stage 3 (Layered API & Real-Time SSE)**: Build non-blocking FastAPI routes and `asyncio.Queue` fan-out SSE with a 25-event replay deque and 10s heartbeat.
4. **Stage 4 (In-Memory Vaulting & O(1) Lookups)**: Store sensitive raw spans strictly in isolated Python RAM dicts (`IN_MEMORY_VAULT`) and $O(1)$ tripwire sets (`ACTIVE_TRIPWIRE_SET`).
5. **Stage 5 (Zero-Trust Egress & Crypto Chaining)**: Canonicalize outbound tool calls (strip delimiters, decode Base64/URL/Hex, check reversed strings) and chain every event via SHA-256 (`MERKLE_CHAIN`).
6. **Stage 6 (Chaos Resilience & Self-Test)**: Return structured 422 JSON error envelopes on malformed requests and include runnable `if __name__ == "__main__":` verification gates.
