import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const roots = [
  'src/components',
  'src/lib',
  'src/hooks',
  'src/features',
  'src/pages',
  'src/types'
].filter((p) => fs.existsSync(p));

const files = [];
for (const root of roots) {
  const out = spawnSync('bash', ['-lc', `find ${root} -type f \\( -name "*.ts" -o -name "*.tsx" \\) | sort`], {
    encoding: 'utf8'
  }).stdout.trim();
  if (out) files.push(...out.split('\n'));
}

const importCounts = new Map();
const fileImports = [];

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const matches = [...text.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);
  const local = matches.filter((m) => m.startsWith('@/') || m.startsWith('.') || m.startsWith('src/'));
  fileImports.push({ file, imports: local.length, local });
  for (const imp of local) importCounts.set(imp, (importCounts.get(imp) || 0) + 1);
}

fileImports.sort((a, b) => b.imports - a.imports);

const topImports = [...importCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 80);

const report = [
  '# Component Typecheck Hotspot Map',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Scope',
  '',
  `Files scanned: ${files.length}`,
  '',
  '## Top files by local import fanout',
  '',
  ...fileImports.slice(0, 80).map((x) => `- ${x.imports} imports — ${x.file}`),
  '',
  '## Top imported local modules',
  '',
  ...topImports.map(([imp, count]) => `- ${count} imports — ${imp}`),
  '',
  '## Candidate hotspots',
  '',
  ...fileImports
    .filter((x) => x.file.includes('components') && x.imports >= 10)
    .slice(0, 40)
    .map((x) => `- ${x.file} (${x.imports} local imports)`),
  '',
  '## Recommendation',
  '',
  'Start with the highest-fanout components and inspect whether they import broad barrels, heavy context providers, or type-heavy shared modules. Do not exclude files or weaken TypeScript.'
];

fs.writeFileSync('reports/typecheck-import-fanout.md', `${report.join('\n')}\n`);
console.log(`wrote reports/typecheck-import-fanout.md with ${files.length} files`);
