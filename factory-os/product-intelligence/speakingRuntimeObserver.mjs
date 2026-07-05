import { createRuntimeEventObservation } from './runtimeEventObserver.mjs';

export function observeSpeakingRuntimeEvent(event = {}) {
  const observed = createRuntimeEventObservation({
    id: event.id || 'POBS-SPEAKING-RUNTIME-OBSERVER-001',
    flow: 'speaking',
    eventType: event.eventType || 'speaking_runtime_observed',
    productCapability: event.productCapability || 'PCAP-TM-SPEAKING-RUNTIME',
    occurredAt: event.occurredAt || new Date().toISOString(),
    evidence: event.evidence || [],
  });

  if (observed.ok) {
    observed.observation.productFlow = event.productFlow || 'PFLOW-SPEAKING-RUNTIME';
  }

  return observed;
}

export function createSpeakingRuntimeObservationFromRuntimeEffect(effect = {}) {
  if (effect?.kind !== 'product_observation') {
    return {
      ok: false,
      errors: ['product_observation effect required'],
      observation: null,
    };
  }

  const payload = effect.payload || {};
  if (payload.observer !== 'speakingRuntimeObserver') {
    return {
      ok: false,
      errors: ['speakingRuntimeObserver payload required'],
      observation: null,
    };
  }

  return observeSpeakingRuntimeEvent({
    eventType: payload.eventType,
    productCapability: payload.productCapability,
    productFlow: payload.productFlow,
    occurredAt: payload.occurredAt,
    evidence: payload.evidence,
  });
}

export function createSpeakingRuntimeObservationBundle(input = {}) {
  const observed = observeSpeakingRuntimeEvent({
    id: input.id,
    eventType: input.eventType,
    productCapability: input.productCapability,
    occurredAt: input.occurredAt,
    evidence: input.evidence,
  });

  if (!observed.ok) {
    return {
      ok: false,
      errors: observed.errors,
      bundle: null,
    };
  }

  return {
    ok: true,
    errors: [],
    bundle: {
      kind: 'ProductObservationBundle',
      version: '1.0',
      source: 'speakingRuntimeObserver',
      runtimeFlow: 'speaking',
      productFlow: 'PFLOW-SPEAKING-RUNTIME',
      observations: [observed.observation],
      boundary: {
        liveRuntimeIntegrated: Boolean(input.liveRuntimeIntegrated),
        runtimeReadinessClaimed: false,
        productCapabilityVerifiedClaimed: false,
      },
    },
  };
}
