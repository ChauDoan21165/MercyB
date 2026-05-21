#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SCHEMA_VERSION = 'ops-morning/v1';
export const STATUS = Object.freeze([
  'PASS',
  'FAIL',
  'MISSING',
  'SKIPPED',
  'NOT_VALIDATED',
  'FALSE_GREEN_RISK',
  'STATUS UNKNOWN',
  'INVALID_CONFIGURATION',
]);
export const EXIT_REASONS = Object.freeze({
  0: 'READY_OR_UNKNOWN',
  1: 'NOT_READY',
  2: 'NOT_VALIDATED',
  3: 'INVALID_CONFIGURATION',
  4: 'USAGE_ERROR',
});
export const JSON_KEYS = Object.freeze([
  'schemaVersion',
  'generatedAt',
  'repoRoot',
  'baseRef',
  'branch',
  'commit',
  'nodeVersion',
  'requiredChecks',
  'optionalChecks',
  'remoteServices',
  'mobileAudio',
  'v3Resume',
  'validationIntegrity',
  'buildReadiness',
  'branchSafety',
  'packageDiff',
  'driftGuard',
  'topBlockers',
  'nextActions',
  'exitCode',
  'exitReason',
  'runtimeMs',
]);

const OPTIONAL_SCRIPTS = ['validate:tests', 'test:mobile-audio', 'test:resume', 'verify:v3-placement'];
const REQUIRED_SCRIPTS = ['mb:status', 'typecheck:app', 'build'];
const ALLOWED_CHANGED_PATHS = new Set([
  'package.json',
  'scripts/ops-morning.mjs',
  'scripts/__tests__/ops-morning.test.mjs',
  'scripts/morning-status.mjs',
  'scripts/__tests__/morning-status.test.mjs',
]);
const ALLOWED_PACKAGE_SCRIPT_ADDITIONS = new Set([
  'mb:status',
  'ops:morning',
  'validate:tests',
  'test:mobile-audio',
  'test:resume',
  'verify:v3-placement',
]);
const DRIFT_TERMS = ['placement/' + 'v4', 'rep' + 'lay', 'govern' + 'ance', 'auth' + 'ority', 'rehear' + 'sal', 'sovere' + 'ignty'];

function nowIso() {
  return new Date().toISOString();
}

export function parseArgs(argv = []) {
  const options = {
    json: false,
    help: false,
    skipBuild: false,
    skipRemote: false,
    skipOptional: false,
    baseRef: 'origin/main',
    maxRuntimeMs: 300000,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--json') options.json = true;
    else if (arg === '--help') options.help = true;
    else if (arg === '--skip-build') options.skipBuild = true;
    else if (arg === '--skip-remote') options.skipRemote = true;
    else if (arg === '--skip-optional') options.skipOptional = true;
    else if (arg === '--base') {
      const value = argv[++index];
      if (!value || value.startsWith('-') || /[\s;|&]/.test(value)) return usageError(`invalid --base: ${value || ''}`);
      options.baseRef = value;
    } else if (arg === '--max-runtime-ms') {
      const value = argv[++index];
      const parsed = Number(value);
      if (!Number.isInteger(parsed) || parsed <= 0) return usageError(`invalid --max-runtime-ms: ${value || ''}`);
      options.maxRuntimeMs = parsed;
    } else {
      return usageError(`unknown argument: ${arg}`);
    }
  }
  return { ok: true, options };
}

function usageError(message) {
  return { ok: false, exitCode: 4, exitReason: EXIT_REASONS[4], message };
}

export function formatHelp() {
  return [
    'Usage',
    '  npm run ops:morning -- [options]',
    '',
    'Options',
    '  --json                 Print JSON only.',
    '  --help                 Print this help.',
    '  --skip-build           Skip build only; typecheck still runs.',
    '  --skip-remote          Skip remote service summaries from mb:status.',
    '  --skip-optional        Skip optional checks.',
    '  --base <ref>           Base ref for branch/package checks. Default: origin/main.',
    '  --max-runtime-ms <ms>   Runtime budget. Default: 300000.',
    '',
    'Exit codes',
    '  0 READY_OR_UNKNOWN',
    '  1 NOT_READY',
    '  2 NOT_VALIDATED',
    '  3 INVALID_CONFIGURATION',
    '  4 USAGE_ERROR',
    '',
    'Examples',
    '  npm run ops:morning',
    '  npm run ops:morning -- --json',
    '  npm run ops:morning -- --skip-build',
    '  npm run ops:morning -- --skip-optional',
    '  npm run ops:morning -- --base origin/main',
  ].join('\n');
}

