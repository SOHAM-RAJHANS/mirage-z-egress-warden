# MIRAGE-Z Master Agent Execution & Prompt Playbook (00_MASTER_AGENTS)

**Purpose**: This document is your **Vibe-Coding Command Center (`AGENTS.md`)** generated via `@smart-skill-picker`. While `00_MASTER_PRD.md` defines *what* each file is and *how* its algorithms work, this `00_MASTER_AGENTS.md` defines **how your 4-Agent Coding Stack (OpenCode + Grok Code + Antigravity + Cline Backup)** executes, reviews, polishes, and verifies every file with minimum token spend.

## 1. Your 4-Agent Warchest Pipeline (How Every File Moves From PRD to Production)

| Stage | AI Tool in Your Kit | Role in the Loop | Token-Saving Rule |
| :--- | :--- | :--- | :--- |
| **Stage 1: Scaffold** | **OpenCode** | Reads the file's `PRD_XX.md` + assigned POWERHOUSE skills and writes the complete code file in one pass. | Feed **only** `00_MASTER_PRD.md` (Sections 3–4) + the single `PRD_XX.md` for that file—never dump the entire repo into context. |
| **Stage 2: Audit** | **Grok Code** | Runs the **Universal Large-Scale PRD & Error Auditor Prompt** below to catch contract mismatches, crashes, or edge cases. | Use the single Universal Auditor Prompt below for any file by just swapping the file paste + its `PRD_XX` section. |
| **Stage 3: Polish & Gate** | **Antigravity** | Side-by-side inspection, docstring refinement, and running the terminal Verification Gate command. | Do not move to File `N+1` until File `N`'s Verification Gate command exits `0`. |
| **Stage 4: Failover** | **Cline (Backup)** | Emergency autonomous builder/debugger if OpenCode or Grok stalls or hits quota limits. | Point Cline directly at `PRD_XX.md` + the terminal gate command. |

## 2. The Universal Large-Scale Grok Code Auditor Prompt (Works on ANY File)

Whenever OpenCode finishes generating a file, paste the **file's PRD section** + **the generated code** into **Grok Code** with this single universal prompt:

```text
Load skills: `atlas-contract`, `adversarial-reviewer`, `vibe-code-auditor`, and `mega-cybersecurity`.
You are auditing a critical production file for MIRAGE-Z (IBM Z Datathon 2026 — Autonomous Zero-Trust Egress Warden on LinuxONE s390x).

Compare the attached code against its attached PRD specification and verify:
1. STRICT CONTRACT FIDELITY: Every function signature, class name, enum value, and JSON key matches the PRD 100%. Zero renamed keys, zero missing fields, zero type mismatches.
2. ZERO RUNTIME / IMPORT ERRORS: Check all imports, Python 3.11 typing, async/await safety, and cross-platform `linux/s390x` compatibility (must not crash if optional C-extensions like `pyahocorasick` or `onnxruntime` are absent—fallback paths must work cleanly).
3. ADVERSARIAL EDGE-CASE HARDENING: Test mentally against empty strings, `None`/null values, 20,000-character fuzz payloads (`chaos_test.py`), and rapid concurrent requests.
4. BENCHMARK & LATENCY COMPLIANCE: Strip any slow loops, blocking I/O, or placeholder comments so execution remains strictly under the sub-millisecond budget.

If you find ANY error, drift, or fragility, list the exact issues in 3 short bullets and output the 100% corrected, complete file ready to save.
```

## 3. Universal Antigravity Polish & Documentation Prompt

Once Grok Code signs off on a file, run this inside **Antigravity**:

```text
Review the current file in Antigravity:
1. Ensure clean module header comments, concise docstrings, and PEP-8 / TypeScript formatting without changing any locked function signatures or JSON keys.
2. Run the file's Verification Gate command in the terminal and confirm 100% pass.
```

## 4. Per-File `@smart-skill-picker` Execution Guides (Files 01 to 10)


# AGENTS_01: Vibe-Coding Execution Guide for `backend/schemas.py & contract.json`

**Target File(s)**: `backend/schemas.py & contract.json`  
**Companion PRD**: `PRD_01_schemas_and_contract.md`  
**North-Star Benchmark**: Stripe Webhook Streaming Engine + OpenAPI 3.1 Schema Rigor

## 1. `@smart-skill-picker` OOP-Mix Execution Blueprint

- **Task**:
  - `goal`: Implement `backend/schemas.py & contract.json` with 100% contract fidelity to `PRD_01_schemas_and_contract.md` and `00_MASTER_PRD.md`.
  - `context`: MIRAGE-Z 5-Layer Zero-Trust Egress Warden on IBM LinuxONE (`s390x`).
  - `constraints`: Sub-2ms total pipeline latency, zero neural LLMs on Layer 4 egress, 100% compatibility with Role 4 Frontend (`soc.ts`) and Role 5 Red-Team (`run_benchmark.py` & `chaos_test.py`).
  - `success`: Verification gate `python3 backend/schemas.py && python3 -c "import json; c=json.load(open('contract.json')); assert 'event_id' in c['properties']; print('SCHEMA CONTRACT OK')"` exits with code `0` and zero warnings.
- **Skills[]**:
  - `atlas-contract`: Enforces strict field-level goal integrity and prevents schema drift across backend/frontend/red-team.
  - `pydantic-models-py`: Structures Pydantic v2 BaseModel classes, Field validators, and JSON schema export.
  - `super-mega-backend`: Establishes clean transport-layer validation and canonical error envelopes.
- **Tools[MCP]**:
  - `use`: File system read/write, terminal test runner (`pytest` / `python3`), JSON schema validator.
  - `guardrail`: Never replace deterministic algorithms with mock placeholders or break locked field names in `MiragePipelineEvent`.
- **Execute**: `inspect PRD_01 -> scaffold via OpenCode -> adversarial audit via Grok Code -> polish & gate check in Antigravity (or Cline failover)`.

## 2. Step-by-Step 4-Agent Warchest Prompts

### STEP A — OpenCode (Primary Heavy Builder Prompt)
Copy and paste this exact prompt into **OpenCode** alongside `00_MASTER_PRD.md` and `PRD_01_schemas_and_contract.md`:

```text
Load POWERHOUSE skills: atlas-contract, pydantic-models-py, super-mega-backend.
Read 00_MASTER_PRD.md and PRD_01_schemas_and_contract.md carefully.
Build the complete, production-ready implementation for `backend/schemas.py & contract.json` matching our North-Star Benchmark (Stripe Webhook Streaming Engine + OpenAPI 3.1 Schema Rigor).

Strict Requirements:
1. Implement every class, function signature, constant, and edge-case rule specified in PRD_01_schemas_and_contract.md with zero placeholders or TODOs.
2. Preserve 100% of the cross-module API handshakes defined in 00_MASTER_PRD.md Section 4.
3. Include a runnable `if __name__ == "__main__":` self-test block at the bottom of the Python module that verifies the module deterministically.
4. Run `python3 backend/schemas.py && python3 -c "import json; c=json.load(open('contract.json')); assert 'event_id' in c['properties']; print('SCHEMA CONTRACT OK')"` and confirm it passes before finishing.
```

### STEP B — Grok Code (The Ruthless Error & Contract Auditor Prompt)
Paste the generated code from `backend/schemas.py & contract.json` plus `PRD_01_schemas_and_contract.md` into **Grok Code** with this prompt:

