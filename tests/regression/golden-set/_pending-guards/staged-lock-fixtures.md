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

## 3. en-yesterday-irregular-beginner-past → `correction-rules/has-past-time-marker.json`
```json
{
  "id": "yesterday-irregular-neg-lock-do-question",
  "input": "Did you go yesterday?",
  "expectedStatus": "unchanged",
  "expectedCorrection": "Did you go yesterday?",
  "expectedRuleFired": null,
  "notes": "Lock (question/do-support guard, reuse !304): base verb is correct in a did-question; rule must not rewrite go->went."
}
```
_(Also stage `Where did you go yesterday?` as `-neg-lock-wh-question` once the guard lands.)_

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
```json
{
  "id": "wait-for-person-object-neg-lock-phrasal-out",
  "input": "Wait them out.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "Wait them out.",
  "expectedRuleFired": null,
  "notes": "Lock (phrasal guard): 'wait them out' is a phrasal idiom; no 'for'. Rule must not fire when 'out'/'up' follows the pronoun."
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
```json
{
  "id": "calque-take-medicine-neg-lock-tablet-confection",
  "input": "I eat a tablet of chocolate.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I eat a tablet of chocolate.",
  "expectedRuleFired": null,
  "notes": "Lock (whitelist trim): 'tablet of chocolate' is a confection, not medicine; 'eat' is correct. Rule must not rewrite eat->take."
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

## 9. en-step6-at-clock-time → `correction-rules/at-clock-time.json` — **LOWEST severity (optional)**
```json
{
  "id": "at-clock-time-neg-lock-invalid-time",
  "input": "We meet 25:00.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "We meet 25:00.",
  "expectedRuleFired": null,
  "notes": "Lock (range-bound trim): '25:00' is not a valid clock time; rule must not insert 'at'. LOWEST severity — score/ratio colon forms (3:0, 2:1, 5:4) do NOT reproduce (zero rules fired); clock-only. Optional trim, no broken-output harm; activate if Lane A range-bounds the pattern."
}
```

## 11. en-hat-biking-summer-runon → pass-through locks (RETIREMENT dependency)

**Different kind of lock — a RETIREMENT pass-through, not a guard.** See
`docs/ops/stub-rule-generalize-or-retire.md`: this rule has a broad keyword
matcher with **canned, fabricating** output (a bike input becomes a hat
sentence). Recommendation there is **RETIRE**. These three inputs each fire
**only** `en-hat-biking-summer-runon` today (verified live) and currently get
fabricated output; after retirement they must **pass through unchanged**.

**Dependency:** commit these only once **Lane A retires `en-hat-biking-summer-runon`**
(per the !324 decision). Until then they fire and would fail the suite.

**Target fixture — note the schema caveat:** there is no existing
`hat-biking-summer-runon.json`, and a *retired* rule has **no positives**, so it
can't form a standard rule-centric golden fixture (which requires ≥3 positive).
Place these as a **pass-through regression** instead: either a small
`tests/regression/.../*.test.ts` asserting each input is returned unchanged, or a
dedicated retirement fixture if the harness grows a "retired-rule pass-through"
shape. Do **not** force them into a rule-centric fixture. Re-probe each post-
retirement to confirm no *other* rule now fires (today only hat-biking does).

```json
{
  "id": "hat-biking-retire-lock-bike-summer",
  "input": "I bought a bike yesterday, summer is hot.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I bought a bike yesterday, summer is hot.",
  "expectedRuleFired": null,
  "notes": "Retirement pass-through: today fabricates 'I bought a HAT ...summer is coming, ...very sunny.' (bike->hat). After retiring en-hat-biking-summer-runon, must pass through unchanged."
}
```
```json
{
  "id": "hat-biking-retire-lock-bicycle-canada",
  "input": "They bought a bicycle yesterday in Canada.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "They bought a bicycle yesterday in Canada.",
  "expectedRuleFired": null,
  "notes": "Retirement pass-through: today fabricates 'I bought a HAT ...very sunny in Canada.' (wrong subject they->I, wrong object bicycle->hat). After retirement, unchanged."
}
```
```json
{
  "id": "hat-biking-retire-lock-hat-sunny",
  "input": "I bought a hat yesterday because it is sunny.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I bought a hat yesterday because it is sunny.",
  "expectedRuleFired": null,
  "notes": "Retirement pass-through: a plausible, grammatical learner sentence (not a run-on) that today gets fabricated content ('summer is coming'). After retirement, must pass through unchanged."
}
```
