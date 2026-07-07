#!/usr/bin/env python3
"""C2-OBS-INT-PHASE2-001 / OBS-001 — hookmap generator (deterministic, read-only).

Emits state/observations/OBS-001-promptAssembly-hookmap.json describing the
top-group (promptAssembly) runtime-behavioral report_only IDs the hook driver
observes, plus KNOWN-COVERED anchor IDs used to prove the hook attributes to
the correct TM INT ID.

Reads the registry read-only. No mutation, no counter edits.
"""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path

ROOT = Path("/Users/chaudoanm3/ai-tutor-factory")
STATE = ROOT / "state"
REGISTRY_DB = STATE / "int_registry.sqlite3"
RUNTIME_DB = STATE / "c2_runtime_int_factory_250.sqlite3"
OUT = STATE / "observations" / "OBS-001-promptAssembly-hookmap.json"

MODULE = "promptAssembly"
AUDIT_META_AXES = ("report", "source-truth-contract",
                   "ready-f-candidate-implementation-not-counted")

# Known-covered anchors: verified promptAssembly behaviors mapped to the real
# function that exercises them. Used to prove the hook names a covered ID.
COVERED_ANCHORS = [
    {"tm_int_id": "TM-INT-234", "probe": "assembleCefrConstraint",
     "behavior": "P13: injects CEFR vocabulary constraint when cefrLevel present"},
    {"tm_int_id": "TM-INT-235", "probe": "assembleSystemPromptNullCefr",
     "behavior": "P13b: no CEFR constraint when cefrLevel is null"},
]


def ro(path: Path) -> sqlite3.Connection:
    con = sqlite3.connect(f"file:{path}?mode=ro", uri=True, timeout=30)
    con.row_factory = sqlite3.Row
    con.execute("pragma busy_timeout=30000")
    return con


def main() -> None:
    with ro(REGISTRY_DB) as ir:
        placeholders = ",".join("?" for _ in AUDIT_META_AXES)
        rows = ir.execute(
            f"select tm_int_id, axis, behavior_boundary from int_registry "
            f"where status='report_only' and module=? "
            f"and axis not in ({placeholders}) order by tm_int_id",
            (MODULE, *AUDIT_META_AXES),
        ).fetchall()
        # verify anchors really are covered (verified in registry OR promoted)
        verified = {r[0] for r in ir.execute(
            "select tm_int_id from int_registry where status='verified'")}
    with ro(RUNTIME_DB) as rt:
        promoted = {r[0] for r in rt.execute(
            "select distinct tm_int_id from tm_int_coverage_promotions")}
    covered = verified | promoted

    anchors = []
    for a in COVERED_ANCHORS:
        anchors.append({**a, "covered": a["tm_int_id"] in covered})

    payload = {
        "mission": "C2-OBS-INT-PHASE2-001",
        "step": "OBS-001",
        "module": MODULE,
        "code_path": "src/lib/ai-tutor/promptAssembly.ts",
        "generated_by": "bin/c2-obs-001-gen-hookmap.py",
        "target_count": len(rows),
        "tm_int_ids": [
            {"tm_int_id": r["tm_int_id"], "axis": r["axis"],
             "behavior_boundary": r["behavior_boundary"]}
            for r in rows
        ],
        "covered_anchors": anchors,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {OUT}")
    print(f"targets={len(rows)} anchors={len(anchors)} "
          f"anchors_covered={[a['tm_int_id'] for a in anchors if a['covered']]}")


if __name__ == "__main__":
    main()
