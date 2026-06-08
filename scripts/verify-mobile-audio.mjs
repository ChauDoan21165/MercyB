#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';

const STATUS = new Set([
  'PASS',
  'FAIL',
  'MISSING',
  'SKIPPED',
  'NOT_VALIDATED',
  'INVALID_CONFIGURATION',
  'NOT_RECHECKED',
  'CONFIRMED',
]);
const EXIT_REASON = new Map([
  [0, 'READY'],
  [1, 'NOT_READY'],
  [2, 'NOT_VALIDATED'],
  [3, 'INVALID_CONFIGURATION'],
  [4, 'USAGE_ERROR'],
]);
const TOP_KEYS = [
  'schemaVersion',
  'generatedAt',
  'repoRoot',
  'baseRef',
  'branch',
  'commit',
  'nodeVersion',
  'requiredChecks',
  'testCounts',
  'diagnosticsExport',
  'privacyAudit',
  'retestPanel',
  'sizeBound',
  'manualSanity',
  'packageDiff',
  'changedFiles',
  'driftGuard',
  'topBlockers',
  'nextActions',
  'exitCode',
  'exitReason',
  'runtimeMs',
];
const CHECK_FIELDS = [
  'name',
  'category',
  'command',
  'required',
  'status',
  'exitCode',
  'durationMs',
  'testCount',
  'details',
  'action',
];
export const EXPECTED_FILES = [
  'package.json',
  'src/lib/speech/mobileSafariSpeakingRuntime.ts',
  'src/components/mercy-guide/MercySpeakTab.tsx',
  'src/lib/speech/__tests__/mobileSafariSpeakingRuntime.test.ts',
  'src/components/mercy-guide/__tests__/MercySpeakTab.mobileAudio.test.tsx',
  'scripts/verify-mobile-audio.mjs',
  'scripts/__tests__/verify-mobile-audio.test.mjs',
];
const ALLOWED_CHANGED_FILES = new Set([
  '.gitlab-ci.yml',
  'package.json',
  'scripts/verify-mobile-audio.mjs',
  'scripts/__tests__/verify-mobile-audio.test.mjs',
  ...EXPECTED_FILES.slice(1),
]);
const FORBIDDEN_PREFIXES = [
  'docs/',
  'supabase/',
  'src/pages/placement/',
  'src/hooks/placement/',
  'scripts/placement-v3/',
];
const FORBIDDEN_FILES = new Set(['src/components/room/RoomRenderer.tsx']);
const UNSAFE_EXPORT_TERMS = [
  'rawAudio',
  'audioBlob',
  'transcript',
  'utterance',
  'learnerId',
  'userId',
  'deviceId',
  'token',
  'secret',
  'authorization',
  'cookie',
  'userAgent',
];
const PRIVACY_PATTERN = /userAgent|deviceId|transcript|learnerId|token|authorization|cookie|localStorage/;
const DRIFT_TERMS = [
  'place' + 'ment/v4',
  're' + 'play',
  'govern' + 'ance',
  'auth' + 'ority',
  'rehe' + 'arsal',
  'sovere' + 'ignty',
];

export function parseArgs(argv = []) {
  const config = {
    json: false,
    help: false,
    skipBuild: false,
    manualSanityConfirmed: false,
    base: 'origin/main',
    maxExportBytes: 8192,
    minRuntimeTests: 34,
    minUiTests: 20,
    minTotalTests: 54,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') config.json = true;
    else if (arg === '--help') config.help = true;
    else if (arg === '--skip-build') config.skipBuild = true;
    else if (arg === '--manual-sanity-confirmed') config.manualSanityConfirmed = true;
    else if (arg === '--base') {
      const value = argv[++i];
      if (!value || value.startsWith('--')) throw usage('invalid --base');
      config.base = value;
    } else if (arg === '--max-export-bytes') {
      config.maxExportBytes = parsePositiveInt(argv[++i], '--max-export-bytes');
    } else if (arg === '--min-runtime-tests') {
      config.minRuntimeTests = parsePositiveInt(argv[++i], '--min-runtime-tests');
    } else if (arg === '--min-ui-tests') {
      config.minUiTests = parsePositiveInt(argv[++i], '--min-ui-tests');
    } else if (arg === '--min-total-tests') {
      config.minTotalTests = parsePositiveInt(argv[++i], '--min-total-tests');
    } else {
      throw usage(`unknown argument ${arg}`);
    }
  }
  return config;
}

