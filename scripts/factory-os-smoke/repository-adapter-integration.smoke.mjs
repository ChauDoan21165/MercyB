import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import {
  discoverObjectiveReadyInvestments,
  selectFirstObjectiveReadyInvestment
} from '../../factory-os/product-intelligence/mercybRepositoryAdapter.mjs'
import { generateFactoryExecutionPackage } from '../../factory-os/product-intelligence/productIntelligenceOrchestrator.mjs'
import { createQueueReadyPackage } from '../../factory-os/product-intelligence/packageQueueAdapter.mjs'
import { createSingleObjectiveRunnerPlan } from '../../factory-os/product-intelligence/singleObjectiveRunnerSkeleton.mjs'
import { evaluateRunnerExecutionGate } from '../../factory-os/product-intelligence/runnerExecutionGate.mjs'

const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'mercyb-repository-fed-integration-'))
fs.mkdirSync(path.join(repo, 'state', 'investments'), { recursive: true })

fs.writeFileSync(path.join(repo, 'state', 'investments', 'real-investment.json'), JSON.stringify({
  id: 'INV-REPO-FED-TM-SPEAKING-OBS-001',
  status: 'objective_ready',
  pcap: 'TM_REPO_FED_SPEAKING_OBSERVATION',
  pflow: 'MercyB Repository → Adapter → Orchestrator → Queue → Runner → Gate',
  problem: 'Prove repository-discovered investments can feed the Factory conveyor.',
  productValue: 'C2 no longer needs Chau to manually relay an investment.',
  allowedFiles: [
    'factory-os/product-intelligence/**',
    'scripts/__tests__/**'
  ],
  forbiddenFiles: [
    'src/**',
    'supabase/**'
  ],
  acceptanceCriteria: [
    'Repository Adapter discovers objective_ready investment.',
    'Orchestrator produces FactoryExecutionPackage.',
    'Queue Adapter produces FactoryQueueItem.',
    'Runner Skeleton produces SingleObjectiveRunnerPlan.',
    'Execution Gate allows preparation and stops before execution.'
  ],
  verificationCommands: [
    'node scripts/__tests__/repository-adapter-integration.test.mjs'
  ]
}, null, 2))

const discovered = discoverObjectiveReadyInvestments({
  repoRoot: repo,
  searchRoots: ['state']
})

assert.equal(discovered.length, 1)

const investment = selectFirstObjectiveReadyInvestment({ investments: discovered })

assert.equal(investment.id, 'INV-REPO-FED-TM-SPEAKING-OBS-001')
assert.equal(investment.status, 'objective_ready')
assert.equal(investment.pcap, 'TM_REPO_FED_SPEAKING_OBSERVATION')
assert.equal(investment.sourcePath, 'state/investments/real-investment.json')

const baseline = {
  baseCommit: '6064b6de',
  modifiedFiles: ['src/pre-existing-dirty-file.ts']
}

const pkg = generateFactoryExecutionPackage({
  investment,
  baseline,
  reportPath: '/Users/chaudoanm3/ai-tutor-factory/reports/FACTORY_REPORT_FOR_CHATGPT.md'
})

assert.equal(pkg.type, 'FactoryExecutionPackage')
assert.equal(pkg.status, 'package_ready')
assert.equal(pkg.sourceInvestmentId, investment.id)
assert.equal(pkg.pcap, investment.pcap)
assert.equal(pkg.pflow, investment.pflow)
assert.equal(pkg.boundary.implementationExecuted, false)
assert.equal(pkg.boundary.judgeExecuted, false)

const queueItem = createQueueReadyPackage({
  factoryExecutionPackage: pkg,
  packagePath: 'state/factory-packages/INV-REPO-FED-TM-SPEAKING-OBS-001.json'
})

assert.equal(queueItem.type, 'FactoryQueueItem')
assert.equal(queueItem.status, 'queue_ready')
assert.equal(queueItem.sourceInvestmentId, investment.id)
assert.equal(queueItem.pcap, investment.pcap)

const runnerPlan = createSingleObjectiveRunnerPlan({
  queueItem,
  factoryExecutionPackage: pkg
})

assert.equal(runnerPlan.type, 'SingleObjectiveRunnerPlan')
assert.equal(runnerPlan.status, 'runner_plan_ready')
assert.equal(runnerPlan.sourceInvestmentId, investment.id)
assert.ok(runnerPlan.steps.includes('stop before execution'))

const gate = evaluateRunnerExecutionGate({
  queueItem,
  factoryExecutionPackage: pkg,
  oneObjectiveLock: true
})

assert.equal(gate.type, 'RunnerExecutionGate')
assert.equal(gate.status, 'execution_allowed')
assert.equal(gate.pass, true)
assert.deepEqual(gate.reasons, [])
assert.equal(gate.sourceInvestmentId, investment.id)
assert.equal(gate.boundary.executionDecisionOnly, true)
assert.equal(gate.boundary.implementationExecuted, false)
assert.equal(gate.boundary.judgeExecuted, false)
assert.equal(gate.boundary.runtimeReadinessClaimed, false)
assert.equal(gate.boundary.capabilityVerifiedClaimed, false)
assert.equal(gate.boundary.mayMergePushDeploy, false)

console.log('repository adapter integration tests PASS')
console.log('REAL REPOSITORY-DISCOVERED BOX REACHED EXECUTION GATE AND STOPPED')
