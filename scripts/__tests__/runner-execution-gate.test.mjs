import assert from 'node:assert/strict'
import { evaluateRunnerExecutionGate } from '../../factory-os/product-intelligence/runnerExecutionGate.mjs'

const queueItem = {
  type: 'FactoryQueueItem',
  status: 'queue_ready',
  sourceInvestmentId: 'INV-TM-SPEAKING-OBS-001',
  pcap: 'TM_SPEAKING_RUNTIME_OBSERVATION',
  pflow: 'Speaking Runtime → product_observation effect → Observation Bus'
}

const factoryExecutionPackage = {
  type: 'FactoryExecutionPackage',
  status: 'package_ready',
  sourceInvestmentId: 'INV-TM-SPEAKING-OBS-001',
  pcap: 'TM_SPEAKING_RUNTIME_OBSERVATION',
  pflow: 'Speaking Runtime → product_observation effect → Observation Bus',
  executionContract: {
    type: 'ExecutionContract',
    status: 'econ_ready',
    baseCommit: '6064b6de',
    baselineModifiedFiles: []
  },
  workerPrompt: {
    type: 'WorkerPrompt',
    status: 'worker_prompt_ready'
  },
  judgePrompt: {
    type: 'JudgePrompt',
    status: 'judge_prompt_ready'
  },
  runbook: {
    type: 'EconRunbook',
    status: 'runbook_ready'
  },
  boundary: {
    mayMergePushDeploy: false,
    workerMayMarkVerified: false,
    implementationExecuted: false,
    judgeExecuted: false
  }
}

const allowed = evaluateRunnerExecutionGate({ queueItem, factoryExecutionPackage, oneObjectiveLock: true })
assert.equal(allowed.type, 'RunnerExecutionGate')
assert.equal(allowed.status, 'execution_allowed')
assert.equal(allowed.pass, true)
assert.deepEqual(allowed.reasons, [])
assert.equal(allowed.boundary.executionDecisionOnly, true)
assert.equal(allowed.boundary.implementationExecuted, false)
assert.equal(allowed.boundary.judgeExecuted, false)
assert.equal(allowed.boundary.workerMayMarkVerified, false)
assert.equal(allowed.boundary.mayMergePushDeploy, false)

const blocked = evaluateRunnerExecutionGate({
  queueItem: { ...queueItem, status: 'running' },
  factoryExecutionPackage: {
    ...factoryExecutionPackage,
    workerPrompt: { type: 'WorkerPrompt', status: 'draft' },
    boundary: { ...factoryExecutionPackage.boundary, workerMayMarkVerified: true }
  },
  oneObjectiveLock: false
})

assert.equal(blocked.status, 'execution_blocked')
assert.equal(blocked.pass, false)
assert.ok(blocked.reasons.includes('queue item is not queue_ready'))
assert.ok(blocked.reasons.includes('one-objective lock is not active'))
assert.ok(blocked.reasons.includes('missing worker_prompt_ready WorkerPrompt'))
assert.ok(blocked.reasons.includes('worker must not be allowed to mark verified'))

console.log('runner execution gate tests PASS')
