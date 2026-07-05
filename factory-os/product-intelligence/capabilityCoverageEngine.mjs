export const TEACHER_MERCY_CAPABILITY_REGISTRY_V1 = [
  {
    productCapability: 'PCAP-TM-SPEAKING-RUNTIME',
    runtimeFlow: 'speaking',
    requiredEvidence: ['runtime_observation'],
  },
  {
    productCapability: 'PCAP-TM-TONE-PRODUCTION-ASSESSMENT',
    runtimeFlow: 'speaking',
    requiredEvidence: ['runtime_observation', 'replay', 'judge'],
  },
  {
    productCapability: 'PCAP-TM-PLACEMENT-RUNTIME',
    runtimeFlow: 'placement',
    requiredEvidence: ['runtime_observation'],
  },
  {
    productCapability: 'PCAP-TM-TUTOR-CONTEXT',
    runtimeFlow: 'tutor',
    requiredEvidence: ['runtime_observation'],
  },
  {
    productCapability: 'PCAP-TM-LISTENING-RUNTIME',
    runtimeFlow: 'listening',
    requiredEvidence: ['runtime_observation'],
  },
];

export function analyzeCapabilityCoverage(observations = [], registry = TEACHER_MERCY_CAPABILITY_REGISTRY_V1) {
  const observationsByCapability = new Map();

  for (const observation of observations) {
    if (!observation?.productCapability) continue;
    const list = observationsByCapability.get(observation.productCapability) || [];
    list.push(observation);
    observationsByCapability.set(observation.productCapability, list);
  }

  const capabilityCoverage = registry.map((capability) => {
    const matched = observationsByCapability.get(capability.productCapability) || [];
    const evidenceTypes = new Set();

    for (const observation of matched) {
      for (const evidence of observation.evidence || []) {
        if (typeof evidence === 'string') evidenceTypes.add(evidence);
        if (evidence?.type) evidenceTypes.add(evidence.type);
      }
      evidenceTypes.add('runtime_observation');
    }

    const missingEvidence = capability.requiredEvidence.filter((type) => !evidenceTypes.has(type));

    return {
      productCapability: capability.productCapability,
      runtimeFlow: capability.runtimeFlow,
      observationCount: matched.length,
      observed: matched.length > 0,
      requiredEvidence: capability.requiredEvidence,
      missingEvidence,
      coverageState:
        matched.length === 0 ? 'unobserved'
        : missingEvidence.length > 0 ? 'partial'
        : 'covered',
    };
  });

  return {
    totalCapabilities: registry.length,
    covered: capabilityCoverage.filter((item) => item.coverageState === 'covered').length,
    partial: capabilityCoverage.filter((item) => item.coverageState === 'partial').length,
    unobserved: capabilityCoverage.filter((item) => item.coverageState === 'unobserved').length,
    capabilityCoverage,
    productGaps: capabilityCoverage.filter((item) => item.coverageState !== 'covered').map((item) => ({
      kind: 'ProductCapabilityGap',
      productCapability: item.productCapability,
      runtimeFlow: item.runtimeFlow,
      reason: item.coverageState === 'unobserved'
        ? 'no runtime observations'
        : 'missing required evidence',
      missingEvidence: item.missingEvidence,
      observationCount: item.observationCount,
    })),
  };
}
