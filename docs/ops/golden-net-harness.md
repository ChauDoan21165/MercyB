# Golden-Net Correction Harness — Canonical Reference

**Status:** canonical. This is the single source of truth for the Lane B/B-fleet correction-rule "golden net": its layout, the Pattern B fixture schema, the validator rules, and the authoring discipline. Topic-specific notes (e.g. `be-drop-composition-deferred.md`) defer to this doc.

Last verified: 2026-05-31 against `origin/main`.

## What it is

A data-driven regression net that locks the **observable behavior** of each shipped `en-*` correction rule, so Lane A can keep evolving the correction engine (`src/lib/tutor/**`) without silently regressing precision. Each rule gets a JSON fixture of positive (should-fire) and negative (must-not-fire / FP-stress) cases; a runner replays every case through the live engine and asserts the result.

## Layout

| Piece | Path |
| --- | --- |
| Fixtures (one or more JSON per rule) | `tests/regression/golden-set/correction-rules/*.json` |
| Runner (schema validation + per-case assertions) | `tests/regression/harness/runCorrectionGolden.ts` |
| Vitest entry point (thin wrapper) | `tests/regression/correction-golden.test.ts` → calls `runCorrectionGolden()` |
| Run command | `npm run test:regression` (= `vitest run tests/regression/**`) |

The runner auto-discovers every `*.json` in the fixtures directory and registers one Vitest case per entry. **Coverage is matched by the fixture's `ruleId` field, not its filename** — a rule may be split across multiple files, and filenames need not equal rule ids.

## Pattern B fixture schema

```jsonc
{
  "rule": "calqueSayWithPerson",          // logical (camelCase) name
  "ruleId": "en-calque-say-with-person",  // concrete engine rule id
  "language": "en",                        // optional; defaults to "en"
  "description": "...",                    // conventional
  "fp_risk_note": "...",                   // REQUIRED, non-empty
  "positive": [ /* >= 3 cases */ ],        // rule SHOULD fire
  "negative": [ /* >= 2 cases */ ]         // rule must NOT fire (FP-stress)
}
```

### Per-case fields

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | ✅ | Unique, stable case id. |
| `input` | ✅ | Learner sentence fed to `correctWithTutorRules(input, language)`. |
| `expectedCorrection` | ✅ | Exact `result.corrected` string. **Capture from the live engine**, not by hand (it includes normalize → capitalize-first → terminal punctuation). |
| `expectedRuleFired` | ✅ | **Single-rule contract.** A rule name (string) on positives — `null` on negatives. The logical name resolves to `ruleId`; a concrete id also works. |
| `notes` | ✅ | Non-empty rationale (what FP surface / behavior this locks). |
| `expectedStatus` | optional | `"corrected" \| "unchanged" \| "needs_ai"`. Asserted only when present. |
| `expectedRulesFired` | optional | **Composition only.** Array of **≥2** concrete ids that must co-fire. When present and non-empty it **supersedes** `expectedRuleFired` for the positive assertion. |
| `mustNotFire` | optional | Array of **≥1** concrete ids that must NOT appear in `appliedRuleIds`. Asserted in **both** positive and negative cases (anti-double-fire / exclusion lock). |

### `expectedRuleFired` vs `expectedRulesFired[]` — the !289 rule

- **Single-rule fixture → use `expectedRuleFired`** (singular string on positives, `null` on negatives).
- **`expectedRulesFired[]` is composition-only.** The validator **requires ≥2** rule-id strings; a single-element array **fails validation**. Never use it to express "one rule fired" — that is what `expectedRuleFired` is for.

(Surfaced by !289, where a single-rule calque fixture was spec'd with a one-element `expectedRulesFired[]`; corrected to `expectedRuleFired`.)

## Validation rules (enforced by the runner)

- Each fixture must have non-empty `rule`, `ruleId`, `fp_risk_note`.
- `positive.length >= 3` (`MIN_POSITIVE`), `negative.length >= 2` (`MIN_NEGATIVE`).
- Each case must have all `REQUIRED_CASE_KEYS`: `id`, `input`, `expectedCorrection`, `expectedRuleFired`, `notes`.
- `expectedRuleFired` must be a string (positive) or `null` (negative).
- `expectedRulesFired` (if present): array of **≥2** non-empty strings.
- `mustNotFire` (if present): array of **≥1** non-empty strings.

## Per-case assertion semantics

For each case the runner runs `correctWithTutorRules(input, language)` and asserts:

1. `result.status === expectedStatus` — only if `expectedStatus` is set.
2. `result.corrected === expectedCorrection` — always.
3. For every id in `mustNotFire`: `appliedRuleIds` does **not** contain it — both categories.
4. **Positive:** if `expectedRulesFired` is non-empty, `appliedRuleIds` contains **every** listed id; otherwise it contains `resolveRuleId(fixture, expectedRuleFired)` (logical name === `fixture.rule` → `fixture.ruleId`).
5. **Negative:** `appliedRuleIds` does **not** contain `fixture.ruleId`.

## Authoring discipline (empirical)

- **Probe every case on the live engine first.** Spec outputs are *intended* behavior, not ground truth; `expectedCorrection` / `expectedStatus` / fired-ids are captured from actual engine output on current `main`.
- **Do not force green.** A positive that does not fire, or a negative the engine *does* correct (a false positive), is a **rule finding** — document it in the MR and surface to Lane A. Do **not** fix the rule (Lane A owns `src/lib/tutor/**`) and do **not** trim/pad the fixture to make CI pass. A red on a documented finding is a true signal.
- Negatives should stress the rule's real FP surfaces (intervening objects, questions, parentheticals, absolute constructions, different verbs, etc.), described in `fp_risk_note`.

## Open limitation — exact-match anchored one-off rules

Some rules `detect` a **single hardcoded, anchored literal sentence** (e.g. `en-hat-biking-summer-runon`, `en-morning-routine-subject-carryover`, `en-runon-morning-routine-punctuation`). These do not fit Pattern B: there is effectively **one firing input**, so the `positive.length >= 3` requirement cannot be met with genuine, distinct cases.

**Do not pad positives** (case/punctuation variants of the same literal) to force coverage — that manufactures false breadth. These rules are **pending a Lane A decision to generalize or retire**; until then they are tracked as known gaps (see `RECON-golden-coverage-B4.md`) rather than fixtured. If Lane A generalizes such a rule into a real pattern, author a Pattern B fixture at that point.
