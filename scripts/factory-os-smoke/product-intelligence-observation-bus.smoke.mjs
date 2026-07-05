import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createObservationBus } from '../../factory-os/product-intelligence/observationBus.mjs';

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
        sessionId: 'observation-bus-speaking-test',
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

const effect = JSON.parse(runtimeResult);
const bus = createObservationBus();

const emitted = bus.emit(effect);
assert.equal(emitted.ok, true);
assert.equal(emitted.observation.productCapability, 'PCAP-TM-SPEAKING-RUNTIME');
assert.equal(emitted.observation.productFlow, 'PFLOW-SPEAKING-RUNTIME');
assert.equal(emitted.observation.runtimeFlow, 'speaking');

assert.equal(bus.all().length, 1);
assert.equal(bus.byRuntimeFlow('speaking').length, 1);
assert.equal(bus.byCapability('PCAP-TM-SPEAKING-RUNTIME').length, 1);

const coverage = bus.coverage();
assert.equal(coverage.total, 1);
assert.equal(coverage.byRuntimeFlow.speaking, 1);
assert.equal(coverage.byCapability['PCAP-TM-SPEAKING-RUNTIME'], 1);

assert.equal(bus.emit({ kind: 'bad' }).ok, false);

console.log('product intelligence observation bus tests PASS');
