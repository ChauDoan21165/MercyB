#!/usr/bin/env python3
"""
OBS-006 forgery suite — proves the OBS-005 evidence gate is NON-VACUOUS every cycle.

Builds a self-contained sandbox (throwaway registry copy + obs001 + attributions +
packets dir, all under a temp workdir) with exactly one report_only ID, then:

  * CONTROL  — a byte-consistent good packet  -> gate must FLIP   (harness can pass)
  * CASE 1 tampered        — packet.output mutated so its digest no longer
                              re-derives                          -> gate must REFUSE
  * CASE 2 broken-replay   — replay_proof.checks.output_digest_match=false
                                                                   -> gate must REFUSE
  * CASE 3 wrong-axis      — packet.axis != registry.axis         -> gate must REFUSE
  * CASE 4 behavior-differs— the OBS-001 recorded digest differs from the packet's
                              (real function output drifted)       -> gate must REFUSE

The suite RE-USES the real gate (c2-obs-005-verify-from-obs.py) and the real digest
helper unmodified, so a green result means the deployed gate — not a mock — refuses
forgery. It writes NOTHING outside its temp workdir and never touches a real registry.

Exit 0 + {"all_refused": true, "control_flips": true} == gate healthy this cycle.
"""
import argparse
import json
import os
import shutil
import sqlite3
import subprocess
import sys
import tempfile
from pathlib import Path

FORGE_ID = "TM-INT-FORGERY-PROBE-001"
NOW = "2026-07-07T00:00:00.000Z"


def node_digest_of_output(helper: Path, output) -> str:
    """Byte-exact digest of a packet's `output`, via the real OBS-005 node helper."""
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        json.dump({"output": output}, f)
        tmp = f.name
    try:
        r = subprocess.run(["node", str(helper), tmp],
                           stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=60)
        if r.returncode != 0:
            raise RuntimeError(f"digest helper failed: {r.stderr.strip()}")
        return r.stdout.strip()
    finally:
        os.unlink(tmp)


def build_sandbox_registry(db_path: Path):
    con = sqlite3.connect(db_path)
    con.executescript(
        """
        CREATE TABLE int_registry (
          tm_int_id TEXT PRIMARY KEY,
          module TEXT NOT NULL,
          axis TEXT NOT NULL,
          status TEXT NOT NULL,
          verified_evidence_ref TEXT,
          updated_at TEXT
        );
        CREATE TABLE int_registry_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tm_int_id TEXT, event_type TEXT, payload_json TEXT, created_at TEXT
        );
        """
    )
    con.execute(
        "INSERT INTO int_registry (tm_int_id, module, axis, status) VALUES (?,?,?,?)",
        (FORGE_ID, "forgeModule", "forge-axis", "report_only"),
    )
    con.commit()
    con.close()


def good_packet(output_digest: str, output) -> dict:
    return {
        "schema": "tm-int-obs-evidence-packet-v1",
        "packet_id": f"OBS-004-{FORGE_ID}",
        "tm_int_id": FORGE_ID,
        "module": "forgeModule",
        "axis": "forge-axis",
        "code_path": "src/forge/probe.ts:forgeProbe",
        "input": ["forge-input"],
        "output": output,
        "output_digest": output_digest,
        "replay_proof": {
            "recorded_output_digest": output_digest,
            "checks": {
                "code_path_match": True,
                "input_digest_match": True,
                "output_digest_match": True,
            },
        },
        "run_ids": {"obs001": "forge-001", "obs002": "forge-002",
                    "obs003": "forge-003", "obs004": "forge-004"},
    }


def run_gate(gate: Path, db: Path, packets_dir: Path, obs001: Path, attributions: Path) -> dict:
    r = subprocess.run(
        ["python3", str(gate), "--db", str(db), "--packets-dir", str(packets_dir),
         "--obs001", str(obs001), "--ids-from", str(attributions)],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=120,
    )
    if r.returncode != 0:
        raise RuntimeError(f"gate exited {r.returncode}: {r.stderr.strip()}")
    return json.loads(r.stdout)


