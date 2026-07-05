import assert from 'node:assert/strict'
import { generateWorkerPrompt } from '../../factory-os/product-intelligence/workerPromptGenerator.mjs'

const workerPrompt = generateWorkerPrompt({
  econ: {
    type: 'ExecutionContract',
    status: 'econ_ready',
    sourceObjectiveId: 'EO-TM-SPEAKING-OBS-001',
    pcap: 'TM_SPEAKING_RUNTIME_OBSERVATION',
    pflow: 'Speaking Runtime → product_observation effect → Observation Bus',
    baseCommit: '6064b6de',
    allowedFiles: ['factory-os/product-intelligence/**', 'scripts/__tests__/**'],
    forbiddenFiles: ['src/**', 'supabase/**'],
    acceptanceCriteria: ['Generate bounded worker instructions.'],
    verificationCommands: ['node scripts/__tests__/worker-prompt-generator.test.mjs']
  },
  reportPath: '/tmp/factory-report.md'
})

assert.equal(workerPrompt.type, 'WorkerPrompt')
assert.equal(workerPrompt.status, 'worker_prompt_ready')
assert.equal(workerPrompt.reportPath, '/tmp/factory-report.md')
assert.equal(workerPrompt.boundary.workerMayMarkVerified, false)
assert.equal(workerPrompt.boundary.runtimeReadinessClaimed, false)
assert.equal(workerPrompt.boundary.capabilityVerifiedClaimed, false)

assert.ok(workerPrompt.prompt.includes('PCAP: TM_SPEAKING_RUNTIME_OBSERVATION'))
assert.ok(workerPrompt.prompt.includes('PFLOW: Speaking Runtime → product_observation effect → Observation Bus'))
assert.ok(workerPrompt.prompt.includes('Do not mark verified.'))
assert.ok(workerPrompt.prompt.includes('Do not claim runtime readiness.'))
assert.ok(workerPrompt.prompt.includes('Do not edit files outside ECON scope.'))
assert.ok(workerPrompt.prompt.includes('Judge handoff requirements'))

assert.throws(() => generateWorkerPrompt({ econ: { type: 'ExecutionContract', status: 'draft' } }), /econ_ready/)

console.log('worker prompt generator tests PASS')