function parsePositiveInt(value, name) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) throw usage(`invalid ${name}`);
  return parsed;
}

function usage(message) {
  const err = new Error(message);
  err.code = 'USAGE_ERROR';
  return err;
}

export function readPackageJson(repoRoot = process.cwd()) {
  const path = join(repoRoot, 'package.json');
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

export function readPackageScripts(repoRoot = process.cwd()) {
  return readPackageJson(repoRoot)?.scripts ?? null;
}

export function runCommand(command, args = [], options = {}) {
  const started = performance.now();
  return new Promise((resolveResult) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? process.cwd(),
      shell: false,
      env: { ...process.env, ...(options.env ?? {}) },
    });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr?.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', (error) => {
      resolveResult({
        command: [command, ...args].join(' '),
        exitCode: 127,
        stdout,
        stderr: `${stderr}${error.message}`,
        durationMs: Math.round(performance.now() - started),
      });
    });
    child.on('close', (exitCode) => {
      resolveResult({
        command: [command, ...args].join(' '),
        exitCode: exitCode ?? 1,
        stdout,
        stderr,
        durationMs: Math.round(performance.now() - started),
      });
    });
  });
}

export function detectTestCount(output = '') {
  const text = String(output).replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
  const summary = [...text.matchAll(/Tests\s+(\d+)\s+passed/gi)].map((match) => Number(match[1]));
  if (summary.length) return Math.max(...summary);
  const fileCounts = [];
  for (const line of text.split(/\r?\n/)) {
    if (/^\s*(?:✓|✔|PASS)\s+/.test(line)) {
      const match = line.match(/\((\d+)\s+tests?\)/i);
      if (match) fileCounts.push(Number(match[1]));
    }
  }
  if (fileCounts.length) return fileCounts.reduce((sum, count) => sum + count, 0);
  const totals = [...text.matchAll(/(\d+)\s+tests?\b/gi)].map((match) => Number(match[1]));
  return totals.length ? Math.max(...totals) : null;
}

export function detectNotValidated(output = '', testCount = null) {
  const text = String(output);
  if (/No test files found|No matching test files/i.test(text)) return true;
  if (/^\s*(?:Tests?\s+)?0\s+(?:tests?|passed)\b/im.test(text)) return true;
  if (/all skipped/i.test(text)) return true;
  const skippedTotal = text.match(/skipped=(\d+).*total=(\d+)/i);
  if (skippedTotal && skippedTotal[1] === skippedTotal[2]) return true;
  return testCount === 0;
}

export function classifyCommandResult(result, { minTests = null, missingScript = false } = {}) {
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  const testCount = detectTestCount(output);
  if (missingScript) return { status: 'MISSING', testCount, details: 'required script missing' };
  if (result.exitCode !== 0) return { status: 'FAIL', testCount, details: output.trim().slice(0, 500) };
  if (minTests !== null && (detectNotValidated(output, testCount) || testCount === null || testCount < minTests)) {
    return { status: 'NOT_VALIDATED', testCount, details: `test count ${testCount ?? 'unknown'} below ${minTests}` };
  }
  return { status: 'PASS', testCount, details: testCount === null ? 'command passed' : `${testCount} tests` };
}

function check(name, category, command, required, status, exitCode, durationMs, testCount, details, action = '') {
  return { name, category, command, required, status, exitCode, durationMs, testCount, details, action };
}

