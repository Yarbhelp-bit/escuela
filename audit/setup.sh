#!/usr/bin/env bash
# OmeTV Matchmaking Audit - Environment Setup
# Run this script once before starting the audit session.

set -e

PROXY_PORT=8080
AUDIT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== OmeTV Matchmaking Audit Setup ==="
echo ""

# 1. Install mitmproxy if missing
if ! command -v mitmdump &>/dev/null; then
    echo "[*] Installing mitmproxy..."
    pip3 install mitmproxy
fi
echo "[+] mitmproxy: $(mitmdump --version 2>&1 | head -1)"

# 2. Generate the mitmproxy CA certificate (first run only)
echo ""
echo "[*] Generating mitmproxy CA certificate..."
mitmdump --listen-port "$PROXY_PORT" &
MITM_PID=$!
sleep 2
kill "$MITM_PID" 2>/dev/null || true
wait "$MITM_PID" 2>/dev/null || true

CA_CERT="$HOME/.mitmproxy/mitmproxy-ca-cert.pem"
if [ -f "$CA_CERT" ]; then
    echo "[+] CA cert ready at: $CA_CERT"
else
    echo "[!] CA cert not found at expected path; check ~/.mitmproxy/"
fi

echo ""
echo "=== Device / App Configuration ==="
echo ""
echo "To intercept the OmeTV mobile app you must:"
echo ""
echo "  ANDROID:"
echo "    1. Set device WiFi proxy to this machine's IP, port $PROXY_PORT"
echo "    2. Install the CA cert:"
echo "         adb push $CA_CERT /sdcard/mitmproxy-ca.pem"
echo "         # Then on device: Settings > Security > Install from storage"
echo "    3. For Android 7+, the app needs network_security_config.xml patched"
echo "       (use apktool to patch or use a rooted device / emulator)"
echo ""
echo "  iOS:"
echo "    1. Set device WiFi proxy to this machine's IP, port $PROXY_PORT"
echo "    2. Open http://mitm.it on the device and install the cert"
echo "    3. Settings > General > About > Certificate Trust Settings > trust cert"
echo ""
echo "  Browser / desktop app:"
echo "    export https_proxy=http://127.0.0.1:$PROXY_PORT"
echo "    export http_proxy=http://127.0.0.1:$PROXY_PORT"
echo ""
echo "=== Starting the Audit Proxy ==="
echo ""
echo "Run in one terminal:"
echo "  cd $AUDIT_DIR"
echo "  mitmdump -s ometv_capture.py --listen-port $PROXY_PORT --ssl-insecure"
echo ""
echo "Then use the OmeTV app on your configured device."
echo ""
echo "When done, Ctrl+C to stop. The addon writes:"
echo "  ometv_audit.jsonl  — full JSONL event log"
echo "  ometv_summary.txt  — human-readable summary"
echo ""
echo "=== Fuzzing Captured Requests ==="
echo ""
echo "After capture, run the parameter fuzzer:"
echo "  python3 $AUDIT_DIR/replay_and_fuzz.py --log ometv_audit.jsonl"
echo ""
echo "Or fuzz a specific URL directly (routes the probes through mitmproxy"
echo "so you can watch the modified requests in the proxy UI):"
echo "  python3 $AUDIT_DIR/replay_and_fuzz.py \\"
echo "    --target https://api.ometv.tv/v1/match \\"
echo "    --proxy http://127.0.0.1:$PROXY_PORT"
echo ""
echo "Results saved to fuzz_results.json"
echo ""
echo "[+] Setup complete."
