import type { ObservationFact } from "./types";

export type ObservationListener = (fact: ObservationFact) => void;

export class ObservationEventBus {
  private readonly facts: ObservationFact[] = [];
  private readonly listeners = new Set<ObservationListener>();

  publish(fact: ObservationFact): ObservationFact {
    this.facts.push(fact);
    for (const listener of this.listeners) listener(fact);
    return fact;
  }

  subscribe(listener: ObservationListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  snapshot(): ObservationFact[] {
    return [...this.facts];
  }

  clear(): void {
    this.facts.length = 0;
  }
}

export const observationEventBus = new ObservationEventBus();