export function readPackageJson(repoRoot) {
  const packagePath = path.join(repoRoot, 'package.json');
  const parsed = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  if (!parsed || typeof parsed !== 'object' || (parsed.scripts && typeof parsed.scripts !== 'object')) {
    throw new Error('malformed package.json scripts object');
  }
  return parsed;
}

export function makeCheck(overrides) {
  return {
    name: '',
    category: '',
    command: '',
    required: false,
    status: 'PASS',
    exitCode: null,
    durationMs: 0,
    testCount: null,
    details: '',
    action: '',
    ...overrides,
  };
}

export async function runCommand(command, args = [], options = {}) {
  const started = Date.now();
  const timeoutMs = options.timeoutMs || 300000;
  return await new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: { ...process.env, ...(options.env || {}) },
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
    }, timeoutMs);
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', (error) => {
      clearTimeout(timer);
      resolve({ exitCode: 1, stdout, stderr: `${stderr}${error.message}`, durationMs: Date.now() - started, timedOut });
    });
    child.on('close', (exitCode) => {
      clearTimeout(timer);
      resolve({ exitCode: timedOut ? 1 : (exitCode ?? 1), stdout, stderr, durationMs: Date.now() - started, timedOut });
    });
  });
}

export function detectTestCount(output = '') {
  const text = String(output);
  const patterns = [
    /Tests\s+(\d+)\s+passed/i,
    /(\d+)\s+tests?\s+passed/i,
    /(\d+)\s+tests?/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return Number(match[1]);
  }
  return null;
}

export function detectNotValidated(output = '') {
  const text = String(output);
  if (/\b0\s+tests?\b/i.test(text)) return true;
  if (/\b0\s+passed\b/i.test(text)) return true;
  if (/No test files found/i.test(text)) return true;
  if (/No matching test files/i.test(text)) return true;
  if (/all skipped/i.test(text)) return true;
  const skipped = text.match(/skipped[=:]\s*(\d+).*?(?:total[=:]\s*)?(\d+)/i);
  return Boolean(skipped && skipped[1] === skipped[2]);
}

function commandString(command, args = []) {
  return [command, ...args].join(' ');
}

export function classifyCommandResult({ name, category, command, args = [], required, result, isTest = false }) {
  const output = `${result.stdout || ''}\n${result.stderr || ''}`;
  const testCount = isTest ? detectTestCount(output) : null;
  if (result.timedOut) {
    return makeCheck({
      name,
      category,
      command: commandString(command, args),
      required,
      status: 'FAIL',
      exitCode: result.exitCode,
      durationMs: result.durationMs,
      testCount,
      details: 'Command exceeded runtime budget.',
      action: 'Inspect the timed out command before continuing.',
    });
  }
  if (isTest && result.exitCode === 0 && (detectNotValidated(output) || testCount === 0)) {
    return makeCheck({
      name,
      category,
      command: commandString(command, args),
      required,
      status: 'NOT_VALIDATED',
      exitCode: result.exitCode,
      durationMs: result.durationMs,
      testCount: testCount ?? 0,
      details: 'Test command did not validate any tests.',
      action: 'Fix the test command so it runs at least one matching test.',
    });
  }
  return makeCheck({
    name,
    category,
    command: commandString(command, args),
    required,
    status: result.exitCode === 0 ? 'PASS' : 'FAIL',
    exitCode: result.exitCode,
    durationMs: result.durationMs,
    testCount,
    details: result.exitCode === 0 ? 'Command completed.' : trimOutput(output),
    action: result.exitCode === 0 ? '' : `Fix ${name} before merge.`,
  });
}

function trimOutput(output) {
  const line = String(output).split('\n').map((part) => part.trim()).find(Boolean);
  return line ? line.slice(0, 240) : 'Command failed.';
}

export function parseMbStatusJson(stdout = '') {
  const trimmed = String(stdout).trim();
  const firstBrace = trimmed.indexOf('{');
  if (firstBrace < 0) throw new Error('mb:status JSON missing object');
  const parsed = JSON.parse(trimmed.slice(firstBrace));
  if (!parsed?.schemaVersion || !String(parsed.schemaVersion).startsWith('mb-status/')) {
    throw new Error('invalid mb:status schema');
  }
  return parsed;
}

