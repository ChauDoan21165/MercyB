#!/usr/bin/env python3
from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path("/Users/chaudoanm3/ai-tutor-factory")
INT_REGISTRY_DB = ROOT / "state" / "int_registry.sqlite3"
RUNTIME_INT_DB = ROOT / "state" / "c2_runtime_int_factory_250.sqlite3"
PORT = 8767


def iso_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def query_one(db: Path, sql: str, params: tuple = ()) -> dict:
    con = sqlite3.connect(f"file:{db}?mode=ro", uri=True, timeout=5)
    con.row_factory = sqlite3.Row
    try:
        con.execute("pragma busy_timeout=5000")
        row = con.execute(sql, params).fetchone()
        return dict(row) if row else {}
    finally:
        con.close()


def query_all(db: Path, sql: str, params: tuple = ()) -> list[dict]:
    con = sqlite3.connect(f"file:{db}?mode=ro", uri=True, timeout=5)
    con.row_factory = sqlite3.Row
    try:
        con.execute("pragma busy_timeout=5000")
        return [dict(row) for row in con.execute(sql, params).fetchall()]
    finally:
        con.close()


TOTAL_SQL = "select count(distinct tm_int_id) as value from int_registry"
CANONICAL_JUDGE_VERIFIED_SQL = (
    "select count(distinct tm_int_id) as value "
    "from int_registry where status='verified'"
)
CANONICAL_JUDGE_VERIFIED_IDS_SQL = "select distinct tm_int_id from int_registry where status='verified'"
PROMOTED_IDS_SQL = "select distinct tm_int_id from tm_int_coverage_promotions"
IMPROVED_IDS_SQL = """
select distinct p.tm_int_id
from tm_int_coverage_promotions p
join runtime_int_judge_results j
  on j.run_id = p.judge_run_id
 and j.wp_id = p.wp_id
where j.decision = 'verified'
  and j.no_source_move = 0
  and j.command_evidence = 1
  and j.passing_validation = 1
  and j.source_or_replay_evidence = 1
  and coalesce(j.diff_size, 0) > 0
"""
PENDING_JUDGE_SQL = "select count(*) as value from runtime_int_judge_queue where queue_state='pending'"
REJECTED_SQL = "select count(*) as value from runtime_int_judge_queue where last_decision='rejected'"
# Provenance split (OBS-005): trusted-source backfill (no evidence ref) vs
# OBS-evidence-earned (verified_evidence_ref present). DISPLAY only — reads,
# never alters, the underlying rows.
BACKFILL_VERIFIED_SQL = (
    "select count(distinct tm_int_id) as value from int_registry "
    "where status='verified' and verified_evidence_ref is null"
)
EVIDENCE_EARNED_VERIFIED_SQL = (
    "select count(distinct tm_int_id) as value from int_registry "
    "where status='verified' and verified_evidence_ref is not null"
)


def _has_evidence_ref_column(db: Path) -> bool:
    return any(
        row.get("name") == "verified_evidence_ref"
        for row in query_all(db, "PRAGMA table_info(int_registry)")
    )


