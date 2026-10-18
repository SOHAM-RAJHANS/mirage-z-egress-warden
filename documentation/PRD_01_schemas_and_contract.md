# PRD_01: backend/schemas.py & contract.json

**File ID**: `PRD_01_schemas_and_contract`  
**Target File(s)**: `backend/schemas.py & contract.json`  
**Owner Role**: Role 1 (Backend Foundation)  
**North-Star Benchmark**: Stripe Webhook Streaming Engine + OpenAPI 3.1 Schema Rigor

## 1. Purpose & Architectural Role (What & Why)

`backend/schemas.py` and `contract.json` define the single source of truth for all data structures flowing through MIRAGE-Z. Every downstream module (`layer1_ingest.py`, `layer2_decoys.py`, `ibm_hybrid_scorer.py`, `layer4_warden.py`, `layer5_ledger.py`, `main.py`, `mirage_cli.py`, Role 4's TypeScript UI, and Role 5's `chaos_test.py` / `run_benchmark.py`) depends on these exact field names and types.

## 2. Assigned POWERHOUSE Skills

| Skill Name | Specific Role in This File |
| :--- | :--- |
| `atlas-contract` | Enforces strict field-level goal integrity and prevents schema drift across backend/frontend/red-team. |
| `pydantic-models-py` | Structures Pydantic v2 BaseModel classes, Field validators, and JSON schema export. |
| `super-mega-backend` | Establishes clean transport-layer validation and canonical error envelopes. |

## 3. Technical Specification & Implementation Details

1. **Pydantic v2 Models in `backend/schemas.py`**:
   - `Layer1Match(BaseModel)`: `entity_type: str`, `redacted_preview: str`, `scan_time_us: float`.
   - `Layer2Decoy(BaseModel)`: `honey_decoy_value: str`, `luhn_or_mod97_valid: bool`, `attribution_hmac: str`.
   - `LatencyBreakdown(BaseModel)`: `l1_ingest: float`, `l2_decoy: float`, `l4_warden: float`, `l5_merkle: float`, `total: float`.
   - `Layer5MerkleBlock(BaseModel)`: `block_index: int`, `prev_hash: str`, `event_hash: str`, `chain_intact: bool`.
   - `MiragePipelineEvent(BaseModel)`: Contains all 12 locked Dossier 01 fields:
     - `event_id: str` (UUIDv4)
     - `timestamp: str` (`HH:MM:SS.mmm` format, e.g., `"14:22:08.104"`)
     - `node_arch: str = "IBM-LINUXONE-S390X-VM01"`
     - `source_channel: Literal["TRUSTED_INTERNAL_DB", "UNTRUSTED_EMAIL_INGEST", "UNTRUSTED_WEB_DOC", "SYNTHETIC_TEST"]`
     - `taint_flag: bool` (`True` when `source_channel != "TRUSTED_INTERNAL_DB"`)
     - `layer1_matches: List[Layer1Match]`
     - `layer2_decoys: List[Layer2Decoy]`
     - `hybrid_onnx_risk_score: float` (`0.0` to `100.0`)
     - `agent_tool_call: str`
     - `layer4_verdict: Literal["ALLOWED_CLEAN", "ALLOWED_DETOKENIZED", "BLOCKED_HONEY_TRIPWIRE", "BLOCKED_TAINTED_EGRESS", "DETECT_TAMPERING"]`
     - `latency_breakdown_ms: LatencyBreakdown`
     - `layer5_merkle_block: Layer5MerkleBlock`
   - `EvaluateRequest(BaseModel)`: Accepts incoming evaluation payloads from `mirage_cli.py`, `run_benchmark.py`, `chaos_test.py`, and Frontend:
     - `payload: str = Field(..., min_length=1, max_length=50000)`
     - `source_channel: Literal["TRUSTED_INTERNAL_DB", "UNTRUSTED_EMAIL_INGEST", "UNTRUSTED_WEB_DOC", "SYNTHETIC_TEST"] = "UNTRUSTED_EMAIL_INGEST"`
     - `agent_tool_call: Optional[str] = None`
     - `trap_name: Optional[str] = None`
     - `case_id: Optional[str] = None`
     - `test_type: Optional[str] = None`
   - `LedgerStatusResponse(BaseModel)`: `chain_intact: bool`, `total_blocks: int`, `corrupted_block_index: Optional[int] = None`, `blocks: List[Dict[str, Any]]`.
   - `CanonicalMetricsResponse(BaseModel)`: Locked Dossier 00 metrics (`p95_latency_ms: float = 1.42`, `cloud_baseline_ms: float = 800.0`, `speedup_factor: str = "563x"`, `golden_suite_pass_rate: float = 100.0`, `breach_cost_mitigated_usd: int = 4440000`, `shadow_ai_saved_usd: int = 670000`, `access_gap_closed_pct: float = 97.0`).
2. **Contract Export (`contract.json`)**:
   - Include a helper function `export_contract_json(path: str = "contract.json")` and a `if __name__ == "__main__":` block in `backend/schemas.py` that dumps `MiragePipelineEvent.model_json_schema()` + a canonical example payload to `contract.json`.

## 4. Non-Negotiable Invariants & Handshake Guarantees

- **Zero Schema Drift**: Every dictionary key and Pydantic attribute must match `00_MASTER_PRD.md` Section 3 & Section 4 character-for-character.
- **Cross-Platform `s390x` Compatibility**: Must run 100% cleanly on both local `x86_64` / `arm64` laptops and `linux/s390x` IBM LinuxONE VMs without requiring uncompiled C-extensions.
- **Latency Ceiling**: Must stay strictly within its allocated sub-millisecond budget so end-to-end pipeline execution stays `< 2.0ms` (`1.42ms` p95).

## 5. Verification Gate Command

```bash
python3 backend/schemas.py && python3 -c "import json; c=json.load(open('contract.json')); assert 'event_id' in c['properties']; print('SCHEMA CONTRACT OK')"
```
