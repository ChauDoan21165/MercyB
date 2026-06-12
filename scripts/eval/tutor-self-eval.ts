#!/usr/bin/env tsx
/**
 * Step-19 — Continuous Tutor Self-Eval Harness
 *
 * Nightly measurement of AI tutor engine quality over time.
 *
 * Scoring contract (all deterministic, no LLM-judge):
 *   PASS    — engine fired AND corrected === expected (exact string match)
 *   FAIL    — engine fired AND corrected !== expected
 *   ABSTAIN — engine deferred (status "needs_ai" or "unchanged")
 *             Excluded from pass-rate denominator (S18 abstain-over-guess invariant).
 *
 * Pass-rate = pass / (pass + fail).  Abstains are counted separately.
 *
 * Usage:
 *   npx tsx scripts/eval/tutor-self-eval.ts
 *   npx tsx scripts/eval/tutor-self-eval.ts --update-baseline
 *   npx tsx scripts/eval/tutor-self-eval.ts --regression-threshold 0.05
 *
 * Outputs (directory gitignored; produced as CI artifacts):
 *   _eval_out/trend.json        append-only run history
 *   _eval_out/scoreboard.md     rendered scoreboard (overwritten each run)
 *   _eval_out/run-latest.json   full result for this run
 *
 * Exit codes:
 *   0   OK (or first run — no prior baseline to regress against)
 *   1   Regression detected: pass rate dropped or golden-flow failure introduced
 *   2   Harness error (missing fixture, unreadable file, etc.)
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

import { correctWithTutorRules } from '../../src/lib/tutor/correctionEngine.js';

// ────────────────────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────────────────────

const DEFAULT_REGRESSION_THRESHOLD = 0.05; // 5-point drop triggers alarm
const OUT_DIR = '_eval_out';
const TREND_FILE = `${OUT_DIR}/trend.json`;
const SCOREBOARD_FILE = `${OUT_DIR}/scoreboard.md`;
const LATEST_FILE = `${OUT_DIR}/run-latest.json`;

const EVAL_SET_PATHS: Record<EvalSetId, string> = {
  v1: 'docs/eval/vn-en-eval-set-v1/eval-set.json',
  v2: 'docs/eval/vn-en-eval-set-v2/eval-set-v2.json',
  v3: 'docs/eval/vn-en-eval-set-v3/eval-set-v3.json',
  v4: 'docs/eval/vn-en-eval-set-v4/eval-set-v4.json',
};

const GOLDEN_FLOW_TEST_FILES = [
  'src/lib/tutor/__tests__/goldenFlowRegression.test.ts',
  'tests/regression/correction-golden.test.ts',
];

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

type EvalSetId = 'v1' | 'v2' | 'v3' | 'v4';
type RegressionStatus = 'ok' | 'regression' | 'first-run';

interface EvalEntry {
  id: string;
  input: string;
  expected: string;
  errorTags?: string[];
  level?: string;
  taxonomyPatternId?: string;
}

interface EvalSetFile {
  name?: string;
  count?: number;
  entries: EvalEntry[];
}

interface EvalSetResult {
  setId: EvalSetId;
  total: number;
  pass: number;
  fail: number;
  abstain: number;
  /** pass / (pass + fail). Null when engine never fired (all abstain). */
  passRate: number | null;
}

interface GoldenFlowResult {
  pass: number;
  fail: number;
  total: number;
  /** pass / total */
  passRate: number | null;
}

interface RunRecord {
  runAt: string;
  commit: string;
  evalSets: Record<EvalSetId, EvalSetResult>;
  goldenFlows: GoldenFlowResult;
  regressionStatus: RegressionStatus;
  regressionDetails?: string[];
}

interface VitestJsonOutput {
  numPassedTests?: number;
  numFailedTests?: number;
  numTotalTests?: number;
}

// ────────────────────────────────────────────────────────────────────────────
// CLI args
// ────────────────────────────────────────────────────────────────────────────

interface Args {
  updateBaseline: boolean;
  regressionThreshold: number;
  help: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    updateBaseline: false,
    regressionThreshold: DEFAULT_REGRESSION_THRESHOLD,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--update-baseline') args.updateBaseline = true;
    else if (a === '--regression-threshold') {
      const v = argv[++i];
      const n = parseFloat(v);
      if (isNaN(n) || n < 0 || n > 1) throw new Error(`--regression-threshold must be 0..1, got: ${v}`);
      args.regressionThreshold = n;
    }
  }
  return args;
}

function printHelp(): void {
  console.log([
    'tutor-self-eval — nightly AI tutor engine quality harness (Step 19)',
    '',
    'Usage:',
    '  npx tsx scripts/eval/tutor-self-eval.ts [options]',
    '',
    'Options:',
    '  --update-baseline            No-op (trend file IS the baseline; kept for compat).',
    '  --regression-threshold N     Pass-rate drop threshold (0..1, default 0.05).',
    '  --help                       Show this message.',
    '',
    'Exit codes:',
    '  0  OK  1  Regression  2  Harness error',
  ].join('\n'));
}

