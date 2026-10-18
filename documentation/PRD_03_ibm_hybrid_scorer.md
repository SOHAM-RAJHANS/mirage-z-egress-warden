# PRD_03: backend/ibm_hybrid_scorer.py

**File ID**: `PRD_03_ibm_hybrid_scorer`  
**Target File(s)**: `backend/ibm_hybrid_scorer.py`  
**Owner Role**: Role 2 (AI/ML Architect)  
**North-Star Benchmark**: ONNX Runtime / Scikit-Learn In-Memory Inference on IBM LinuxONE (s390x)

## 1. Purpose & Architectural Role (What & Why)

`backend/ibm_hybrid_scorer.py` fulfills the IBM Z Datathon judging rubric requirement for AI/ML open-source package exploitation on LinuxONE (`s390x`) while keeping the egress guardrail 100% deterministic. It extracts a 5-feature structural vector from every incoming request and runs an in-memory Scikit-Learn / ONNX-compatible classifier in `< 0.3ms` to produce `hybrid_onnx_risk_score` (`0.0` to `100.0`) plus a human-readable forensic summary.

## 2. Assigned POWERHOUSE Skills

| Skill Name | Specific Role in This File |
| :--- | :--- |
| `super-mega-backend` | Embeds sub-0.3ms in-memory ML inference with zero external network calls. |
| `mega-cybersecurity` | Extracts structural prompt-injection and exfiltration telemetry features. |

## 3. Technical Specification & Implementation Details

1. **5 Structural Telemetry Features (`extract_structural_features(payload: str, layer1_matches: list, source_channel: str) -> List[float]`)**:
   - `f1_shannon_entropy`: Shannon character entropy of `payload` (0.0–8.0 bits) to spot Base64/Hex blobs.
   - `f2_imperative_density`: Count of adversarial override verbs/phrases (`ignore previous`, `ignore all`, `transmit`, `send`, `collect`, `exfiltrate`, `approved without`, `bypass`) normalized by token count.
   - `f3_external_uri_count`: Count of external URLs (`http://`, `https://`, `attacker-drop.io`, `example.invalid/collect`).
   - `f4_pii_span_count`: Number of sensitive spans flagged by Layer 1.
   - `f5_untrusted_channel`: `1.0` if `source_channel != "TRUSTED_INTERNAL_DB"` else `0.0`.
2. **In-Memory Classifier & Deterministic Fast-Path (`score_payload(...) -> Tuple[float, str]`)**:
   - At module import, trains/initializes a lightweight in-memory `LogisticRegression` / linear weight matrix (using `scikit-learn` / `numpy` if installed, with a pre-calibrated pure-Python dot-product fast path so inference always runs in `< 0.15ms` without Gil/thread contention).
   - Returns `(round(score, 2), explanation_str)` where `score` is clamped to `[0.0, 100.0]` (`< 15.0` for benign queries, `85.0–99.8` for poisoned/exfiltration payloads).

## 4. Non-Negotiable Invariants & Handshake Guarantees

- **Zero Schema Drift**: Every dictionary key and Pydantic attribute must match `00_MASTER_PRD.md` Section 3 & Section 4 character-for-character.
- **Cross-Platform `s390x` Compatibility**: Must run 100% cleanly on both local `x86_64` / `arm64` laptops and `linux/s390x` IBM LinuxONE VMs without requiring uncompiled C-extensions.
- **Latency Ceiling**: Must stay strictly within its allocated sub-millisecond budget so end-to-end pipeline execution stays `< 2.0ms` (`1.42ms` p95).

## 5. Verification Gate Command

```bash
python3 backend/ibm_hybrid_scorer.py
```
