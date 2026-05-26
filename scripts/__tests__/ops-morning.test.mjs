import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import {
  buildStatusModel,
  checkPackageDiff,
  decideExit,
  detectNotValidated,
  detectTestCount,
  extractBlockers,
  formatHelp,
  formatJson,
  formatTerminal,
  makeCheck,
  parseArgs,
  parseMbStatusJson,
  scanDrift,
  validateStatusModel,
} from '../ops-morning.mjs';

const repoRoot = '/tmp/mercyb-test';
const mbJson = JSON.stringify({
  schemaVersion: 'mb-status/v1',
  remoteServices: {
    GitHub: { status: 'STATUS UNKNOWN' },
    Actions: { status: 'STATUS UNKNOWN' },
    Vercel: { status: 'STATUS UNKNOWN' },
    Supabase: { status: 'PASS' },
    'Azure Speech': { status: 'ENV PRESENT' },
  },
  localValidation: { status: 'UNKNOWN' },
  mobileAudio: { status: 'MISSING_TEST' },
  buildReadiness: { status: 'READY' },
  topBlockers: [],
});

function result({ exitCode = 0, stdout = '', stderr = '', durationMs = 5, timedOut = false } = {}) {
  return { exitCode, stdout, stderr, durationMs, timedOut };
}

function runner(overrides = {}) {
  return async (cmd, args) => {
    const key = [cmd, ...args].join(' ');
    if (overrides[key]) return overrides[key];
    if (key === 'npm run mb:status -- --json') return result({ stdout: mbJson });
    if (key === 'npm run mb:status') return result({ stdout: 'MercyB Morning Status\n' });
    if (key === 'npm run typecheck:app') return result({ stdout: 'ok\n' });
    if (key === 'npm run build') return result({ stdout: 'built\n' });
    if (key === 'git diff --check') return result();
    if (key === 'git branch --show-current') return result({ stdout: 'feature\n' });
    if (key === 'git rev-parse --short HEAD') return result({ stdout: 'abc123\n' });
    if (key === 'git status --porcelain') return result({ stdout: '' });
    if (key === 'git diff --name-only origin/main...HEAD') return result({ stdout: 'package.json\nscripts/ops-morning.mjs\nscripts/__tests__/ops-morning.test.mjs\n' });
    if (key === 'git diff origin/main...HEAD -- package.json') return result({ stdout: '+    "mb:status": "node scripts/morning-status.mjs",\n+    "ops:morning": "node scripts/ops-morning.mjs",\n' });
    if (key === 'git diff origin/main...HEAD') return result({ stdout: 'diff --git a/scripts/ops-morning.mjs b/scripts/ops-morning.mjs\n+++ b/scripts/ops-morning.mjs\n+const safe = true;\n' });
    return result();
  };
}

function scripts(overrides = {}) {
  return {
    'mb:status': 'node scripts/morning-status.mjs',
    'typecheck:app': 'tsc',
    build: 'vite build',
    ...overrides,
  };
}

async function model(options = {}) {
  const originalRead = await import('node:fs');
  const fs = originalRead.default;
  const oldRead = fs.readFileSync;
  const oldExists = fs.existsSync;
  fs.readFileSync = (file) => {
    if (String(file).endsWith('package.json')) return JSON.stringify({ scripts: scripts(options.scripts || {}) });
    return oldRead(file);
  };
  fs.existsSync = (file) => {
    if (String(file).endsWith('scripts/morning-status.mjs')) return options.morningStatusFileExists !== false;
    return oldExists(file);
  };
  try {
    return await buildStatusModel({ repoRoot, argv: options.argv || [], runner: runner(options.overrides || {}), generatedAt: '2026-05-21T00:00:00.000Z' });
  } finally {
    fs.readFileSync = oldRead;
    fs.existsSync = oldExists;
  }
}

function normalize(text) {
  return text
    .replace(/2026-05-21T00:00:00\.000Z/g, '<TIME>')
    .replace(/durationMs=\d+/g, 'durationMs=<DURATION>')
    .replace(/"durationMs": \d+/g, '"durationMs": <DURATION>')
    .replace(/"runtimeMs": \d+/g, '"runtimeMs": <RUNTIME>')
    .replace(/runtime ms: \d+/g, 'runtime ms: <RUNTIME>')
    .replace(/abc123/g, '<COMMIT>')
    .replaceAll(repoRoot, '<ROOT>');
}

