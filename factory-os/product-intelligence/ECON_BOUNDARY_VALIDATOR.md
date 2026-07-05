# ECON Boundary Validator

Classifies final repository changes against one ExecutionContract.

Categories:
- allowedNewWork
- preExistingDirtyFiles
- forbiddenDrift
- outOfScopeContamination

Purpose:
- prevent false attribution in dirty repositories
- separate worker changes from baseline dirtiness
- give Judge deterministic pass/fail boundary evidence

Boundary:
- Factory OS only
- no runtime readiness claim
- no product capability verified claim
- no implementation work