// ────────────────────────────────────────────────────────────────────────────
// Eval-set loading + scoring
// ────────────────────────────────────────────────────────────────────────────

function loadEvalSet(repoRoot: string, setId: EvalSetId): EvalEntry[] {
  const filePath = resolve(repoRoot, EVAL_SET_PATHS[setId]);
  if (!existsSync(filePath)) {
    throw new Error(`Eval set ${setId} not found at ${filePath}`);
  }
  const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as EvalSetFile;
  if (!Array.isArray(parsed.entries) || parsed.entries.length === 0) {
    throw new Error(`Eval set ${setId}: "entries" array is missing or empty`);
  }
  return parsed.entries;
}

function scoreEvalSet(setId: EvalSetId, entries: EvalEntry[]): EvalSetResult {
  let pass = 0;
  let fail = 0;
  let abstain = 0;

  for (const entry of entries) {
    const result = correctWithTutorRules(entry.input, 'en');

    if (result.status === 'needs_ai' || result.status === 'unchanged') {
      // Engine deferred — abstain, never guess.
      abstain += 1;
    } else if (result.status === 'corrected') {
      if (result.corrected === entry.expected) {
        pass += 1;
      } else {
        fail += 1;
      }
    } else {
      // Unknown status — treat as abstain for safety.
      abstain += 1;
    }
  }

  const fired = pass + fail;
  const passRate = fired === 0 ? null : pass / fired;

  return { setId, total: entries.length, pass, fail, abstain, passRate };
}

// ────────────────────────────────────────────────────────────────────────────
// Golden-flow vitest runner
// ────────────────────────────────────────────────────────────────────────────

function runGoldenFlowTests(repoRoot: string): GoldenFlowResult {
  const vitestOutFile = resolve(repoRoot, `${OUT_DIR}/vitest-golden-flow.json`);
  const existingFiles = GOLDEN_FLOW_TEST_FILES
    .map((f) => resolve(repoRoot, f))
    .filter((f) => existsSync(f));

  if (existingFiles.length === 0) {
    console.warn('[self-eval] No golden-flow test files found — skipping vitest pass.');
    return { pass: 0, fail: 0, total: 0, passRate: null };
  }

  const result = spawnSync(
    'npx',
    [
      'vitest',
      'run',
      '--reporter=json',
      `--outputFile=${vitestOutFile}`,
      ...existingFiles.map((f) => relative(repoRoot, f)),
    ],
    {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        AI_TUTOR_QUALITY_GATE: '1',
        // Blank out LLM keys — these tests must be purely deterministic.
        OPENAI_API_KEY: '',
        ANTHROPIC_API_KEY: '',
        GEMINI_API_KEY: '',
        VITE_SUPABASE_URL: process.env['VITE_SUPABASE_URL'] ?? '',
        VITE_SUPABASE_ANON_KEY: process.env['VITE_SUPABASE_ANON_KEY'] ?? '',
        SUPABASE_SERVICE_ROLE_KEY: '',
      },
    },
  );

  // vitest exits non-zero on test failures — that's expected data, not a harness error.
  // Read the JSON output regardless of exit code.
  let parsed: VitestJsonOutput = {};
  if (existsSync(vitestOutFile)) {
    try {
      parsed = JSON.parse(readFileSync(vitestOutFile, 'utf8')) as VitestJsonOutput;
    } catch {
      console.warn('[self-eval] Could not parse vitest JSON output — reporting golden flows as unknown.');
    }
  } else if (result.error) {
    console.error(`[self-eval] vitest spawn error: ${result.error.message}`);
  }

  const pass = parsed.numPassedTests ?? 0;
  const fail = parsed.numFailedTests ?? 0;
  const total = parsed.numTotalTests ?? (pass + fail);
  const passRate = total === 0 ? null : pass / total;

  return { pass, fail, total, passRate };
}

// ────────────────────────────────────────────────────────────────────────────
// Git commit hash
// ────────────────────────────────────────────────────────────────────────────

function currentCommit(repoRoot: string): string {
  const result = spawnSync('git', ['rev-parse', '--short', 'HEAD'], {
    cwd: repoRoot,
    stdio: ['ignore', 'pipe', 'ignore'],
    encoding: 'utf8',
  });
  return (result.stdout ?? '').trim() || 'unknown';
}

// ────────────────────────────────────────────────────────────────────────────
// Trend file (append-only)
// ────────────────────────────────────────────────────────────────────────────

function loadTrend(repoRoot: string): RunRecord[] {
  const path = resolve(repoRoot, TREND_FILE);
  if (!existsSync(path)) return [];
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as RunRecord[];
  } catch {
    return [];
  }
}

