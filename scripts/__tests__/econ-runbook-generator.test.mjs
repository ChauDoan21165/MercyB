import assert from 'node:assert/strict'
import { generateEconRunbook } from '../../factory-os/product-intelligence/econRunbookGenerator.mjs'

const runbook = generateEconRunbook({
  econ: {
    type: 'ExecutionContract',
    status: 'econ_ready',
    sourceObjectiveId: 'EO-TM-SPEAKING-OBS-001',
    pcap: 'TM_SPEAKING_RUNTIME_OBSERVATION',
    pflow: 'Speaking Runtime → product_observation effect → Observation Bus',
    baseCommit: '6064b6de',
    baselineModifiedFiles: ['src/pre-existing.ts'],
    allowedFiles: ['factory-os/product-intelligence/**', 'scripts/__tests__/**'],
    forbiddenFiles: ['src/**', 'supabase/**'],
    acceptanceCriteria: ['Generate one executable runbook package.'],
    verificationCommands: ['node scripts/__tests__/econ-runbook-generator.test.mjs']
  },
  reportPath: '/tmp/factory-report.md'
})

assert.equal(runbook.type, 'EconRunbook')
assert.equal(runbook.status, 'runbook_ready')
assert.equal(runbook.sourceObjectiveId, 'EO-TM-SPEAKING-OBS-001')
assert.equal(runbook.reportPath, '/tmp/factory-report.md')

assert.deepEqual(runbook.steps.map(step => step.id), [
  'capture-baseline',
  'run-worker',
  'collect-final-state',
  'validate-boundary',
  'run-judge',
  'handoff'
])

assert.equal(runbook.boundary.oneObjectiveAtATime, true)
assert.equal(runbook.boundary.workerMayMarkVerified, false)
assert.equal(runbook.boundary.judgeIndependentFromWorker, true)
assert.equal(runbook.boundary.runtimeReadinessClaimed, false)
assert.equal(runbook.boundary.capabilityVerifiedClaimed, false)
assert.equal(runbook.boundary.mayMergePushDeploy, false)

assert.equal(runbook.artifacts.workerPrompt.type, 'WorkerPrompt')
assert.equal(runbook.artifacts.judgePrompt.type, 'JudgePrompt')
assert.ok(runbook.steps.find(step => step.id === 'run-worker').prompt.includes('Do not mark verified.'))
assert.ok(runbook.steps.find(step => step.id === 'run-judge').prompt.includes('independent Judge'))

assert.throws(() => generateEconRunbook({ econ: { type: 'ExecutionContract', status: 'draft' } }), /econ_ready/)

console.log('econ runbook generator tests PASS')
