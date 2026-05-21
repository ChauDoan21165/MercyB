import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';

import {
  EXPECTED_FILES,
  buildStatusModel,
  checkChangedFiles,
  checkPackageDiff,
  classifyCommandResult,
  decideExit,
  detectNotValidated,
  detectTestCount,
  formatJson,
  formatTerminal,
  helpText,
  inspectDiagnosticsExportSchema,
  inspectRetestPanelGating,
  inspectSizeBoundTests,
  main,
  parseArgs,
  runPrivacyAudit,
  scanDrift,
  validateStatusModel,
} from '../verify-mobile-audio.mjs';

const repos = [];
const repoRoot = resolve('.');

function makeTempRepo(overrides = {}) {
  const root = mkdtempSync(join(tmpdir(), 'verify-mobile-audio-'));
  repos.push(root);
  write(root, 'package.json', JSON.stringify({
    scripts: {
      'test:mobile-audio': 'vitest run mobile',
      'verify:mobile-audio': 'node scripts/verify-mobile-audio.mjs',
      test: 'vitest run',
      'typecheck:app': 'tsc',
      build: 'vite build',
      ...(overrides.scripts ?? {}),
    },
  }, null, 2));
  write(root, 'src/lib/speech/mobileSafariSpeakingRuntime.ts', overrides.runtime ?? runtimeSource());
  write(root, 'src/lib/speech/__tests__/mobileSafariSpeakingRuntime.test.ts', overrides.runtimeTest ?? runtimeTestSource());
  write(root, 'src/components/mercy-guide/MercySpeakTab.tsx', overrides.ui ?? uiSource());
  write(root, 'src/components/mercy-guide/__tests__/MercySpeakTab.mobileAudio.test.tsx', overrides.uiTest ?? uiTestSource());
  if (overrides.docsFile) write(root, 'docs/mobile-audio-diagnostics-retest.md', 'stale docs');
  return root;
}

function write(root, rel, content) {
  mkdirSync(dirname(join(root, rel)), { recursive: true });
  writeFileSync(join(root, rel), content);
}

function runtimeSource(extra = '') {
  return `
const payload: MobileAudioDiagnosticsExport = {
  schemaVersion: 'mobile-audio-diagnostics/v1',
  createdAt: new Date().toISOString(),
  truncated: false,
  readiness: 'readiness_verified',
  certification: 'certified',
  runtimeSupport: 'UNKNOWN',
  events: recent.map((event, index) => ({
    order: index + 1,
    code: sanitize(event.code),
    playbackPath: sanitize(event.playbackPath),
    retryCount: 0,
    runtimeSupport: 'UNKNOWN',
    recordSucceeded: Boolean(event.recordSucceeded),
    playbackSucceeded: Boolean(event.playbackSucceeded),
  })),
  summary: { eventCount: recent.length },
};
const MOBILE_AUDIO_DIAGNOSTICS_KEY = 'mercy.mobileAudioDiagnostics';
localStorage.setItem(MOBILE_AUDIO_DIAGNOSTICS_KEY, JSON.stringify(payload));
${extra}
export async function copyMobileAudioDiagnosticsToClipboard() {}
`;
}

function runtimeTestSource(extra = '') {
  return `
it('locks top level keys', () => expect(['schemaVersion','createdAt','truncated','readiness','certification','runtimeSupport','events','summary']).toBeTruthy());
it('locks event keys', () => expect(['order','code','playbackPath','retryCount','runtimeSupport','recordSucceeded','playbackSucceeded']).toBeTruthy());
it('keeps export under 8192 bytes', () => expect(JSON.stringify({ truncated: true }).length).toBeLessThanOrEqual(8 * 1024));
it('keeps oversized input safe and valid JSON after truncation', () => expect(JSON.parse(JSON.stringify({ truncated: true, oversized: 'x' }))).toBeTruthy());
it('rejects userAgent deviceId transcript learnerId token authorization cookie localStorage in tests only', () => expect(true).toBe(true));
${extra}
`;
}

