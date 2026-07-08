TO: Lane A (correction engine — src/lib/tutor/**)
FROM: C4
SUBJECT: Known precision bug still live — say-tell-person Vietlish rule

C4 does not edit src/lib/tutor/** (Lane A owns it). Flagging for your queue.

The `say-tell-person` Vietlish correction rule was noted as a known precision bug
(previously flagged, unfixed). Confirmed still present on main:
- src/lib/tutor/vietlishCuratedLogic.ts:112  (id: "say-tell-person")
- src/lib/tutor/correctionRules/en.ts:1816    (id: "en-vietlish-say-tell-person")
- tests in src/lib/tutor/__tests__/vietlishCuratedLogic.test.ts,
  correctionExperienceEnricher.test.ts

This is flagship-moat territory (VN↔EN correction depth). If the rule is over-firing
or mis-correcting, it directly affects the differentiator vs Duolingo. Recommend Lane A
review the rule's precision: confirm ≥3 positives / ≥2 confusable negatives hold, and
whether a failing test exists for the known false-positive case.

C4 is not fixing this — routed to the owning lane per lane boundaries.
