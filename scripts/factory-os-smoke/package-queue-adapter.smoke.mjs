import assert from 'node:assert/strict'
import { createQueueReadyPackage, serializeFactoryExecutionPackage } from '../../factory-os/product-intelligence/packageQueueAdapter.mjs'

const factoryExecutionPackage = {
  type: 'FactoryExecutionPackage',
  status: 'package_ready',
  sourceInvestmentId: 'INV-TM-SPEAKING-OBS-001',
  pcap: 'TM_SPEAKING_RUNTIME_OBSERVATION',
  pflow: 'Speaking Runtime → product_observation effect → Observation Bus',
  executionContract: {
    sourceObjectiveId: 'EO-TM-SPEAKING-OBS-001'
  },
  workerPrompt: {
    status: 'worker_prompt_ready'
  },
  judgePrompt: {
    status: 'judge_prompt_ready'
  },
  runbook: {
    status: 'runbook_ready'
  }
}

const queueItem = createQueueReadyPackage({
  factoryExecutionPackage,
  packagePath: 'state/factory-packages/INV-TM-SPEAKING-OBS-001.json'
})

assert.equal(queueItem.type, 'FactoryQueueItem')
assert.equal(queueItem.status, 'queue_ready')
assert.equal(queueItem.sourceInvestmentId, 'INV-TM-SPEAKING-OBS-001')
assert.equal(queueItem.sourceObjectiveId, 'EO-TM-SPEAKING-OBS-001')
assert.equal(queueItem.requiredRunner, 'c2-factory-single-objective-runner')
assert.equal(queueItem.requiredJudge, 'independent-judge')
assert.equal(queueItem.boundary.implementationExecuted, false)
assert.equal(queueItem.boundary.judgeExecuted, false)
assert.equal(queueItem.boundary.workerMayMarkVerified, false)
assert.equal(queueItem.boundary.runtimeReadinessClaimed, false)
assert.equal(queueItem.boundary.capabilityVerifiedClaimed, false)
assert.equal(queueItem.boundary.mayMergePushDeploy, false)
assert.equal(queueItem.boundary.oneObjectiveAtATime, true)

const serialized = serializeFactoryExecutionPackage(factoryExecutionPackage)
const parsed = JSON.parse(serialized)
assert.equal(parsed.type, 'FactoryExecutionPackage')
assert.equal(parsed.status, 'package_ready')

assert.throws(() => createQueueReadyPackage({ factoryExecutionPackage: { type: 'FactoryExecutionPackage', status: 'draft' }, packagePath: 'x.json' }), /package_ready/)
assert.throws(() => createQueueReadyPackage({ factoryExecutionPackage, packagePath: '' }), /packagePath/)
assert.throws(() => serializeFactoryExecutionPackage({ type: 'Other' }), /FactoryExecutionPackage/)

console.log('package queue adapter tests PASS')