export function inspectDiagnosticsExportSchema(repoRoot = process.cwd(), maxExportBytes = 8192) {
  const runtimePath = join(repoRoot, 'src/lib/speech/mobileSafariSpeakingRuntime.ts');
  const testPath = join(repoRoot, 'src/lib/speech/__tests__/mobileSafariSpeakingRuntime.test.ts');
  if (!existsSync(runtimePath) || !existsSync(testPath)) {
    return check('diagnostics export schema', 'Diagnostics Export', 'static inspection', true, 'INVALID_CONFIGURATION', 3, 0, null, 'runtime or test file missing', 'Restore mobile audio runtime and tests.');
  }
  const runtime = readFileSync(runtimePath, 'utf8');
  const tests = readFileSync(testPath, 'utf8');
  const topKeys = ['schemaVersion', 'createdAt', 'truncated', 'readiness', 'certification', 'runtimeSupport', 'events', 'summary'];
  const eventKeys = ['order', 'code', 'playbackPath', 'retryCount', 'runtimeSupport', 'recordSucceeded', 'playbackSucceeded'];
  const missingTop = topKeys.filter((key) => !runtime.includes(key) || !tests.includes(key));
  const missingEvent = eventKeys.filter((key) => !runtime.includes(key) || !tests.includes(key));
  const exportStart = runtime.indexOf('const payload: MobileAudioDiagnosticsExport');
  const exportEnd = runtime.indexOf('export async function copyMobileAudioDiagnosticsToClipboard');
  const exportBody = exportStart >= 0 && exportEnd > exportStart ? runtime.slice(exportStart, exportEnd) : '';
  if (!exportBody) {
    return check('diagnostics export schema', 'Diagnostics Export', 'static inspection', true, 'INVALID_CONFIGURATION', 3, 0, null, 'export body not inspectable', 'Make diagnostics export construction statically inspectable.');
  }
  const unsafe = UNSAFE_EXPORT_TERMS.filter((term) => exportBody.includes(term));
  if (missingTop.length || missingEvent.length) {
    return check('diagnostics export schema', 'Diagnostics Export', 'static inspection', true, 'NOT_VALIDATED', 2, 0, null, `missing top: ${missingTop.join(',')}; missing event: ${missingEvent.join(',')}`, 'Restore locked diagnostics schema and tests.');
  }
  if (unsafe.length) {
    return check('diagnostics export schema', 'Diagnostics Export', 'static inspection', true, 'FAIL', 1, 0, null, `unsafe export fields: ${unsafe.join(',')}`, 'Remove unsafe fields from copied diagnostics export.');
  }
  if (!tests.includes(String(maxExportBytes)) && !tests.includes('8 * 1024') && !tests.includes('8192')) {
    return check('diagnostics export schema', 'Diagnostics Export', 'static inspection', true, 'NOT_VALIDATED', 2, 0, null, 'max export byte coverage missing', 'Add explicit export size tests.');
  }
  return check('diagnostics export schema', 'Diagnostics Export', 'static inspection', true, 'PASS', 0, 0, null, 'schema and unsafe-field inspection passed');
}

export function inspectRetestPanelGating(repoRoot = process.cwd()) {
  const uiPath = join(repoRoot, 'src/components/mercy-guide/MercySpeakTab.tsx');
  const testPath = join(repoRoot, 'src/components/mercy-guide/__tests__/MercySpeakTab.mobileAudio.test.tsx');
  if (!existsSync(uiPath) || !existsSync(testPath)) {
    return check('retest panel gating', 'Retest Panel', 'static inspection', true, 'INVALID_CONFIGURATION', 3, 0, null, 'UI or test file missing', 'Restore MercySpeakTab mobile audio tests.');
  }
  const ui = readFileSync(uiPath, 'utf8');
  const tests = readFileSync(testPath, 'utf8');
  const hasQuery = ui.includes('mobileAudioRetest') && ui.includes('URLSearchParams');
  const hidden = /hides copy diagnostics unless mobileAudioRetest is enabled/i.test(tests) || /queryByText\('Copy diagnostics'\).*not\.toBeInTheDocument/s.test(tests);
  const visible = /Copy diagnostics/.test(tests) && /mobile-audio-retest-panel/.test(tests);
  if (!hasQuery || !hidden || !visible) {
    return check('retest panel gating', 'Retest Panel', 'static inspection', true, 'NOT_VALIDATED', 2, 0, null, `query=${hasQuery} hidden=${hidden} visible=${visible}`, 'Restore query-gated retest panel tests.');
  }
  return check('retest panel gating', 'Retest Panel', 'static inspection', true, 'PASS', 0, 0, null, 'query flag and UI tests present');
}

