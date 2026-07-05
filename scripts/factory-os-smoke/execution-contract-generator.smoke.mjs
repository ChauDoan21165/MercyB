import assert from 'node:assert/strict'
import { generateExecutionContract } from '../../factory-os/product-intelligence/executionContractGenerator.mjs'

const econ = generateExecutionContract({
  eo: {
    id: 'EO-TM-SPEAKING-OBS-001',
    type: 'EngineeringObjective',
    status: 'bounded_ready',
    pcap: 'TM_SPEAKING_RUNTIME_OBSERVATION',
    pflow: 'Speaking Runtime → product_observation effect → Observation Bus',
    allowedFiles: ['factory-os/product-intelligence/**', 'scripts/__tests__/**'],
    forbiddenFiles: ['src/**', 'supabase/**'],
    acceptanceCriteria: ['Generate one bounded ECON.'],
    verificationCommands: ['node scripts/__tests__/execution-contract-generator.test.mjs']
  },
  baseline: {
    baseCommit: '6064b6de',
    modifiedFiles: [
      'src/lib/teacher-mercy/example.ts',
      'scripts/c2-runtime-replay-tm-int-300.ts'
    ]
  }
})

assert.equal(econ.type, 'ExecutionContract')
assert.equal(econ.status, 'econ_ready')
assert.equal(econ.pcap, 'TM_SPEAKING_RUNTIME_OBSERVATION')
assert.equal(econ.baseCommit, '6064b6de')
assert.deepEqual(econ.baselineModifiedFiles, [
  'scripts/c2-runtime-replay-tm-int-300.ts',
  'src/lib/teacher-mercy/example.ts'
])
assert.equal(econ.boundary.runtimeReadinessClaimed, false)
assert.equal(econ.boundary.capabilityVerifiedClaimed, false)
assert.ok(econ.judgeChecks.some(x => x.includes('baselineModifiedFiles')))
assert.ok(econ.antiFakeChecks.some(x => x.includes('Worker may not mark verified')))

assert.throws(() => generateExecutionContract({ eo: { type: 'EngineeringObjective', status: 'draft' }, baseline: { baseCommit: 'x', modifiedFiles: [] } }), /bounded_ready/)
assert.throws(() => generateExecutionContract({ eo: { type: 'EngineeringObjective', status: 'bounded_ready' }, baseline: { modifiedFiles: [] } }), /baseCommit/)

console.log('execution contract generator tests PASS')