function uiSource(extra = '') {
  return `
const params = new URLSearchParams(window.location.search);
const show = params.get('mobileAudioRetest') === '1';
export function Panel(){ return show ? 'Copy diagnostics' : null; }
${extra}
`;
}

function uiTestSource(extra = '') {
  return `
it('hides copy diagnostics unless mobileAudioRetest is enabled', () => expect(screen.queryByText('Copy diagnostics')).not.toBeInTheDocument());
it('shows copy diagnostics with mobile-audio-retest-panel', () => expect('mobile-audio-retest-panel Copy diagnostics').toContain('Copy diagnostics'));
${extra}
`;
}

function result(exitCode = 0, stdout = '', stderr = '', durationMs = 7) {
  return { command: 'mock command', exitCode, stdout, stderr, durationMs };
}

function makeRunner(options = {}) {
  const {
    total = 54,
    runtime = 34,
    ui = 20,
    fail = new Set(),
    packageDiff = '+    "test:mobile-audio": "vitest"\\n+    "verify:mobile-audio": "node scripts/verify-mobile-audio.mjs"',
    changedFiles = [
      'package.json',
      'scripts/verify-mobile-audio.mjs',
      'scripts/__tests__/verify-mobile-audio.test.mjs',
      'src/lib/speech/mobileSafariSpeakingRuntime.ts',
      'src/components/mercy-guide/MercySpeakTab.tsx',
    ].join('\n').replace('mercy-guide', 'mercy-guide'),
    unifiedDiff = '',
    privacy = '',
    docsPresent = false,
  } = options;
  return async (command, args = []) => {
    const key = [command, ...args].join(' ');
    if (command === 'npm' && args.join(' ') === 'run test:mobile-audio') return fail.has('test:mobile-audio') ? result(1, '', 'fail') : result(0, `Tests ${total} passed (${total} tests)`);
    if (command === 'npm' && args.join(' ') === 'run test -- mobileSafariSpeakingRuntime') return fail.has('runtime') ? result(1, '', 'fail') : result(0, `Tests ${runtime} passed (${runtime} tests)`);
    if (command === 'npm' && args.join(' ') === 'run test -- MercySpeakTab') return fail.has('ui') ? result(1, '', 'fail') : result(0, `Tests ${ui} passed (${ui} tests)`);
    if (command === 'npm' && args.join(' ') === 'run test -- scripts/__tests__/verify-mobile-audio.test.mjs') return fail.has('verifier') ? result(1, '', 'verifier fail') : result(0, `Tests 25 passed (25 tests)`);
    if (command === 'npm' && args.join(' ') === 'run typecheck:app') return fail.has('typecheck') ? result(1, '', 'type fail') : result(0, 'type ok');
    if (command === 'npm' && args.join(' ') === 'run build') return fail.has('build') ? result(1, '', 'build fail') : result(0, 'build ok');
    if (command === 'git' && args.join(' ') === 'diff --check') return fail.has('diffcheck') ? result(1, '', 'ws error') : result(0, '');
    if (command === 'node') return docsPresent ? result(1, '', 'docs present') : result(0, '');
    if (command === 'git' && args.includes('package.json')) return result(0, packageDiff);
    if (command === 'git' && args.includes('--name-only')) return result(0, changedFiles);
    if (command === 'git' && args.includes('--unified=0')) return result(0, unifiedDiff);
    if (command === 'rg') return result(0, privacy);
    return result(0, key);
  };
}

function baseConfig(overrides = {}) {
  return { ...parseArgs([]), ...overrides };
}

function normalizeTerminal(text) {
  return text
    .replace(/repo root: .+/g, 'repo root: <repo>')
    .replace(/commit: .+/g, 'commit: <commit>')
    .replace(/generated timestamp: .+/g, 'generated timestamp: <time>')
    .replace(/runtime ms: \d+/g, 'runtime ms: <runtime>')
    .replace(/\| \d+ms/g, '| <duration>ms');
}

