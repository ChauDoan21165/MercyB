# Execution Contract Generator

Converts one bounded EngineeringObjective into one machine-readable ExecutionContract.

Purpose:
- preserve baseline commit
- preserve baseline modified-file set
- define allowed and forbidden files
- give workers and Judge the same source of truth
- prevent false attribution when the repository was already dirty

Boundary:
- Factory OS only
- no runtime readiness claim
- no product capability verified claim
- no implementation before ECON
- one objective at a time