function serviceCheck(name, state) {
  const status = state === 'FAIL' ? 'FAIL' : state === 'ENV MALFORMED' || state === 'MALFORMED_ENV' ? 'INVALID_CONFIGURATION' : state === 'PASS' || state === 'ENV PRESENT' || state === 'READY' ? 'PASS' : 'STATUS UNKNOWN';
  return makeCheck({
    name,
    category: 'Remote Services',
    command: 'npm run mb:status -- --json',
    required: false,
    status,
    exitCode: null,
    details: `${name}: ${state || 'STATUS UNKNOWN'}`,
    action: status === 'FAIL' ? `Fix ${name} service status.` : status === 'INVALID_CONFIGURATION' ? `Fix malformed ${name} configuration.` : '',
  });
}

export async function collectMbStatus({ repoRoot, runner, maxRuntimeMs, skipRemote }) {
  const run = runner || runCommand;
  const jsonResult = await run('npm', ['run', 'mb:status', '--', '--json'], { cwd: repoRoot, timeoutMs: maxRuntimeMs });
  let parsed = null;
  let jsonError = null;
  try {
    if (jsonResult.exitCode === 0) parsed = parseMbStatusJson(jsonResult.stdout);
  } catch (error) {
    jsonError = error;
  }
  if (!parsed) {
    const plain = await run('npm', ['run', 'mb:status'], { cwd: repoRoot, timeoutMs: maxRuntimeMs });
    return {
      parsed: null,
      mbCheck: classifyCommandResult({
        name: 'mb:status',
        category: 'Required Checks',
        command: 'npm',
        args: ['run', 'mb:status'],
        required: true,
        result: plain,
      }),
      remoteServices: ['GitHub', 'Actions', 'Vercel', 'Supabase'].map((name) =>
        makeCheck({ name, category: 'Remote Services', command: 'npm run mb:status', required: false, status: skipRemote ? 'SKIPPED' : 'STATUS UNKNOWN', details: skipRemote ? 'Skipped by --skip-remote.' : 'Detailed state unavailable.', action: '' }),
      ),
      azureSpeech: serviceCheck('Azure Speech', 'STATUS UNKNOWN'),
      localValidation: 'UNKNOWN',
      mobileAudioState: 'UNKNOWN',
      buildReadiness: 'UNKNOWN',
      fallbackError: jsonError?.message || (jsonResult.exitCode === 0 ? '' : 'mb:status JSON unavailable'),
    };
  }
  const services = parsed.remoteServices || parsed.services || {};
  const keyAliases = {
    GitHub: ['GitHub', 'github'],
    Actions: ['Actions', 'actions'],
    Vercel: ['Vercel', 'vercel'],
    Supabase: ['Supabase', 'supabase'],
    'Azure Speech': ['Azure Speech', 'azureSpeech'],
  };
  const stateFor = (key, fallback = 'STATUS UNKNOWN') => {
    const aliases = keyAliases[key] || [key];
    let value = fallback;
    for (const alias of aliases) {
      value = services[alias]?.status || parsed[alias]?.status || parsed[alias] || value;
    }
    return typeof value === 'string' ? value : fallback;
  };
  const remoteNames = ['GitHub', 'Actions', 'Vercel', 'Supabase'];
  return {
    parsed,
    mbCheck: makeCheck({
      name: 'mb:status',
      category: 'Required Checks',
      command: 'npm run mb:status',
      required: true,
      status: 'PASS',
      exitCode: jsonResult.exitCode,
      durationMs: jsonResult.durationMs,
      details: 'mb:status JSON parsed.',
      action: '',
    }),
    remoteServices: remoteNames.map((name) => {
      const state = skipRemote ? 'SKIPPED' : stateFor(name, 'STATUS UNKNOWN');
      return skipRemote
        ? makeCheck({ name, category: 'Remote Services', command: 'npm run mb:status -- --json', required: false, status: 'SKIPPED', details: 'Skipped by --skip-remote.', action: '' })
        : serviceCheck(name, state);
    }),
    azureSpeech: serviceCheck('Azure Speech', stateFor('Azure Speech', parsed.azureSpeech?.status || 'STATUS UNKNOWN')),
    localValidation: parsed.localValidation?.status || parsed.localValidation || 'UNKNOWN',
    mobileAudioState: parsed.mobileAudio?.status || parsed.mobileAudio || 'UNKNOWN',
    buildReadiness: parsed.buildReadiness?.status || parsed.buildReadiness || 'UNKNOWN',
    topBlockers: parsed.topBlockers || [],
  };
}