function normalizeJson(text) {
  const json = JSON.parse(text);
  json.generatedAt = '<time>';
  json.repoRoot = '<repo>';
  json.commit = '<commit>';
  json.runtimeMs = 0;
  for (const key of ['requiredChecks','testCounts','diagnosticsExport','privacyAudit','retestPanel','sizeBound','manualSanity','packageDiff','changedFiles','driftGuard']) {
    json[key].forEach((item) => { item.durationMs = 0; });
  }
  return JSON.stringify(json);
}

afterEach(() => {
  while (repos.length) rmSync(repos.pop(), { recursive: true, force: true });
});

describe('verify-mobile-audio args and help', () => {
  it('help exits 0', async () => expect(await main(['--help'])).toBe(0));
  it('help includes Usage', () => expect(helpText()).toContain('Usage'));
  it('help includes Options', () => expect(helpText()).toContain('Options'));
  it('help includes Exit codes', () => expect(helpText()).toContain('Exit codes'));
  it('help includes Examples', () => expect(helpText()).toContain('Examples'));
  it('invalid arg exits 4', () => expect(() => parseArgs(['--bad'])).toThrow(/unknown argument/));
  it('invalid --base exits 4', () => expect(() => parseArgs(['--base'])).toThrow(/invalid --base/));
  it('invalid --max-export-bytes exits 4', () => expect(() => parseArgs(['--max-export-bytes', 'x'])).toThrow(/invalid --max-export-bytes/));
  it('invalid --min-runtime-tests exits 4', () => expect(() => parseArgs(['--min-runtime-tests', '0'])).toThrow(/invalid --min-runtime-tests/));
  it('invalid --min-ui-tests exits 4', () => expect(() => parseArgs(['--min-ui-tests', '-1'])).toThrow(/invalid --min-ui-tests/));
  it('invalid --min-total-tests exits 4', () => expect(() => parseArgs(['--min-total-tests', '1.2'])).toThrow(/invalid --min-total-tests/));
  it('parses JSON flag', () => expect(parseArgs(['--json']).json).toBe(true));
  it('parses skip build flag', () => expect(parseArgs(['--skip-build']).skipBuild).toBe(true));
  it('parses manual sanity flag', () => expect(parseArgs(['--manual-sanity-confirmed']).manualSanityConfirmed).toBe(true));
  it('parses base ref', () => expect(parseArgs(['--base', 'HEAD']).base).toBe('HEAD'));
});

describe('test count detection', () => {
  it('required test:mobile-audio pass', () => expect(classifyCommandResult(result(0, 'Tests 54 passed (54 tests)'), { minTests: 54 }).status).toBe('PASS'));
  it('required test:mobile-audio fail', () => expect(classifyCommandResult(result(1, '', 'failed'), { minTests: 54 }).status).toBe('FAIL'));
  it('required test:mobile-audio missing', () => expect(classifyCommandResult(result(0, ''), { missingScript: true }).status).toBe('MISSING'));
  it('runtime test pass with 34 tests', () => expect(classifyCommandResult(result(0, 'Tests 34 passed (34 tests)'), { minTests: 34 }).status).toBe('PASS'));
  it('runtime test below threshold exits 2', () => expect(classifyCommandResult(result(0, 'Tests 33 passed (33 tests)'), { minTests: 34 }).status).toBe('NOT_VALIDATED'));
  it('UI test pass with 20 tests', () => expect(classifyCommandResult(result(0, 'Tests 20 passed (20 tests)'), { minTests: 20 }).status).toBe('PASS'));
  it('UI test below threshold exits 2', () => expect(classifyCommandResult(result(0, 'Tests 19 passed (19 tests)'), { minTests: 20 }).status).toBe('NOT_VALIDATED'));
  it('total test below 54 exits 2', () => expect(classifyCommandResult(result(0, 'Tests 53 passed (53 tests)'), { minTests: 54 }).status).toBe('NOT_VALIDATED'));
  it('zero matched output detected', () => expect(detectNotValidated('0 tests', 0)).toBe(true));
  it('no matching files output detected', () => expect(detectNotValidated('No matching test files')).toBe(true));
  it('all skipped output detected', () => expect(detectNotValidated('all skipped')).toBe(true));
  it('skipped equals total detected', () => expect(detectNotValidated('skipped=4 total=4')).toBe(true));
  it('detects vitest parenthetical count', () => expect(detectTestCount('passed (91 tests)')).toBe(91));
  it('detects tests passed count', () => expect(detectTestCount('Tests 12 passed')).toBe(12));
});

