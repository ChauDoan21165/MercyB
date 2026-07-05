export function evaluateRunnerExecutionGate({ queueItem, factoryExecutionPackage, oneObjectiveLock = true }) {
  const reasons = []

  if (!queueItem || queueItem.type !== 'FactoryQueueItem') reasons.push('missing FactoryQueueItem')
  if (queueItem && queueItem.status !== 'queue_ready') reasons.push('queue item is not queue_ready')

  if (!factoryExecutionPackage || factoryExecutionPackage.type !== 'FactoryExecutionPackage') reasons.push('missing FactoryExecutionPackage')
  if (factoryExecutionPackage && factoryExecutionPackage.status !== 'package_ready') reasons.push('package is not package_ready')

  if (!oneObjectiveLock) reasons.push('one-objective lock is not active')

  const econ = factoryExecutionPackage?.executionContract
  if (!econ || econ.type !== 'ExecutionContract' || econ.status !== 'econ_ready') reasons.push('missing econ_ready ExecutionContract')
  if (!econ?.baseCommit) reasons.push('missing ECON baseCommit')
  if (!Array.isArray(econ?.baselineModifiedFiles)) reasons.push('missing ECON baselineModifiedFiles')

  const workerPrompt = factoryExecutionPackage?.workerPrompt
  if (!workerPrompt || workerPrompt.type !== 'WorkerPrompt' || workerPrompt.status !== 'worker_prompt_ready') reasons.push('missing worker_prompt_ready WorkerPrompt')

  const judgePrompt = factoryExecutionPackage?.judgePrompt
  if (!judgePrompt || judgePrompt.type !== 'JudgePrompt' || judgePrompt.status !== 'judge_prompt_ready') reasons.push('missing judge_prompt_ready JudgePrompt')

  const runbook = factoryExecutionPackage?.runbook
  if (!runbook || runbook.type !== 'EconRunbook' || runbook.status !== 'runbook_ready') reasons.push('missing runbook_ready EconRunbook')

  if (factoryExecutionPackage?.boundary?.mayMergePushDeploy !== false) reasons.push('package must not have merge/push/deploy authority')
  if (factoryExecutionPackage?.boundary?.workerMayMarkVerified !== false) reasons.push('worker must not be allowed to mark verified')
  if (factoryExecutionPackage?.boundary?.implementationExecuted !== false) reasons.push('implementation must not already be executed')
  if (factoryExecutionPackage?.boundary?.judgeExecuted !== false) reasons.push('judge must not already be executed')

  return {
    type: 'RunnerExecutionGate',
    status: reasons.length === 0 ? 'execution_allowed' : 'execution_blocked',
    pass: reasons.length === 0,
    reasons,
    sourceInvestmentId: queueItem?.sourceInvestmentId || factoryExecutionPackage?.sourceInvestmentId,
    pcap: queueItem?.pcap || factoryExecutionPackage?.pcap,
    pflow: queueItem?.pflow || factoryExecutionPackage?.pflow,
    boundary: {
      executionDecisionOnly: true,
      implementationExecuted: false,
      judgeExecuted: false,
      workerMayMarkVerified: false,
      runtimeReadinessClaimed: false,
      capabilityVerifiedClaimed: false,
      mayMergePushDeploy: false,
      oneObjectiveAtATime: true
    }
  }
}
