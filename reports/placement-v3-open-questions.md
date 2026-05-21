# Placement V3 Open Questions

Canonical unresolved-question log for Placement V3 release readiness. Close a question only with linked evidence.

## Grading Accuracy

| Question | Current answer | Blocking severity | Evidence needed | Owner | Next action |
|---|---|---|---|---|---|
| Does the writing grader produce trustworthy CEFR estimates for Vietnamese learners? | Not proven in live production-like runs. | critical | Sanitized live grading samples, expected CEFR review, drift replay output. | AI grading owner | Run live writing benchmark and review output by CEFR band. |
| Does Mercy conversation grading align with the placement rubric? | Wired, but live behavior not proven. | high | Live conversation transcripts and grader outputs reviewed against expectations. | AI grading owner | Run live conversation grading and save sanitized evidence. |
| Are speaking/reading/listening graded by real modality graders or fallback heuristics? | Fallback/stub risk remains. | critical | A29 modality implementation evidence or explicit limitation acceptance. | Placement modality owner | Verify A29 availability or keep these modalities out of launch claims. |

## CEFR Calibration

| Question | Current answer | Blocking severity | Evidence needed | Owner | Next action |
|---|---|---|---|---|---|
| How stable is CEFR placement across repeated runs? | Unknown. | critical | Drift replay metrics and repeated-run comparisons. | Drift owner | Run #943 replay against current graders. |
| What CEFR movement should trigger launch rollback? | Not defined. | high | Drift thresholds and rollback policy. | Release owner + AI grading owner | Define unacceptable CEFR movement before invite-only launch. |
| Are band-specific prompts calibrated for A1-C1 users? | Not proven by live benchmark. | high | Benchmark sessions by CEFR band and human review. | Assessment owner | Add band-by-band review to benchmark methodology. |

## Speaking Reliability

| Question | Current answer | Blocking severity | Evidence needed | Owner | Next action |
|---|---|---|---|---|---|
| Does native/mobile microphone capture work consistently? | Unknown. Static permission audit only. | critical | Real-device iOS and Android test traces. | Mobile owner | Test on physical devices. |
| Does Azure phoneme scoring work through the Placement V3 speaking path? | Unknown. | critical | End-to-end speaking task with Azure scoring trace. | Pronunciation owner | Run a live speaking task through Azure. |
| Is typed fallback acceptable when microphone fails? | Product decision unresolved. | high | Explicit internal-only limitation or real fallback UX validation. | Product/release owner | Decide before any speaking exposure. |

## Native Runtime Behavior

| Question | Current answer | Blocking severity | Evidence needed | Owner | Next action |
|---|---|---|---|---|---|
| Does Capacitor permission behavior match the web test path? | Unknown. | critical | iOS/Android runtime traces. | Mobile owner | Test permission prompts, denial, retry, and capture. |
| Are audio files/transcripts stored with acceptable privacy controls? | Not proven. | high | Storage path, retention, deletion, and redaction evidence. | Backend/privacy owner | Audit audio/transcript persistence before external users. |

## Provider Failover

| Question | Current answer | Blocking severity | Evidence needed | Owner | Next action |
|---|---|---|---|---|---|
| Does OpenAI-primary routing recover to Gemini on provider failure? | Unknown. | critical | Failover scenario logs with provider names, retries, and success rate. | Benchmark owner | Run #944 provider-failover scenario after env setup. |
| What is the failover recovery target? | Proposed target from original benchmark task was >95%, but not measured. | critical | Measured failover recovery rate. | Release owner | Keep as blocker until measured. |
| Does failover change CEFR scoring materially? | Unknown. | high | Same-response grading comparison across provider paths. | AI grading owner | Include provider comparison in drift replay. |

## Replay Drift

| Question | Current answer | Blocking severity | Evidence needed | Owner | Next action |
|---|---|---|---|---|---|
| Can historic/current responses be replayed safely? | Not proven. | high | Shadow/replay readiness and privacy process. | Drift/shadow owner | Use #952 as planning input; do not claim replay evidence yet. |
| What drift rate is acceptable before launch? | Not defined. | critical | Thresholds approved by release owner. | Release owner | Define pass/fail criteria for #943. |

## Cost Envelope

| Question | Current answer | Blocking severity | Evidence needed | Owner | Next action |
|---|---|---|---|---|---|
| What is average and p95 cost/session? | Unknown. | critical | 25+ live sessions with token/provider logs. | Benchmark owner | Run #944 live benchmark after env setup. |
| How expensive are OpenAI-primary vs Gemini-failover paths? | Unknown. | critical | Separate cost estimates by provider route. | Benchmark owner | Include provider-specific costing in benchmark report. |
| What launch concurrency is safe for budget? | Unknown. | critical | Cost/session plus expected traffic and concurrency model. | Release owner | Do not set launch concurrency until live cost exists. |

## Scaling Risk

| Question | Current answer | Blocking severity | Evidence needed | Owner | Next action |
|---|---|---|---|---|---|
| What is p95 full-session latency under realistic flows? | Unknown. | critical | Live benchmark p50/p95 by flow and modality. | Benchmark owner | Run beginner/intermediate/advanced/speaking-heavy/Mercy scenarios. |
| Which step is the worst bottleneck? | Unknown. | high | Per-step latency traces. | Benchmark owner | Use #944 latency analyzer after live runs. |
| What concurrency limit should launch use? | Unknown. | critical | Benchmark cost/latency plus provider quota review. | Release owner | Keep launch concurrency undefined until live evidence exists. |
