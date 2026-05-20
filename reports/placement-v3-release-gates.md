# Placement V3 Release Gates

Canonical release checklist for Placement V3. Update this file as evidence changes. A checked or passing implementation gate does not imply launch approval unless all critical runtime gates are also satisfied.

Status values: `met`, `partial`, `blocked`, `not started`.
Severity values: `critical`, `high`, `medium`, `low`.

## Merged Prerequisites

| Gate | Status | Evidence source | Blocking severity | Owner | Next action |
|---|---|---|---|---|---|
| Native mobile speaking capture hardening merged | met | PR #941; `reports/placement-v3-readiness-evidence/pr-941.json` | high | Mobile/runtime owner | Runtime-test on real iOS and Android devices before any user enablement. |
| Placement V3 vertical integration merged behind flags | met | PR #942; `reports/placement-v3-readiness-evidence/pr-942.json` | critical | Placement V3 owner | Keep flags off until runtime gates pass. |
| Shared test harness stabilized | partial | PR #947 is open/green; `reports/placement-v3-readiness-evidence/pr-947.json` | high | Test infrastructure owner | Merge #947 before more live Placement V3 evidence work. |
| Canonical release decision record exists | partial | PR #949; this file and `reports/PLACEMENT-V3-POST-MERGE-READINESS-2026-05-20.md` | medium | Report agent | Keep this package updated as blockers clear. |

## CI Prerequisites

| Gate | Status | Evidence source | Blocking severity | Owner | Next action |
|---|---|---|---|---|---|
| PR #949 CI green | met | PR #949; `reports/placement-v3-readiness-evidence/pr-949.json` | medium | Report agent | Maintain green CI for report updates. |
| Local typecheck passes | met | `typecheck.log`, `final-typecheck.log`, `followup-typecheck.log` | high | Engineering | Continue rerunning after report changes. |
| Local build passes | met | `build.log`, `final-build.log`, `followup-build.log` | high | Engineering | Continue rerunning after report changes. |
| Lint exits 0 | met | `lint.log` | medium | Engineering | Keep existing warnings from growing. |
| Placement V3 vertical E2E default-off gate verified | met | `e2e-failure-analysis.md`; `e2e-reruns/run-1-normal/output-after-browser-install.log` | high | Test infrastructure owner | Keep default-off routing covered. |
| Placement V3 mocked vertical path passes with explicit flags | met | `e2e-failure-analysis.md`; `e2e-reruns/run-2-explicit-flags/output.log`; `e2e-reruns/run-3-explicit-flags-trace-on/output.log` | high | Test infrastructure owner | Make the harness fail fast on stale port 3107 / unknown Vite env. |
| New test stability work is mergeable | blocked | PR #950 Build and Test failure; `reports/placement-v3-readiness-evidence/pr-950.json` | high | Test infrastructure owner | Fix #950 CI before using it as a launch prerequisite. |

## Runtime Validation Prerequisites

| Gate | Status | Evidence source | Blocking severity | Owner | Next action |
|---|---|---|---|---|---|
| Production-like Supabase session start/respond/resume verified | blocked | No live Supabase migrated-session evidence in #949 | critical | Backend owner | Run a real internal session against deployed Supabase with flags explicitly enabled in a safe environment. |
| Real writing grader path verified end-to-end | partial | #942 wiring; no live production grader evidence in this report | critical | AI grading owner | Run live writing grading with real credentials and save sanitized request/response evidence. |
| Real speaking/reading/listening grading verified | blocked | A29 modalities not proven; fallback/stub paths only | critical | Placement modality owner | Merge or validate real graders, or explicitly document fallback limitation for internal-only testing. |
| Mercy conversation grading verified live | partial | #942 wiring; no production runtime evidence in this report | high | AI grading owner | Run live Mercy conversation grading and save sanitized evidence. |
| Route flags remain default-off | met | `flag-audit.md`; `src/lib/featureFlags.ts`; `src/router/AppRouter.tsx` | critical | Release owner | Do not flip `VITE_PLACEMENT_TEST_ENABLED` or `VITE_PLACEMENT_V3_UI_ENABLED` before gate review. |

## Benchmark Prerequisites

