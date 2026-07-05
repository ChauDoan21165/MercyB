export const PRODUCT_RUNTIME_FLOWS = [
  'placement',
  'tutor',
  'speaking',
  'listening',
];

export function createRuntimeEventObservation(event) {
  const errors = [];
  if (!event || typeof event !== 'object') errors.push('event object required');
  if (!PRODUCT_RUNTIME_FLOWS.includes(event?.flow)) errors.push('valid runtime flow required');
  if (!event?.eventType) errors.push('eventType required');
  if (!event?.productCapability) errors.push('productCapability required');
  if (!event?.occurredAt) errors.push('occurredAt required');

  return {
    ok: errors.length === 0,
    errors,
    observation: errors.length ? null : {
      id: event.id || `POBS-${event.flow.toUpperCase()}-${event.eventType.toUpperCase()}`,
      kind: 'ProductObservation',
      version: '1.0',
      productCapability: event.productCapability,
      runtimeFlow: event.flow,
      eventType: event.eventType,
      occurredAt: event.occurredAt,
      evidence: event.evidence || [],
      state: 'observed',
    },
  };
}

export function summarizeRuntimeCoverage(observations) {
  const byFlow = Object.fromEntries(PRODUCT_RUNTIME_FLOWS.map(flow => [flow, 0]));
  for (const item of observations || []) {
    if (item?.runtimeFlow in byFlow) byFlow[item.runtimeFlow] += 1;
  }
  return {
    byFlow,
    missingFlows: Object.entries(byFlow).filter(([, count]) => count === 0).map(([flow]) => flow),
  };
}
