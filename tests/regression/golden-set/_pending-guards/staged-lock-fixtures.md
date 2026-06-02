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
