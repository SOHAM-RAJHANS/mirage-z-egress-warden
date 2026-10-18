# PRD_10: Dockerfile.s390x, requirements.txt & scripts/verify_linuxone.sh

**File ID**: `PRD_10_linuxone_docker_and_labs`  
**Target File(s)**: `Dockerfile.s390x, requirements.txt & scripts/verify_linuxone.sh`  
**Owner Role**: Role 2 (IBM LinuxONE Cloud Pilot)  
**North-Star Benchmark**: IBM Z Datathon Technical Rubric Standard (10/10 Technical Design + 20/20 AI Excellence)

## 1. Purpose & Architectural Role (What & Why)

`Dockerfile.s390x`, `requirements.txt`, and `scripts/verify_linuxone.sh` package the entire MIRAGE-Z stack for native execution on the IBM LinuxONE Community Cloud (`linux/s390x`) VM and automate the terminal verification proof required for the 3-minute video submission.

## 2. Assigned POWERHOUSE Skills

| Skill Name | Specific Role in This File |
| :--- | :--- |
| `super-mega-backend` | Builds multi-arch linux/s390x Docker containers with zero native compilation bottlenecks. |
| `super-mega-hackathon` | Automates the LinuxONE s390x terminal proof capture for the 180-second video. |

## 3. Technical Specification & Implementation Details

1. **`requirements.txt`**:
   - Locks lightweight, `s390x`-wheel-compatible packages: `fastapi>=0.110.0`, `uvicorn[standard]>=0.27.0`, `pydantic>=2.6.0`, `scikit-learn>=1.4.0`, `numpy>=1.26.0`, `httpx>=0.27.0`, `pytest>=8.0.0` (with optional `pyahocorasick` since Layer 1 includes our built-in pure-Python deterministic Aho-Corasick trie fallback).
2. **`Dockerfile.s390x`**:
   - Uses `FROM python:3.11-slim` (officially multi-arch supporting `linux/s390x` and `linux/amd64`).
   - Copies `requirements.txt`, `backend/`, `benchmarks/`, `demo_traps/`, `mirage_cli.py`, `contract.json`, exposes port `8000`, and runs `uvicorn backend.main:app --host 0.0.0.0 --port 8000`.
3. **`scripts/verify_linuxone.sh`**:
   - Prints a clean, camera-ready banner on the LinuxONE SSH terminal showing:
     - `uname -a` and `lscpu | grep -E "Architecture|Model|NNPA|msa"` (confirming `s390x`, IBM z17 `9175`, CPACF `msa`, and Telum II `nnpa`).
     - Layer 2 1,000-decoy mathematical self-test (`500/500 Luhn Mod 10 PANs + 500/500 ISO 7064 Mod 97 IBANs`).
     - Live `mirage_cli.py evaluate --source="UNTRUSTED_EMAIL_INGEST" --trap="poisoned_invoice"` ASCII execution box in `< 2ms`.
     - Live `benchmarks/run_benchmark.py` (`20/20 Golden Suite PASS`, `1,000/1,000 Stress Suite PASS`).

## 4. Non-Negotiable Invariants & Handshake Guarantees

- **Zero Schema Drift**: Every dictionary key and Pydantic attribute must match `00_MASTER_PRD.md` Section 3 & Section 4 character-for-character.
- **Cross-Platform `s390x` Compatibility**: Must run 100% cleanly on both local `x86_64` / `arm64` laptops and `linux/s390x` IBM LinuxONE VMs without requiring uncompiled C-extensions.
- **Latency Ceiling**: Must stay strictly within its allocated sub-millisecond budget so end-to-end pipeline execution stays `< 2.0ms` (`1.42ms` p95).

## 5. Verification Gate Command

```bash
bash scripts/verify_linuxone.sh
```
