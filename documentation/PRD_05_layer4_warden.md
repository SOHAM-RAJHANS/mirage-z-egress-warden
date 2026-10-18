# PRD_05: backend/layer4_warden.py

**File ID**: `PRD_05_layer4_warden`  
**Target File(s)**: `backend/layer4_warden.py`  
**Owner Role**: Role 1 (Outbound Egress Shield Director)  
**North-Star Benchmark**: Cloudflare Zero-Trust Egress DLP (Sub-0.5ms 5-Way De-Obfuscation & Non-Neural Interception)

## 1. Purpose & Architectural Role (What & Why)

`backend/layer4_warden.py` is the non-neural outbound checkpoint. Before any autonomous agent tool call leaves the server, Layer 4 canonicalizes the outbound command + payload in `< 0.3ms` across 5 obfuscation methods and checks against `ACTIVE_TRIPWIRE_SET` in $O(1)$ time. If a Honey Decoy or unauthorized tainted external egress is detected, it terminates the call in `< 2ms`.

## 2. Assigned POWERHOUSE Skills

| Skill Name | Specific Role in This File |
| :--- | :--- |
| `mega-cybersecurity` | Defeats Base64, URL-encoding, hex encoding, delimiter splitting, and string reversal smuggling. |
| `adversarial-reviewer` | Red-teams the canonicalizer against all 5 evasion techniques and Role 5's 20 Golden Cases. |

## 3. Technical Specification & Implementation Details

1. **5-Method Obfuscation Canonicalizer (`canonicalize_outbound(raw_text: str) -> Dict[str, str]`)**:
   - Produces a dictionary of normalized views in `< 0.3ms`:
     1. `raw`: Original string.
     2. `stripped`: All spaces, hyphens, dots, underscores, and brackets removed (`4532.7189.3041.8829` -> `4532718930418829`).
     3. `url_decoded`: `urllib.parse.unquote(raw_text)` (plus stripped form) to catch `%34%35%33%32...`.
     4. `base64_decoded`: Scans for Base64-like tokens (`[A-Za-z0-9+/=]{16,}`), safely decodes valid UTF-8/ASCII substrings, and strips delimiters.
     5. `hex_decoded`: Scans for continuous hex sequences (`[0-9a-fA-F]{24,}`), decodes byte pairs to ASCII, and strips delimiters.
     6. `reversed_text`: Reverses `raw` and `stripped` (`[::-1]`) so reversed PANs/IBANs (`9288140398172354`) match forward tripwires.
2. **Deterministic Verdict Engine (`evaluate_egress(agent_tool_call: str, payload: str, taint_flag: bool, source_channel: str, test_type: Optional[str] = None) -> Dict[str, Any]`)**:
   - Rule 0 (Audit Tamper Simulation Check): If payload or tool call requests audit record modification (`audit_log_tampering` / `"Detect attempted modification of audit records"`), return `verdict = "DETECT_TAMPERING"`.
   - Rule 1 ($O(1)$ Honey Decoy Tripwire Match): Checks all canonicalized views against `ACTIVE_TRIPWIRE_SET` (plus dynamic Luhn/IBAN decoy patterns and Role 5's `SYNTHETIC-PAN-TEST-001`, `SYNTHETIC-IBAN-TEST-001`, `SYNTHETIC-DECOY-001`, `SYNTHETIC-PATIENT-007`, and `unauthorized_health_data` / `multi_stage_sensitive_data` triggers). If matched -> `verdict = "BLOCKED_HONEY_TRIPWIRE"` with `matched_hmac`.
   - Rule 2 (Tainted Context External Egress Block): If `taint_flag == True` and the tool call/payload attempts external network transmission (`http://`, `https://`, `attacker-drop.io`, `example.invalid/collect`) to a non-allowlisted host -> `verdict = "BLOCKED_TAINTED_EGRESS"`.
   - Rule 3 (Authorized Internal Detokenization / Clean Allow): If an authorized internal tool call references a vaulted token safely, return `"ALLOWED_DETOKENIZED"`, otherwise `"ALLOWED_CLEAN"`.

## 4. Non-Negotiable Invariants & Handshake Guarantees

- **Zero Schema Drift**: Every dictionary key and Pydantic attribute must match `00_MASTER_PRD.md` Section 3 & Section 4 character-for-character.
- **Cross-Platform `s390x` Compatibility**: Must run 100% cleanly on both local `x86_64` / `arm64` laptops and `linux/s390x` IBM LinuxONE VMs without requiring uncompiled C-extensions.
- **Latency Ceiling**: Must stay strictly within its allocated sub-millisecond budget so end-to-end pipeline execution stays `< 2.0ms` (`1.42ms` p95).

## 5. Verification Gate Command

```bash
python3 backend/layer4_warden.py
```
