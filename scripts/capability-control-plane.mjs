#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const repo = process.argv.includes('--repo')
  ? process.argv[process.argv.indexOf('--repo') + 1]
  : process.cwd();

const reportPath = path.join(repo, 'reports', 'CAPABILITY_CONTROL_REPORT.md');

const interesting = [
  'Teacher', 'Tutor', 'Placement', 'Speaking', 'Listening',
  'Replay', 'Judge', 'Observation', 'Runtime', 'Capability',
  'Evidence', 'Release'
];

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (['node_modules', '.git', 'dist', 'build', '.next'].includes(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|jsx|mjs|md|json)$/.test(name)) out.push(p);
  }
  return out;
}

const files = walk(repo);
const hits = [];

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const matched = interesting.filter(k => new RegExp(k, 'i').test(text));
  if (matched.length) {
    hits.push({
      file: path.relative(repo, file),
      matched
    });
  }
}

const byKeyword = {};
for (const k of interesting) byKeyword[k] = hits.filter(h => h.matched.includes(k)).length;

const report = `# MercyB Capability Control Plane v1

Generated: ${new Date().toISOString()}
Repo: ${repo}

## Capability Signal Counts

${Object.entries(byKeyword).map(([k,v]) => `- ${k}: ${v} files`).join('\n')}

## High-Signal Files

${hits.slice(0, 120).map(h => `- ${h.file} — ${h.matched.join(', ')}`).join('\n')}

## Initial Verdict

This is v1 scanning only. It does not yet verify capability truth.

Next code step:
- add capability registry table
- map runtime entrypoints
- map evidence/replay files
- block verified claims without Judge proof
`;

fs.writeFileSync(reportPath, report);
console.log(`WROTE ${reportPath}`);
