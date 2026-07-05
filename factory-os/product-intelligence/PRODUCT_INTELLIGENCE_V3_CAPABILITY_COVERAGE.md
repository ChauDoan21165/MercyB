# Product Intelligence v3 — Capability Coverage Engine

## Mission

Capability Coverage Engine converts runtime ProductObservations into product capability coverage and product capability gaps.

## Questions Answered

- Which Teacher Mercy product capabilities have runtime observations?
- Which product capabilities have zero runtime observations?
- Which observed capabilities are missing replay or Judge evidence?
- Which runtime flows remain uncovered?

## Input

ProductObservation records from Observation Bus.

## Output

Capability coverage summary and ProductCapabilityGap records.

## Boundary

This engine analyzes local observations and registry entries.

It does not claim full product coverage.
It does not claim deployment.
It does not claim runtime readiness.
