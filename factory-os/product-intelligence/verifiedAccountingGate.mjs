export function evaluateVerifiedAccountingGate({ judgeResult }) {
  const reasons = []

  if (!judgeResult || judgeResult.type !== 'JudgeResultContract') reasons.push('missing JudgeResultContract')
  if (judgeResult && judgeResult.status !== 'judge_pass' && judgeResult.status !== 'judge_fail') reasons.push('invalid JudgeResultContract status')
  if (judgeResult?.verdict !== 'PASS') reasons.push('Judge verdict is not PASS')

  const checks = judgeResult?.checks || {}
  if (checks.boundaryValidationPass !== true) reasons.push('boundary validation did not pass')
  if (checks.resultContractPass !== true) reasons.push('result contract did not pass')
  if (checks.testsPass !== true) reasons.push('tests did not pass')
  if (checks.evidencePass !== true) reasons.push('evidence did not pass')

  if (judgeResult?.judgeAuthority?.canMarkVerified !== false) reasons.push('Judge must not mark verified')
  if (judgeResult?.judgeAuthority?.canMergePushDeploy !== false) reasons.push('Judge must not merge/push/deploy')
  if (judgeResult?.judgeAuthority?.canClaimRuntimeReadiness !== false) reasons.push('Judge must not claim runtime readiness')
  if (judgeResult?.judgeAuthority?.canClaimCapabilityVerified !== false) reasons.push('Judge must not claim capability verified')

  return {
    type: 'VerifiedAccountingGate',
    status: reasons.length === 0 ? 'verification_recommendation_ready' : 'verification_recommendation_blocked',
    pass: reasons.length === 0,
    reasons,
    sourceObjectiveId: judgeResult?.sourceObjectiveId,
    pcap: judgeResult?.pcap,
    pflow: judgeResult?.pflow,
    accountingAction: reasons.length === 0 ? 'recommend_verification_review' : 'do_not_count',
    boundary: {
      marksVerified: false,
      claimsRuntimeReadiness: false,
      claimsCapabilityVerified: false,
      mayMergePushDeploy: false,
      requiresExternalAccountingRule: true
    }
  }
}
