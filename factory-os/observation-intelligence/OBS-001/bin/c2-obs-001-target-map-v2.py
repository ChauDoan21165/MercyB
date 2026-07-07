#!/usr/bin/env python3
"""C2-OBS-INT-PHASE2-001 / OBS-001 v2 — re-derive the ranked gap list by AXIS OWNER.

The v1 gap list grouped the 1198 runtime-behavioral report_only IDs by their
registry `module`. OBS-002 proved that field is a module x axis cross-product:
behavior is defined by the AXIS, not the module (identical behavior_boundary
across modules for the same axis). So v1's per-module counts are wrong.

v2 re-groups by the true axis-owner module. The axis -> owner map is REUSED
from the OBS-002 attribution output (bin does not hand-map IDs):
  - axes ATTRIBUTED (predicate-confirmed on real promptAssembly code) -> owner
    promptAssembly, confidence high (already instrumented in OBS-001).
  - axes PARKED -> owner = the belongs_to module OBS-002 named, confidence
    medium (to be confirmed when that module is instrumented).

READ-ONLY on the registry. Writes state/observations/OBS-001-target-map-v2.json.
"""
from __future__ import annotations

import json
import sqlite3
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path("/Users/chaudoanm3/ai-tutor-factory")
STATE = ROOT / "state"
OBS = STATE / "observations"
REGISTRY_DB = STATE / "int_registry.sqlite3"
RUNTIME_DB = STATE / "c2_runtime_int_factory_250.sqlite3"
ATTR = OBS / "OBS-002-attributions.jsonl"
V1 = OBS / "OBS-001-target-map.json"
OUT = OBS / "OBS-001-target-map-v2.json"

AUDIT_META_AXES = {"report", "source-truth-contract",
                   "ready-f-candidate-implementation-not-counted"}


def ro(path: Path) -> sqlite3.Connection:
    con = sqlite3.connect(f"file:{path}?mode=ro", uri=True, timeout=30)
    con.row_factory = sqlite3.Row
    con.execute("pragma busy_timeout=30000")
    return con


def canonical_owner(belongs_to: str | None) -> str:
    """Normalize an OBS-002 belongs_to string to a single canonical module.
    e.g. 'studyPath / lessonSequenceGenerator' -> 'studyPath';
         'aiTutorService (retry dedup)' -> 'aiTutorService'."""
    if not belongs_to:
        return "UNRESOLVED"
    head = belongs_to.split("/")[0].split("(")[0].strip()
    return head or "UNRESOLVED"


def load_axis_owner() -> dict[str, dict]:
    """Reuse OBS-002: axis -> {owner, confidence, source}."""
    axis_owner: dict[str, dict] = {}
    for line in ATTR.read_text().splitlines():
        if not line.strip():
            continue
        r = json.loads(line)
        if r.get("is_covered_anchor"):
            continue
        ax = r["axis"]
        if r["status"] == "attributed":
            axis_owner[ax] = {"owner": "promptAssembly", "owner_confidence": "high",
                              "resolution": "obs002-attributed-proven"}
        else:  # parked
            axis_owner[ax] = {"owner": canonical_owner(r.get("belongs_to")),
                              "owner_confidence": "medium",
                              "resolution": "obs002-parked-inferred"}
    return axis_owner