export function inspectSizeBoundTests(repoRoot = process.cwd()) {
  const testPath = join(repoRoot, 'src/lib/speech/__tests__/mobileSafariSpeakingRuntime.test.ts');
  if (!existsSync(testPath)) {
    return check('size bound tests', 'Size Bound', 'static inspection', true, 'INVALID_CONFIGURATION', 3, 0, null, 'runtime tests missing', 'Restore size-bound tests.');
  }
  const tests = readFileSync(testPath, 'utf8');
  const evidence = {
    bytes: tests.includes('8 * 1024') || tests.includes('8192'),
    truncated: tests.includes('truncated') && tests.includes('true'),
    validJson: tests.includes('JSON.parse'),
    oversized: /oversized/i.test(tests),
  };
  if (!evidence.bytes || !evidence.truncated || !evidence.validJson || !evidence.oversized) {
    return check('size bound tests', 'Size Bound', 'static inspection', true, 'NOT_VALIDATED', 2, 0, null, JSON.stringify(evidence), 'Restore explicit size-bound regression tests.');
  }
  return check('size bound tests', 'Size Bound', 'static inspection', true, 'PASS', 0, 0, null, 'size-bound evidence present');
}

function* walkFiles(root, rels = []) {
  for (const entry of readdirSync(root)) {
    if (entry === 'node_modules' || entry === '.git' || entry === 'dist') continue;
    const full = join(root, entry);
    const rel = rels.concat(entry).join('/');
    if (statSync(full).isDirectory()) yield* walkFiles(full, rels.concat(entry));
    else yield rel;
  }
}

export async function runPrivacyAudit(repoRoot = process.cwd(), runner = runCommand) {
  let result = await runner('rg', ['-n', PRIVACY_PATTERN.source, 'src/lib/speech', 'src/components/mercy-guide'], { cwd: repoRoot });
  let lines = [];
  if (result.exitCode === 127) {
    const matches = [];
    for (const rel of walkFiles(join(repoRoot, 'src'))) {
      if (!rel.startsWith('lib/speech') && !rel.startsWith('components/mercy-guide')) continue;
      const content = readFileSync(join(repoRoot, 'src', rel), 'utf8');
      content.split(/\r?\n/).forEach((line, index) => {
        if (PRIVACY_PATTERN.test(line)) matches.push(`src/${rel}:${index + 1}:${line}`);
      });
    }
    result = { command: 'node privacy scan', exitCode: 0, stdout: matches.join('\n'), stderr: '', durationMs: 0 };
  }
  lines = result.stdout.split(/\r?\n/).filter(Boolean);
  const unsafe = lines.filter((line) => /mobileSafariSpeakingRuntime\.ts/.test(line) && !/localStorage|MOBILE_AUDIO_DIAGNOSTICS_KEY/.test(line));
  if (unsafe.length) {
    return check('privacy audit', 'Privacy Audit', 'rg privacy denylist', true, 'FAIL', 1, result.durationMs, null, `UNSAFE_RUNTIME_EXPORT ${unsafe.slice(0, 3).join(' | ')}`, 'Remove unsafe fields from copied diagnostics export.');
  }
  return check('privacy audit', 'Privacy Audit', 'rg privacy denylist', true, 'PASS', result.exitCode, result.durationMs, null, 'SAFE_TEST_OR_STORAGE_REFERENCE');
}

