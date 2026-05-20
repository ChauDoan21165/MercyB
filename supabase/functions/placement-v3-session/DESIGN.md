# Placement V3 Session Orchestrator Design

This Edge Function is the single client entry point for placement v3:
`start`, `respond`, `abandon`, `resume`, and `status`. It owns session
lifecycle, prompt sequencing, grader invocation, persistence, resume policy,
failure recovery, and final profile assembly.

## State Machine

```text
                    start
  none ------------------------------+
                                      v
                              in_progress
                              /    |    \
             respond+next ---+     |     +--- abandon
                                   |              |
                                   |              v
                                   |          abandoned
                                   |
                                   +--- respond+final
                                            |
                                            v
                                        completed

  in_progress -- inactive >24h on start/respond/resume --> abandoned
  in_progress -- recoverable grader failure -------------> in_progress
                                                     with error metadata
  in_progress -- unrecoverable persistence failure ------> thrown 500/Sentry
  error -- resume ---------------------------------------> in_progress
  completed -- respond/status/resume --------------------> completed profile
  abandoned -- resume/respond ---------------------------> terminal refusal
```

Formal transition table:

| From | Action/event | To | Mutation |
| --- | --- | --- | --- |
| none | start | in_progress | insert session with first prompt |
| in_progress | respond and more evidence needed | in_progress | insert response, update prompt/index |
| in_progress | respond and stop rule met | completed | insert response, compute profile |
| in_progress | abandon | abandoned | set abandoned_at |
| in_progress | start with same user | in_progress | return existing prompt |
| in_progress | inactivity >24h | abandoned | set abandoned_at |
| in_progress | recoverable grader failure | in_progress | persist fallback assessment and error metadata |
| completed | status/respond/resume | completed | read-only |
| abandoned | status | abandoned | read-only |
| abandoned | resume/respond | abandoned | refuse |
| error | resume | in_progress | clear recoverable orchestration state |

Terminal states are terminal. `completed` can be read but cannot be mutated by a
late response. `abandoned` can be inspected but not resumed because a placement
attempt represents a coherent measurement window.

## 1. Modality Sequence

The default sequence is fixed:
`writing -> speaking -> reading -> listening -> conversation`. The first task is
writing because it gives the richest low-cost signal, works on every browser,
and has the most mature grader contract today. The conversation modality is
last because it checks integrated ability after the system has already gathered
separate production and reception evidence.

The function does not let users choose the order in v1. User choice sounds
friendly, but it makes calibration harder and encourages avoidance of weak
skills. It also complicates resume and UI state while A29/A30/A32 are building
in parallel. Adaptive skipping is allowed only when a modality has enough
confidence, not because the learner chose to avoid it.

## 2. Tasks Per Modality

The policy is hybrid: minimum one task per modality, maximum three, with
confidence-based early stopping. One task preserves breadth, so a user does not
receive a "B1" profile based only on writing unless other graders are degraded.
Three tasks cap fatigue and token cost.

Confidence-based stopping is used after the first task when average modality
confidence is at least `0.72`. Below that, the modality gets another prompt up
to the cap. This is stricter than a single fixed count but avoids pretending we
have full IRT calibration before prompt item statistics exist.

## 3. Adaptive Difficulty Within Modality

The session starts at A2 unless the caller supplies `initialLevel`. After each
assessment, the next target level is moved toward the observed CEFR. A confident
result one or more levels above the current target raises the next prompt by one
level; a confident result below lowers it by one level. Low-confidence results
average current and observed levels instead of making a hard jump.

The learning-science rationale is to keep the next task near the learner's
estimated ability. Large jumps create noisy frustration signals; random prompts
waste evidence because they test too far above or below the learner. The bounded
one-level move is conservative until the item bank has enough calibration data.

## 4. Cross-Modality Calibration

Each response produces `overallLevel` plus `confidence`. Per modality, CEFR is
converted to an ordinal (`A1=0 ... C2=5`) and averaged by response confidence.
Per-skill confidence is the average of the modality's response confidences.

