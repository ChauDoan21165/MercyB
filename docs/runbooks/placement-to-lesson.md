# Runbook: Placement → first lesson (anon happy path)

> **Scope:** the read-only flow from an **anonymous** user on the Home
> page to landing inside their first recommended lesson, end to end.
> Closes the visibility gap left after PR #1108 wired Home + AI Tutor
> placement CTAs but never described the full hop to a lesson room.
>
> **Status:** runbook + E2E coverage. Satisfies #1137 DoD Axis 1 item
> #5 when #1137 lands; independent value as a regression artefact until
> then.

## The happy path

```
/                                  (anon Home)
  → click "Placement test" CTA
  → /placement                     (Welcome)
  → click "Start placement test"
  → /placement/who                 (audience picker)
  → click "Adult learner"
  → /placement/test                (Writing → Speaking → Grammar → Listening → Conversation)
  → after 5 answers
  → /placement/results/:sessionId  (Results)
  → click "Start this lesson · Bắt đầu bài này"
  → /room/:roomId                  ← first lesson, journey complete
```

## Step-by-step contract

Each step below names the file:line that anchors the contract and the
assertion the E2E test makes against it. The test does **not** depend
on any specific Supabase row, profile column, or auth state — it is
the anon, read-only path.

### 1. Home renders an anon placement CTA

- **File:** `src/pages/Home.tsx:744–771`
- **Anchor:** `<button aria-label="Placement test">` with body text
  `Take Placement Test`. Gated by
  `isPlacementEntryRouteAvailable()` (`src/lib/placement/availability.ts`)
  returning `true` — controlled by `VITE_PLACEMENT_TEST_ENABLED`.
- **Anon-visibility proof:** `src/pages/home/__tests__/HomePlacementCta.test.tsx`
  mocks `useAuth: () => ({ user: null })` and still asserts the
  button renders + clicking routes to `/placement` + a
  `placement_cta_clicked` learning event is logged.
- **Test assertion:** `getByRole('button', { name: 'Placement test' })`
  is visible on `/`.

> **Signed-in variant (not tested here):** AI Tutor exposes a parallel
> entry CTA at `src/pages/AiTutor.tsx:893` —
> `<a data-testid="ai-tutor-placement-cta" href="/placement">`. Visible
> only when the user has reached the AI Tutor surface. Covered by
> `src/pages/__tests__/AiTutor.test.tsx`. Out of scope for this
> anon-flow runbook.

### 2. Clicking the CTA routes to `/placement`

- **File:** `src/pages/Home.tsx:751–757`
- **Anchor:** `onClick` logs a `placement_cta_clicked` event then
  `nav("/placement")`.
- **Test assertion:** `page.waitForURL(/\/placement(\b|$)/)`.

### 3. Welcome page → "Start placement test"

- **File:** `src/pages/placement/v3/WelcomePage.tsx`
- **Anchor:** Welcome copy `Let's find where you should start` /
  `Hãy tìm điểm bắt đầu` (locale-conditional) + `Start placement test`
  button.
- **Router:** `src/router/AppRouter.tsx:864` —
  `<Route path="/placement"` lazily renders `PlacementV3WelcomePage`
  when `placementV3UiEnabled` is true.
- **Test assertion:** Click `Start placement test`.

### 4. WhoFor page → audience picker

- **File:** `src/pages/placement/v3/WhoForPage.tsx`
- **Anchor:** Buttons including `Adult learner`. URL becomes
  `/placement/who`.
- **Test assertion:** Click `Adult learner`.

### 5. The five-task placement (Writing → Speaking → Grammar → Listening → Conversation)

- **File:** `src/pages/placement/v3/TestPage.tsx`; engine stub at
  `src/lib/placement/v3/clientStub.ts`.
- **Session storage key:** `mb.placement.v3.stub.session` (localStorage)
  — read by the v3 client stub; written transparently as the learner
  answers. The existing `tests/e2e/placement-v3.spec.ts` exercises
  every error path against this key; we reuse the same surface.
- **Anchor (each task):** the existing v3 happy-path test
  (`completed results show profile and recommendations`) walks
  exactly this sequence and is the source of truth for the per-task
  selectors. Copying its pattern keeps the new spec resilient to
  future task-set tweaks — the assertion bar is "Results page
  appears", not "exactly these five tasks in exactly this order".
