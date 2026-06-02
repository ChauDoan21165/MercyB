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
```json
{
  "id": "profession-article-neg-lock-title-propername",
  "input": "He is doctor Smith.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "He is doctor Smith.",
  "expectedRuleFired": null,
  "notes": "Lock (title guard): 'doctor Smith' is a title + proper name; no article. Rule must not insert 'a'."
}
```

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
```json
{
  "id": "look-at-pronoun-neg-lock-idiom-eye",
  "input": "Look him in the eye.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "Look him in the eye.",
  "expectedRuleFired": null,
  "notes": "Lock (idiom guard): 'look someone in the eye' takes a bare object; no 'at'. Rule must not fire on the 'in the eye(s)' frame."
}
```

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
