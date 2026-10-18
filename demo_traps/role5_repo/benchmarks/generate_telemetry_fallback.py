
import json
import hashlib
from pathlib import Path
from datetime import datetime, timezone

PROJECT_DIR = Path(__file__).resolve().parent.parent
AUDIT_FILE = PROJECT_DIR / "benchmarks" / "offline_audit.json"
GOLDEN_FILE = PROJECT_DIR / "benchmarks" / "mirage_golden_20_suite.json"
OUTPUT_FILE = PROJECT_DIR / "benchmarks" / "telemetry_fallback_mirage.json"


def sha256(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def verify_offline_audit(records):
    """Verify each offline record's hash and previous-hash link."""
    if not isinstance(records, list) or not records:
        return False

    previous_hash = "GENESIS"

    for record in records:
        if not isinstance(record, dict):
            return False

        if record.get("previous_hash") != previous_hash:
            return False

        audit_data = {
            "case_id": record.get("case_id"),
            "expected_verdict": record.get("expected_verdict"),
            "payload_sha256": record.get("payload_sha256"),
            "previous_hash": record.get("previous_hash")
        }

        canonical_data = json.dumps(
            audit_data,
            sort_keys=True,
            separators=(",", ":")
        )

        expected_hash = sha256(canonical_data)

        if record.get("record_hash") != expected_hash:
            return False

        previous_hash = record["record_hash"]

    return True


def main():
    with open(AUDIT_FILE, "r", encoding="utf-8") as file:
        audit_records = json.load(file)

    with open(GOLDEN_FILE, "r", encoding="utf-8") as file:
        golden_data = json.load(file)

    if isinstance(golden_data, list):
        cases = golden_data
    elif isinstance(golden_data, dict):
        cases = golden_data.get("cases", [])
    else:
        cases = []

    if not isinstance(cases, list):
        raise ValueError("Golden suite must contain a list of test cases.")

    audit_valid = verify_offline_audit(audit_records)

    telemetry = {
        "mode": "OFFLINE_FALLBACK",
        "generated_at_utc": datetime.now(
            timezone.utc
        ).isoformat(),
        "backend_connected": False,
        "data_is_simulated": True,
        "notice": (
            "Offline demonstration data only. "
            "Not live backend telemetry or a security verdict."
        ),
        "summary": {
            "golden_test_records": len(cases),
            "offline_audit_records": len(audit_records),
            "offline_audit_chain_valid": audit_valid,
            "offline_audit_status": (
                "VERIFIED" if audit_valid else "FAILED"
            ),
            "live_backend_ledger_verified": False
        },
        "events": []
    }

    for index, case in enumerate(cases, start=1):
        if not isinstance(case, dict):
            continue

        telemetry["events"].append({
            "event_id": f"OFFLINE-DEMO-{index:03d}",
            "timestamp": "--:--:--.---",
            "source_channel": case.get(
                "source_channel", "SYNTHETIC_TEST"
            ),
            "category": case.get("category", "UNCLASSIFIED"),
            "expected_verdict": case.get(
                "expected_verdict", "UNSPECIFIED"
            ),
            "actual_verdict": None,
            "status": "NOT_RUN_AGAINST_BACKEND",
            "latency_ms": None,
            "simulated": True
        })

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
        json.dump(telemetry, file, indent=2)

    print("Telemetry fallback file generated.")
    print(f"Events exported: {len(telemetry['events'])}")
    print(f"Offline audit records: {len(audit_records)}")
    print(f"Offline audit chain valid: {audit_valid}")
    print("Live backend ledger verified: False")
    print(f"Output: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
