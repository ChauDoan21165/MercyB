import assert from 'node:assert/strict'
import { createSingleObjectiveRunnerPlan } from '../../factory-os/product-intelligence/singleObjectiveRunnerSkeleton.mjs'

const queueItem = {
  type: 'FactoryQueueItem',
  status: 'queue_ready',
  sourceInvestmentId: 'INV-TM-SPEAKING-OBS-001',
  sourceObjectiveId: 'EO-TM-SPEAKING-OBS-001',
  pcap: 'TM_SPEAKING_RUNTIME_OBSERVATION',
  pflow: 'Speaking Runtime → product_observation effect → Observation Bus',
  packagePath: 'state/factory-packages/INV-TM-SPEAKING-OBS-001.json'
}

const factoryExecutionPackage = {
  type: 'FactoryExecutionPackage',
  status: 'package_ready',
  sourceInvestmentId: 'INV-TM-SPEAKING-OBS-001'
}

const plan = createSingleObjectiveRunnerPlan({ queueItem, factoryExecutionPackage })

assert.equal(plan.type, 'SingleObjectiveRunnerPlan')
assert.equal(plan.status, 'runner_plan_ready')
assert.equal(plan.sourceInvestmentId, 'INV-TM-SPEAKING-OBS-001')
assert.equal(plan.packagePath, queueItem.packagePath)
assert.ok(plan.steps.includes('stop before execution'))
assert.equal(plan.boundary.implementationExecuted, false)
assert.equal(plan.boundary.judgeExecuted, false)
assert.equal(plan.boundary.workerMayMarkVerified, false)
assert.equal(plan.boundary.runtimeReadinessClaimed, false)
assert.equal(plan.boundary.capabilityVerifiedClaimed, false)
assert.equal(plan.boundary.mayMergePushDeploy, false)
assert.equal(plan.boundary.oneObjectiveAtATime, true)

assert.throws(() => createSingleObjectiveRunnerPlan({
  queueItem: { type: 'FactoryQueueItem', status: 'draft' },
  factoryExecutionPackage
}), /queue_ready/)

assert.throws(() => createSingleObjectiveRunnerPlan({
  queueItem,
  factoryExecutionPackage: { type: 'FactoryExecutionPackage', status: 'draft' }
}), /package_ready/)

assert.throws(() => createSingleObjectiveRunnerPlan({
  queueItem,
  factoryExecutionPackage: {
    type: 'FactoryExecutionPackage',
    status: 'package_ready',
    sourceInvestmentId: 'OTHER'
  }
}), /mismatch/)

console.log('single objective runner skeleton tests PASS')
