import assert from 'node:assert/strict'
import {
  createJudgeResultContract,
  validateJudgeResultContract
} from '../../factory-os/product-intelligence/judgeResultContract.mjs'

const pass = createJudgeResultContract({
  sourceObjectiveId: 'EO-TM-SPEAKING-OBS-001',
  pcap: 'TM_SPEAKING_RUNTIME_OBSERVATION',
  pflow: 'Speaking Runtime → product_observation effect → Observation Bus',
  verdict: 'PASS',
  boundaryValidationPass: true,
  resultContractPass: true,
  testsPass: true,
  evidencePass: true,
  reasons: ['All required checks passed.'],
  evidencePaths: ['reports/evidence.md']
})

assert.equal(pass.type, 'JudgeResultContract')
assert.equal(pass.status, 'judge_pass')
assert.equal(pass.verdict, 'PASS')
assert.equal(pass.judgeAuthority.canMarkVerified, false)
assert.equal(pass.judgeAuthority.canMergePushDeploy, false)
assert.equal(pass.judgeAuthority.canClaimRuntimeReadiness, false)
assert.equal(pass.judgeAuthority.canClaimCapabilityVerified, false)
assert.equal(pass.judgeAuthority.mayRecommendVerification, true)

const validPass = validateJudgeResultContract(pass)
assert.equal(validPass.status, 'judge_result_contract_valid')
assert.equal(validPass.pass, true)

const fail = createJudgeResultContract({
  sourceObjectiveId: 'EO-TM-SPEAKING-OBS-001',
  pcap: 'TM_SPEAKING_RUNTIME_OBSERVATION',
  pflow: 'Speaking Runtime → product_observation effect → Observation Bus',
  verdict: 'FAIL',
  boundaryValidationPass: false,
  resultContractPass: true,
  testsPass: true,
  evidencePass: false,
  reasons: ['Boundary validation failed.']
})

assert.equal(fail.status, 'judge_fail')
assert.equal(fail.judgeAuthority.mayRecommendVerification, false)

assert.throws(() => createJudgeResultContract({
  sourceObjectiveId: 'EO',
  pcap: 'PCAP',
  pflow: 'PFLOW',
  verdict: 'PASS',
  boundaryValidationPass: true,
  resultContractPass: false,
  testsPass: true,
  evidencePass: true
}), /PASS requires/)

const invalidAuthority = validateJudgeResultContract({
  ...pass,
  judgeAuthority: {
    canMarkVerified: true,
    canMergePushDeploy: true,
    canClaimRuntimeReadiness: true,
    canClaimCapabilityVerified: true
  }
})

assert.equal(invalidAuthority.status, 'judge_result_contract_invalid')
assert.equal(invalidAuthority.pass, false)
assert.ok(invalidAuthority.reasons.includes('Judge must not mark verified'))
assert.ok(invalidAuthority.reasons.includes('Judge must not merge/push/deploy'))
assert.ok(invalidAuthority.reasons.includes('Judge must not claim runtime readiness'))
assert.ok(invalidAuthority.reasons.includes('Judge must not claim capability verified'))

assert.throws(() => createJudgeResultContract({ pcap: 'x', pflow: 'y', verdict: 'PASS' }), /sourceObjectiveId/)
assert.throws(() => createJudgeResultContract({ sourceObjectiveId: 'x', pcap: 'x', pflow: 'y', verdict: 'MAYBE' }), /PASS or FAIL/)

console.log('judge result contract tests PASS')