function saveTrend(repoRoot: string, trend: RunRecord[]): void {
  writeFileSync(resolve(repoRoot, TREND_FILE), JSON.stringify(trend, null, 2) + '\n', 'utf8');
}

// ────────────────────────────────────────────────────────────────────────────
// Regression detection
// ────────────────────────────────────────────────────────────────────────────

function detectRegression(
  current: Omit<RunRecord, 'regressionStatus' | 'regressionDetails'>,
  prev: RunRecord | undefined,
  threshold: number,
): { status: RegressionStatus; details: string[] } {
  if (!prev) return { status: 'first-run', details: [] };

  const details: string[] = [];

  for (const setId of Object.keys(current.evalSets) as EvalSetId[]) {
    const cur = current.evalSets[setId];
    const pre = prev.evalSets[setId];
    if (!pre) continue;

    if (cur.passRate !== null && pre.passRate !== null) {
      const drop = pre.passRate - cur.passRate;
      if (drop > threshold) {
        details.push(
          `eval-set ${setId}: pass rate dropped ${(drop * 100).toFixed(1)}pp ` +
          `(${(pre.passRate * 100).toFixed(1)}% → ${(cur.passRate * 100).toFixed(1)}%, threshold ${(threshold * 100).toFixed(0)}pp)`,
        );
      }
    }
  }

  // Golden-flow regression: any new failures when prev had none.
  if (prev.goldenFlows.fail === 0 && current.goldenFlows.fail > 0) {
    details.push(
      `golden-flows: ${current.goldenFlows.fail} new failure(s) ` +
      `(prev run had 0 failures, now ${current.goldenFlows.fail}/${current.goldenFlows.total})`,
    );
  }

  return { status: details.length > 0 ? 'regression' : 'ok', details };
}

// ────────────────────────────────────────────────────────────────────────────
// Scoreboard rendering
// ────────────────────────────────────────────────────────────────────────────

function pct(rate: number | null): string {
  if (rate === null) return '   n/a';
  return `${(rate * 100).toFixed(1).padStart(5)}%`;
}

