# V5 Learner Journey

> Discovery draft — C1/C2 prioritization required before any implementation.
> V5 builds on V4 core contracts without changing them. V4 stack: #968 + #988 + #989 + #991.

---

## 1. Current V4 Learner Journey (baseline)

### 1.1 Placement Entry
- Learner lands on `WelcomePage` (V3) — language pair selection, purpose prompt
- `WhoForPage` (V3) — self-assessment of current level, study goals
- `TestPage` (V3) — multi-modality assessment (speaking, listening, reading, writing, conversation)
- Session orchestrated by `PlacementV3SessionOrchestrator`

### 1.2 Results (V3)
- `ResultsPage` (V3) shows:
  - CEFR overall level + per-skill breakdown (`ResultsProfile`)
  - Gap analysis — strengths + gaps (`GapAnalysisSection`)
  - L1 interference flags (`L1FlagsDisplay`)
  - Recommended lessons (`RecommendedLessonsList`)
  - Resume lesson persistence (`ActiveLessonMarker` in localStorage)
- All copy bilingual VI/EN
- Mobile-responsive at 375–414px

### 1.3 Post-Results (V3 → V4 gap)
- Learner navigates to recommended lessons manually
- **No adaptive follow-up** — no check-in, no re-assessment trigger, no progress dashboard
- **No longitudinal view** — each placement is a standalone snapshot; learner can't see how they've changed over months
- **No study plan** — recommendations are lessons, not a sequenced plan with review cadence
- **No intervention** — burnout, churn, stagnation, speaking avoidance are undetected

### 1.4 V4 Capabilities (available but not yet surfaced to learner)

| V4 Module | Capability | Learner-Facing Potential |
|-----------|-----------|--------------------------|
| `learnerMemory` | Longitudinal CEFR timeline, skill trends, lesson mastery | Progress timeline, "you were A1 in March, now A2" |
| `curriculumSequencer` | 7/28/90-day study plans with fatigue adjustment | Personalized daily plan, "today: 3 activities, focus on speaking" |
| `progressionSimulator` | Forecast future CEFR under different study assumptions | "If you study 5 days/week, you'll reach B1 by August" |
| `interventionEngine` | Burnout, churn, stagnation, speaking avoidance detection | Supportive nudges, "take a lighter day" or "your pronunciation is improving" |
| `diagnostics` | `LearnerDiagnostic[]` — bilingual, non-judgmental | Inline cards: "Focus this week: listening", "Speaking confidence: up 12%" |
| `adaptiveOrchestrator` | Event-driven adaptive loop | Real-time adaptation to lesson completions, retries, skips |
| `forecastAnalysis` | Forecast-vs-actual deviation reports | "You're ahead of your projected pace in reading" |

---

## 2. V5 Learner Journey — Proposed Phases

### Phase A: Immediate Post-Test (V5 enhances V3 ResultsPage)

**Goal:** Turn the static results page into a launchpad for adaptive learning.

- **A1. Diagnostic cards inline.** Below the CEFR profile, render `<LearnerDiagnosticsCard>` with 2–4 diagnostics from `buildLearnerDiagnostics()`. Examples:
  - "Tuần này, tập trung vào: Nghe hiểu" / "Focus this week: Listening"
  - "Hôm nay có vẻ hơi nhiều — học 2 bài thôi nhé" / "Today feels full — try 2 lessons"
- **A2. Confidence visualization.** Show per-skill confidence as a simple visual (filled/empty dots, not percentages). No numbers that invite comparison/gamification.
- **A3. "Your starting point" snapshot.** Save the first placement result to `learnerMemory` and show a simple "This is your baseline — we'll track how you grow" message.

### Phase B: Study Plan Dashboard (new V5 surface)

**Goal:** Replace the static lesson list with a sequenced, adaptive plan.

- **B1. Daily plan view.** Render `CurriculumPlan` output as a scrollable day-by-day list. Each day shows:
  - Focus skill (icon + bilingual label)
  - 2–4 activities with lesson titles, estimated time, and a "Start" button
  - Intensity badge: 🌱 Nhẹ nhàng / ⚡ Tiêu chuẩn / 🔥 Thử thách
- **B2. Fatigue indicator.** If `fatigueScore >= 0.48`, show a gentle suggestion to take a lighter day. Never punitive.
- **B3. Review prompts.** When a review day arrives, surface it: "Hôm nay ôn lại: [lesson title] — bài này bạn học cách đây 7 ngày"
- **B4. Speaking confidence loop.** If speaking confidence is low, intersperse speaking activities every 2–3 days rather than forcing them daily. Show encouraging micro-copy.

