export function scoreProductCapabilityGap(gap) {
  const missing = new Set(gap?.missingEvidence || []);

  const productImpact = gap?.reason === 'no runtime observations' ? 100 : 75;
  const runtimeImpact = gap?.observationCount === 0 ? 100 : 60;
  const verificationImpact =
    missing.has('judge') || missing.has('replay') ? 90 :
    missing.has('runtime_observation') ? 85 :
    40;

  const engineeringCost =
    gap?.runtimeFlow === 'speaking' ? 25 :
    gap?.runtimeFlow === 'placement' ? 30 :
    gap?.runtimeFlow === 'tutor' ? 35 :
    gap?.runtimeFlow === 'listening' ? 40 :
    50;

  const blastRadius =
    gap?.runtimeFlow === 'speaking' ? 15 :
    gap?.runtimeFlow === 'placement' ? 20 :
    gap?.runtimeFlow === 'tutor' ? 25 :
    gap?.runtimeFlow === 'listening' ? 30 :
    40;

  const roi = productImpact + runtimeImpact + verificationImpact - engineeringCost - blastRadius;

  return {
    productImpact,
    runtimeImpact,
    verificationImpact,
    engineeringCost,
    blastRadius,
    roi,
    action: roi >= 150 ? 'GENERATE_ENGINEERING_OBJECTIVE' : 'HOLD',
  };
}

export function productGapsToEngineeringInvestments(productGaps = []) {
  return productGaps.map((gap, index) => {
    const score = scoreProductCapabilityGap(gap);
    return {
      id: `EINV-PGAP-${String(index + 1).padStart(3, '0')}`,
      kind: 'EngineeringInvestment',
      version: '3.0',
      sourceKind: 'ProductCapabilityGap',
      productCapability: gap.productCapability,
      runtimeFlow: gap.runtimeFlow,
      reason: gap.reason,
      missingEvidence: gap.missingEvidence || [],
      observationCount: gap.observationCount || 0,
      ...score,
      state: score.action === 'GENERATE_ENGINEERING_OBJECTIVE' ? 'ranked' : 'held',
    };
  }).sort((a, b) => b.roi - a.roi);
}

export function selectObjectiveReadyInvestments(investments = []) {
  return investments.filter((item) => item.action === 'GENERATE_ENGINEERING_OBJECTIVE');
}
