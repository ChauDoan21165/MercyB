# Worker Prompt Generator

Generates one bounded F-worker implementation prompt from one ExecutionContract.

Purpose:
- remove manual relay from Chau
- preserve PCAP/PFLOW
- give F worker the same allowed/forbidden file scope as Judge
- require final report output
- prevent F worker from marking verified

Boundary:
- Factory OS only
- no runtime readiness claim
- no product capability verified claim
- worker prompt only; no implementation work
