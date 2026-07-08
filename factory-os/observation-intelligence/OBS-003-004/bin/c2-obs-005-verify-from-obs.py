#!/usr/bin/env python3
"""
OBS-005 — evidence-gated verify-from-obs governor transition.

Makes int_registry coverage move ONLY as a function of proof. For each TM INT ID
it REFUSES to verify unless a matching, replay-passing OBS-004 evidence packet is
present on disk and its digest chain re-derives at flip time. There is NO flip
path that skips the evidence check.

Gate (all must hold, else REFUSE with reason):
  1. ID exists in int_registry.
  2. Current status == 'report_only'  (never re-verify / never touch other states).
  3. OBS-004 packet OBS-004-<ID>.json exists.
  4. packet.tm_int_id == ID.
  5. packet.replay_proof.checks are ALL true (code_path + input_digest + output_digest).
  6. Identity bind: packet.axis == registry.axis  (AXIS only; registry.module is round-robin noise, kept as a non-blocking audit field — recorded, never gating).
  7. Digest re-derivation AT FLIP TIME (byte-exact, via c2-obs-005-digest.mjs):
       node_digest(packet.output)
         == packet.output_digest
         == packet.replay_proof.recorded_output_digest
         == OBS-001 recorded output_digest for <ID>.

On PASS + --commit: flips report_only->verified, sets verified_evidence_ref
(packet_id + output_digest), and appends an int_registry_events row
'verified_from_obs_evidence'. Default is DRY-RUN (no writes).

Safety:
  * DRY-RUN is the default; --commit is required to write.
  * --commit additionally requires env OBS_GOVERNOR_AUTH=obs-evidence-gate.
  * The real registry stays read-only unless BOTH are supplied AND the owner
    points --db at it. Build/test on copies.
"""
import argparse
import json
import os
import sqlite3
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
DIGEST_HELPER = HERE / "c2-obs-005-digest.mjs"


def rederive_output_digest(packet_path: Path) -> str:
    out = subprocess.run(
        ["node", str(DIGEST_HELPER), str(packet_path)],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=60,
    )
    if out.returncode != 0:
        raise RuntimeError(f"digest helper failed: {out.stderr.strip()}")
    return out.stdout.strip()


def ensure_evidence_ref_column(con: sqlite3.Connection) -> None:
    cols = {r[1] for r in con.execute("PRAGMA table_info(int_registry)").fetchall()}
    if "verified_evidence_ref" not in cols:
        con.execute("ALTER TABLE int_registry ADD COLUMN verified_evidence_ref TEXT")


def load_obs001(path: Path) -> dict:
    by_id = {}
    for line in path.read_text().splitlines():
        line = line.strip()
        if line:
            r = json.loads(line)
            by_id[r["tm_int_id"]] = r
    return by_id


def load_ids(attributions: Path) -> list:
    ids = []
    for line in attributions.read_text().splitlines():
        line = line.strip()
        if not line:
            continue
        r = json.loads(line)
        if r.get("status") == "attributed" and r.get("confidence") == "high":
            ids.append(r["tm_int_id"])
    return ids