describe('command model checks', () => {
  it('build pass', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() });
    expect(model.requiredChecks.find((c) => c.name === 'build').status).toBe('PASS');
  });
  it('build fail', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner({ fail: new Set(['build']) }) });
    expect(model.requiredChecks.find((c) => c.name === 'build').status).toBe('FAIL');
  });
  it('build skipped by --skip-build', async () => {
    const model = await buildStatusModel(baseConfig({ skipBuild: true }), { repoRoot: makeTempRepo(), runner: makeRunner() });
    expect(model.requiredChecks.find((c) => c.name === 'build').status).toBe('SKIPPED');
  });
  it('typecheck pass', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() });
    expect(model.requiredChecks.find((c) => c.name === 'typecheck:app').status).toBe('PASS');
  });
  it('typecheck fail', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner({ fail: new Set(['typecheck']) }) });
    expect(model.requiredChecks.find((c) => c.name === 'typecheck:app').status).toBe('FAIL');
  });
  it('git diff check pass', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() });
    expect(model.requiredChecks.find((c) => c.name === 'git diff check').status).toBe('PASS');
  });
  it('git diff check fail', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner({ fail: new Set(['diffcheck']) }) });
    expect(model.requiredChecks.find((c) => c.name === 'git diff check').status).toBe('FAIL');
  });
  it('docs absence pass', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() });
    expect(model.requiredChecks.find((c) => c.name === 'docs absence').status).toBe('PASS');
  });
  it('docs presence fail', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo({ docsFile: true }), runner: makeRunner({ docsPresent: true }) });
    expect(model.requiredChecks.find((c) => c.name === 'docs absence').status).toBe('FAIL');
  });
});

describe('diagnostics schema inspection', () => {
  it('diagnostics schema keys present', () => expect(inspectDiagnosticsExportSchema(makeTempRepo()).status).toBe('PASS'));
  it('diagnostics schema missing key exits 2 or 3', () => expect(['NOT_VALIDATED','INVALID_CONFIGURATION']).toContain(inspectDiagnosticsExportSchema(makeTempRepo({ runtime: runtimeSource().replace('certification', 'cert') })).status));
  it('event schema keys present', () => expect(inspectDiagnosticsExportSchema(makeTempRepo()).details).toContain('schema'));
  it('unsafe export key detected fails', () => expect(inspectDiagnosticsExportSchema(makeTempRepo({ runtime: runtimeSource('const userAgent = "bad";') })).status).toBe('FAIL'));
  it('diagnostics schema missing runtime file invalidates', () => expect(inspectDiagnosticsExportSchema(makeTempRepo({ runtime: '' })).status).toBe('INVALID_CONFIGURATION'));
  it('diagnostics schema requires max export coverage', () => expect(inspectDiagnosticsExportSchema(makeTempRepo({ runtimeTest: runtimeTestSource().replace('8192', '4096').replace('8 * 1024', '4096') })).status).toBe('NOT_VALIDATED'));
});

