import assert from 'node:assert/strict';
import {
  observeSpeakingRuntimeEvent,
  createSpeakingRuntimeObservationBundle
} from '../../factory-os/product-intelligence/speakingRuntimeObserver.mjs';

const obs = observeSpeakingRuntimeEvent({
  productCapability: 'PCAP-TM-TONE-PRODUCTION-ASSESSMENT',
  eventType: 'tone_assessment_runtime_candidate',
  occurredAt: '2026-07-05T00:00:00.000Z',
  evidence: ['product-like-speaking-event']
});

assert.equal(obs.ok, true);
assert.equal(obs.observation.runtimeFlow, 'speaking');
assert.equal(obs.observation.productCapability, 'PCAP-TM-TONE-PRODUCTION-ASSESSMENT');

const bundle = createSpeakingRuntimeObservationBundle({
  productCapability: 'PCAP-TM-TONE-PRODUCTION-ASSESSMENT',
  eventType: 'tone_assessment_runtime_candidate',
  occurredAt: '2026-07-05T00:00:00.000Z',
  evidence: ['product-like-speaking-event'],
  liveRuntimeIntegrated: false
});

assert.equal(bundle.ok, true);
assert.equal(bundle.bundle.runtimeFlow, 'speaking');
assert.equal(bundle.bundle.boundary.runtimeReadinessClaimed, false);
assert.equal(bundle.bundle.boundary.productCapabilityVerifiedClaimed, false);

console.log('product intelligence speaking runtime observer tests PASS');
