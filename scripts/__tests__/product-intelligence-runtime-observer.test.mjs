import assert from 'node:assert/strict';
import {
  createRuntimeEventObservation,
  summarizeRuntimeCoverage
} from '../../factory-os/product-intelligence/runtimeEventObserver.mjs';

const result = createRuntimeEventObservation({
  flow: 'speaking',
  eventType: 'teacher_context_seen',
  productCapability: 'PCAP-TM-SPEAKING-RUNTIME',
  occurredAt: '2026-07-05T00:00:00.000Z',
  evidence: ['runtime-event']
});

assert.equal(result.ok, true);
assert.equal(result.observation.kind, 'ProductObservation');
assert.equal(result.observation.runtimeFlow, 'speaking');

const bad = createRuntimeEventObservation({
  flow: 'unknown',
  eventType: 'x',
  productCapability: 'PCAP-X',
  occurredAt: '2026-07-05T00:00:00.000Z'
});
assert.equal(bad.ok, false);

const coverage = summarizeRuntimeCoverage([result.observation]);
assert.equal(coverage.byFlow.speaking, 1);
assert.ok(coverage.missingFlows.includes('placement'));
assert.ok(coverage.missingFlows.includes('tutor'));
assert.ok(coverage.missingFlows.includes('listening'));

console.log('product intelligence runtime observer tests PASS');
