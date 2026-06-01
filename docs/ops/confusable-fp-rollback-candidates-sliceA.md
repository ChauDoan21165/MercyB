# Confusable-negative stress — Slice A FP rollback candidates (CEO audit)

> **Consolidation note:** kept as a per-slice fragment (not the shared
> `confusable-fp-rollback-candidates.md`) to avoid add/add conflicts while the
> shared doc isn't on `main`. Fold into the shared doc later. Same format.

Each entry is a **real captured** `input → wrong-output` from the live engine.
Rule **not** edited; FP **not** added as a passing negative. Clean confusables
added as negatives in the same MR.

## Slice A — B3 (en-step5-subject-verb-agreement, en-step5-preposition-pattern, en-be-verb-omission)

Per-rule verdict:

| Rule | Verdict | Clean confusable negatives added |
|------|---------|----------------------------------|
| en-step5-subject-verb-agreement | 🔴 **1 FP** | intervening `He always go to work.`, parenthetical `He, I think, go to work.` |
| en-step5-preposition-pattern | ✅ CLEAN | `independent of`, `with interest`, `good in the morning` |
| en-be-verb-omission | ✅ CLEAN | non-whitelist adj `You very kind to help.` |

### 🔴 en-step5-subject-verb-agreement — coordinated plural-subject FP

The matcher `/\b(He|She|It)\s+(go|make|work)\b/i` matches the **second** pronoun
of a coordinated subject and adds `-s`, even though the subject is plural and the
base form is correct.

| Input | Wrong output | Note |
|-------|--------------|------|
| `He and she go to work.` | `He and she goes to work.` | `He and she` is plural → `go` is correct; no `-s` |

Root: no guard for a preceding coordinator (`X and <pronoun>`); the rule treats
`she go` in isolation. Likely affects `He and I/we/they go`, `you and she go`,
etc.

### ✅ Clean (no FP) — for the audit record
- **en-step5-preposition-pattern** abstained correctly on all sub-pattern
  near-misses: `independent of` (substring `depend`, no word boundary),
  `with interest` (vs `interested with`), `good in the morning` / `the good in
  people` / `good in-class` (vs `good in English/math/science`). These three
  sub-patterns (`depend of`, `interested with`, `good in`) previously had **no**
  confusable coverage — now added.
- **en-be-verb-omission** fired correctly on trailing-parenthetical and
  coordinated-adjective positives and abstained on a non-whitelist adjective
  (`You very kind to help.`). Already-strong negative set; no FP.
