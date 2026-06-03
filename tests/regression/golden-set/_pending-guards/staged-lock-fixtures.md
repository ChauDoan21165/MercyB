# Staged lock fixtures — confusable FP guards (DO NOT add to correction-rules/ yet)

These are pre-built negative cases for the false positives in
`docs/ops/confusable-fp-rollback-candidates.md`. They are **staged, not active**:
each FP input still **fires** the rule today, so adding it as a passing negative
now would fail the golden suite. The directory `_pending-guards/` is **not**
scanned by `runCorrectionGolden.ts` (it loads only `correction-rules/*.json`).

**Activation, per FP, the instant Lane A ships its guard:**
1. Re-probe the input on the new engine; confirm the rule's id is **absent**
   from `appliedRuleIds`.
2. Paste the staged entry below into the **target fixture's** `negative[]` array,
   correcting `expectedCorrection` to the engine's exact post-guard output (it is
   pre-filled as the unchanged input — verify it).
3. `npx vitest run tests/regression/correction-golden.test.ts` → green, commit.

---

## 4. en-step6-profession-article → `correction-rules/profession-article.json`

**RECONCILIATION (live-engine probe, 2026-06-02).** The original staged entry
below (`"He is doctor Smith."`) is **stale**: the live engine **already abstains**
on it, AND it is **already a passing negative in the active fixture**
(`profession-article.json` negatives include `"He is doctor Smith."`,
`"He is Doctor Smith."`, `"She is nurse Nguyen."`). The engine already excludes a
**capitalized** trailing token, so capitalized title+name cases do **not** fire
today — there is no guard to wait for. **Recommend retiring this stale entry** (it
duplicates an active baseline). Left in place pending an explicit retire nod; do
not re-activate it as "flips-after".

```json
{
  "id": "profession-article-neg-lock-title-propername",
  "input": "He is doctor Smith.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "He is doctor Smith.",
  "expectedRuleFired": null,
  "notes": "STALE — already abstains on the live engine AND already an active-fixture passing negative. No guard pending. Recommend retiring this staged entry."
}
```

### 4-breadth. FLIP negatives (flips-after) — lowercase trailing-name FP

The residual FP the capitalized-token exclusion misses: a **lowercase** surname
after a whitelisted profession noun. These **fire today** (insert the article)
and must **abstain** once Lane A extends the guard to a trailing name token
regardless of case. Whitelisted profession required — `professor`/`nurse` are not
whitelisted, so `"He is professor smith."` already abstains (not a FLIP).

```json
{
  "id": "profession-article-neg-lock-lowercase-name-strange",
  "input": "He is doctor strange.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "He is doctor strange.",
  "expectedRuleFired": null,
  "notes": "FLIP (flips-after). Fires TODAY: 'He is doctor strange.' -> 'He is a doctor strange.' (en-step6-profession-article). 'strange' is a lowercase surname; the capitalized-token guard misses it. After Lane A widens the trailing-name guard to be case-insensitive, must abstain. expectedCorrection is the post-guard (unchanged) form — verify on the live engine at activation."
}
```
```json
{
  "id": "profession-article-neg-lock-lowercase-name-lee",
  "input": "She is doctor lee.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "She is doctor lee.",
  "expectedRuleFired": null,
  "notes": "FLIP (flips-after). Fires TODAY: 'She is doctor lee.' -> 'She is a doctor lee.' (en-step6-profession-article). Lowercase surname 'lee' after whitelisted 'doctor'. After the case-insensitive trailing-name guard, must abstain. Verify post-guard output at activation."
}
```

### 4-breadth. Verify-now negatives — capitalized Strange/Lee (already correct)

The `Strange`/`Lee` proper-noun-title cases the breadth note names: with a
**capitalized** surname the engine **already abstains today** (same class as the
active `doctor Smith`/`nurse Nguyen` negatives, distinct surnames). These are
**verify-now** regression locks — confirmed correct on the live engine now; they
must keep abstaining after the guard. Distinct from the active baseline (new
surnames), so not duplicates.

```json
{
  "id": "profession-article-neg-lock-cap-name-strange",
  "input": "He is doctor Strange.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "He is doctor Strange.",
  "expectedRuleFired": null,
  "notes": "Verify-now. Abstains TODAY (live-engine confirmed) — capitalized trailing token already excluded. Lock against regression; keep abstaining post-guard. Safe to land in the active fixture's negative[] now (no guard dependency)."
}
```
```json
{
  "id": "profession-article-neg-lock-cap-name-lee",
  "input": "She is doctor Lee.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "She is doctor Lee.",
  "expectedRuleFired": null,
  "notes": "Verify-now. Abstains TODAY (live-engine confirmed). Distinct surname from the active 'Nguyen'/'Smith' negatives, so not a duplicate. No guard dependency."
}
```

**SAFE positives (verify-now) — already locked by the active baseline.** The
guard must keep firing on bare whitelisted professions with no trailing name:
`"He is teacher."`, `"She is doctor."`, `"He is engineer."` (all → insert a/an,
`en-step6-profession-article`). These already live in `profession-article.json`
`positive[]`; re-confirmed firing on the live engine. **No new rows** — adding
them would duplicate the active baseline.

## 5. en-step6-wait-for-person-object → `correction-rules/wait-for-person-object.json`

Gated on: Lane A adds an `up` phrasal-particle lookahead to the wait-for matcher.

**NO-BUG (today):** the `out` particle ALREADY abstains on the current engine — `Wait them out.` / `Wait him out.` / `Wait us out.` all pass through unchanged (the `out` half appears already merged). The prior `Wait them out.` lock is dropped; no lock needed for `out`.