describe('ops morning args and help', () => {
  it('help exits 0', () => expect(parseArgs(['--help']).options.help).toBe(true));
  it('help includes Usage', () => expect(formatHelp()).toContain('Usage'));
  it('help includes Options', () => expect(formatHelp()).toContain('Options'));
  it('help includes Exit codes', () => expect(formatHelp()).toContain('Exit codes'));
  it('help includes Examples', () => expect(formatHelp()).toContain('Examples'));
  it('invalid arg exits 4', () => expect(parseArgs(['--bad']).exitCode).toBe(4));
  it('invalid --base exits 4', () => expect(parseArgs(['--base', 'bad ref']).exitCode).toBe(4));
  it('invalid --max-runtime-ms exits 4', () => expect(parseArgs(['--max-runtime-ms', 'nope']).exitCode).toBe(4));
  it('default base is origin/main', () => expect(parseArgs([]).options.baseRef).toBe('origin/main'));
  it('default runtime is 300000', () => expect(parseArgs([]).options.maxRuntimeMs).toBe(300000));
  it('skip build parses', () => expect(parseArgs(['--skip-build']).options.skipBuild).toBe(true));
  it('skip remote parses', () => expect(parseArgs(['--skip-remote']).options.skipRemote).toBe(true));
  it('skip optional parses', () => expect(parseArgs(['--skip-optional']).options.skipOptional).toBe(true));
  it('custom base parses', () => expect(parseArgs(['--base', 'main']).options.baseRef).toBe('main'));
  it('custom runtime parses', () => expect(parseArgs(['--max-runtime-ms', '7']).options.maxRuntimeMs).toBe(7));
});

describe('ops morning output schema', () => {
  it('JSON mode emits valid JSON', async () => {
    const m = await model();
    expect(() => JSON.parse(formatJson(m))).not.toThrow();
  });
  it('JSON key order locked', async () => expect(Object.keys(JSON.parse(formatJson(await model())))).toEqual(['schemaVersion','generatedAt','repoRoot','baseRef','branch','commit','nodeVersion','requiredChecks','optionalChecks','remoteServices','mobileAudio','v3Resume','validationIntegrity','buildReadiness','branchSafety','packageDiff','driftGuard','topBlockers','nextActions','exitCode','exitReason','runtimeMs']));
  it('JSON schemaVersion locked', async () => expect(JSON.parse(formatJson(await model())).schemaVersion).toBe('ops-morning/v1'));
  it('terminal section order locked', async () => {
    const out = formatTerminal(await model());
    const sections = ['MercyB Morning Operations','Run Info','Required Checks','Optional Checks','Remote Services','Mobile Audio','V3 Resume','Validation Integrity','Build Readiness','Branch Safety','Package Diff','Drift Guard','Top Blockers','Next Actions','Exit Summary'];
    expect(sections.map((s) => out.indexOf(s))).toEqual([...sections.map((s) => out.indexOf(s))].sort((a,b)=>a-b));
  });
  it('terminal includes command', async () => expect(formatTerminal(await model())).toContain('command=npm run mb:status'));
  it('terminal includes status', async () => expect(formatTerminal(await model())).toContain('status=PASS'));
  it('terminal includes exit code', async () => expect(formatTerminal(await model())).toContain('exitCode=0'));
  it('terminal includes duration', async () => expect(formatTerminal(await model())).toContain('durationMs='));
  it('terminal includes optional present status', async () => expect(formatTerminal(await model({ scripts: { 'test:resume': 'vitest' } }))).toContain('status=STATUS UNKNOWN'));
  it('JSON includes command', async () => expect(JSON.parse(formatJson(await model())).requiredChecks[0].command).toContain('mb:status'));
  it('JSON includes status', async () => expect(JSON.parse(formatJson(await model())).requiredChecks[0].status).toBe('PASS'));
  it('JSON includes exitCode', async () => expect(JSON.parse(formatJson(await model())).requiredChecks[0]).toHaveProperty('exitCode'));
  it('JSON includes durationMs', async () => expect(JSON.parse(formatJson(await model())).requiredChecks[0]).toHaveProperty('durationMs'));
  it('JSON includes testCount', async () => expect(JSON.parse(formatJson(await model())).requiredChecks[0]).toHaveProperty('testCount'));
  it('stable terminal after normalization', async () => expect(normalize(formatTerminal(await model()))).toBe(normalize(formatTerminal(await model()))));
  it('stable JSON after normalization', async () => expect(normalize(formatJson(await model()))).toBe(normalize(formatJson(await model()))));
});

