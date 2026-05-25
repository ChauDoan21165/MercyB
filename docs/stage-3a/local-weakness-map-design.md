# Stage 3A — Local Weakness Map ("What I'm Weak At") — design doc

> **Owner:** C1
> **PR 1 of Stage 3A:** this design doc only.
> **PR 2 (follow-up):** implementation (new route + screen + adapters).
> **Last updated:** 2026-05-25
> **Anchor:** `origin/main` `ae5f969d7` (post-#1194 Bar #1 tick).

This document is the design artifact for the first PR of Stage 3A —
the *"What I'm Weak At"* / Local Weakness Map screen described in
`ROADMAP.md` §3A. **No implementation is shipped in this PR.** The
implementation lands in a follow-up PR after owner review.

---

## 1. Goal and posture

Per `ROADMAP.md` §3A (lines 39-45):

> Read-only, local-only, descriptive. Surfaces top Vietnamese↔English
> weakness patterns from L1 detector + Placement + pronunciation
> signals. No recommendations, no scores, no streaks at this stage —
> descriptive only.
>
> Ships with a marketing-visible demo artifact: one screen, one story,
> one sentence — *"Duolingo tells you to keep a streak. MercyBlade
> tells Vietnamese learners why they keep making the same English
> mistake."*

Per `ROADMAP.md` *Local-Only Posture* (lines 107-111) and *Stage 3
Study OS Boundaries* (lines 85-105):

- No Supabase sync, no Supabase read of progress/event tables.
- No external analytics.
- No memory write to `mercy_user_facts` / episodic memory.
- No recommendation / coaching / scoring / streak / shame mechanics.
- Safe local event summaries only — counts, booleans, timestamps; no
  raw learner content, no full transcripts, no raw audio, no PII.

Per `STRATEGY.md` §15 Axis 1 Bar #1 (now ticked via PR #1194), the
detector layer that this screen reads from is complete: all 15
grammar families in `docs/l1-taxonomies/vi-grammar.md` are reachable
by a detector rule in `src/lib/feedback/l1-error-detector.ts`. The
hard prereq for Stage 3A is met.

## 2. Data sources — audit against current `main`

The brief names three signal sources. This section documents what
each one actually exposes locally today, with `file:line` anchors.
**Two of the three sources have no usable local persistence layer.**
That gap is the principal design problem this doc names; §4 proposes
the minimum-viable adapter strategy.

### 2.1 L1 detector recent-flagged tags

**Canonical detection path:**
- `src/lib/feedback/l1-error-detector.ts:detectErrors` — pure
  function, takes one user turn + expected answer, returns
  `L1DetectionResult` with `weaknessTag: L1WeaknessTag | null` and a
  bilingual `feedback: { en, vi }`.
- `src/lib/feedback/index.ts:detectL1Error` — the VN-pack adapter
  callsite consumers actually use.

**Where it lands after a tutor turn:**
- `src/components/mercy-guide/tabs/grammar-writing/types.ts:239` —
  `L1HintPayload = { weaknessTag: string; feedback: { en, vi } }`.
- `src/components/mercy-guide/tabs/grammar-writing/L1HintCard.tsx` —
  the per-turn UI consumer.
- `src/components/mercy-guide/tabs/grammar-writing/GrammarWritingTab.tsx`
  — renders `<L1HintCard hint={apiResponse.l1Hint} />` per-turn.

**Local persistence layer:** **none.** The payload is consumed
inline by the per-turn UI and discarded. There is no recent-history
ring buffer, no `localStorage` mirror, no client-side aggregation.

**What the design needs:** an additive, local-only write of the
`weaknessTag` (string) + `timestamp` into a ring buffer keyed at
`localStorage["mb.stage3a.l1.recent"]`. Capacity ~20 entries; FIFO
eviction. Booleans + counts + timestamps only — no learner text,
no `feedback.vi/en` body, no excerpt. Tag string alone is the
phenomenon ID; the human-readable text is reconstructed at read-time
from `WEAKNESS_CATALOG`.

### 2.2 Placement v3 session result snapshot

**Canonical storage:**
- Server-side: `supabase/functions/placement-v3-session/persistence.ts`
  + `core.ts` writes a profile snapshot on session completion (PR #1159).
- Client-side cache: `src/lib/placement/v3/clientStub.ts:15-16` —
  `mb.placement.v3.session` (`localStorage`, in-progress session) and
  `mb.placement.v3.results.{sessionId}` (`sessionStorage`,
  per-session results — ephemeral).
- Long-term canonical: `profiles.placement_weaknesses jsonb` column
  (Supabase), read by `src/hooks/useFocusAreas.ts`.

**Local persistence after completion:** **none usable for Stage 3A.**
- The `sessionStorage` results key is cleared when the browser tab
  closes — not a stable Stage 3A source.
- The `profiles.placement_weaknesses` read path is **Supabase-bound**
  and explicitly forbidden by the Local-Only Posture.
- The completed-session weakness list exists at the moment of
  completion but is not mirrored to `localStorage` long-term.

**What the design needs:** an additive, local-only mirror written at
placement completion — `localStorage["mb.stage3a.placement.snapshot"]`
holding `{ completedAt: ISO8601, weaknessTags: string[] }` only.
Single write per completion. Read by Stage 3A; never written by
Stage 3A. Mirrors what `profiles.placement_weaknesses` already
holds server-side; redundant write, zero new content.

### 2.3 Pronunciation drill recent results

**Canonical storage:**
- `src/lib/pronunciation/sessionAttempts.ts:1-17` — explicitly
  **in-memory only, cleared on practiceText change, on Bắt đầu lại
  reset, and on Speak-tab unmount.** "DB-backed long-term history is
  /progress dashboard's concern, out of scope for this module."
- `AttemptRecord` shape: `{ attemptNumber, timestamp, overallScore,
  phonemes: PhonemeScore[], audioBlob, transcript }`.

**Local persistence across sessions:** **none.** Each sentence's
attempt history dies on tab close or sentence change. There is no
cross-session "which phonemes the learner struggles with" surface.

**What the design needs:** an additive, local-only mirror at attempt
finalization — `localStorage["mb.stage3a.pronunciation.recent"]`
holding a ring buffer of `{ phoneme: string, score: number,
timestamp: number }` entries (counts + scores only, **no audio
blob, no transcript, no learner text**). Capacity ~30 entries; FIFO.
The `phoneme` field is the existing `PhonemeScore.phoneme` string —
a stable identifier, not learner content.

### 2.4 Audit summary

| Source | Local today? | What Stage 3A needs |
|---|---|---|
| L1 detector tags | ❌ ephemeral, per-turn only | Ring-buffer of `(tag, timestamp)` in `localStorage` |
| Placement v3 result | ❌ Supabase-canonical; `sessionStorage` ephemeral | One-time mirror of `(completedAt, tags[])` in `localStorage` |
| Pronunciation drills | ❌ in-memory only | Ring-buffer of `(phoneme, score, timestamp)` in `localStorage` |

## 3. Honest constraint reading

The brief says:

> **Out of scope for PR 1 (and the impl PR):** Any change to existing
> signal-collection code (detectors, placement, pronunciation drills).
> READ-ONLY consumer of existing data.

Reading that strictly: the implementation PR cannot add the three
local mirrors above, because doing so changes the signal-collection
emit-sites (each mirror is an additive write next to the existing
collection point).

Reading that pragmatically: an *additive* `localStorage.setItem` of
already-derived data (tag string, timestamp, score number) does not
change collection behaviour — it just persists a slice of what's
already computed. The signal-collection layers stay
behaviourally identical; a single new write line at each emit site
mirrors a slice to local storage.

**This doc proposes the pragmatic reading**, and stages the three
mirror-writes as **three small sibling PRs** (one per source), each
narrowly scoped:

- `PR-Sibling-A`: L1 detector mirror — adds one `localStorage` write
  in `GrammarWritingTab.tsx`'s `apiResponse.l1Hint` consumer.
- `PR-Sibling-B`: Placement v3 mirror — adds one `localStorage` write
  in the client-side completion handler of
  `src/hooks/placement/v3/usePlacementSubmit.ts` (or wherever the
  client receives the final session results).
- `PR-Sibling-C`: Pronunciation mirror — adds one `localStorage`
  write in `MercySpeakTab.tsx`'s attempt-finalize callsite (the
  consumer of `appendAttempt` from `sessionAttempts.ts`).

Each sibling PR is ≤ 30 lines. None touch detection logic, scoring
logic, or storage schemas. They write counts/booleans/timestamps
only — already inside the Local-Only Posture's allowlist.

**Owner ratifies** whether the strict or pragmatic reading binds.
If strict: Stage 3A's first iteration surfaces only the
catalogue-default "what a Vietnamese learner typically struggles
with" with no per-learner signal — a marketing screen, not a
weakness map. If pragmatic: three small sibling PRs unblock the
real per-learner surface.

## 4. Local storage layout (proposed)

All keys under `mb.stage3a.*` namespace. JSON-encoded values. Per
the Stage 3 Study OS Boundaries, no raw learner content; counts +
timestamps + tag strings only.

```
mb.stage3a.l1.recent             ring-buffer, last ~20 entries
  [{ tag: "vi_l1_3rd_person_s", t: 1779700000000 }, ...]

mb.stage3a.placement.snapshot    single object, last completed
  { completedAt: "2026-05-25T10:00:00Z",
    weaknessTags: ["vi_l1_past_ed", "vi_l1_missing_be", ...] }

mb.stage3a.pronunciation.recent  ring-buffer, last ~30 entries
  [{ phoneme: "th", score: 65, t: 1779700000000 }, ...]
```

Storage cap: each key ≤ 4 KB; total Stage 3A footprint ≤ 12 KB.

## 5. Aggregation logic (read-side, pure function)

```ts
// src/lib/stage-3a/aggregate-weaknesses.ts  (PR 2 — implementation)

export type WeaknessRow = {
  tag: WeaknessTag;
  source: 'l1-detector' | 'placement' | 'pronunciation';
  hitCount: number;        // how many times this tag/phoneme appeared
  lastSeenAt: number;      // ms epoch
  confidence: 'low' | 'medium' | 'high';
};

export type WeaknessMap = {
  rows: WeaknessRow[];                // top 3 after ranking
  hasAnyData: boolean;
  signalSourcesPresent: number;       // 0..3
};

export function aggregateWeaknesses(
  l1Recent: { tag: string; t: number }[],
  placementSnapshot: { completedAt: string; weaknessTags: string[] } | null,
  pronunciationRecent: { phoneme: string; score: number; t: number }[],
  now: number,
): WeaknessMap;
```

Ranking heuristic:
- Each source contributes a per-tag count
- Pronunciation aggregates per-phoneme into a coarse weakness-band
  ("low score on `th` 5x in last 14 days" → a weakness row), no
  numeric score surfaced
- Cross-source: a tag appearing in 2+ sources ranks higher than a tag
  in 1 source
- Time window: 14-day rolling for L1 + pronunciation; placement
  snapshot is treated as a single "as of completion date" datum
- Confidence:
  - `low` — 1-2 hits in one source
  - `medium` — 3+ hits in one source OR 1-2 hits in two sources
  - `high` — 3+ hits OR appears in all three sources

Final return: top 3 rows by rank. Empty/low-confidence states drive
the UI per §7.

## 6. UX wireframe

One screen. No navigation, no tabs, no "drill down". Mobile-first
375px width.

```
┌──────────────────────────────────────────┐
│  ←  Bạn đang gặp khó ở đâu               │  ← screen title (VN)
├──────────────────────────────────────────┤
│                                          │
│  Duolingo tells you to keep a streak.    │  ← demo sentence
│  MercyBlade tells you why you keep       │     (owner's exact wording,
│  making the same English mistake.        │      verbatim from ROADMAP)
│                                          │
│  ─────────────────────────────────────   │
│                                          │
│  ⚠️  Quên thêm -s sau he / she / it      │  ← row 1: shortLabel.vi
│      Ví dụ: She go to school every day.  │  ← exampleWrong from catalog
│      → She goes to school every day.     │  ← exampleRight from catalog
│      Trong tiếng Việt mình không chia    │  ← longDescription.vi
│      động từ theo ngôi…                  │
│                                          │
│  ⚠️  Quên thêm -ed cho thì quá khứ        │  ← row 2
│      Ví dụ: I work yesterday.            │
│      → I worked yesterday.               │
│      Mình quen có 'hôm qua' là đủ…       │
│                                          │
│  ⚠️  Thiếu mạo từ a / an / the           │  ← row 3
│      Ví dụ: I bought book yesterday.     │
│      → I bought a book yesterday.        │
│      Tiếng Việt không có mạo từ…         │
│                                          │
│  ─────────────────────────────────────   │
│                                          │
│  Mercy chỉ thấy [N] ví dụ trong          │  ← honest-uncertainty footer
│  [M] ngày gần đây. Càng học, danh sách   │     (only if confidence='low'
│  càng chính xác hơn.                     │      on any visible row)
│                                          │
└──────────────────────────────────────────┘
```

No streak counter. No XP. No percentage. No level badge. No "+5 points"
animation. No daily-goal ring. The screen is one scroll-stop.

The demo sentence renders **once at the top**, not as a marketing
modal or banner — it's the screen's headline copy.

## 7. Empty + low-confidence states

Per the brief: "NO empty-state that nags" + honest-uncertainty per
PRINCIPLES #7.

### 7.1 No data at all (zero of three sources have entries)

```
┌──────────────────────────────────────────┐
│  ←  Bạn đang gặp khó ở đâu               │
├──────────────────────────────────────────┤
│                                          │
│  Duolingo tells you to keep a streak.    │
│  MercyBlade tells you why you keep       │
│  making the same English mistake.        │
│                                          │
│  ─────────────────────────────────────   │
│                                          │
│  Mercy chưa thấy lỗi nào — học vài bài   │  ← neutral, kind, not
│  rồi quay lại nhé.                       │     pushy. No CTA button.
│                                          │
└──────────────────────────────────────────┘
```

### 7.2 Partial data (1-2 of three sources have entries)

Render whatever rows are available, up to 3. Add a footer:

```
Mercy mới có dữ liệu từ [bài tập phát âm / bài viết / bài kiểm tra
xếp lớp]. Khi bạn học thêm, các phần khác sẽ rõ hơn.
```

### 7.3 Low-confidence on a row (1-2 hits only)

The row renders normally but with a confidence chip:

```
⚠️  Quên thêm -s sau he / she / it
    [Mercy mới thấy 2 lần]            ← honest-uncertainty chip
    Ví dụ: She go to school…
```

The chip is grey + small, not red. It honors PRINCIPLES #7 without
weakening the row's pedagogical content.

## 8. Component shape (props + types)

```ts
// src/pages/WeakAtPage.tsx  (PR 2 — implementation)
export default function WeakAtPage(): JSX.Element;

// src/components/stage-3a/LocalWeaknessMap.tsx  (PR 2)
export interface LocalWeaknessMapProps {
  /** Output of aggregateWeaknesses(). */
  map: WeaknessMap;
  /** ISO date the placement snapshot was taken, or null. */
  placementCompletedAt: string | null;
}
export default function LocalWeaknessMap(p: LocalWeaknessMapProps): JSX.Element;

// src/components/stage-3a/WeaknessRow.tsx  (PR 2)
export interface WeaknessRowProps {
  entry: WeaknessEntry;        // from WEAKNESS_CATALOG
  confidence: 'low' | 'medium' | 'high';
  hitCount: number;
}
```

The screen reads three localStorage keys at mount, passes them
through `aggregateWeaknesses` (pure function, unit-testable without
React or Supabase), and renders. No effects beyond the mount read.

## 9. Route + routing

Proposed route: `/weak-at` (route name not load-bearing per the
brief; owner can rename).

Mounted in `src/router/AppRouter.tsx` alongside the existing
authenticated routes. The route should NOT be in the marketing
navigation; reach it from the Tutor / Mercy Guide surface as
"Bạn đang gặp khó ở đâu" link.

`FeedbackBar` auto-mounts on every page via
`src/router/AppRouter.tsx:1756` — PRINCIPLES #8 satisfied with no
new code in this route.

## 10. Exact copy (Vietnamese)

### Screen title
> Bạn đang gặp khó ở đâu

### Demo sentence (owner's verbatim, do not paraphrase)
> Duolingo tells you to keep a streak. MercyBlade tells you why you keep making the same English mistake.

### Row template
Per row, three lines:
1. `**{WEAKNESS_CATALOG[tag].shortLabel.vi}**`
2. `Ví dụ: {WEAKNESS_CATALOG[tag].exampleWrong}` → `{WEAKNESS_CATALOG[tag].exampleRight}`
3. `{WEAKNESS_CATALOG[tag].longDescription.vi}`

All three fields exist on every entry in `WEAKNESS_CATALOG` per
`src/lib/weakness/weakness-catalog.ts:114-136`. The catalog is the
single source of truth for human-facing strings; the screen passes
the tag, the catalog provides the prose.

### Empty state
> Mercy chưa thấy lỗi nào — học vài bài rồi quay lại nhé.

### Partial-data footer
> Mercy mới có dữ liệu từ {bài tập phát âm / bài viết / bài kiểm tra xếp lớp}. Khi bạn học thêm, các phần khác sẽ rõ hơn.

### Low-confidence chip
> Mercy mới thấy {N} lần

## 11. What this PR is NOT

- Not implementation. PR 2 ships the route + components + aggregator.
- Not 3B Suggested Practice. No "you should try…" copy anywhere.
- Not 3C Review Queue. No re-prompt list.
- Not 3D Mastery Map. No "what you know" surface.
- Not a write-side change. The three sibling adapter PRs are
  separately negotiated; owner decides strict vs pragmatic per §3.
- Not a Supabase reader. Even though
  `profiles.placement_weaknesses` already exists server-side,
  Local-Only Posture forbids reading it from this screen.
- Not a `mercy_user_facts` reader/writer. Episodic semantic memory
  is a different surface (§Stage 3 Boundaries).

## 12. Open questions for owner review

1. **Strict vs pragmatic reading of "no change to signal-collection
   code"** (§3 above). Three small sibling adapter PRs need
   ratification before PR 2 can land usefully.
2. **Route name.** `/weak-at` is a placeholder. Alternatives:
   `/learn/weakness-map`, `/me/patterns`, `/study/weak-spots`.
   Vietnamese-side users will mostly reach this from a labelled link,
   so URL is mostly internal.
3. **Pronunciation phoneme-band copy.** §5 ranks by phoneme + score
   band ("low score on `th`"). Should the row's `shortLabel.vi` for
   pronunciation rows be sourced from `vn-phoneme-map.ts`'s tip
   strings, or do we need a new catalog entry per phoneme? `th`
   already has `phoneme: 'th-voiceless'` in `PHONEME_TIPS` with
   `articulation.vi` copy — pragmatic answer is reuse that. Owner
   confirms or substitutes.
4. **Ranking weights.** §5's ranking heuristic is a first draft.
   Owner may want pronunciation weighted lower than grammar (the
   §15 mission test is pronunciation-and-grammar both, but the
   "why you keep making the same English mistake" copy reads more
   grammar than phonology).
5. **14-day rolling window.** Reasonable default. Owner may want
   7 days (more responsive) or 30 days (more stable). Stays a single
   constant in `aggregate-weaknesses.ts`.
6. **Honest-uncertainty chip wording.** "Mercy mới thấy {N} lần" is
   the lightest framing I could find that names the uncertainty
   without sounding clinical. Owner reviews.

## 13. Verification checklist (for PR 2)

- [ ] No `supabase` import in the new route, components, or
      aggregator
- [ ] No `mercy_user_facts` import
- [ ] No analytics package import
- [ ] No `localStorage.setItem` (read-only consumer)
- [ ] No streak / XP / score / level / percentage surfaces
- [ ] Demo sentence renders verbatim
- [ ] Empty state is neutral, no CTA
- [ ] Honest-uncertainty chip appears on low-confidence rows
- [ ] `FeedbackBar` renders on this route (auto via AppRouter)
- [ ] All copy is Vietnamese, except the verbatim demo English sentence

---

*End of design doc. Implementation PR follows after owner review.*
