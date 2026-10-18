# Mirage-Z Benchmark and Audit Report

## 1. Offline Preparation Results

- Golden test records: 20
- Stress test records: 1000
- Golden suite structure: PASS
- Stress suite structure: PASS
- PAN checksum tests: PASS
- IBAN checksum tests: PASS
- Checksum test suite: PASS
- Offline SHA-256 audit chain: VERIFIED
- Tamper detection test: PASS
- Local preparation time: 1.763 ms

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
