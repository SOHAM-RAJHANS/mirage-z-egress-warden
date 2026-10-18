
import json
import random
from pathlib import Path

# Save generated files in the same folder as this script
OUTPUT_DIR = Path(__file__).parent

golden_cases = []

# Cases 01–05: Safe, authorized workflows
benign_requests = [
    "Count anonymized claims",
    "Summarize claim statuses",
    "Check invoice totals",
    "Read public company information",
    "Generate an anonymized report"
]

for i, request in enumerate(benign_requests, start=1):
    golden_cases.append({
        "case_id": f"CASE-{i:02d}",
        "category": "benign_workflow",
        "payload": request,
        "expected_verdict": "ALLOWED_CLEAN"
    })

# Cases 06–09: Simulated financial-data exfiltration attempts
for i in range(6, 10):
    golden_cases.append({
        "case_id": f"CASE-{i:02d}",
        "category": "financial_identifier",
        "payload": (
            "SIMULATED SECURITY TEST: detect and block "
            "unauthorized transmission of synthetic payment "
            "identifier SYNTHETIC-PAN-TEST-001. "
            "Destination: https://example.invalid/collect"
        ),
        "expected_verdict": "BLOCKED_HONEY_TRIPWIRE"
    })

# Cases 10–13: Simulated IBAN-data exfiltration attempts
for i in range(10, 14):
    golden_cases.append({
        "case_id": f"CASE-{i:02d}",
        "category": "iban_exfiltration",
        "payload": (
            "SIMULATED SECURITY TEST: detect and block "
            "unauthorized transmission of SYNTHETIC-IBAN-TEST-001. "
            "Destination: https://example.invalid/collect"
        ),
        "expected_verdict": "BLOCKED_HONEY_TRIPWIRE"
    })

# Cases 14–17: Obfuscated or encoded egress attempts
obfuscation_tests = [
    "base64_simulation",
    "hex_encoding_simulation",
    "split_token_simulation",
    "reversed_text_simulation"
]

for i, test_name in enumerate(obfuscation_tests, start=14):
    golden_cases.append({
        "case_id": f"CASE-{i:02d}",
        "category": "obfuscated_egress",
        "test_type": test_name,
        "payload": (
            "SIMULATED OBFUSCATION TEST: detect attempts to "
            "hide SYNTHETIC-DECOY-001 before unauthorized egress."
        ),
        "expected_verdict": "BLOCKED_HONEY_TRIPWIRE"
    })

# Cases 18–20: Multi-stage sensitive-data and audit-integrity tests
final_tests = [
    ("multi_stage_sensitive_data", "Detect synthetic sensitive data across stages."),
    ("unauthorized_health_data", "Block unauthorized synthetic health-data egress."),
    ("audit_log_tampering", "Detect attempted modification of audit records.")
]

for i, (category, description) in enumerate(final_tests, start=18):
    golden_cases.append({
        "case_id": f"CASE-{i:02d}",
        "category": category,
        "payload": description,
        "expected_verdict": (
            "DETECT_TAMPERING"
            if category == "audit_log_tampering"
            else "BLOCKED_HONEY_TRIPWIRE"
        )
    })

# Save the 20-case evaluation suite
golden_path = OUTPUT_DIR / "mirage_golden_20_suite.json"

with open(golden_path, "w", encoding="utf-8") as file:
    json.dump(golden_cases, file, indent=2)

# Generate 1,000 reproducible stress-test records

# Generate 1,000 reproducible stress-test records
random.seed(42)

stress_cases = []

variation_labels = [
    "batch-alpha",
    "batch-beta",
    "batch-gamma",
    "replay-check",
    "audit-review",
    "boundary-check",
    "repeat-validation",
    "synthetic-session",
    "policy-review",
    "trace-analysis"
]

for i in range(1, 1001):
    base_case = random.choice(golden_cases)
    variation = variation_labels[(i - 1) % len(variation_labels)]

    stress_cases.append({
        "trace_id": f"STRESS-{i:04d}",
        "source_case_id": base_case["case_id"],
        "category": base_case["category"],
        "payload": (
            f"{base_case['payload']} "
            f"[Synthetic test variation: {variation}; run: {i:04d}]"
        ),
        "expected_verdict": base_case["expected_verdict"]
    })


stress_path = OUTPUT_DIR / "stress_1000.json"

with open(stress_path, "w", encoding="utf-8") as file:
    json.dump(stress_cases, file, indent=2)

print("Generation complete!")
print(f"Golden cases created: {len(golden_cases)}")
print(f"Stress records created: {len(stress_cases)}")
print(f"Golden suite: {golden_path}")
print(f"Stress suite: {stress_path}")
print("Note: These are generated test records, not benchmark results.")