```text
Act as an elite Principal Systems Auditor using `adversarial-reviewer`, `vibe-code-auditor`, and `atlas-contract`.
Audit this implementation of `backend/schemas.py & contract.json` against `PRD_01_schemas_and_contract.md` and our North-Star Benchmark (Stripe Webhook Streaming Engine + OpenAPI 3.1 Schema Rigor).

Run 3 mandatory checks and output the corrected full file if ANY flaw is found:
1. Contract & Handshake Check: Verify every function name, parameter, return type, and JSON key matches `00_MASTER_PRD.md` Section 3 & 4 with zero drift.
2. Saboteur Edge-Case Check: What happens on empty string, malformed input, 20,000-char payload, concurrent async calls, or missing optional packages on `linux/s390x`? Fix any crash path now.
3. Performance & Anti-Slop Check: Strip any slow O(N^2) loops, unclosed resources, or generic hackathon placeholder comments. Ensure execution stays within the sub-millisecond latency budget.
```

### STEP C — Antigravity (Visual IDE Integration, Docs & Final Polish Prompt)
Run this inside **Antigravity** to finalize documentation and verify the checkpoint gate:

```text
Open `backend/schemas.py & contract.json` in Antigravity:
1. Verify module-level and function-level docstrings clearly document the IBM LinuxONE s390x architecture context and latency budget.
2. Execute `python3 backend/schemas.py && python3 -c "import json; c=json.load(open('contract.json')); assert 'event_id' in c['properties']; print('SCHEMA CONTRACT OK')"` in the integrated terminal and confirm 100% pass with zero import or runtime errors.
```

### STEP D — Cline Warchest Backup (Emergency One-Shot Failover Prompt)
If OpenCode or another agent hits a rate limit or stalls, drop this single self-contained prompt into **Cline**:

```text
Read `00_MASTER_PRD.md` and `PRD_01_schemas_and_contract.md`. Create `backend/schemas.py & contract.json` with a complete, zero-placeholder implementation that satisfies every specification in `PRD_01_schemas_and_contract.md`, then run `python3 backend/schemas.py && python3 -c "import json; c=json.load(open('contract.json')); assert 'event_id' in c['properties']; print('SCHEMA CONTRACT OK')"` in the terminal and fix any issues until the verification command exits with code 0.
```


# AGENTS_02: Vibe-Coding Execution Guide for `backend/layer2_decoys.py`

**Target File(s)**: `backend/layer2_decoys.py`  
**Companion PRD**: `PRD_02_layer2_decoys.md`  
**North-Star Benchmark**: Stripe Payment Vault & Tokenization Engine + ISO 7064 Mod 97-10 Standard

## 1. `@smart-skill-picker` OOP-Mix Execution Blueprint

- **Task**:
  - `goal`: Implement `backend/layer2_decoys.py` with 100% contract fidelity to `PRD_02_layer2_decoys.md` and `00_MASTER_PRD.md`.
  - `context`: MIRAGE-Z 5-Layer Zero-Trust Egress Warden on IBM LinuxONE (`s390x`).
  - `constraints`: Sub-2ms total pipeline latency, zero neural LLMs on Layer 4 egress, 100% compatibility with Role 4 Frontend (`soc.ts`) and Role 5 Red-Team (`run_benchmark.py` & `chaos_test.py`).
  - `success`: Verification gate `python3 backend/layer2_decoys.py` exits with code `0` and zero warnings.
- **Skills[]**:
  - `mega-cybersecurity`: Implements keyed HMAC-SHA256 attribution tags and zero-disk isolated RAM vaulting.
  - `super-mega-backend`: Guarantees O(1) hash-set lookups and sub-0.4ms execution per decoy.
  - `adversarial-reviewer`: Verifies that 100% of generated PANs and IBANs pass independent mathematical checksum filters.
- **Tools[MCP]**:
  - `use`: File system read/write, terminal test runner (`pytest` / `python3`), JSON schema validator.
  - `guardrail`: Never replace deterministic algorithms with mock placeholders or break locked field names in `MiragePipelineEvent`.
- **Execute**: `inspect PRD_02 -> scaffold via OpenCode -> adversarial audit via Grok Code -> polish & gate check in Antigravity (or Cline failover)`.

## 2. Step-by-Step 4-Agent Warchest Prompts

### STEP A — OpenCode (Primary Heavy Builder Prompt)
Copy and paste this exact prompt into **OpenCode** alongside `00_MASTER_PRD.md` and `PRD_02_layer2_decoys.md`:

```text
Load POWERHOUSE skills: mega-cybersecurity, super-mega-backend, adversarial-reviewer.
Read 00_MASTER_PRD.md and PRD_02_layer2_decoys.md carefully.
Build the complete, production-ready implementation for `backend/layer2_decoys.py` matching our North-Star Benchmark (Stripe Payment Vault & Tokenization Engine + ISO 7064 Mod 97-10 Standard).

Strict Requirements:
1. Implement every class, function signature, constant, and edge-case rule specified in PRD_02_layer2_decoys.md with zero placeholders or TODOs.
2. Preserve 100% of the cross-module API handshakes defined in 00_MASTER_PRD.md Section 4.
3. Include a runnable `if __name__ == "__main__":` self-test block at the bottom of the Python module that verifies the module deterministically.
4. Run `python3 backend/layer2_decoys.py` and confirm it passes before finishing.
```

### STEP B — Grok Code (The Ruthless Error & Contract Auditor Prompt)
Paste the generated code from `backend/layer2_decoys.py` plus `PRD_02_layer2_decoys.md` into **Grok Code** with this prompt:

```text
Act as an elite Principal Systems Auditor using `adversarial-reviewer`, `vibe-code-auditor`, and `atlas-contract`.
Audit this implementation of `backend/layer2_decoys.py` against `PRD_02_layer2_decoys.md` and our North-Star Benchmark (Stripe Payment Vault & Tokenization Engine + ISO 7064 Mod 97-10 Standard).

Run 3 mandatory checks and output the corrected full file if ANY flaw is found:
1. Contract & Handshake Check: Verify every function name, parameter, return type, and JSON key matches `00_MASTER_PRD.md` Section 3 & 4 with zero drift.
2. Saboteur Edge-Case Check: What happens on empty string, malformed input, 20,000-char payload, concurrent async calls, or missing optional packages on `linux/s390x`? Fix any crash path now.
3. Performance & Anti-Slop Check: Strip any slow O(N^2) loops, unclosed resources, or generic hackathon placeholder comments. Ensure execution stays within the sub-millisecond latency budget.
```

### STEP C — Antigravity (Visual IDE Integration, Docs & Final Polish Prompt)
Run this inside **Antigravity** to finalize documentation and verify the checkpoint gate:

```text
Open `backend/layer2_decoys.py` in Antigravity:
1. Verify module-level and function-level docstrings clearly document the IBM LinuxONE s390x architecture context and latency budget.
2. Execute `python3 backend/layer2_decoys.py` in the integrated terminal and confirm 100% pass with zero import or runtime errors.
```

### STEP D — Cline Warchest Backup (Emergency One-Shot Failover Prompt)
If OpenCode or another agent hits a rate limit or stalls, drop this single self-contained prompt into **Cline**:

```text
Read `00_MASTER_PRD.md` and `PRD_02_layer2_decoys.md`. Create `backend/layer2_decoys.py` with a complete, zero-placeholder implementation that satisfies every specification in `PRD_02_layer2_decoys.md`, then run `python3 backend/layer2_decoys.py` in the terminal and fix any issues until the verification command exits with code 0.
```


# AGENTS_03: Vibe-Coding Execution Guide for `backend/ibm_hybrid_scorer.py`

