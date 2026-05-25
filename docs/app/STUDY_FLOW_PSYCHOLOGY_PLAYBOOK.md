# Study Flow Psychology Playbook

This playbook defines how MercyB should design and test study flows using learning science and safe product data. The goal is to stop guessing what feels good and prove what helps learners start, finish, retry, and return.

## Core Formula

Better study flow comes from:

```text
Learning science
+ safe user behavior data
+ small experiments
+ retention/completion results
= better study flow
```

Learning science gives the first design direction. Safe behavior data and small experiments prove whether that direction actually helps learners.

## Psychology Principles

### 1. Low Cognitive Load

Learners should see one clear next action before they see a complex system.

- Show one obvious primary action.
- Do not show too many choices first.
- Avoid complex UI before the learner starts.
- Delay advanced controls until they are useful.

### 2. Learn By Doing

The learner should answer, speak, choose, or retry quickly.

- Do not start with long explanations.
- Put the learner into action early.
- Keep the first task small enough to complete.
- Explain after the learner tries.

### 3. Retrieval Practice

Learners improve when they recall and attempt, not when they only read.

- Ask the learner to produce an answer.
- Use short prompts that require recall.
- Let the learner try before showing the answer.
- Prefer repeat attempts over passive review.

### 4. Spaced Review

Weak topics should come back later, not vanish after one correction.

- Track weak topics as summaries, not raw text.
- Bring weak patterns back in later practice.
- Let memory suggest what to practice next.
- Keep review lightweight and predictable.

### 5. Immediate Feedback

Correction should happen quickly, with a short explanation and a retry.

- Correct the learner soon after the attempt.
- Keep explanations short.
- Ask the learner to retry the exact mistake.
- Make the retry feel like the natural next step.

### 6. Motivation Loop

Learners need a small win and a reason to continue.

- Show a small win after effort.
- Show progress.
- Use streak or practice count carefully.
- Recommend the next lesson while motivation is high.

## Ideal MercyB Flows

### Mercy Kids

```text
Home
-> Mercy Kids
-> choose picture
-> tap speak
-> kid speaks
-> Mercy responds
-> reward
-> next picture
```

Mercy Kids should stay picture-first and speak-first. It should not become a full AI Tutor workspace.

### Adult AI Tutor

```text
Home
-> AI Tutor
-> Today's Lesson
-> 5-minute practice
-> answer
-> correction
-> retry
-> one Vietlish logic explanation
-> memory summary
-> next recommended lesson
```

Adult AI Tutor should guide the learner through a focused study loop. It can include modes, memory, logic diagnosis, and progress, but the default path should be Today's Lesson first.

## Safe Learning Events Contract

Safe learning events measure safe aggregate behavior only. Events must not contain raw audio, full transcripts, raw learner text, corrected sentence text, provider secrets, private auth payloads, user PII, Supabase user IDs, JWTs, or Placement writeback data.

Contract event names from `src/lib/tutor/learningEvents.ts`:

- `lesson_started`
- `lesson_resumed`
- `lesson_completed`
- `lesson_restarted`
- `mode_selected`
- `mistake_retried`
- `logic_insight_viewed`
- `next_focus_viewed`
- `placement_cta_clicked`
- `kids_picture_selected`
- `kids_speak_clicked`

Older names such as `logic_explanation_viewed` and `next_lesson_clicked` are not contract event names. Use `logic_insight_viewed` and `next_focus_viewed`.

Allowed event properties are allowlisted and coarse:

- event type
- product: `ai_tutor` or `mercy_kids`
- mode: `journey`, `grammar`, `speak`, `logic`
- target language code
- safe topic tag
- timestamp
- local anonymous session key
- count or value when relevant

#1109 is engine-only. It adds local-only event recording, filtering, summary, clearing, and pruning helpers. It does not wire events into AI Tutor, Mercy Kids, Placement, or any external analytics provider.

Storage contract:

