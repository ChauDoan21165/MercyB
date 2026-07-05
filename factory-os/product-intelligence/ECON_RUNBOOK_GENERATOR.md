# ECON Runbook Generator

Builds one executable runbook package from one ExecutionContract.

The runbook includes:
- baseline capture instruction
- bounded worker prompt
- final state collection
- ECON boundary validation
- independent Judge prompt
- final PASS/FAIL handoff

Purpose:
- remove manual relay between stages
- keep F worker, Judge, and orchestrator aligned to one ECON
- preserve dirty-repo safety
- prevent worker self-certification

Boundary:
- Factory OS only
- no runtime readiness claim
- no product capability verified claim
- no merge, push, deploy, or verified marking