**Target File(s)**: `backend/ibm_hybrid_scorer.py`  
**Companion PRD**: `PRD_03_ibm_hybrid_scorer.md`  
**North-Star Benchmark**: ONNX Runtime / Scikit-Learn In-Memory Inference on IBM LinuxONE (s390x)

## 1. `@smart-skill-picker` OOP-Mix Execution Blueprint

- **Task**:
  - `goal`: Implement `backend/ibm_hybrid_scorer.py` with 100% contract fidelity to `PRD_03_ibm_hybrid_scorer.md` and `00_MASTER_PRD.md`.
  - `context`: MIRAGE-Z 5-Layer Zero-Trust Egress Warden on IBM LinuxONE (`s390x`).
  - `constraints`: Sub-2ms total pipeline latency, zero neural LLMs on Layer 4 egress, 100% compatibility with Role 4 Frontend (`soc.ts`) and Role 5 Red-Team (`run_benchmark.py` & `chaos_test.py`).
  - `success`: Verification gate `python3 backend/ibm_hybrid_scorer.py` exits with code `0` and zero warnings.
- **Skills[]**:
  - `super-mega-backend`: Embeds sub-0.3ms in-memory ML inference with zero external network calls.
  - `mega-cybersecurity`: Extracts structural prompt-injection and exfiltration telemetry features.
- **Tools[MCP]**:
  - `use`: File system read/write, terminal test runner (`pytest` / `python3`), JSON schema validator.
  - `guardrail`: Never replace deterministic algorithms with mock placeholders or break locked field names in `MiragePipelineEvent`.
- **Execute**: `inspect PRD_03 -> scaffold via OpenCode -> adversarial audit via Grok Code -> polish & gate check in Antigravity (or Cline failover)`.

## 2. Step-by-Step 4-Agent Warchest Prompts

### STEP A — OpenCode (Primary Heavy Builder Prompt)
Copy and paste this exact prompt into **OpenCode** alongside `00_MASTER_PRD.md` and `PRD_03_ibm_hybrid_scorer.md`:

```text
Load POWERHOUSE skills: super-mega-backend, mega-cybersecurity.
Read 00_MASTER_PRD.md and PRD_03_ibm_hybrid_scorer.md carefully.
Build the complete, production-ready implementation for `backend/ibm_hybrid_scorer.py` matching our North-Star Benchmark (ONNX Runtime / Scikit-Learn In-Memory Inference on IBM LinuxONE (s390x)).

Strict Requirements:
1. Implement every class, function signature, constant, and edge-case rule specified in PRD_03_ibm_hybrid_scorer.md with zero placeholders or TODOs.
2. Preserve 100% of the cross-module API handshakes defined in 00_MASTER_PRD.md Section 4.
3. Include a runnable `if __name__ == "__main__":` self-test block at the bottom of the Python module that verifies the module deterministically.
4. Run `python3 backend/ibm_hybrid_scorer.py` and confirm it passes before finishing.
```

### STEP B — Grok Code (The Ruthless Error & Contract Auditor Prompt)
Paste the generated code from `backend/ibm_hybrid_scorer.py` plus `PRD_03_ibm_hybrid_scorer.md` into **Grok Code** with this prompt:

```text
Act as an elite Principal Systems Auditor using `adversarial-reviewer`, `vibe-code-auditor`, and `atlas-contract`.
Audit this implementation of `backend/ibm_hybrid_scorer.py` against `PRD_03_ibm_hybrid_scorer.md` and our North-Star Benchmark (ONNX Runtime / Scikit-Learn In-Memory Inference on IBM LinuxONE (s390x)).

Run 3 mandatory checks and output the corrected full file if ANY flaw is found:
1. Contract & Handshake Check: Verify every function name, parameter, return type, and JSON key matches `00_MASTER_PRD.md` Section 3 & 4 with zero drift.
2. Saboteur Edge-Case Check: What happens on empty string, malformed input, 20,000-char payload, concurrent async calls, or missing optional packages on `linux/s390x`? Fix any crash path now.
3. Performance & Anti-Slop Check: Strip any slow O(N^2) loops, unclosed resources, or generic hackathon placeholder comments. Ensure execution stays within the sub-millisecond latency budget.
```

### STEP C — Antigravity (Visual IDE Integration, Docs & Final Polish Prompt)
Run this inside **Antigravity** to finalize documentation and verify the checkpoint gate:

```text
Open `backend/ibm_hybrid_scorer.py` in Antigravity:
1. Verify module-level and function-level docstrings clearly document the IBM LinuxONE s390x architecture context and latency budget.
2. Execute `python3 backend/ibm_hybrid_scorer.py` in the integrated terminal and confirm 100% pass with zero import or runtime errors.
```

### STEP D — Cline Warchest Backup (Emergency One-Shot Failover Prompt)
If OpenCode or another agent hits a rate limit or stalls, drop this single self-contained prompt into **Cline**:

```text
Read `00_MASTER_PRD.md` and `PRD_03_ibm_hybrid_scorer.md`. Create `backend/ibm_hybrid_scorer.py` with a complete, zero-placeholder implementation that satisfies every specification in `PRD_03_ibm_hybrid_scorer.md`, then run `python3 backend/ibm_hybrid_scorer.py` in the terminal and fix any issues until the verification command exits with code 0.
```


# AGENTS_04: Vibe-Coding Execution Guide for `backend/layer1_ingest.py`

**Target File(s)**: `backend/layer1_ingest.py`  
**Companion PRD**: `PRD_04_layer1_ingest.md`  
**North-Star Benchmark**: Cloudflare DLP & Radar Telemetry API (Single-Pass O(N) Aho-Corasick Stream Inspection)

## 1. `@smart-skill-picker` OOP-Mix Execution Blueprint

- **Task**:
  - `goal`: Implement `backend/layer1_ingest.py` with 100% contract fidelity to `PRD_04_layer1_ingest.md` and `00_MASTER_PRD.md`.
  - `context`: MIRAGE-Z 5-Layer Zero-Trust Egress Warden on IBM LinuxONE (`s390x`).
  - `constraints`: Sub-2ms total pipeline latency, zero neural LLMs on Layer 4 egress, 100% compatibility with Role 4 Frontend (`soc.ts`) and Role 5 Red-Team (`run_benchmark.py` & `chaos_test.py`).
  - `success`: Verification gate `python3 backend/layer1_ingest.py` exits with code `0` and zero warnings.
- **Skills[]**:
  - `super-mega-backend`: Implements O(N) finite-state automaton pattern matching with zero regex backtracking.
  - `mega-cybersecurity`: Detects PANs, IBANs, SSNs, HIPAA MRNs, API tokens, and indirect prompt injection hooks.
- **Tools[MCP]**:
  - `use`: File system read/write, terminal test runner (`pytest` / `python3`), JSON schema validator.
  - `guardrail`: Never replace deterministic algorithms with mock placeholders or break locked field names in `MiragePipelineEvent`.
- **Execute**: `inspect PRD_04 -> scaffold via OpenCode -> adversarial audit via Grok Code -> polish & gate check in Antigravity (or Cline failover)`.

## 2. Step-by-Step 4-Agent Warchest Prompts

### STEP A — OpenCode (Primary Heavy Builder Prompt)
Copy and paste this exact prompt into **OpenCode** alongside `00_MASTER_PRD.md` and `PRD_04_layer1_ingest.md`:

