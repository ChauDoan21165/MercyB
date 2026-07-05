# Execution Result Contract v1

Defines the only valid shape for F-worker output.

Required fields:
- sourceObjectiveId
- PCAP
- PFLOW
- worker status: worker_done or worker_failed
- changedFiles
- testsRun
- evidencePaths
- boundaryClaims
- workerAuthority

Hard rules:
- worker cannot mark verified
- worker cannot merge/push/deploy
- Judge is required
- no runtime readiness claim
- no product capability verified claim
- no merge/push/deploy claim

Purpose:
- give Judge a structured result to validate before judging product evidence
- prevent F-worker self-certification
- preserve PCAP/PFLOW identity
