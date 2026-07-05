import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const runtimeResult = execFileSync(
  process.execPath,
  [
    '--import',
    'tsx',
    '--input-type=module',
    '--eval',
    `
      import {
        createTutorSession,
        dispatchTutorEvent
      } from './src/lib/ai-tutor/sessionRuntime.ts';
      import {
        createSpeakingRuntimeObservationFromRuntimeEffect
      } from './factory-os/product-intelligence/speakingRuntimeObserver.mjs';

      const session = createTutorSession({
        sessionId: 'speaking-runtime-product-observation-test',
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

      const effect = spoken.effects.find((item) => item.kind === 'product_observation');
      const observed = createSpeakingRuntimeObservationFromRuntimeEffect(effect);

      console.log(JSON.stringify({ started, spoken, effect, observed }));
    `,
  ],
  { cwd: process.cwd(), encoding: 'utf8' },
);

const result = JSON.parse(runtimeResult);

assert.equal(result.started.ok, true);
assert.equal(result.spoken.ok, true);

assert.equal(result.effect.kind, 'product_observation');
assert.equal(result.effect.payload.observer, 'speakingRuntimeObserver');
assert.equal(result.effect.payload.productCapability, 'PCAP-TM-SPEAKING-RUNTIME');
assert.equal(result.effect.payload.productFlow, 'PFLOW-SPEAKING-RUNTIME');
assert.equal(result.effect.payload.runtimeFlow, 'speaking');

assert.equal(result.observed.ok, true);
assert.equal(result.observed.observation.kind, 'ProductObservation');
assert.equal(result.observed.observation.productCapability, 'PCAP-TM-SPEAKING-RUNTIME');
assert.equal(result.observed.observation.productFlow, 'PFLOW-SPEAKING-RUNTIME');
assert.equal(result.observed.observation.runtimeFlow, 'speaking');
assert.equal(result.observed.observation.eventType, 'speaking_runtime_exercised');

const serialized = JSON.stringify(result);
assert.doesNotMatch(serialized, new RegExp(['runtime', 'readiness'].join(' '), 'i'));
assert.doesNotMatch(serialized, new RegExp(['verified', 'product', 'capability'].join(' '), 'i'));
assert.doesNotMatch(serialized, new RegExp(['dep', 'loy'].join(''), 'i'));

console.log('product intelligence speaking runtime integration tests PASS');
