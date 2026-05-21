# Placement V3 Known Risks

Canonical risk register for Placement V3. This is intentionally conservative: a risk remains open until live evidence closes it.

## Technical Risks

| Risk | Current assessment | Evidence | Severity | Mitigation / next action |
|---|---|---|---|---|
| Edge-function deployment packaging may not match local TypeScript imports | The session edge function imports app-side recommender code; packaging still needs deployment review. | #942; `reports/PLACEMENT-V3-POST-MERGE-READINESS-2026-05-20.md` | high | Deploy to a safe Supabase environment and verify `placement-v3-session` start/respond/status. |
| E2E harness can be polluted by stale Vite server state | Confirmed local harness issue; original failure came from Vite disconnect / chunk fetch failure. | `e2e-failure-analysis.md` | medium | Make Playwright fail fast when port 3107 is occupied by unknown env; run clean dev server for Placement tests. |
| Test stability work is not yet merged | #947 is green but open; #950 is blocked by Build and Test failure. | `pr-947.json`, `pr-950.json` | high | Merge #947 first; fix #950 before treating it as release evidence. |
| A29 modality paths are incomplete or fallback-only | Speaking, reading, listening are not proven with real graders. | #949 report | critical | Validate or merge real modality graders before non-staff enablement. |

## Operational Risks

| Risk | Current assessment | Evidence | Severity | Mitigation / next action |
|---|---|---|---|---|
| No launch-day DRI or incident runbook recorded | Release ownership is not yet operationalized. | #949 report package | high | Assign owner, escalation path, and rollback authority. |
| Draft PR stack can be mistaken for launch evidence | #943/#944/#946/#951/#953 are draft or blocked; #952 is docs/readiness, not runtime proof. | `placement-v3-evidence-index.md` | high | Require the release gates file before any flag change. |
| Staff/internal test data cleanup is undefined | Test sessions may persist without a cleanup policy. | #949 report package | medium | Define test session tagging and cleanup SQL/process. |

## AI Grading Risks

| Risk | Current assessment | Evidence | Severity | Mitigation / next action |
|---|---|---|---|---|
| Writing grading is wired but not production-calibrated here | The path exists, but live grading accuracy evidence is missing. | #942; #949 report | critical | Run benchmark and drift replay with real AI outputs and sanitized examples. |
| Conversation grading live behavior is unproven | Mercy conversation is wired but lacks live runtime evidence. | #942; #949 report | high | Run live conversation grading and inspect scoring consistency. |
| Stub/fallback scoring may be misread as real placement | Non-writing/non-conversation paths can fall back to stub heuristics. | #949 report | critical | Label fallback limitation clearly and block public launch until real graders exist. |
| Provider behavior under failure is unknown | No live failover recovery metric. | #944 hard gates not met | critical | Simulate provider failures and record recovery success rate. |

## Calibration Risks

| Risk | Current assessment | Evidence | Severity | Mitigation / next action |
|---|---|---|---|---|
| CEFR accuracy is not validated against a replay corpus | No live drift replay metrics. | #943 draft; #949 report | critical | Run drift replay and review CEFR movement by band and modality. |
| Grading consistency across repeated runs is unknown | No repeated live scoring evidence. | #943/#944 drafts | critical | Run repeat-set grading and compare CEFR stability/confidence. |
| Adaptive generation quality gates failed | Generated candidates are not ready as launch corpus. | #946 | high | Keep generated items out of production until hard gates pass and human review completes. |

## Privacy Risks

| Risk | Current assessment | Evidence | Severity | Mitigation / next action |
|---|---|---|---|---|
| Raw benchmark/drift artifacts may include learner content | Live artifact process is not yet exercised. | #944/#943 drafts | high | Sanitize raw AI responses and transcripts before committing evidence. |
| Native audio handling is not runtime validated | Microphone capture/upload/scoring privacy posture is not proven in Placement V3 runtime. | #941 static audit only | critical | Validate real-device permission, storage path, retention, and deletion behavior. |
| Shadow/replay capture is not implemented as proof | Shadow replay evidence is absent/parked. | #945 closed blocker-only; #952 readiness report | high | Define capture consent, redaction, retention, and replay boundaries before collection. |

## Cost Risks

| Risk | Current assessment | Evidence | Severity | Mitigation / next action |
|---|---|---|---|---|
| Session cost envelope is unknown | No live token/cost metrics. | #944 hard gates: no cost metrics | critical | Run 25+ live sessions and estimate OpenAI-primary + Gemini-failover costs. |
| Worst-case retries/failover cost is unknown | No failover benchmark evidence. | #944 hard gates | critical | Include degraded-provider scenarios in benchmark run. |
| Adaptive generation can create uncontrolled spend | #946 run stopped on fetch failure and did not meet acceptance goals. | #946 | high | Keep generation offline/draft until budgets and caps are proven. |

## Runtime Risks

| Risk | Current assessment | Evidence | Severity | Mitigation / next action |
|---|---|---|---|---|
| Full-session latency is unknown | No p95 session latency. | #944 hard gates | critical | Run live benchmark matrix and record p50/p95 by step/modality. |
| Native speaking may fail on real devices | Static permission audit exists, runtime does not. | #941; #949 report | critical | Test iOS and Android real devices with Azure path. |
| Live Supabase/RLS behavior is unproven for Placement V3 session flow | Local mocked E2E bypasses real Supabase runtime. | `e2e-failure-analysis.md` | critical | Run deployed edge function with real auth/session credentials in a safe environment. |

## Release-Management Risks

| Risk | Current assessment | Evidence | Severity | Mitigation / next action |
|---|---|---|---|---|
| Flags could be enabled before evidence gates clear | Flags are default-off, but launch discipline is the control. | `flag-audit.md` | critical | Require release-gate review before any env flag change. |
| Green CI may be confused with production readiness | CI proves build/test health, not runtime cost/latency/drift/native evidence. | #949 CI green; #949 report | high | Keep DO NOT ENABLE until critical runtime gates pass. |
| Draft PRs may drift from main before merge | Several Placement V3 PRs are draft/blocked. | `placement-v3-evidence-index.md` | medium | Rebase and rerun evidence after each prerequisite merge. |
