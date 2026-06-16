# Step 16 Observable Adaptation

Date: 2026-06-15
Job: L16-observable-adaptation
Scope: Observable in-session adaptation in AI Tutor L1 follow-up behavior

## Final Status

Final status: observable in-session adaptation proven, not personalization

Step 16 proves a narrow behavior: within one live session state, the tutor can adapt the next move after a detected Vietnamese L1 grammar pattern. This is not a claim of hidden learner profiling, long-term personalization, cross-session memory, or persistent learner modeling.

## Observable Adaptation Surface

The currently proven adaptation surface is `src/lib/ai-tutor/l1FollowUpLoop.ts`.

The observable state is `L1FocusState`:

- `focusTag`: the active Vietnamese L1 weakness tag being circled, or `null`.
- `turnsOnTag`: how many same-tag practice prompts have been delivered in this in-memory focus.
- `usedContextIds`: the authored follow-up contexts already used for this focus.
- `offeredMoveOn`: whether the tutor has already offered to stop the loop.

The reducer is pure. It receives the previous in-session state plus the current detector result and returns a decision plus the next in-session state. It performs no I/O and does not read or write storage.

## Focus Tag Behavior

The focus tag adapts only from a real detector firing. A focus starts when `advanceL1Focus(initialL1FocusState, detection)` receives a matched high-severity tag that has authored follow-up content.

Observable proof:

- High-confidence `vi_l1_past_ed` starts `action: "start_focus"`.
- The decision exposes `focusTag: "vi_l1_past_ed"`.
- The next state stores `focusTag: "vi_l1_past_ed"` and `turnsOnTag: 1`.
- Low-confidence or non-focusable detections return `action: "converse_naturally"` and keep `focusTag: null`.

The focus is sticky inside the session. If a different high-severity tag fires while a focus is active, the loop continues the current tag rather than thrashing between weaknesses.

## Follow-Up Selection Behavior

Follow-up selection adapts by choosing authored practice content for the active focus tag. The bank is keyed by `L1WeaknessTag`, and each selected follow-up includes:

- stable `id`
- matching `tag`
- Vietnamese-first `promptVi`
- English scaffold `exampleEn`

Observable proof:

- A first high-confidence focusable tag returns `action: "start_focus"` with a non-null follow-up for that tag.
- Subsequent same-focus turns return `action: "continue_focus"` with a new follow-up id.
- `usedContextIds` grows after each selected follow-up.
- The loop never repeats a context id within a single focus.

This is real adaptation because the next visible prompt changes as the in-session state changes. It is not generic copy swapped behind the scenes.

## Reset Behavior

Reset behavior is explicit and observable.

When the learner produces a low-confidence or clean turn during an active focus, the loop does not keep drilling immediately. It returns `action: "offer_move_on"` and sets `offeredMoveOn: true`.

After an offer:

- another clean/low-confidence turn returns `action: "release_focus"` and resets to `initialL1FocusState`;
- a recurring high-confidence error after the offer also returns `action: "release_focus"` so the loop stops forcing the drill and lets the normal correction flow handle the next response.

The reset target is concrete: `focusTag: null`, `turnsOnTag: 0`, `usedContextIds: []`, and `offeredMoveOn: false`.

## Summary/Cap Behavior

The current cap is `L1_FOCUS_DEPTH_CAP = 3`.

The summary/cap behavior is the move-on offer. After the loop has delivered the capped number of same-tag follow-ups, the next same-tag detection returns:

- `action: "offer_move_on"`
- `offerMoveOn: true`
- `followUp: null`
- Vietnamese-first `messageVi` asking whether to move to a new sentence or continue
- `nextState.offeredMoveOn: true`

This prevents a nag loop. The tutor visibly summarizes the local drill by offering to move on instead of silently continuing same-tag practice forever.

## Non-Persistent Session Behavior

The adaptation is in-session only.

Observable proof:

- `initialL1FocusState` is the only default start state.
- A new session that starts from `initialL1FocusState` has no previous `focusTag`, `turnsOnTag`, `usedContextIds`, or `offeredMoveOn`.
- `l1FollowUpLoop.ts` contains no localStorage, no sessionStorage, no Supabase calls, no network calls, no cookies, no IndexedDB, and no learner-history writes.
- The reducer returns data to the caller; it does not persist learner facts itself.

This means the behavior can adapt within a single runtime state value, but it does not secretly carry learner weakness data into future sessions.

## Current Test Evidence

Primary runtime test file: `src/lib/ai-tutor/__tests__/l1FollowUpLoop.test.ts`.

The tests prove:

- high-confidence focusable tags start a focus;
- low-confidence detections do not fabricate a loop;
- authored follow-up contexts are tag-matched, distinct, and Vietnamese-first;
- the loop delivers capped same-tag follow-ups and then offers to move on;
- clean turns trigger offer/release behavior;
- focus releases after an offer;
- a new session state starts clean from `initialL1FocusState`;
- repeated pure reducer calls with the same inputs produce the same outputs and do not mutate prior state.

CI verifier: `scripts/ci/verify-step16-observable-adaptation.mjs`.

The verifier is intentionally more than a wording check: it audits this artifact, checks the reducer source for forbidden persistence/network surfaces, checks that the expected behavior tests exist, and runs the focused `l1FollowUpLoop` Vitest file. Script-level CI coverage lives in `tests/scripts/verify-step16-observable-adaptation.test.mjs`.

## Anti-Fake-Personalization Guard

This Step 16 artifact must not be used to claim:

- personalized learning profile;
- hidden learner profiling;
- broad platform-wide "no hidden profiling anywhere" guarantees from this one reducer proof;
- persistent weakness memory;
- cross-session personalization;
- adaptive mastery model;
- long-term learner diagnosis;
- production analytics learning from the learner without consent.

The honest claim is narrower: observable in-session adaptation exists for the L1 follow-up loop.

## What Is Not Yet Real

The following adaptation is still not real in this Step 16 proof:

- no persistent learner profile;
- no cross-session memory of weaknesses;
- no mastery graph update from these follow-up turns;
- no consented durable learner-data capture for this loop;
- no model-driven personalization based on long-term history;
- no UI claim that the learner has a diagnosed pattern beyond the current detector result;
- no human-rater validation that this adaptation improves learning outcomes;
- no production evidence that learners complete or benefit from the loop;
- no adaptive ordering across lessons or future sessions.

Until those systems exist and are separately proven, Step 16 remains an in-session adaptation proof, not a personalization proof.

## Status Rule

Step 16 may be described as "observable in-session adaptation proven" only for the `l1FollowUpLoop` behavior above. Any broader personalization claim requires new evidence, consent boundaries, and a separate verifier.