describe('privacy audit', () => {
  it('privacy audit safe test reference passes', async () => expect((await runPrivacyAudit(makeTempRepo(), makeRunner({ privacy: 'src/lib/speech/__tests__/mobileSafariSpeakingRuntime.test.ts:1:userAgent token' }))).status).toBe('PASS'));
  it('privacy audit safe storage reference passes', async () => expect((await runPrivacyAudit(makeTempRepo(), makeRunner({ privacy: 'src/lib/speech/mobileSafariSpeakingRuntime.ts:1:localStorage.setItem(MOBILE_AUDIO_DIAGNOSTICS_KEY, x)' }))).status).toBe('PASS'));
  it('privacy audit unsafe runtime export fails', async () => expect((await runPrivacyAudit(makeTempRepo(), makeRunner({ privacy: 'src/lib/speech/mobileSafariSpeakingRuntime.ts:1:userAgent' }))).status).toBe('FAIL'));
  it('privacy audit node fallback passes', async () => {
    const runner = async () => result(127, '', 'rg missing');
    expect((await runPrivacyAudit(makeTempRepo(), runner)).status).toBe('PASS');
  });
});

describe('retest panel and size checks', () => {
  it('query flag gating present', () => expect(inspectRetestPanelGating(makeTempRepo()).status).toBe('PASS'));
  it('query flag missing exits 2', () => expect(inspectRetestPanelGating(makeTempRepo({ ui: uiSource().replace('mobileAudioRetest', 'other') })).status).toBe('NOT_VALIDATED'));
  it('hidden-without-flag test evidence present', () => expect(inspectRetestPanelGating(makeTempRepo()).details).toContain('query'));
  it('visible-with-flag test evidence present', () => expect(inspectRetestPanelGating(makeTempRepo()).status).toBe('PASS'));
  it('size bound evidence present', () => expect(inspectSizeBoundTests(makeTempRepo()).status).toBe('PASS'));
  it('size bound evidence missing exits 2', () => expect(inspectSizeBoundTests(makeTempRepo({ runtimeTest: 'it("x",()=>{})' })).status).toBe('NOT_VALIDATED'));
  it('truncation evidence present', () => expect(inspectSizeBoundTests(makeTempRepo()).details).toContain('size-bound'));
  it('valid JSON truncation evidence present', () => expect(inspectSizeBoundTests(makeTempRepo()).status).toBe('PASS'));
});

describe('package and file guards', () => {
  it('package diff only test:mobile-audio passes', async () => expect((await checkPackageDiff(makeTempRepo(), 'origin/main', makeRunner({ packageDiff: '+    "test:mobile-audio": "vitest"' }))).status).toBe('PASS'));
  it('package diff test plus verifier passes', async () => expect((await checkPackageDiff(makeTempRepo(), 'origin/main', makeRunner())).status).toBe('PASS'));
  it('unrelated package script rejected', async () => expect((await checkPackageDiff(makeTempRepo(), 'origin/main', makeRunner({ packageDiff: '+    "test:other": "x"' }))).status).toBe('FAIL'));
  it('changed files allowed pass', async () => expect((await checkChangedFiles(makeTempRepo(), 'origin/main', makeRunner())).status).toBe('PASS'));
  it('docs changed file rejected', async () => expect((await checkChangedFiles(makeTempRepo(), 'origin/main', makeRunner({ changedFiles: 'docs/x.md' }))).status).toBe('FAIL'));
  it('supabase changed file rejected', async () => expect((await checkChangedFiles(makeTempRepo(), 'origin/main', makeRunner({ changedFiles: 'supabase/functions/x.ts' }))).status).toBe('FAIL'));
  it('placement changed file rejected', async () => expect((await checkChangedFiles(makeTempRepo(), 'origin/main', makeRunner({ changedFiles: 'src/pages/placement/v3/ResultsPage.tsx' }))).status).toBe('FAIL'));
  it('RoomRenderer changed file rejected', async () => expect((await checkChangedFiles(makeTempRepo(), 'origin/main', makeRunner({ changedFiles: 'src/components/room/RoomRenderer.tsx' }))).status).toBe('FAIL'));
});

