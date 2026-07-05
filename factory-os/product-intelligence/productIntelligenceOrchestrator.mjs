import { generateEngineeringObjective } from './engineeringObjectiveGenerator.mjs'
import { generateExecutionContract } from './executionContractGenerator.mjs'
import { generateEconRunbook } from './econRunbookGenerator.mjs'

export function generateFactoryExecutionPackage({ investment, baseline, reportPath }) {
  if (!investment || investment.status !== 'objective_ready') {
    throw new Error('FactoryExecutionPackage requires objective_ready EngineeringInvestment')
  }

  const engineeringObjective = generateEngineeringObjective(investment)
  const executionContract = generateExecutionContract({
    eo: engineeringObjective,
    baseline
  })
  const runbook = generateEconRunbook({
    econ: executionContract,
    reportPath
  })

  return {
    type: 'FactoryExecutionPackage',
    status: 'package_ready',
    sourceInvestmentId: investment.id,
    pcap: engineeringObjective.pcap,
    pflow: engineeringObjective.pflow,
    engineeringInvestment: investment,
    engineeringObjective,
    executionContract,
    workerPrompt: runbook.artifacts.workerPrompt,
    judgePrompt: runbook.artifacts.judgePrompt,
    runbook,
    boundary: {
      oneObjectiveAtATime: true,
      implementationExecuted: false,
      judgeExecuted: false,
      workerMayMarkVerified: false,
      runtimeReadinessClaimed: false,
      capabilityVerifiedClaimed: false,
      mayMergePushDeploy: false
    }
  }
}
