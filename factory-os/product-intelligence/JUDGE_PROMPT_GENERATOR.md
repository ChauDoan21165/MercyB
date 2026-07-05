# Judge Prompt Generator

Generates one independent Judge prompt from one ExecutionContract.

Purpose:
- separate Judge from F worker
- force ECON boundary validation
- require tests and evidence
- reject worker self-certification
- emit PASS/FAIL only with evidence

Boundary:
- Factory OS only
- no runtime readiness claim
- no product capability verified claim
- no merge, push, deploy, or verified marking
