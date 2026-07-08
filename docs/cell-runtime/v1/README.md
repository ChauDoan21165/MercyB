# Cell Runtime v1 Promotion Package

This package captures the reusable runtime/query/reasoning model discovered by Admin inventory work. It is intentionally small and excludes raw inventories, generated JSONL snapshots, candidate queues, missing-audio reports, and Admin-only audit reports.

## Purpose

Prepare C3 integration around a deterministic MercyB model:

- Anatomy objects: System, Organ, Tissue, Cell, Resource, Temporary, Measurement, Diagnostic.
- Multi-graph relationships: ownership, knowledge, runtime, evidence, dependency.
- Query Engine interface: deterministic answers to "what exists?"
- Reasoning Engine interface: deterministic answers to "what should happen?"

## Contents

- `schemas/anatomy-object.schema.json`
- `schemas/graph-edge.schema.json`
- `schemas/reasoning-result.schema.json`
- `specs/multigraph-architecture-v1.md`
- `specs/anatomy-layer-model-v1.md`
- `interfaces/query-engine-interface.md`
- `interfaces/reasoning-engine-interface.md`
- `fixtures/minimal-sample.json`
- `PROMOTION_REVIEW.md`

## C3 Integration Recommendation

Integrate in three steps:

1. Add schema validation around generated Cell Runtime artifacts.
2. Wrap existing query/reasoning commands behind stable TypeScript interfaces.
3. Keep generated inventories outside product runtime until C3 owns a reviewed adapter.

No product behavior change is included in this package.

## Validation

Run from the repo root:

```sh
node scripts/cell-runtime-contracts/v1/validate-cell-runtime-contracts.mjs
```

The validator checks that schemas parse, the minimal fixture validates, an invalid fixture fails, `SENTENCE_TEACHES_CONCEPT` is Knowledge Graph, and the contract package has no runtime imports.
