#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

FACTORY = Path("/Users/chaudoanm3/ai-tutor-factory")
sys.path.insert(0, str(FACTORY / "bin"))

from int_registry_gate import gate_audit_payload, intake_candidate  # noqa: E402


DB = FACTORY / "state" / "int_registry.sqlite3"
SOURCE_QUEUE = "tm-design-group-b-vi-20260715"


def main() -> int:
    repo = Path(__file__).resolve().parents[2]
    candidates_path = repo / "evidence" / "tm-design-group-b-vi-20260715" / "group_b_vi_candidates.json"
    output_path = repo / "evidence" / "tm-design-group-b-vi-20260715" / "registry-intake.json"

    candidates = json.loads(candidates_path.read_text())
    rows_added: list[dict] = []
    rows_already_present: list[dict] = []
    rows_blocked_as_duplicate: list[dict] = []
    unresolved_collisions: list[dict] = []
    blocked_non_duplicate: list[dict] = []

    for row in candidates:
        result = intake_candidate(
            module=row["module"],
            axis=row["axis"],
            behavior_boundary=row["behaviorBoundary"],
            source_queue=SOURCE_QUEUE,
            tm_int_id=row["id"],
            status="report_only",
            db_path=DB,
            similarity_threshold=0.97,
        )
        record = {
            "tm_int_id": row["id"],
            "source_candidate": row["sourceCandidate"],
            "module": row["module"],
            "axis": row["axis"],
            "behavior_boundary": row["behaviorBoundary"],
            "registry_intake": result.as_dict(),
            "semantic_key": result.semantic_key,
            "normalized_boundary": result.normalized_boundary,
        }
        if result.action == "added":
            rows_added.append(record)
        elif result.action == "already_present":
            rows_already_present.append(record)
        elif result.action == "blocked_duplicate":
            rows_blocked_as_duplicate.append(record)
        elif result.action == "unresolved_collision":
            unresolved_collisions.append(record)
        else:
            blocked_non_duplicate.append(record)

    payload = gate_audit_payload(
        source_queue=SOURCE_QUEUE,
        rows_added=rows_added,
        rows_blocked_as_duplicate=rows_blocked_as_duplicate,
        rows_already_present=rows_already_present,
        unresolved_collisions=unresolved_collisions,
        blocked_non_duplicate=blocked_non_duplicate,
        runnable_count=len(rows_added) + len(rows_already_present),
    )
    output_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps(payload, indent=2, ensure_ascii=False))

    if unresolved_collisions or blocked_non_duplicate or rows_blocked_as_duplicate:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