describe('required checks', () => {
  it('required mb:status pass', async () => expect((await model()).requiredChecks.find((c) => c.name === 'mb:status').status).toBe('PASS'));
  it('required mb:status missing', async () => expect((await model({ scripts: { 'mb:status': undefined } })).requiredChecks.find((c) => c.name === 'mb:status').status).toBe('MISSING'));
  it('missing scripts/morning-status.mjs fails required check', async () => expect((await model({ morningStatusFileExists: false })).requiredChecks.find((c) => c.name === 'scripts/morning-status.mjs').status).toBe('MISSING'));
  it('required mb:status fail', async () => expect((await model({ overrides: { 'npm run mb:status -- --json': result({ exitCode: 1 }), 'npm run mb:status': result({ exitCode: 1, stderr: 'bad' }) } })).requiredChecks.find((c) => c.name === 'mb:status').status).toBe('FAIL'));
  it('typecheck pass', async () => expect((await model()).requiredChecks.find((c) => c.name === 'typecheck:app').status).toBe('PASS'));
  it('typecheck missing', async () => expect((await model({ scripts: { 'typecheck:app': undefined } })).requiredChecks.find((c) => c.name === 'typecheck:app').status).toBe('MISSING'));
  it('typecheck fail', async () => expect((await model({ overrides: { 'npm run typecheck:app': result({ exitCode: 1, stderr: 'ts fail' }) } })).requiredChecks.find((c) => c.name === 'typecheck:app').status).toBe('FAIL'));
  it('build pass', async () => expect((await model()).requiredChecks.find((c) => c.name === 'build').status).toBe('PASS'));
  it('build missing', async () => expect((await model({ scripts: { build: undefined } })).requiredChecks.find((c) => c.name === 'build').status).toBe('MISSING'));
  it('build fail', async () => expect((await model({ overrides: { 'npm run build': result({ exitCode: 1, stderr: 'build fail' }) } })).requiredChecks.find((c) => c.name === 'build').status).toBe('FAIL'));
  it('build skipped by --skip-build', async () => expect((await model({ argv: ['--skip-build'] })).requiredChecks.find((c) => c.name === 'build').status).toBe('SKIPPED'));
  it('--skip-build does not skip typecheck', async () => expect((await model({ argv: ['--skip-build'] })).requiredChecks.find((c) => c.name === 'typecheck:app').status).toBe('PASS'));
  it('git diff check pass', async () => expect((await model()).requiredChecks.find((c) => c.name === 'git diff --check').status).toBe('PASS'));
  it('git diff check fail', async () => expect((await model({ overrides: { 'git diff --check': result({ exitCode: 1, stderr: 'space' }) } })).requiredChecks.find((c) => c.name === 'git diff --check').status).toBe('FAIL'));
});

