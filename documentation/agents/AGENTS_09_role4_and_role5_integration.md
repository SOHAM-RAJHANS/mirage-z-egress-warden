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
