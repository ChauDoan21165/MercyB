export function createExecutionResultContract({
  sourceObjectiveId,
  pcap,
  pflow,
  status = 'worker_done',
  changedFiles = [],
  testsRun = [],
  evidencePaths = [],
  boundaryClaims = {}
}) {
  if (!sourceObjectiveId) throw new Error('ExecutionResultContract requires sourceObjectiveId')
  if (!pcap) throw new Error('ExecutionResultContract requires PCAP')
  if (!pflow) throw new Error('ExecutionResultContract requires PFLOW')
  if (status !== 'worker_done' && status !== 'worker_failed') {
    throw new Error('ExecutionResultContract status must be worker_done or worker_failed')
  }

  return {
    type: 'ExecutionResultContract',
    status,
    sourceObjectiveId,
    pcap,
    pflow,
    changedFiles: [...changedFiles].sort(),
    testsRun,
    evidencePaths,
    boundaryClaims: {
      runtimeReadinessClaimed: Boolean(boundaryClaims.runtimeReadinessClaimed),
      capabilityVerifiedClaimed: Boolean(boundaryClaims.capabilityVerifiedClaimed),
      mergePushDeployClaimed: Boolean(boundaryClaims.mergePushDeployClaimed)
    },
    workerAuthority: {
      canMarkVerified: false,
      canMergePushDeploy: false,
      judgeRequired: true
    }
  }
}

export function validateExecutionResultContract(result) {
  const reasons = []

  if (!result || result.type !== 'ExecutionResultContract') reasons.push('missing ExecutionResultContract')
  if (result && result.status !== 'worker_done' && result.status !== 'worker_failed') reasons.push('invalid worker status')
  if (!result?.sourceObjectiveId) reasons.push('missing sourceObjectiveId')
  if (!result?.pcap) reasons.push('missing PCAP')
  if (!result?.pflow) reasons.push('missing PFLOW')
  if (!Array.isArray(result?.changedFiles)) reasons.push('changedFiles must be an array')
  if (!Array.isArray(result?.testsRun)) reasons.push('testsRun must be an array')
  if (!Array.isArray(result?.evidencePaths)) reasons.push('evidencePaths must be an array')
  if (result?.workerAuthority?.canMarkVerified !== false) reasons.push('worker must not mark verified')
  if (result?.workerAuthority?.canMergePushDeploy !== false) reasons.push('worker must not merge/push/deploy')
  if (result?.workerAuthority?.judgeRequired !== true) reasons.push('judge must be required')
  if (result?.boundaryClaims?.runtimeReadinessClaimed) reasons.push('runtime readiness claim is not allowed')
  if (result?.boundaryClaims?.capabilityVerifiedClaimed) reasons.push('capability verified claim is not allowed')
  if (result?.boundaryClaims?.mergePushDeployClaimed) reasons.push('merge/push/deploy claim is not allowed')

  return {
    type: 'ExecutionResultContractValidation',
    status: reasons.length === 0 ? 'result_contract_valid' : 'result_contract_invalid',
    pass: reasons.length === 0,
    reasons
  }
}