def scenario(name, gate, helper, workdir, base_registry, obs001_digest, mutate):
    """Set up one scenario, run the gate, return its summary dict."""
    d = workdir / name
    d.mkdir(parents=True, exist_ok=True)
    db = d / "registry.copy.sqlite3"
    shutil.copy(base_registry, db)
    packets_dir = d / "packets"
    packets_dir.mkdir(exist_ok=True)

    output = {"forge": True, "n": 1}
    good_digest = node_digest_of_output(helper, output)
    packet = good_packet(good_digest, output)
    rec_digest = obs001_digest if obs001_digest is not None else good_digest

    # mutate() may edit the packet dict and/or return an override recorded digest.
    override = mutate(packet)
    if override is not None:
        rec_digest = override

    (packets_dir / f"OBS-004-{FORGE_ID}.json").write_text(json.dumps(packet))

    obs001 = d / "obs001.jsonl"
    obs001.write_text(json.dumps({"tm_int_id": FORGE_ID, "output_digest": rec_digest}) + "\n")

    attributions = d / "attributions.jsonl"
    attributions.write_text(json.dumps(
        {"tm_int_id": FORGE_ID, "status": "attributed", "confidence": "high"}) + "\n")

    summary = run_gate(gate, db, packets_dir, obs001, attributions)
    refused = summary["flip_count"] == 0 and summary["refuse_count"] == 1
    flipped = summary["flip_count"] == 1 and summary["refuse_count"] == 0
    reason = (summary["refused"][0]["reason"] if summary["refused"] else None)
    return {"name": name, "flip_count": summary["flip_count"],
            "refuse_count": summary["refuse_count"], "reason": reason,
            "refused": refused, "flipped": flipped}


def main():
    ap = argparse.ArgumentParser(description="OBS-006 forgery suite (gate non-vacuity)")
    ap.add_argument("--gate", required=True, help="c2-obs-005-verify-from-obs.py")
    ap.add_argument("--digest-helper", required=True, help="c2-obs-005-digest.mjs")
    ap.add_argument("--workdir", required=True, help="throwaway workdir (all writes here)")
    ap.add_argument("--json-out", help="write full result JSON here")
    args = ap.parse_args()

    gate = Path(args.gate).resolve()
    helper = Path(args.digest_helper).resolve()
    workdir = Path(args.workdir).resolve()
    if workdir.exists():
        shutil.rmtree(workdir)
    workdir.mkdir(parents=True)

    base_registry = workdir / "base.sqlite3"
    build_sandbox_registry(base_registry)

    # Good output digest for the honest recorded value used by CONTROL / cases 1-3.
    honest_digest = node_digest_of_output(helper, {"forge": True, "n": 1})

    results = []
    # CONTROL: everything consistent -> FLIP.
    results.append(scenario("control", gate, helper, workdir, base_registry, honest_digest,
                            lambda p: None))
    # CASE 1 tampered: mutate output AFTER its digest was fixed -> re-derive mismatch.
    def tamper(p):
        p["output"] = {"forge": True, "n": 999}   # output_digest now stale
        return None
    results.append(scenario("tampered", gate, helper, workdir, base_registry, honest_digest, tamper))
    # CASE 2 broken-replay: flip a replay check to false.
    def broken(p):
        p["replay_proof"]["checks"]["output_digest_match"] = False
        return None
    results.append(scenario("broken_replay", gate, helper, workdir, base_registry, honest_digest, broken))
    # CASE 3 wrong-axis: packet axis diverges from registry axis.
    def wrong_axis(p):
        p["axis"] = "some-other-axis"
        return None
    results.append(scenario("wrong_axis", gate, helper, workdir, base_registry, honest_digest, wrong_axis))
    # CASE 4 behavior-differs: OBS-001 recorded digest != packet (real output drifted).
    def behavior_differs(p):
        return "sha256:" + "d" * 64   # obs001 recorded value no longer matches the packet
    results.append(scenario("behavior_differs", gate, helper, workdir, base_registry, honest_digest, behavior_differs))

    control = next(r for r in results if r["name"] == "control")
    forgeries = [r for r in results if r["name"] != "control"]
    all_refused = all(r["refused"] for r in forgeries)
    control_flips = control["flipped"]
    ok = all_refused and control_flips

    out = {
        "suite": "OBS-006-forgery-suite",
        "gate": str(gate),
        "control_flips": control_flips,
        "all_refused": all_refused,
        "healthy": ok,
        "cases": results,
    }
    if args.json_out:
        Path(args.json_out).write_text(json.dumps(out, indent=2))
    print(json.dumps(out, indent=2))
    # Clean the sandbox (never leaves state behind).
    shutil.rmtree(workdir, ignore_errors=True)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
