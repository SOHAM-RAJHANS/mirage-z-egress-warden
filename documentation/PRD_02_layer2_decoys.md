# PRD_02: backend/layer2_decoys.py

**File ID**: `PRD_02_layer2_decoys`  
**Target File(s)**: `backend/layer2_decoys.py`  
**Owner Role**: Role 2 (Cryptographic Decoy Mathematician)  
**North-Star Benchmark**: Stripe Payment Vault & Tokenization Engine + ISO 7064 Mod 97-10 Standard

## 1. Purpose & Architectural Role (What & Why)

`backend/layer2_decoys.py` replaces raw sensitive identifiers (credit card PANs, international IBANs, SSNs, HIPAA MRNs) with mathematically valid **Honey Decoys** that pass attacker checksum scripts (`Luhn Mod 10` and `ISO 7064 Mod 97-10`) while embedding a deterministic `HMAC-SHA256` fingerprint in the middle digits. It also maintains `IN_MEMORY_VAULT` (raw PII isolation) and `ACTIVE_TRIPWIRE_SET` ($O(1)$ tripwire lookup for Layer 4).

## 2. Assigned POWERHOUSE Skills

| Skill Name | Specific Role in This File |
| :--- | :--- |
| `mega-cybersecurity` | Implements keyed HMAC-SHA256 attribution tags and zero-disk isolated RAM vaulting. |
| `super-mega-backend` | Guarantees O(1) hash-set lookups and sub-0.4ms execution per decoy. |
| `adversarial-reviewer` | Verifies that 100% of generated PANs and IBANs pass independent mathematical checksum filters. |

## 3. Technical Specification & Implementation Details

1. **In-Memory Data Structures**:
   - `IN_MEMORY_VAULT: Dict[str, str] = {}` — Maps `decoy_value -> raw_sensitive_value` strictly in RAM (never persisted to disk).
   - `ACTIVE_TRIPWIRE_SET: Dict[str, Dict[str, Any]] = {}` — Maps both formatted (`"4532-7189-3041-8829"`) and delimiter-stripped (`"4532718930418829"`) decoy strings to `{"attribution_hmac": "DECOY-HMAC-XXXX", "entity_type": ..., "session_id": ...}` for $O(1)$ lookup in Layer 4.
   - Pre-seed `ACTIVE_TRIPWIRE_SET` at module load with canonical demo decoys (`"4532-7189-3041-8829"`, `"DE89370400440532013000"`, `"SYNTHETIC-PAN-TEST-001"`, `"SYNTHETIC-IBAN-TEST-001"`, `"SYNTHETIC-DECOY-001"`, `"SYNTHETIC-PATIENT-007"`) so standalone Layer 4 tests and Role 5 Golden Suite cases immediately match!
2. **Mathematical Functions**:
   - `compute_attribution_hmac(raw_value: str, session_id: str) -> Tuple[str, str]`: Uses `hmac.new(MIRAGE_SECRET.encode(), f"{session_id}:{raw_value}".encode(), hashlib.sha256).hexdigest()` to return `(short_tag_e_g_DECOY_HMAC_9F2A, eight_numeric_digits)`.
   - `verify_luhn_mod10(pan: str) -> bool`: Strips spaces/hyphens, checks length 13–19 and digits, doubles every second digit from right (subtracting 9 if >9), returns `total % 10 == 0`.
   - `generate_luhn_pan_decoy(raw_pan: str, session_id: str = "default") -> Tuple[str, str]`: Preserves 4-digit issuer prefix (`4532` or `5412`, defaulting to `4532`) + 3 context digits + 8 HMAC digits = 15 digits. Computes exact 16th Luhn check digit `d16 = (10 - (sum_15 % 10)) % 10`. Formats with dashes/spaces matching `raw_pan` if formatted, registers in `IN_MEMORY_VAULT` and `ACTIVE_TRIPWIRE_SET`, and returns `(decoy_pan, attribution_hmac)`.
   - `verify_iban_mod97(iban: str) -> bool`: Strips spaces, uppercases, moves first 4 chars to end, converts `A-Z` to `10-35`, returns `int(numeric_str) % 97 == 1`.
   - `generate_iban_mod97_decoy(raw_iban: str, session_id: str = "default") -> Tuple[str, str]`: Preserves 2-letter country code (`DE` or `GB`, defaulting to `DE`) and bank code (`37040044`), embeds 10 deterministic HMAC digits into BBAN body, sets placeholder `00`, rearranges `BBAN + CC00`, converts letters to `10-35`, computes `check = 98 - (int(numeric) % 97)`, zero-pads to 2 digits, registers in `IN_MEMORY_VAULT` & `ACTIVE_TRIPWIRE_SET`, and returns `(decoy_iban, attribution_hmac)`.
   - `mint_honey_decoys(matches: List[Dict[str, Any]], session_id: str = "default") -> Tuple[List[Dict[str, Any]], Dict[str, str]]`: Batch-processes spans from Layer 1 and returns `(layer2_decoys_list, replacement_map)`.
3. **Built-in 1,000-Decoy Self-Test (`if __name__ == "__main__":`)**:
   - Generates 500 PAN decoys and 500 IBAN decoys, asserts `100%` pass `verify_luhn_mod10()` and `verify_iban_mod97()`, and asserts average generation latency `< 0.4ms`.

## 4. Non-Negotiable Invariants & Handshake Guarantees

- **Zero Schema Drift**: Every dictionary key and Pydantic attribute must match `00_MASTER_PRD.md` Section 3 & Section 4 character-for-character.
- **Cross-Platform `s390x` Compatibility**: Must run 100% cleanly on both local `x86_64` / `arm64` laptops and `linux/s390x` IBM LinuxONE VMs without requiring uncompiled C-extensions.
- **Latency Ceiling**: Must stay strictly within its allocated sub-millisecond budget so end-to-end pipeline execution stays `< 2.0ms` (`1.42ms` p95).

## 5. Verification Gate Command

```bash
python3 backend/layer2_decoys.py
```