function pad(s: string, n: number): string {
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

function renderScoreboard(trend: RunRecord[]): string {
  const lines: string[] = [];
  lines.push('# AI Tutor Self-Eval Scoreboard');
  lines.push('');
  lines.push('*Append-only trend. Scores are pass / (pass + fail). Abstains excluded.*');
  lines.push('');
  lines.push('---');
  lines.push('');

  if (trend.length === 0) {
    lines.push('No runs recorded yet.');
    return lines.join('\n');
  }

  // Latest run detail
  const latest = trend[trend.length - 1]!;
  lines.push(`## Latest run — ${latest.runAt.replace('T', ' ').replace(/\.\d+Z$/, ' UTC')} · \`${latest.commit}\``);
  lines.push('');

  const status = latest.regressionStatus;
  const statusEmoji = status === 'ok' ? '✅' : status === 'first-run' ? '🆕' : '🔴';
  lines.push(`**Status:** ${statusEmoji} ${status.toUpperCase()}`);
  lines.push('');

  if (latest.regressionDetails && latest.regressionDetails.length > 0) {
    lines.push('**Regression details:**');
    for (const d of latest.regressionDetails) {
      lines.push(`- ${d}`);
    }
    lines.push('');
  }

  lines.push('### Eval sets');
  lines.push('');
  lines.push('| Set | Total | Pass | Fail | Abstain | Pass rate |');
  lines.push('|-----|------:|-----:|-----:|--------:|----------:|');
  for (const setId of ['v1', 'v2', 'v3', 'v4'] as EvalSetId[]) {
    const r = latest.evalSets[setId];
    lines.push(
      `| ${setId} | ${r.total} | ${r.pass} | ${r.fail} | ${r.abstain} | ${pct(r.passRate)} |`,
    );
  }
  lines.push('');

  lines.push('### Golden-flow correction tests');
  lines.push('');
  const gf = latest.goldenFlows;
  lines.push(`| Total | Pass | Fail | Pass rate |`);
  lines.push(`|------:|-----:|-----:|----------:|`);
  lines.push(`| ${gf.total} | ${gf.pass} | ${gf.fail} | ${pct(gf.passRate)} |`);
  lines.push('');

  // Trend table
  if (trend.length > 1) {
    lines.push('---');
    lines.push('');
    lines.push('## Trend (newest first)');
    lines.push('');
    lines.push('| Run date (UTC) | Commit | GF pass | v1 rate | v2 rate | v3 rate | v4 rate | Status |');
    lines.push('|----------------|--------|--------:|--------:|--------:|--------:|--------:|--------|');

    for (let i = trend.length - 1; i >= 0; i--) {
      const r = trend[i]!;
      const date = r.runAt.replace('T', ' ').replace(/\.\d+Z$/, '');
      const gfPass = r.goldenFlows.fail === 0 ? '✅' : `❌ ${r.goldenFlows.fail}`;
      const v1r = pct(r.evalSets.v1.passRate).trim();
      const v2r = pct(r.evalSets.v2.passRate).trim();
      const v3r = pct(r.evalSets.v3.passRate).trim();
      const v4r = pct(r.evalSets.v4.passRate).trim();
      const st = r.regressionStatus === 'ok' ? '✅' : r.regressionStatus === 'first-run' ? '🆕' : '🔴';
      lines.push(`| ${date} | \`${r.commit}\` | ${gfPass} | ${v1r} | ${v2r} | ${v3r} | ${v4r} | ${st} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ────────────────────────────────────────────────────────────────────────────
// Board-postable regression block
// ────────────────────────────────────────────────────────────────────────────

function buildRegressionBlock(run: RunRecord): string {
  const lines: string[] = [];
  lines.push('╔══════════════════════════════════════════════════════════════════════╗');
  lines.push('║  🔴 TUTOR SELF-EVAL REGRESSION DETECTED                              ║');
  lines.push('╚══════════════════════════════════════════════════════════════════════╝');
  lines.push(`Run: ${run.runAt}  Commit: ${run.commit}`);
  lines.push('');
  for (const d of run.regressionDetails ?? []) {
    lines.push(`  ✗ ${d}`);
  }
  lines.push('');
  lines.push('Eval-set pass rates:');
  for (const setId of ['v1', 'v2', 'v3', 'v4'] as EvalSetId[]) {
    const r = run.evalSets[setId];
    lines.push(`  ${setId}: ${pct(r.passRate).trim()} (${r.pass}/${r.pass + r.fail} fired, ${r.abstain} abstained)`);
  }
  lines.push(`Golden flows: ${run.goldenFlows.pass}/${run.goldenFlows.total} pass`);
  lines.push('');
  lines.push('Action: investigate the correction-engine changes in this commit.');
  return lines.join('\n');
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

function main(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  const repoRoot = resolve(here, '..', '..');

  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  // Ensure output directory exists.
  mkdirSync(resolve(repoRoot, OUT_DIR), { recursive: true });

  // ── Phase 1: score eval sets v1–v4 ─────────────────────────────────────
  console.log('[self-eval] Scoring eval sets v1–v4 against correction engine …');
  const evalSetResults: Record<EvalSetId, EvalSetResult> = {} as Record<EvalSetId, EvalSetResult>;

  for (const setId of ['v1', 'v2', 'v3', 'v4'] as EvalSetId[]) {
    const entries = loadEvalSet(repoRoot, setId);
    const result = scoreEvalSet(setId, entries);
    evalSetResults[setId] = result;
    console.log(
      `[self-eval]   ${setId}: total=${result.total} pass=${result.pass} fail=${result.fail} ` +
      `abstain=${result.abstain} passRate=${pct(result.passRate).trim()}`,
    );
  }

  // ── Phase 2: run golden-flow correction tests ───────────────────────────
  console.log('[self-eval] Running golden-flow correction tests via vitest …');
  const goldenFlows = runGoldenFlowTests(repoRoot);
  console.log(
    `[self-eval]   golden-flows: ${goldenFlows.pass}/${goldenFlows.total} pass, ` +
    `${goldenFlows.fail} fail`,
  );

  // ── Phase 3: build run record ───────────────────────────────────────────
  const commit = currentCommit(repoRoot);
  const runAt = new Date().toISOString();

  const trend = loadTrend(repoRoot);
  const prev = trend[trend.length - 1];

  const pending = { runAt, commit, evalSets: evalSetResults, goldenFlows };
  const { status, details } = detectRegression(pending, prev, args.regressionThreshold);

  const run: RunRecord = {
    ...pending,
    regressionStatus: status,
    ...(details.length > 0 ? { regressionDetails: details } : {}),
  };

  // ── Phase 4: persist outputs ────────────────────────────────────────────
  trend.push(run);
  saveTrend(repoRoot, trend);
  writeFileSync(resolve(repoRoot, LATEST_FILE), JSON.stringify(run, null, 2) + '\n', 'utf8');
  writeFileSync(resolve(repoRoot, SCOREBOARD_FILE), renderScoreboard(trend), 'utf8');

  console.log(`[self-eval] Outputs written to ${OUT_DIR}/`);
  console.log(`[self-eval] Status: ${run.regressionStatus}`);

  // ── Phase 5: regression alarm ───────────────────────────────────────────
  if (status === 'regression') {
    const block = buildRegressionBlock(run);
    console.error('');
    console.error(block);
    process.exitCode = 1;
  }
}

try {
  main();
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`[self-eval] HARNESS ERROR: ${msg}`);
  process.exit(2);
}