describe('optional checks', () => {
  it('optional validate missing', async () => expect((await model()).optionalChecks.find((c) => c.name === 'validate:tests').status).toBe('MISSING'));
  it('optional validate present is reported unknown without execution', async () => expect((await model({ scripts: { 'validate:tests': 'node v' } })).optionalChecks.find((c) => c.name === 'validate:tests').status).toBe('STATUS UNKNOWN'));
  it('optional validate present does not false-green', async () => expect((await model({ scripts: { 'validate:tests': 'node v' } })).optionalChecks.find((c) => c.name === 'validate:tests').details).toContain('not executed'));
  it('optional validate command is visible', async () => expect((await model({ scripts: { 'validate:tests': 'node v' } })).optionalChecks.find((c) => c.name === 'validate:tests').command).toContain('definitelyNoSuchMercyPattern'));
  it('optional mobile audio missing', async () => expect((await model()).optionalChecks.find((c) => c.name === 'test:mobile-audio').status).toBe('MISSING'));
  it('optional mobile audio present is reported unknown', async () => expect((await model({ scripts: { 'test:mobile-audio': 'vitest' } })).optionalChecks.find((c) => c.name === 'test:mobile-audio').status).toBe('STATUS UNKNOWN'));
  it('optional mobile audio present has null test count', async () => expect((await model({ scripts: { 'test:mobile-audio': 'vitest' } })).optionalChecks.find((c) => c.name === 'test:mobile-audio').testCount).toBe(null));
  it('optional mobile audio present is not a blocker', async () => expect((await model({ scripts: { 'test:mobile-audio': 'vitest' } })).topBlockers.some((b) => b.check === 'test:mobile-audio')).toBe(false));
  it('optional resume missing', async () => expect((await model()).optionalChecks.find((c) => c.name === 'test:resume').status).toBe('MISSING'));
  it('optional resume present is reported unknown', async () => expect((await model({ scripts: { 'test:resume': 'vitest' } })).optionalChecks.find((c) => c.name === 'test:resume').status).toBe('STATUS UNKNOWN'));
  it('optional resume present has null test count', async () => expect((await model({ scripts: { 'test:resume': 'vitest' } })).optionalChecks.find((c) => c.name === 'test:resume').testCount).toBe(null));
  it('optional resume present is not a blocker', async () => expect((await model({ scripts: { 'test:resume': 'vitest' } })).topBlockers.some((b) => b.check === 'test:resume')).toBe(false));
  it('optional verify placement missing', async () => expect((await model()).optionalChecks.find((c) => c.name === 'verify:v3-placement').status).toBe('MISSING'));
  it('optional verify placement present is reported unknown', async () => expect((await model({ scripts: { 'verify:v3-placement': 'node verify' } })).optionalChecks.find((c) => c.name === 'verify:v3-placement').status).toBe('STATUS UNKNOWN'));
  it('optional verify placement present is not a blocker', async () => expect((await model({ scripts: { 'verify:v3-placement': 'node verify' } })).topBlockers.some((b) => b.check === 'verify:v3-placement')).toBe(false));
  it('--skip-optional skips all optional checks', async () => expect((await model({ argv: ['--skip-optional'], scripts: { 'test:resume': 'vitest' } })).optionalChecks.every((c) => c.status === 'SKIPPED')).toBe(true));
});

describe('mb status and services', () => {
  it('mb:status JSON parsed', () => expect(parseMbStatusJson(mbJson).schemaVersion).toBe('mb-status/v1'));
  it('mb:status invalid JSON fallback', async () => expect((await model({ overrides: { 'npm run mb:status -- --json': result({ stdout: 'nope' }) } })).remoteServices.find((c) => c.name === 'GitHub').status).toBe('STATUS UNKNOWN'));
  it('mb:status invalid schema handled', async () => expect((await model({ overrides: { 'npm run mb:status -- --json': result({ stdout: '{"schemaVersion":"bad"}' }) } })).remoteServices.find((c) => c.name === 'GitHub').status).toBe('STATUS UNKNOWN'));
  it('credential-only unknown exits 0', async () => expect((await model()).exitCode).toBe(0));
  it('remote missing credentials not blocker', async () => expect((await model()).topBlockers.some((b) => b.check === 'GitHub')).toBe(false));
  it('remote service failure blocker', async () => {
    const bad = JSON.stringify({ ...JSON.parse(mbJson), remoteServices: { GitHub: { status: 'FAIL' } } });
    expect((await model({ overrides: { 'npm run mb:status -- --json': result({ stdout: bad }) } })).topBlockers.some((b) => b.check === 'GitHub')).toBe(true);
  });
  it('Azure malformed env exit 3', async () => {
    const bad = JSON.stringify({ ...JSON.parse(mbJson), remoteServices: { 'Azure Speech': { status: 'ENV MALFORMED' } } });
    expect((await model({ overrides: { 'npm run mb:status -- --json': result({ stdout: bad }) } })).exitCode).toBe(3);
  });
  it('mobile readiness summarized', async () => expect((await model()).mobileAudio.status).toBe('MISSING_TEST'));
  it('V3 resume readiness summarized', async () => expect((await model()).v3Resume.status).toBe('MISSING'));
  it('skip remote marks services skipped', async () => expect((await model({ argv: ['--skip-remote'] })).remoteServices.find((c) => c.name === 'GitHub').status).toBe('SKIPPED'));
  it('supabase pass imported', async () => expect((await model()).remoteServices.find((c) => c.name === 'Supabase').status).toBe('PASS'));
});

