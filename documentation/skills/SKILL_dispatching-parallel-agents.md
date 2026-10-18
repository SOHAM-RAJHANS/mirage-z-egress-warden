---
name: dispatching-parallel-agents
description: Dispatch independent agents concurrently across non-overlapping files and subsystems without shared-state conflicts.
---
# Dispatching Parallel Agents

## Parallel Wave Pattern
- **Identify Independent File Domains**: Group files that do not mutate each other's files on disk.
- **Pre-Decide Function Signatures**: All cross-file function calls are pre-locked in `documentation/00_MASTER_PRD.md` Section 4 so Agent A (`layer1_ingest.py`) can call `layer2_decoys.mint_honey_decoys()` while Agent B is still writing `layer2_decoys.py`.
- **Verify After Each Wave**: Run each file's verification gate command before advancing to the next wave.