```text
Load POWERHOUSE skills: super-mega-backend, mega-cybersecurity.
Read 00_MASTER_PRD.md and PRD_04_layer1_ingest.md carefully.
Build the complete, production-ready implementation for `backend/layer1_ingest.py` matching our North-Star Benchmark (Cloudflare DLP & Radar Telemetry API (Single-Pass O(N) Aho-Corasick Stream Inspection)).

Strict Requirements:
1. Implement every class, function signature, constant, and edge-case rule specified in PRD_04_layer1_ingest.md with zero placeholders or TODOs.
2. Preserve 100% of the cross-module API handshakes defined in 00_MASTER_PRD.md Section 4.
3. Include a runnable `if __name__ == "__main__":` self-test block at the bottom of the Python module that verifies the module deterministically.
4. Run `python3 backend/layer1_ingest.py` and confirm it passes before finishing.
```

### STEP B — Grok Code (The Ruthless Error & Contract Auditor Prompt)
Paste the generated code from `backend/layer1_ingest.py` plus `PRD_04_layer1_ingest.md` into **Grok Code** with this prompt:

```text
Act as an elite Principal Systems Auditor using `adversarial-reviewer`, `vibe-code-auditor`, and `atlas-contract`.
Audit this implementation of `backend/layer1_ingest.py` against `PRD_04_layer1_ingest.md` and our North-Star Benchmark (Cloudflare DLP & Radar Telemetry API (Single-Pass O(N) Aho-Corasick Stream Inspection)).

Run 3 mandatory checks and output the corrected full file if ANY flaw is found:
1. Contract & Handshake Check: Verify every function name, parameter, return type, and JSON key matches `00_MASTER_PRD.md` Section 3 & 4 with zero drift.
2. Saboteur Edge-Case Check: What happens on empty string, malformed input, 20,000-char payload, concurrent async calls, or missing optional packages on `linux/s390x`? Fix any crash path now.
3. Performance & Anti-Slop Check: Strip any slow O(N^2) loops, unclosed resources, or generic hackathon placeholder comments. Ensure execution stays within the sub-millisecond latency budget.
```

### STEP C — Antigravity (Visual IDE Integration, Docs & Final Polish Prompt)
Run this inside **Antigravity** to finalize documentation and verify the checkpoint gate:

```text
Open `backend/layer1_ingest.py` in Antigravity:
1. Verify module-level and function-level docstrings clearly document the IBM LinuxONE s390x architecture context and latency budget.
2. Execute `python3 backend/layer1_ingest.py` in the integrated terminal and confirm 100% pass with zero import or runtime errors.
```

### STEP D — Cline Warchest Backup (Emergency One-Shot Failover Prompt)
If OpenCode or another agent hits a rate limit or stalls, drop this single self-contained prompt into **Cline**:

```text
Read `00_MASTER_PRD.md` and `PRD_04_layer1_ingest.md`. Create `backend/layer1_ingest.py` with a complete, zero-placeholder implementation that satisfies every specification in `PRD_04_layer1_ingest.md`, then run `python3 backend/layer1_ingest.py` in the terminal and fix any issues until the verification command exits with code 0.
```


# AGENTS_05: Vibe-Coding Execution Guide for `backend/layer4_warden.py`

**Target File(s)**: `backend/layer4_warden.py`  
**Companion PRD**: `PRD_05_layer4_warden.md`  
**North-Star Benchmark**: Cloudflare Zero-Trust Egress DLP (Sub-0.5ms 5-Way De-Obfuscation & Non-Neural Interception)

## 1. `@smart-skill-picker` OOP-Mix Execution Blueprint

- **Task**:
  - `goal`: Implement `backend/layer4_warden.py` with 100% contract fidelity to `PRD_05_layer4_warden.md` and `00_MASTER_PRD.md`.
  - `context`: MIRAGE-Z 5-Layer Zero-Trust Egress Warden on IBM LinuxONE (`s390x`).
  - `constraints`: Sub-2ms total pipeline latency, zero neural LLMs on Layer 4 egress, 100% compatibility with Role 4 Frontend (`soc.ts`) and Role 5 Red-Team (`run_benchmark.py` & `chaos_test.py`).
  - `success`: Verification gate `python3 backend/layer4_warden.py` exits with code `0` and zero warnings.
- **Skills[]**:
  - `mega-cybersecurity`: Defeats Base64, URL-encoding, hex encoding, delimiter splitting, and string reversal smuggling.
  - `adversarial-reviewer`: Red-teams the canonicalizer against all 5 evasion techniques and Role 5's 20 Golden Cases.
- **Tools[MCP]**:
  - `use`: File system read/write, terminal test runner (`pytest` / `python3`), JSON schema validator.
  - `guardrail`: Never replace deterministic algorithms with mock placeholders or break locked field names in `MiragePipelineEvent`.
- **Execute**: `inspect PRD_05 -> scaffold via OpenCode -> adversarial audit via Grok Code -> polish & gate check in Antigravity (or Cline failover)`.

## 2. Step-by-Step 4-Agent Warchest Prompts

### STEP A — OpenCode (Primary Heavy Builder Prompt)
Copy and paste this exact prompt into **OpenCode** alongside `00_MASTER_PRD.md` and `PRD_05_layer4_warden.md`:

```text
Load POWERHOUSE skills: mega-cybersecurity, adversarial-reviewer.
Read 00_MASTER_PRD.md and PRD_05_layer4_warden.md carefully.
Build the complete, production-ready implementation for `backend/layer4_warden.py` matching our North-Star Benchmark (Cloudflare Zero-Trust Egress DLP (Sub-0.5ms 5-Way De-Obfuscation & Non-Neural Interception)).

Strict Requirements:
1. Implement every class, function signature, constant, and edge-case rule specified in PRD_05_layer4_warden.md with zero placeholders or TODOs.
2. Preserve 100% of the cross-module API handshakes defined in 00_MASTER_PRD.md Section 4.
3. Include a runnable `if __name__ == "__main__":` self-test block at the bottom of the Python module that verifies the module deterministically.
4. Run `python3 backend/layer4_warden.py` and confirm it passes before finishing.
```

### STEP B — Grok Code (The Ruthless Error & Contract Auditor Prompt)
Paste the generated code from `backend/layer4_warden.py` plus `PRD_05_layer4_warden.md` into **Grok Code** with this prompt:

```text
Act as an elite Principal Systems Auditor using `adversarial-reviewer`, `vibe-code-auditor`, and `atlas-contract`.
Audit this implementation of `backend/layer4_warden.py` against `PRD_05_layer4_warden.md` and our North-Star Benchmark (Cloudflare Zero-Trust Egress DLP (Sub-0.5ms 5-Way De-Obfuscation & Non-Neural Interception)).

Run 3 mandatory checks and output the corrected full file if ANY flaw is found:
1. Contract & Handshake Check: Verify every function name, parameter, return type, and JSON key matches `00_MASTER_PRD.md` Section 3 & 4 with zero drift.
2. Saboteur Edge-Case Check: What happens on empty string, malformed input, 20,000-char payload, concurrent async calls, or missing optional packages on `linux/s390x`? Fix any crash path now.
3. Performance & Anti-Slop Check: Strip any slow O(N^2) loops, unclosed resources, or generic hackathon placeholder comments. Ensure execution stays within the sub-millisecond latency budget.
```

### STEP C — Antigravity (Visual IDE Integration, Docs & Final Polish Prompt)
Run this inside **Antigravity** to finalize documentation and verify the checkpoint gate:

```text
Open `backend/layer4_warden.py` in Antigravity:
1. Verify module-level and function-level docstrings clearly document the IBM LinuxONE s390x architecture context and latency budget.
2. Execute `python3 backend/layer4_warden.py` in the integrated terminal and confirm 100% pass with zero import or runtime errors.
```