async function runRequiredChecks({ scripts, repoRoot, runner, skipBuild, maxRuntimeMs, mbCheck }) {
  const run = runner || runCommand;
  const checks = [mbCheck];
  if (!scripts['typecheck:app']) {
    checks.push(missingCheck('typecheck:app', 'Required Checks', 'npm run typecheck:app', true));
  } else {
    checks.push(classifyCommandResult({ name: 'typecheck:app', category: 'Required Checks', command: 'npm', args: ['run', 'typecheck:app'], required: true, result: await run('npm', ['run', 'typecheck:app'], { cwd: repoRoot, timeoutMs: maxRuntimeMs }) }));
  }
  if (skipBuild) {
    checks.push(makeCheck({ name: 'build', category: 'Required Checks', command: 'npm run build', required: true, status: 'SKIPPED', details: 'Skipped by --skip-build.', action: '' }));
  } else if (!scripts.build) {
    checks.push(missingCheck('build', 'Required Checks', 'npm run build', true));
  } else {
    checks.push(classifyCommandResult({ name: 'build', category: 'Required Checks', command: 'npm', args: ['run', 'build'], required: true, result: await run('npm', ['run', 'build'], { cwd: repoRoot, timeoutMs: maxRuntimeMs }) }));
  }
  checks.push(classifyCommandResult({ name: 'git diff --check', category: 'Required Checks', command: 'git', args: ['diff', '--check'], required: true, result: await run('git', ['diff', '--check'], { cwd: repoRoot, timeoutMs: maxRuntimeMs }) }));
  return checks;
}

function missingCheck(name, category, command, required) {
  return makeCheck({
    name,
    category,
    command,
    required,
    status: 'MISSING',
    details: `${name} script is missing.`,
    action: required ? `Add or restore ${name} before running this gate.` : '',
  });
}

async function runOptionalChecks({ scripts, repoRoot, runner, skipOptional, maxRuntimeMs }) {
  const run = runner || runCommand;
  const specs = [
    { script: 'validate:tests', args: ['--', '--pattern', 'definitelyNoSuchMercyPattern'], isTest: true },
    { script: 'test:mobile-audio', args: [], isTest: true },
    { script: 'test:resume', args: [], isTest: true },
    { script: 'verify:v3-placement', args: ['--', '--skip-build'], isTest: false },
  ];
  const checks = [];
  for (const spec of specs) {
    const command = `npm run ${spec.script}${spec.args.length ? ` ${spec.args.join(' ')}` : ''}`;
    if (skipOptional) {
      checks.push(makeCheck({ name: spec.script, category: 'Optional Checks', command, required: false, status: 'SKIPPED', details: 'Skipped by --skip-optional.', action: '' }));
    } else if (!scripts[spec.script]) {
      checks.push(missingCheck(spec.script, 'Optional Checks', command, false));
    } else {
      checks.push(makeCheck({
        name: spec.script,
        category: 'Optional Checks',
        command,
        required: false,
        status: 'STATUS UNKNOWN',
        details: 'Optional script is present but is not executed by ops:morning by default.',
        action: '',
      }));
    }
  }
  return checks;
}

function classifyValidationGuard(result, command) {
  if (result.exitCode === 2) {
    return makeCheck({ name: 'validate:tests', category: 'Optional Checks', command, required: false, status: 'PASS', exitCode: 2, durationMs: result.durationMs, testCount: 0, details: 'Impossible pattern returned expected non-vacuous guard exit.', action: '' });
  }
  if (result.exitCode === 0) {
    return makeCheck({ name: 'validate:tests', category: 'Optional Checks', command, required: false, status: 'FALSE_GREEN_RISK', exitCode: 0, durationMs: result.durationMs, testCount: detectTestCount(result.stdout), details: 'Impossible pattern exited 0.', action: 'Fix validate:tests so impossible patterns cannot pass.' });
  }
  return makeCheck({ name: 'validate:tests', category: 'Optional Checks', command, required: false, status: 'FAIL', exitCode: result.exitCode, durationMs: result.durationMs, testCount: detectTestCount(result.stdout), details: trimOutput(`${result.stdout}\n${result.stderr}`), action: 'Fix validate:tests guard failure.' });
}