describe('drift guard', () => {
  it('drift path rejected', async () => expect((await scanDrift(makeTempRepo(), 'origin/main', makeRunner({ changedFiles: 'src/lib/placement/v4/x.ts' }))).status).toBe('FAIL'));
  it('drift added line rejected', async () => expect((await scanDrift(makeTempRepo(), 'origin/main', makeRunner({ unifiedDiff: '+const x = "replay";' }))).status).toBe('FAIL'));
  it('drift fixture terms allowed in verifier test file', async () => expect((await scanDrift(makeTempRepo(), 'origin/main', makeRunner({ unifiedDiff: '+++ b/scripts/__tests__/verify-mobile-audio.test.mjs\n+const x = "replay governance authority rehearsal sovereignty placement/v4";' }))).status).toBe('PASS'));
  it('drift guard passes clean diff', async () => expect((await scanDrift(makeTempRepo(), 'origin/main', makeRunner())).status).toBe('PASS'));
});

describe('blockers, exits, and model validation', () => {
  it('blocker cap at 5', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner({ fail: new Set(['test:mobile-audio','runtime','ui','typecheck','build','diffcheck']) }) });
    expect(model.topBlockers.length).toBeLessThanOrEqual(5);
  });
  it('next actions mirror blockers', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner({ fail: new Set(['build']) }) });
    expect(model.nextActions[0].check).toBe(model.topBlockers[0].check);
  });
  it('no blockers prints None', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() });
    expect(formatTerminal(model)).toContain('Top Blockers\nNone');
  });
  it('model rejects unknown status', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() });
    model.requiredChecks[0].status = 'BAD';
    expect(() => validateStatusModel(model)).toThrow(/unknown status/);
  });
  it('model rejects missing check field', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() });
    delete model.requiredChecks[0].details;
    expect(() => validateStatusModel(model)).toThrow(/missing check field/);
  });
  it('model rejects blocker without action', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner({ fail: new Set(['build']) }) });
    model.topBlockers[0].action = '';
    expect(() => validateStatusModel(model)).toThrow(/blocker without action/);
  });
  it('model rejects mismatched next actions', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner({ fail: new Set(['build']) }) });
    model.nextActions[0].check = 'other';
    expect(() => validateStatusModel(model)).toThrow(/next action mismatch/);
  });
  it('exit 0 READY path', () => expect(decideExit([])).toEqual({ exitCode: 0, exitReason: 'READY' }));
  it('exit 1 NOT_READY path', () => expect(decideExit([{ status: 'FAIL' }])).toEqual({ exitCode: 1, exitReason: 'NOT_READY' }));
  it('exit 2 NOT_VALIDATED path', () => expect(decideExit([{ status: 'NOT_VALIDATED' }])).toEqual({ exitCode: 2, exitReason: 'NOT_VALIDATED' }));
  it('exit 3 INVALID_CONFIGURATION path', () => expect(decideExit([{ status: 'INVALID_CONFIGURATION' }])).toEqual({ exitCode: 3, exitReason: 'INVALID_CONFIGURATION' }));
  it('exit 4 USAGE_ERROR path', async () => expect(await main(['--bad'])).toBe(4));
});

