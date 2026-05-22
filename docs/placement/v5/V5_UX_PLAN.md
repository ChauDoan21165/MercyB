# V5 UX Plan

> Discovery draft — C1/C2 prioritization required before any implementation.
> All ideas treat V4 core contracts as read-only. No storage/network/provider changes proposed.

---

## 1. UX Principles (inherited from MercyBlade non-negotiables)

| Principle | V5 Application |
|-----------|---------------|
| **Vietnamese-first** | All learner-facing copy authored in Vietnamese first; English is the translation. Diagnostics, plan labels, nudges — VI leads. |
| **Mobile-first** | Every V5 surface must work at 375–414px. No desktop-only layouts. Touch targets ≥ 44px. |
| **Outcomes over engagement** | No streaks, no XP, no leaderboards, no daily-usage pressure. Progress shown as qualitative direction ("improving", "steady"), not numeric scores. |
| **Kids mode sacred** | V5 is adult-learner only. Kids mode surfaces are completely untouched. |
| **No VIP tier** | All V5 features are tier-agnostic. No feature gating by subscription level in the placement UX. |

## 2. V5 Surface Inventory

### 2.1 Enhanced Results Page (Phase A)

**Location:** `src/pages/placement/v3/ResultsPage.tsx` — enhanced, not replaced.