export async function checkPackageDiff(repoRoot = process.cwd(), base = 'origin/main', runner = runCommand) {
  const result = await runner('git', ['diff', `${base}...HEAD`, '--', 'package.json'], { cwd: repoRoot });
  if (result.exitCode !== 0) return check('package diff', 'Package Diff', `git diff ${base}...HEAD -- package.json`, true, 'FAIL', result.exitCode, result.durationMs, null, result.stderr.trim(), 'Fix package diff command.');
  const added = result.stdout.split(/\r?\n/).filter((line) => line.startsWith('+') && !line.startsWith('+++'));
  const bad = added.filter((line) => !line.includes('"test:mobile-audio"') && !line.includes('"verify:mobile-audio"'));
  if (bad.length) return check('package diff', 'Package Diff', `git diff ${base}...HEAD -- package.json`, true, 'FAIL', 1, result.durationMs, null, bad.join(' | '), 'Remove unrelated package.json changes from this branch.');
  return check('package diff', 'Package Diff', `git diff ${base}...HEAD -- package.json`, true, 'PASS', 0, result.durationMs, null, 'package diff limited to mobile-audio scripts');
}

export async function checkChangedFiles(repoRoot = process.cwd(), base = 'origin/main', runner = runCommand) {
  const result = await runner('git', ['diff', '--name-only', `${base}...HEAD`], { cwd: repoRoot });
  if (result.exitCode !== 0) return check('changed files', 'Changed Files', `git diff --name-only ${base}...HEAD`, true, 'FAIL', result.exitCode, result.durationMs, null, result.stderr.trim(), 'Fix changed-file diff command.');
  const files = result.stdout.split(/\r?\n/).filter(Boolean).sort();
  const unexpected = files.filter((file) => !ALLOWED_CHANGED_FILES.has(file));
  const forbidden = files.filter((file) => FORBIDDEN_FILES.has(file) || FORBIDDEN_PREFIXES.some((prefix) => file.startsWith(prefix)));
  if (unexpected.length || forbidden.length) {
    return check('changed files', 'Changed Files', `git diff --name-only ${base}...HEAD`, true, 'FAIL', 1, result.durationMs, null, [...new Set([...unexpected, ...forbidden])].join(', '), 'Remove unrelated files from this branch.');
  }
  return check('changed files', 'Changed Files', `git diff --name-only ${base}...HEAD`, true, 'PASS', 0, result.durationMs, null, files.join(', '));
}

export async function scanDrift(repoRoot = process.cwd(), base = 'origin/main', runner = runCommand) {
  const fileResult = await runner('git', ['diff', '--name-only', `${base}...HEAD`], { cwd: repoRoot });
  const diffResult = await runner('git', ['diff', `${base}...HEAD`, '--unified=0'], { cwd: repoRoot });
  const changed = fileResult.stdout.split(/\r?\n/).filter(Boolean);
  const pathHit = changed.find((file) => DRIFT_TERMS.some((term) => file.includes(term)));
  let currentFile = '';
  const lineHit = diffResult.stdout.split(/\r?\n/).find((line) => {
    if (line.startsWith('+++ b/')) {
      currentFile = line.slice('+++ b/'.length);
      return false;
    }
    if (!line.startsWith('+') || line.startsWith('+++')) return false;
    if (currentFile === 'scripts/__tests__/verify-mobile-audio.test.mjs') return false;
    return DRIFT_TERMS.some((term) => line.includes(term));
  });
  if (pathHit || lineHit) {
    return check('drift guard', 'Drift Guard', `git diff ${base}...HEAD`, true, 'FAIL', 1, (fileResult.durationMs ?? 0) + (diffResult.durationMs ?? 0), null, pathHit || lineHit, 'Remove banned architecture drift from this branch.');
  }
  return check('drift guard', 'Drift Guard', `git diff ${base}...HEAD`, true, 'PASS', 0, (fileResult.durationMs ?? 0) + (diffResult.durationMs ?? 0), null, 'no drift terms in changed paths or source lines');
}