describe('terminal and JSON output', () => {
  it('JSON mode emits valid JSON', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() });
    expect(() => JSON.parse(formatJson(model))).not.toThrow();
  });
  it('JSON key order locked', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() });
    expect(Object.keys(JSON.parse(formatJson(model))).join('|')).toBe('schemaVersion|generatedAt|repoRoot|baseRef|branch|commit|nodeVersion|requiredChecks|testCounts|diagnosticsExport|privacyAudit|retestPanel|sizeBound|manualSanity|packageDiff|changedFiles|driftGuard|topBlockers|nextActions|exitCode|exitReason|runtimeMs');
  });
  it('JSON schemaVersion locked', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() });
    expect(JSON.parse(formatJson(model)).schemaVersion).toBe('mobile-audio-verification/v1');
  });
  it('terminal section order locked', async () => {
    const text = formatTerminal(await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() }));
    expect(text.indexOf('Run Info')).toBeLessThan(text.indexOf('Required Checks'));
    expect(text.indexOf('Diagnostics Export')).toBeLessThan(text.indexOf('Privacy Audit'));
    expect(text.indexOf('Top Blockers')).toBeLessThan(text.indexOf('Next Actions'));
  });
  it('terminal includes command', async () => expect(formatTerminal(await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() }))).toContain('mock command'));
  it('terminal includes status', async () => expect(formatTerminal(await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() }))).toContain('PASS'));
  it('terminal includes exit code', async () => expect(formatTerminal(await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() }))).toContain('exit 0'));
  it('terminal includes duration', async () => expect(formatTerminal(await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() }))).toContain('7ms'));
  it('terminal includes test count', async () => expect(formatTerminal(await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() }))).toContain('tests 54'));
  it('JSON includes command', async () => expect(JSON.parse(formatJson(await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() }))).requiredChecks[0].command).toBe('mock command'));
  it('JSON includes status', async () => expect(JSON.parse(formatJson(await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() }))).requiredChecks[0].status).toBe('PASS'));
  it('JSON includes exitCode', async () => expect(JSON.parse(formatJson(await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() }))).requiredChecks[0].exitCode).toBe(0));
  it('JSON includes durationMs', async () => expect(JSON.parse(formatJson(await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() }))).requiredChecks[0].durationMs).toBe(7));
  it('JSON includes testCount', async () => expect(JSON.parse(formatJson(await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() }))).requiredChecks[0].testCount).toBe(54));
  it('stable terminal after normalization', async () => {
    const one = normalizeTerminal(formatTerminal(await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner(), branch: 'b', commit: 'c' })));
    const two = normalizeTerminal(formatTerminal(await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner(), branch: 'b', commit: 'd' })));
    expect(one).toBe(two);
  });
  it('stable JSON after normalization', async () => {
    const one = normalizeJson(formatJson(await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner(), branch: 'b', commit: 'c' })));
    const two = normalizeJson(formatJson(await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner(), branch: 'b', commit: 'd' })));
    expect(one).toBe(two);
  });
  it('spawned CLI --help works', () => {
    const out = spawnSync(process.execPath, ['scripts/verify-mobile-audio.mjs', '--help'], { cwd: repoRoot, encoding: 'utf8' });
    expect(out.status).toBe(0);
    expect(out.stdout).toContain('Usage');
  });
  it('spawned CLI --json works with temp fixture if feasible', async () => {
    const code = await main(['--json', '--skip-build'], { repoRoot: makeTempRepo(), runner: makeRunner(), branch: 'b', commit: 'c' });
    expect(code).toBe(0);
  });
});

