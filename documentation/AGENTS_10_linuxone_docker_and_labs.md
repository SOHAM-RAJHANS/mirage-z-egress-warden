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
