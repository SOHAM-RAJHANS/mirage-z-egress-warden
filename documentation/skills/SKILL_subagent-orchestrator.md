---
name: subagent-orchestrator
description: Coordinate quota-aware parallel subagents for multi-file development with strict file-ownership boundaries.
---
# Subagent Orchestrator (Anti-Clash Multi-Agent Protocol)

## Non-Negotiable Anti-Clash Rules
1. **Single Source of Truth Contract First**: Lock `backend/schemas.py` and `contract.json` (Wave 0) before launching parallel agents.
2. **Disjoint Write Scopes**: Every parallel agent receives an explicit `WRITE_ALLOWLIST` of 1–2 files and a `DO_NOT_TOUCH` list covering the rest of the repository.
3. **Scoped Context Packets**: Never feed the entire codebase to a subagent. Feed ONLY `documentation/00_MASTER_PRD.md` + the agent's assigned `documentation/PRD_XX_*.md` and `documentation/AGENTS_XX_*.md`.
4. **Deterministic Self-Test Gates**: Every agent must run its file's standalone `python3 backend/<file>.py` self-test before marking its task done.
