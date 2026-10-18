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