| Component | Source | New in V5 |
|-----------|--------|-----------|
| `ResultsProfile` | V3, kept | No change |
| `GapAnalysisSection` | V3, kept | No change |
| `L1FlagsDisplay` | V3, kept | No change |
| `LearnerDiagnosticsCard` | V4 (#989), **new** | Rendered inline below CEFR profile |
| Confidence visual | **New V5 component** | Per-skill dots below profile |
| Baseline snapshot | **New V5** | `createLearnerMemory` + `appendPlacementSnapshotEvent` |

**Data flow:**
```
PlacementV3Results → buildLearnerDiagnostics(signals) → <LearnerDiagnosticsCard>
PlacementV3Results → createLearnerMemory({ learnerKey }) → appendPlacementSnapshotEvent → persist
```

### 2.2 Study Plan View (Phase B)

**Location:** New page — `src/pages/placement/v5/PlanPage.tsx`

| Component | Source | Description |
|-----------|--------|-------------|
| `DayCard` | New V5 | One day's activities, focus skill badge, intensity |
| `ActivityRow` | New V5 | Lesson title, estimated time, start button, skill icon |
| `FatigueNotice` | New V5 | Gentle suggestion when fatigue ≥ 0.48 |
| `ReviewBadge` | New V5 | "Ôn lại" indicator on review-day activities |
| `PlanLengthToggle` | New V5 | 7 / 28 / 90 day switcher |

**Data flow:**
```
CurriculumLearnerState → generateCurriculumPlan(state, planLength) → CurriculumPlan
CurriculumPlan.days → DayCard[] → ActivityRow[]
CurriculumPlan.diagnostics.fatigueScore → FatigueNotice (if ≥ 0.48)
CurriculumPlan.diagnostics.speakingConfidence → speaking interval adjustment
```

**Route:** `/placement/v5/plan` (or `/placement/plan` if V5 becomes default)

### 2.3 Progress Dashboard (Phase C)

**Location:** New page — `src/pages/placement/v5/ProgressPage.tsx`

| Component | Source | Description |
|-----------|--------|-------------|
| `CefrTimeline` | New V5 | Horizontal dots/curve from `cefrTimeline` |
| `SkillRadar` | New V5 | 5-axis simple visual (no numbers) |
| `SummaryStats` | New V5 | Lessons completed, minutes studied, current streak |
| `MilestoneBanner` | New V5 | Brief acknowledgment on CEFR advance |

**Data flow:**
```
LearnerMemory.cefrTimeline → CefrTimeline
LearnerMemory.skillTrends → SkillRadar
LearnerMemory.lessonMastery → SummaryStats
cefrTimeline (new point vs previous) → MilestoneBanner (on advance)
```

**Route:** `/placement/v5/progress`

### 2.4 Forecast View (Phase D)

**Location:** New page — `src/pages/placement/v5/ForecastPage.tsx`

| Component | Source | Description |
|-----------|--------|-------------|
| `PaceProjection` | New V5 | Current-pace CEFR forecast |
| `WhatIfToggle` | New V5 | Adjust one assumption, see delta |
| `ForecastAccuracyNote` | New V5 | 30-day forecast-vs-actual comparison |
| `AssumptionPicker` | New V5 | Days/week, minutes/session sliders |

**Data flow:**
```
PlacementV3ProgressionInput + StudyPlanAssumptions → simulateProgression → ProgressionSimulationResult
ProgressionSimulationResult.final.overallCefr → PaceProjection
user-adjusted StudyPlanAssumptions → simulateProgression → WhatIfToggle delta
analyzeForecastVsActual(forecast, actual) → ForecastAccuracyNote
```

**Route:** `/placement/v5/forecast`

### 2.5 Recovery & Re-engagement (Phase E)

**Location:** Integrated into existing surfaces — no new page.

| Trigger | Surface | Behavior |
|---------|---------|----------|
| 7+ days since last activity | Plan Page / Home | `ReturnExperience` — single resume button, no guilt |
| Confidence decayed below threshold | Plan Page | `StaleSignalNotice` — suggest quick speaking/listening check |
| `burnoutRisk >= medium` | Plan Page | Reduce daily slots, show `LightDayNotice` |
| `churnRisk >= high` | Plan Page | Surface single high-appeal activity |
| Speaking avoidance ≥ 5 days | Plan Page | Gentle speaking prompt, not a demand |

**Data flow:**
```
computeAdaptiveSignals(memory, plan) → AdaptiveSignalBundle
signalBundle.burnout → BurnoutRisk → LightDayNotice
signalBundle.churn → ChurnRisk → HighAppealActivity
signalBundle.speakingAvoidance → SpeakingAvoidance → GentlePrompt
decayConfidence(skill.confidence, lastObserved, now) → StaleSignalNotice
```

## 3. Component Tree (V5 Full)

```
<PlacementV5Shell>                    ← new layout wrapper, bilingual nav
├── <ResultsPage>                     ← V3, enhanced
│   ├── <ResultsProfile>              ← V3, unchanged
│   ├── <LearnerDiagnosticsCard>      ← V4 (#989), new placement
│   ├── <ConfidenceDots>              ← V5 new
│   ├── <GapAnalysisSection>          ← V3, unchanged
│   ├── <L1FlagsDisplay>              ← V3, unchanged
│   └── <RecommendedLessonsList>      ← V3, unchanged
├── <PlanPage>                        ← V5 new
│   ├── <PlanLengthToggle>            ← V5 new
│   ├── <FatigueNotice>               ← V5 new
│   └── <DayCard>[]                   ← V5 new
│       └── <ActivityRow>[]           ← V5 new
├── <ProgressPage>                    ← V5 new
│   ├── <CefrTimeline>                ← V5 new
│   ├── <SkillRadar>                  ← V5 new
│   ├── <SummaryStats>                ← V5 new
│   └── <MilestoneBanner>             ← V5 new
└── <ForecastPage>                    ← V5 new
    ├── <PaceProjection>              ← V5 new
    ├── <WhatIfToggle>                ← V5 new
    └── <ForecastAccuracyNote>        ← V5 new
```

## 4. Mobile Layout Specifications

| Breakpoint | Layout |
|------------|--------|
| 375–414px (phone) | Single column, stacked cards. Day cards are swipeable horizontally or stacked vertically. Touch targets ≥ 44px. |
| 415–767px (large phone) | Single column, wider cards. Same component order. |
| 768px+ (tablet) | Optional two-column for Results page (profile left, recommendations right). Plan page single column. |
| 1024px+ (desktop) | Two-column where useful. Timeline and radar can sit side-by-side. |

## 5. Performance Budget

| Metric | Target | Rationale |
|--------|--------|-----------|
| New V5 JS (gzipped) | < 15 KB | V4 core already loaded; V5 adds only UI components |
| Plan page render | < 200ms | Curriculum plan is pre-computed, no network on render |
| Forecast computation | < 100ms | `simulateProgression` is pure function, no I/O |
| Lighthouse mobile | ≥ 90 | Existing mobile score baseline is high; V5 must not regress |

## 6. Bilingual Copy Strategy

- All new V5 strings authored in Vietnamese first.
- English translations are secondary, reviewed for naturalness.
- Diagnostic copy from `buildLearnerDiagnostics()` already follows this pattern.
- New components use `<BilingualLabel>` or a V5 equivalent.
- No hardcoded English strings in any new component.

## 7. Non-Goals (V5 explicitly does NOT do)

- ❌ Rebuild the placement test flow (V3 stays)
- ❌ Change the recommendation algorithm
- ❌ Add push notifications or email triggers
- ❌ Add social/sharing features
- ❌ Add gamification (XP, badges, streaks, leaderboards)
- ❌ Add Supabase writes from V5 components (read-only from V4 memory)
- ❌ Add new API endpoints
- ❌ Change the audio pipeline
- ❌ Touch kids mode
- ❌ Add provider activation (mock providers only)
- ❌ Add A/B testing framework
- ❌ Add analytics events beyond what V4 telemetry already captures
