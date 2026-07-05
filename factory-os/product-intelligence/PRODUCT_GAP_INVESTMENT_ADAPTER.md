# Product Gap Investment Adapter

## Mission

Convert ProductCapabilityGap records into ranked EngineeringInvestment records.

## Input

ProductCapabilityGap from Capability Coverage Engine.

## Scoring

Return on investment is calculated from:

- product impact
- runtime impact
- verification impact
- engineering cost
- blast radius

## Output

Ranked EngineeringInvestment records.

Investments with high enough return are marked ready for Engineering Objective generation.

## Boundary

This adapter ranks product gaps.

It does not implement the product fix.
It does not claim runtime readiness.
It does not claim product capability verification.
