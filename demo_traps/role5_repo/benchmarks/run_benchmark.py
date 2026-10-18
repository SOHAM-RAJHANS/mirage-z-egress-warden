
import json
import hashlib
import time
from pathlib import Path

# Locate the benchmark folder
BASE_DIR = Path(__file__).parent

GOLDEN_FILE = BASE_DIR / "mirage_golden_20_suite.json"
STRESS_FILE = BASE_DIR / "stress_1000.json"
AUDIT_FILE = BASE_DIR / "offline_audit.json"
REPORT_FILE = BASE_DIR / "BENCHMARK_AND_AUDIT_REPORT.md"


def load_json(file_path):
    """Read a JSON file and return its contents."""
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def validate_pan_luhn(pan):
    """Validate a test PAN using the Luhn checksum."""
    if not pan.isdigit():
        return False

    total = 0
    reverse_digits = pan[::-1]

    for i, digit in enumerate(reverse_digits):
        number = int(digit)

        if i % 2 == 1:
            number *= 2
            if number > 9:
                number -= 9

        total += number

    return total % 10 == 0


def validate_iban_checksum(iban):
    """Validate an IBAN checksum using the Mod 97 rule."""
    iban = iban.replace(" ", "").upper()

    if len(iban) < 5 or not iban.isalnum():
        return False

    rearranged = iban[4:] + iban[:4]
    converted = ""

    for char in rearranged:
        if char.isdigit():
            converted += char
        elif "A" <= char <= "Z":
            converted += str(ord(char) - ord("A") + 10)
        else:
            return False

    remainder = 0
    for digit in converted:
        remainder = (remainder * 10 + int(digit)) % 97

    return remainder == 1

def sha256(text):
    """Calculate a SHA-256 hash."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def validate_cases(cases, expected_count, label):
    """Check basic structure and unique IDs."""
    errors = []

    if not isinstance(cases, list):
        return [f"{label} must contain a JSON list."]

    if len(cases) != expected_count:
        errors.append(
            f"{label}: expected {expected_count} records, "
            f"found {len(cases)}."
        )

    seen_ids = set()

    for case in cases:
        if not isinstance(case, dict):
            errors.append(f"{label}: a record is not a JSON object.")
            continue

        case_id = case.get("case_id") or case.get("trace_id")

        if not case_id:
            errors.append(f"{label}: a record is missing its ID.")
        elif case_id in seen_ids:
            errors.append(f"{label}: duplicate ID {case_id}.")
        else:
            seen_ids.add(case_id)

        if not isinstance(case.get("payload"), str):
            errors.append(f"{label}: {case_id} has no text payload.")

        if not case.get("expected_verdict"):
            errors.append(f"{label}: {case_id} has no expected verdict.")

    return errors


def create_offline_audit(cases):
    """Create a hash-linked record for each test case."""
    records = []
    previous_hash = "GENESIS"

    for case in cases:
        audit_data = {
            "case_id": case.get("case_id"),
            "expected_verdict": case.get("expected_verdict"),
            "payload_sha256": sha256(case.get("payload", "")),
            "previous_hash": previous_hash
        }

        canonical_data = json.dumps(
            audit_data, sort_keys=True, separators=(",", ":")
        )

        current_hash = sha256(canonical_data)

        record = {
            **audit_data,
            "record_hash": current_hash
        }

        records.append(record)
        previous_hash = current_hash

    return records


def verify_audit(records):
    """Check hashes and links in the local audit trail."""
    previous_hash = "GENESIS"

    for record in records:
        if record.get("previous_hash") != previous_hash:
            return False

        audit_data = {
            "case_id": record.get("case_id"),
            "expected_verdict": record.get("expected_verdict"),
            "payload_sha256": record.get("payload_sha256"),
            "previous_hash": record.get("previous_hash")
        }

        canonical_data = json.dumps(
            audit_data, sort_keys=True, separators=(",", ":")
        )

        expected_hash = sha256(canonical_data)

        if record.get("record_hash") != expected_hash:
            return False

        previous_hash = record["record_hash"]

    return True


def main():
    start_time = time.perf_counter()

    # Check that the generated files exist
    for file_path in [GOLDEN_FILE, STRESS_FILE]:
        if not file_path.exists():
            print(f"ERROR: Missing file: {file_path.name}")
            return

    golden_cases = load_json(GOLDEN_FILE)
    stress_cases = load_json(STRESS_FILE)

    errors = []
    errors.extend(
        validate_cases(golden_cases, 20, "Golden suite")
    )
    errors.extend(
        validate_cases(stress_cases, 1000, "Stress suite")
    )

    if errors:
        print("Validation failed:")
        for error in errors:
            print("-", error)
        return
    
    # Test PAN and IBAN checksum validation using test fixtures
    pan_valid_test = validate_pan_luhn("4111111111111111")
    pan_invalid_test = not validate_pan_luhn("4111111111111112")

    iban_valid_test = validate_iban_checksum("GB82WEST12345698765432")
    iban_invalid_test = not validate_iban_checksum("GB82WEST12345698765433")

    checksum_tests_pass = all([
        pan_valid_test,
        pan_invalid_test,
        iban_valid_test,
        iban_invalid_test
    ])

    print("\nChecksum Validation Results:")
    print(f"PAN valid test accepted: {pan_valid_test}")
    print(f"PAN invalid test rejected: {pan_invalid_test}")
    print(f"IBAN valid test accepted: {iban_valid_test}")
    print(f"IBAN invalid test rejected: {iban_invalid_test}")

    
    if not checksum_tests_pass:
        print("ERROR: Checksum validation tests failed!")
        raise SystemExit(1)


    # Create and verify an offline SHA-256 audit trail
    audit_records = create_offline_audit(golden_cases)
    audit_valid = verify_audit(audit_records)
    
    # Test whether a modified copy of the audit trail is detected
    tampered_records = json.loads(json.dumps(audit_records))

    if tampered_records:
        tampered_records[0]["expected_verdict"] = "TAMPERED_TEST_VALUE"
        tamper_detected = not verify_audit(tampered_records)
    else:
        tamper_detected = False

    print(f"Original audit chain valid: {audit_valid}")
    print(f"Tampering detected: {tamper_detected}")
    if not audit_valid:
        print("ERROR: Original audit chain verification failed!")
        raise SystemExit(1)

    if not tamper_detected:
        print("ERROR: Tampering was not detected!")
        raise SystemExit(1)
    
    with open(AUDIT_FILE, "w", encoding="utf-8") as file:
        json.dump(audit_records, file, indent=2)

    elapsed_ms = (time.perf_counter() - start_time) * 1000

    # This measures local file preparation only, not backend latency.
    
    report = f"""# Mirage-Z Benchmark and Audit Report

