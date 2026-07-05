export function createObservationBus() {
  const observations = [];

  return {
    emit(effect) {
      const normalized = normalizeObservationEffect(effect);
      if (!normalized.ok) return normalized;
      observations.push(normalized.observation);
      return normalized;
    },

    all() {
      return [...observations];
    },

    byCapability(productCapability) {
      return observations.filter((item) => item.productCapability === productCapability);
    },

    byRuntimeFlow(runtimeFlow) {
      return observations.filter((item) => item.runtimeFlow === runtimeFlow);
    },

    coverage() {
      const byRuntimeFlow = {};
      const byCapability = {};
      for (const item of observations) {
        byRuntimeFlow[item.runtimeFlow] = (byRuntimeFlow[item.runtimeFlow] || 0) + 1;
        byCapability[item.productCapability] = (byCapability[item.productCapability] || 0) + 1;
      }
      return { total: observations.length, byRuntimeFlow, byCapability };
    },
  };
}

export function normalizeObservationEffect(effect = {}) {
  if (effect.kind !== 'product_observation') {
    return { ok: false, errors: ['product_observation effect required'], observation: null };
  }

  const payload = effect.payload || {};
  const errors = [];

  for (const key of [
    'observer',
    'productCapability',
    'productFlow',
    'runtimeFlow',
    'eventType',
    'occurredAt',
  ]) {
    if (!payload[key]) errors.push(`${key} required`);
  }

  if (errors.length) return { ok: false, errors, observation: null };

  return {
    ok: true,
    errors: [],
    observation: {
      kind: 'ProductObservation',
      version: '2.0',
      observer: payload.observer,
      productCapability: payload.productCapability,
      productFlow: payload.productFlow,
      runtimeFlow: payload.runtimeFlow,
      eventType: payload.eventType,
      occurredAt: payload.occurredAt,
      evidence: payload.evidence || [],
      state: 'observed',
    },
  };
}