def evaluate(con, tm_int_id, packets_dir, obs001, now):
    """Return (decision, reason, evidence_ref|None). decision in {FLIP, REFUSE}."""
    row = con.execute(
        "SELECT module, axis, status FROM int_registry WHERE tm_int_id=?",
        (tm_int_id,),
    ).fetchone()
    if row is None:
        return "REFUSE", "not_in_registry", None
    module, axis, status = row
    if status != "report_only":
        return "REFUSE", f"not_report_only:{status}", None

    packet_path = Path(packets_dir) / f"OBS-004-{tm_int_id}.json"
    if not packet_path.exists():
        return "REFUSE", "no_obs004_packet", None
    packet = json.loads(packet_path.read_text())

    if packet.get("tm_int_id") != tm_int_id:
        return "REFUSE", "packet_id_mismatch", None

    checks = (packet.get("replay_proof") or {}).get("checks") or {}
    if not (checks.get("code_path_match") and checks.get("input_digest_match")
            and checks.get("output_digest_match")):
        failed = [k for k, v in checks.items() if not v] or ["missing_checks"]
        return "REFUSE", f"replay_checks_failed:{','.join(failed)}", None

    # Identity bind is on AXIS (the v2-established real owner). The registry
    # `module` column is round-robin noise for cross-module axes, so it is NOT a
    # blocking check — it is kept only as a non-blocking AUDIT field (any
    # packet.module != registry.module disagreement is recorded in the event
    # payload below, surfaced never masked). The anti-forgery guarantee is the
    # crypto chain (replay checks + digest==OBS-001 anchor + tm_int_id + axis).
    if packet.get("axis") != axis:
        return "REFUSE", f"axis_mismatch:packet={packet.get('axis')}!=registry={axis}", None

    # Digest re-derivation at flip time — byte-exact, independent of stored value.
    rederived = rederive_output_digest(packet_path)
    packet_digest = packet.get("output_digest")
    replay_recorded = (packet.get("replay_proof") or {}).get("recorded_output_digest")
    obs1 = obs001.get(tm_int_id)
    obs1_digest = obs1.get("output_digest") if obs1 else None
    chain = {rederived, packet_digest, replay_recorded, obs1_digest}
    if obs1_digest is None:
        return "REFUSE", "no_obs001_record", None
    if len(chain) != 1:
        return "REFUSE", (
            f"digest_rederive_mismatch:rederived={rederived} packet={packet_digest} "
            f"replay={replay_recorded} obs001={obs1_digest}"
        ), None

    module_audit = {
        "packet_module": packet.get("module"),
        "registry_module": module,
        "module_disagreement": packet.get("module") != module,
    }
    evidence_ref = json.dumps({
        "packet_id": packet.get("packet_id"),
        "output_digest": packet_digest,
        "obs003_run_id": (packet.get("run_ids") or {}).get("obs003"),
        "obs001_run_id": (packet.get("run_ids") or {}).get("obs001"),
        "module_audit": module_audit,
    }, ensure_ascii=False)
    return "FLIP", "evidence_gate_passed", evidence_ref


def main():
    ap = argparse.ArgumentParser(description="OBS-005 evidence-gated verify-from-obs governor")
    ap.add_argument("--db", required=True, help="int_registry sqlite (use a COPY for dry-run)")
    ap.add_argument("--packets-dir", required=True)
    ap.add_argument("--obs001", required=True, help="tm-int-observations.jsonl")
    ap.add_argument("--ids-from", required=True, help="OBS-002-attributions.jsonl")
    ap.add_argument("--commit", action="store_true", help="write flips (default: dry-run)")
    args = ap.parse_args()

    if args.commit and os.environ.get("OBS_GOVERNOR_AUTH") != "obs-evidence-gate":
        print(json.dumps({"ok": False, "reason": "commit_requires_OBS_GOVERNOR_AUTH=obs-evidence-gate"}))
        return 4

    obs001 = load_obs001(Path(args.obs001))
    ids = load_ids(Path(args.ids_from))
    now = "2026-07-07T00:00:00.000Z"

    con = sqlite3.connect(args.db)
    con.execute("PRAGMA foreign_keys=ON")
    if args.commit:
        ensure_evidence_ref_column(con)

    would_flip, refused, module_audit_disagreements = [], [], []
    for tm_int_id in ids:
        decision, reason, evidence_ref = evaluate(con, tm_int_id, args.packets_dir, obs001, now)
        if decision == "FLIP":
            would_flip.append(tm_int_id)
            ref = json.loads(evidence_ref)
            audit = ref.get("module_audit") or {}
            if audit.get("module_disagreement"):
                module_audit_disagreements.append({"tm_int_id": tm_int_id, **audit})
            if args.commit:
                ensure_evidence_ref_column(con)
                con.execute(
                    "UPDATE int_registry SET status='verified', updated_at=?, verified_evidence_ref=? "
                    "WHERE tm_int_id=? AND status='report_only'",
                    (now, evidence_ref, tm_int_id),
                )
                con.execute(
                    "INSERT INTO int_registry_events (tm_int_id, event_type, payload_json, created_at) "
                    "VALUES (?, ?, ?, ?)",
                    (tm_int_id, "verified_from_obs_evidence",
                     json.dumps({"reason": reason, "evidence_ref": ref, "module_audit": audit},
                                ensure_ascii=False),
                     now),
                )
        else:
            refused.append({"tm_int_id": tm_int_id, "reason": reason})

    if args.commit:
        con.commit()
    con.close()

    summary = {
        "mode": "commit" if args.commit else "dry-run",
        "db": args.db,
        "total_ids": len(ids),
        "flip_count": len(would_flip),
        "refuse_count": len(refused),
        "would_flip": would_flip,
        "refused": refused,
        "module_audit_disagreement_count": len(module_audit_disagreements),
        "module_audit_disagreements": module_audit_disagreements,
    }
    print(json.dumps(summary, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
