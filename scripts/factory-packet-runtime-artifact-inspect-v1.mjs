#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const repo = process.cwd();
const artifact = path.join(repo, 'reports/runtime-artifacts/teacher-mercy-runtime-readiness/runtime-artifact-001.json');
const replay = path.join(repo, 'reports/runtime-artifacts/teacher-mercy-runtime-readiness/runtime-replay-artifact-001.json');
const report = path.join(repo, 'reports/FACTORY_PACKET_RUNTIME_ARTIFACT_INSPECTION_REPORT.md');

function read(p){ return JSON.parse(fs.readFileSync(p,'utf8')); }

const a = read(artifact);
const r = read(replay);

const stdout = a.stdout_excerpt || '';
const stderr = a.stderr_excerpt || '';
const combined = `${stdout}\n${stderr}`;

const signals = [];
if (/PASS|passed|Test Files|Tests/i.test(combined)) signals.push('test summary signal found');
if (/runtime|replay|Teacher|Mercy|tm-int|placement/i.test(combined)) signals.push('runtime domain signal found');
if (a.exit_code === 0) signals.push('command exit 0');
if ((a.runtime_sources || []).length) signals.push('runtime sources present');
if ((r.replay_sources || []).length) signals.push('replay sources present');

const warnings = [];
if (!/Test Files|Tests|passed|PASS/i.test(combined)) warnings.push('no clear test-count summary in captured excerpt');
if (!stdout && !stderr) warnings.push('stdout/stderr excerpt empty');
if (a.exit_code !== 0) warnings.push(`command exit code ${a.exit_code}`);
if (!(r.input_hash && r.output_hash)) warnings.push('replay hashes missing');

const verdict = warnings.length ? 'INSPECT_WARN' : 'INSPECT_PASS';

const out = `# Runtime Artifact Inspection v1

Generated: ${new Date().toISOString()}
Repo: ${repo}

## Verdict

${verdict}

## Runtime Command

\`${a.command}\`

## Exit Code

${a.exit_code}

## Runtime Sources

${(a.runtime_sources || []).map(x=>`- ${x}`).join('\n') || '- None'}

## Replay Sources

${(r.replay_sources || []).map(x=>`- ${x}`).join('\n') || '- None'}

## Signals

${signals.map(x=>`- ${x}`).join('\n') || '- None'}

## Warnings

${warnings.map(x=>`- ${x}`).join('\n') || '- None'}

## Stdout Excerpt

\`\`\`
${stdout.slice(0,2500)}
\`\`\`

## Stderr Excerpt

\`\`\`
${stderr.slice(0,2500)}
\`\`\`

## Truth

This inspects the captured runtime artifact.
It does not replace Judge v2.
`;

fs.writeFileSync(report, out);
console.log(out);
