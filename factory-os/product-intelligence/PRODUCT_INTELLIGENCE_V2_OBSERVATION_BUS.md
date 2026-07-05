# Product Intelligence v2 — Observation Bus

## Mission

The Observation Bus receives runtime observation effects and normalizes them into ProductObservation records.

## Why

Runtime code should not know concrete observers or Factory internals.

Runtime emits an effect.
The bus normalizes it.
Product Intelligence consumes it.

## Proven Path

Speaking Runtime
→ product_observation effect
→ Observation Bus
→ ProductObservation
→ capability coverage

## Boundary

This is still local and test-backed.
It does not claim deployment, full runtime readiness, or complete product coverage.