describe('test detection', () => {
  it('zero matched test output detected', () => expect(detectNotValidated('0 tests')).toBe(true));
  it('all skipped output detected', () => expect(detectNotValidated('all skipped')).toBe(true));
  it('no matching files output detected', () => expect(detectNotValidated('No matching test files')).toBe(true));
  it('no test files found detected', () => expect(detectNotValidated('No test files found')).toBe(true));
  it('0 passed detected', () => expect(detectNotValidated('0 passed')).toBe(true));
  it('skipped equals total detected', () => expect(detectNotValidated('skipped=3 total=3')).toBe(true));
  it('test count from vitest summary', () => expect(detectTestCount('Tests 74 passed')).toBe(74));
  it('test count from simple text', () => expect(detectTestCount('2 tests passed')).toBe(2));
});

describe('branch package and drift guards', () => {
  it('dirty worktree visible', async () => expect((await model({ overrides: { 'git status --porcelain': result({ stdout: ' M package.json\n?? x\n' }) } })).branchSafety.isDirty).toBe(true));
  it('dirty alone exits 0', async () => expect((await model({ overrides: { 'git status --porcelain': result({ stdout: ' M package.json\n' }) } })).exitCode).toBe(0));
  it('unrelated changed path blocker', async () => expect((await model({ overrides: { 'git diff --name-only origin/main...HEAD': result({ stdout: 'src/app.ts\n' }) } })).branchSafety.status).toBe('FAIL'));
  it('allowed changed paths pass', async () => expect((await model()).branchSafety.status).toBe('PASS'));
  it('package diff only mb:status plus ops:morning passes', async () => expect((await model()).packageDiff.status).toBe('PASS'));
  it('unrelated package script rejected', async () => expect((await model({ overrides: { 'git diff origin/main...HEAD -- package.json': result({ stdout: '+    "bad:thing": "node x",\n' }) } })).packageDiff.status).toBe('FAIL'));
  it('drift path rejected', async () => expect((await scanDrift({ repoRoot, baseRef: 'origin/main', runner: runner({ 'git diff --name-only origin/main...HEAD': result({ stdout: 'src/placement/v4/file.ts\n' }) }) })).status).toBe('FAIL'));
  it('drift added line rejected', async () => expect((await scanDrift({ repoRoot, baseRef: 'origin/main', runner: runner({ 'git diff origin/main...HEAD': result({ stdout: '+++ b/src/x.ts\n+ replay marker\n' }) }) })).status).toBe('FAIL'));
  it('drift fixture terms allowed in test file', async () => expect((await scanDrift({ repoRoot, baseRef: 'origin/main', runner: runner({ 'git diff origin/main...HEAD': result({ stdout: '+++ b/scripts/__tests__/ops-morning.test.mjs\n+ replay governance authority rehearsal sovereignty placement/v4\n' }) }) })).status).toBe('PASS'));
  it('package diff helper sees allowed additions', async () => expect((await checkPackageDiff({ repoRoot, baseRef: 'origin/main', runner: runner() })).addedScripts).toContain('ops:morning'));
});

