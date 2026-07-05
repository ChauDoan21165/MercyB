import assert from 'node:assert/strict'
import { generateFactoryExecutionPackage } from '../../factory-os/product-intelligence/productIntelligenceOrchestrator.mjs'

const pkg = generateFactoryExecutionPackage({
  investment: {
    id: 'INV-TM-SPEAKING-OBS-001',
    status: 'objective_ready',
    pcap: 'TM_SPEAKING_RUNTIME_OBSERVATION',
    pflow: 'Speaking Runtime → product_observation effect → Observation Bus',
    problem: 'Factory needs one bounded package from a product gap investment.',
    productValue: 'Reduces manual relay and keeps one product gap bounded.',
    allowedFiles: ['factory-os/product-intelligence/**', 'scripts/__tests__/**'],
    forbiddenFiles: ['src/**', 'supabase/**'],
    acceptanceCriteria: ['Generate one FactoryExecutionPackage and stop.'],
    verificationCommands: ['node scripts/__tests__/product-intelligence-orchestrator.test.mjs']
  },
  baseline: {
    baseCommit: '6064b6de',
    modifiedFiles: ['src/pre-existing.ts']
  },
  reportPath: '/tmp/factory-report.md'
})

assert.equal(pkg.type, 'FactoryExecutionPackage')
assert.equal(pkg.status, 'package_ready')
assert.equal(pkg.sourceInvestmentId, 'INV-TM-SPEAKING-OBS-001')
assert.equal(pkg.pcap, 'TM_SPEAKING_RUNTIME_OBSERVATION')
assert.equal(pkg.pflow, 'Speaking Runtime → product_observation effect → Observation Bus')

assert.equal(pkg.engineeringObjective.type, 'EngineeringObjective')
assert.equal(pkg.executionContract.type, 'ExecutionContract')
assert.equal(pkg.workerPrompt.type, 'WorkerPrompt')
assert.equal(pkg.judgePrompt.type, 'JudgePrompt')
assert.equal(pkg.runbook.type, 'EconRunbook')

assert.equal(pkg.boundary.implementationExecuted, false)
assert.equal(pkg.boundary.judgeExecuted, false)
assert.equal(pkg.boundary.workerMayMarkVerified, false)
assert.equal(pkg.boundary.runtimeReadinessClaimed, false)
assert.equal(pkg.boundary.capabilityVerifiedClaimed, false)
assert.equal(pkg.boundary.mayMergePushDeploy, false)

assert.ok(pkg.workerPrompt.prompt.includes('Do not mark verified.'))
assert.ok(pkg.judgePrompt.prompt.includes('independent Judge'))
assert.ok(pkg.runbook.steps.some(step => step.id === 'validate-boundary'))

assert.throws(() => generateFactoryExecutionPackage({
  investment: { status: 'draft' },
  baseline: { baseCommit: 'x', modifiedFiles: [] }
}), /objective_ready/)

console.log('product intelligence orchestrator tests PASS')
