# Step 15 — Interference Sequencer Wiring Spec

**Owner:** A3 (pure lib). **Wiring:** A1 (study-path UI).  
**Invariant:** `src/lib/sequencing/**` stays pure — no React, no Supabase, no IndexedDB imports.

---

## What A1 needs to wire

### 1. Build the mastery profile on session start

```typescript
import { deriveMasteryProfile, mergeServerTagsIntoProfile } from "@/lib/sequencing/masteryScorer";
import { VN_L1_INTERFERENCE_PATTERNS } from "@/data/placement/vnL1Interference";
import { loadLearnerHistoryProfile } from "@/lib/tutor/learnerHistoryProfile";

// In the component/hook that drives the study-path panel:
const historyProfile = loadLearnerHistoryProfile("ai-tutor", "en") ?? createEmptyLearnerHistoryProfile("ai-tutor", "en", Date.now());

// Device-local score derivation (always available):
let masteryProfile = deriveMasteryProfile(historyProfile, VN_L1_INTERFERENCE_PATTERNS, Date.now());

// Optionally merge cross-device server tags (from Step-12 / !871 recall):
// serverTags: { tag: string; count: number; lastSeenAt: number }[]
// (shape comes from loadServerInterferenceTags() in a1/step12-cross-device-recall)
if (serverTags && serverTags.length > 0) {
  masteryProfile = mergeServerTagsIntoProfile(masteryProfile, serverTags, Date.now());
}
```

### 2. Get the ordered sequence

```typescript
import { sequenceInterferencePatterns } from "@/lib/sequencing/interferenceSequencer";

const sequence = sequenceInterferencePatterns(
  masteryProfile,
  VN_L1_INTERFERENCE_PATTERNS,
  Date.now(), // always pass real timestamp so spacing is live
);

// sequence.entries[0] is the highest-priority pattern to work on.
// Each entry: { patternId: string; rationale: string }
// Use rationale as a one-line tooltip/summary for the UI.
```

### 3. Surface in the study-path UI

The sequencer is **purely advisory** — it outputs an ordered list, not commands.
A1 decides the exact UI surface. Suggested minimal surface:

```
Study Path panel (Journey tab or dedicated "Study Plan" section)
│
├── "Work on these first:" [entries 0..2 — top 3 patterns]
│   ├── Pattern name + short description
│   └── Rationale tooltip (from entry.rationale)
│
└── "Upcoming:" [entries 3..N, collapsed by default]
```

Lookup `VN_L1_INTERFERENCE_PATTERNS.find(p => p.id === entry.patternId)` for
`p.name`, `p.shortDescription`, and `p.remediation` to populate the card.

### 4. Update mastery after a drill/correction

After each correction the engine accepts/rejects, call `recordInterferencePattern`
from `learnerHistoryProfile.ts` with the appropriate tag, then `saveLearnerHistoryProfile`.
On the **next** study session start, `deriveMasteryProfile` will reflect the new data.

There is **no live reactive update** within the same session — the profile is recomputed
at session start only. This is intentional (matches the device-local IndexedDB pattern).

---

## Data flow diagram

```
LearnerHistoryProfile (localStorage)
    │ interferencePatterns: [{ tag, observedCount, lastSeenAt }]
    │
    ▼
deriveMasteryProfile(history, catalogue, now)          ← masteryScorer.ts
    │
    │  (optionally merge server tags from Step 12 recall)
    │
    ▼
LearnerInterferenceProfile
    │ masteryByPattern: Record<patternId, InterferenceMasteryScore>
    │
    ▼
sequenceInterferencePatterns(profile, catalogue, now)  ← interferenceSequencer.ts
    │
    ▼
InterferenceSequence
    │ entries: [{ patternId, rationale }]  — ordered weakest-first, due before not-due
    │
    ▼
Study-path UI (A1 wires this surface)
```

---

## Key invariants A1 must not break

1. **Always pass `Date.now()` as `now`** to `sequenceInterferencePatterns` in production.
   Omitting `now` (defaults to 0) disables spacing and is for tests only.

2. **Never import masteryScorer or interferenceSequencer from within `src/lib/tutor/`**.
   The Study OS boundary test (`studyOsBoundary.test.ts`) forbids Supabase from tutor/;
   masteryScorer is in a sibling lib so the boundary holds, but don't accidentally
   create a circular import back into tutor.

3. **Re-derive on every session start, not on every render**. Derivation is O(patterns × tags)
   — fast, but no need to call it in a render loop.

4. **Empty-telemetry is safe**: if the learner has no history, `deriveMasteryProfile` returns
   an empty `masteryByPattern`, and the sequencer falls back to default curriculum order
   (severity: high → medium → low). No fallback branch needed in UI code.
