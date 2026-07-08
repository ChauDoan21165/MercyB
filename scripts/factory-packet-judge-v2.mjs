#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const repo = process.cwd();
const packetRoot = path.join(repo, 'state', 'packets');
const reportPath = path.join(repo, 'reports', 'FACTORY_PACKET_JUDGE_REPORT.md');

function readJson(p){ return JSON.parse(fs.readFileSync(p,'utf8')); }
function writeJson(p,o){ fs.writeFileSync(p, JSON.stringify(o,null,2)+'\n'); }
function existsRel(rel){ return rel && fs.existsSync(path.join(repo, rel)); }

const vfPath = path.join(packetRoot,'verification','VF-TEACHER-MERCY-RUNTIME-READINESS-001.json');
const evPath = path.join(packetRoot,'evidence','EV-TEACHER-MERCY-RUNTIME-READINESS-001.json');
const rpPath = path.join(packetRoot,'replay','RP-TEACHER-MERCY-RUNTIME-READINESS-001.json');

const failures = [];
const vf = readJson(vfPath);
const ev = readJson(evPath);
const rp = readJson(rpPath);

if (ev.status === 'runtime_observed' && ev.observer === 'factory-packet-runtime-observer-v1') {
  failures.push('runtime_observed was set by source-level observer v1; must be downgraded');
  ev.status = 'source_observed';
}

if (String(rp.status || '').includes('observed') && rp.observer === 'factory-packet-runtime-observer-v1') {
  failures.push('observed replay was set by source-level observer v1; must be downgraded');
  rp.status = 'source_replay_anchor_observed';
}

const runtimeArtifact = ev.runtime_artifact || '';
const replayArtifact = rp.runtime_replay_artifact || '';

if (!runtimeArtifact) failures.push('missing runtime_artifact from real runtime execution');
else if (!existsRel(runtimeArtifact)) failures.push(`runtime_artifact missing on disk: ${runtimeArtifact}`);

if (!replayArtifact) failures.push('missing runtime_replay_artifact from real replay execution');
else if (!existsRel(replayArtifact)) failures.push(`runtime_replay_artifact missing on disk: ${replayArtifact}`);

if (ev.status !== 'runtime_artifact_observed') {
  failures.push(`evidence status is ${ev.status}; expected runtime_artifact_observed`);
}

if (rp.status !== 'runtime_replay_artifact_observed') {
  failures.push(`replay status is ${rp.status}; expected runtime_replay_artifact_observed`);
}

if (!rp.input_hash) failures.push('replay input_hash missing');
if (!rp.output_hash) failures.push('replay output_hash missing');

const pass = failures.length === 0;

vf.status = pass ? 'pass' : 'blocked';
vf.evidence_checked = pass;
vf.anti_fake_checked = pass;
vf.judge = 'factory-packet-judge-v2-runtime-artifact-required';
vf.judged_at = new Date().toISOString();
vf.failures = failures;

writeJson(evPath, ev);
writeJson(rpPath, rp);
writeJson(vfPath, vf);

const out = `# Factory Packet Judge v2

Generated: ${new Date().toISOString()}
Repo: ${repo}

## Verdict

${pass ? 'PASS' : 'BLOCKED'}

## Failures

${failures.length ? failures.map(x=>`- ${x}`).join('\n') : '- None'}

## Packet Status

- evidence.status: ${ev.status}
- replay.status: ${rp.status}
- verification.status: ${vf.status}

## Anti-Fake Rule

Source-level anchors are useful for mapping.
They are not runtime truth.
Judge v2 requires real runtime_artifact and runtime_replay_artifact before PASS.
`;

fs.writeFileSync(reportPath, out);
console.log(out);
