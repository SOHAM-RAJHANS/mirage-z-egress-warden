# Mirage-Z

**One workspace for the Mirage-Z interface demo and its red-team evaluation assets.**

Mirage-Z brings together an interactive security-operations frontend and a separate collection of offline audit and benchmark materials. The interface is a demonstration; the audit assets exercise local, synthetic data. Neither should be treated as proof of production security or measured live-system performance.

## What's inside

| Path | Purpose | Upstream |
| --- | --- | --- |
| [`frontend/`](frontend) | Interactive Mirage-Z security-operations demo | [river-fjord-able-gold](https://github.com/ishikaaasthana23/river-fjord-able-gold) |
| [`red-team-audit/`](red-team-audit) | Offline audit scripts, synthetic test data, and benchmark reports | [Mirage-Z-Role5](https://github.com/vradhiagar/Mirage-Z-Role5) |

Both directories are Git submodules, pinned to specific upstream commits. Their contents remain maintained by their respective upstream projects and are subject to those projects' terms.

## Get the complete workspace

Clone this repository and initialize both submodules:

```bash
git clone --recurse-submodules https://github.com/SOHAM-RAJHANS/mirage-z.git
cd mirage-z
```

If you already cloned without submodules:

```bash
git submodule update --init --recursive
```

## Run the frontend demo

The frontend uses React, TypeScript, and Vite. Install its dependencies and start the development server:

```bash
cd frontend
npm ci
npm run dev
```

See [`frontend/README.md`](frontend/README.md) for demo behavior and its mock-versus-real boundaries.

## Run offline audit checks

With Python 3 installed, run the audit benchmark from the repository root:

```bash
python red-team-audit/benchmarks/run_benchmark.py
```

The test cases and telemetry are synthetic. These checks do not test a connected backend, establish that attacks are blocked, or verify a live application audit ledger. See the [benchmark report](red-team-audit/benchmarks/BENCHMARK_AND_AUDIT_REPORT.md) for scope and limitations.
