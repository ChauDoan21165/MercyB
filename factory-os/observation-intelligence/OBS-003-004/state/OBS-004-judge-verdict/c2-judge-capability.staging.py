#!/usr/bin/env python3
import os, sys, json, sqlite3, datetime
ROOT="/private/tmp/claude-501/-Users-chaudoanm3-MercyB/6bf4b675-fee7-4eef-b54b-c8643a40d583/scratchpad/staging-judge"
DB=f"{ROOT}/state/c2_execution.sqlite3"
CAP=f"{ROOT}/roadmap/capabilities"
if len(sys.argv)<3:
    raise SystemExit("usage: c2-judge-capability.py CAPABILITY_ID JUDGE_ID")
cap, judge=sys.argv[1], sys.argv[2]
contract_path=f"{CAP}/{cap}.json"
if not os.path.exists(contract_path):
    raise SystemExit("missing canonical contract")
contract=json.load(open(contract_path))
required=set(contract.get("required_evidence",[]))
c=sqlite3.connect(DB)
rows=c.execute("select id,evidence_type,verdict from evidence_ledger where capability_id=?", (cap,)).fetchall()
passed={r[1] for r in rows if str(r[2]).lower()=="pass"}
missing=sorted(required-passed)
if missing:
    c.execute("""INSERT INTO worker_log(capability_id,worker_id,role,action,at,detail)
    VALUES(?,?,?,?,?,?)""",(cap,judge,"judge","blocked",datetime.datetime.now().isoformat(),"missing evidence: "+",".join(missing)))
    c.commit()
    raise SystemExit("BLOCKED missing evidence: "+",".join(missing))
ids=[str(r[0]) for r in rows if str(r[2]).lower()=="pass"]
c.execute("""INSERT INTO completions(capability_id,completed_at,judge_id,evidence_ids,decision_note)
VALUES(?,?,?,?,?)
ON CONFLICT(capability_id) DO UPDATE SET completed_at=excluded.completed_at,judge_id=excluded.judge_id,
evidence_ids=excluded.evidence_ids,decision_note=excluded.decision_note""",
(cap,datetime.datetime.now().isoformat(),judge,json.dumps(ids),"all required evidence passed"))
c.commit()
print("JUDGE_ACCEPTED", cap)