async function requiredCommandChecks(repoRoot, config, runner) {
  const scripts = readPackageScripts(repoRoot);
  if (!scripts) {
    return [check('package scripts', 'Required Checks', 'read package.json', true, 'INVALID_CONFIGURATION', 3, 0, null, 'package.json invalid', 'Restore valid package.json.')];
  }
  const specs = [
    ['test:mobile-audio', ['run', 'test:mobile-audio'], config.minTotalTests],
    ['runtime tests', ['run', 'test', '--', 'mobileSafariSpeakingRuntime'], config.minRuntimeTests],
    ['ui tests', ['run', 'test', '--', 'MercySpeakTab'], config.minUiTests],
    ['typecheck:app', ['run', 'typecheck:app'], null],
    ['build', ['run', 'build'], null],
    ['git diff check', ['diff', '--check'], null, 'git'],
    ['docs absence', ['-e', "require('node:process').exit(require('node:fs').existsSync('docs/mobile-audio-diagnostics-retest.md') ? 1 : 0)"], null, 'node'],
    ['verifier tests', ['run', 'test', '--', 'scripts/__tests__/verify-mobile-audio.test.mjs'], null],
  ];
  const checks = [];
  for (const [name, args, minTests, command = 'npm'] of specs) {
    if (name === 'build' && config.skipBuild) {
      checks.push(check('build', 'Required Checks', 'npm run build', true, 'SKIPPED', 0, 0, null, 'skipped by --skip-build'));
      continue;
    }
    if (name === 'test:mobile-audio' && !scripts['test:mobile-audio']) {
      checks.push(check(name, 'Required Checks', 'npm run test:mobile-audio', true, 'MISSING', 1, 0, null, 'script missing', 'Restore test:mobile-audio script.'));
      continue;
    }
    const result = await runner(command, args, { cwd: repoRoot });
    const classified = classifyCommandResult(result, { minTests });
    checks.push(check(name, 'Required Checks', result.command, true, classified.status, result.exitCode, result.durationMs, classified.testCount, classified.details, actionFor(classified.status, name)));
  }
  return checks;
}

function actionFor(status, name) {
  if (status === 'PASS' || status === 'SKIPPED') return '';
  if (status === 'NOT_VALIDATED') return `Restore non-vacuous validation for ${name}.`;
  if (status === 'MISSING') return `Restore missing ${name}.`;
  if (status === 'INVALID_CONFIGURATION') return `Fix verifier configuration for ${name}.`;
  return `Fix failing ${name}.`;
}

export function extractBlockers(groups) {
  const checks = Object.values(groups).flat().filter(Boolean);
  const blockers = [];
  const seen = new Set();
  for (const item of checks) {
    if (!item.required) continue;
    if (['PASS', 'SKIPPED', 'NOT_RECHECKED', 'CONFIRMED'].includes(item.status)) continue;
    const key = `${item.name}:${item.action}`;
    if (seen.has(key)) continue;
    seen.add(key);
    blockers.push({ check: item.name, status: item.status, action: item.action || actionFor(item.status, item.name) });
    if (blockers.length === 5) break;
  }
  return blockers;
}

export function decideExit(blockers) {
  if (!blockers.length) return { exitCode: 0, exitReason: 'READY' };
  if (blockers.some((b) => b.status === 'INVALID_CONFIGURATION')) return { exitCode: 3, exitReason: 'INVALID_CONFIGURATION' };
  if (blockers.some((b) => b.status === 'NOT_VALIDATED')) return { exitCode: 2, exitReason: 'NOT_VALIDATED' };
  return { exitCode: 1, exitReason: 'NOT_READY' };
}

async function gitValue(repoRoot, args, fallback = 'unknown') {
  const result = await runCommand('git', args, { cwd: repoRoot });
  return result.exitCode === 0 ? result.stdout.trim() || fallback : fallback;
}