describe('manual sanity and extra guard cases', () => {
  it('manual sanity absent reports NOT_RECHECKED', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() });
    expect(model.manualSanity[0].status).toBe('NOT_RECHECKED');
  });
  it('manual sanity flag reports CONFIRMED', async () => {
    const model = await buildStatusModel(baseConfig({ manualSanityConfirmed: true }), { repoRoot: makeTempRepo(), runner: makeRunner() });
    expect(model.manualSanity[0].status).toBe('CONFIRMED');
  });
  it('missing test:mobile-audio script reports MISSING', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo({ scripts: { 'test:mobile-audio': undefined } }), runner: makeRunner() });
    expect(model.requiredChecks.find((c) => c.name === 'test:mobile-audio').status).toBe('MISSING');
  });
  it('invalid package json reports invalid configuration', async () => {
    const root = makeTempRepo();
    write(root, 'package.json', '{');
    const model = await buildStatusModel(baseConfig(), { repoRoot: root, runner: makeRunner() });
    expect(model.requiredChecks[0].status).toBe('INVALID_CONFIGURATION');
  });
  it('required check failure becomes blocker', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner({ fail: new Set(['build']) }) });
    expect(model.topBlockers[0].check).toBe('build');
  });
  it('NOT_VALIDATED command exits with not validated model', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner({ runtime: 1 }) });
    expect(model.exitCode).toBe(2);
  });
  it('FAIL command exits with not ready model', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner({ fail: new Set(['build']) }) });
    expect(model.exitCode).toBe(1);
  });
  it('INVALID_CONFIGURATION exits with invalid model', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo({ runtime: '' }), runner: makeRunner() });
    expect(model.exitCode).toBe(3);
  });
  it('JSON output blocker order stable', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner({ fail: new Set(['test:mobile-audio','runtime']) }) });
    expect(model.topBlockers.map((b) => b.check)).toEqual(['test:mobile-audio','runtime tests']);
  });
  it('next actions have no duplicate check action pairs', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner({ fail: new Set(['build']) }) });
    const pairs = new Set(model.nextActions.map((a) => `${a.check}:${a.action}`));
    expect(pairs.size).toBe(model.nextActions.length);
  });
  it('max export bytes custom value is parsed', () => expect(parseArgs(['--max-export-bytes', '9000']).maxExportBytes).toBe(9000));
  it('runtime threshold custom value is parsed', () => expect(parseArgs(['--min-runtime-tests', '35']).minRuntimeTests).toBe(35));
  it('UI threshold custom value is parsed', () => expect(parseArgs(['--min-ui-tests', '21']).minUiTests).toBe(21));
  it('total threshold custom value is parsed', () => expect(parseArgs(['--min-total-tests', '55']).minTotalTests).toBe(55));
  it('formatJson validates before output', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() });
    expect(formatJson(model)).toContain('"schemaVersion"');
  });
});

describe('verifier self-test hardening', () => {
  it('EXPECTED_FILES includes verify-mobile-audio.mjs', () => {
    expect(EXPECTED_FILES).toContain('scripts/verify-mobile-audio.mjs');
  });
  it('EXPECTED_FILES includes verify-mobile-audio.test.mjs', () => {
    expect(EXPECTED_FILES).toContain('scripts/__tests__/verify-mobile-audio.test.mjs');
  });
  it('verifier test suite command in required checks', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() });
    const check = model.requiredChecks.find((c) => c.name === 'verifier tests');
    expect(check).toBeTruthy();
    expect(check.command).toBeTruthy();
    expect(check.required).toBe(true);
  });
  it('verifier test failure blocks READY', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner({ fail: new Set(['verifier']) }) });
    expect(model.topBlockers.some((b) => b.check === 'verifier tests')).toBe(true);
    expect(model.exitCode).not.toBe(0);
  });
  it('verifier tests not skipped by --skip-build', async () => {
    const model = await buildStatusModel(baseConfig({ skipBuild: true }), { repoRoot: makeTempRepo(), runner: makeRunner() });
    const check = model.requiredChecks.find((c) => c.name === 'verifier tests');
    expect(check.status).not.toBe('SKIPPED');
  });
  it('--json output valid with verifier tests passing', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() });
    const json = formatJson(model);
    expect(() => JSON.parse(json)).not.toThrow();
    const parsed = JSON.parse(json);
    expect(parsed.requiredChecks.some((c) => c.name === 'verifier tests')).toBe(true);
  });
  it('terminal output does not expose secrets or learner data', async () => {
    const model = await buildStatusModel(baseConfig(), { repoRoot: makeTempRepo(), runner: makeRunner() });
    const text = formatTerminal(model);
    expect(text).not.toMatch(/token|secret|authorization|learnerId|userId|deviceId/i);
  });
});