def main() -> None:
    axis_owner = load_axis_owner()

    with ro(REGISTRY_DB) as ir:
        verified = {r[0] for r in ir.execute(
            "select tm_int_id from int_registry where status='verified'")}
        rows = [dict(r) for r in ir.execute(
            "select tm_int_id, module, axis, normalized_boundary "
            "from int_registry where status='report_only'")]
    with ro(RUNTIME_DB) as rt:
        promoted = {r[0] for r in rt.execute(
            "select distinct tm_int_id from tm_int_coverage_promotions")}
    covered = verified | promoted

    behavioral = [r for r in rows
                  if r["tm_int_id"] not in covered and r["axis"] not in AUDIT_META_AXES]

    # v1 grouping (registry module) and v2 grouping (axis owner)
    v1_module = {}
    v2_owner = {}
    v2_conf = {}
    for r in behavioral:
        v1_module[r["tm_int_id"]] = r["module"]
        ao = axis_owner.get(r["axis"])
        if ao:
            v2_owner[r["tm_int_id"]] = ao["owner"]
            v2_conf[r["tm_int_id"]] = ao["owner_confidence"]
        else:
            v2_owner[r["tm_int_id"]] = "UNRESOLVED"
            v2_conf[r["tm_int_id"]] = "none"

    # per-owner aggregation for v2
    by_owner_ids = defaultdict(list)
    by_owner_axes = defaultdict(set)
    by_owner_probes = defaultdict(set)  # distinct normalized_boundary = distinct probes needed
    by_owner_conf = defaultdict(Counter)
    for r in behavioral:
        o = v2_owner[r["tm_int_id"]]
        by_owner_ids[o].append(r["tm_int_id"])
        by_owner_axes[o].add(r["axis"])
        by_owner_probes[o].add((r["axis"], r["normalized_boundary"]))
        by_owner_conf[o][v2_conf[r["tm_int_id"]]] += 1

    INSTRUMENTED = {"promptAssembly"}
    owners = []
    for o, ids in by_owner_ids.items():
        owners.append({
            "owner_module": o,
            "tm_int_id_count": len(ids),
            "axes_owned": sorted(by_owner_axes[o]),
            "distinct_probes_needed": len(by_owner_probes[o]),
            "owner_confidence": dict(by_owner_conf[o]),
            "instrumented_in_obs001": o in INSTRUMENTED,
        })
    owners.sort(key=lambda x: (-x["tm_int_id_count"], x["owner_module"]))

    # remaining gap list = owners NOT yet instrumented
    remaining = [o for o in owners if not o["instrumented_in_obs001"]]

    # ---- diff vs v1 (registry-module grouping) ----
    v1_counts = Counter(v1_module.values())
    v2_counts = Counter(v2_owner.values())
    moved = sum(1 for t in v1_module if v1_module[t] != v2_owner[t])
    all_modules = set(v1_counts) | set(v2_counts)
    module_delta = []
    for m in all_modules:
        d = v2_counts.get(m, 0) - v1_counts.get(m, 0)
        if d != 0 or v1_counts.get(m, 0):
            module_delta.append({"module": m, "v1": v1_counts.get(m, 0),
                                 "v2": v2_counts.get(m, 0), "delta": d})
    module_delta.sort(key=lambda x: (x["v2"] == 0, -abs(x["delta"]), x["module"]))

    total = len(behavioral)
    moved_pct = round(moved / total * 100, 1) if total else 0.0
    drift_large = moved_pct >= 10.0

    payload = {
        "mission": "C2-OBS-INT-PHASE2-001",
        "step": "OBS-001-v2",
        "artifact": "OBS-001-target-map-v2.json",
        "supersedes": "OBS-001-target-map.json (v1 grouped by registry module)",
        "method": (
            "Regroup the 1198 runtime-behavioral report_only IDs by AXIS OWNER. "
            "axis->owner reused from OBS-002 attribution output: attributed axes -> "
            "promptAssembly (proven, already instrumented); parked axes -> the "
            "belongs_to module OBS-002 named (inferred, to confirm on instrumentation)."
        ),
        "baseline": {
            "behavioral_ids_total": total,
            "distinct_axes": len(by_owner_axes and set().union(*by_owner_axes.values())),
            "v2_owner_modules": len(owners),
        },
        "v1_vs_v2_diff": {
            "ids_that_moved_owner": moved,
            "ids_moved_pct": moved_pct,
            "drift_large": drift_large,
            "verdict": (
                "LARGE — v2-based leasing is mandatory before more hooks"
                if drift_large else
                "SMALL (<10% moved) — v1 is close enough; proceed on v1"
            ),
            "per_module_delta": module_delta,
        },
        "v2_owner_gap_list": owners,
        "v2_remaining_gap_list_to_lease": remaining,
        "note_promptAssembly": (
            "promptAssembly is already instrumented (OBS-001). Under axis-ownership its "
            "true reach is far larger than v1's 61 — one hook made every axis it owns "
            "observable across all modules. Those IDs need per-behavior probes but no new "
            "module hook."
        ),
    }
    OUT.write_text(json.dumps(payload, indent=2) + "\n")

    print(f"behavioral={total} moved={moved} ({moved_pct}%) drift_large={drift_large}")
    print(f"wrote {OUT}")
    print("\nv2 owner gap list (top):")
    for o in owners[:15]:
        flag = " [instrumented]" if o["instrumented_in_obs001"] else ""
        print(f"  {o['tm_int_id_count']:4d}  {o['owner_module']:22s} "
              f"axes={len(o['axes_owned']):2d} probes={o['distinct_probes_needed']:3d}{flag}")
    print("\nremaining gap list to lease (excludes instrumented promptAssembly):")
    for o in remaining[:15]:
        print(f"  {o['tm_int_id_count']:4d}  {o['owner_module']:22s} "
              f"probes={o['distinct_probes_needed']}")


if __name__ == "__main__":
    main()
