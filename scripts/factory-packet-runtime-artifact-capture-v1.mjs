#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { spawnSync } from 'child_process';

const repo = process.cwd();
const packetRoot = path.join(repo, 'state', 'packets');
const artifactDir = path.join(repo, 'reports', 'runtime-artifacts', 'teacher-mercy-runtime-readiness');
const reportPath = path.join(repo, 'reports', 'FACTORY_PACKET_RUNTIME_ARTIFACT_CAPTURE_REPORT.md');

function ensureDir(p){ fs.mkdirSync(p,{recursive:true}); }
function sha(s){ return crypto.createHash('sha256').update(s).digest('hex'); }
function readJson(p){ return JSON.parse(fs.readFileSync(p,'utf8')); }
function writeJson(p,o){ fs.writeFileSync(p, JSON.stringify(o,null,2)+'\n'); }
function rel(p){ return path.relative(repo,p); }

ensureDir(artifactDir);

const candidates = [
  'src/lib/tm-int/runtimeReadiness/teacherContextValidator.ts',
  'src/lib/tm-int/runtimeReadiness/decisionTrace.ts',
  'src/lib/tm-int/runtime/replay.ts',
  'src/lib/placement/v3/rr001RuntimeReplay.ts',
  'src/lib/placement/v3/runtimeIntegration.ts'
].filter(f => fs.existsSync(path.join(repo,f)));

const testCandidates = [
  'src/lib/tm-int/**/*.test.ts',
  'src/components/teacher-mercy/__tests__/TeacherMercyLearningShell.test.tsx',
  'src/lib/placement/v3/**/*.test.ts',
  'src/__tests__/mercy-integration.test.ts'
];

const command = ['npx','vitest','run',...testCandidates,'--reporter=json'];
const startedAt = new Date().toISOString();
const run = spawnSync(command[0], command.slice(1), {
  cwd: repo,
  encoding: 'utf8',
  timeout: 180000,
  maxBuffer: 20 * 1024 * 1024
});
const finishedAt = new Date().toISOString();

const stdout = run.stdout || '';
const stderr = run.stderr || '';
const exitCode = run.status ?? 999;

const artifact = {
  id: 'RUNTIME-ARTIFACT-TEACHER-MERCY-RUNTIME-READINESS-001',
  created_at: finishedAt,
  command: command.join(' '),
  exit_code: exitCode,
  started_at: startedAt,
  finished_at: finishedAt,
  runtime_sources: candidates,
  stdout_hash: sha(stdout),
  stderr_hash: sha(stderr),
  stdout_excerpt: stdout.slice(0, 6000),
  stderr_excerpt: stderr.slice(0, 6000),
  verdict: exitCode === 0 ? 'runtime_command_passed' : 'runtime_command_failed'
};

const runtimeArtifactPath = path.join(artifactDir, 'runtime-artifact-001.json');
const replayArtifactPath = path.join(artifactDir, 'runtime-replay-artifact-001.json');

writeJson(runtimeArtifactPath, artifact);

const replayArtifact = {
  id: 'RUNTIME-REPLAY-ARTIFACT-TEACHER-MERCY-RUNTIME-READINESS-001',
  created_at: finishedAt,
  source_runtime_artifact: rel(runtimeArtifactPath),
  replay_sources: candidates.filter(x => /replay/i.test(x)),
  input_hash: sha(JSON.stringify({command, candidates, startedAt})),
  output_hash: sha(JSON.stringify({exitCode, stdout_hash: artifact.stdout_hash, stderr_hash: artifact.stderr_hash})),
  verdict: exitCode === 0 ? 'runtime_replay_command_passed' : 'runtime_replay_command_failed'
};

writeJson(replayArtifactPath, replayArtifact);

const evPath = path.join(packetRoot,'evidence','EV-TEACHER-MERCY-RUNTIME-READINESS-001.json');
const rpPath = path.join(packetRoot,'replay','RP-TEACHER-MERCY-RUNTIME-READINESS-001.json');

const ev = readJson(evPath);
const rp = readJson(rpPath);

ev.runtime_artifact = rel(runtimeArtifactPath);
ev.status = exitCode === 0 ? 'runtime_artifact_observed' : 'runtime_artifact_failed';
ev.runtime_notes = [
  ...(ev.runtime_notes || []),
  `runtime artifact capture v1 command: ${command.join(' ')}`,
  `runtime artifact exit code: ${exitCode}`
];
ev.artifact_hash = sha(JSON.stringify(artifact));
ev.observer = 'factory-packet-runtime-artifact-capture-v1';
ev.observed_at = finishedAt;

rp.runtime_replay_artifact = rel(replayArtifactPath);
rp.input_hash = replayArtifact.input_hash;
rp.output_hash = replayArtifact.output_hash;
rp.status = exitCode === 0 ? 'runtime_replay_artifact_observed' : 'runtime_replay_artifact_failed';
rp.observer = 'factory-packet-runtime-artifact-capture-v1';
rp.observed_at = finishedAt;

writeJson(evPath, ev);
writeJson(rpPath, rp);

const out = `# Factory Packet Runtime Artifact Capture v1

Generated: ${finishedAt}
Repo: ${repo}

## Command

\`${command.join(' ')}\`

## Exit Code

${exitCode}

## Runtime Artifact

- ${rel(runtimeArtifactPath)}

## Replay Artifact

- ${rel(replayArtifactPath)}

## Runtime Sources

${candidates.map(x=>`- ${x}`).join('\n') || '- None'}

## Packet Updates

- evidence.status: ${ev.status}
- replay.status: ${rp.status}
- replay.input_hash: ${rp.input_hash ? 'set' : 'missing'}
- replay.output_hash: ${rp.output_hash ? 'set' : 'missing'}

## Truth

This captures a deterministic runtime test command artifact.
Judge v2 must still decide pass/block.
`;

fs.writeFileSync(reportPath, out);
console.log(out);
