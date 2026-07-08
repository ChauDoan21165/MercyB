#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const repo = process.cwd();
const packetRoot = path.join(repo, 'state', 'packets');
const report = path.join(repo, 'reports', 'FACTORY_PACKET_RUNTIME_OBSERVER_REPORT.md');

function shaFile(rel) {
  return crypto.createHash('sha256').update(fs.readFileSync(path.join(repo, rel))).digest('hex');
}
function exists(rel) {
  return fs.existsSync(path.join(repo, rel));
}
function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
}

const evidencePath = path.join(packetRoot, 'evidence', 'EV-TEACHER-MERCY-RUNTIME-READINESS-001.json');
const replayPath = path.join(packetRoot, 'replay', 'RP-TEACHER-MERCY-RUNTIME-READINESS-001.json');

const evidence = readJson(evidencePath);
const replay = readJson(replayPath);

const anchors = [
  'src/lib/tm-int/runtime/replay.ts',
  'src/lib/tm-int/runtimeReadiness/decisionTrace.ts',
  'src/lib/tm-int/runtimeReadiness/teacherContextValidator.ts',
  'src/lib/tm-int/runtimeReadiness/judgeRubric.ts',
  'src/lib/placement/v3/rr001RuntimeReplay.ts',
  'src/lib/placement/v3/runtimeIntegration.ts'
].filter(exists);

const observedSignals = [];
for (const rel of anchors) {
  const text = fs.readFileSync(path.join(repo, rel), 'utf8');
  if (/replay|Replay/.test(text)) observedSignals.push(`${rel}: replay anchor`);
  if (/TeacherContext|teacherContext/.test(text)) observedSignals.push(`${rel}: teacher context anchor`);
  if (/decision|Decision/.test(text)) observedSignals.push(`${rel}: decision trace anchor`);
  if (/runtime|Runtime/.test(text)) observedSignals.push(`${rel}: runtime anchor`);
}

const pass = anchors.length >= 3 &&
  observedSignals.some(x => x.includes('replay anchor')) &&
  observedSignals.some(x => x.includes('teacher context anchor') || x.includes('decision trace anchor')) &&
  observedSignals.some(x => x.includes('runtime anchor'));

const hashes = {};
for (const rel of anchors) hashes[rel] = shaFile(rel);

evidence.files = anchors;
evidence.hashes = hashes;
evidence.runtime_notes = [
  'runtime observer v1 inspected product runtime anchors',
  ...observedSignals,
  'this is source-level runtime observation, not a live learner session'
];
evidence.status = pass ? 'runtime_observed' : 'candidate';
evidence.observer = 'factory-packet-runtime-observer-v1';
evidence.observed_at = new Date().toISOString();
writeJson(evidencePath, evidence);

const replayRel = anchors.find(x => /replay/i.test(x)) || '';
if (replayRel) {
  replay.replay_file = replayRel;
  replay.input_hash = hashes[replayRel] || '';
  replay.output_hash = crypto.createHash('sha256').update(JSON.stringify({replay_file: replayRel, anchors, observedSignals})).digest('hex');
  replay.status = pass ? 'observed_replay_source_anchor' : 'candidate_replay_file_found';
  replay.observer = 'factory-packet-runtime-observer-v1';
  replay.observed_at = new Date().toISOString();
  writeJson(replayPath, replay);
}

const out = `# Factory Packet Runtime Observer v1

Generated: ${new Date().toISOString()}
Repo: ${repo}

## Verdict

${pass ? 'OBSERVED_SOURCE_LEVEL_RUNTIME' : 'STILL_CANDIDATE'}

## Runtime Anchors

${anchors.map(x => `- ${x}`).join('\n') || '- None'}

## Observed Signals

${observedSignals.map(x => `- ${x}`).join('\n') || '- None'}

## Packet Updates

- evidence.status: ${evidence.status}
- replay.status: ${replay.status}
- replay.input_hash: ${replay.input_hash ? 'set' : 'missing'}
- replay.output_hash: ${replay.output_hash ? 'set' : 'missing'}

## Truth

This proves source-level runtime/replay anchors exist.
It does not prove live learner execution.
Independent Judge must still decide whether this is enough for the scoped packet.
`;

fs.writeFileSync(report, out);
console.log(out);