**FLIPS-AFTER** (fires today → must abstain once the `up` lookahead lands):
```json
{
  "id": "wait-for-person-object-neg-lock-phrasal-up",
  "input": "Wait them up.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "Wait them up.",
  "expectedRuleFired": null,
  "notes": "FLIP: 'wait them up' is phrasal; today fires en-step6-wait-for-person-object -> 'Wait for them up.'. After the up-particle guard, must abstain. (Also Wait me up. / Wait her up.)"
}
```
**VERIFY-NOW** (fires today, must STILL fire after the guard — guard must not over-suppress real wait-for objects):
```json
{
  "id": "wait-for-person-object-pos-verify-me",
  "input": "Wait me.",
  "expectedStatus": "corrected",
  "expectedCorrection": "Wait for me.",
  "expectedRuleFired": "en-step6-wait-for-person-object",
  "notes": "VERIFY-NOW: bare object pronoun, no particle -> 'for' inserted. Must keep firing after the guard."
}
```
```json
{
  "id": "wait-for-person-object-pos-verify-us",
  "input": "Please wait us.",
  "expectedStatus": "corrected",
  "expectedCorrection": "Please wait for us.",
  "expectedRuleFired": "en-step6-wait-for-person-object",
  "notes": "VERIFY-NOW: must keep firing after the guard."
}
```
## 6. en-step5-subject-verb-agreement → `correction-rules/step5-subject-verb-agreement.json`
```json
{
  "id": "step5-sva-neg-lock-coordinated-subject",
  "input": "He and she go to work.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "He and she go to work.",
  "expectedRuleFired": null,
  "notes": "Lock (coordinator guard): 'He and she' is plural; 'go' is correct. Rule must not add -s to the 2nd coordinated pronoun."
}
```

## 7. en-calque-take-medicine → `correction-rules/calque-take-medicine.json`

Gated on: Lane A trims `tablet` from the medicine-object whitelist (or requires medicine context).

**FLIPS-AFTER** (fires today → must abstain after the trim):
```json
{
  "id": "calque-take-medicine-neg-lock-tablet-confection",
  "input": "I eat a tablet of chocolate.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I eat a tablet of chocolate.",
  "expectedRuleFired": null,
  "notes": "FLIP: 'tablet of chocolate' is a confection; today fires en-calque-take-medicine -> 'I take a tablet of chocolate.'. After the whitelist trim, must abstain."
}
```
**VERIFY-NOW** (fires today, must STILL fire after the trim — real medicine objects):
```json
{
  "id": "calque-take-medicine-pos-verify-medicine",
  "input": "I eat medicine.",
  "expectedStatus": "corrected",
  "expectedCorrection": "I take medicine.",
  "expectedRuleFired": "en-calque-take-medicine",
  "notes": "VERIFY-NOW: real medicine object; eat->take must keep firing."
}
```
```json
{
  "id": "calque-take-medicine-pos-verify-painkillers",
  "input": "I eat painkillers.",
  "expectedStatus": "corrected",
  "expectedCorrection": "I take painkillers.",
  "expectedRuleFired": "en-calque-take-medicine",
  "notes": "VERIFY-NOW: must keep firing after the trim."
}
```
```json
{
  "id": "calque-take-medicine-pos-verify-drink",
  "input": "I drink medicine.",
  "expectedStatus": "corrected",
  "expectedCorrection": "I take medicine.",
  "expectedRuleFired": "en-calque-take-medicine",
  "notes": "VERIFY-NOW: drink medicine -> take medicine, must keep firing."
}
```
## 8. en-step6-look-at-pronoun → `correction-rules/look-at-pronoun.json`

The `look someone in the eye(s)` idiom frame is **absent** from the active
`look-at-pronoun.json` negatives (those cover look-for/like/up/over/down/watch) —
so every entry below is **net-new**, not a duplicate. All FLIP negatives **fire
today** (insert `at`, breaking the idiom) and must **abstain** after Lane A adds
the `in the eye(s)` idiom guard.

```json
{
  "id": "look-at-pronoun-neg-lock-idiom-eye",
  "input": "Look him in the eye.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "Look him in the eye.",
  "expectedRuleFired": null,
  "notes": "FLIP (flips-after). Fires TODAY: 'Look him in the eye.' -> 'Look at him in the eye.' (en-step6-look-at-pronoun). 'look someone in the eye' takes a bare object; no 'at'. After the idiom guard, must abstain."
}
```

### 8-breadth. FLIP negatives (flips-after) — eyes-plural + declarative

```json
{
  "id": "look-at-pronoun-neg-lock-idiom-eyes-plural",
  "input": "Look her in the eyes.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "Look her in the eyes.",
  "expectedRuleFired": null,
  "notes": "FLIP (flips-after). Fires TODAY: 'Look her in the eyes.' -> 'Look at her in the eyes.' (en-step6-look-at-pronoun). Plural 'eyes' variant of the idiom; same bare-object frame. After the idiom guard, must abstain. Verify post-guard output at activation."
}
```
```json
{
  "id": "look-at-pronoun-neg-lock-idiom-eye-them",
  "input": "Look them in the eye.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "Look them in the eye.",
  "expectedRuleFired": null,
  "notes": "FLIP (flips-after). Fires TODAY: 'Look them in the eye.' -> 'Look at them in the eye.' (en-step6-look-at-pronoun). 'them' object, singular-eye idiom. After the idiom guard, must abstain."
}
```
```json
{
  "id": "look-at-pronoun-neg-lock-idiom-eyes-declarative",
  "input": "I looked him in the eyes.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I looked him in the eyes.",
  "expectedRuleFired": null,
  "notes": "FLIP (flips-after). Fires TODAY: 'I looked him in the eyes.' -> 'I looked at him in the eyes.' (en-step6-look-at-pronoun). Declarative past-tense + plural-eyes idiom (vs the imperative cases above). After the idiom guard, must abstain."
}
```

