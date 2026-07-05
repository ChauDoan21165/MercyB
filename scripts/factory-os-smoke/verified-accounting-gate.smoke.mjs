import assert from 'node:assert/strict'
import { evaluateVerifiedAccountingGate } from '../../factory-os/product-intelligence/verifiedAccountingGate.mjs'

const judgePass = {
  type: 'JudgeResultContract',
  status: 'judge_pass',
  verdict: 'PASS',
  sourceObjectiveId: 'EO-TM-SPEAKING-OBS-001',
  pcap: 'TM_SPEAKING_RUNTIME_OBSERVATION',
  pflow: 'Speaking Runtime → product_observation effect → Observation Bus',
  checks: {
    boundaryValidationPass: true,
    resultContractPass: true,
    testsPass: true,
    evidencePass: true
  },
  judgeAuthority: {
    canMarkVerified: false,
    canMergePushDeploy: false,
    canClaimRuntimeReadiness: false,
    canClaimCapabilityVerified: false
  }
}

const ready = evaluateVerifiedAccountingGate({ judgeResult: judgePass })
assert.equal(ready.type, 'VerifiedAccountingGate')
assert.equal(ready.status, 'verification_recommendation_ready')
assert.equal(ready.pass, true)
assert.equal(ready.accountingAction, 'recommend_verification_review')
assert.equal(ready.boundary.marksVerified, false)
assert.equal(ready.boundary.claimsRuntimeReadiness, false)
assert.equal(ready.boundary.claimsCapabilityVerified, false)
assert.equal(ready.boundary.mayMergePushDeploy, false)
assert.equal(ready.boundary.requiresExternalAccountingRule, true)

const blocked = evaluateVerifiedAccountingGate({
  judgeResult: {
    ...judgePass,
    verdict: 'FAIL',
    status: 'judge_fail',
    checks: {
      ...judgePass.checks,
      evidencePass: false
    }
  }
})

assert.equal(blocked.status, 'verification_recommendation_blocked')
assert.equal(blocked.pass, false)
assert.equal(blocked.accountingAction, 'do_not_count')
assert.ok(blocked.reasons.includes('Judge verdict is not PASS'))
assert.ok(blocked.reasons.includes('evidence did not pass'))

const badAuthority = evaluateVerifiedAccountingGate({
  judgeResult: {
    ...judgePass,
    judgeAuthority: {
      canMarkVerified: true,
      canMergePushDeploy: true,
      canClaimRuntimeReadiness: true,
      canClaimCapabilityVerified: true
    }
  }
})

assert.equal(badAuthority.pass, false)
assert.ok(badAuthority.reasons.includes('Judge must not mark verified'))
assert.ok(badAuthority.reasons.includes('Judge must not merge/push/deploy'))
assert.ok(badAuthority.reasons.includes('Judge must not claim runtime readiness'))
assert.ok(badAuthority.reasons.includes('Judge must not claim capability verified'))

console.log('verified accounting gate tests PASS')