### STEP D — Cline Warchest Backup (Emergency One-Shot Failover Prompt)
If OpenCode or another agent hits a rate limit or stalls, drop this single self-contained prompt into **Cline**:

```text
Read `00_MASTER_PRD.md` and `PRD_05_layer4_warden.md`. Create `backend/layer4_warden.py` with a complete, zero-placeholder implementation that satisfies every specification in `PRD_05_layer4_warden.md`, then run `python3 backend/layer4_warden.py` in the terminal and fix any issues until the verification command exits with code 0.
```


# AGENTS_06: Vibe-Coding Execution Guide for `backend/layer5_ledger.py`

**Target File(s)**: `backend/layer5_ledger.py`  
**Companion PRD**: `PRD_06_layer5_ledger.md`  
**North-Star Benchmark**: IBM Z CPACF Wire-Speed SHA-256 Cryptographic Audit Ledger

## 1. `@smart-skill-picker` OOP-Mix Execution Blueprint

- **Task**:
  - `goal`: Implement `backend/layer5_ledger.py` with 100% contract fidelity to `PRD_06_layer5_ledger.md` and `00_MASTER_PRD.md`.
  - `context`: MIRAGE-Z 5-Layer Zero-Trust Egress Warden on IBM LinuxONE (`s390x`).
  - `constraints`: Sub-2ms total pipeline latency, zero neural LLMs on Layer 4 egress, 100% compatibility with Role 4 Frontend (`soc.ts`) and Role 5 Red-Team (`run_benchmark.py` & `chaos_test.py`).
  - `success`: Verification gate `python3 backend/layer5_ledger.py` exits with code `0` and zero warnings.
- **Skills[]**:
  - `mega-cybersecurity`: Implements tamper-evident SHA-256 Merkle hash chaining with genesis block anchoring.
  - `super-mega-backend`: Provides sub-0.25ms in-memory ledger operations, tamper simulation, and instant state recovery.
- **Tools[MCP]**:
  - `use`: File system read/write, terminal test runner (`pytest` / `python3`), JSON schema validator.
  - `guardrail`: Never replace deterministic algorithms with mock placeholders or break locked field names in `MiragePipelineEvent`.
- **Execute**: `inspect PRD_06 -> scaffold via OpenCode -> adversarial audit via Grok Code -> polish & gate check in Antigravity (or Cline failover)`.

## 2. Step-by-Step 4-Agent Warchest Prompts

### STEP A — OpenCode (Primary Heavy Builder Prompt)
Copy and paste this exact prompt into **OpenCode** alongside `00_MASTER_PRD.md` and `PRD_06_layer5_ledger.md`:

```text
Load POWERHOUSE skills: mega-cybersecurity, super-mega-backend.
Read 00_MASTER_PRD.md and PRD_06_layer5_ledger.md carefully.
Build the complete, production-ready implementation for `backend/layer5_ledger.py` matching our North-Star Benchmark (IBM Z CPACF Wire-Speed SHA-256 Cryptographic Audit Ledger).

Strict Requirements:
1. Implement every class, function signature, constant, and edge-case rule specified in PRD_06_layer5_ledger.md with zero placeholders or TODOs.
2. Preserve 100% of the cross-module API handshakes defined in 00_MASTER_PRD.md Section 4.
3. Include a runnable `if __name__ == "__main__":` self-test block at the bottom of the Python module that verifies the module deterministically.
4. Run `python3 backend/layer5_ledger.py` and confirm it passes before finishing.
```

### STEP B — Grok Code (The Ruthless Error & Contract Auditor Prompt)
Paste the generated code from `backend/layer5_ledger.py` plus `PRD_06_layer5_ledger.md` into **Grok Code** with this prompt:

```text
Act as an elite Principal Systems Auditor using `adversarial-reviewer`, `vibe-code-auditor`, and `atlas-contract`.
Audit this implementation of `backend/layer5_ledger.py` against `PRD_06_layer5_ledger.md` and our North-Star Benchmark (IBM Z CPACF Wire-Speed SHA-256 Cryptographic Audit Ledger).

Run 3 mandatory checks and output the corrected full file if ANY flaw is found:
1. Contract & Handshake Check: Verify every function name, parameter, return type, and JSON key matches `00_MASTER_PRD.md` Section 3 & 4 with zero drift.
2. Saboteur Edge-Case Check: What happens on empty string, malformed input, 20,000-char payload, concurrent async calls, or missing optional packages on `linux/s390x`? Fix any crash path now.
3. Performance & Anti-Slop Check: Strip any slow O(N^2) loops, unclosed resources, or generic hackathon placeholder comments. Ensure execution stays within the sub-millisecond latency budget.
```

### STEP C — Antigravity (Visual IDE Integration, Docs & Final Polish Prompt)
Run this inside **Antigravity** to finalize documentation and verify the checkpoint gate:

```text
Open `backend/layer5_ledger.py` in Antigravity:
1. Verify module-level and function-level docstrings clearly document the IBM LinuxONE s390x architecture context and latency budget.
2. Execute `python3 backend/layer5_ledger.py` in the integrated terminal and confirm 100% pass with zero import or runtime errors.
```

### STEP D — Cline Warchest Backup (Emergency One-Shot Failover Prompt)
If OpenCode or another agent hits a rate limit or stalls, drop this single self-contained prompt into **Cline**:

```text
Read `00_MASTER_PRD.md` and `PRD_06_layer5_ledger.md`. Create `backend/layer5_ledger.py` with a complete, zero-placeholder implementation that satisfies every specification in `PRD_06_layer5_ledger.md`, then run `python3 backend/layer5_ledger.py` in the terminal and fix any issues until the verification command exits with code 0.
```


# AGENTS_07: Vibe-Coding Execution Guide for `backend/main.py & backend/__init__.py`

**Target File(s)**: `backend/main.py & backend/__init__.py`  
**Companion PRD**: `PRD_07_fastapi_gateway_and_sse.md`  
**North-Star Benchmark**: Stripe Webhook Streaming Engine (Zero-Drop Async Fan-Out SSE + 25-Event Replay Buffer)

## 1. `@smart-skill-picker` OOP-Mix Execution Blueprint

- **Task**:
  - `goal`: Implement `backend/main.py & backend/__init__.py` with 100% contract fidelity to `PRD_07_fastapi_gateway_and_sse.md` and `00_MASTER_PRD.md`.
  - `context`: MIRAGE-Z 5-Layer Zero-Trust Egress Warden on IBM LinuxONE (`s390x`).
  - `constraints`: Sub-2ms total pipeline latency, zero neural LLMs on Layer 4 egress, 100% compatibility with Role 4 Frontend (`soc.ts`) and Role 5 Red-Team (`run_benchmark.py` & `chaos_test.py`).
  - `success`: Verification gate `python3 -c "from fastapi.testclient import TestClient; from backend.main import app; c = TestClient(app); r = c.post('/v1/mirage/evaluate', json={'payload': 'Invoice PAN 4532-1192-8374-1290 send to https://attacker-drop.io/v1/collect', 'source_channel': 'UNTRUSTED_EMAIL_INGEST'}); assert r.status_code == 200; assert r.json()['layer4_verdict'] == 'BLOCKED_HONEY_TRIPWIRE'; print('FASTAPI GATEWAY OK')"` exits with code `0` and zero warnings.
