#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { createRuntimeEventObservation, summarizeRuntimeCoverage } from './runtimeEventObserver.mjs';

for (const file of [
  'factory-os/product-intelligence/runtimeEventObserver.mjs',
  'factory-os/product-intelligence/PRODUCT_INTELLIGENCE_SERVICE_V1.md',
  'scripts/__tests__/product-intelligence-runtime-observer.test.mjs'
]) {
  if (!existsSync(file)) {
    console.error('PRODUCT_INTELLIGENCE_V1_JUDGE_FAIL missing', file);
    process.exit(1);
  }
}

const obs = createRuntimeEventObservation({
  flow: 'speaking',
  eventType: 'tone_assessment_runtime_event',
  productCapability: 'PCAP-TM-TONE-PRODUCTION-ASSESSMENT',
  occurredAt: new Date().toISOString(),
  evidence: ['judge-synthetic-contract-only']
});

if (!obs.ok) {
  console.error('PRODUCT_INTELLIGENCE_V1_JUDGE_FAIL valid observation rejected');
  process.exit(1);
}

const coverage = summarizeRuntimeCoverage([obs.observation]);
if (!coverage.missingFlows.includes('placement')) {
  console.error('PRODUCT_INTELLIGENCE_V1_JUDGE_FAIL coverage missing flow detection failed');
  process.exit(1);
}

console.log('PRODUCT_INTELLIGENCE_V1_JUDGE_PASS');
