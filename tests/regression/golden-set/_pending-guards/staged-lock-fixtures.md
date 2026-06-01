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

## 1. en-step6-possessive-s → `correction-rules/possessive-s.json`
```json
{
  "id": "possessive-s-neg-lock-verb-sense",
  "input": "My sister phone me yesterday.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "My sister phone me yesterday.",
  "expectedRuleFired": null,
  "notes": "Lock (verb-sense guard): 'phone' is the verb (phoned), not a possessed object; possessive-s must not fire."
}
```

## 2. en-l4-missing-singular-article → `correction-rules/missing-singular-article.json`
```json
{
  "id": "missing-article-neg-lock-verb-sense",
  "input": "I want book a room.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I want book a room.",
  "expectedRuleFired": null,
  "notes": "Lock (verb-sense guard): 'book' is the verb (to book a room); article rule must not fire."
}
```

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

## 10. en-l4-quantity-plural-s → `correction-rules/quantity-plural-s.json` — **LOW (wave 2, verb-sense)**
```json
{
  "id": "quantity-plural-neg-lock-verb-sense",
  "input": "I want some book a room.",
  "expectedStatus": "unchanged",
  "expectedCorrection": "I want some book a room.",
  "expectedRuleFired": null,
  "notes": "Lock (verb-sense guard): 'book' is the verb (to book a room), not a quantified noun; quantity-plural must not pluralize it. LOW severity / low-plausibility surface — folds into the shared verb-sense guard (#1/#2)."
}
```
