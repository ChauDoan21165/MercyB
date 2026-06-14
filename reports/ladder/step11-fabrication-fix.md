# Step 11 Fabrication Fix

## Done

- Started from `origin/main` and inspected `origin/ladder/step11-vietlish-rulepack`.
- Removed the unsafe live correction rule `repairYesterdayInviteDinnerRunOn` and its rule entry `en-yesterday-invite-dinner-runon`.
- Deleted `tests/regression/golden-set/correction-rules/yesterday-invite-dinner-runon.json` because it asserted canned invented output: dinner, smoked cigars, and fun.
- Replaced the unit assertion with a regression guard proving the yesterday invite run-on does not emit the removed rule id or the canned fabricated sentences.
- Preserved the existing safe Step 11 connector rules `repairAlthoughEvenThoughBut` and `repairBecauseSoDoubling`; they only delete redundant learner-supplied connector words.

## Not done

- Did not apply the newer flagged awkward rulepack from `origin/ladder/step11-vietlish-rulepack`. Its reviewed examples substitute or insert words such as `use` and `I`, so it is outside this branch's strict rule: corrections may only restructure learner-supplied words or abstain.

## Verification

- `npm test -- src/lib/tutor/__tests__/correctionEngine.test.ts`
- Result: pass, 1 test file passed, 583 tests passed.

## Merge risk

- Low to medium. This removes one narrow live correction and one active golden fixture, so the main behavior change is that the unsafe yesterday invite run-on no longer gets a bespoke fabricated rewrite. Generic learner-preserving correction behavior remains available where existing rules can safely handle it.