export async function checkBranchSafety({ repoRoot, baseRef, runner }) {
  const run = runner || runCommand;
  const [branch, commit, status, changed] = await Promise.all([
    run('git', ['branch', '--show-current'], { cwd: repoRoot }),
    run('git', ['rev-parse', '--short', 'HEAD'], { cwd: repoRoot }),
    run('git', ['status', '--porcelain'], { cwd: repoRoot }),
    run('git', ['diff', '--name-only', `${baseRef}...HEAD`], { cwd: repoRoot }),
  ]);
  const lines = status.stdout.split('\n').filter(Boolean);
  const stagedCount = lines.filter((line) => line[0] !== ' ' && line[0] !== '?').length;
  const unstagedCount = lines.filter((line) => line[1] && line[1] !== ' ').length;
  const untrackedCount = lines.filter((line) => line.startsWith('??')).length;
  const changedFiles = changed.exitCode === 0 ? changed.stdout.split('\n').filter(Boolean) : [];
  const unrelated = changedFiles.filter((file) => !ALLOWED_CHANGED_PATHS.has(file));
  const isDirty = lines.length > 0;
  return {
    baseRef,
    branch: branch.stdout.trim() || 'DETACHED',
    commit: commit.stdout.trim() || 'UNKNOWN',
    isDirty,
    stagedCount,
    unstagedCount,
    untrackedCount,
    changedFiles,
    status: unrelated.length ? 'FAIL' : 'PASS',
    action: unrelated.length ? 'Remove unrelated files from this PR or split them into a separate PR.' : '',
  };
}

export async function checkPackageDiff({ repoRoot, baseRef, runner }) {
  const run = runner || runCommand;
  const result = await run('git', ['diff', `${baseRef}...HEAD`, '--', 'package.json'], { cwd: repoRoot });
  const addedScripts = [];
  for (const line of result.stdout.split('\n')) {
    const match = line.match(/^\+\s+"([^"]+)":\s+"/);
    if (match) addedScripts.push(match[1]);
  }
  const rejected = addedScripts.filter((script) => !ALLOWED_PACKAGE_SCRIPT_ADDITIONS.has(script));
  return {
    status: result.exitCode === 0 && rejected.length === 0 ? 'PASS' : 'FAIL',
    addedScripts,
    rejectedScripts: rejected,
    action: rejected.length ? 'Remove unrelated package.json changes from this branch.' : '',
  };
}

export async function scanDrift({ repoRoot, baseRef, runner }) {
  const run = runner || runCommand;
  const [paths, diff] = await Promise.all([
    run('git', ['diff', '--name-only', `${baseRef}...HEAD`], { cwd: repoRoot }),
    run('git', ['diff', `${baseRef}...HEAD`], { cwd: repoRoot }),
  ]);
  const pathHits = [];
  const lineHits = [];
  for (const file of paths.stdout.split('\n').filter(Boolean)) {
    for (const term of DRIFT_TERMS) if (file.includes(term)) pathHits.push({ file, term });
  }
  let currentFile = '';
  for (const line of diff.stdout.split('\n')) {
    const fileMatch = line.match(/^\+\+\+ b\/(.+)/);
    if (fileMatch) currentFile = fileMatch[1];
    if (!line.startsWith('+') || line.startsWith('+++')) continue;
    for (const term of DRIFT_TERMS) {
      if (line.includes(term) && currentFile !== 'scripts/__tests__/ops-morning.test.mjs') {
        lineHits.push({ file: currentFile, term });
      }
    }
  }
  const failed = pathHits.length > 0 || lineHits.length > 0;
  return {
    status: failed ? 'FAIL' : 'PASS',
    pathHits,
    lineHits,
    action: failed ? 'Remove banned architecture drift from this branch.' : '',
  };
}

export function extractBlockers(model) {
  const blockers = [];
  const add = (check, status, action) => {
    if (!action || blockers.some((item) => item.check === check && item.action === action)) return;
    blockers.push({ check, status, action });
  };
  for (const check of [...model.requiredChecks, ...model.optionalChecks, ...model.remoteServices]) {
    if (['FAIL', 'MISSING', 'NOT_VALIDATED', 'FALSE_GREEN_RISK', 'INVALID_CONFIGURATION'].includes(check.status)) {
      if (check.status === 'MISSING' && !check.required) continue;
      add(check.name, check.status, check.action || `Fix ${check.name}.`);
    }
  }
  if (model.branchSafety.isDirty) add('Branch Safety', 'DIRTY', 'Review, commit, or stash local changes before merging.');
  if (model.branchSafety.status === 'FAIL') add('Branch Safety', 'FAIL', model.branchSafety.action);
  if (model.packageDiff.status === 'FAIL') add('Package Diff', 'FAIL', model.packageDiff.action);
  if (model.driftGuard.status === 'FAIL') add('Drift Guard', 'FAIL', model.driftGuard.action);
  return blockers.slice(0, 5);
}

