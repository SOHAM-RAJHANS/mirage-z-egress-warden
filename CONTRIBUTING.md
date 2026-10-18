# Contributing to MIRAGE-Z

Thanks for improving MIRAGE-Z. This repository contains a deterministic security product:
correctness and evidence matter more than speed of change.

## Repository layout

| Path | Purpose |
| :--- | :--- |
| `documentation/` | Read-only product requirements, agent handbooks and skill specs. **Never edit.** |
| `backend/` | Locked Pydantic contract, five pipeline layers, FastAPI gateway and regression tests. |
| `frontend/` | React/TanStack SOC console (HTTP/SSE consumer of the gateway). |
| `benchmarks/` | Golden/stress fixtures and the live chaos/benchmark harnesses. |
| `scripts/` | LinuxONE verification proof and helper scripts. |
| `docs/` | Reference PDFs and LinuxONE proof notes (no vendored repositories). |

## Development setup

```bash
# Backend (Python 3.11+)
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Frontend (Node 22+ / pnpm)
cd frontend
pnpm install
cd ..
```

## Quality gates (all must pass before a change is accepted)

```bash
python -m pytest -q                              # backend regression suite
for gate in backend/schemas.py backend/layer2_decoys.py backend/ibm_hybrid_scorer.py \
            backend/layer1_ingest.py backend/layer4_warden.py backend/layer5_ledger.py; do
  python -W error "$gate"
done
python -W error backend/main.py                  # gateway self-test (endpoints, SSE, chaos)

cd frontend
pnpm typecheck && pnpm lint && pnpm build
```

Live verification (with the gateway on port 8000):

```bash
python benchmarks/chaos_test.py
python benchmarks/run_benchmark.py
bash scripts/verify_linuxone.sh
```

## Contract rules

1. **No schema drift.** Every key/attribute in `backend/schemas.py` matches
   `documentation/00_MASTER_PRD.md` Sections 3–4. If a contract change is genuinely required, update
   the PRDs first and regenerate `contract.json`.
2. **No mock enforcement.** The console must not fabricate verdicts, decoys, ledger blocks or
   benchmark numbers. Offline state is shown explicitly; actions call the live gateway.
3. **Zero raw PII.** Raw sensitive spans never leave the backend vault; the UI renders masked
   previews only.
4. **Deterministic egress.** No model may be introduced on Layer 4's decision path.
5. **Tests stay honest.** Never weaken an assertion to make a run pass.

## Pull request checklist

- [ ] Focused diff with a clear description of the behavioural change.
- [ ] Quality gates above pass locally.
- [ ] `python benchmarks/run_benchmark.py` reports `LIVE VERIFIED: True`.
- [ ] Frontend browser QA: every route renders with zero console errors on desktop and mobile.
- [ ] No generated artefacts, secrets, virtualenvs or `node_modules` committed.

## Style

- Python: standard library typing, two-space readability conventions live in the modules; run the
  module self-tests before opening a PR.
- TypeScript: strict mode, no `any` in new public types, accessible interactive elements
  (`aria-*`, keyboard support), Tailwind tokens from `frontend/src/styles.css` only.
