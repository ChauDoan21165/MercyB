# Query Engine Interface

The Query Engine answers: what exists?

## Command Shape

```text
mercyb-query <command> [object_id|text] [--json] [--limit N] [--depth N]
```

## Required Commands

- `summary`
- `describe <object_id>`
- `owned-by <object_id>`
- `owners-of <object_id>`
- `concepts-taught-by <object_id>`
- `resources-for <object_id>`
- `missing-resources <object_id>`
- `evidence-for <object_id>`
- `runtime-for <object_id>`
- `why-not-ready <object_id>`
- `reason <object_id>`
- `search <text>`

## Contract

- Deterministic only.
- No LLM calls.
- Read-only.
- Graph edges are not returned as anatomy objects.
- Temporary, measurement, diagnostic, and task records are not Product Cells.

## JSON Output

Every command that supports `--json` must emit parseable JSON and include enough IDs to trace back to source artifacts.