export function decideExit(model) {
  if (!validateStatusModel(model, { throwOnError: false }).ok) return { exitCode: 3, exitReason: EXIT_REASONS[3] };
  const checks = [...model.requiredChecks, ...model.optionalChecks, ...model.remoteServices];
  if (checks.some((check) => check.status === 'INVALID_CONFIGURATION') || model.remoteServices.some((check) => check.details.includes('ENV MALFORMED'))) {
    return { exitCode: 3, exitReason: EXIT_REASONS[3] };
  }
  if (checks.some((check) => check.status === 'NOT_VALIDATED')) return { exitCode: 2, exitReason: EXIT_REASONS[2] };
  if (checks.some((check) => check.status === 'FALSE_GREEN_RISK' || check.status === 'FAIL' || (check.required && check.status === 'MISSING'))) return { exitCode: 1, exitReason: EXIT_REASONS[1] };
  if (model.packageDiff.status === 'FAIL' || model.driftGuard.status === 'FAIL' || model.branchSafety.status === 'FAIL') return { exitCode: 1, exitReason: EXIT_REASONS[1] };
  return { exitCode: 0, exitReason: EXIT_REASONS[0] };
}

export async function buildStatusModel({ repoRoot = process.cwd(), argv = [], runner, generatedAt = nowIso() } = {}) {
  const parsedArgs = parseArgs(argv);
  if (!parsedArgs.ok) {
    return usageModel({ repoRoot, generatedAt, parsedArgs });
  }
  const options = parsedArgs.options;
  const packageJson = readPackageJson(repoRoot);
  const scripts = packageJson.scripts || {};
  const run = runner || runCommand;
  const morningStatusFile = path.join(repoRoot, 'scripts', 'morning-status.mjs');
  const hasMorningStatusFile = fs.existsSync(morningStatusFile);
  const [branchSafety, packageDiff, driftGuard, mbStatus] = await Promise.all([
    checkBranchSafety({ repoRoot, baseRef: options.baseRef, runner: run }),
    checkPackageDiff({ repoRoot, baseRef: options.baseRef, runner: run }),
    scanDrift({ repoRoot, baseRef: options.baseRef, runner: run }),
    scripts['mb:status'] && hasMorningStatusFile
      ? collectMbStatus({ repoRoot, runner: run, maxRuntimeMs: options.maxRuntimeMs, skipRemote: options.skipRemote })
      : Promise.resolve({
          mbCheck: scripts['mb:status']
            ? makeCheck({ name: 'scripts/morning-status.mjs', category: 'Required Checks', command: 'test -f scripts/morning-status.mjs', required: true, status: 'MISSING', details: 'scripts/morning-status.mjs is missing.', action: 'Restore scripts/morning-status.mjs before running this gate.' })
            : missingCheck('mb:status', 'Required Checks', 'npm run mb:status', true),
          remoteServices: [],
          azureSpeech: serviceCheck('Azure Speech', 'STATUS UNKNOWN'),
          localValidation: 'UNKNOWN',
          mobileAudioState: 'UNKNOWN',
          buildReadiness: 'UNKNOWN',
        }),
  ]);
  const requiredChecks = await runRequiredChecks({ scripts, repoRoot, runner: run, skipBuild: options.skipBuild, maxRuntimeMs: options.maxRuntimeMs, mbCheck: scripts['mb:status'] ? mbStatus.mbCheck : missingCheck('mb:status', 'Required Checks', 'npm run mb:status', true) });
  const optionalChecks = await runOptionalChecks({ scripts, repoRoot, runner: run, skipOptional: options.skipOptional, maxRuntimeMs: options.maxRuntimeMs });
  const model = orderedModel({
    schemaVersion: SCHEMA_VERSION,
    generatedAt,
    repoRoot,
    baseRef: options.baseRef,
    branch: branchSafety.branch,
    commit: branchSafety.commit,
    nodeVersion: process.version,
    requiredChecks,
    optionalChecks,
    remoteServices: [...mbStatus.remoteServices, mbStatus.azureSpeech],
    mobileAudio: { status: mbStatus.mobileAudioState || 'UNKNOWN', check: optionalChecks.find((check) => check.name === 'test:mobile-audio') || null },
    v3Resume: { status: optionalChecks.find((check) => check.name === 'test:resume')?.status || 'MISSING', checks: optionalChecks.filter((check) => ['test:resume', 'verify:v3-placement'].includes(check.name)) },
    validationIntegrity: { status: optionalChecks.find((check) => check.name === 'validate:tests')?.status || 'MISSING', source: mbStatus.localValidation || 'UNKNOWN' },
    buildReadiness: { status: mbStatus.buildReadiness || 'UNKNOWN', typecheck: requiredChecks.find((check) => check.name === 'typecheck:app')?.status || 'MISSING', build: requiredChecks.find((check) => check.name === 'build')?.status || 'MISSING' },
    branchSafety,
    packageDiff,
    driftGuard,
    topBlockers: [],
    nextActions: [],
    exitCode: 0,
    exitReason: EXIT_REASONS[0],
    runtimeMs: 0,
  });
  model.topBlockers = extractBlockers(model);
  model.nextActions = model.topBlockers.map((blocker) => ({ check: blocker.check, action: blocker.action }));
  const exit = decideExit(model);
  model.exitCode = exit.exitCode;
  model.exitReason = exit.exitReason;
  validateStatusModel(model);
  return model;
}

