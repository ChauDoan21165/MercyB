# Verified Accounting Gate v1

Converts a valid JudgeResultContract PASS into a verification review recommendation.

It does not mark verified.

Required before recommendation:
- Judge verdict PASS
- boundary validation passed
- execution result contract passed
- tests passed
- evidence passed
- Judge has no verified/merge/deploy/runtime-readiness authority

Boundary:
- does not mark verified
- does not claim runtime readiness
- does not claim product capability verified
- does not merge/push/deploy
- requires an external accounting rule before anything is counted
