export function generateEngineeringObjective(investment) {
  if (!investment || investment.status !== 'objective_ready') {
    throw new Error('EngineeringInvestment must be objective_ready')
  }

  const pcap = investment.pcap || investment.productCapability || 'UNKNOWN_PCAP'
  const pflow = investment.pflow || investment.runtimeFlow || 'UNKNOWN_PFLOW'

  return {
    type: 'EngineeringObjective',
    status: 'bounded_ready',
    sourceInvestmentId: investment.id,
    pcap,
    pflow,
    title: `Strengthen ${pcap} via ${pflow}`,
    problem: investment.problem || investment.gap || 'Product capability gap requires bounded engineering work.',
    productValue: investment.productValue || investment.value || 'Improves a Teacher Mercy product capability or runtime flow.',
    allowedFiles: investment.allowedFiles || [],
    forbiddenFiles: investment.forbiddenFiles || ['deployment', 'production secrets', 'unrelated runtime files'],
    acceptanceCriteria: investment.acceptanceCriteria || [
      'EO remains bounded to declared PCAP/PFLOW.',
      'No runtime readiness claim is made.',
      'No capability verified claim is made without independent Judge/replay evidence.'
    ],
    verificationCommands: investment.verificationCommands || [],
    antiFakeChecks: [
      'Reject broad/generic objectives.',
      'Reject objectives without PCAP/PFLOW.',
      'Reject runtime-readiness claims.',
      'Reject capability-verified claims without Judge evidence.'
    ],
    boundary: {
      runtimeReadinessClaimed: false,
      capabilityVerifiedClaimed: false,
      requiresECONBeforeImplementation: true,
      oneObjectiveAtATime: true
    }
  }
}