### Phase C: Progress & Timeline (new V5 surface)

**Goal:** Show the learner their growth over time, not just a point-in-time score.

- **C1. CEFR timeline.** A simple visual: horizontal dots or a gentle curve showing CEFR checkpoints over calendar months. "Bạn bắt đầu ở A1 (tháng 3) → A2 (tháng 6)."
- **C2. Skill-by-skill radar.** A 5-axis simple view (speaking, listening, reading, writing, conversation) showing current level vs starting level. No numbers — filled arcs or colored bands.
- **C3. "Since you started" summary.** Aggregate stats shown sparingly: lessons completed, minutes studied, streak days. Never shown as a leaderboard or comparison.
- **C4. Milestone celebrations.** When CEFR level advances, show a brief, warm acknowledgment. No gamification currency, no streak-shaming.

### Phase D: Forecast & Goal-Setting (new V5 surface)

**Goal:** Help the learner set realistic expectations and see their potential trajectory.

- **D1. "Your pace" projection.** Run `simulateProgression` with the learner's actual study patterns (days/week, minutes/session) and show: "Với nhịp độ hiện tại, bạn có thể đạt B1 vào khoảng tháng 9."
- **D2. "What if" toggle.** Let the learner adjust one assumption (e.g., "What if I study 5 days instead of 3?") and see the projected difference. Frame as curiosity, not pressure.
- **D3. Forecast accuracy.** Every 30 days, compare forecast to actual: "Bạn đang đi đúng hướng — kỹ năng đọc của bạn tiến bộ nhanh hơn dự đoán."

### Phase E: Recovery & Re-engagement (V5 adaptive surface)

**Goal:** Bring learners back after gaps without guilt.

- **E1. Return experience.** After 7+ days away, show a gentle "Chào mừng trở lại — đây là bài bạn đang học dở" with a single resume button. No "you missed X days" messaging.
- **E2. Stale signal recovery.** When confidence on a skill has decayed below threshold, suggest a quick re-check (not a full re-test): "Đã lâu rồi bạn chưa luyện nói — làm một bài ngắn để mình cập nhật nhé?"
- **E3. Burnout protection.** When `burnoutRisk >= medium`, reduce daily activity count automatically and show: "Hôm nay học nhẹ nhàng thôi — 2 bài là đủ rồi."
- **E4. Churn prevention.** When `churnRisk >= high`, surface a single high-value activity: "Bài này nhiều người học thấy thích — thử xem sao?"

---

## 3. Journey Map (V5 Full)

```
┌──────────────┐    ┌──────────────────┐    ┌─────────────────────────┐
│ PLACEMENT    │    │ RESULTS +        │    │ DAILY PLAN              │
│ TEST         │───▶│ DIAGNOSTICS      │───▶│ (curriculumSequencer)   │
│ (V3, kept)   │    │ (V5 Phase A)     │    │ (V5 Phase B)            │
└──────────────┘    └──────────────────┘    └───────────┬─────────────┘
                                                        │
                                          ┌─────────────▼─────────────┐
                                          │ PROGRESS DASHBOARD        │
                                          │ (V5 Phase C)              │
                                          │ - CEFR timeline           │
                                          │ - Skill radar             │
                                          │ - Milestones              │
                                          └───────────┬─────────────┘
                                                      │
                                          ┌───────────▼─────────────┐
                                          │ FORECAST + GOALS         │
                                          │ (V5 Phase D)             │
                                          │ - Projected pace         │
                                          │ - What-if toggle         │
                                          └───────────┬─────────────┘
                                                      │
                                          ┌───────────▼─────────────┐
                                          │ RECOVERY + ADAPTIVE      │
                                          │ (V5 Phase E)             │
                                          │ - Return after gap       │
                                          │ - Stale signal refresh   │
                                          │ - Burnout / churn guard  │
                                          └─────────────────────────┘
```

---

## 4. What V5 Does NOT Change

- **Placement test flow (V3).** The assessment itself remains V3 — V5 enhances what happens after.
- **V4 core contracts.** No changes to `learnerMemory`, `curriculumSequencer`, `progressionSimulator`, `providerRegistry`, telemetry, or orchestration.
- **Recommendation engine.** Recommendations still produced by V3 recommender; V5 adds adaptive overlay but doesn't replace.
- **Lesson content.** Room JSON, audio, rendering — all untouched.
- **Mobile architecture.** No new native dependencies, no Capacitor plugin changes.
- **Kids mode.** Completely untouched — V5 is adult-learner only for now.