**SAFE positives (verify-now) — already locked by the active baseline.** The
guard must keep firing on a bare person-pronoun object with no idiom frame:
`"Look me."` (→ 'Look at me.'), `"She looked him."` (→ 'She looked at him.'),
`"They are looking us."` (→ 'They are looking at us.') — all `en-step6-look-at-pronoun`.
These already live in `look-at-pronoun.json` `positive[]`; re-confirmed firing on
the live engine. **No new rows** — adding them would duplicate the active baseline.

## 9. en-step6-at-clock-time → `correction-rules/at-clock-time.json` — **LOWEST severity (optional, do last)**

Gated on: Lane A range-bounds CLOCK_TIME_PATTERN (hours 0-23, minutes 0-59).

**FLIPS-AFTER** (fires today on INVALID times → must abstain after range-bound):
```json
{
  "id": "at-clock-time-neg-lock-invalid-hour",
  "input": "We meet 25:00.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "We meet 25:00.",
  "expectedRuleFired": null,
  "notes": "FLIP: hour 25 invalid; today fires en-step6-at-clock-time -> 'We meet at 25:00.'. After range-bound, must abstain. (Output stays grammatical, lowest severity.)"
}
```
```json
{
  "id": "at-clock-time-neg-lock-invalid-minute",
  "input": "We meet 19:99.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "We meet 19:99.",
  "expectedRuleFired": null,
  "notes": "FLIP: minute 99 invalid; today fires -> 'We meet at 19:99.'. After range-bound, must abstain."
}
```
**VERIFY-NOW** (fires today on VALID times, must STILL fire after range-bound):
```json
{
  "id": "at-clock-time-pos-verify-hhmm",
  "input": "We meet 3:00.",
  "expectedStatus": "corrected",
  "expectedCorrection": "We meet at 3:00.",
  "expectedRuleFired": "en-step6-at-clock-time",
  "notes": "VERIFY-NOW: valid time 3:00 -> 'at' inserted; must keep firing."
}
```
```json
{
  "id": "at-clock-time-pos-verify-ampm",
  "input": "Let's meet 9 PM.",
  "expectedStatus": "corrected",
  "expectedCorrection": "Let's meet at 9 PM.",
  "expectedRuleFired": "en-step6-at-clock-time",
  "notes": "VERIFY-NOW: valid 9 PM -> 'at' inserted; must keep firing."
}
```
## 11. en-hat-biking-summer-runon → **ACTIVATED** (rule retired !324/!326)

Rule retired by Lane A (gone from `en.ts`). The three pass-through locks moved
to a retirement test — `tests/regression/retired-rules-passthrough.test.ts` —
which asserts each former trigger input is returned unchanged with no rule
firing. No longer staged.

## 12. en-step6-morning-routine-subject-carryover → pass-through lock (RETIREMENT dependency)

**RETIREMENT pass-through, not a guard.** Per `docs/ops/stub-rule-generalize-or-retire.md`,
this rule is a single-literal stub (one exact `^…$` match) → **RETIRE**. The one
demo input fires **only** `en-step6-morning-routine-subject-carryover` today
(verified live) and gets a canned rewrite; after retirement it must pass through
unchanged.

**Dependency:** commit only once **Lane A retires
`en-step6-morning-routine-subject-carryover`**. Until then it fires and would
fail the suite.