- local-only for now
- allowlisted fields only
- no external analytics provider
- no Supabase sync
- no raw learner text
- no corrected sentence text
- no transcript
- no raw audio
- no PII
- no Supabase user ID or JWT
- no provider keys or secrets
- no Placement writeback

## Metrics To Measure

- Time to first action
- Lesson start rate
- Lesson completion rate
- Retry rate
- Next lesson click rate
- Next-day return
- Weak topic improvement
- Drop-off screen

## Privacy And Safety Rules

- No raw audio storage.
- No full transcript storage.
- No raw learner text in analytics.
- No corrected sentence text in analytics or Study OS event summaries.
- No user PII, Supabase user IDs, JWTs, provider keys, or provider secrets in analytics.
- No PII or child identity in Study OS event summaries.
- No client-side provider secrets.
- No Supabase memory sync unless separately approved.
- No Placement writeback.
- Analytics should use local-only safe aggregate events only unless a later PR explicitly approves an external provider.

## Study OS Event Summary Boundary

Study OS event summaries are local behavioral summaries. They answer: what has the learner been doing recently in study flows? They are not semantic memory about who the learner is.

- `mercy_user_facts` / episodic memory = semantic person memory: what Mercy remembers about the learner/person.
- Study OS event summaries = local, time-windowed, activity-based derived summaries from #1109 safe local learning events.

Allowed Study OS summary inputs are safe counts, booleans, timestamps, mode names, retry counts, completion counts, and weak-topic tags that do not contain raw learner content.

Forbidden Study OS summary data:

- raw learner text
- corrected sentence text
- full transcripts
- raw audio
- PII
- child identity
- Placement result/status/writeback
- Supabase sync
- external analytics payloads

Study OS event summaries must not read from, write to, or merge with `mercy_user_facts` unless a later explicit reviewed design approves it. They must not become an indirect memory sync layer.

## Experiment Examples

### 1. Four Modes First vs Today's Lesson First

- Hypothesis: Showing Today's Lesson first will reduce cognitive load and increase lesson starts.
- Variant A: Show Journey, Grammar, Speak, and Logic as the first screen.
- Variant B: Show Today's Lesson as the first action, with modes secondary.
- Success metric: Higher lesson start rate, completion rate, and next-day return.
- Safety note: Do not hide safety gates or expose provider features that are not approved.

### 2. Long Explanation vs Short Explanation + Retry

- Hypothesis: Short explanation plus immediate retry will increase mastery more than long explanation.
- Variant A: Show a detailed correction explanation after each mistake.
- Variant B: Show a short explanation, then ask the learner to retry the corrected pattern.
- Success metric: Higher retry rate and weak topic improvement.
- Safety note: Do not store raw learner text; record only safe mistake category and retry completion.

### 3. Kids Text Instructions vs Picture-First Interface

- Hypothesis: Picture-first Mercy Kids flow will increase first action and completion for children.
- Variant A: Show text instructions before picture selection.
- Variant B: Show pictures first, then a simple speak action.
- Success metric: Lower time to first action, higher kids picture selection rate, and higher kids speak click rate.
- Safety note: No raw audio storage and no full transcript storage.

### 4. Progress Hidden vs Visible Practice Count/Streak

- Hypothesis: Visible progress will increase next lesson clicks and next-day return.
- Variant A: Hide practice count and streak.
- Variant B: Show a small practice count or streak after completion.
- Success metric: Higher next lesson click rate and next-day return without lower completion.
- Safety note: Progress display must not pressure children or mix Kids and Adult AI Tutor states.

## Decision Rule

- If a flow increases lesson start, completion, retry, and next-day return without safety risk, keep it.
- If a flow causes confusion or drop-off, simplify it.
- If a flow mixes Kids with Adult AI Tutor, reject it.

## Implementation Discipline

Study-flow changes should ship in small, focused layers:

1. Docs/spec first.
2. Engine/data model second.
3. UI third.
4. Tests/guardrails fourth.
5. Production QA last.

Each PR should state the hypothesis, the learner behavior being improved, the safe events or metrics needed, and the safety boundaries that remain unchanged.
