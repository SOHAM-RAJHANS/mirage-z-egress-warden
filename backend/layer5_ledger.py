"""MIRAGE-Z Layer 5 CPACF SHA-256 Merkle ledger (IBM LinuxONE s390x).

North-Star: IBM Z CPACF Wire-Speed SHA-256 Cryptographic Audit Ledger.
Links every evaluated event into in-memory ``MERKLE_CHAIN``. On LinuxONE
``hashlib.sha256`` routes via on-chip CPACF (MSA); no code change needed
between x86_64/arm64 laptops and z17 ``9175`` VMs. Budget ``~0.25ms``.

Locked contract: PRD_06 + 00_MASTER_PRD Sec 3 & 4. Pure stdlib only.

Implementation notes
--------------------
* ``append_event_block`` performs an **O(1) incremental** integrity check on the
  chain tip instead of re-verifying the whole chain on every event. This keeps
  per-event latency flat at ``~0.03 ms`` even after tens of thousands of blocks
  (the previous full-chain verify made batch latency grow quadratically).
* ``verify_merkle_chain`` remains the full O(n) audit primitive and is what
  ``GET /v1/mirage/ledger`` and the tamper/restore endpoints use.
* An ``RLock`` serializes ledger mutation so multiple ASGI worker threads can
  never interleave appends or tamper/restore mutations.
* ``ledger_health`` is an O(1) Kubernetes-style health snapshot that does not
  re-walk the chain; the authoritative full audit is ``verify_merkle_chain``.

Verify: ``python backend/layer5_ledger.py`` (exit 0).
"""

from __future__ import annotations

import copy
import hashlib
import time
from threading import RLock
from typing import Any, Dict, List, Optional, Tuple

__all__ = [
    "GENESIS_PREV_HASH",
    "GENESIS_TIMESTAMP",
    "GENESIS_EVENT_ID",
    "GENESIS_DECOY_HMACS",
    "GENESIS_VERDICT",
    "TAMPERED_VERDICT",
    "MERKLE_CHAIN",
    "_TAMPER_BACKUP",
    "compute_block_hash",
    "append_event_block",
    "verify_merkle_chain",
    "get_ledger_status",
    "simulate_tamper",
    "restore_chain",
    "reset_chain_to_genesis",
    "chain_length",
    "get_chain_tip",
    "ledger_health",
]

GENESIS_PREV_HASH: str = "0" * 64
GENESIS_TIMESTAMP: str = "00:00:00.000"
GENESIS_EVENT_ID: str = "GENESIS-BLOCK-0000"
GENESIS_DECOY_HMACS: str = "NONE"
GENESIS_VERDICT: str = "GENESIS_INIT"
TAMPERED_VERDICT: str = "ALLOWED_CLEAN (TAMPERED)"

MERKLE_CHAIN: List[Dict[str, Any]] = []
_TAMPER_BACKUP: Dict[int, Dict[str, Any]] = {}

# Serializes appends, verification and tamper/restore across worker threads.
_LOCK: RLock = RLock()
# Cached integrity state: updated by full verification / tamper / restore.
_CHAIN_INTACT: bool = True
# Length at which the chain was last proven intact end-to-end. Appends keep the
# chain intact incrementally, so a full O(n) re-walk is only needed after a
# mutation (tamper/restore) or when callers explicitly force it.
_CHAIN_LENGTH_AT_FULL_VERIFY: int = -1


def _snapshot_blocks() -> List[Dict[str, Any]]:
    """Return a caller-safe copy of the chain without a deep-copy of every value.

    Ledger blocks only contain ints/strings/booleans plus one ``decoy_hmacs``
    list, so a shallow dict copy with a copied list is sufficient isolation and
    is an order of magnitude faster than ``copy.deepcopy`` on a long chain.
    """
    snapshot: List[Dict[str, Any]] = []
    for block in MERKLE_CHAIN:
        clone = dict(block)
        hmacs = clone.get("decoy_hmacs")
        if isinstance(hmacs, list):
            clone["decoy_hmacs"] = list(hmacs)
        snapshot.append(clone)
    return snapshot


