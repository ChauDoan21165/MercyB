#!/usr/bin/env tsx
/**
 * L1-correction eval harness.
 *
 * Offline measurement of how well the existing 60-rule L1 detector
 * (src/lib/feedback/l1-error-detector.ts via the feedback barrel) tags
 * Vietnamese-learner error cases against a held-out fixture bank.
 *
 * Not wired into CI. Not imported by app runtime. Run manually before
 * and after changing rule packs to confirm you haven't regressed the
 * baseline.
 *
 * Quick reference:
 *   npx tsx scripts/eval/l1-correction-harness.ts
 *   npx tsx scripts/eval/l1-correction-harness.ts --families article-omission-overuse,plural-s-omission
 *   npx tsx scripts/eval/l1-correction-harness.ts --update-baseline
 *   npx tsx scripts/eval/l1-correction-harness.ts --regression
 *   npx tsx scripts/eval/l1-correction-harness.ts --json
 *
 * See scripts/eval/README.md for the JSON shape, category semantics,
 * and how to wire the harness into CI later.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { detectL1Error } from '../../src/lib/feedback/index.js';
import { vietnameseL1Profile } from '../../src/lib/l1-profiles/index.js';

// ────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────

type ExpectedCategory =
  | 'expected_pass'      // detector should match expected_rule_id exactly
  | 'expected_partial'   // detector should match SOMETHING (parent/related rule)
  | 'expected_failure';  // detector should NOT match — case documents a gap

type Severity = 'high' | 'medium' | 'low';

type FixtureCase = {
  id: string;
  family: string;
  expected_rule_id: string | null;
  /**
   * Stable family-id from C1's GrammarFamily.id namespace.
   * Today this is always equal to expected_rule_id (a detector-tag literal).
   * Post-C6 ingestor it becomes the canonical phenomenon-id, decoupling the
   * fixture from detector-rule renames. The verdict logic still keys off
   * expected_rule_id — expected_phenomenon is carried for downstream tools.
   */
  expected_phenomenon: string | null;
  severity: Severity;
  input: string;
  expected_correction: string;
  expected_category: ExpectedCategory;
  source: string;
  notes?: string;
};

type Fixture = {
  _meta?: Record<string, unknown>;
  cases: FixtureCase[];
};

type Verdict = 'pass' | 'fail';

type CaseResult = {
  case: FixtureCase;
  fixturePath: string;
  actualTag: string | null;
  verdict: Verdict;
};

type Baseline = {
  generated_at: string;
  global: { pass: number; total: number; rate: number };
  by_family: Record<string, { pass: number; total: number; rate: number }>;
};

// ────────────────────────────────────────────────────────────────────────
// CLI parsing
// ────────────────────────────────────────────────────────────────────────

type Args = {
  files: string[];
  families: string[] | null;
  json: boolean;
  updateBaseline: boolean;
  regression: boolean;
  coverage: boolean;
  quiet: boolean;
  help: boolean;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    files: [],
    families: null,
    json: false,
    updateBaseline: false,
    regression: false,
    coverage: false,
    quiet: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--json') args.json = true;
    else if (a === '--quiet') args.quiet = true;
    else if (a === '--update-baseline') args.updateBaseline = true;
    else if (a === '--regression') args.regression = true;
    else if (a === '--coverage') args.coverage = true;
    else if (a === '--families') {
      const v = argv[++i];
      if (!v) throw new Error('--families expects a comma-separated list');
      args.families = v.split(',').map((s) => s.trim()).filter(Boolean);
    } else if (a === '--files') {
      while (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
        args.files.push(argv[++i]);
      }
    } else if (a.startsWith('--')) {
      throw new Error(`Unknown flag: ${a}`);
    } else {
      args.files.push(a);
    }
  }
  return args;
}

