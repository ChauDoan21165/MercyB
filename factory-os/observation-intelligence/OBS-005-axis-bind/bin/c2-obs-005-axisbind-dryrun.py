#!/usr/bin/env python3
"""
OBS-005 axis-bind — dry-run comparison harness (owner decision: bind identity on AXIS).

Runs the OBS-005 governor over the aiTutorService slice's 42 attributed/replayed IDs
under BOTH bind semantics, on registry COPIES only (real registry never opened rw):

  * module-bind (origin/main, current tracked)   — expected: 2 flip / 40 module_mismatch
  * axis-bind   (this MR, the owner decision)     — expected: the 40 axis-matching IDs
                                                    become eligible; only real evidence
                                                    gaps still refuse.

Against TWO registry states so the axis-bind EFFECT on the 40 is visible honestly:
  A. pre-aitutor backup  — the 42 are report_only there (apples-to-apples with the
                           original !2522 dry-run). This is where flip/refuse is meaningful.
  B. current live        — provenance check: are the 42 already verified? (they were
                           flipped 480->522 on the !2522 branch via the axis-bind governor).

NO real flip. NO write to any real registry. Guardrail-2 stays armed (copies carry the
triggers). Emits the exact 40 module_mismatch IDs and the axis-bind flip/refuse counts.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HOME = Path(os.environ["HOME"])
FACTORY = HOME / "ai-tutor-factory"
AIT = FACTORY / "state" / "observations" / "aiTutorService"
PACKETS = AIT / "OBS-004-evidence-packets"
OBS1 = AIT / "tm-int-observations.jsonl"
IDS_FROM = AIT / "OBS-002-attributions.jsonl"
LIVE = FACTORY / "state" / "int_registry.sqlite3"
BACKUP = FACTORY / "state" / "int_registry.sqlite3.bak-pre-aitutor-20260707"

HERE = Path(__file__).resolve().parent
# axis-bind governor = the one shipped in THIS MR (tracked, same dir tree).
AXIS_GOV = HERE.parent.parent / "OBS-003-004" / "bin" / "c2-obs-005-verify-from-obs.py"
DIGEST_HELPER = AXIS_GOV.parent / "c2-obs-005-digest.mjs"


def sha(p: Path) -> str:
    import hashlib
    return hashlib.sha256(p.read_bytes()).hexdigest()


def run_gov(gov: Path, registry: Path, workdir: Path, tag: str) -> dict:
    db = workdir / f"{tag}.sqlite3"
    shutil.copy(registry, db)
    before = sha(db)
    r = subprocess.run(
        ["python3", str(gov), "--db", str(db), "--packets-dir", str(PACKETS),
         "--obs001", str(OBS1), "--ids-from", str(IDS_FROM)],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=300)
    summ = json.loads(r.stdout) if r.stdout.strip() else {"error": r.stderr[:400]}
    summ["_copy_unchanged"] = sha(db) == before   # dry-run must not write
    return summ


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--module-bind-governor", required=True,
                    help="module-bind governor extracted from origin/main (with helper alongside)")
    ap.add_argument("--json-out")
    args = ap.parse_args()
    module_gov = Path(args.module_bind_governor).resolve()

    workdir = Path(tempfile.mkdtemp(prefix="obs005-axisbind-"))
    try:
        live_before = sha(LIVE)
        runs = {
            "module_bind__pre_aitutor_backup": run_gov(module_gov, BACKUP, workdir, "mb_bk"),
            "axis_bind__pre_aitutor_backup":   run_gov(AXIS_GOV, BACKUP, workdir, "ax_bk"),
            "axis_bind__current_live":         run_gov(AXIS_GOV, LIVE, workdir, "ax_live"),
        }
        # the 40 module_mismatch IDs come from the module-bind / backup run
        mb = runs["module_bind__pre_aitutor_backup"]
        mm_ids = sorted(r["tm_int_id"] for r in mb.get("refused", [])
                        if (r.get("reason") or "").startswith("module_mismatch"))
        axb = runs["axis_bind__pre_aitutor_backup"]
        # among those 40, what does axis-bind do?
        axb_flipped = set(axb.get("would_flip", []))
        mm_now_flip = [t for t in mm_ids if t in axb_flipped]
        mm_still_refuse = [{"tm_int_id": r["tm_int_id"], "reason": r["reason"]}
                           for r in axb.get("refused", []) if r["tm_int_id"] in set(mm_ids)]

        result = {
            "decision": "OBS-005 identity bind = AXIS (module = non-blocking audit)",
            "governors": {"module_bind": str(module_gov), "axis_bind": str(AXIS_GOV)},
            "real_registry_untouched": sha(LIVE) == live_before,
            "counts": {
                "module_bind_backup":  {"flip": mb.get("flip_count"), "refuse": mb.get("refuse_count")},
                "axis_bind_backup":    {"flip": axb.get("flip_count"), "refuse": axb.get("refuse_count"),
                                        "module_audit_disagreements": axb.get("module_audit_disagreement_count")},
                "axis_bind_live":      {"flip": runs["axis_bind__current_live"].get("flip_count"),
                                        "refuse": runs["axis_bind__current_live"].get("refuse_count")},
            },
            "the_40_module_mismatch_ids": mm_ids,
            "the_40_under_axis_bind": {
                "now_flip": len(mm_now_flip),
                "still_refuse": len(mm_still_refuse),
                "still_refuse_detail": mm_still_refuse,
            },
            "live_provenance_note": {
                "axis_bind_live_refuse_reasons": sorted(set(
                    (r.get("reason") or "").split(":")[0]
                    for r in runs["axis_bind__current_live"].get("refused", []))),
            },
            "copies_unchanged": {k: v.get("_copy_unchanged") for k, v in runs.items()},
        }
        if args.json_out:
            Path(args.json_out).write_text(json.dumps(result, indent=2))
        print(json.dumps(result, indent=2))
        return 0
    finally:
        shutil.rmtree(workdir, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