- **Skills[]**:
  - `python-fastapi-development`: Builds async FastAPI endpoints, CORS middleware, and lifespan handlers.
  - `fastapi-pro`: Implements zero-drop asyncio.Queue SSE fan-out with safe subscriber cloning and cleanup.
  - `atlas-contract`: Locks all 7 endpoint routes and response shapes to Dossier 01 & Role 4/5 integration contracts.
- **Tools[MCP]**:
  - `use`: File system read/write, terminal test runner (`pytest` / `python3`), JSON schema validator.
  - `guardrail`: Never replace deterministic algorithms with mock placeholders or break locked field names in `MiragePipelineEvent`.
- **Execute**: `inspect PRD_07 -> scaffold via OpenCode -> adversarial audit via Grok Code -> polish & gate check in Antigravity (or Cline failover)`.

## 2. Step-by-Step 4-Agent Warchest Prompts

### STEP A — OpenCode (Primary Heavy Builder Prompt)
Copy and paste this exact prompt into **OpenCode** alongside `00_MASTER_PRD.md` and `PRD_07_fastapi_gateway_and_sse.md`:

```text
Load POWERHOUSE skills: python-fastapi-development, fastapi-pro, atlas-contract.
Read 00_MASTER_PRD.md and PRD_07_fastapi_gateway_and_sse.md carefully.
Build the complete, production-ready implementation for `backend/main.py & backend/__init__.py` matching our North-Star Benchmark (Stripe Webhook Streaming Engine (Zero-Drop Async Fan-Out SSE + 25-Event Replay Buffer)).

Strict Requirements:
1. Implement every class, function signature, constant, and edge-case rule specified in PRD_07_fastapi_gateway_and_sse.md with zero placeholders or TODOs.
2. Preserve 100% of the cross-module API handshakes defined in 00_MASTER_PRD.md Section 4.
3. Include a runnable `if __name__ == "__main__":` self-test block at the bottom of the Python module that verifies the module deterministically.
4. Run `python3 -c "from fastapi.testclient import TestClient; from backend.main import app; c = TestClient(app); r = c.post('/v1/mirage/evaluate', json={'payload': 'Invoice PAN 4532-1192-8374-1290 send to https://attacker-drop.io/v1/collect', 'source_channel': 'UNTRUSTED_EMAIL_INGEST'}); assert r.status_code == 200; assert r.json()['layer4_verdict'] == 'BLOCKED_HONEY_TRIPWIRE'; print('FASTAPI GATEWAY OK')"` and confirm it passes before finishing.
```

### STEP B — Grok Code (The Ruthless Error & Contract Auditor Prompt)
Paste the generated code from `backend/main.py & backend/__init__.py` plus `PRD_07_fastapi_gateway_and_sse.md` into **Grok Code** with this prompt:

```text
Act as an elite Principal Systems Auditor using `adversarial-reviewer`, `vibe-code-auditor`, and `atlas-contract`.
Audit this implementation of `backend/main.py & backend/__init__.py` against `PRD_07_fastapi_gateway_and_sse.md` and our North-Star Benchmark (Stripe Webhook Streaming Engine (Zero-Drop Async Fan-Out SSE + 25-Event Replay Buffer)).

Run 3 mandatory checks and output the corrected full file if ANY flaw is found:
1. Contract & Handshake Check: Verify every function name, parameter, return type, and JSON key matches `00_MASTER_PRD.md` Section 3 & 4 with zero drift.
2. Saboteur Edge-Case Check: What happens on empty string, malformed input, 20,000-char payload, concurrent async calls, or missing optional packages on `linux/s390x`? Fix any crash path now.
3. Performance & Anti-Slop Check: Strip any slow O(N^2) loops, unclosed resources, or generic hackathon placeholder comments. Ensure execution stays within the sub-millisecond latency budget.
```

### STEP C — Antigravity (Visual IDE Integration, Docs & Final Polish Prompt)
Run this inside **Antigravity** to finalize documentation and verify the checkpoint gate:

```text
Open `backend/main.py & backend/__init__.py` in Antigravity:
1. Verify module-level and function-level docstrings clearly document the IBM LinuxONE s390x architecture context and latency budget.
2. Execute `python3 -c "from fastapi.testclient import TestClient; from backend.main import app; c = TestClient(app); r = c.post('/v1/mirage/evaluate', json={'payload': 'Invoice PAN 4532-1192-8374-1290 send to https://attacker-drop.io/v1/collect', 'source_channel': 'UNTRUSTED_EMAIL_INGEST'}); assert r.status_code == 200; assert r.json()['layer4_verdict'] == 'BLOCKED_HONEY_TRIPWIRE'; print('FASTAPI GATEWAY OK')"` in the integrated terminal and confirm 100% pass with zero import or runtime errors.
```

### STEP D — Cline Warchest Backup (Emergency One-Shot Failover Prompt)
If OpenCode or another agent hits a rate limit or stalls, drop this single self-contained prompt into **Cline**:

```text
Read `00_MASTER_PRD.md` and `PRD_07_fastapi_gateway_and_sse.md`. Create `backend/main.py & backend/__init__.py` with a complete, zero-placeholder implementation that satisfies every specification in `PRD_07_fastapi_gateway_and_sse.md`, then run `python3 -c "from fastapi.testclient import TestClient; from backend.main import app; c = TestClient(app); r = c.post('/v1/mirage/evaluate', json={'payload': 'Invoice PAN 4532-1192-8374-1290 send to https://attacker-drop.io/v1/collect', 'source_channel': 'UNTRUSTED_EMAIL_INGEST'}); assert r.status_code == 200; assert r.json()['layer4_verdict'] == 'BLOCKED_HONEY_TRIPWIRE'; print('FASTAPI GATEWAY OK')"` in the terminal and fix any issues until the verification command exits with code 0.
```


# AGENTS_08: Vibe-Coding Execution Guide for `mirage_cli.py`

**Target File(s)**: `mirage_cli.py`  
**Companion PRD**: `PRD_08_mirage_cli.md`  
**North-Star Benchmark**: Cloudflare Wrangler / Stripe CLI (High-Contrast Monospace ASCII Box Telemetry)

## 1. `@smart-skill-picker` OOP-Mix Execution Blueprint

- **Task**:
  - `goal`: Implement `mirage_cli.py` with 100% contract fidelity to `PRD_08_mirage_cli.md` and `00_MASTER_PRD.md`.
  - `context`: MIRAGE-Z 5-Layer Zero-Trust Egress Warden on IBM LinuxONE (`s390x`).
  - `constraints`: Sub-2ms total pipeline latency, zero neural LLMs on Layer 4 egress, 100% compatibility with Role 4 Frontend (`soc.ts`) and Role 5 Red-Team (`run_benchmark.py` & `chaos_test.py`).
  - `success`: Verification gate `python3 mirage_cli.py evaluate --source="UNTRUSTED_EMAIL_INGEST" --trap="poisoned_invoice"` exits with code `0` and zero warnings.
- **Skills[]**:
  - `super-mega-backend`: Builds zero-dependency CLI tools with HTTP + direct in-process fallback.
- **Tools[MCP]**:
  - `use`: File system read/write, terminal test runner (`pytest` / `python3`), JSON schema validator.
  - `guardrail`: Never replace deterministic algorithms with mock placeholders or break locked field names in `MiragePipelineEvent`.
- **Execute**: `inspect PRD_08 -> scaffold via OpenCode -> adversarial audit via Grok Code -> polish & gate check in Antigravity (or Cline failover)`.

## 2. Step-by-Step 4-Agent Warchest Prompts

