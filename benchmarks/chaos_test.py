
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

# Mirage-Z Role 5: Local Chaos Test Preparation
# Only tests a backend running on this Mac.
BASE_URL = "http://127.0.0.1:8000"
ENDPOINT = BASE_URL + "/v1/mirage/evaluate"
REPORT_PATH = Path(__file__).parent / "chaos_test_report.json"

tests = [
    {
        "name": "Malformed JSON",
        "body": '{"payload": ',
        "content_type": "application/json",
        "expected_status": 422,
    },
    {
        "name": "Empty request body",
        "body": "",
        "content_type": "application/json",
        "expected_status": 422,
    },
    {
        "name": "Empty JSON string",
        "body": json.dumps(""),
        "content_type": "application/json",
        "expected_status": 422,
    },
    {
        "name": "Missing fields",
        "body": json.dumps({}),
        "content_type": "application/json",
        "expected_status": 422,
    },
    {
        "name": "Wrong JSON field types",
        "body": json.dumps({
            "payload": 12345,
            "source_channel": None
        }),
        "content_type": "application/json",
        "expected_status": 422,
    },
    {
        "name": "Large payload (20,000 characters)",
        "body": json.dumps({
            "payload": "A" * 20000
        }),
        "content_type": "application/json",
        "expected_status": 200,
    },
]


def check_local_backend():
    """Check whether the local API responds."""
    request = urllib.request.Request(
        BASE_URL + "/docs",
        method="GET"
    )

    try:
        with urllib.request.urlopen(request, timeout=3) as response:
            return True, response.status
    except urllib.error.HTTPError as error:
        # An HTTP response still proves a server answered.
        return True, error.code
    except (urllib.error.URLError, TimeoutError, OSError):
        return False, None


def main():
    print("=" * 55)
    print("MIRAGE-Z ROLE 5: CHAOS TEST")
    print("=" * 55)

    available, status = check_local_backend()
    chaos_ok = False
    passed_count = 0

    if not available:
        print("\nLocal backend not detected at", BASE_URL)
        print("No chaos requests were sent.")
        print("\nPreparation mode: listing planned test cases only.")

        report = {
            "mode": "preparation_only",
            "backend_available": False,
            "results": [
                {
                    "test": test["name"],
                    "status": "NOT_RUN",
                    "reason": "Local backend unavailable"
                }
                for test in tests
            ]
        }

    else:
        print(f"\nLocal server responded to /docs (HTTP {status}).")
        print("Sending test cases to the local evaluate endpoint.")
        print("The request schema must be confirmed with the backend team.")

        results = []

        for test in tests:
            print(f"\nTesting: {test['name']}")

            request = urllib.request.Request(
                ENDPOINT,
                data=test["body"].encode("utf-8"),
                headers={
                    "Content-Type": test["content_type"]
                },
                method="POST"
            )

            started = time.perf_counter()

            try:
                with urllib.request.urlopen(
                    request, timeout=10
                ) as response:
                    response_body = response.read().decode(
                        "utf-8", errors="replace"
                    )
                    elapsed_ms = round(
                        (time.perf_counter() - started) * 1000, 3
                    )

                    try:
                        parsed = json.loads(response_body)
                        response_format = (
                            "json" if isinstance(parsed, (dict, list))
                            else "json_non_object"
                        )
                    except json.JSONDecodeError:
                        response_format = "non_json"

                    result = {
                        "test": test["name"],
                        "status": "RESPONSE_RECEIVED",
                        "http_status": response.status,
                        "expected_status": test["expected_status"],
                        "passed": response.status == test["expected_status"],
                        "latency_ms": elapsed_ms,
                        "response_format": response_format,
                        "response_preview": response_body[:500]
                    }

            except urllib.error.HTTPError as error:
                response_body = error.read().decode(
                    "utf-8", errors="replace"
                )
                elapsed_ms = round(
                    (time.perf_counter() - started) * 1000, 3
                )

                result = {
                    "test": test["name"],
                    "status": "HTTP_ERROR_RESPONSE",
                    "http_status": error.code,
                    "expected_status": test["expected_status"],
                    "passed": (
                        error.code == test["expected_status"] and error.code < 500
                    ),
                    "latency_ms": elapsed_ms,
                    "response_preview": response_body[:500]
                }

            except (urllib.error.URLError, TimeoutError, OSError) as error:
                result = {
                    "test": test["name"],
                    "status": "REQUEST_FAILED",
                    "expected_status": test["expected_status"],
                    "passed": False,
                    "error": str(error)
                }

            results.append(result)
            print(json.dumps(result, indent=2))

        passed_count = sum(1 for item in results if item.get("passed"))
        chaos_ok = passed_count == len(results)

        report = {
            "mode": "local_backend_test",
            "backend_available": True,
            "endpoint": ENDPOINT,
            "expected": "5 malformed requests -> 422, 20KB payload -> 200, zero 5xx",
            "summary": {
                "total": len(results),
                "passed": passed_count,
                "failed": len(results) - passed_count,
                "chaos_ok": chaos_ok,
            },
            "results": results
        }

    REPORT_PATH.write_text(
        json.dumps(report, indent=2),
        encoding="utf-8"
    )

    print("\n" + "=" * 55)
    print("Report saved to:", REPORT_PATH)
    if not available:
        print("Preparation mode: backend unavailable; chaos checks were NOT executed.")
        print("=" * 55)
        return 0
    print(f"Chaos summary: {passed_count}/{len(results)} passed")
    if not chaos_ok:
        print("CHAOS TEST FAILED")
        print("=" * 55)
        return 1
    print("CHAOS TEST PASS")
    print("=" * 55)
    return 0


if __name__ == "__main__":
    sys.exit(main())

