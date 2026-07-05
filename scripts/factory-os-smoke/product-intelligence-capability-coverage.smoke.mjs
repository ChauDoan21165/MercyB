import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createObservationBus } from '../../factory-os/product-intelligence/observationBus.mjs';
import { analyzeCapabilityCoverage } from '../../factory-os/product-intelligence/capabilityCoverageEngine.mjs';

const runtimeResult = execFileSync(
  process.execPath,
  [
    '--import',
    'tsx',
    '--input-type=module',
    '--eval',
    `
      import { createTutorSession, dispatchTutorEvent } from './src/lib/ai-tutor/sessionRuntime.ts';

      const session = createTutorSession({
        sessionId: 'capability-coverage-speaking-test',
        userId: 'learner-1',
        tier: 'free',
        entryPoint: 'speak',
        nowMs: Date.parse('2026-07-05T00:00:00.000Z')
      });

      const started = dispatchTutorEvent(session, {
        type: 'SESSION_START',
        sessionId: session.sessionId,
        userId: session.userId,
        tier: 'free',
        entryPoint: 'speak',
        nowMs: Date.parse('2026-07-05T00:00:00.000Z')
      });

      const spoken = dispatchTutorEvent(started.session, {
        type: 'LEARNER_MESSAGE_SENT',
        content: 'luyện nói má',
        entryPoint: 'speak',
        mode: 'pronunciation_coaching'
      });

      console.log(JSON.stringify(spoken.effects.find((item) => item.kind === 'product_observation')));
    `,
  ],
  { cwd: process.cwd(), encoding: 'utf8' },
);

const bus = createObservationBus();
const emitted = bus.emit(JSON.parse(runtimeResult));
assert.equal(emitted.ok, true);

const coverage = analyzeCapabilityCoverage(bus.all());

assert.equal(coverage.totalCapabilities >= 5, true);
assert.equal(coverage.partial >= 1 || coverage.covered >= 1, true);

const speakingRuntime = coverage.capabilityCoverage.find(
  (item) => item.productCapability === 'PCAP-TM-SPEAKING-RUNTIME'
);
assert.ok(speakingRuntime);
assert.equal(speakingRuntime.observed, true);

const placement = coverage.capabilityCoverage.find(
  (item) => item.productCapability === 'PCAP-TM-PLACEMENT-RUNTIME'
);
assert.ok(placement);
assert.equal(placement.coverageState, 'unobserved');

assert.ok(coverage.productGaps.some((gap) => gap.productCapability === 'PCAP-TM-PLACEMENT-RUNTIME'));
assert.ok(coverage.productGaps.some((gap) => gap.productCapability === 'PCAP-TM-TONE-PRODUCTION-ASSESSMENT'));

console.log('product intelligence capability coverage tests PASS');