function usageModel({ repoRoot, generatedAt, parsedArgs }) {
  return orderedModel({
    schemaVersion: SCHEMA_VERSION,
    generatedAt,
    repoRoot,
    baseRef: 'origin/main',
    branch: 'UNKNOWN',
    commit: 'UNKNOWN',
    nodeVersion: process.version,
    requiredChecks: [],
    optionalChecks: [],
    remoteServices: [],
    mobileAudio: { status: 'UNKNOWN' },
    v3Resume: { status: 'UNKNOWN' },
    validationIntegrity: { status: 'UNKNOWN' },
    buildReadiness: { status: 'UNKNOWN' },
    branchSafety: { status: 'INVALID_CONFIGURATION', isDirty: false, action: parsedArgs.message },
    packageDiff: { status: 'INVALID_CONFIGURATION', action: '' },
    driftGuard: { status: 'INVALID_CONFIGURATION', action: '' },
    topBlockers: [{ check: 'Usage', status: 'INVALID_CONFIGURATION', action: parsedArgs.message }],
    nextActions: [{ check: 'Usage', action: parsedArgs.message }],
    exitCode: 4,
    exitReason: EXIT_REASONS[4],
    runtimeMs: 0,
  });
}

function orderedModel(values) {
  const model = {};
  for (const key of JSON_KEYS) model[key] = values[key];
  return model;
}

export function validateStatusModel(model, options = {}) {
  const fail = (message) => {
    if (options.throwOnError === false) return { ok: false, message };
    throw new Error(message);
  };
  if (JSON.stringify(Object.keys(model)) !== JSON.stringify(JSON_KEYS)) return fail('JSON key order mismatch');
  for (const listName of ['requiredChecks', 'optionalChecks', 'remoteServices']) {
    if (!Array.isArray(model[listName])) return fail(`${listName} must be an array`);
    for (const check of model[listName]) {
      for (const field of ['name', 'category', 'command', 'required', 'status', 'exitCode', 'durationMs', 'testCount', 'details', 'action']) {
        if (!(field in check)) return fail(`missing check field: ${field}`);
      }
      if (!STATUS.includes(check.status)) return fail(`unknown status: ${check.status}`);
    }
  }
  if (!Object.values(EXIT_REASONS).includes(model.exitReason)) return fail('unknown exit reason');
  if (model.exitReason !== EXIT_REASONS[model.exitCode]) return fail('impossible exit reason/status combination');
  if (model.topBlockers.length > 5) return fail('too many blockers');
  if (model.topBlockers.length !== model.nextActions.length) return fail('next actions do not match blockers');
  const seen = new Set();
  for (let index = 0; index < model.topBlockers.length; index += 1) {
    const blocker = model.topBlockers[index];
    const action = model.nextActions[index];
    if (!blocker.action) return fail('blocker without action');
    if (!action || action.check !== blocker.check || action.action !== blocker.action) return fail('next action not matching blocker');
    const key = `${blocker.check}\0${blocker.action}`;
    if (seen.has(key)) return fail('duplicate blocker/check/action mismatch');
    seen.add(key);
  }
  return { ok: true };
}

function formatCheck(check) {
  const testPart = check.testCount == null ? '' : `; testCount=${check.testCount}`;
  return `- ${check.name}; category=${check.category}; command=${check.command}; status=${check.status}; exitCode=${check.exitCode ?? 'n/a'}; durationMs=${check.durationMs}${testPart}`;
}

