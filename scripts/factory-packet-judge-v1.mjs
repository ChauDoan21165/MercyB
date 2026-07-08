#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const repo = process.cwd();
const packetRoot = path.join(repo, 'state', 'packets');
const reportPath = path.join(repo, 'reports', 'FACTORY_PACKET_JUDGE_REPORT.md');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
}

function exists(rel) {
  return rel && fs.existsSync(path.join(repo, rel));
}

const verificationPath = path.join(packetRoot, 'verification', 'VF-TEACHER-MERCY-RUNTIME-READINESS-001.json');
const evidencePath = path.join(packetRoot, 'evidence', 'EV-TEACHER-MERCY-RUNTIME-READINESS-001.json');
const replayPath = path.join(packetRoot, 'replay', 'RP-TEACHER-MERCY-RUNTIME-READINESS-001.json');

const failures = [];

if (!fs.existsSync(verificationPath)) failures.push('missing verification packet');
if (!fs.existsSync(evidencePath)) failures.push('missing evidence packet');
if (!fs.existsSync(replayPath)) failures.push('missing replay packet');

let verification = fs.existsSync(verificationPath) ? readJson(verificationPath) : {};
let evidence = fs.existsSync(evidencePath) ? readJson(evidencePath) : {};
let replay = fs.existsSync(replayPath) ? readJson(replayPath) : {};

for (const f of evidence.files || []) {
  if (!exists(f)) failures.push(`evidence source missing: ${f}`);
}

if (!replay.replay_file) failures.push('replay_file is empty');
else if (!exists(replay.replay_file)) failures.push(`replay file missing: ${replay.replay_file}`);

if (!replay.input_hash) failures.push('replay input_hash missing');
if (!replay.output_hash) failures.push('replay output_hash missing');

if (evidence.status !== 'runtime_observed') {
  failures.push(`evidence status is ${evidence.status}; expected runtime_observed`);
}

if (!String(replay.status || '').includes('observed')) {
  failures.push(`replay status is ${replay.status}; expected observed replay`);
}

const passed = failures.length === 0;

verification.status = passed ? 'pass' : 'blocked';
verification.evidence_checked = passed;
verification.anti_fake_checked = passed;
verification.judge = 'factory-packet-judge-v1';
verification.judged_at = new Date().toISOString();
verification.failures = failures;

writeJson(verificationPath, verification);

const report = `# Factory Packet Judge v1

Generated: ${new Date().toISOString()}
Repo: ${repo}

## Verdict

${passed ? 'PASS' : 'BLOCKED'}

## Failures

${failures.length ? failures.map(x => `- ${x}`).join('\n') : '- None'}

## Rule

This Judge does not create product truth.
It only validates packet truth.
Capability remains unverified unless verdict is PASS.
`;

fs.writeFileSync(reportPath, report);
console.log(report);
