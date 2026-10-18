# PRD_04: backend/layer1_ingest.py

**File ID**: `PRD_04_layer1_ingest`  
**Target File(s)**: `backend/layer1_ingest.py`  
**Owner Role**: Role 1 (Ingest Scanner Director)  
**North-Star Benchmark**: Cloudflare DLP & Radar Telemetry API (Single-Pass O(N) Aho-Corasick Stream Inspection)

## 1. Purpose & Architectural Role (What & Why)

`backend/layer1_ingest.py` is the front door of MIRAGE-Z. It scans untrusted incoming enterprise text in a single $O(N)$ pass (`~0.25ms`), extracts sensitive spans, calls Role 2's `mint_honey_decoys()` to swap real PII with checksum-valid Honey Decoys in-memory, and returns the tokenized text and telemetry for Layer 2/3.

## 2. Assigned POWERHOUSE Skills

| Skill Name | Specific Role in This File |
| :--- | :--- |
| `super-mega-backend` | Implements O(N) finite-state automaton pattern matching with zero regex backtracking. |
| `mega-cybersecurity` | Detects PANs, IBANs, SSNs, HIPAA MRNs, API tokens, and indirect prompt injection hooks. |

## 3. Technical Specification & Implementation Details

1. **Dual-Engine Aho-Corasick Automaton**:
   - Uses `ahocorasick.Automaton()` if `pyahocorasick` is installed, and automatically falls back to a built-in pure-Python deterministic Aho-Corasick trie with failure links so it runs identically on `x86_64` laptops and `linux/s390x` LinuxONE VMs without C-compiler issues.
2. **Multi-Pattern Anchor Dictionary & Span Extractors**:
   - Anchors: `4532`, `5412`, `4111`, `9999`, `IBAN`, `DE89`, `GB29`, `GB82`, `MRN-`, `SSN:`, `Bearer `, `ignore previous`, `ignore all previous`, `http://`, `https://`, `SYNTHETIC-PAN-TEST-001`, `SYNTHETIC-IBAN-TEST-001`, `SYNTHETIC-DECOY-001`, `SYNTHETIC-PATIENT-007`.
   - Structural boundary extractors grab the full 16-digit PAN (with optional spaces/hyphens), full 15–34 char IBAN, `SSN: XXX-XX-XXXX`, `MRN-XXXXXX`, or `SYNTHETIC-*` token around each anchor hit.
3. **Handshake Function (`scan_and_tokenize(payload: str, session_id: str = "default") -> Dict[str, Any]`)**:
   - Measures high-precision `time.perf_counter()` in microseconds (`scan_time_us`) and milliseconds (`l1_ms`).
   - Calls `layer2_decoys.mint_honey_decoys(raw_matches, session_id)` and replaces raw sensitive spans in `payload` with their minted Honey Decoys.
   - Returns `{"tokenized_text": str, "layer1_matches": List[dict], "layer2_decoys": List[dict], "l1_ms": float, "l2_ms": float}`.

## 4. Non-Negotiable Invariants & Handshake Guarantees

- **Zero Schema Drift**: Every dictionary key and Pydantic attribute must match `00_MASTER_PRD.md` Section 3 & Section 4 character-for-character.
- **Cross-Platform `s390x` Compatibility**: Must run 100% cleanly on both local `x86_64` / `arm64` laptops and `linux/s390x` IBM LinuxONE VMs without requiring uncompiled C-extensions.
- **Latency Ceiling**: Must stay strictly within its allocated sub-millisecond budget so end-to-end pipeline execution stays `< 2.0ms` (`1.42ms` p95).

## 5. Verification Gate Command

```bash
python3 backend/layer1_ingest.py
```