export function formatTerminal(model) {
  const lines = [
    'MercyB Morning Operations',
    'Run Info',
    `repo root: ${model.repoRoot}`,
    `base ref: ${model.baseRef}`,
    `branch: ${model.branch}`,
    `commit: ${model.commit}`,
    `node version: ${model.nodeVersion}`,
    `generated timestamp: ${model.generatedAt}`,
    `runtime ms: ${model.runtimeMs}`,
    'Required Checks',
    ...model.requiredChecks.map(formatCheck),
    'Optional Checks',
    ...model.optionalChecks.map(formatCheck),
    'Remote Services',
    ...model.remoteServices.map(formatCheck),
    'Mobile Audio',
    `status: ${model.mobileAudio.status}`,
    'V3 Resume',
    `status: ${model.v3Resume.status}`,
    'Validation Integrity',
    `status: ${model.validationIntegrity.status}; source=${model.validationIntegrity.source || 'UNKNOWN'}`,
    'Build Readiness',
    `status: ${model.buildReadiness.status}; typecheck=${model.buildReadiness.typecheck}; build=${model.buildReadiness.build}`,
    'Branch Safety',
    `base ref: ${model.branchSafety.baseRef}; current branch: ${model.branchSafety.branch}; current commit: ${model.branchSafety.commit}; dirty: ${model.branchSafety.isDirty}; staged: ${model.branchSafety.stagedCount}; unstaged: ${model.branchSafety.unstagedCount}; untracked: ${model.branchSafety.untrackedCount}; changed files vs base: ${(model.branchSafety.changedFiles || []).join(', ') || 'None'}; status: ${model.branchSafety.status}`,
    'Package Diff',
    `status: ${model.packageDiff.status}; added scripts: ${(model.packageDiff.addedScripts || []).join(', ') || 'None'}`,
    'Drift Guard',
    `status: ${model.driftGuard.status}`,
    'Top Blockers',
    ...(model.topBlockers.length ? model.topBlockers.map((blocker, index) => `${index + 1}. check=${blocker.check}; status=${blocker.status}; action=${blocker.action}`) : ['None']),
    'Next Actions',
    ...(model.nextActions.length ? model.nextActions.map((action, index) => `${index + 1}. check=${action.check}; action=${action.action}`) : ['None']),
    'Exit Summary',
    `exitCode: ${model.exitCode}`,
    `exitReason: ${model.exitReason}`,
  ];
  return `${lines.join('\n')}\n`;
}

export function formatJson(model) {
  validateStatusModel(model);
  return `${JSON.stringify(model, null, 2)}\n`;
}

export async function main(argv = process.argv.slice(2), io = {}) {
  const started = Date.now();
  const parsed = parseArgs(argv);
  const stdout = io.stdout || process.stdout;
  const stderr = io.stderr || process.stderr;
  if (!parsed.ok) {
    stderr.write(`${parsed.message}\n`);
    return 4;
  }
  if (parsed.options.help) {
    stdout.write(`${formatHelp()}\n`);
    return 0;
  }
  let model;
  try {
    model = await buildStatusModel({ repoRoot: process.cwd(), argv, generatedAt: nowIso() });
  } catch (error) {
    model = usageModel({ repoRoot: process.cwd(), generatedAt: nowIso(), parsedArgs: { message: error.message } });
    model.exitCode = 3;
    model.exitReason = EXIT_REASONS[3];
  }
  model.runtimeMs = Date.now() - started;
  if (model.runtimeMs > (parsed.options.maxRuntimeMs || 300000)) {
    model.topBlockers = [{ check: 'Runtime', status: 'FAIL', action: 'Inspect the dominant long-running command before continuing.' }, ...model.topBlockers].slice(0, 5);
    model.nextActions = model.topBlockers.map((blocker) => ({ check: blocker.check, action: blocker.action }));
    model.exitCode = 1;
    model.exitReason = EXIT_REASONS[1];
  }
  validateStatusModel(model);
  const output = parsed.options.json ? formatJson(model) : formatTerminal(model);
  if (parsed.options.json) {
    try {
      fs.ftruncateSync(1, 0);
      fs.writeSync(1, output, 0, 'utf8');
      return model.exitCode;
    } catch {}
  }
  stdout.write(output);
  return model.exitCode;
}

const thisFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === thisFile) {
  main().then((code) => {
    process.exitCode = code;
  });
}