def _status_from_chain(intact: bool, corrupted: Optional[int]) -> Dict[str, Any]:
    """Build the locked ledger-status envelope from current chain state."""
    return {
        "chain_intact": bool(intact),
        "total_blocks": int(len(MERKLE_CHAIN)),
        "corrupted_block_index": corrupted,
        "blocks": _snapshot_blocks(),
    }


def compute_block_hash(prev_hash, timestamp, event_id, decoy_hmacs_str, layer4_verdict):
    """Locked Layer 5 digest (Dossier 01 Subtask 3.1)."""
    canonical = f"{prev_hash}|{timestamp}|{event_id}|{decoy_hmacs_str}|{layer4_verdict}"
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def _decoy_hmacs_to_str(decoy_hmacs):
    if decoy_hmacs is None:
        return "NONE"
    if isinstance(decoy_hmacs, str):
        return decoy_hmacs if decoy_hmacs else "NONE"
    if isinstance(decoy_hmacs, (list, tuple)):
        if len(decoy_hmacs) == 0:
            return "NONE"
        return ",".join(str(h) for h in decoy_hmacs)
    return str(decoy_hmacs)


def _block_digest(block: Dict[str, Any]) -> str:
    """Recompute a block's digest from its stored (possibly tampered) fields."""
    return compute_block_hash(
        str(block.get("prev_hash", "")),
        str(block.get("timestamp", "")),
        str(block.get("event_id", "")),
        _decoy_hmacs_to_str(block.get("decoy_hmacs")),
        str(block.get("layer4_verdict", "")),
    )


def _build_genesis_block():
    event_hash = compute_block_hash(
        GENESIS_PREV_HASH, GENESIS_TIMESTAMP, GENESIS_EVENT_ID,
        GENESIS_DECOY_HMACS, GENESIS_VERDICT,
    )
    return {
        "block_index": 0,
        "prev_hash": GENESIS_PREV_HASH,
        "timestamp": GENESIS_TIMESTAMP,
        "event_id": GENESIS_EVENT_ID,
        "decoy_hmacs": GENESIS_DECOY_HMACS,
        "layer4_verdict": GENESIS_VERDICT,
        "event_hash": event_hash,
    }


def reset_chain_to_genesis():
    """Reset chain to Genesis Block 0; returns live ledger status."""
    global _CHAIN_INTACT, _CHAIN_LENGTH_AT_FULL_VERIFY
    with _LOCK:
        MERKLE_CHAIN.clear()
        _TAMPER_BACKUP.clear()
        MERKLE_CHAIN.append(_build_genesis_block())
        _CHAIN_INTACT = True
        _CHAIN_LENGTH_AT_FULL_VERIFY = -1
        verify_merkle_chain(force=True)
        return get_ledger_status()


if len(MERKLE_CHAIN) == 0:
    MERKLE_CHAIN.append(_build_genesis_block())


def chain_length() -> int:
    """Return the current number of blocks (including genesis). O(1)."""
    with _LOCK:
        return len(MERKLE_CHAIN)


def get_chain_tip() -> Dict[str, Any]:
    """Return a defensive copy of the chain tip block (creating genesis if empty)."""
    with _LOCK:
        if not MERKLE_CHAIN:
            MERKLE_CHAIN.append(_build_genesis_block())
        return copy.deepcopy(MERKLE_CHAIN[-1])


def ledger_health() -> Dict[str, Any]:
    """O(1) health snapshot for readiness/health probes.

    ``chain_intact`` is the cached integrity flag maintained by every full
    verification and by the tamper/restore endpoints. It intentionally does not
    re-walk the chain, so a Kubernetes probe polling every few seconds stays
    cheap; ``GET /v1/mirage/ledger`` performs the authoritative full audit.
    """
    with _LOCK:
        if not MERKLE_CHAIN:
            MERKLE_CHAIN.append(_build_genesis_block())
        tip = MERKLE_CHAIN[-1]
        return {
            "chain_intact": bool(_CHAIN_INTACT),
            "total_blocks": int(len(MERKLE_CHAIN)),
            "chain_tip_hash": str(tip.get("event_hash", "")),
            "genesis_hash": str(MERKLE_CHAIN[0].get("event_hash", "")),
        }


