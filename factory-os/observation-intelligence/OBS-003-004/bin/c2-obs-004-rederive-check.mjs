import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
const digest = (v) => "sha256:" + createHash("sha256").update(typeof v==="string"?v:JSON.stringify(v ?? null),"utf8").digest("hex");
const DIR = "/Users/chaudoanm3/ai-tutor-factory/state/observations/OBS-004-evidence-packets";
let pass=0, fail=0; const fails=[];
for (const f of readdirSync(DIR).filter(x=>x.startsWith("OBS-004-TM-INT")&&x.endsWith(".json"))) {
  const p = JSON.parse(readFileSync(`${DIR}/${f}`,"utf8"));
  // independent: re-hash the packet's own recorded output, compare to stored output_digest
  const rederived = digest(p.output);
  const ok = rederived === p.output_digest && p.output_digest === p.replay_proof.recorded_output_digest;
  if (ok) pass++; else { fail++; fails.push({f, stored:p.output_digest, rederived}); }
}
console.log(JSON.stringify({packets:pass+fail, rederive_pass:pass, rederive_fail:fail, fails}, null, 2));