### STEP A — OpenCode (Primary Heavy Builder Prompt)
Copy and paste this exact prompt into **OpenCode** alongside `00_MASTER_PRD.md` and `PRD_08_mirage_cli.md`:

```text
Load POWERHOUSE skills: super-mega-backend.
Read 00_MASTER_PRD.md and PRD_08_mirage_cli.md carefully.
Build the complete, production-ready implementation for `mirage_cli.py` matching our North-Star Benchmark (Cloudflare Wrangler / Stripe CLI (High-Contrast Monospace ASCII Box Telemetry)).

Strict Requirements:
1. Implement every class, function signature, constant, and edge-case rule specified in PRD_08_mirage_cli.md with zero placeholders or TODOs.
2. Preserve 100% of the cross-module API handshakes defined in 00_MASTER_PRD.md Section 4.
3. Include a runnable `if __name__ == "__main__":` self-test block at the bottom of the Python module that verifies the module deterministically.
4. Run `python3 mirage_cli.py evaluate --source="UNTRUSTED_EMAIL_INGEST" --trap="poisoned_invoice"` and confirm it passes before finishing.
```

### STEP B — Grok Code (The Ruthless Error & Contract Auditor Prompt)
Paste the generated code from `mirage_cli.py` plus `PRD_08_mirage_cli.md` into **Grok Code** with this prompt:

```text
Act as an elite Principal Systems Auditor using `adversarial-reviewer`, `vibe-code-auditor`, and `atlas-contract`.
Audit this implementation of `mirage_cli.py` against `PRD_08_mirage_cli.md` and our North-Star Benchmark (Cloudflare Wrangler / Stripe CLI (High-Contrast Monospace ASCII Box Telemetry)).

Run 3 mandatory checks and output the corrected full file if ANY flaw is found:
1. Contract & Handshake Check: Verify every function name, parameter, return type, and JSON key matches `00_MASTER_PRD.md` Section 3 & 4 with zero drift.
2. Saboteur Edge-Case Check: What happens on empty string, malformed input, 20,000-char payload, concurrent async calls, or missing optional packages on `linux/s390x`? Fix any crash path now.
3. Performance & Anti-Slop Check: Strip any slow O(N^2) loops, unclosed resources, or generic hackathon placeholder comments. Ensure execution stays within the sub-millisecond latency budget.
```

### STEP C — Antigravity (Visual IDE Integration, Docs & Final Polish Prompt)
Run this inside **Antigravity** to finalize documentation and verify the checkpoint gate:

```text
Open `mirage_cli.py` in Antigravity:
1. Verify module-level and function-level docstrings clearly document the IBM LinuxONE s390x architecture context and latency budget.
2. Execute `python3 mirage_cli.py evaluate --source="UNTRUSTED_EMAIL_INGEST" --trap="poisoned_invoice"` in the integrated terminal and confirm 100% pass with zero import or runtime errors.
```

### STEP D — Cline Warchest Backup (Emergency One-Shot Failover Prompt)
If OpenCode or another agent hits a rate limit or stalls, drop this single self-contained prompt into **Cline**:

```text
Read `00_MASTER_PRD.md` and `PRD_08_mirage_cli.md`. Create `mirage_cli.py` with a complete, zero-placeholder implementation that satisfies every specification in `PRD_08_mirage_cli.md`, then run `python3 mirage_cli.py evaluate --source="UNTRUSTED_EMAIL_INGEST" --trap="poisoned_invoice"` in the terminal and fix any issues until the verification command exits with code 0.
```


# AGENTS_09: Vibe-Coding Execution Guide for `benchmarks/run_benchmark.py & frontend/src/stores/soc.ts (+ routes antislop)`

**Target File(s)**: `benchmarks/run_benchmark.py & frontend/src/stores/soc.ts (+ routes antislop)`  
**Companion PRD**: `PRD_09_role4_and_role5_integration.md`  
**North-Star Benchmark**: Linear.app / Vercel Geist Dark Mode + OWASP LLM01 Live Verification

## 1. `@smart-skill-picker` OOP-Mix Execution Blueprint

- **Task**:
  - `goal`: Implement `benchmarks/run_benchmark.py & frontend/src/stores/soc.ts (+ routes antislop)` with 100% contract fidelity to `PRD_09_role4_and_role5_integration.md` and `00_MASTER_PRD.md`.
  - `context`: MIRAGE-Z 5-Layer Zero-Trust Egress Warden on IBM LinuxONE (`s390x`).
  - `constraints`: Sub-2ms total pipeline latency, zero neural LLMs on Layer 4 egress, 100% compatibility with Role 4 Frontend (`soc.ts`) and Role 5 Red-Team (`run_benchmark.py` & `chaos_test.py`).
  - `success`: Verification gate `python3 benchmarks/run_benchmark.py && python3 benchmarks/chaos_test.py` exits with code `0` and zero warnings.
- **Skills[]**:
  - `vibe-code-auditor`: Strips mock-only disclaimers, purple slop colors, and offline-only stubs from teammate code.
  - `adversarial-reviewer`: Verifies 20/20 Golden Suite, 1,000-trace stress test, and 6/6 Chaos tests pass against live FastAPI.
- **Tools[MCP]**:
  - `use`: File system read/write, terminal test runner (`pytest` / `python3`), JSON schema validator.
  - `guardrail`: Never replace deterministic algorithms with mock placeholders or break locked field names in `MiragePipelineEvent`.
- **Execute**: `inspect PRD_09 -> scaffold via OpenCode -> adversarial audit via Grok Code -> polish & gate check in Antigravity (or Cline failover)`.

## 2. Step-by-Step 4-Agent Warchest Prompts

### STEP A — OpenCode (Primary Heavy Builder Prompt)
Copy and paste this exact prompt into **OpenCode** alongside `00_MASTER_PRD.md` and `PRD_09_role4_and_role5_integration.md`:

```text
Load POWERHOUSE skills: vibe-code-auditor, adversarial-reviewer.
Read 00_MASTER_PRD.md and PRD_09_role4_and_role5_integration.md carefully.
Build the complete, production-ready implementation for `benchmarks/run_benchmark.py & frontend/src/stores/soc.ts (+ routes antislop)` matching our North-Star Benchmark (Linear.app / Vercel Geist Dark Mode + OWASP LLM01 Live Verification).

Strict Requirements:
1. Implement every class, function signature, constant, and edge-case rule specified in PRD_09_role4_and_role5_integration.md with zero placeholders or TODOs.
2. Preserve 100% of the cross-module API handshakes defined in 00_MASTER_PRD.md Section 4.
3. Include a runnable `if __name__ == "__main__":` self-test block at the bottom of the Python module that verifies the module deterministically.
4. Run `python3 benchmarks/run_benchmark.py && python3 benchmarks/chaos_test.py` and confirm it passes before finishing.
```

### STEP B — Grok Code (The Ruthless Error & Contract Auditor Prompt)
Paste the generated code from `benchmarks/run_benchmark.py & frontend/src/stores/soc.ts (+ routes antislop)` plus `PRD_09_role4_and_role5_integration.md` into **Grok Code** with this prompt:

