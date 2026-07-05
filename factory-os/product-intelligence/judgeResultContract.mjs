export function createJudgeResultContract({
  sourceObjectiveId,
  pcap,
  pflow,
  verdict,
  boundaryValidationPass = false,
  resultContractPass = false,
  testsPass = false,
  evidencePass = false,
  reasons = [],
  evidencePaths = []
}) {
  if (!sourceObjectiveId) throw new Error('JudgeResultContract requires sourceObjectiveId')
  if (!pcap) throw new Error('JudgeResultContract requires PCAP')
  if (!pflow) throw new Error('JudgeResultContract requires PFLOW')
  if (verdict !== 'PASS' && verdict !== 'FAIL') {
    throw new Error('JudgeResultContract verdict must be PASS or FAIL')
  }

  const allChecksPass =
    boundaryValidationPass &&
    resultContractPass &&
    testsPass &&
    evidencePass

  if (verdict === 'PASS' && !allChecksPass) {
    throw new Error('PASS requires boundary, result contract, tests, and evidence to pass')
  }

  return {
    type: 'JudgeResultContract',
    status: verdict === 'PASS' ? 'judge_pass' : 'judge_fail',
    verdict,
    sourceObjectiveId,
    pcap,
    pflow,
    checks: {
      boundaryValidationPass,
      resultContractPass,
      testsPass,
      evidencePass
    },
    reasons,
    evidencePaths,
    judgeAuthority: {
      canMarkVerified: false,
      canMergePushDeploy: false,
      canClaimRuntimeReadiness: false,
      canClaimCapabilityVerified: false,
      mayRecommendVerification: verdict === 'PASS'
    }
  }
}

export function validateJudgeResultContract(result) {
  const reasons = []

  if (!result || result.type !== 'JudgeResultContract') reasons.push('missing JudgeResultContract')
  if (result && result.verdict !== 'PASS' && result.verdict !== 'FAIL') reasons.push('verdict must be PASS or FAIL')
  if (!result?.sourceObjectiveId) reasons.push('missing sourceObjectiveId')
  if (!result?.pcap) reasons.push('missing PCAP')
  if (!result?.pflow) reasons.push('missing PFLOW')
  if (!Array.isArray(result?.reasons)) reasons.push('reasons must be an array')
  if (!Array.isArray(result?.evidencePaths)) reasons.push('evidencePaths must be an array')

  const checks = result?.checks || {}
  const allChecksPass =
    checks.boundaryValidationPass === true &&
    checks.resultContractPass === true &&
    checks.testsPass === true &&
    checks.evidencePass === true

  if (result?.verdict === 'PASS' && !allChecksPass) {
    reasons.push('PASS requires all checks to pass')
  }

  if (result?.judgeAuthority?.canMarkVerified !== false) reasons.push('Judge must not mark verified')
  if (result?.judgeAuthority?.canMergePushDeploy !== false) reasons.push('Judge must not merge/push/deploy')
  if (result?.judgeAuthority?.canClaimRuntimeReadiness !== false) reasons.push('Judge must not claim runtime readiness')
  if (result?.judgeAuthority?.canClaimCapabilityVerified !== false) reasons.push('Judge must not claim capability verified')

  return {
    type: 'JudgeResultContractValidation',
    status: reasons.length === 0 ? 'judge_result_contract_valid' : 'judge_result_contract_invalid',
    pass: reasons.length === 0,
    reasons
  }
}
