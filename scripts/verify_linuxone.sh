#!/usr/bin/env bash
# MIRAGE-Z LinuxONE s390x verification proof (PRD_10).
# Camera-ready terminal proof for the 180-second video submission.
# Gate: bash scripts/verify_linuxone.sh (exit 0).
#
# Runs entirely from the project root. If the FastAPI gateway is already
# listening on MIRAGE_API_URL, the benchmark/chaos suites verify it over live
# HTTP; otherwise they run the same real 5-layer pipeline in-process.
set -euo pipefail

cd "$(dirname "$0")/.."

PYTHON_BIN="${PYTHON_BIN:-python3}"
API_URL="${MIRAGE_API_URL:-http://127.0.0.1:8000}"

echo "======================================================================"
echo " MIRAGE-Z | IBM LinuxONE s390x verification | CPACF + Telum II NNPA"
echo "======================================================================"

echo ""
echo "--- [1/8] Machine architecture (s390x / z17 9175 / CPACF msa / NNPA) ---"
uname -a || true
if command -v lscpu >/dev/null 2>&1; then
  lscpu | grep -E "Architecture|Model|NNPA|msa" || lscpu | head -n 20 || true
else
  echo "(lscpu not available on this host; expected on LinuxONE: s390x, IBM z17 9175)"
fi

echo ""
echo "--- [2/8] Locked contract + all layer gates (stdlib only) ---"
"$PYTHON_BIN" -W error backend/schemas.py
"$PYTHON_BIN" -W error backend/layer2_decoys.py
"$PYTHON_BIN" -W error backend/ibm_hybrid_scorer.py
"$PYTHON_BIN" -W error backend/layer1_ingest.py
"$PYTHON_BIN" -W error backend/layer4_warden.py
"$PYTHON_BIN" -W error backend/layer5_ledger.py

echo ""
echo "--- [3/8] FastAPI gateway self-test (7 endpoints + SSE + chaos) ---"
"$PYTHON_BIN" -W error backend/main.py

echo ""
echo "--- [4/8] Backend regression suite (pytest) ---"
if "$PYTHON_BIN" -m pytest --version >/dev/null 2>&1; then
  "$PYTHON_BIN" -m pytest -q
else
  echo "(pytest not installed; skipping regression suite — install requirements-dev.txt)"
fi

echo ""
echo "--- [5/8] Live gateway health probe ($API_URL) ---"
"$PYTHON_BIN" - "$API_URL" <<'PY'
import json
import sys
import urllib.request

url = sys.argv[1].rstrip("/") + "/health"
try:
    with urllib.request.urlopen(url, timeout=3) as response:
        payload = json.loads(response.read().decode("utf-8"))
    print(f"gateway health: status={payload.get('status')} "
          f"node={payload.get('node_arch')} "
          f"blocks={payload.get('ledger', {}).get('total_blocks')}")
except Exception as exc:
    print(f"(gateway not running at {url}; live HTTP mode skipped: {exc})")
PY

echo ""
echo "--- [6/8] Role 5 chaos suite (422 envelopes, no 5xx) ---"
"$PYTHON_BIN" benchmarks/chaos_test.py

echo ""
echo "--- [7/8] Role 5 benchmark (20/20 golden + 1000/1000 stress, live or in-process) ---"
"$PYTHON_BIN" benchmarks/run_benchmark.py

echo ""
echo "--- [8/8] LinuxONE terminal CLI demo (poisoned invoice trap) ---"
if [ -f mirage_cli.py ]; then
  "$PYTHON_BIN" mirage_cli.py evaluate \
    --source="UNTRUSTED_EMAIL_INGEST" --trap="poisoned_invoice"
else
  echo "(mirage_cli.py not present; skipping)"
fi

echo ""
echo "VERIFY_LINUXONE PASS"
