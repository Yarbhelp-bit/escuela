"""
OmeTV Matchmaking API Audit - mitmproxy addon
Usage: mitmdump -s ometv_capture.py --ssl-insecure -p 8080

Captures all OmeTV traffic and logs matchmaking-related requests,
flagging any gender/filter/preference fields in request or response bodies.
"""

import json
import re
import time
from pathlib import Path
from mitmproxy import http, ctx

OMETV_DOMAINS = {
    "ometv.tv",
    "api.ometv.tv",
    "match.ometv.tv",
    "signal.ometv.tv",
    "ws.ometv.tv",
}

FILTER_KEYWORDS = {
    "gender", "filter", "preference", "pref",
    "region", "country", "sex", "male", "female",
    "age", "hidden", "legacy", "flag", "mode",
    "match_type", "search_type", "user_type",
}

LOG_FILE = Path("ometv_audit.jsonl")
SUMMARY_FILE = Path("ometv_summary.txt")

_findings = []


def _is_ometv(flow: http.HTTPFlow) -> bool:
    host = flow.request.pretty_host
    return any(host == d or host.endswith("." + d) for d in OMETV_DOMAINS)


def _extract_body(content: bytes, content_type: str) -> dict | list | str | None:
    if not content:
        return None
    try:
        return json.loads(content)
    except Exception:
        pass
    if b"=" in content:
        try:
            from urllib.parse import parse_qs
            return {k: v[0] if len(v) == 1 else v
                    for k, v in parse_qs(content.decode()).items()}
        except Exception:
            pass
    try:
        return content.decode("utf-8", errors="replace")
    except Exception:
        return None


def _scan_for_filter_fields(obj, path="") -> list[tuple[str, str]]:
    """Recursively scan a parsed JSON/dict/list for filter-related keys."""
    hits = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            full_path = f"{path}.{k}" if path else k
            if any(kw in k.lower() for kw in FILTER_KEYWORDS):
                hits.append((full_path, repr(v)))
            hits.extend(_scan_for_filter_fields(v, full_path))
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            hits.extend(_scan_for_filter_fields(item, f"{path}[{i}]"))
    elif isinstance(obj, str):
        if any(kw in obj.lower() for kw in FILTER_KEYWORDS):
            hits.append((path, repr(obj)))
    return hits


def _log(record: dict):
    with LOG_FILE.open("a") as f:
        f.write(json.dumps(record) + "\n")


def _is_matchmaking(flow: http.HTTPFlow) -> bool:
    path = flow.request.path.lower()
    keywords = ["match", "pair", "connect", "search", "queue", "find", "partner"]
    return any(kw in path for kw in keywords)


class OmeTVAudit:

    def request(self, flow: http.HTTPFlow):
        if not _is_ometv(flow):
            return

        req = flow.request
        ct = req.headers.get("content-type", "")
        body = _extract_body(req.content, ct)
        filter_hits = _scan_for_filter_fields(body) if body else []

        # Also scan query params
        for k, v in req.query.items():
            if any(kw in k.lower() for kw in FILTER_KEYWORDS):
                filter_hits.append((f"query.{k}", repr(v)))

        record = {
            "ts": time.time(),
            "direction": "request",
            "method": req.method,
            "url": req.pretty_url,
            "headers": dict(req.headers),
            "body": body,
            "filter_hits": filter_hits,
            "is_matchmaking": _is_matchmaking(flow),
        }
        _log(record)

        if filter_hits or _is_matchmaking(flow):
            ctx.log.warn(
                f"[OmeTV AUDIT] {req.method} {req.pretty_url}\n"
                f"  filter_hits={filter_hits}\n"
                f"  is_matchmaking={_is_matchmaking(flow)}"
            )
            _findings.append(record)

    def response(self, flow: http.HTTPFlow):
        if not _is_ometv(flow):
            return

        resp = flow.response
        ct = resp.headers.get("content-type", "")
        body = _extract_body(resp.content, ct)
        filter_hits = _scan_for_filter_fields(body) if body else []

        record = {
            "ts": time.time(),
            "direction": "response",
            "url": flow.request.pretty_url,
            "status": resp.status_code,
            "headers": dict(resp.headers),
            "body": body,
            "filter_hits": filter_hits,
            "is_matchmaking": _is_matchmaking(flow),
        }
        _log(record)

        if filter_hits or _is_matchmaking(flow):
            ctx.log.warn(
                f"[OmeTV AUDIT] RESPONSE {resp.status_code} {flow.request.pretty_url}\n"
                f"  filter_hits={filter_hits}"
            )
            _findings.append(record)

    def done(self):
        """Write a human-readable summary when mitmproxy exits."""
        with SUMMARY_FILE.open("w") as f:
            f.write("=== OmeTV Matchmaking Audit Summary ===\n\n")
            f.write(f"Total flagged events: {len(_findings)}\n\n")

            matchmaking = [r for r in _findings if r.get("is_matchmaking")]
            f.write(f"Matchmaking endpoints hit: {len(matchmaking)}\n")
            for r in matchmaking:
                f.write(f"  [{r['direction'].upper()}] {r.get('method','')}"
                        f" {r['url']} -> status={r.get('status','')}\n")
                if r["filter_hits"]:
                    f.write("    FILTER FIELDS:\n")
                    for path, val in r["filter_hits"]:
                        f.write(f"      {path} = {val}\n")
                f.write("\n")

            all_hits = [r for r in _findings if r["filter_hits"]]
            if all_hits:
                f.write("\n=== All filter-related fields found ===\n")
                for r in all_hits:
                    f.write(f"  {r['url']}\n")
                    for path, val in r["filter_hits"]:
                        f.write(f"    {path} = {val}\n")

        ctx.log.info(f"[OmeTV AUDIT] Summary written to {SUMMARY_FILE}")


addons = [OmeTVAudit()]
