import { generateWorkerPrompt } from './workerPromptGenerator.mjs'
import { generateJudgePrompt } from './judgePromptGenerator.mjs'

export function generateEconRunbook({ econ, reportPath }) {
  if (!econ || econ.type !== 'ExecutionContract' || econ.status !== 'econ_ready') {
    throw new Error('Runbook requires econ_ready ExecutionContract')
  }

  const worker = generateWorkerPrompt({ econ, reportPath })
  const judge = generateJudgePrompt({ econ })

  return {
    type: 'EconRunbook',
    status: 'runbook_ready',
    sourceObjectiveId: econ.sourceObjectiveId,
    pcap: econ.pcap,
    pflow: econ.pflow,
    baseCommit: econ.baseCommit,
    reportPath: worker.reportPath,
    steps: [
      {
        id: 'capture-baseline',
        owner: 'orchestrator',
        action: 'Preserve ECON baseCommit and baselineModifiedFiles before worker execution.'
      },
      {
        id: 'run-worker',
        owner: 'f-worker',
        action: 'Execute exactly the bounded worker prompt.',
        prompt: worker.prompt
      },
      {
        id: 'collect-final-state',
        owner: 'orchestrator',
        action: 'Collect final modified/untracked file list and worker report.'
      },
      {
        id: 'validate-boundary',
        owner: 'orchestrator-or-judge',
        action: 'Run ECON Boundary Validator against final file list.'
      },
      {
        id: 'run-judge',
        owner: 'independent-judge',
        action: 'Judge worker output, boundary validation, tests, and evidence.',
        prompt: judge.prompt
      },
      {
        id: 'handoff',
        owner: 'orchestrator',
        action: `Write final PASS/FAIL handoff to ${worker.reportPath}.`
      }
    ],
    artifacts: {
      econ,
      workerPrompt: worker,
      judgePrompt: judge
    },
    boundary: {
      oneObjectiveAtATime: true,
      workerMayMarkVerified: false,
      judgeIndependentFromWorker: true,
      runtimeReadinessClaimed: false,
      capabilityVerifiedClaimed: false,
      mayMergePushDeploy: false
    }
  }
}
