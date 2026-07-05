export function createQueueReadyPackage({ factoryExecutionPackage, packagePath }) {
  if (!factoryExecutionPackage || factoryExecutionPackage.type !== 'FactoryExecutionPackage' || factoryExecutionPackage.status !== 'package_ready') {
    throw new Error('Queue adapter requires package_ready FactoryExecutionPackage')
  }
  if (!packagePath || typeof packagePath !== 'string') {
    throw new Error('Queue adapter requires packagePath')
  }

  return {
    type: 'FactoryQueueItem',
    status: 'queue_ready',
    sourceInvestmentId: factoryExecutionPackage.sourceInvestmentId,
    sourceObjectiveId: factoryExecutionPackage.executionContract.sourceObjectiveId,
    pcap: factoryExecutionPackage.pcap,
    pflow: factoryExecutionPackage.pflow,
    packagePath,
    workerPromptStatus: factoryExecutionPackage.workerPrompt.status,
    judgePromptStatus: factoryExecutionPackage.judgePrompt.status,
    runbookStatus: factoryExecutionPackage.runbook.status,
    requiredRunner: 'c2-factory-single-objective-runner',
    requiredJudge: 'independent-judge',
    boundary: {
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

export function serializeFactoryExecutionPackage(factoryExecutionPackage) {
  if (!factoryExecutionPackage || factoryExecutionPackage.type !== 'FactoryExecutionPackage') {
    throw new Error('Can only serialize FactoryExecutionPackage')
  }
  return JSON.stringify(factoryExecutionPackage, null, 2)
}