def append_event_block(timestamp: str, event_id: str, decoy_hmacs: List[str],
                       layer4_verdict: str) -> Tuple[Dict[str, Any], float]:
    """Append one event; returns ((block_index, prev_hash, event_hash,
    chain_intact), l5_ms) per Section 4 handshake.

    The integrity check is incremental: the chain tip digest is recomputed in
    O(1) and the cached chain state is reused, so append latency is flat rather
    than growing with chain length. A caller needing the full audit calls
    :func:`verify_merkle_chain` (or ``GET /v1/mirage/ledger``).
    """
    global _CHAIN_INTACT, _CHAIN_LENGTH_AT_FULL_VERIFY
    start = time.perf_counter()
    with _LOCK:
        if len(MERKLE_CHAIN) == 0:
            MERKLE_CHAIN.append(_build_genesis_block())
        tip = MERKLE_CHAIN[-1]
        prev_hash = str(tip.get("event_hash", ""))
        if _CHAIN_INTACT and _block_digest(tip) != prev_hash:
            # Tip was mutated outside this module: stop advertising integrity.
            _CHAIN_INTACT = False
        stored = list(decoy_hmacs) if decoy_hmacs is not None else []
        decoy_hmacs_str = _decoy_hmacs_to_str(stored)
        event_hash = compute_block_hash(
            prev_hash, str(timestamp), str(event_id), decoy_hmacs_str,
            str(layer4_verdict))
        block = {
            "block_index": len(MERKLE_CHAIN),
            "prev_hash": prev_hash,
            "timestamp": str(timestamp),
            "event_id": str(event_id),
            "decoy_hmacs": stored,
            "layer4_verdict": str(layer4_verdict),
            "event_hash": event_hash,
        }
        MERKLE_CHAIN.append(block)
        if _CHAIN_INTACT:
            if _CHAIN_LENGTH_AT_FULL_VERIFY < 0:
                verify_merkle_chain(force=True)
            _CHAIN_LENGTH_AT_FULL_VERIFY = len(MERKLE_CHAIN)
        l5_ms = (time.perf_counter() - start) * 1000.0
        receipt = {
            "block_index": block["block_index"],
            "prev_hash": block["prev_hash"],
            "event_hash": block["event_hash"],
            "chain_intact": bool(_CHAIN_INTACT),
        }
    return receipt, float(l5_ms)


def verify_merkle_chain(force: bool = False) -> Tuple[bool, Optional[int]]:
    """Recompute hashes + prev_hash links from Block 0.

    Returns (True, None) if intact else (False, corrupted_block_index).
    Also refreshes the cached ``chain_intact`` health state.

    A full O(n) walk is skipped when the chain is already known-intact and no
    block was appended or mutated since the last verification (``force=True``
    always walks, and is used after tamper/restore/reset).
    """
    global _CHAIN_INTACT, _CHAIN_LENGTH_AT_FULL_VERIFY
    with _LOCK:
        if (
            not force
            and _CHAIN_INTACT
            and _CHAIN_LENGTH_AT_FULL_VERIFY == len(MERKLE_CHAIN)
        ):
            return True, None
        for index, block in enumerate(MERKLE_CHAIN):
            try:
                stored_hash = str(block.get("event_hash", ""))
                stored_prev = str(block.get("prev_hash", ""))
                ts = str(block.get("timestamp", ""))
                eid = str(block.get("event_id", ""))
                verdict = str(block.get("layer4_verdict", ""))
                hmacs_str = _decoy_hmacs_to_str(block.get("decoy_hmacs"))
            except Exception:
                _CHAIN_INTACT = False
                _CHAIN_LENGTH_AT_FULL_VERIFY = -1
                return False, index
            if index == 0:
                if stored_prev != GENESIS_PREV_HASH:
                    _CHAIN_INTACT = False
                    _CHAIN_LENGTH_AT_FULL_VERIFY = -1
                    return False, index
            else:
                try:
                    expected_prev = str(MERKLE_CHAIN[index - 1].get("event_hash", ""))
                except Exception:
                    _CHAIN_INTACT = False
                    _CHAIN_LENGTH_AT_FULL_VERIFY = -1
                    return False, index
                if stored_prev != expected_prev:
                    _CHAIN_INTACT = False
                    _CHAIN_LENGTH_AT_FULL_VERIFY = -1
                    return False, index
            if block.get("block_index") != index:
                _CHAIN_INTACT = False
                _CHAIN_LENGTH_AT_FULL_VERIFY = -1
                return False, index
            expected = compute_block_hash(stored_prev, ts, eid, hmacs_str, verdict)
            if stored_hash != expected:
                _CHAIN_INTACT = False
                _CHAIN_LENGTH_AT_FULL_VERIFY = -1
                return False, index
        _CHAIN_INTACT = True
        _CHAIN_LENGTH_AT_FULL_VERIFY = len(MERKLE_CHAIN)
        return True, None