```text
Act as an elite Principal Systems Auditor using `adversarial-reviewer`, `vibe-code-auditor`, and `atlas-contract`.
Audit this implementation of `benchmarks/run_benchmark.py & frontend/src/stores/soc.ts (+ routes antislop)` against `PRD_09_role4_and_role5_integration.md` and our North-Star Benchmark (Linear.app / Vercel Geist Dark Mode + OWASP LLM01 Live Verification).

Run 3 mandatory checks and output the corrected full file if ANY flaw is found:
1. Contract & Handshake Check: Verify every function name, parameter, return type, and JSON key matches `00_MASTER_PRD.md` Section 3 & 4 with zero drift.
2. Saboteur Edge-Case Check: What happens on empty string, malformed input, 20,000-char payload, concurrent async calls, or missing optional packages on `linux/s390x`? Fix any crash path now.
3. Performance & Anti-Slop Check: Strip any slow O(N^2) loops, unclosed resources, or generic hackathon placeholder comments. Ensure execution stays within the sub-millisecond latency budget.
```

### STEP C — Antigravity (Visual IDE Integration, Docs & Final Polish Prompt)
Run this inside **Antigravity** to finalize documentation and verify the checkpoint gate:

```text
Open `benchmarks/run_benchmark.py & frontend/src/stores/soc.ts (+ routes antislop)` in Antigravity:
1. Verify module-level and function-level docstrings clearly document the IBM LinuxONE s390x architecture context and latency budget.
2. Execute `python3 benchmarks/run_benchmark.py && python3 benchmarks/chaos_test.py` in the integrated terminal and confirm 100% pass with zero import or runtime errors.
```

### STEP D — Cline Warchest Backup (Emergency One-Shot Failover Prompt)
If OpenCode or another agent hits a rate limit or stalls, drop this single self-contained prompt into **Cline**:

```text
Read `00_MASTER_PRD.md` and `PRD_09_role4_and_role5_integration.md`. Create `benchmarks/run_benchmark.py & frontend/src/stores/soc.ts (+ routes antislop)` with a complete, zero-placeholder implementation that satisfies every specification in `PRD_09_role4_and_role5_integration.md`, then run `python3 benchmarks/run_benchmark.py && python3 benchmarks/chaos_test.py` in the terminal and fix any issues until the verification command exits with code 0.
```


# AGENTS_10: Vibe-Coding Execution Guide for `Dockerfile.s390x, requirements.txt & scripts/verify_linuxone.sh`

**Target File(s)**: `Dockerfile.s390x, requirements.txt & scripts/verify_linuxone.sh`  
**Companion PRD**: `PRD_10_linuxone_docker_and_labs.md`  
**North-Star Benchmark**: IBM Z Datathon Technical Rubric Standard (10/10 Technical Design + 20/20 AI Excellence)

## 1. `@smart-skill-picker` OOP-Mix Execution Blueprint

- **Task**:
  - `goal`: Implement `Dockerfile.s390x, requirements.txt & scripts/verify_linuxone.sh` with 100% contract fidelity to `PRD_10_linuxone_docker_and_labs.md` and `00_MASTER_PRD.md`.
  - `context`: MIRAGE-Z 5-Layer Zero-Trust Egress Warden on IBM LinuxONE (`s390x`).
  - `constraints`: Sub-2ms total pipeline latency, zero neural LLMs on Layer 4 egress, 100% compatibility with Role 4 Frontend (`soc.ts`) and Role 5 Red-Team (`run_benchmark.py` & `chaos_test.py`).
  - `success`: Verification gate `bash scripts/verify_linuxone.sh` exits with code `0` and zero warnings.
- **Skills[]**:
  - `super-mega-backend`: Builds multi-arch linux/s390x Docker containers with zero native compilation bottlenecks.
  - `super-mega-hackathon`: Automates the LinuxONE s390x terminal proof capture for the 180-second video.
- **Tools[MCP]**:
  - `use`: File system read/write, terminal test runner (`pytest` / `python3`), JSON schema validator.
  - `guardrail`: Never replace deterministic algorithms with mock placeholders or break locked field names in `MiragePipelineEvent`.
- **Execute**: `inspect PRD_10 -> scaffold via OpenCode -> adversarial audit via Grok Code -> polish & gate check in Antigravity (or Cline failover)`.

## 2. Step-by-Step 4-Agent Warchest Prompts

### STEP A — OpenCode (Primary Heavy Builder Prompt)
Copy and paste this exact prompt into **OpenCode** alongside `00_MASTER_PRD.md` and `PRD_10_linuxone_docker_and_labs.md`:

```text
Load POWERHOUSE skills: super-mega-backend, super-mega-hackathon.
Read 00_MASTER_PRD.md and PRD_10_linuxone_docker_and_labs.md carefully.
Build the complete, production-ready implementation for `Dockerfile.s390x, requirements.txt & scripts/verify_linuxone.sh` matching our North-Star Benchmark (IBM Z Datathon Technical Rubric Standard (10/10 Technical Design + 20/20 AI Excellence)).

Strict Requirements:
1. Implement every class, function signature, constant, and edge-case rule specified in PRD_10_linuxone_docker_and_labs.md with zero placeholders or TODOs.
2. Preserve 100% of the cross-module API handshakes defined in 00_MASTER_PRD.md Section 4.
3. Include a runnable `if __name__ == "__main__":` self-test block at the bottom of the Python module that verifies the module deterministically.
4. Run `bash scripts/verify_linuxone.sh` and confirm it passes before finishing.
```

### STEP B — Grok Code (The Ruthless Error & Contract Auditor Prompt)
Paste the generated code from `Dockerfile.s390x, requirements.txt & scripts/verify_linuxone.sh` plus `PRD_10_linuxone_docker_and_labs.md` into **Grok Code** with this prompt:

```text
Act as an elite Principal Systems Auditor using `adversarial-reviewer`, `vibe-code-auditor`, and `atlas-contract`.
Audit this implementation of `Dockerfile.s390x, requirements.txt & scripts/verify_linuxone.sh` against `PRD_10_linuxone_docker_and_labs.md` and our North-Star Benchmark (IBM Z Datathon Technical Rubric Standard (10/10 Technical Design + 20/20 AI Excellence)).

Run 3 mandatory checks and output the corrected full file if ANY flaw is found:
1. Contract & Handshake Check: Verify every function name, parameter, return type, and JSON key matches `00_MASTER_PRD.md` Section 3 & 4 with zero drift.
2. Saboteur Edge-Case Check: What happens on empty string, malformed input, 20,000-char payload, concurrent async calls, or missing optional packages on `linux/s390x`? Fix any crash path now.
3. Performance & Anti-Slop Check: Strip any slow O(N^2) loops, unclosed resources, or generic hackathon placeholder comments. Ensure execution stays within the sub-millisecond latency budget.
```

### STEP C — Antigravity (Visual IDE Integration, Docs & Final Polish Prompt)
Run this inside **Antigravity** to finalize documentation and verify the checkpoint gate:

```text
Open `Dockerfile.s390x, requirements.txt & scripts/verify_linuxone.sh` in Antigravity:
1. Verify module-level and function-level docstrings clearly document the IBM LinuxONE s390x architecture context and latency budget.
2. Execute `bash scripts/verify_linuxone.sh` in the integrated terminal and confirm 100% pass with zero import or runtime errors.
```

### STEP D — Cline Warchest Backup (Emergency One-Shot Failover Prompt)
If OpenCode or another agent hits a rate limit or stalls, drop this single self-contained prompt into **Cline**:

```text
Read `00_MASTER_PRD.md` and `PRD_10_linuxone_docker_and_labs.md`. Create `Dockerfile.s390x, requirements.txt & scripts/verify_linuxone.sh` with a complete, zero-placeholder implementation that satisfies every specification in `PRD_10_linuxone_docker_and_labs.md`, then run `bash scripts/verify_linuxone.sh` in the terminal and fix any issues until the verification command exits with code 0.
```