## 1. Offline Preparation Results

- Golden test records: {len(golden_cases)}
- Stress test records: {len(stress_cases)}
- Golden suite structure: PASS
- Stress suite structure: PASS
- PAN checksum tests: {"PASS" if pan_valid_test and pan_invalid_test else "FAIL"}
- IBAN checksum tests: {"PASS" if iban_valid_test and iban_invalid_test else "FAIL"}
- Checksum test suite: {"PASS" if checksum_tests_pass else "FAIL"}
- Offline SHA-256 audit chain: {"VERIFIED" if audit_valid else "FAILED"}
- Tamper detection test: {"PASS" if tamper_detected else "FAIL"}
- Local preparation time: {elapsed_ms:.3f} ms

## 2. Telemetry Fallback

- Operating mode: OFFLINE FALLBACK
- Telemetry source: Synthetic test data
- Expected fallback events: 20
- Offline audit chain: Verified by the separate telemetry exporter
- Live backend ledger: NOT VERIFIED
- Live API connectivity: NOT TESTED by this script

See `telemetry_fallback_mirage.json` for the exported fallback data.

## 3. Important Limitations

The Mirage-Z backend has not been connected to this benchmark script.

These results validate locally generated test files, checksum test cases,
and a locally created hash-linked audit trail. They do not demonstrate
that Mirage-Z blocks attacks or verify the team's actual Layer 5 ledger.

The telemetry fallback is simulated data, not live application telemetry.
Its offline audit verification does not establish that the backend ledger
is secure or that the application has passed security testing.

## 4. Pending Tests

After the backend is available, test:

- Actual verdicts for the 20 golden cases
- API response handling for the 1000-record stress suite
- Malformed JSON, empty requests, missing fields, and wrong data types
- Oversized payload handling
- Real request latency and error responses
- Financial checksum validation through the actual application
- Tampering detection against the actual application audit ledger

No live security pass rate or production performance claim is made here.
"""

    with open(REPORT_FILE, "w", encoding="utf-8") as file:
        file.write(report)

    print("\nOffline validation complete!")
    print(f"Golden cases checked: {len(golden_cases)}")
    print(f"Stress records checked: {len(stress_cases)}")
    print(f"Audit chain verified: {audit_valid}")
    print(f"Report saved: {REPORT_FILE.name}")
    print(f"Audit saved: {AUDIT_FILE.name}")
    print("\nReminder: the actual Mirage-Z backend has not been tested.")


if __name__ == "__main__":
    main()