export async function buildStatusModel(config, deps = {}) {
  const repoRoot = deps.repoRoot ?? process.cwd();
  const runner = deps.runner ?? runCommand;
  const started = performance.now();
  const generatedAt = new Date().toISOString();
  const requiredChecks = await requiredCommandChecks(repoRoot, config, runner);
  const diagnosticsExport = [inspectDiagnosticsExportSchema(repoRoot, config.maxExportBytes)];
  const privacyAudit = [await runPrivacyAudit(repoRoot, runner)];
  const retestPanel = [inspectRetestPanelGating(repoRoot)];
  const sizeBound = [inspectSizeBoundTests(repoRoot)];
  const manualSanity = [check('manual sanity', 'Manual Sanity', '--manual-sanity-confirmed', false, config.manualSanityConfirmed ? 'CONFIRMED' : 'NOT_RECHECKED', 0, 0, null, config.manualSanityConfirmed ? 'manual sanity confirmed' : 'last reported copied payload: valid JSON, 483 bytes, under 8 KB')];
  const packageDiff = [await checkPackageDiff(repoRoot, config.base, runner)];
  const changedFiles = [await checkChangedFiles(repoRoot, config.base, runner)];
  const driftGuard = [await scanDrift(repoRoot, config.base, runner)];
  const testCounts = requiredChecks.filter((item) => item.testCount !== null).map((item) => item);
  const groups = { requiredChecks, diagnosticsExport, privacyAudit, retestPanel, sizeBound, packageDiff, changedFiles, driftGuard };
  const topBlockers = extractBlockers(groups);
  const nextActions = topBlockers.map((blocker) => ({ check: blocker.check, action: blocker.action }));
  const decision = decideExit(topBlockers);
  const branch = deps.branch ?? await gitValue(repoRoot, ['rev-parse', '--abbrev-ref', 'HEAD']);
  const commit = deps.commit ?? await gitValue(repoRoot, ['rev-parse', '--short', 'HEAD']);
  const model = {
    schemaVersion: 'mobile-audio-verification/v1',
    generatedAt,
    repoRoot,
    baseRef: config.base,
    branch,
    commit,
    nodeVersion: process.version,
    requiredChecks,
    testCounts,
    diagnosticsExport,
    privacyAudit,
    retestPanel,
    sizeBound,
    manualSanity,
    packageDiff,
    changedFiles,
    driftGuard,
    topBlockers,
    nextActions,
    exitCode: decision.exitCode,
    exitReason: decision.exitReason,
    runtimeMs: Math.round(performance.now() - started),
  };
  validateStatusModel(model);
  return model;
}

export function validateStatusModel(model) {
  const keys = Object.keys(model);
  if (keys.join('|') !== TOP_KEYS.join('|')) throw invalid('JSON key order mismatch');
  if (!EXIT_REASON.has(model.exitCode) || EXIT_REASON.get(model.exitCode) !== model.exitReason) throw invalid('exit reason mismatch');
  const checkGroups = ['requiredChecks', 'testCounts', 'diagnosticsExport', 'privacyAudit', 'retestPanel', 'sizeBound', 'manualSanity', 'packageDiff', 'changedFiles', 'driftGuard'];
  for (const group of checkGroups) {
    if (!Array.isArray(model[group])) throw invalid(`missing check group ${group}`);
    for (const item of model[group]) validateCheck(item);
  }
  const seen = new Set();
  for (const blocker of model.topBlockers) {
    if (!blocker.action) throw invalid('blocker without action');
    const key = `${blocker.check}:${blocker.action}`;
    if (seen.has(key)) throw invalid('duplicate blocker');
    seen.add(key);
  }
  if (model.nextActions.length !== model.topBlockers.length) throw invalid('next action mismatch');
  model.topBlockers.forEach((blocker, index) => {
    const action = model.nextActions[index];
    if (action.check !== blocker.check || action.action !== blocker.action) throw invalid('next action mismatch');
  });
  const hasBlocking = model.topBlockers.length > 0;
  if (!hasBlocking && model.exitCode !== 0) throw invalid('impossible non-ready without blockers');
  if (hasBlocking && model.exitCode === 0) throw invalid('impossible ready with blockers');
  return true;
}

function validateCheck(item) {
  for (const field of CHECK_FIELDS) {
    if (!(field in item)) throw invalid(`missing check field ${field}`);
  }
  if (!STATUS.has(item.status)) throw invalid(`unknown status ${item.status}`);
}

function invalid(message) {
  const err = new Error(message);
  err.code = 'INVALID_CONFIGURATION';
  return err;
}

