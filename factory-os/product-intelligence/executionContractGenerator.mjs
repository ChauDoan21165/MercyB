export function generateExecutionContract({ eo, baseline }) {
  if (!eo || eo.type !== 'EngineeringObjective' || eo.status !== 'bounded_ready') {
    throw new Error('ECON requires bounded_ready EngineeringObjective')
  }

  if (!baseline || !baseline.baseCommit || !Array.isArray(baseline.modifiedFiles)) {
    throw new Error('ECON requires baseline baseCommit and modifiedFiles')
  }

  return {
    type: 'ExecutionContract',
    status: 'econ_ready',
    sourceObjectiveId: eo.id || eo.sourceInvestmentId || 'UNKNOWN_EO',
    pcap: eo.pcap,
    pflow: eo.pflow,
    baseCommit: baseline.baseCommit,
    baselineModifiedFiles: [...baseline.modifiedFiles].sort(),
    allowedFiles: eo.allowedFiles || [],
    forbiddenFiles: eo.forbiddenFiles || [],
    acceptanceCriteria: eo.acceptanceCriteria || [],
    verificationCommands: eo.verificationCommands || [],
    judgeChecks: [
      'Compare final changed files against ECON baselineModifiedFiles.',
      'Reject changes outside allowedFiles unless already dirty at baseline.',
      'Reject forbiddenFiles changes.',
      'Reject runtime-readiness claims.',
      'Reject capability-verified claims without independent Judge/replay evidence.'
    ],
    antiFakeChecks: [
      'ECON must reference PCAP and PFLOW.',
      'ECON must include baseCommit.',
      'ECON must include baselineModifiedFiles.',
      'Worker may not mark verified.',
      'Judge must independently verify artifacts and diff.'
    ],
    boundary: {
      runtimeReadinessClaimed: false,
      capabilityVerifiedClaimed: false,
      oneObjectiveAtATime: true,
      implementationAllowedOnlyAfterECON: true
    }
  }
}
