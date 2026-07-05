export function createSingleObjectiveRunnerPlan({ queueItem, factoryExecutionPackage }) {
  if (!queueItem || queueItem.type !== 'FactoryQueueItem' || queueItem.status !== 'queue_ready') {
    throw new Error('Runner requires queue_ready FactoryQueueItem')
  }
  if (!factoryExecutionPackage || factoryExecutionPackage.type !== 'FactoryExecutionPackage' || factoryExecutionPackage.status !== 'package_ready') {
    throw new Error('Runner requires package_ready FactoryExecutionPackage')
  }
  if (queueItem.sourceInvestmentId !== factoryExecutionPackage.sourceInvestmentId) {
    throw new Error('Queue item and package investment mismatch')
  }

  return {
    type: 'SingleObjectiveRunnerPlan',
    status: 'runner_plan_ready',
    sourceInvestmentId: queueItem.sourceInvestmentId,
    sourceObjectiveId: queueItem.sourceObjectiveId,
    pcap: queueItem.pcap,
    pflow: queueItem.pflow,
    packagePath: queueItem.packagePath,
    steps: [
      'read package JSON',
      'validate queue item matches package',
      'preserve ECON baseline',
      'prepare worker prompt',
      'prepare boundary validation',
      'prepare independent Judge prompt',
      'stop before execution'
    ],
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