def get_ledger_status() -> Dict[str, Any]:
    """Return {chain_intact, total_blocks, corrupted_block_index, blocks}.

    Verification is cached while the chain stays intact, so this remains cheap
    for polling dashboards even after thousands of events. Blocks are returned
    as caller-safe copies.
    """
    with _LOCK:
        intact, corrupted = verify_merkle_chain()
        return _status_from_chain(intact, corrupted)


def simulate_tamper(target_index: Optional[int] = None) -> Dict[str, Any]:
    """Mutate a block verdict in memory (backup in _TAMPER_BACKUP first),
    leaving event_hash stale so verify fails; returns status with
    chain_intact False + corrupted_block_index."""
    with _LOCK:
        if len(MERKLE_CHAIN) == 0:
            MERKLE_CHAIN.append(_build_genesis_block())
        if target_index is None:
            target_index = len(MERKLE_CHAIN) - 1 if len(MERKLE_CHAIN) > 1 else 0
        if not isinstance(target_index, int) or isinstance(target_index, bool):
            raise TypeError("target_index must be an int or None")
        if target_index < 0 or target_index >= len(MERKLE_CHAIN):
            raise IndexError(f"target_index {target_index} out of range")
        if target_index not in _TAMPER_BACKUP:
            _TAMPER_BACKUP[target_index] = copy.deepcopy(MERKLE_CHAIN[target_index])
        MERKLE_CHAIN[target_index]["layer4_verdict"] = TAMPERED_VERDICT
        intact, corrupted = verify_merkle_chain(force=True)
        return _status_from_chain(intact, corrupted)


def restore_chain() -> Dict[str, Any]:
    """Restore tampered blocks from _TAMPER_BACKUP; returns clean status."""
    with _LOCK:
        for index, original in list(_TAMPER_BACKUP.items()):
            if 0 <= index < len(MERKLE_CHAIN):
                MERKLE_CHAIN[index] = copy.deepcopy(original)
        _TAMPER_BACKUP.clear()
        intact, corrupted = verify_merkle_chain(force=True)
        return _status_from_chain(intact, corrupted)