function printHelp(): void {
  console.log(
    [
      'l1-correction-harness — offline measurement of L1 detector quality.',
      '',
      'Usage:',
      '  tsx scripts/eval/l1-correction-harness.ts [options] [fixture.json ...]',
      '',
      'Options:',
      '  --files a.json b.json   Fixtures to load. Defaults to evals/vi-grammar-cases.json + evals/vi-writing-cases.json.',
      '  --families <list>       Comma-separated family filter (e.g. plural-s-omission,copula-be-deletion).',
      '  --update-baseline       Overwrite evals/.baseline.json with this run.',
      '  --regression            Exit 1 if pass rate drops below the saved baseline.',
      '  --coverage              Assert fixture<->viL1Profile family coverage; exit 1 on drift.',
      '  --json                  Emit a machine-readable JSON object instead of the human table.',
      '  --quiet                 Skip the per-failure detail block.',
      '  --help                  Show this message.',
    ].join('\n'),
  );
}

// ────────────────────────────────────────────────────────────────────────
// Fixture loading
// ────────────────────────────────────────────────────────────────────────

const VALID_CATEGORIES: ReadonlySet<ExpectedCategory> = new Set([
  'expected_pass',
  'expected_partial',
  'expected_failure',
]);

function loadFixture(path: string): Fixture {
  const raw = readFileSync(path, 'utf8');
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || !Array.isArray((parsed as Fixture).cases)) {
    throw new Error(`Fixture ${path} is missing top-level "cases" array.`);
  }
  const fixture = parsed as Fixture;
  for (const c of fixture.cases) {
    if (typeof c.id !== 'string' || !c.id) throw new Error(`${path}: case missing id`);
    if (typeof c.family !== 'string' || !c.family) throw new Error(`${path}: case ${c.id} missing family`);
    if (typeof c.input !== 'string') throw new Error(`${path}: case ${c.id} missing input`);
    if (typeof c.expected_correction !== 'string') {
      throw new Error(`${path}: case ${c.id} missing expected_correction`);
    }
    if (c.expected_rule_id !== null && typeof c.expected_rule_id !== 'string') {
      throw new Error(`${path}: case ${c.id} expected_rule_id must be string or null`);
    }
    if (c.expected_phenomenon !== null && typeof c.expected_phenomenon !== 'string') {
      throw new Error(`${path}: case ${c.id} expected_phenomenon must be string or null`);
    }
    if (!VALID_CATEGORIES.has(c.expected_category)) {
      throw new Error(`${path}: case ${c.id} expected_category must be one of ${[...VALID_CATEGORIES].join('|')}`);
    }
  }
  return fixture;
}

// ────────────────────────────────────────────────────────────────────────
// Verdict
// ────────────────────────────────────────────────────────────────────────

/**
 * Per Chau's locked semantics (C5 brief):
 *   expected_pass    — pass iff detector fires AND tag matches expected_rule_id
 *   expected_partial — pass iff detector fires ANY rule (parent/related)
 *   expected_failure — pass iff detector does NOT fire (gap correctly preserved)
 *
 * expected_failure cases are tracked separately and excluded from the
 * baseline pass-rate denominator so they don't suppress the score while
 * waiting for a detector to ship. When a detector lands, the case author
 * flips its category from expected_failure → expected_pass and the
 * baseline goes up automatically.
 */
function verdictFor(c: FixtureCase, actualTag: string | null): Verdict {
  switch (c.expected_category) {
    case 'expected_pass':
      return actualTag === c.expected_rule_id ? 'pass' : 'fail';
    case 'expected_partial':
      return actualTag !== null ? 'pass' : 'fail';
    case 'expected_failure':
      return actualTag === null ? 'pass' : 'fail';
  }
}

function runCase(c: FixtureCase, fixturePath: string): CaseResult {
  const result = detectL1Error({
    userAnswer: c.input,
    expectedAnswer: c.expected_correction,
  });
  const actualTag = result.matched ? result.weaknessTag : null;
  return {
    case: c,
    fixturePath,
    actualTag,
    verdict: verdictFor(c, actualTag),
  };
}

// ────────────────────────────────────────────────────────────────────────
// Reporting
// ────────────────────────────────────────────────────────────────────────

type FamilySummary = {
  family: string;
  pass: number;
  partial: number;
  fail: number;
  // expected_failure cases live in their own counters so they don't
  // contaminate the pass-rate denominator.
  gap_preserved: number;
  gap_closed: number;
};

