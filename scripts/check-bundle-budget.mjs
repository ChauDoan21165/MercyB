#!/usr/bin/env node
/**
 * Eager first-paint bundle-size budget gate.
 *
 * Measures the gzipped byte total of every JS chunk Rollup emits as
 * eagerly required for the initial document — that is, the entry
 * `<script type="module">` plus every `<link rel="modulepreload">`
 * present in `dist/index.html`. This is the set the browser fetches
 * before first paint; the eager `vendor` chunk and the eager
 * `mercy-guide` bubble shell are part of it. Lazy chunks (route
 * splits, React.lazy panels, `vendor-zod` after #795, the
 * `mercy-guide-panel` after #794, etc.) are absent from this set by
 * construction.
 *
 * Why this gate: STRATEGY §11 — VN mobile / slow-network reputation.
 * PRs #794 + #795 took ~45 KB gz out of this set. Without a CI gate,
 * a future PR can silently re-bloat. The gate is intentionally
 * scoped to first-paint bytes only; total app bytes are not the
 * point.
 *
 * If you legitimately need to widen the budget (new always-on
 * feature, framework upgrade, new eager vendor surface), update
 * BUDGET_GZIP_BYTES below in the same PR that adds the bytes and
 * call it out in the PR description so the reviewer can sign off.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const DIST_DIR = join(REPO_ROOT, 'dist');
const INDEX_HTML = join(DIST_DIR, 'index.html');

// Threshold in gzipped bytes. Baseline on origin/main (this PR's
// merge base) measured 295,580 B gz across the 6 eager chunks:
// index / mercy-guide / react / supabase / ui / vendor.
// Threshold = baseline + ~5% slack = 310,000 B (≈ 4.88% headroom).
//
// Once PRs #794 (lazy MercyGuidePanel) and #795 (vendor-split
// zod/sonner/date-fns) merge, the eager baseline drops by ~45 KB
// gz to ~250 KB. A follow-up PR should tighten this constant to the
// new baseline + 5% so the gate keeps catching regressions instead
// of becoming dead weight.
//
// To widen legitimately (new always-on feature, framework upgrade,
// new eager vendor): raise this number in the same PR that adds the
// bytes and explain why in the PR description.
const BUDGET_GZIP_BYTES = Number(process.env.BUNDLE_BUDGET_GZIP_BYTES) || 310_000;

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

function pass(msg) {
  console.log(`✅ ${msg}`);
}

if (!existsSync(INDEX_HTML)) {
  fail(`dist/index.html not found. Run 'npm run build' before this gate.`);
}

const html = readFileSync(INDEX_HTML, 'utf8');

// Collect eager-set hrefs.
// - <link rel="modulepreload" href="..." [crossorigin]>
// - <script type="module" src="..." [crossorigin]>
// Order-insensitive, attribute-insensitive within each tag.
const eagerHrefs = new Set();

const preloadRe = /<link\b[^>]*\brel=["']modulepreload["'][^>]*\bhref=["']([^"']+)["']/gi;
const preloadAltRe = /<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']modulepreload["']/gi;
const scriptRe = /<script\b[^>]*\btype=["']module["'][^>]*\bsrc=["']([^"']+)["']/gi;
const scriptAltRe = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*\btype=["']module["']/gi;

for (const re of [preloadRe, preloadAltRe, scriptRe, scriptAltRe]) {
  let m;
  while ((m = re.exec(html)) !== null) {
    eagerHrefs.add(m[1]);
  }
}

if (eagerHrefs.size === 0) {
  fail(`No <link rel="modulepreload"> or entry <script type="module"> found in dist/index.html. Parser regression, or the build didn't emit them.`);
}

// Resolve hrefs (typically '/assets/foo.js') to dist/assets/foo.js and gzip.
const rows = [];
let totalGzip = 0;

for (const href of [...eagerHrefs].sort()) {
  const rel = href.replace(/^\//, '');
  const filePath = join(DIST_DIR, rel);
  if (!existsSync(filePath)) {
    fail(`Eager href '${href}' has no file at ${filePath}. Build output is inconsistent.`);
  }
  const raw = readFileSync(filePath);
  const gz = gzipSync(raw, { level: 9 }).length;
  totalGzip += gz;
  rows.push({ href, raw: raw.length, gz });
}

const pad = (s, n) => String(s).padEnd(n, ' ');
const num = (n) => n.toLocaleString();

console.log('📦 Eager first-paint bundle (gzip, from dist/index.html)');
console.log('');
console.log(`  ${pad('chunk (href)', 60)} ${pad('raw', 12)} ${pad('gzip', 10)}`);
console.log(`  ${pad('-'.repeat(60), 60)} ${pad('-'.repeat(12), 12)} ${pad('-'.repeat(10), 10)}`);
for (const r of rows.sort((a, b) => b.gz - a.gz)) {
  console.log(`  ${pad(r.href, 60)} ${pad(num(r.raw), 12)} ${pad(num(r.gz), 10)}`);
}
console.log(`  ${pad('-'.repeat(60), 60)} ${pad('-'.repeat(12), 12)} ${pad('-'.repeat(10), 10)}`);
console.log(`  ${pad('TOTAL', 60)} ${pad('', 12)} ${pad(num(totalGzip), 10)}`);
console.log('');
console.log(`Budget : ${num(BUDGET_GZIP_BYTES)} gzip bytes`);
console.log(`Actual : ${num(totalGzip)} gzip bytes`);
console.log(`Delta  : ${totalGzip - BUDGET_GZIP_BYTES >= 0 ? '+' : ''}${num(totalGzip - BUDGET_GZIP_BYTES)} gzip bytes`);
console.log('');

if (totalGzip > BUDGET_GZIP_BYTES) {
  fail(
    `Eager first-paint gzip total ${num(totalGzip)} B exceeds budget ${num(BUDGET_GZIP_BYTES)} B ` +
    `(over by ${num(totalGzip - BUDGET_GZIP_BYTES)} B). ` +
    `If this regression is intentional, raise BUDGET_GZIP_BYTES in scripts/check-bundle-budget.mjs ` +
    `in the same PR and explain why in the PR description.`
  );
}

pass(`Eager first-paint gzip total ${num(totalGzip)} B under budget ${num(BUDGET_GZIP_BYTES)} B.`);
