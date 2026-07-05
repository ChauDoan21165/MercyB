import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createObservationBus } from '../../factory-os/product-intelligence/observationBus.mjs';
import { analyzeCapabilityCoverage } from '../../factory-os/product-intelligence/capabilityCoverageEngine.mjs';
import {
  productGapsToEngineeringInvestments,
  selectObjectiveReadyInvestments
} from '../../factory-os/product-intelligence/productGapInvestmentAdapter.mjs';

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
        sessionId: 'product-gap-investment-test',
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
const investments = productGapsToEngineeringInvestments(coverage.productGaps);
const objectiveReady = selectObjectiveReadyInvestments(investments);

assert.ok(investments.length >= 1);
assert.ok(investments.every((item) => item.kind === 'EngineeringInvestment'));
assert.ok(investments.every((item) => item.productCapability));
assert.ok(investments.every((item) => item.runtimeFlow));
assert.ok(investments.every((item) => Number.isFinite(item.roi)));

const placement = investments.find((item) => item.productCapability === 'PCAP-TM-PLACEMENT-RUNTIME');
assert.ok(placement);
assert.equal(placement.sourceKind, 'ProductCapabilityGap');

assert.ok(objectiveReady.length >= 1);
assert.ok(objectiveReady.every((item) => item.action === 'GENERATE_ENGINEERING_OBJECTIVE'));

console.log('product gap investment adapter tests PASS');
