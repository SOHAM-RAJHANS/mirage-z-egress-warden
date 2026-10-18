# MIRAGE-Z Scripts Directory

| Script | Purpose |
| :--- | :--- |
| `verify_linuxone.sh` | Full eight-stage LinuxONE verification proof: architecture, contract + every layer self-test, gateway self-test, pytest, live health probe, chaos suite, benchmark suite (live HTTP when the gateway is up) and the terminal CLI demo. Run with `bash scripts/verify_linuxone.sh`; exits `0` only when every gate passes. |

The script is safe on laptops and IBM LinuxONE VMs: it degrades to the real in-process
pipeline when no gateway is listening on `MIRAGE_API_URL`.