**Target — schema caveat (same as #11):** a retired rule has no positives, so it
cannot be a rule-centric golden fixture. Activate by adding a `describe` block to
`tests/regression/retired-rules-passthrough.test.ts` (re-probe first to confirm
pass-through + that no other rule now fires).

```json
{
  "id": "morning-routine-subject-carryover-retire-lock",
  "input": "In the morning, I wake up and they have a breakfast and coffee and then I go to my office.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "In the morning, I wake up and they have a breakfast and coffee and then I go to my office.",
  "expectedRuleFired": null,
  "notes": "Retirement pass-through: today rewrites to 'In the morning, I wake up, have breakfast and coffee, and then go to my office.' (canned subject-carryover fix). After retirement, must pass through unchanged. Verify on the live engine at activation time."
}
```

## 13. en-runon-morning-routine-punctuation → pass-through lock (RETIREMENT dependency)

**RETIREMENT pass-through, not a guard.** Per the same doc, a single-literal
run-on-punctuation stub → **RETIRE**. The one demo input fires **only**
`en-runon-morning-routine-punctuation` today (verified live); after retirement it
must pass through unchanged.

**Dependency:** commit only once **Lane A retires
`en-runon-morning-routine-punctuation`**. Until then it fires and would fail the
suite.

**Target — schema caveat (same as #11):** add a `describe` block to
`tests/regression/retired-rules-passthrough.test.ts` at activation (re-probe
first).

```json
{
  "id": "runon-morning-routine-punctuation-retire-lock",
  "input": "What do you usually do in the morning nice that sounds like a clear morning routine what do you do after that",
  "expectedStatus": "unchanged",
  "expectedCorrection": "What do you usually do in the morning nice that sounds like a clear morning routine what do you do after that",
  "expectedRuleFired": null,
  "notes": "Retirement pass-through: today rewrites to 'What do you usually do in the morning? Nice, that sounds like a clear morning routine. What do you do after that?' (canned punctuation insertion). After retirement, must pass through unchanged. Verify on the live engine at activation time."
}
```

---

## Corpus-wave. en-vietlish-very-like → target fixture TBD

Source: `vn-interference-corpus-wave.json`, candidate
`en-vietlish-very-like` / `vietlishVeryLike`.

Gated on: Lane A adds a new correction rule for VN `rat thich` transfer:
`very like/likes` → `really like/likes` or equivalent natural English.

**ACTIVATION positives** (abstain today → must fire once the new rule lands):
```json
{
  "id": "vn-corpus-very-like-pos-001",
  "input": "I very like English.",
  "expectedStatus": "corrected",
  "expectedCorrection": "I really like English.",
  "expectedRuleFired": "en-vietlish-very-like",
  "notes": "Corpus-wave candidate en-vietlish-very-like. ACTIVATE-AFTER: live engine 2026-06-02 abstains (unchanged, no appliedRuleIds). Once Lane A ships this rule, it must correct VN 'rat thich' transfer without needing AI."
}
```
```json
{
  "id": "vn-corpus-very-like-pos-002",
  "input": "She very likes this song.",
  "expectedStatus": "corrected",
  "expectedCorrection": "She really likes this song.",
  "expectedRuleFired": "en-vietlish-very-like",
  "notes": "Corpus-wave candidate en-vietlish-very-like. ACTIVATE-AFTER: live engine 2026-06-02 abstains. Third-person 'likes' form must preserve agreement while moving intensifier semantics."
}
```
```json
{
  "id": "vn-corpus-very-like-pos-003",
  "input": "We very like this class.",
  "expectedStatus": "corrected",
  "expectedCorrection": "We really like this class.",
  "expectedRuleFired": "en-vietlish-very-like",
  "notes": "Corpus-wave candidate en-vietlish-very-like. ACTIVATE-AFTER: live engine 2026-06-02 abstains. Plural subject baseline for the new rule."
}
```

**VERIFY-NOW negatives** (already abstain; must keep abstaining after the new rule):
```json
{
  "id": "vn-corpus-very-like-neg-001",
  "input": "I really like English.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I really like English.",
  "expectedRuleFired": null,
  "notes": "Corpus-wave guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; already-natural intensifier must not be rewritten by en-vietlish-very-like."
}
```
```json
{
  "id": "vn-corpus-very-like-neg-002",
  "input": "This is very good.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "This is very good.",
  "expectedRuleFired": null,
  "notes": "Corpus-wave guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; 'very' before adjective is correct and must not be captured by a broad very+word matcher."
}
```
```json
{
  "id": "vn-corpus-very-like-neg-003",
  "input": "I like English very much.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I like English very much.",
  "expectedRuleFired": null,
  "notes": "Corpus-wave guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; natural 'like ... very much' alternative must remain unchanged."
}
```

## Corpus-wave. en-vietlish-copula-agree → target fixture TBD

Source: `vn-interference-corpus-wave.json`, candidate
`en-vietlish-copula-agree` / `vietlishCopulaAgree`.

Gated on: Lane A adds a new correction rule for VN transfer around `dong y`:
`be + agree` → finite `agree/agrees`.

**ACTIVATION positives** (abstain today → must fire once the new rule lands):
```json
{
  "id": "vn-corpus-copula-agree-pos-001",
  "input": "I am agree with you.",
  "expectedStatus": "corrected",
  "expectedCorrection": "I agree with you.",
  "expectedRuleFired": "en-vietlish-copula-agree",
  "notes": "Corpus-wave candidate en-vietlish-copula-agree. ACTIVATE-AFTER: live engine 2026-06-02 abstains (unchanged, no appliedRuleIds). Once Lane A ships this rule, auxiliary 'am' must be removed."
}
```
```json
{
  "id": "vn-corpus-copula-agree-pos-002",
  "input": "She is agree with the plan.",
  "expectedStatus": "corrected",
  "expectedCorrection": "She agrees with the plan.",
  "expectedRuleFired": "en-vietlish-copula-agree",
  "notes": "Corpus-wave candidate en-vietlish-copula-agree. ACTIVATE-AFTER: live engine 2026-06-02 abstains. Third-person subject must become finite 'agrees', not just delete 'is'."
}
```
```json
{
  "id": "vn-corpus-copula-agree-pos-003",
  "input": "We are agree about this.",
  "expectedStatus": "corrected",
  "expectedCorrection": "We agree about this.",
  "expectedRuleFired": "en-vietlish-copula-agree",
  "notes": "Corpus-wave candidate en-vietlish-copula-agree. ACTIVATE-AFTER: live engine 2026-06-02 abstains. Plural subject and 'about' complement baseline for the new rule."
}
```

**VERIFY-NOW negatives** (already abstain; must keep abstaining after the new rule):
```json
{
  "id": "vn-corpus-copula-agree-neg-001",
  "input": "I agree with you.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I agree with you.",
  "expectedRuleFired": null,
  "notes": "Corpus-wave guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; already-correct finite agree must not be rewritten."
}
```
```json
{
  "id": "vn-corpus-copula-agree-neg-002",
  "input": "She agrees with the plan.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "She agrees with the plan.",
  "expectedRuleFired": null,
  "notes": "Corpus-wave guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; already-correct third-person finite form must not be rewritten."
}
```
```json
{
  "id": "vn-corpus-copula-agree-neg-003",
  "input": "I am agreeable today.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I am agreeable today.",
  "expectedRuleFired": null,
  "notes": "Corpus-wave guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; adjective 'agreeable' must not be captured by a broad be+agree prefix matcher."
}
```

---

## D1 corpus. en-afraid-of-fear-object → target fixture TBD

Source: `vn-interference-prep-phrasal-D1.json`, candidate
`en-afraid-of-fear-object` / `afraidOfFearObject`.

Gated on: Lane A adds a new correction rule for VN `so` preposition transfer:
`afraid from/with <fear object>` → `afraid of <fear object>`.

**ACTIVATION positives** (abstain today → must fire once the new rule lands):
```json
{
  "id": "d1-afraid-of-pos-001",
  "input": "I am afraid from dogs.",
  "expectedStatus": "corrected",
  "expectedCorrection": "I am afraid of dogs.",
  "expectedRuleFired": "en-afraid-of-fear-object",
  "notes": "D1 corpus candidate en-afraid-of-fear-object. ACTIVATE-AFTER: live engine 2026-06-02 abstains (unchanged, no appliedRuleIds)."
}
```
```json
{
  "id": "d1-afraid-of-pos-002",
  "input": "She is afraid from the dark.",
  "expectedStatus": "corrected",
  "expectedCorrection": "She is afraid of the dark.",
  "expectedRuleFired": "en-afraid-of-fear-object",
  "notes": "D1 corpus candidate en-afraid-of-fear-object. ACTIVATE-AFTER: live engine 2026-06-02 abstains; fear-object noun phrase must take 'of'."
}
```
```json
{
  "id": "d1-afraid-of-pos-003",
  "input": "He is afraid with spiders.",
  "expectedStatus": "corrected",
  "expectedCorrection": "He is afraid of spiders.",
  "expectedRuleFired": "en-afraid-of-fear-object",
  "notes": "D1 corpus candidate en-afraid-of-fear-object. ACTIVATE-AFTER: live engine 2026-06-02 abstains; 'with' variant must rewrite to 'of'."
}
```

**VERIFY-NOW negatives** (already abstain; must keep abstaining after the new rule):
```json
{
  "id": "d1-afraid-of-neg-001",
  "input": "I am afraid of dogs.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I am afraid of dogs.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; already-correct target form."
}
```
```json
{
  "id": "d1-afraid-of-neg-002",
  "input": "I am afraid of heights.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I am afraid of heights.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; already-correct target form with abstract fear object."
}
```
```json
{
  "id": "d1-afraid-of-neg-003",
  "input": "I'm afraid I can't come.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I'm afraid I can't come.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; politeness idiom 'afraid + clause' must not be touched."
}
```

## D1 corpus. en-arrive-at-in-place → target fixture TBD

Source: `vn-interference-prep-phrasal-D1.json`, candidate
`en-arrive-at-in-place` / `arriveAtInPlace`.

Gated on: Lane A adds an object-sensitive arrive rule:
`arrive(d) to <venue>` → `arrive(d) at <venue>`, and `arrive to home` → `arrive home`.

**ACTIVATION positives** (abstain today → must fire once the new rule lands):
```json
{
  "id": "d1-arrive-pos-001",
  "input": "I arrive to school at 8.",
  "expectedStatus": "corrected",
  "expectedCorrection": "I arrive at school at 8.",
  "expectedRuleFired": "en-arrive-at-in-place",
  "notes": "D1 corpus candidate en-arrive-at-in-place. ACTIVATE-AFTER: live engine 2026-06-02 abstains; venue object takes 'at'."
}
```
```json
{
  "id": "d1-arrive-pos-002",
  "input": "We arrived to the airport.",
  "expectedStatus": "corrected",
  "expectedCorrection": "We arrived at the airport.",
  "expectedRuleFired": "en-arrive-at-in-place",
  "notes": "D1 corpus candidate en-arrive-at-in-place. ACTIVATE-AFTER: live engine 2026-06-02 abstains; venue object takes 'at'."
}
```
```json
{
  "id": "d1-arrive-pos-003",
  "input": "I want to arrive to home early.",
  "expectedStatus": "corrected",
  "expectedCorrection": "I want to arrive home early.",
  "expectedRuleFired": "en-arrive-at-in-place",
  "notes": "D1 corpus candidate en-arrive-at-in-place. ACTIVATE-AFTER: live engine 2026-06-02 abstains; 'home' takes no preposition."
}
```

**VERIFY-NOW negatives** (already abstain; must keep abstaining after the new rule):
```json
{
  "id": "d1-arrive-neg-001",
  "input": "I arrive at school at 8.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I arrive at school at 8.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; already-correct 'at' venue."
}
```
```json
{
  "id": "d1-arrive-neg-002",
  "input": "We arrived in Hanoi.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "We arrived in Hanoi.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; city/country objects take 'in', not 'at'."
}
```
```json
{
  "id": "d1-arrive-neg-003",
  "input": "The train arrived at the station.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "The train arrived at the station.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; already-correct venue form."
}
```

## D1 corpus. en-explain-to-recipient → target fixture TBD

Source: `vn-interference-prep-phrasal-D1.json`, candidate
`en-explain-to-recipient` / `explainToRecipient`.

Gated on: Lane A adds a new correction rule for non-ditransitive `explain`:
`explain <recipient> <object>` → `explain <object> to <recipient>`.

**ACTIVATION positives** (abstain today → must fire once the new rule lands):
```json
{
  "id": "d1-explain-pos-001",
  "input": "Please explain me the lesson.",
  "expectedStatus": "corrected",
  "expectedCorrection": "Please explain the lesson to me.",
  "expectedRuleFired": "en-explain-to-recipient",
  "notes": "D1 corpus candidate en-explain-to-recipient. ACTIVATE-AFTER: live engine 2026-06-02 abstains; bare recipient must move to a 'to' phrase."
}
```
```json
{
  "id": "d1-explain-pos-002",
  "input": "Can you explain me this?",
  "expectedStatus": "corrected",
  "expectedCorrection": "Can you explain this to me?",
  "expectedRuleFired": "en-explain-to-recipient",
  "notes": "D1 corpus candidate en-explain-to-recipient. ACTIVATE-AFTER: live engine 2026-06-02 abstains; question punctuation must be preserved."
}
```
```json
{
  "id": "d1-explain-pos-003",
  "input": "He explained me the rule.",
  "expectedStatus": "corrected",
  "expectedCorrection": "He explained the rule to me.",
  "expectedRuleFired": "en-explain-to-recipient",
  "notes": "D1 corpus candidate en-explain-to-recipient. ACTIVATE-AFTER: live engine 2026-06-02 abstains; past-tense explain variant."
}
```

**VERIFY-NOW negatives** (already abstain; must keep abstaining after the new rule):
```json
{
  "id": "d1-explain-neg-001",
  "input": "Please explain it to me.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "Please explain it to me.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; already-correct target form."
}
```
```json
{
  "id": "d1-explain-neg-002",
  "input": "Can you explain the lesson to us?",
  "expectedStatus": "unchanged",
  "expectedCorrection": "Can you explain the lesson to us?",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; already-correct recipient phrase."
}
```
```json
{
  "id": "d1-explain-neg-003",
  "input": "He explained the problem.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "He explained the problem.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; recipient-less 'explain X' must not get an inserted recipient phrase."
}
```

## D1 corpus. en-answer-no-to → target fixture TBD

Source: `vn-interference-prep-phrasal-D1.json`, candidate
`en-answer-no-to` / `answerNoTo`.

Gated on: Lane A adds a verb-sense-bound rule for respond-sense `answer`:
`answer to <question/email/person>` → `answer <question/email/person>`.

**ACTIVATION positives** (abstain today → must fire once the new rule lands):
```json
{
  "id": "d1-answer-pos-001",
  "input": "Please answer to my question.",
  "expectedStatus": "corrected",
  "expectedCorrection": "Please answer my question.",
  "expectedRuleFired": "en-answer-no-to",
  "notes": "D1 corpus candidate en-answer-no-to. ACTIVATE-AFTER: live engine 2026-06-02 abstains; respond-sense verb should drop 'to'."
}
```
```json
{
  "id": "d1-answer-pos-002",
  "input": "He did not answer to my email.",
  "expectedStatus": "corrected",
  "expectedCorrection": "He did not answer my email.",
  "expectedRuleFired": "en-answer-no-to",
  "notes": "D1 corpus candidate en-answer-no-to. ACTIVATE-AFTER: live engine 2026-06-02 abstains; negated respond-sense verb should drop 'to'."
}
```
```json
{
  "id": "d1-answer-pos-003",
  "input": "Can you answer to me?",
  "expectedStatus": "corrected",
  "expectedCorrection": "Can you answer me?",
  "expectedRuleFired": "en-answer-no-to",
  "notes": "D1 corpus candidate en-answer-no-to. ACTIVATE-AFTER: live engine 2026-06-02 abstains; question form must preserve punctuation."
}
```

**VERIFY-NOW negatives** (already abstain; must keep abstaining after the new rule):
```json
{
  "id": "d1-answer-neg-001",
  "input": "Please answer my question.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "Please answer my question.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; already-correct direct object."
}
```
```json
{
  "id": "d1-answer-neg-002",
  "input": "He replied to my email.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "He replied to my email.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; 'reply to' is correct and must not be swept into answer-no-to."
}
```
```json
{
  "id": "d1-answer-neg-003",
  "input": "The answer to the question is wrong.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "The answer to the question is wrong.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; noun phrase 'answer to X' is correct."
}
```

## D1 corpus. en-pickup-particle-drop → target fixture TBD

Source: `vn-interference-prep-phrasal-D1.json`, candidate
`en-pickup-particle-drop` / `pickUpParticleDrop`.

Gated on: Lane A adds a fetch-person frame rule:
`pick <person> at/from <place|time>` → `pick <person> up at/from <place|time>`.

**ACTIVATION positives** (abstain today → must fire once the new rule lands):
```json
{
  "id": "d1-pickup-pos-001",
  "input": "I will pick you at the airport.",
  "expectedStatus": "corrected",
  "expectedCorrection": "I will pick you up at the airport.",
  "expectedRuleFired": "en-pickup-particle-drop",
  "notes": "D1 corpus candidate en-pickup-particle-drop. ACTIVATE-AFTER: live engine 2026-06-02 abstains; animate fetch object requires 'up'."
}
```
```json
{
  "id": "d1-pickup-pos-002",
  "input": "My mom picks me at school every day.",
  "expectedStatus": "corrected",
  "expectedCorrection": "My mom picks me up at school every day.",
  "expectedRuleFired": "en-pickup-particle-drop",
  "notes": "D1 corpus candidate en-pickup-particle-drop. ACTIVATE-AFTER: live engine 2026-06-02 abstains; third-person fetch frame requires 'up'."
}
```
```json
{
  "id": "d1-pickup-pos-003",
  "input": "Can you pick me at 8?",
  "expectedStatus": "corrected",
  "expectedCorrection": "Can you pick me up at 8?",
  "expectedRuleFired": "en-pickup-particle-drop",
  "notes": "D1 corpus candidate en-pickup-particle-drop. ACTIVATE-AFTER: live engine 2026-06-02 abstains; time adjunct fetch frame requires 'up'."
}
```

**VERIFY-NOW negatives** (already abstain; must keep abstaining after the new rule):
```json
{
  "id": "d1-pickup-neg-001",
  "input": "I will pick you up at the airport.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I will pick you up at the airport.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; already-correct phrasal fetch form."
}
```
```json
{
  "id": "d1-pickup-neg-002",
  "input": "She picked up the phone.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "She picked up the phone.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; existing phrasal 'picked up the phone' must remain unchanged."
}
```
```json
{
  "id": "d1-pickup-neg-003",
  "input": "I picked a flower.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I picked a flower.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; select-sense 'pick' must not receive 'up'."
}
```

## D1 corpus. en-geton-getoff-vehicle → target fixture TBD

Source: `vn-interference-prep-phrasal-D1.json`, candidate
`en-geton-getoff-vehicle` / `getOnOffVehicle`.

Gated on: Lane A adds a vehicle-whitelist boarding/alighting rule:
`go up <vehicle>` → `get on <vehicle>`, `go down <vehicle>` → `get off <vehicle>`.

**ACTIVATION positives** (abstain today → must fire once the new rule lands):
```json
{
  "id": "d1-geton-pos-001",
  "input": "I go up the bus at 7.",
  "expectedStatus": "corrected",
  "expectedCorrection": "I get on the bus at 7.",
  "expectedRuleFired": "en-geton-getoff-vehicle",
  "notes": "D1 corpus candidate en-geton-getoff-vehicle. ACTIVATE-AFTER: live engine 2026-06-02 abstains; vehicle boarding frame should rewrite to 'get on'."
}
```
```json
{
  "id": "d1-geton-pos-002",
  "input": "We go up the train every morning.",
  "expectedStatus": "corrected",
  "expectedCorrection": "We get on the train every morning.",
  "expectedRuleFired": "en-geton-getoff-vehicle",
  "notes": "D1 corpus candidate en-geton-getoff-vehicle. ACTIVATE-AFTER: live engine 2026-06-02 abstains; train boarding frame should rewrite to 'get on'."
}
```
```json
{
  "id": "d1-geton-pos-003",
  "input": "She goes down the bus here.",
  "expectedStatus": "corrected",
  "expectedCorrection": "She gets off the bus here.",
  "expectedRuleFired": "en-geton-getoff-vehicle",
  "notes": "D1 corpus candidate en-geton-getoff-vehicle. ACTIVATE-AFTER: live engine 2026-06-02 abstains; vehicle alighting frame should rewrite to 'get off'."
}
```

**VERIFY-NOW negatives** (already abstain; must keep abstaining after the new rule):
```json
{
  "id": "d1-geton-neg-001",
  "input": "I get on the bus.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I get on the bus.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; already-correct boarding form."
}
```
```json
{
  "id": "d1-geton-neg-002",
  "input": "Please get off the train.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "Please get off the train.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; already-correct alighting form."
}
```
```json
{
  "id": "d1-geton-neg-003",
  "input": "I go up the stairs.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I go up the stairs.",
  "expectedRuleFired": null,
  "notes": "D1 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; incline/path object must not be rewritten as vehicle boarding."
}
```

## D2 corpus. en-paired-connector-because-so → target fixture TBD

Source: `vn-interference-paired-connectors-D2.json`, candidate
`en-paired-connector-because-so` / `pairedConnectorBecauseSo`.

Gated on: Lane A adds a paired-connector rule:
sentence-initial `Because <clause>, so <clause>` → `Because <clause>, <clause>`.

**ACTIVATION positives** (abstain today → must fire once the new rule lands):
```json
{
  "id": "d2-because-so-pos-001",
  "input": "Because it rained, so I stayed home.",
  "expectedStatus": "corrected",
  "expectedCorrection": "Because it rained, I stayed home.",
  "expectedRuleFired": "en-paired-connector-because-so",
  "notes": "D2 corpus candidate en-paired-connector-because-so. ACTIVATE-AFTER: live engine 2026-06-02 abstains; drop redundant clause-initial 'so' after sentence-initial 'Because'."
}
```
```json
{
  "id": "d2-because-so-pos-002",
  "input": "Because he was tired, so he slept.",
  "expectedStatus": "corrected",
  "expectedCorrection": "Because he was tired, he slept.",
  "expectedRuleFired": "en-paired-connector-because-so",
  "notes": "D2 corpus candidate en-paired-connector-because-so. ACTIVATE-AFTER: live engine 2026-06-02 abstains; past-tense clause must be preserved while redundant 'so' is removed."
}
```
```json
{
  "id": "d2-because-so-pos-003",
  "input": "Because she is busy, so she cannot come.",
  "expectedStatus": "corrected",
  "expectedCorrection": "Because she is busy, she cannot come.",
  "expectedRuleFired": "en-paired-connector-because-so",
  "notes": "D2 corpus candidate en-paired-connector-because-so. ACTIVATE-AFTER: live engine 2026-06-02 abstains; modal clause must remain intact."
}
```

**VERIFY-NOW negatives** (already abstain; must keep abstaining after the new rule):
```json
{
  "id": "d2-because-so-neg-001",
  "input": "I was tired, so I went to bed because I needed rest.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I was tired, so I went to bed because I needed rest.",
  "expectedRuleFired": null,
  "notes": "D2 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; 'so' opens the main result clause and 'because' trails later, not a sentence-initial because...so pair."
}
```
```json
{
  "id": "d2-because-so-neg-002",
  "input": "He is so tired because of work.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "He is so tired because of work.",
  "expectedRuleFired": null,
  "notes": "D2 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; 'so' is an intensifier and 'because of' is prepositional."
}
```
```json
{
  "id": "d2-because-so-neg-003",
  "input": "She studied hard, so she passed.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "She studied hard, so she passed.",
  "expectedRuleFired": null,
  "notes": "D2 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; correct single result-'so' with no leading 'because'."
}
```

## D2 corpus. en-paired-connector-although-but → target fixture TBD

Source: `vn-interference-paired-connectors-D2.json`, candidate
`en-paired-connector-although-but` / `pairedConnectorAlthoughBut`.

Gated on: Lane A adds a paired-connector rule:
sentence-initial `Although/Though <clause>, but <clause>` →
`Although/Though <clause>, <clause>`.

**ACTIVATION positives** (abstain today → must fire once the new rule lands):
```json
{
  "id": "d2-although-but-pos-001",
  "input": "Although it rained, but I still went.",
  "expectedStatus": "corrected",
  "expectedCorrection": "Although it rained, I still went.",
  "expectedRuleFired": "en-paired-connector-although-but",
  "notes": "D2 corpus candidate en-paired-connector-although-but. ACTIVATE-AFTER: live engine 2026-06-02 abstains; drop redundant clause-initial 'but'."
}
```
```json
{
  "id": "d2-although-but-pos-002",
  "input": "Although he is rich, but he is not happy.",
  "expectedStatus": "corrected",
  "expectedCorrection": "Although he is rich, he is not happy.",
  "expectedRuleFired": "en-paired-connector-although-but",
  "notes": "D2 corpus candidate en-paired-connector-although-but. ACTIVATE-AFTER: live engine 2026-06-02 abstains; negated predicate must be preserved."
}
```
```json
{
  "id": "d2-although-but-pos-003",
  "input": "Although she was sick, but she came to work.",
  "expectedStatus": "corrected",
  "expectedCorrection": "Although she was sick, she came to work.",
  "expectedRuleFired": "en-paired-connector-although-but",
  "notes": "D2 corpus candidate en-paired-connector-although-but. ACTIVATE-AFTER: live engine 2026-06-02 abstains; past-tense clause must remain intact."
}
```

**VERIFY-NOW negatives** (already abstain; must keep abstaining after the new rule):
```json
{
  "id": "d2-although-but-neg-001",
  "input": "I tried, but I failed.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I tried, but I failed.",
  "expectedRuleFired": null,
  "notes": "D2 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; correct single contrastive 'but' with no leading 'although'."
}
```
```json
{
  "id": "d2-although-but-neg-002",
  "input": "Although it was hard, I finished.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "Although it was hard, I finished.",
  "expectedRuleFired": null,
  "notes": "D2 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; already-correct although clause with no redundant 'but'."
}
```
```json
{
  "id": "d2-although-but-neg-003",
  "input": "He said nothing but the truth.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "He said nothing but the truth.",
  "expectedRuleFired": null,
  "notes": "D2 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; 'but' means except, not a paired connector."
}
```

## D2 corpus. en-paired-connector-eventhough-but → target fixture TBD

Source: `vn-interference-paired-connectors-D2.json`, candidate
`en-paired-connector-eventhough-but` / `pairedConnectorEvenThoughBut`.

Gated on: Lane A adds a paired-connector rule:
sentence-initial `Even though <clause>, but <clause>` →
`Even though <clause>, <clause>`, ordered before the bare `though`/`although`
rule so the longest subordinator wins.

**ACTIVATION positives** (abstain today → must fire once the new rule lands):
```json
{
  "id": "d2-eventhough-but-pos-001",
  "input": "Even though I studied, but I failed.",
  "expectedStatus": "corrected",
  "expectedCorrection": "Even though I studied, I failed.",
  "expectedRuleFired": "en-paired-connector-eventhough-but",
  "notes": "D2 corpus candidate en-paired-connector-eventhough-but. ACTIVATE-AFTER: live engine 2026-06-02 abstains; drop redundant clause-initial 'but'."
}
```
```json
{
  "id": "d2-eventhough-but-pos-002",
  "input": "Though it was late, but she kept working.",
  "expectedStatus": "corrected",
  "expectedCorrection": "Though it was late, she kept working.",
  "expectedRuleFired": "en-paired-connector-eventhough-but",
  "notes": "D2 corpus candidate en-paired-connector-eventhough-but. ACTIVATE-AFTER: live engine 2026-06-02 abstains; bare though-branch of this rule-pack must remove redundant 'but'."
}
```
```json
{
  "id": "d2-eventhough-but-pos-003",
  "input": "Even though he apologized, but she was still angry.",
  "expectedStatus": "corrected",
  "expectedCorrection": "Even though he apologized, she was still angry.",
  "expectedRuleFired": "en-paired-connector-eventhough-but",
  "notes": "D2 corpus candidate en-paired-connector-eventhough-but. ACTIVATE-AFTER: live engine 2026-06-02 abstains; concessive clause must remain intact."
}
```

**VERIFY-NOW negatives** (already abstain; must keep abstaining after the new rule):
```json
{
  "id": "d2-eventhough-but-neg-001",
  "input": "Even though it was raining, we went outside.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "Even though it was raining, we went outside.",
  "expectedRuleFired": null,
  "notes": "D2 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; already-correct even-though clause with no redundant 'but'."
}
```
```json
{
  "id": "d2-eventhough-but-neg-002",
  "input": "I have nothing but a pen.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I have nothing but a pen.",
  "expectedRuleFired": null,
  "notes": "D2 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; 'but' means except, not a paired connector."
}
```
```json
{
  "id": "d2-eventhough-but-neg-003",
  "input": "It is not cheap but it is worth it.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "It is not cheap but it is worth it.",
  "expectedRuleFired": null,
  "notes": "D2 corpus guard boundary. VERIFY-NOW: live engine 2026-06-02 abstains; single contrastive 'but' with no leading though/even though."
}
```
