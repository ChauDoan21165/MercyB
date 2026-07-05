import assert from 'node:assert/strict'

import { generateFactoryExecutionPackage } from '../../factory-os/product-intelligence/productIntelligenceOrchestrator.mjs'
import { createQueueReadyPackage } from '../../factory-os/product-intelligence/packageQueueAdapter.mjs'
import { createSingleObjectiveRunnerPlan } from '../../factory-os/product-intelligence/singleObjectiveRunnerSkeleton.mjs'
import { evaluateRunnerExecutionGate } from '../../factory-os/product-intelligence/runnerExecutionGate.mjs'

const emptyBoxInvestment = {
  id: 'INV-EMPTY-BOX-TM-SPEAKING-OBS-001',
  status: 'objective_ready',
  pcap: 'TM_SPEAKING_RUNTIME_OBSERVATION_EMPTY_BOX',
  pflow: 'Empty Box → EO → ECON → Runbook → Package → Queue → Runner → Execution Gate',
  problem: 'Prove the Factory OS conveyor accepts one objective-ready investment end to end without execution.',
  productValue: 'Validates C2 automation wiring before running real product work.',
  allowedFiles: [
    'factory-os/product-intelligence/**',
    'scripts/__tests__/**'
  ],
  forbiddenFiles: [
    'src/**',
    'supabase/**'
  ],
  acceptanceCriteria: [
    'One empty-box EngineeringInvestment becomes one FactoryExecutionPackage.',
    'One FactoryExecutionPackage becomes one FactoryQueueItem.',
    'One FactoryQueueItem plus package becomes one SingleObjectiveRunnerPlan.',
    'Execution Gate allows preparation but no worker or Judge execution occurs.',
    'IDs, PCAP, PFLOW, and boundaries are preserved.'
  ],
  verificationCommands: [
    'node scripts/__tests__/factory-os-v31-empty-box-integration.test.mjs'
  ]
}

const baseline = {
  baseCommit: '6064b6de',
  modifiedFiles: [
    'src/pre-existing-dirty-file.ts'
  ]
}

const pkg = generateFactoryExecutionPackage({
  investment: emptyBoxInvestment,
  baseline,
  reportPath: '/Users/chaudoanm3/ai-tutor-factory/reports/FACTORY_REPORT_FOR_CHATGPT.md'
})

assert.equal(pkg.type, 'FactoryExecutionPackage')
assert.equal(pkg.status, 'package_ready')
assert.equal(pkg.sourceInvestmentId, emptyBoxInvestment.id)
assert.equal(pkg.pcap, emptyBoxInvestment.pcap)
assert.equal(pkg.pflow, emptyBoxInvestment.pflow)
assert.equal(pkg.engineeringObjective.type, 'EngineeringObjective')
assert.equal(pkg.executionContract.type, 'ExecutionContract')
assert.equal(pkg.runbook.type, 'EconRunbook')
assert.equal(pkg.workerPrompt.type, 'WorkerPrompt')
assert.equal(pkg.judgePrompt.type, 'JudgePrompt')
assert.equal(pkg.boundary.implementationExecuted, false)
assert.equal(pkg.boundary.judgeExecuted, false)

const queueItem = createQueueReadyPackage({
  factoryExecutionPackage: pkg,
  packagePath: 'state/factory-packages/INV-EMPTY-BOX-TM-SPEAKING-OBS-001.json'
})

assert.equal(queueItem.type, 'FactoryQueueItem')
assert.equal(queueItem.status, 'queue_ready')
assert.equal(queueItem.sourceInvestmentId, emptyBoxInvestment.id)
assert.equal(queueItem.pcap, emptyBoxInvestment.pcap)
assert.equal(queueItem.pflow, emptyBoxInvestment.pflow)

const runnerPlan = createSingleObjectiveRunnerPlan({
  queueItem,
  factoryExecutionPackage: pkg
})

assert.equal(runnerPlan.type, 'SingleObjectiveRunnerPlan')
assert.equal(runnerPlan.status, 'runner_plan_ready')
assert.equal(runnerPlan.sourceInvestmentId, emptyBoxInvestment.id)
assert.equal(runnerPlan.pcap, emptyBoxInvestment.pcap)
assert.equal(runnerPlan.pflow, emptyBoxInvestment.pflow)
assert.ok(runnerPlan.steps.includes('stop before execution'))
assert.equal(runnerPlan.boundary.implementationExecuted, false)
assert.equal(runnerPlan.boundary.judgeExecuted, false)

const gate = evaluateRunnerExecutionGate({
  queueItem,
  factoryExecutionPackage: pkg,
  oneObjectiveLock: true
})

assert.equal(gate.type, 'RunnerExecutionGate')
assert.equal(gate.status, 'execution_allowed')
assert.equal(gate.pass, true)
assert.deepEqual(gate.reasons, [])
assert.equal(gate.sourceInvestmentId, emptyBoxInvestment.id)
assert.equal(gate.pcap, emptyBoxInvestment.pcap)
assert.equal(gate.pflow, emptyBoxInvestment.pflow)
assert.equal(gate.boundary.executionDecisionOnly, true)
assert.equal(gate.boundary.implementationExecuted, false)
assert.equal(gate.boundary.judgeExecuted, false)
assert.equal(gate.boundary.workerMayMarkVerified, false)
assert.equal(gate.boundary.runtimeReadinessClaimed, false)
assert.equal(gate.boundary.capabilityVerifiedClaimed, false)
assert.equal(gate.boundary.mayMergePushDeploy, false)

console.log('factory os v3.1 empty box integration tests PASS')
console.log('EMPTY BOX SUCCESSFULLY REACHED END OF CONVEYOR')