- **Test action:** Fill each task with the placeholder text the
  existing v3 spec uses verbatim, then submit.

### 6. Results page shows recommendations

- **File:** `src/pages/placement/v3/ResultsPage.tsx:75–141`
- **Anchor:** Heading text `Here's what we found` /
  `Đây là kết quả của bạn`; below it, a `RecommendedLessonsList` block
  labelled `Start here` / `Bắt đầu từ đây`
  (`src/components/placement/v3/RecommendedLessonsList.tsx:14`).
- **Anchor (button per recommendation):**
  `<Button onClick={() => onStartLesson(lesson.roomId)}>Start this lesson · Bắt đầu bài này</Button>`
  (`src/components/placement/v3/RecommendedLessonsList.tsx:50–54`).
- **Test assertion:** `getByText('Start here')` becomes visible; at
  least one `Start this lesson · Bắt đầu bài này` button is enabled.

### 7. Click first lesson → `/room/:roomId`

- **File:** `src/pages/placement/v3/ResultsPage.tsx:67–73`
- **Anchor:** `routeToRoom(roomId)` →
  `navigate(\`/room/${encodeURIComponent(normalizedRoomId)}\`)`.
- **Room-id normaliser:** `normalizePlacementV3RoomId` (same file,
  l.143–) — strips the `room:` prefix and rejects ids that contain
  `/`.
- **Test assertion:** `page.waitForURL(/\/room\/[^/]+$/)`. The test
  asserts the shape of the URL, not a specific room id — the stub's
  recommendation set is allowed to change without rewriting the test.

## Safety invariants (re-asserted by the test)

These constraints come from the live placement architecture and
explicitly govern this runbook:

1. **No Placement writeback.** The anon flow never writes a placement
   result to Supabase. The engine runs through the v3 client stub
   (`src/lib/placement/v3/clientStub.ts`), and the result is held in
   `sessionStorage` + `localStorage` only. The E2E spec creates
   no DB rows.
2. **No PII captured.** The placement engine accepts free-text
   answers (writing, transcript, conversation) but the anon flow does
   not associate them with a user identity. The test fills the same
   placeholder text the existing v3 spec uses — no real PII.
3. **No Supabase event sync.** A `placement_cta_clicked` learning
   event fires on the Home CTA, but it lives in the local
   `learningEvents` log (`src/lib/tutor/learningEvents.ts`) until a
   separate sync path picks it up. The test asserts the URL hop only,
   not any event-side effect.
4. **No paid-tier branching.** Anon users hit the same recommendation
   set the placement engine produces for an unauthenticated session.
   Tier-aware routing is out of scope.

## What is NOT in this runbook (and why)

These cases are already covered or deliberately deferred:

- **Signed-in placement + Supabase writeback** —
  `tests/e2e/auth-and-placement.spec.ts` covers the signup → placement
  → `profiles.placement_cefr_level` set path. Requires test
  Supabase creds; a different safety profile.
- **Skip / abandon / resume / audio fallback / network retry / session
  expired** — all covered by `tests/e2e/placement-v3.spec.ts`.
- **AI Tutor entry CTA** — gated by access surface; the dispatch
  scopes this runbook to the Home entry.
- **Tier-aware lesson routing** — out of scope.

## Running the spec locally

```sh
npx playwright test \
  --config playwright.smoke.config.ts \
  placement-to-first-lesson.spec.ts
```

Placement routes are always mounted per Chau's June 12 product decision;
the spec does not require placement build-time flags.

## Update protocol

When any of these files changes, update the matching step above and
re-run the spec:

- `src/pages/Home.tsx` → step 1, 2
- `src/pages/placement/v3/WelcomePage.tsx` → step 3
- `src/pages/placement/v3/WhoForPage.tsx` → step 4
- `src/pages/placement/v3/TestPage.tsx` → step 5
- `src/pages/placement/v3/ResultsPage.tsx` → step 6, 7
- `src/components/placement/v3/RecommendedLessonsList.tsx` → step 6

When the placement engine's task set changes (more than five tasks,
or different task types), the spec's `fill / radio / submit` sequence
in step 5 needs to mirror whichever happy-path test in
`placement-v3.spec.ts` is current.
