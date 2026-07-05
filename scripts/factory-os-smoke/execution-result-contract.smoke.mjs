import assert from 'node:assert/strict'
import {
  createExecutionResultContract,
  validateExecutionResultContract
} from '../../factory-os/product-intelligence/executionResultContract.mjs'

const result = createExecutionResultContract({
  sourceObjectiveId: 'EO-TM-SPEAKING-OBS-001',
  pcap: 'TM_SPEAKING_RUNTIME_OBSERVATION',
  pflow: 'Speaking Runtime → product_observation effect → Observation Bus',
  changedFiles: ['b.ts', 'a.ts'],
  testsRun: ['node scripts/__tests__/execution-result-contract.test.mjs'],
  evidencePaths: ['reports/evidence.md']
})

assert.equal(result.type, 'ExecutionResultContract')
assert.equal(result.status, 'worker_done')
assert.deepEqual(result.changedFiles, ['a.ts', 'b.ts'])
assert.equal(result.workerAuthority.canMarkVerified, false)
assert.equal(result.workerAuthority.canMergePushDeploy, false)
assert.equal(result.workerAuthority.judgeRequired, true)
assert.equal(result.boundaryClaims.runtimeReadinessClaimed, false)
assert.equal(result.boundaryClaims.capabilityVerifiedClaimed, false)

const valid = validateExecutionResultContract(result)
assert.equal(valid.status, 'result_contract_valid')
assert.equal(valid.pass, true)

const invalid = validateExecutionResultContract({
  ...result,
  workerAuthority: {
    canMarkVerified: true,
    canMergePushDeploy: false,
    judgeRequired: false
  },
  boundaryClaims: {
    runtimeReadinessClaimed: true,
    capabilityVerifiedClaimed: true,
    mergePushDeployClaimed: true
  }
})

assert.equal(invalid.status, 'result_contract_invalid')
assert.equal(invalid.pass, false)
assert.ok(invalid.reasons.includes('worker must not mark verified'))
assert.ok(invalid.reasons.includes('judge must be required'))
assert.ok(invalid.reasons.includes('runtime readiness claim is not allowed'))
assert.ok(invalid.reasons.includes('capability verified claim is not allowed'))
assert.ok(invalid.reasons.includes('merge/push/deploy claim is not allowed'))

assert.throws(() => createExecutionResultContract({ pcap: 'x', pflow: 'y' }), /sourceObjectiveId/)
assert.throws(() => createExecutionResultContract({ sourceObjectiveId: 'x', pcap: 'x', pflow: 'y', status: 'verified' }), /worker_done or worker_failed/)

console.log('execution result contract tests PASS')
