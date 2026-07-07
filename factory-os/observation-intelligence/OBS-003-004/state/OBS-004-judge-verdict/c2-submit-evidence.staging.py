#!/usr/bin/env python3
import os, sys, json, sqlite3, hashlib, datetime
ROOT="/private/tmp/claude-501/-Users-chaudoanm3-MercyB/6bf4b675-fee7-4eef-b54b-c8643a40d583/scratchpad/staging-judge"
DB=f"{ROOT}/state/c2_execution.sqlite3"
if len(sys.argv)!=3:
    raise SystemExit("usage: c2-submit-evidence.py CAPABILITY_ID evidence/<capability-id>/manifest.json")
cap, manifest_path=sys.argv[1], sys.argv[2]
if "/mnt/data" in manifest_path:
    raise SystemExit("REFUSE sandbox path")
m=json.load(open(manifest_path))
if m.get("capability_id") != cap:
    raise SystemExit("manifest capability_id mismatch")
evidence=m.get("evidence",[])
if not evidence:
    raise SystemExit("manifest has no evidence")
c=sqlite3.connect(DB)
for item in evidence:
    et=item["type"]; path=item["path"]; verdict=item.get("verdict","")
    full=os.path.join(os.path.dirname(manifest_path), path)
    if "/mnt/data" in full: raise SystemExit("REFUSE sandbox path")
    if not os.path.exists(full): raise SystemExit(f"missing artifact: {full}")
    sha=hashlib.sha256(open(full,"rb").read()).hexdigest()
    c.execute("""INSERT INTO evidence_ledger(capability_id,evidence_type,artifact_path,artifact_sha,verdict,recorded_at)
    VALUES(?,?,?,?,?,?)""",(cap,et,full,sha,verdict,datetime.datetime.now().isoformat()))
c.commit()
print("evidence_submitted", cap, len(evidence))
