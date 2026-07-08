#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const repo = process.cwd();
const packetRoot = path.join(repo, 'state', 'packets');
const outDir = path.join(packetRoot, 'workpack');
const report = path.join(repo, 'reports', 'FACTORY_PACKET_GAP_WP_REPORT.md');

function readJson(p){ return JSON.parse(fs.readFileSync(p,'utf8')); }
function writeJson(p,o){ fs.writeFileSync(p, JSON.stringify(o,null,2)+'\n'); }

const vf = readJson(path.join(packetRoot,'verification','VF-TEACHER-MERCY-RUNTIME-READINESS-001.json'));
const failures = vf.failures || [];

const created = [];

function makeWp(id, objective, tests, checks) {
  const wp = {
    id,
    capability_id: 'CAP-TEACHER-MERCY-RUNTIME-READINESS-001',
    objective,
    files_allowed: ['src/**','api/**','core/**','scripts/**','tests/**','reports/**','state/packets/**'],
    acceptance_tests: tests,
    anti_fake_checks: checks,
    status: 'ready',
    source_gap: failures,
    created_at: new Date().toISOString()
  };
  writeJson(path.join(outDir, `${id}.json`), wp);
  created.push(id);
}

if (failures.some(f => f.includes('input_hash') || f.includes('output_hash'))) {
  makeWp(
    'WP-PACKET-RUNTIME-REPLAY-HASH-001',
    'Produce real replay input/output hashes for Teacher Mercy Runtime Readiness without claiming verification.',
    ['node scripts/factory-packet-judge-v1.mjs'],
    ['Replay hash must come from real replay artifact', 'No manual fake hash strings', 'Judge must remain blocked unless runtime_observed is true']
  );
}

if (failures.some(f => f.includes('evidence status'))) {
  makeWp(
    'WP-PACKET-RUNTIME-OBSERVED-EVIDENCE-001',
    'Generate runtime_observed evidence packet from a real or production-like Teacher Mercy runtime execution.',
    ['node scripts/factory-packet-judge-v1.mjs'],
    ['Evidence must reference product runtime file', 'Evidence must not come from docs/.claude/worktrees', 'Worker must not set verification pass']
  );
}

if (failures.some(f => f.includes('replay status'))) {
  makeWp(
    'WP-PACKET-OBSERVED-REPLAY-001',
    'Connect Teacher Mercy runtime replay artifact to replay packet and mark replay status observed only when replay exists.',
    ['node scripts/factory-packet-judge-v1.mjs'],
    ['Replay file must exist', 'Replay must be product/runtime related', 'Judge owns pass/fail']
  );
}

const body = `# Factory Packet Gap to Workpack v1

Generated: ${new Date().toISOString()}

## Judge Failures Converted

${failures.length ? failures.map(f=>`- ${f}`).join('\n') : '- None'}

## Workpacks Created

${created.length ? created.map(x=>`- ${x}`).join('\n') : '- None'}

## Truth

These are workpack packets only.
They do not verify the capability.
`;

fs.writeFileSync(report, body);
console.log(body);
