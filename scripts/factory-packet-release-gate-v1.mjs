#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const repo = process.cwd();
const packetRoot = path.join(repo, 'state', 'packets');
const releaseDir = path.join(packetRoot, 'release');
const report = path.join(repo, 'reports', 'FACTORY_PACKET_RELEASE_GATE_REPORT.md');

function ensure(p){ fs.mkdirSync(p,{recursive:true}); }
function read(p){ return fs.existsSync(p) ? fs.readFileSync(p,'utf8') : ''; }
function readJson(p){ return JSON.parse(fs.readFileSync(p,'utf8')); }
function writeJson(p,o){ fs.writeFileSync(p, JSON.stringify(o,null,2)+'\n'); }
function sha(s){ return crypto.createHash('sha256').update(s).digest('hex'); }

ensure(releaseDir);

const vf = readJson(path.join(packetRoot,'verification','VF-TEACHER-MERCY-RUNTIME-READINESS-001.json'));
const ev = readJson(path.join(packetRoot,'evidence','EV-TEACHER-MERCY-RUNTIME-READINESS-001.json'));
const rp = readJson(path.join(packetRoot,'replay','RP-TEACHER-MERCY-RUNTIME-READINESS-001.json'));

const judgeReport = read(path.join(repo,'reports','FACTORY_PACKET_JUDGE_REPORT.md'));
const inspectReport = read(path.join(repo,'reports','FACTORY_PACKET_RUNTIME_ARTIFACT_INSPECTION_REPORT.md'));

const runtimeTestVerified =
  vf.status === 'pass' &&
  ev.status === 'runtime_artifact_observed' &&
  rp.status === 'runtime_replay_artifact_observed' &&
  /## Verdict\s+PASS/s.test(judgeReport) &&
  /## Verdict\s+INSPECT_PASS/s.test(inspectReport);

const productionVerified = false;

const blockers = [];
if (!runtimeTestVerified) blockers.push('runtime_test_verified is false');
if (!productionVerified) blockers.push('production_verified is false: no live learner/production replay evidence');

const packet = {
  id: 'REL-GATE-TEACHER-MERCY-RUNTIME-READINESS-001',
  capability_id: 'CAP-TEACHER-MERCY-RUNTIME-READINESS-001',
  status: runtimeTestVerified ? 'runtime_test_verified' : 'blocked',
  runtime_test_verified: runtimeTestVerified,
  production_verified: productionVerified,
  release_ready: runtimeTestVerified && productionVerified,
  evidence_packet: 'EV-TEACHER-MERCY-RUNTIME-READINESS-001',
  replay_packet: 'RP-TEACHER-MERCY-RUNTIME-READINESS-001',
  verification_packet: 'VF-TEACHER-MERCY-RUNTIME-READINESS-001',
  judge_report_hash: sha(judgeReport),
  inspection_report_hash: sha(inspectReport),
  blockers,
  created_at: new Date().toISOString()
};

writeJson(path.join(releaseDir, `${packet.id}.json`), packet);

const out = `# Factory Packet Release Gate v1

Generated: ${packet.created_at}
Repo: ${repo}

## Capability

${packet.capability_id}

## Gate Status

- packet_status: ${packet.status}
- runtime_test_verified: ${packet.runtime_test_verified}
- production_verified: ${packet.production_verified}
- release_ready: ${packet.release_ready}

## Blockers

${blockers.length ? blockers.map(x=>`- ${x}`).join('\n') : '- None'}

## Truth

This gate allows Admin to count runtime-test packet verification.
It does not allow Admin to count production verification or full release readiness yet.
`;

fs.writeFileSync(report, out);
console.log(out);
