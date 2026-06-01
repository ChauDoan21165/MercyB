# WS2 be-drop composition — no co-fire materializes (empirical, corrected surfaces)

**Outcome:** re-run with corrected surfaces (built from each partner rule's real
firing surface + overlaid copula-drop, per the corrected method). All three
classes still do **not** co-fire on the live engine. No fixtures fabricated.
Each negative is now backed by the **actual matcher predicate** read from
`src/lib/tutor/correctionRules/en.ts` (read-only; no rule edited).

## Method (corrected)

For each class: take the partner rule's known-firing surface from its fixture,
overlay a dropped copula, probe several variants through the unmodified engine
(`correctWithTutorRules`), and capture real `appliedRuleIds`. A positive is valid
only if **both** target rule ids fire on one input.

## The decisive matcher predicates (from `en.ts`, read-only)

- **`en-be-verb-omission`** fires on
  `\b(?:I|He|She|It|You|We|They)\s+${BE_DROP_ADJECTIVE_PHRASE_PATTERN}\b`
  where `BE_DROP_ADJECTIVE_PHRASE_PATTERN = `very\s+<adj-whitelist>(?:\s+<time-marker>)?``.
  → the pronoun must be **immediately** followed by `very <adj>`. Any word
  between the pronoun and `very` (a time word, `not`) breaks it. The pattern
  *itself* optionally absorbs a trailing time marker — that is why
  `i very tired yesterday` → `I **was** very tired yesterday.` (be-drop picks the
  past copula **internally**; it does not hand off to a time rule).
- **`en-l4-topic-comment-word-order`** fires on three **exact, fully-anchored**
  strings only:
  `/^this book i like[.?!]?$/i`, `/^english i study every day[.?!]?$/i`,
  `/^in my family,?\s+my mother i love very much[.?!]?$/i`.
- **`en-time-expression-placement`** (`hasTimeExpressionPlacement`) per its
  fpRiskNote rewrites only `pronoun subject + whitelisted time expression +
  single verb phrase` shapes — it requires a **main verb** after the time word.
- **negation guard** governs `en-yesterday-irregular-beginner-past` (a **main
  verb** past-swap) and makes it **abstain** when `not` is present.

## Per-class evidence (corrected surfaces)

### Class 1 — be-drop × en-time-expression-placement → NO CO-FIRE

| Input | Output | Rules fired |
|-------|--------|-------------|
| `i yesterday very busy` | `I yesterday very busy.` | **none** |
| `she yesterday very tired` | `She yesterday very tired.` | **none** |
| `yesterday i very tired` | `Yesterday i was very tired.` | be-verb-omission only |
| `i very tired yesterday` | `I was very tired yesterday.` | be-verb-omission only |

**Cause:** the two matchers compete for the post-pronoun slot. be-drop needs
`pronoun + very`; time-placement needs `pronoun + TIME + verb`. Putting the time
word after the pronoun (`i yesterday very busy`) breaks be-drop's adjacency, and
the `very <adj>` predicate has **no main verb**, so time-placement also fails —
both go silent. Every time-placement fixture positive carries a lexical verb
(`went / watched / bought / moved / finished / visited`); replacing it with a
be-drop adjective predicate removes the very verb time-placement requires.

### Class 2 — be-drop × en-l4-topic-comment-word-order → NO CO-FIRE

| Input | Output | Rules fired |
|-------|--------|-------------|
| `english i very happy` | `English i am very happy.` | be-verb-omission only |
| `this book i very good` | `This book i very good.` | none (`good` not in be-drop adj whitelist) |
| `this book i very interesting` | `This book i very interesting.` | none |

**Cause:** topic-comment matches three **exact `^…$`-anchored** strings. Any
copula-drop overlay changes the string, so the anchor never matches — the rule
is structurally unable to fire on a modified surface. be-drop fires alone when
its `pronoun + very <whitelisted-adj>` pattern survives.

### Class 3 — be-drop × negation-guard → NO CO-FIRE

| Input | Output | Rules fired |
|-------|--------|-------------|
| `i not happy yesterday` | `I not happy yesterday.` | none (no `very`) |
| `i not very happy yesterday` | `I not very happy yesterday.` | none (`not` breaks `pronoun+very`) |
| `they not at home yesterday` | `They not at home yesterday.` | none (location, not `very <adj>`) |
| `i very happy and not go yesterday` | `I was very happy and not go yesterday.` | be-verb-omission only |

**Cause:** the negation variant governs the past-verb-swap, which (a) needs a
**main verb** and (b) **abstains** under `not` — by definition it produces no
positive rule fire to co-occur with anything. Separately, `not` between the
pronoun and `very` breaks be-drop's adjacency, so the two cannot even co-exist
on one surface.

## Bonus finding — Gap 1 from !265 is FIXED

be-drop now selects the past copula itself (the optional trailing time marker in
`BE_DROP_ADJECTIVE_PHRASE_PATTERN`): `she very happy yesterday` →
`She **was** very happy yesterday.` Correct, but internal — not a co-fire.

## Recommendation to Lane A

The three classes cannot be golden-locked as specified — not for lack of valid
surfaces (the corrected method exhausted them), but because the matcher
predicates are mutually exclusive: be-drop is a verbless `pronoun + very <adj>`
rule, and each partner needs a main verb and/or an exact anchored surface.
Options: (1) drop these classes from WS2, or (2) if multi-error be-drop coverage
is wanted, it is a Lane A **rule-design** change (e.g. clause-splitting, or
widening be-drop to verb-bearing clauses), not a fixture. No code changed; no
correction bug found.