| Gate | Status | Evidence source | Blocking severity | Owner | Next action |
|---|---|---|---|---|---|
| Benchmark infrastructure exists | partial | PR #944 | high | Benchmark owner | Keep #944 draft until live blockers clear. |
| 25+ live benchmark sessions completed | blocked | #944 hard gate: 0/25 live sessions | critical | Benchmark owner | Set required env vars and run live matrix. |
| 3 optimization cycles completed | blocked | #944 hard gate: 0/3 cycles | critical | Benchmark owner | Run baseline, one optimization at a time, rerun, and document deltas. |
| p95 latency measured by modality | blocked | No live p95 metrics | critical | Benchmark owner | Persist p50/p95 per modality and full session. |
| Cost/session measured for OpenAI-primary and Gemini-failover paths | blocked | No live cost metrics | critical | Benchmark owner | Capture token counts, provider routes, and estimated USD/session. |
| Provider failover measured | blocked | No live failover evidence | critical | Benchmark owner | Simulate provider failure and record recovery rate. |

## Drift Replay Prerequisites

| Gate | Status | Evidence source | Blocking severity | Owner | Next action |
|---|---|---|---|---|---|
| Drift replay harness exists | partial | PR #943 | high | Drift owner | Keep draft until real replay evidence exists. |
| Live drift replay completed | blocked | No live drift metrics | critical | Drift owner | Run replay corpus with real/current grader configuration. |
| CEFR instability quantified | blocked | No drift replay output | critical | AI grading owner | Report level-change rate and unacceptable movement cases. |
| Grading regression thresholds defined | partial | PR #943 scaffold intent | high | AI grading owner | Define hard thresholds before launch. |

## Native Audio Prerequisites

| Gate | Status | Evidence source | Blocking severity | Owner | Next action |
|---|---|---|---|---|---|
| Native permission config audited | met | #941; `docs/placement-v3/native-audio/native-permission-audit.md` | high | Mobile owner | Keep config under review as Capacitor changes. |
| iOS real-device speaking capture verified | blocked | No native runtime evidence | critical | Mobile owner | Test microphone permission, recording, upload, and fallback on real iPhone. |
| Android real-device speaking capture verified | blocked | No native runtime evidence | critical | Mobile owner | Test microphone permission, recording, upload, and fallback on real Android. |
| Azure phoneme scoring verified through Placement V3 path | blocked | No runtime Azure scoring evidence | critical | Pronunciation owner | Run live speaking task through Azure scoring and save sanitized trace. |

## Adaptive Generation Prerequisites

| Gate | Status | Evidence source | Blocking severity | Owner | Next action |
|---|---|---|---|---|---|
| Adaptive generation scaffold exists | partial | PR #946 | medium | Adaptive generation owner | Keep draft. |
| Candidate generation hard gates pass | blocked | PR #946: 59/90 candidates, 4 accepted items, tuned run stopped on `fetch failed` | high | Adaptive generation owner | Resolve fetch instability and quality-gate failures. |
| Generated items approved for launch corpus | blocked | #946 hard gates failed | high | Content/assessment owner | Human-review accepted generated items before any user exposure. |

## Observability Prerequisites

| Gate | Status | Evidence source | Blocking severity | Owner | Next action |
|---|---|---|---|---|---|
| Runtime observability tooling proposed | partial | PR #953 draft; `reports/placement-v3-readiness-evidence/pr-953.json` | high | Observability owner | Finish #953 CI and define required dashboards/events. |
| Session-level event logging verified live | blocked | No live production observability evidence | critical | Observability owner | Prove session start/respond/complete/error events persist and can be queried. |
| Provider/token/cost logging verified live | blocked | No live benchmark evidence | critical | Observability + benchmark owners | Capture provider, model, token count, retries, and cost estimate. |
| Alerting thresholds defined | not started | No alert runbook in #949 | high | Release owner | Define latency, failure, cost, and drift alert thresholds before internal enablement. |

## Rollback Prerequisites

| Gate | Status | Evidence source | Blocking severity | Owner | Next action |
|---|---|---|---|---|---|
| Kill switch exists via flags | met | `flag-audit.md`; `PlacementV3Gate` | critical | Release owner | Keep both flags default-off and document exact rollback env changes. |
| Rollback trigger list exists | partial | `reports/placement-v3-launch-scenarios.md` | high | Release owner | Convert scenario rollback triggers into a runbook before enablement. |
| Data cleanup policy defined for test sessions | blocked | No cleanup runbook in #949 | medium | Backend owner | Define how to identify and clean internal/test Placement V3 sessions. |
| Incident owner and escalation path assigned | not started | No release ops assignment in #949 | high | Chau / release owner | Assign launch-day DRI before any internal enablement. |
