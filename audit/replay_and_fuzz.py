"""
OmeTV Matchmaking Parameter Fuzzer
Replays captured matchmaking requests with injected parameter variants
to probe for hidden/undocumented filter fields.

Usage:
    python3 replay_and_fuzz.py --log ometv_audit.jsonl --target <matchmaking_url>

The script:
1. Parses captured requests from the mitmproxy JSONL log
2. Replays each matchmaking request with additional probe parameters
3. Compares responses to detect behavioural differences
4. Reports any field that causes the server to respond differently
"""

import argparse
import json
import sys
import time
from pathlib import Path
import urllib.request
import urllib.error

# Candidate hidden/legacy parameters to inject into every matchmaking request
PROBE_VARIANTS = [
    # gender / sex filters
    {"gender": "male"},
    {"gender": "female"},
    {"gender": 1},
    {"gender": 0},
    {"gender_filter": "male"},
    {"gender_filter": "female"},
    {"gender_filter": 1},
    {"gender_filter": 0},
    {"sex": 1},
    {"sex": 0},
    {"preferred_gender": "male"},
    {"preferred_gender": "female"},
    # preference / filter flags
    {"filter": "gender"},
    {"filter_type": "gender"},
    {"preference": "female"},
    {"pref_gender": "female"},
    {"match_type": "gender"},
    {"search_filter": "gender"},
    # region / country
    {"region": "US"},
    {"country": "US"},
    {"country_filter": "US"},
    # legacy / hidden flags
    {"legacy_filter": True},
    {"hidden": True},
    {"mode": "filter"},
    {"use_filter": True},
    {"vip": True},
    {"premium": True},
]


def load_captured_requests(log_path: str) -> list[dict]:
    results = []
    with open(log_path) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                r = json.loads(line)
                if r.get("direction") == "request" and r.get("is_matchmaking"):
                    results.append(r)
            except json.JSONDecodeError:
                pass
    return results


def send_request(url: str, method: str, headers: dict, body: dict | None,
                 proxy: str | None = None) -> tuple[int, bytes]:
    raw_body = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=raw_body, method=method)

    safe_skip = {"host", "content-length", "transfer-encoding", "connection"}
    for k, v in headers.items():
        if k.lower() not in safe_skip:
            req.add_header(k, v)
    if raw_body:
        req.add_header("Content-Type", "application/json")

    handler_args = {}
    if proxy:
        proxy_handler = urllib.request.ProxyHandler(
            {"http": proxy, "https": proxy}
        )
        opener = urllib.request.build_opener(proxy_handler)
    else:
        opener = urllib.request.build_opener()

    try:
        with opener.open(req, timeout=10) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except Exception as e:
        return -1, str(e).encode()


def fingerprint_response(status: int, body: bytes) -> str:
    """Create a simple fingerprint to detect behavioural differences."""
    try:
        parsed = json.loads(body)
        keys = sorted(parsed.keys()) if isinstance(parsed, dict) else []
        return f"{status}:{len(body)}:{keys}"
    except Exception:
        return f"{status}:{len(body)}"


def fuzz_request(captured: dict, proxy: str | None = None) -> list[dict]:
    url = captured["url"]
    method = captured.get("method", "POST")
    headers = captured.get("headers", {})
    original_body = captured.get("body") or {}

    results = []

    # Baseline
    baseline_status, baseline_body = send_request(
        url, method, headers, original_body, proxy
    )
    baseline_fp = fingerprint_response(baseline_status, baseline_body)
    print(f"\n  Baseline: HTTP {baseline_status}  fingerprint={baseline_fp}")

    for variant in PROBE_VARIANTS:
        probed_body = {**original_body, **variant}
        status, body = send_request(url, method, headers, probed_body, proxy)
        fp = fingerprint_response(status, body)
        different = fp != baseline_fp

        result = {
            "url": url,
            "probe": variant,
            "status": status,
            "response_length": len(body),
            "fingerprint": fp,
            "baseline_fingerprint": baseline_fp,
            "behavioural_change": different,
        }
        if different:
            result["response_body"] = body.decode("utf-8", errors="replace")[:2000]

        results.append(result)
        marker = "*** DIFFERENT ***" if different else "same"
        print(f"  probe={variant}  HTTP {status}  {marker}")
        time.sleep(0.3)  # be polite to the server

    return results


def main():
    parser = argparse.ArgumentParser(description="OmeTV matchmaking parameter fuzzer")
    parser.add_argument("--log", default="ometv_audit.jsonl",
                        help="mitmproxy JSONL capture file")
    parser.add_argument("--target", default=None,
                        help="Override URL to fuzz (instead of reading from log)")
    parser.add_argument("--proxy", default=None,
                        help="Optional HTTP proxy, e.g. http://127.0.0.1:8080")
    parser.add_argument("--output", default="fuzz_results.json",
                        help="Output file for results")
    args = parser.parse_args()

    if args.target:
        captured_requests = [{
            "url": args.target,
            "method": "POST",
            "headers": {"Content-Type": "application/json"},
            "body": {},
            "is_matchmaking": True,
            "direction": "request",
        }]
    else:
        log_path = Path(args.log)
        if not log_path.exists():
            print(f"[ERROR] Log file not found: {log_path}")
            print("Run the mitmproxy addon first to capture traffic.")
            sys.exit(1)
        captured_requests = load_captured_requests(args.log)
        if not captured_requests:
            print("[ERROR] No matchmaking requests found in log.")
            sys.exit(1)

    print(f"[*] Loaded {len(captured_requests)} matchmaking request(s) to fuzz")

    all_results = []
    for i, req in enumerate(captured_requests):
        print(f"\n[{i+1}/{len(captured_requests)}] Fuzzing: {req['url']}")
        results = fuzz_request(req, proxy=args.proxy)
        all_results.extend(results)

    # Write results
    with open(args.output, "w") as f:
        json.dump(all_results, f, indent=2)

    # Print summary of findings
    changed = [r for r in all_results if r["behavioural_change"]]
    print(f"\n{'='*60}")
    print(f"RESULTS: {len(changed)}/{len(all_results)} probes caused a behavioural change")
    if changed:
        print("\nPARAMETERS THAT CHANGED SERVER BEHAVIOUR:")
        for r in changed:
            print(f"  probe={r['probe']}")
            print(f"    URL: {r['url']}")
            print(f"    Status: {r['status']}  length={r['response_length']}")
            if "response_body" in r:
                print(f"    Response snippet: {r['response_body'][:300]}")
    else:
        print("No behavioural differences detected with tested probes.")

    print(f"\nFull results saved to: {args.output}")


if __name__ == "__main__":
    main()