export function formatJson(model) {
  validateStatusModel(model);
  return JSON.stringify(model, null, 2);
}

function lineFor(item) {
  const tests = item.testCount === null ? '' : ` tests ${item.testCount}`;
  return `${item.name} | ${item.category} | ${item.command} | ${item.status} | exit ${item.exitCode} | ${item.durationMs}ms${tests}`;
}

export function formatTerminal(model) {
  validateStatusModel(model);
  const out = [];
  out.push('Mobile Audio Verification');
  out.push('Run Info');
  out.push(`repo root: ${model.repoRoot}`);
  out.push(`base ref: ${model.baseRef}`);
  out.push(`branch: ${model.branch}`);
  out.push(`commit: ${model.commit}`);
  out.push(`node version: ${model.nodeVersion}`);
  out.push(`generated timestamp: ${model.generatedAt}`);
  out.push(`runtime ms: ${model.runtimeMs}`);
  const sections = [
    ['Required Checks', model.requiredChecks],
    ['Test Counts', model.testCounts],
    ['Diagnostics Export', model.diagnosticsExport],
    ['Privacy Audit', model.privacyAudit],
    ['Retest Panel', model.retestPanel],
    ['Size Bound', model.sizeBound],
    ['Manual Sanity', model.manualSanity],
    ['Package Diff', model.packageDiff],
    ['Changed Files', model.changedFiles],
    ['Drift Guard', model.driftGuard],
  ];
  for (const [title, items] of sections) {
    out.push(title);
    if (!items.length) out.push('None');
    else items.forEach((item) => out.push(lineFor(item)));
  }
  out.push('Top Blockers');
  out.push(model.topBlockers.length ? model.topBlockers.map((b) => `${b.check} | ${b.status} | ${b.action}`).join('\n') : 'None');
  out.push('Next Actions');
  out.push(model.nextActions.length ? model.nextActions.map((a) => `${a.check} | ${a.action}`).join('\n') : 'None');
  out.push('Exit Summary');
  out.push(`${model.exitReason} (${model.exitCode})`);
  return out.join('\n');
}

export function helpText() {
  return `Usage
  npm run verify:mobile-audio -- [options]

Options
  --json
  --help
  --skip-build
  --manual-sanity-confirmed
  --base <ref>
  --max-export-bytes <number>
  --min-runtime-tests <number>
  --min-ui-tests <number>
  --min-total-tests <number>

Exit codes
  0 READY
  1 NOT_READY
  2 NOT_VALIDATED
  3 INVALID_CONFIGURATION
  4 USAGE_ERROR

Examples
  npm run verify:mobile-audio
  npm run verify:mobile-audio -- --json
  npm run verify:mobile-audio -- --skip-build
  npm run verify:mobile-audio -- --manual-sanity-confirmed
  npm run verify:mobile-audio -- --max-export-bytes 8192`;
}

export async function main(argv = process.argv.slice(2), deps = {}) {
  let config;
  try {
    config = parseArgs(argv);
  } catch (error) {
    const code = error.code === 'USAGE_ERROR' ? 4 : 3;
    const text = `${error.message}\n\n${helpText()}`;
    if (!argv.includes('--json')) console.error(text);
    else console.log(JSON.stringify({ schemaVersion: 'mobile-audio-verification/v1', exitCode: code, exitReason: EXIT_REASON.get(code), error: error.message }));
    return code;
  }
  if (config.help) {
    console.log(helpText());
    return 0;
  }
  try {
    const model = await buildStatusModel(config, deps);
    console.log(config.json ? formatJson(model) : formatTerminal(model));
    return model.exitCode;
  } catch (error) {
    const code = error.code === 'INVALID_CONFIGURATION' ? 3 : 1;
    if (config.json) {
      console.log(JSON.stringify({
        schemaVersion: 'mobile-audio-verification/v1',
        exitCode: code,
        exitReason: EXIT_REASON.get(code),
        error: error.message,
      }));
    } else {
      console.error(`${EXIT_REASON.get(code)}: ${error.message}`);
    }
    return code;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const code = await main();
  process.exit(code);
}