def state() -> dict:
    total = int(query_one(INT_REGISTRY_DB, TOTAL_SQL).get("value") or 0)
    canonical_verified = {
        row["tm_int_id"] for row in query_all(INT_REGISTRY_DB, CANONICAL_JUDGE_VERIFIED_IDS_SQL)
    }
    promoted = {row["tm_int_id"] for row in query_all(RUNTIME_INT_DB, PROMOTED_IDS_SQL)}
    improved = {row["tm_int_id"] for row in query_all(RUNTIME_INT_DB, IMPROVED_IDS_SQL)}
    tm_int_improved = len(improved)
    judge_verified = len(canonical_verified | promoted)
    pending_judge = int(query_one(RUNTIME_INT_DB, PENDING_JUDGE_SQL).get("value") or 0)
    rejected = int(query_one(RUNTIME_INT_DB, REJECTED_SQL).get("value") or 0)
    coverage = (judge_verified / total * 100) if total else 0.0
    canonical_verified_count = int(
        query_one(INT_REGISTRY_DB, CANONICAL_JUDGE_VERIFIED_SQL).get("value") or 0
    )
    if _has_evidence_ref_column(INT_REGISTRY_DB):
        backfill = int(query_one(INT_REGISTRY_DB, BACKFILL_VERIFIED_SQL).get("value") or 0)
        evidence_earned = int(
            query_one(INT_REGISTRY_DB, EVIDENCE_EARNED_VERIFIED_SQL).get("value") or 0
        )
    else:
        backfill, evidence_earned = canonical_verified_count, 0
    verified_provenance = {
        "total_verified": canonical_verified_count,
        "trusted_source_backfill": backfill,
        "obs_evidence_earned": evidence_earned,
        "display": (
            f"{canonical_verified_count} = {backfill} trusted-source backfill "
            f"+ {evidence_earned} OBS-evidence-earned"
        ),
        "note": (
            "trusted_source_backfill = imported from repo-contracts, no runtime "
            "evidence; obs_evidence_earned = verified via OBS-005 evidence gate "
            "(carries a re-derivable verified_evidence_ref)."
        ),
    }
    return {
        "title": "TM INT",
        "tm_int_total": total,
        "canonical_judge_verified": canonical_verified_count,
        "verified_provenance": verified_provenance,
        "promoted_judge_verified": len(promoted),
        "tm_int_improved": tm_int_improved,
        "judge_verified": judge_verified,
        "pending_judge": pending_judge,
        "rejected": rejected,
        "coverage": round(coverage, 2),
        "coverage_display": f"{coverage:.2f}%",
        "generated_at": iso_now(),
        "sources": {
            "int_registry_db": str(INT_REGISTRY_DB),
            "runtime_int_db": str(RUNTIME_INT_DB),
        },
        "queries": {
            "tm_int_total": TOTAL_SQL,
            "canonical_judge_verified_ids": CANONICAL_JUDGE_VERIFIED_IDS_SQL,
            "promoted_judge_verified_ids": PROMOTED_IDS_SQL,
            "tm_int_improved": IMPROVED_IDS_SQL.strip(),
            "judge_verified": "count(distinct canonical verified tm_int_id union promoted tm_int_id)",
            "pending_judge": PENDING_JUDGE_SQL,
            "rejected": REJECTED_SQL,
            "coverage": "judge_verified / tm_int_total * 100",
        },
    }


HTML = """<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>TM INT</title>
  <style>
    :root{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#171717;background:#f6f7f9}
    body{margin:0;padding:18px}
    .panel{width:min(420px,100%);background:#fff;border:1px solid #d9dde5;border-radius:8px;overflow:hidden}
    h1{font-size:20px;line-height:1.2;margin:0;padding:14px 16px;border-bottom:1px solid #d9dde5}
    dl{display:grid;grid-template-columns:150px 1fr;gap:10px 16px;margin:0;padding:16px}
    dt{font-weight:750;color:#3f4652}
    dd{margin:0;font-weight:800;overflow-wrap:anywhere}
  </style>
</head>
<body>
<main class="panel">
  <h1>TM INT</h1>
  <dl>
    <dt>TM INT Total</dt><dd id="total">-</dd>
    <dt>TM INT Improved</dt><dd id="improved">-</dd>
    <dt>Judge Verified</dt><dd id="verified">-</dd>
    <dt>Verified Provenance</dt><dd id="provenance">-</dd>
    <dt>Pending Judge</dt><dd id="pending">-</dd>
    <dt>Rejected</dt><dd id="rejected">-</dd>
    <dt>Coverage</dt><dd id="coverage">-</dd>
  </dl>
</main>
<script>
async function load(){
  const response = await fetch('/api/state?t=' + Date.now(), {cache:'no-store'});
  const s = await response.json();
  document.getElementById('total').textContent = s.tm_int_total;
  document.getElementById('improved').textContent = s.tm_int_improved;
  document.getElementById('verified').textContent = s.judge_verified;
  document.getElementById('provenance').textContent = (s.verified_provenance && s.verified_provenance.display) || '-';
  document.getElementById('pending').textContent = s.pending_judge;
  document.getElementById('rejected').textContent = s.rejected;
  document.getElementById('coverage').textContent = s.coverage_display;
}
load();
setInterval(load, 2000);
</script>
</body>
</html>
"""


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_args):
        return

    def send_bytes(self, code: int, body: bytes, content_type: str) -> None:
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/state":
            try:
                body = json.dumps(state(), indent=2).encode("utf-8")
                self.send_bytes(200, body, "application/json; charset=utf-8")
            except Exception as exc:
                body = json.dumps({"error": str(exc), "generated_at": iso_now()}).encode("utf-8")
                self.send_bytes(500, body, "application/json; charset=utf-8")
            return
        if path in {"/", "/index.html"}:
            self.send_bytes(200, HTML.encode("utf-8"), "text/html; charset=utf-8")
            return
        self.send_bytes(404, b"not found", "text/plain; charset=utf-8")


def main() -> int:
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"http://127.0.0.1:{PORT}", flush=True)
    server.serve_forever()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