Overall CEFR is a confidence-weighted average of the per-modality levels. This
means writing B1 at `0.8` and speaking A2 at `0.6` lands between them, leaning
toward writing. We do not use max-confidence because it hides uneven skills,
and we do not hard-code production versus reception weights yet because DET-like
placement should report the learner's real mixed profile, not a single vanity
level.

## 5. Stop Rule

The session ends when every modality is complete or when `MAX_TOTAL_TASKS` is
reached. Current constants are one to three tasks per modality and a global cap
of eleven tasks. The cap exists because five modalities at three tasks each
would be too long for mobile placement and too expensive if every answer uses
AI grading.

The stop rule intentionally separates "complete enough to profile" from
"perfectly measured". A placement product needs a useful starting level and
recommendations, not a psychometric exam report. The profile stores confidence
so downstream UI can say when evidence is thin.

## 6. Resume Policy

A session can resume if it is still `in_progress` and the last update is within
24 hours. The active prompt is stored in `metadata.lastPrompt`, so resume
returns the exact same task instead of reselecting a similar task.

After 24 hours, the session is marked abandoned. After seven days, operations
and UI should treat it as stale history and offer a fresh start. This protects
measurement coherence: a learner who answered two prompts last week may have
studied since then or forgotten the prompt context.

## 7. Concurrent Sessions

A user may have only one active `in_progress` placement session. If `start` is
called while a non-expired session exists, the function resumes the existing
session. This handles mobile double taps, reloads, background-tab retries, and
UI reconnects without fragmenting evidence.

The orchestrator also rejects duplicate response submission by `task_index`.
The database should eventually enforce uniqueness on `(session_id, task_index)`;
the function already treats a replay as idempotent and returns current state
without inserting another response.

## 8. Failure Recovery

Recoverable grader failures fail soft. Timeout, malformed JSON, HTTP failure,
or rate limit returns a deterministic fallback assessment with low confidence
and records an error in session metadata. The learner continues because the
core path is the placement session, not the availability of every grader.

Persistence failures fail hard. If the response row cannot be inserted, the
function must not advance the client state, because the UI would show a next
task without durable evidence. The Sentry wrapper captures the thrown error;
the client can call `status` or `resume` and receive the last persisted prompt.

## 9. Profile Completeness Threshold

The minimum meaningful profile is one scored response. If only writing exists,
the profile is still produced but confidence remains narrow and low. This is
better than losing the learner's work during grader degradation.

The target profile is one signal from each modality. `cefr_per_skill` exposes
which modalities contributed evidence, so A30 can render "based on writing
only" or "speaking evidence degraded" honestly. Recommendations use whatever
evidence exists and should prefer foundational lessons when confidence is low.

## 10. Token Budget Per Session

The orchestrator enforces a hard task cap and lets each grader enforce its own
model/token limits. The session-level cap is the main cost control because it
bounds the number of AI calls even if confidence stays low.

When a grader is rate-limited or unavailable, the function degrades to heuristic
grading rather than spending retries indefinitely. `errorRecovery.ts` marks only
the first timeout as retryable; rate limits and malformed JSON fall back
immediately. Operations should alert when fallback rate rises because quality
degrades even though sessions still complete.

## Integration Contracts

Writing grader: `placement-v3-grade-writing` is called over HTTP with prompt id,
prompt text, prompt CEFR, response text, user id, and session id. It returns an
assessment with `overallLevel`, `confidence`, optional criteria, strengths,
gaps, and `l1InterferenceFlags`.

Speaking, reading, listening, and conversation graders: `graderClient.ts`
defines typed contracts and currently uses deterministic stubs for unavailable
modalities. A29/A32 can replace the stub boundary without changing scoring or
persistence if they return the same `CEFRAssessment` shape.

Storage: the function reads and writes `placement_v3_sessions`,
`placement_v3_responses`, and `placement_v3_profiles`. `persistence.ts`
documents every query in code and keeps row mapping local so unmerged schema
branches do not leak through the orchestration logic.

Prompt library and recommender: `modality.ts` has stable temporary prompt ids
until `src/data/placement/v3/prompts/` is importable from the Edge Function.
`persistence.ts` uses `recommendLessonsStub` until
`src/lib/placement/v3/recommender.ts` is available in this branch.
