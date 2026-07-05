export function generateWorkerPrompt({ econ, reportPath }) {
  if (!econ || econ.type !== 'ExecutionContract' || econ.status !== 'econ_ready') {
    throw new Error('Worker prompt requires econ_ready ExecutionContract')
  }

  const finalReportPath = reportPath || '/Users/chaudoanm3/ai-tutor-factory/reports/FACTORY_REPORT_FOR_CHATGPT.md'

  return {
    type: 'WorkerPrompt',
    status: 'worker_prompt_ready',
    sourceObjectiveId: econ.sourceObjectiveId,
    pcap: econ.pcap,
    pflow: econ.pflow,
    reportPath: finalReportPath,
    prompt: [
      '# C2 Factory Worker Prompt',
      '',
      'You are an implementation worker, not the Judge.',
      '',
      `PCAP: ${econ.pcap}`,
      `PFLOW: ${econ.pflow}`,
      `Source Objective: ${econ.sourceObjectiveId}`,
      `Base Commit: ${econ.baseCommit}`,
      '',
      '## Allowed Files',
      ...(econ.allowedFiles || []).map(file => `- ${file}`),
      '',
      '## Forbidden Files',
      ...(econ.forbiddenFiles || []).map(file => `- ${file}`),
      '',
      '## Acceptance Criteria',
      ...(econ.acceptanceCriteria || []).map(item => `- ${item}`),
      '',
      '## Verification Commands',
      ...(econ.verificationCommands || []).map(cmd => `- ${cmd}`),
      '',
      '## Anti-Fake Rules',
      '- Do not mark verified.',
      '- Do not claim runtime readiness.',
      '- Do not claim product capability verified.',
      '- Do not edit files outside ECON scope.',
      '- Do not hide or overwrite pre-existing dirty files.',
      '- Preserve PCAP/PFLOW identity in evidence.',
      '',
      '## Required Final Report',
      `Write final worker result to: ${finalReportPath}`,
      '',
      'Report must include:',
      '- changed files',
      '- tests run',
      '- evidence path if any',
      '- boundary statement',
      '- Judge handoff requirements',
      '',
      'Stop after completing exactly this ECON.'
    ].join('\n'),
    boundary: {
      workerMayMarkVerified: false,
      runtimeReadinessClaimed: false,
      capabilityVerifiedClaimed: false,
      oneObjectiveAtATime: true
    }
  }
}