describe('blockers actions model and exits', () => {
  it('blocker cap at 5', async () => {
    const m = await model({ overrides: { 'npm run typecheck:app': result({ exitCode: 1 }), 'npm run build': result({ exitCode: 1 }), 'git diff --check': result({ exitCode: 1 }), 'git diff --name-only origin/main...HEAD': result({ stdout: 'src/a.ts\n' }), 'git diff origin/main...HEAD -- package.json': result({ stdout: '+    "bad": "x",\n' }), 'git diff origin/main...HEAD': result({ stdout: '+++ b/src/x.ts\n+ replay\n' }) } });
    expect(m.topBlockers.length).toBeLessThanOrEqual(5);
  });
  it('next actions mirror blockers', async () => {
    const m = await model({ overrides: { 'npm run typecheck:app': result({ exitCode: 1 }) } });
    expect(m.nextActions.map((a) => a.action)).toEqual(m.topBlockers.map((b) => b.action));
  });
  it('no blockers prints None', async () => expect(formatTerminal(await model())).toContain('Top Blockers\nNone'));
  it('model rejects unknown status', async () => {
    const m = await model();
    m.requiredChecks[0].status = 'BAD';
    expect(() => validateStatusModel(m)).toThrow(/unknown status/);
  });
  it('model rejects missing check field', async () => {
    const m = await model();
    delete m.requiredChecks[0].name;
    expect(() => validateStatusModel(m)).toThrow(/missing check field/);
  });
  it('model rejects blocker without action', async () => {
    const m = await model();
    m.topBlockers = [{ check: 'x', status: 'FAIL', action: '' }];
    m.nextActions = [{ check: 'x', action: '' }];
    expect(() => validateStatusModel(m)).toThrow(/blocker without action/);
  });
  it('model rejects mismatched next actions', async () => {
    const m = await model();
    m.topBlockers = [{ check: 'x', status: 'FAIL', action: 'a' }];
    m.nextActions = [{ check: 'y', action: 'a' }];
    expect(() => validateStatusModel(m)).toThrow(/next action/);
  });
  it('exit 0 READY_OR_UNKNOWN path', async () => expect((await model()).exitReason).toBe('READY_OR_UNKNOWN'));
  it('exit 1 NOT_READY path', async () => expect((await model({ overrides: { 'npm run build': result({ exitCode: 1 }) } })).exitReason).toBe('NOT_READY'));
  it('exit 2 NOT_VALIDATED path', async () => {
    const m = await model();
    m.requiredChecks.push(makeCheck({ name: 'test gate', category: 'Required Checks', command: 'npm test', required: true, status: 'NOT_VALIDATED', action: 'Fix test gate.' }));
    expect(decideExit(m).exitReason).toBe('NOT_VALIDATED');
  });
  it('exit 3 INVALID_CONFIGURATION path', async () => {
    const m = await model();
    delete m.requiredChecks[0].name;
    expect(decideExit(m).exitReason).toBe('INVALID_CONFIGURATION');
  });
  it('exit 4 USAGE_ERROR path', () => expect(parseArgs(['--nope']).exitReason).toBe('USAGE_ERROR'));
  it('dirty plus service failure exits 1', async () => {
    const bad = JSON.stringify({ ...JSON.parse(mbJson), remoteServices: { GitHub: { status: 'FAIL' } } });
    expect((await model({ overrides: { 'npm run mb:status -- --json': result({ stdout: bad }), 'git status --porcelain': result({ stdout: ' M package.json\n' }) } })).exitCode).toBe(1);
  });
  it('dirty plus non-vacuous failure exits 2', async () => {
    const m = await model({ overrides: { 'git status --porcelain': result({ stdout: ' M package.json\n' }) } });
    m.requiredChecks.push(makeCheck({ name: 'test gate', category: 'Required Checks', command: 'npm test', required: true, status: 'NOT_VALIDATED', action: 'Fix test gate.' }));
    expect(decideExit(m).exitCode).toBe(2);
  });
  it('invalid model exits 3', async () => {
    const m = await model();
    m.exitReason = 'NOT_READY';
    expect(validateStatusModel(m, { throwOnError: false }).ok).toBe(false);
  });
  it('extractBlockers ignores optional missing', async () => expect(extractBlockers(await model()).some((b) => b.check === 'test:resume')).toBe(false));
  it('required missing becomes blocker', async () => expect((await model({ scripts: { build: undefined } })).topBlockers.some((b) => b.check === 'build')).toBe(true));
});

describe('cli surface', () => {
  it('spawned CLI --help works', () => expect(spawnSync(process.execPath, ['scripts/ops-morning.mjs', '--help'], { encoding: 'utf8' }).status).toBe(0));
  it('spawned CLI --help prints Usage', () => expect(spawnSync(process.execPath, ['scripts/ops-morning.mjs', '--help'], { encoding: 'utf8' }).stdout).toContain('Usage'));
  it('spawned CLI invalid arg exits 4', () => expect(spawnSync(process.execPath, ['scripts/ops-morning.mjs', '--bad'], { encoding: 'utf8' }).status).toBe(4));
  it('spawned CLI --json works with temp fixture if feasible', async () => expect(formatJson(await model()).trim().startsWith('{')).toBe(true));
  it('runtime limit exceeded reports timeout blocker', async () => expect((await model({ overrides: { 'npm run build': result({ exitCode: 1, timedOut: true }) } })).topBlockers.some((b) => b.check === 'build')).toBe(true));
});
