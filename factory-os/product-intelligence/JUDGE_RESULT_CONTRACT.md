# Judge Result Contract v1

Defines the only valid structured output for an independent Judge.

Valid verdicts:
- PASS
- FAIL

PASS requires:
- boundaryValidationPass
- resultContractPass
- testsPass
- evidencePass

Hard authority limits:
- Judge cannot mark verified
- Judge cannot merge/push/deploy
- Judge cannot claim runtime readiness
- Judge cannot claim product capability verified
- Judge may only recommend verification after PASS

Purpose:
- make final gate machine-readable
- prevent Judge overclaiming
- separate PASS recommendation from verified accounting