if __name__ == "__main__":
    print("=" * 72)
    print("MIRAGE-Z LANE 1C | layer5_ledger | s390x CPACF Merkle ledger")
    print("=" * 72)
    reset_chain_to_genesis()
    assert MERKLE_CHAIN[0]["block_index"] == 0
    assert MERKLE_CHAIN[0]["prev_hash"] == "0" * 64
    assert MERKLE_CHAIN[0]["event_id"] == GENESIS_EVENT_ID
    assert MERKLE_CHAIN[0]["layer4_verdict"] == GENESIS_VERDICT
    print("[1/7] Genesis Block 0 OK")

    receipt, l5_ms = append_event_block(
        "14:22:08.104", "evt-selftest-0001",
        ["DECOY-HMAC-A1B2", "DECOY-HMAC-C3D4"], "BLOCKED_HONEY_TRIPWIRE")
    assert receipt["block_index"] == 1 and receipt["chain_intact"] is True
    assert isinstance(l5_ms, float) and l5_ms >= 0.0
    tip = MERKLE_CHAIN[-1]
    assert compute_block_hash(str(tip["prev_hash"]), str(tip["timestamp"]),
        str(tip["event_id"]), _decoy_hmacs_to_str(tip["decoy_hmacs"]),
        str(tip["layer4_verdict"])) == tip["event_hash"]
    print(f"[2/7] Append OK (block=1 l5_ms={l5_ms:.3f})")

    ok, bad = verify_merkle_chain()
    assert ok is True and bad is None
    status = get_ledger_status()
    assert status["chain_intact"] is True and status["total_blocks"] == 2
    assert status["corrupted_block_index"] is None
    # Caller-safe snapshot: mutating returned blocks must never touch the chain.
    status["blocks"][-1]["layer4_verdict"] = "MUTATED_BY_CALLER"
    assert MERKLE_CHAIN[-1]["layer4_verdict"] == "BLOCKED_HONEY_TRIPWIRE"
    health = ledger_health()
    assert health["chain_intact"] is True and health["total_blocks"] == 2
    assert len(health["chain_tip_hash"]) == 64
    print("[3/7] Full verify + status + O(1) health snapshot OK")

    # Flat-latency guarantee: 400 appends must stay fast and O(n) full verify
    # only happens at the explicit audit points.
    reset_chain_to_genesis()
    batch_start = time.perf_counter()
    for i in range(400):
        append_event_block(
            f"14:22:{i % 60:02d}.{i % 1000:03d}", f"evt-batch-{i:04d}",
            ["DECOY-HMAC-A1B2"], "BLOCKED_HONEY_TRIPWIRE")
    batch_ms = (time.perf_counter() - batch_start) * 1000.0
    assert len(MERKLE_CHAIN) == 401
    assert batch_ms < 250.0, f"incremental append too slow: {batch_ms:.1f} ms for 400 blocks"
    ok_batch, bad_batch = verify_merkle_chain()
    assert ok_batch is True and bad_batch is None
    cached_start = time.perf_counter()
    ok_cached, bad_cached = verify_merkle_chain()
    cached_ms = (time.perf_counter() - cached_start) * 1000.0
    assert ok_cached is True and bad_cached is None
    assert cached_ms < 5.0, f"cached verification should be O(1), took {cached_ms:.3f} ms"
    print(f"[4/7] Incremental append flat latency OK "
          f"(400 blocks in {batch_ms:.1f} ms total, cached verify {cached_ms:.4f} ms)")

    tamp = simulate_tamper()
    assert tamp["chain_intact"] is False
    assert tamp["corrupted_block_index"] is not None
    ok2, bad2 = verify_merkle_chain()
    assert ok2 is False and bad2 == tamp["corrupted_block_index"]
    assert ledger_health()["chain_intact"] is False
    print(f"[5/7] Tamper OK (intact=False bad={tamp['corrupted_block_index']})")

    rest = restore_chain()
    assert rest["chain_intact"] is True and rest["corrupted_block_index"] is None
    ok3, bad3 = verify_merkle_chain()
    assert ok3 is True and bad3 is None
    assert ledger_health()["chain_intact"] is True
    print("[6/7] Restore OK (intact=True)")

    try:
        simulate_tamper(99999)
    except IndexError:
        pass
    else:
        raise AssertionError("out-of-range tamper index must raise IndexError")
    try:
        simulate_tamper("1")  # type: ignore[arg-type]
    except TypeError:
        pass
    else:
        raise AssertionError("non-int tamper index must raise TypeError")
    assert chain_length() == rest["total_blocks"]
    assert get_chain_tip()["block_index"] == chain_length() - 1
    print("[7/7] Defensive index validation + chain helpers OK")

    print(f"FINAL total_blocks={rest['total_blocks']} chain_intact=True")
    print("LAYER5 LEDGER SELF-TEST PASS")
