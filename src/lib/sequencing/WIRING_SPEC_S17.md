# Step 17 — Mastery Forecaster Wiring Spec

**Owner:** A3 (pure lib). **Wiring:** A1 (MercyGuide surface).  
**Invariant:** `src/lib/sequencing/**` stays pure — no React, no Supabase, no IndexedDB.

---

## What was built

`masteryForecaster.ts` adds three functions on top of the S15 mastery scorer:

| Function | Input | Output |
|----------|-------|--------|
| `forecastPatternTrajectory(score, now)` | Single `InterferenceMasteryScore` | `MasteryForecast` (horizon7/14, daysToNextLevel, confidence band, abstain flag) |
| `forecastMasteryTrajectory(profile, now)` | Full `LearnerInterferenceProfile` | `MasteryForecastReport` (all patterns) |
| `buildWeekFocus(report, patterns)` | Report + VNL1 catalogue | `WeekFocus` (top-3 focus patterns, Vietnamese UI labels) |

---

## How A1 wires this

### Step 1 — Build the forecast (after mastery profile is ready)

```typescript
import { forecastMasteryTrajectory, buildWeekFocus } from "@/lib/sequencing/masteryForecaster";
import { VN_L1_INTERFERENCE_PATTERNS } from "@/data/placement/vnL1Interference";

// After deriveMasteryProfile + optional mergeServerTagsIntoProfile (S15):
const forecastReport = forecastMasteryTrajectory(masteryProfile, Date.now());
const weekFocus = buildWeekFocus(forecastReport, VN_L1_INTERFERENCE_PATTERNS);
```

### Step 2 — Handle abstain

```typescript
if (weekFocus.abstain) {
  // Show generic message — not enough data yet
  // weekFocus.abstainReason is a VI string: "Chưa đủ dữ liệu..."
  renderGenericFocusMessage(weekFocus.abstainReason!);
  return;
}
```

### Step 3 — Render focus patterns

Each `FocusPattern` in `weekFocus.focusPatterns` contains:

| Field | Type | Use |
|-------|------|-----|
| `patternName` | string | Card header |
| `currentLevel` | "struggling" \| "emerging" \| "consolidating" | Badge color |
| `daysToNextLevel` | number \| null | "Expected in X days" sub-label |
| `horizon7.p50` | number | Progress bar fill (0–1) |
| `horizon7.p10/p90` | number | Confidence interval whiskers (optional) |
| `focusSummaryVi` | string | Main card body text (VI) |
| `priorityRank` | 1–3 | Sort order |

```typescript
for (const fp of weekFocus.focusPatterns) {
  renderFocusCard({
    title: fp.patternName,
    level: fp.currentLevel,
    summary: fp.focusSummaryVi,  // full VI text
    daysHint: fp.daysToNextLevel
      ? `Khoảng ${Math.ceil(fp.daysToNextLevel)} ngày`
      : null,
    forecast7d: fp.horizon7,  // {p10, p50, p90}
  });
}
```

### Step 4 — Update on session start only

Compute the forecast once at session start. Do NOT call in a render loop.
The same session-start pattern from the S15 WIRING_SPEC applies.

```typescript
// In the effect / hook that fires once on mount (not on every render):
useEffect(() => {
  const historyProfile = loadLearnerHistoryProfile("ai-tutor", "en") ?? ...;
  const masteryProfile = deriveMasteryProfile(historyProfile, patterns, Date.now());
  // optionally: mergeServerTagsIntoProfile(...)
  const forecastReport = forecastMasteryTrajectory(masteryProfile, Date.now());
  const weekFocus = buildWeekFocus(forecastReport, patterns);
  setWeekFocus(weekFocus);
}, []); // empty deps → once on mount
```

---

## Data flow diagram

```
LearnerInterferenceProfile (from S15 masteryScorer)
    │ masteryByPattern: Record<patternId, InterferenceMasteryScore>
    │
    ▼
forecastMasteryTrajectory(profile, now)           ← masteryForecaster.ts
    │
    ▼
MasteryForecastReport
    │ forecasts: MasteryForecast[]
    │   • patternId, currentLevel, currentScore
    │   • abstain (true when < 3 observations)
    │   • horizon7: { p10, p50, p90 }   ← confidence band, 7-day
    │   • horizon14: { p10, p50, p90 }  ← confidence band, 14-day
    │   • daysToNextLevel: number | null
    │
    ▼
buildWeekFocus(report, VN_L1_INTERFERENCE_PATTERNS)
    │
    ▼
WeekFocus
    │ focusPatterns: FocusPattern[]   (top-3, ordered: struggling → emerging → consolidating)
    │   • patternName, currentLevel, daysToNextLevel
    │   • horizon7: { p10, p50, p90 }
    │   • focusSummaryVi: string      ← Vietnamese UI text, ready to render
    │ abstain: boolean
    │ abstainReason?: string          ← VI text when abstain=true
    │
    ▼
MercyGuide Journey tab (A1 wires this surface)
```

---

## Model assumptions (A1 must not break)

1. **Decay-only trajectory**: the p50 forecast models "no new errors" — the optimistic
   floor. Actual improvement with practice is faster. Do not present p50 as a guarantee.

2. **Abstain when attemptsCount < 3**: `abstain=true` means we cannot project. Show
   a generic "keep practising" message; do NOT show a 0-day estimate or an empty card.

3. **Determinism requires a stable `now`**: call `Date.now()` once and pass it to all
   three functions. Do not call `Date.now()` multiple times in the same render to
   avoid band/forecast timestamp mismatch.

4. **Do not import from `src/lib/tutor/` inside `src/lib/sequencing/`**. The
   `studyOsBoundary` test guards this direction.

5. **Vietnamese text is in `focusSummaryVi`**: do not re-translate or modify this
   string in the UI layer. The forecaster owns the VI content.

---

## Suggested MercyGuide placement

```
MercyGuidePanel — Journey tab
│
├── [Weekly Focus section] ← NEW (S17)
│   ├── "Tuần này tập trung vào:" header
│   ├── FocusCard × up-to-3
│   │   ├── patternName + level badge
│   │   ├── focusSummaryVi (main body)
│   │   └── "Khoảng X ngày" sub-label (when daysToNextLevel != null)
│   └── [hidden when weekFocus.abstain=true → show abstainReason instead]
│
└── [Study Path section] ← existing S15 sequence (A1 already wired)
    └── ordered pattern list from sequenceInterferencePatterns
```

The Weekly Focus (S17) sits above the Study Path (S15) in the Journey tab.
They are complementary: Focus = "here is why and how long", Path = "here is what order".
