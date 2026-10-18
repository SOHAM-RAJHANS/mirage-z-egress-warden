---
name: mega-backend-systems
description: Autonomous multi-pass backend architecture, FastAPI REST/SSE engineering, and resilient data pipeline engine.
---
# Mega Backend Systems

## FastAPI & SSE Implementation Rules
1. **Strict Schema Validation**: Validate all incoming requests via Pydantic v2 models (`EvaluateRequest`) and return custom 422 JSON error envelopes on malformed input so fuzz tests (`chaos_test.py`) never trigger 500 crashes.
2. **Zero-Drop SSE Fan-Out**:
   - Maintain `REPLAY_BUFFER = collections.deque(maxlen=25)` and `SUBSCRIBERS = set()`.
   - Clone subscriber queues (`list(SUBSCRIBERS)`) before iteration.
   - Flush the last 10 events immediately on client connect, emit `: heartbeat\n\n` every 10 seconds, and clean up disconnected queues inside a `finally:` block.
3. **CORS Open for Local + Cloud Cockpit**: Enable `CORSMiddleware(allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])`.