function summarize(results: CaseResult[]): {
  byFamily: Map<string, FamilySummary>;
  global: { passable: number; passed: number };
} {
  const byFamily = new Map<string, FamilySummary>();
  let passable = 0;
  let passed = 0;
  for (const r of results) {
    const fam = r.case.family;
    if (!byFamily.has(fam)) {
      byFamily.set(fam, { family: fam, pass: 0, partial: 0, fail: 0, gap_preserved: 0, gap_closed: 0 });
    }
    const slot = byFamily.get(fam)!;
    if (r.case.expected_category === 'expected_failure') {
      if (r.verdict === 'pass') slot.gap_preserved += 1;
      else slot.gap_closed += 1;
      // intentionally NOT counted in baseline
      continue;
    }
    passable += 1;
    if (r.verdict === 'pass') {
      passed += 1;
      if (r.case.expected_category === 'expected_partial') slot.partial += 1;
      else slot.pass += 1;
    } else {
      slot.fail += 1;
    }
  }
  return { byFamily, global: { passable, passed } };
}

function pad(s: string, n: number): string {
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

function pct(num: number, denom: number): string {
  if (denom === 0) return '   n/a';
  return `${((num / denom) * 100).toFixed(1).padStart(5)}%`;
}

function printTable(results: CaseResult[]): void {
  const { byFamily, global } = summarize(results);
  const rows = [...byFamily.values()].sort((a, b) => a.family.localeCompare(b.family));
  const w = Math.max(24, ...rows.map((r) => r.family.length));

  console.log('');
  console.log(`  ${pad('family', w)}  pass  partial  fail  rate    gap-cases (preserved/closed)`);
  console.log(`  ${'-'.repeat(w)}  ----  -------  ----  -----   -----------------------------`);
  for (const r of rows) {
    const denom = r.pass + r.partial + r.fail;
    const num = r.pass + r.partial;
    console.log(
      `  ${pad(r.family, w)}  ${String(r.pass).padStart(4)}  ${String(r.partial).padStart(7)}  ${String(r.fail).padStart(4)}  ${pct(num, denom)}   ${r.gap_preserved}/${r.gap_closed}`,
    );
  }
  console.log(`  ${'-'.repeat(w)}  ----  -------  ----  -----   -----------------------------`);
  console.log(
    `  ${pad('OVERALL', w)}  ${' '.repeat(4)}  ${' '.repeat(7)}  ${' '.repeat(4)}  ${pct(global.passed, global.passable)}   (gap cases excluded from rate)`,
  );
  console.log('');
  console.log(`  baseline-eligible cases: ${global.passable}     passing: ${global.passed}     pass rate: ${pct(global.passed, global.passable)}`);
}

function printFailures(results: CaseResult[]): void {
  const fails = results.filter((r) => r.verdict === 'fail');
  if (fails.length === 0) {
    console.log('  no failures.');
    return;
  }
  console.log('');
  console.log(`  failures (${fails.length}):`);
  for (const r of fails) {
    const expected = r.case.expected_rule_id ?? '(none)';
    const actual = r.actualTag ?? '(none)';
    console.log(`    [${r.case.expected_category}] ${r.case.id}  family=${r.case.family}`);
    console.log(`        input:    ${r.case.input}`);
    console.log(`        target:   ${r.case.expected_correction}`);
    console.log(`        expected: ${expected}`);
    console.log(`        actual:   ${actual}`);
  }
}

// ────────────────────────────────────────────────────────────────────────
// Baseline file
// ────────────────────────────────────────────────────────────────────────

function baselinePath(here: string): string {
  return resolve(here, '..', '..', 'evals', '.baseline.json');
}

function buildBaseline(results: CaseResult[]): Baseline {
  const { byFamily, global } = summarize(results);
  const by_family: Baseline['by_family'] = {};
  for (const r of byFamily.values()) {
    const denom = r.pass + r.partial + r.fail;
    const num = r.pass + r.partial;
    by_family[r.family] = {
      pass: num,
      total: denom,
      rate: denom === 0 ? 0 : num / denom,
    };
  }
  return {
    generated_at: new Date().toISOString(),
    global: {
      pass: global.passed,
      total: global.passable,
      rate: global.passable === 0 ? 0 : global.passed / global.passable,
    },
    by_family,
  };
}

function writeBaseline(path: string, b: Baseline): void {
  writeFileSync(path, JSON.stringify(b, null, 2) + '\n', 'utf8');
}

function readBaseline(path: string): Baseline | null {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as Baseline;
}

// ────────────────────────────────────────────────────────────────────────
// Profile<->fixture family-coverage assertion (spec §8 item 4).
//
// Two fail-closed checks against viL1Profile:
//
//   A. Every fixture-case `family` resolves into a profile family ID
//      (grammar.families[].id ∪ writing.patterns[].id). The brief
//      scopes Check A to grammar.families specifically, but writing
//      fixtures legitimately belong in writing.patterns — checking
//      both halves of the profile family namespace prevents a noise-
//      heavy report on placeholder writing cases that conceptually
//      belong to writing, just under different names.
//
//   B. Every grammar.families[] entry with severity === 'high' has
//      at least one fixture case (any expected_category) referencing
//      it. High-severity drift is the load-bearing case — the family
//      that exists in the profile but has zero eval coverage is the
//      one most likely to silently regress.
//
// Name normalisation: profile IDs are snake_case (per spec §0 lock);
// fixture `family` values are historically kebab-case (legacy from
// the C5 harness bootstrap). The assertion normalises kebab → snake
// at comparison time so the check captures conceptual equivalence
// rather than slug-string identity. A future fixture-rename PR will
// remove the need for the normaliser.
// ────────────────────────────────────────────────────────────────────────

function normalizeFamilyId(s: string): string {
  return s.trim().replace(/-/g, '_');
}

type CoverageReport = {
  orphan_fixture_families: Array<{
    fixture_family: string;
    normalized: string;
    case_ids: string[];
  }>;
  uncovered_high_severity_grammar_families: string[];
  ok: boolean;
};

function buildCoverageReport(results: CaseResult[]): CoverageReport {
  const grammarFamilyIds = new Set(
    (vietnameseL1Profile.grammar?.families ?? []).map((f) => f.id),
  );
  const writingPatternIds = new Set(
    (vietnameseL1Profile.writing?.patterns ?? []).map((p) => p.id),
  );
  const allProfileFamilyIds = new Set<string>([
    ...grammarFamilyIds,
    ...writingPatternIds,
  ]);
  const highSeverityGrammarIds = new Set(
    (vietnameseL1Profile.grammar?.families ?? [])
      .filter((f) => f.severity === 'high')
      .map((f) => f.id),
  );

  // Check A — orphan fixture families.
  const orphanMap = new Map<
    string,
    { fixture_family: string; normalized: string; case_ids: string[] }
  >();
  // Check B — for every grammar family with severity high, count cases.
  const coveredHighSeverity = new Set<string>();
  for (const r of results) {
    const fixtureFamily = r.case.family;
    const normalized = normalizeFamilyId(fixtureFamily);
    if (!allProfileFamilyIds.has(normalized)) {
      const existing = orphanMap.get(fixtureFamily);
      if (existing) existing.case_ids.push(r.case.id);
      else
        orphanMap.set(fixtureFamily, {
          fixture_family: fixtureFamily,
          normalized,
          case_ids: [r.case.id],
        });
    }
    if (highSeverityGrammarIds.has(normalized)) {
      coveredHighSeverity.add(normalized);
    }
  }

  const uncovered: string[] = [];
  for (const id of highSeverityGrammarIds) {
    if (!coveredHighSeverity.has(id)) uncovered.push(id);
  }

  return {
    orphan_fixture_families: [...orphanMap.values()],
    uncovered_high_severity_grammar_families: uncovered,
    ok:
      orphanMap.size === 0 && uncovered.length === 0,
  };
}

function printCoverage(report: CoverageReport): void {
  console.log('');
  console.log('  profile coverage assertion (--coverage):');
  console.log('');
  if (report.orphan_fixture_families.length === 0) {
    console.log(
      '    [A] orphan fixture families: 0  (every fixture family resolves into grammar.families ∪ writing.patterns)',
    );
  } else {
    console.log(
      `    [A] orphan fixture families: ${report.orphan_fixture_families.length}  (fixture references a family not in the profile)`,
    );
    for (const o of report.orphan_fixture_families) {
      const ids = o.case_ids.length > 4
        ? `${o.case_ids.slice(0, 4).join(', ')}, +${o.case_ids.length - 4} more`
        : o.case_ids.join(', ');
      console.log(
        `        - ${o.fixture_family}  (normalised: ${o.normalized})  cases: ${ids}`,
      );
    }
  }
  if (report.uncovered_high_severity_grammar_families.length === 0) {
    console.log(
      '    [B] uncovered high-severity grammar families: 0  (every grammar.severity=high family has ≥1 fixture case)',
    );
  } else {
    console.log(
      `    [B] uncovered high-severity grammar families: ${report.uncovered_high_severity_grammar_families.length}  (profile family with severity:high but no fixture case)`,
    );
    for (const id of report.uncovered_high_severity_grammar_families) {
      console.log(`        - ${id}`);
    }
  }
  console.log('');
  if (report.ok) {
    console.log('    coverage: OK');
  } else {
    console.log('    coverage: DRIFT (exit 1)');
  }
}

// ────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────

function defaultFixtures(here: string): string[] {
  const repoRoot = resolve(here, '..', '..');
  return [
    resolve(repoRoot, 'evals', 'vi-grammar-cases.json'),
    resolve(repoRoot, 'evals', 'vi-writing-cases.json'),
  ];
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const here = dirname(fileURLToPath(import.meta.url));
  const fixturePaths =
    args.files.length > 0
      ? args.files.map((p) => resolve(process.cwd(), p))
      : defaultFixtures(here);

  let allCases: { case: FixtureCase; fixturePath: string }[] = [];
  const loaded: { path: string; cases: number }[] = [];
  for (const path of fixturePaths) {
    const fx = loadFixture(path);
    loaded.push({ path, cases: fx.cases.length });
    for (const c of fx.cases) allCases.push({ case: c, fixturePath: path });
  }

  if (args.families) {
    const filter = new Set(args.families);
    allCases = allCases.filter((x) => filter.has(x.case.family));
  }

  const results: CaseResult[] = allCases.map((x) => runCase(x.case, x.fixturePath));

  const baselineFile = baselinePath(here);
  const current = buildBaseline(results);

  const coverage = args.coverage ? buildCoverageReport(results) : null;

  if (args.json) {
    const payload = {
      fixtures: loaded.map((l) => ({ path: relative(process.cwd(), l.path), cases: l.cases })),
      families_filter: args.families,
      baseline: current,
      coverage,
      results: results.map((r) => ({
        id: r.case.id,
        family: r.case.family,
        expected_category: r.case.expected_category,
        expected_rule_id: r.case.expected_rule_id,
        expected_phenomenon: r.case.expected_phenomenon,
        actual_tag: r.actualTag,
        verdict: r.verdict,
      })),
    };
    console.log(JSON.stringify(payload, null, 2));
  } else {
    console.log('L1 correction harness — offline eval');
    for (const l of loaded) {
      console.log(`  fixture: ${relative(process.cwd(), l.path)}  (${l.cases} cases)`);
    }
    if (args.families) {
      console.log(`  families filter: ${args.families.join(', ')}  (${results.length} cases after filter)`);
    }
    printTable(results);
    if (!args.quiet) printFailures(results);
    if (coverage) printCoverage(coverage);
  }

  if (coverage && !coverage.ok) {
    process.exitCode = 1;
  }

  if (args.updateBaseline) {
    writeBaseline(baselineFile, current);
    if (!args.json) {
      console.log('');
      console.log(`  baseline written: ${relative(process.cwd(), baselineFile)}`);
    }
  }

  if (args.regression) {
    const prior = readBaseline(baselineFile);
    if (!prior) {
      console.error('  --regression: no baseline file found; run with --update-baseline first.');
      process.exitCode = 1;
      return;
    }
    if (current.global.rate < prior.global.rate) {
      console.error(
        `  --regression: pass rate ${(current.global.rate * 100).toFixed(1)}% dropped below baseline ${(prior.global.rate * 100).toFixed(1)}%.`,
      );
      process.exitCode = 1;
    }
  }
}

try {
  main();
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`l1-correction-harness: ${msg}`);
  process.exit(2);
}
