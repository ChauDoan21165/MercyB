# Runner Execution Gate v1

Decides whether one Single Objective Runner is allowed to execute.

Checks:
- queue item is queue_ready
- package is package_ready
- one-objective lock is active
- ECON exists with baseCommit and baselineModifiedFiles
- WorkerPrompt exists
- JudgePrompt exists
- EconRunbook exists
- no merge/push/deploy authority
- F worker cannot mark verified
- implementation and Judge have not already executed

Boundary:
- decision only
- no implementation execution
- no Judge execution
- no runtime readiness claim
- no product capability verified claim
- no merge, push, deploy, or verified marking
