# Placement v3 — diagnosis of the results hang and the 0:00/0:00 audio

Date: 2026-07-08 · Agent A1 · Phase 1 of the "signal cell" brief.

Both bugs are **client-side control-flow gaps**, not data or infrastructure
failures. Neither is caused by `runRuntimeDecisionPipeline`.

---

## Bug (a) — "Preparing results / Đang chuẩn bị kết quả" hangs forever

### Failure mode

`src/pages/placement/v3/TestPage.tsx:163-169` renders the "Preparing results"
placeholder whenever `session != null && session.currentTask == null`.

**That branch is a terminal state.** Nothing in the component can leave it:

- The only `navigate()` to the results route is at `TestPage.tsx:140`, inside
  `handleSubmit`.
- `handleSubmit` only runs from the submit button's `onClick` — and the submit
  button is not rendered in the `!task` branch (it returns early at line 164).
- There is no timeout, no retry affordance, and no error surface on that path.

So once the component enters `!task`, it stays there until the user reloads.

### Two reachable entries into it

**1. Mount / resume (deterministic, easy to reproduce).**
`TestPage.tsx:63` calls `resumeSession()`. On `sessionId` match it does
`setSession(stored)` (line 67) and nothing else. If the resumed session has
`currentTask == null` — which is exactly what the server returns for a
**completed** session (`index.ts:97` passes `currentTask: result.prompt`, and
`core.ts:236` sets `prompt: null` on completion) — the component immediately
renders "Preparing results" and never leaves.

Repro: finish a placement test, then reload or navigate back to
`/placement/test/:sessionId`.

**2. Submit returning a dead end.**
`supabase/functions/placement-v3-session/index.ts:83-87`:

```ts
return { type: "next_task", currentTask: result.prompt, progress: progress(result.session) };
```

`result.prompt` is typed `PublicPrompt | null`, so this envelope can carry
`currentTask: null`. On the client, `clientStub.ts:296` derives completion
**solely** from `json.type === "session_complete"`:

```ts
if (json.type === "session_complete") { ...; return { session: completed, completed: true, results }; }
// falls through:
return { session, completed: false };   // clientStub.ts:325
```

So a `next_task` envelope with a null task yields `completed: false` **and** a
session with `currentTask: null`. `TestPage.tsx:122` calls
`setSession(result.session)`, then the `if (result.completed)` guard at line 127
skips the navigate. Permanent hang, no error, no Sentry event.

### The brief's hypothesis is disconfirmed

`runRuntimeDecisionPipeline` **is** on the results path —
`clientStub.applyRuntimeToResults` → `runtimeIntegration.buildPlacementTeacherContext`
→ `runtime/contextBuilder.buildTeacherContext` → `runRuntimeDecisionPipeline`.

But it **cannot hang**: `src/lib/tm-int/runtime/decisionPipeline.ts:35` is a
plain synchronous function. There is no `await`, no Promise, and no I/O anywhere
in the file — it returns a literal object at line 130.

An excluded listening score also does not malform the result. `excludeListeningScore`
only flips `scoreEligible: false` and stamps a reason string
(`runtimeIntegration.ts:184-186`). Nothing downstream waits on it.

A synchronous function can throw, but a throw here surfaces as
`submitter.error` (the red alert box at `TestPage.tsx:257`), not as a hang.

**Conclusion:** the hang is `TestPage`'s unguarded `!task` terminal branch. The
pipeline is a bystander.

### Fix (recommended, not applied in this MR)

Two lines, in `TestPage.tsx`:

1. In the resume effect, if `stored.currentTask == null && stored.status === "completed"`,
   `navigate('/placement/results/' + sessionId, { replace: true })` instead of
   `setSession(stored)`.
2. In `handleSubmit`, treat `!result.session.currentTask` as completion
   regardless of the `completed` flag, or make `clientStub` derive `completed`
   from `progress.state === "completed"` as well as the envelope type.

---

## Bug (b) — listening audio player shows 0:00 / 0:00

### Failure mode

**The player never requests a URL. There is no URL to request.**

- `src/components/placement/v3/ListeningTaskCard.tsx:54` renders
  `<audio controls src={task.audioUrl} />`.
- `task.audioUrl` is populated at `clientStub.ts:219` from the server's
  `metadata.audioUrl`:
  ```ts
  audioUrl: typeof metadata.audioUrl === "string" ? metadata.audioUrl : undefined,
  ```
- **The edge function never emits `audioUrl`.** `grep -rn "audioUrl|audio_url"
  supabase/functions/placement-v3-session` returns **zero hits**, and the
  `placement_items` migration (`20260618000000_placement_items.sql`) has no audio
  column.

So `task.audioUrl === undefined`. React omits a `src` attribute whose value is
`undefined`, producing `<audio controls>` with **no source**. A source-less
`<audio controls>` renders exactly `0:00 / 0:00`.

### Why it fails silently

No resource is selected, so the element fires **no `error` event**. `onError`
(`ListeningTaskCard.tsx:64`) never runs. The card falls back to `mediaStatus:
"missing"` via the `task.audioUrl ? "loading" : "missing"` ternary (line 21/33),
the listening score is quietly excluded, and nothing is reported anywhere.

### The file itself is fine

The only reference to a placement mp3 in the whole repo is the **dead fixture**
`placementV3StubInternals` (`clientStub.ts:481`), which the live path never
reads. That file exists and serves correctly:

```
$ curl -s -o /dev/null -w "%{http_code} %{size_download} %{content_type}\n" \
    https://mercyblade.com/audio/placement-v3/listening-a2-class-delay-1.mp3
200 86876 audio/mpeg
```

`file` confirms it is a real MPEG layer III, 96 kbps, 22.05 kHz mono.

**So: not a wrong storage key, not a missing file, not a malformed URL.** The
server-side item bank simply has no audio field, and the client renders an empty
player rather than reporting the gap.

### Fix (recommended, not applied in this MR)

Server-side: add an `audio_url` (or `metadata.audioUrl`) to the listening rows in
`placement_items` and pass it through `core.ts`'s `metadata: next.metadata`.
Client-side: `ListeningTaskCard` should not render an `<audio>` element at all
when `task.audioUrl` is falsy — render the "audio unavailable" state directly, so
the 0:00/0:00 control never appears.

---

## Why neither bug was visible

`VITE_SENTRY_DSN` is unset in the Netlify production build, so
`sentryInit.ts:138` logs `[sentry] missing or empty DSN` and every capture path
is a no-op. `.env.example:96` told operators to set the DSN in **Vercel** — but
Vercel stopped being the primary host on 2026-05-27 (Netlify is primary; Vercel
is the recovery host per `docs/runbooks/disaster-recovery.md` §2.2). The DSN was
set on the wrong host. Corrected in `.env.example` in this branch.

Even with a DSN, neither bug would have reported: the hang throws nothing, and
the audio gap fires no event. Both need an explicit emitter — Phase 2.
