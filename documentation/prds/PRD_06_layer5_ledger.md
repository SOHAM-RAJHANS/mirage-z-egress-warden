# PRD_06: backend/layer5_ledger.py

**File ID**: `PRD_06_layer5_ledger`  
**Target File(s)**: `backend/layer5_ledger.py`  
**Owner Role**: Role 1 (Cryptographic Audit Engineer)  
**North-Star Benchmark**: IBM Z CPACF Wire-Speed SHA-256 Cryptographic Audit Ledger

## 1. Purpose & Architectural Role (What & Why)

`backend/layer5_ledger.py` maintains the immutable in-memory SHA-256 hash chain (`MERKLE_CHAIN`) linking every evaluated event to the previous block's hash. On IBM LinuxONE (`s390x`), Python's OpenSSL `hashlib.sha256` automatically routes through on-chip CPACF cryptographic instructions. It also powers the interactive Tamper Simulation & Restore demo for Role 4's UI.

## 2. Assigned POWERHOUSE Skills

| Skill Name | Specific Role in This File |
| :--- | :--- |
| `mega-cybersecurity` | Implements tamper-evident SHA-256 Merkle hash chaining with genesis block anchoring. |
| `super-mega-backend` | Provides sub-0.25ms in-memory ledger operations, tamper simulation, and instant state recovery. |

## 3. Technical Specification & Implementation Details

1. **Chain State & Genesis Initialization**:
   - `MERKLE_CHAIN: List[Dict[str, Any]] = []` initialized with Block `0` (Genesis block: `block_index = 0`, `prev_hash = "0" * 64`, `timestamp = "00:00:00.000"`, `event_id = "GENESIS-BLOCK-0000"`, `decoy_hmacs = "NONE"`, `layer4_verdict = "GENESIS_INIT"`).
   - `_TAMPER_BACKUP: Dict[int, Dict[str, Any]] = {}` stores original copies of any block mutated during `simulate_tamper()` so `restore_chain()` restores 100% integrity in `< 0.1ms`.
2. **Exact Hash Formula (Dossier 01 Subtask 3.1)**:
   - `compute_block_hash(prev_hash: str, timestamp: str, event_id: str, decoy_hmacs_str: str, layer4_verdict: str) -> str`:
     `hashlib.sha256(f"{prev_hash}|{timestamp}|{event_id}|{decoy_hmacs_str}|{layer4_verdict}".encode("utf-8")).hexdigest()`
3. **Core Functions**:
   - `append_event_block(timestamp: str, event_id: str, decoy_hmacs: List[str], layer4_verdict: str) -> Tuple[Dict[str, Any], float]`
   - `verify_merkle_chain() -> Tuple[bool, Optional[int]]`: Recomputes every block's hash and `prev_hash` link from Block 0; returns `(True, None)` if intact or `(False, corrupted_block_index)` on mismatch.
   - `simulate_tamper(target_index: Optional[int] = None) -> Dict[str, Any]`: Picks the latest non-genesis block (or `target_index`), saves its original fields in `_TAMPER_BACKUP`, mutates `layer4_verdict` to `"ALLOWED_CLEAN (TAMPERED)"` without updating `event_hash`, runs `verify_merkle_chain()`, and returns the status dict with `chain_intact: False` and `corrupted_block_index`.
   - `restore_chain() -> Dict[str, Any]`: Restores all backed-up blocks from `_TAMPER_BACKUP`, clears the backup dict, re-verifies `chain_intact: True`, and returns the clean ledger status.

## 4. Non-Negotiable Invariants & Handshake Guarantees

- **Zero Schema Drift**: Every dictionary key and Pydantic attribute must match `00_MASTER_PRD.md` Section 3 & Section 4 character-for-character.
- **Cross-Platform `s390x` Compatibility**: Must run 100% cleanly on both local `x86_64` / `arm64` laptops and `linux/s390x` IBM LinuxONE VMs without requiring uncompiled C-extensions.
- **Latency Ceiling**: Must stay strictly within its allocated sub-millisecond budget so end-to-end pipeline execution stays `< 2.0ms` (`1.42ms` p95).

## 5. Verification Gate Command

```bash
python3 backend/layer5_ledger.py
```
