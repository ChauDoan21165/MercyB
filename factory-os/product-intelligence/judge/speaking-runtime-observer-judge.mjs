#!/usr/bin/env node
import { existsSync, writeFileSync } from 'node:fs';
import { createSpeakingRuntimeObservationBundle } from '../speakingRuntimeObserver.mjs';

const required = [
  'factory-os/product-intelligence/runtimeEventObserver.mjs',
  'factory-os/product-intelligence/speakingRuntimeObserver.mjs',
  'scripts/__tests__/product-intelligence-speaking-runtime-observer.test.mjs'
];

for (const file of required) {
  if (!existsSync(file)) {
    console.error('SPEAKING_RUNTIME_OBSERVER_JUDGE_FAIL missing', file);
    process.exit(1);
  }
}

const result = createSpeakingRuntimeObservationBundle({
  id: 'POBS-TM-SPEAKING-TONE-PRODUCT-LIKE-001',
  productCapability: 'PCAP-TM-TONE-PRODUCTION-ASSESSMENT',
  eventType: 'tone_assessment_runtime_candidate',
  occurredAt: new Date().toISOString(),
  evidence: ['product-like-speaking-observation-contract'],
  liveRuntimeIntegrated: false
});

if (!result.ok) {
  console.error('SPEAKING_RUNTIME_OBSERVER_JUDGE_FAIL bundle rejected');
  process.exit(1);
}

if (result.bundle.boundary.runtimeReadinessClaimed) {
  console.error('SPEAKING_RUNTIME_OBSERVER_JUDGE_FAIL runtime readiness claimed');
  process.exit(1);
}

writeFileSync(
  'factory-os/product-intelligence/observations/POBS-TM-SPEAKING-TONE-PRODUCT-LIKE-001.json',
  JSON.stringify(result.bundle, null, 2)
);

console.log('SPEAKING_RUNTIME_OBSERVER_JUDGE_PASS');
