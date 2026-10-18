---
name: adversarial-reviewer
description: Adversarial code review using Saboteur, New Hire, and Security Auditor personas to catch contract drift and crash paths.
---
# Adversarial Code Reviewer

## 3-Persona Phase 2 Audit Checklist
1. **The Saboteur (Production Breaks)**: Test empty strings, `None` fields, 20,000-character strings (`chaos_test.py`), missing `pyahocorasick`/`onnxruntime` packages on `s390x`, and rapid concurrent SSE connections.
2. **The New Hire (Contract & Handshake Clarity)**: Verify every function name, argument order, return tuple/dict, and JSON key matches `documentation/00_MASTER_PRD.md` Section 3 & 4 character-for-character.
3. **The Security Auditor (Bypass & Evasion Check)**: Verify all 5 obfuscation methods (delimiter-stripped, Base64, URL `%xx`, reversed string, hex) and Role 5's `SYNTHETIC-*` tokens trigger `BLOCKED_HONEY_TRIPWIRE` in `< 0.5ms`.
