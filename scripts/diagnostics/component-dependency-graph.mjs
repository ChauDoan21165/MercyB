import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const roots = ['src/components', 'src/pages', 'src/lib', 'src/hooks', 'src/features', 'src/providers', 'src/contexts']
  .filter((root) => fs.existsSync(root));

const srcFiles = spawnSync(
  'bash',
  ['-lc', `find ${roots.join(' ')} -type f \\( -name "*.ts" -o -name "*.tsx" \\) | sort`],
  { encoding: 'utf8' }
).stdout.trim().split('\n').filter(Boolean);

const fileSet = new Set(srcFiles.map((f) => path.normalize(f)));

function candidatesForImport(fromFile, spec) {
  if (spec.startsWith('@/')) return [`src/${spec.slice(2)}`];
  if (spec.startsWith('src/')) return [spec];
  if (spec.startsWith('.')) return [path.normalize(path.join(path.dirname(fromFile), spec))];
  return [];
}

function resolveLocal(fromFile, spec) {
  const bases = candidatesForImport(fromFile, spec);
  const suffixes = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'];
  for (const base of bases) {
    for (const suffix of suffixes) {
      const candidate = path.normalize(`${base}${suffix}`);
      if (fileSet.has(candidate)) return candidate;
    }
  }
  return null;
}

const graph = new Map();
const reverse = new Map();
const barrels = [];

for (const file of srcFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const specs = [...text.matchAll(/(?:import|export)\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g)].map((m) => m[1]);
  const deps = new Set();

  for (const spec of specs) {
    const resolved = resolveLocal(file, spec);
    if (!resolved) continue;
    deps.add(resolved);
    if (!reverse.has(resolved)) reverse.set(resolved, new Set());
    reverse.get(resolved).add(file);
    if (spec.endsWith('/index') || spec === '../index' || spec === './index' || resolved.endsWith('/index.ts') || resolved.endsWith('/index.tsx')) {
      barrels.push({ from: file, spec, resolved });
    }
  }

  graph.set(file, deps);
}

function transitiveCount(start, limit = 5000) {
  const seen = new Set();
  const stack = [...(graph.get(start) || [])];
  while (stack.length && seen.size < limit) {
    const node = stack.pop();
    if (!node || seen.has(node)) continue;
    seen.add(node);
    for (const dep of graph.get(node) || []) stack.push(dep);
  }
  return seen.size;
}

function detectCycles() {
  const cycles = [];
  const visiting = new Set();
  const visited = new Set();
  const stack = [];

  function dfs(node) {
    if (cycles.length >= 40) return;
    if (visiting.has(node)) {
      const i = stack.indexOf(node);
      if (i >= 0) cycles.push([...stack.slice(i), node]);
      return;
    }
    if (visited.has(node)) return;

    visiting.add(node);
    stack.push(node);
    for (const dep of graph.get(node) || []) dfs(dep);
    stack.pop();
    visiting.delete(node);
    visited.add(node);
  }

  for (const node of graph.keys()) dfs(node);
  return cycles;
}

const directFanout = [...graph.entries()]
  .map(([file, deps]) => ({ file, count: deps.size }))
  .sort((a, b) => b.count - a.count);

const reverseFanIn = [...reverse.entries()]
  .map(([file, users]) => ({ file, count: users.size }))
  .sort((a, b) => b.count - a.count);

const transitiveFanout = [...graph.keys()]
  .map((file) => ({ file, count: transitiveCount(file) }))
  .sort((a, b) => b.count - a.count);

const barrelCounts = new Map();
for (const b of barrels) barrelCounts.set(b.resolved, (barrelCounts.get(b.resolved) || 0) + 1);

const barrelRanking = [...barrelCounts.entries()]
  .map(([file, count]) => ({ file, count }))
  .sort((a, b) => b.count - a.count);

const cycles = detectCycles();

const lines = [
  '# Component Dependency Graph Analysis',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Scope',
  '',
  `Files analyzed: ${srcFiles.length}`,
  `Edges: ${[...graph.values()].reduce((a, deps) => a + deps.size, 0)}`,
  '',
  '## Top direct fanout files',
  '',
  ...directFanout.slice(0, 50).map((x) => `- ${x.count} deps — ${x.file}`),
  '',
  '## Top transitive fanout files',
  '',
  ...transitiveFanout.slice(0, 50).map((x) => `- ${x.count} transitive deps — ${x.file}`),
  '',
  '## Top fan-in modules',
  '',
  ...reverseFanIn.slice(0, 50).map((x) => `- ${x.count} importers — ${x.file}`),
  '',
  '## Barrel/index modules used by local imports',
  '',
  ...barrelRanking.slice(0, 50).map((x) => `- ${x.count} imports — ${x.file}`),
  '',
  '## Cycles detected',
  '',
  ...(cycles.length ? cycles.map((cycle) => `- ${cycle.join(' -> ')}`) : ['No cycles detected in analyzed scope.']),
  '',
  '## Strategic recommendation',
  '',
  'Investigate the top transitive fanout and barrel modules first. Prefer replacing broad barrel imports with narrow imports only where it measurably reduces typecheck cost and does not change runtime behavior.'
];

fs.writeFileSync('reports/typecheck-dependency-graph.md', `${lines.join('\n')}\n`);
console.log('wrote reports/typecheck-dependency-graph.md');
