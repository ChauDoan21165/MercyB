# Reasoning Engine Interface

The Reasoning Engine answers: what should happen?

## Command Shape

```text
mercyb-query reason <object_id> [--json] [--limit N] [--depth N]
```

## Reasoning Contract

For every object, determine:

1. WHO_AM_I
2. WHO_OWNS_ME
3. WHAT_DO_I_OWN
4. WHAT_SHOULD_EXIST
5. WHAT_EXISTS
6. WHAT_IS_MISSING
7. WHY
8. NEXT_ACTION

## Required Result Fields

- `object_id`
- `deterministic: true`
- `llm_used: false`
- `health`
- `who_am_i`
- `who_owns_me`
- `what_i_own`
- `what_should_exist`
- `what_exists`
- `what_is_missing`
- `why`
- `release_blockers`
- `recommended_next_actions`

## Quality Gate

Every recommendation must expose an evidence chain. Hidden reasoning is not allowed.
