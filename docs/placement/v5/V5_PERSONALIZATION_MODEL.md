# V5 Personalization Model

**Author:** C4 — V5 Intelligence / Personalization Builder
**Date:** 2026-05-21
**Baseline:** `3be4e6ef1` (V4 stack complete)
**Status:** DISCOVERY — no production code

---

## 1. Personalization Hierarchy

V5 personalization operates on three layers, from broadest to most specific:

```
Layer 1: Goal Template     → "What is the learner trying to achieve?"
Layer 2: Learner Archetype → "What kind of learner are they?"
Layer 3: Skill-State Map   → "What do they specifically need right now?"
```

Each layer constrains the layers below it but does not override learner-specific observed data.

---

## 2. Goal Templates (Layer 1)

### 2.1 Template Structure

```typescript
interface GoalTemplate {
  /** Stable identifier for cohort tracking */
  id: string;
  /** Human-readable label (VI) */
  labelVi: string;
  /** Human-readable label (EN) */
  labelEn: string;
  /** Target CEFR level to reach */
  targetCefr: CEFRLevel;
  /** Target timeline in days (approximate) */
  timelineDays: number;
  /** Skill weights — higher = more plan emphasis */
  skillWeights: Record<Skill, number>;
  /** Minimum sessions per week */
  minSessionsPerWeek: number;
  /** Ideal session length in minutes */
  idealSessionMinutes: number;
  /** Whether speaking is a primary skill (enables extra speaking push) */
  speakingIsPrimary: boolean;
}
```

### 2.2 Built-in Templates

| Template | Primary Skills | Target | Timeline | Sessions/Week |
|----------|---------------|--------|----------|---------------|
| `ielts_academic` | reading(3), writing(3), listening(2) | B2 | 90d | 5 |
| `daily_conversation` | speaking(3), listening(3) | A2 | 28d | 3 |
| `business_english` | speaking(2), writing(2) | B1 | 90d | 4 |
| `kids_foundation` | vocabulary(2), pronunciation(2) | A1 | flexible | 3 |
| `general_improvement` | all skills(1) | next level | flexible | 3 |

**Design note:** Templates are static data — a `Record<string, GoalTemplate>` lookup. No runtime computation. Extensible by content team without code changes.

### 2.3 Effect on Curriculum Sequencing

When a goal template is present in `CurriculumLearnerState`:
- `getSkillWeights(goal)` biases the weak-skill targeting algorithm
- `idealSessionMinutes` caps `maxDailyMinutes` unless overridden by archetype
- `speakingIsPrimary` enables `speakingPushMultiplier` even for non-avoider archetypes
- Target CEFR informs `generateCurriculumPlan`'s challenge level ceiling

---

## 3. Learner Archetypes (Layer 2)

### 3.1 Archetype Computation

Archetypes are **computed from telemetry signals**, not manually assigned. The computation is deterministic given the same event history.

```typescript
type LearnerArchetype =
  | "fast_learner"
  | "steady_builder"
  | "struggling_reviewer"
  | "speaking_avoider"
  | "plateaued"
  | "unclassified";

function classifyArchetype(summary: LearnerStateSummary): LearnerArchetype {
  // Rules in priority order (first match wins):
  if (summary.speakingAvoidanceScore > 0.6) return "speaking_avoider";
  if (summary.cefrStagnationDays > 60) return "plateaued";
  if (summary.reviewDebtScore > 0.5 && summary.completionRate < 0.4) return "struggling_reviewer";
  if (summary.completionRate > 0.85 && summary.cefrGainRate > 0.03) return "fast_learner";
  if (summary.completionRate > 0.4) return "steady_builder";
  return "unclassified";
}
```

### 3.2 Archetype Parameters

| Archetype | Plan Intensity | Reviews/Week | Challenges/Week | Speaking Push | Burnout Threshold |
|-----------|---------------|-------------|-----------------|---------------|-------------------|
| fast_learner | intense | 1 | 3 | normal | high (later) |
| steady_builder | balanced | 2 | 2 | normal | normal |
| struggling_reviewer | gentle | 4 | 0 | gentle | low (earlier) |
| speaking_avoider | balanced | 2 | 1 | high (targeted) | normal |
| plateaued | balanced | 3 | 2 | normal | normal |
| unclassified | balanced | 2 | 2 | normal | normal |

### 3.3 Archetype Transition Rules

Archetypes are recomputed each time `summarizeLearnerState` runs. Transitions are expected:
- `fast_learner` → `plateaued` when CEFR gain flattens
- `struggling_reviewer` → `steady_builder` when review debt clears and completion rate improves
- `speaking_avoider` → `steady_builder` when speaking avoidance score drops

**Guard:** No more than one archetype change per 7-day window to prevent thrashing. The orchestrator can enforce this via `recoveryState.active`.

---

## 4. Skill-State Map (Layer 3)

### 4.1 Per-Skill State

```typescript
interface SkillState {
  skill: Skill;
  /** Current CEFR estimate (0..5 mapped from A1..C2) */
  cefrOrdinal: number;
  /** Composite confidence (0..1) */
  confidence: number;
  /** Trend direction over the last 30 days */
  trend: "improving" | "stable" | "declining";
  /** Days since last practice of this skill */
  daysSinceLastPractice: number;
  /** Practice count in last 14 days */
  recentPracticeCount: number;
  /** Whether skill is below the learner's overall CEFR band */
  isWeak: boolean;
  /** Decay-adjusted confidence (confidence after applying skill-specific half-life) */
  decayedConfidence: number;
}
```

### 4.2 Weak-Skill Ranking

Skills are ranked by `decayedConfidence` ascending. The bottom-3 skills are flagged as weak. The curriculum sequencer allocates review/reinforce slots to weak skills first, then cycles through other skills.

Goal templates modify the ranking: for `ielts_academic`, writing and reading are prioritized even if they're not the weakest. The ranking is a **weighted sort** rather than pure confidence sort.

### 4.3 Speaking Avoidance Detection

```typescript
function detectSpeakingAvoidance(
  memory: LearnerMemory,
  summary: LearnerStateSummary,
): number {
  // Composite score 0..1:
  const skipRate = summary.speakingSkipCount / Math.max(1, summary.speakingOpportunityCount);
  const completionGap = summary.nonSpeakingCompletionRate - summary.speakingCompletionRate;
  const recencyPenalty = Math.min(1, summary.daysSinceLastSpeaking / 14);

  return (skipRate * 0.4 + Math.max(0, completionGap) * 0.4 + recencyPenalty * 0.2);
}
```

When speaking avoidance score crosses 0.6, the archetype switches to `speaking_avoider` and the intervention engine fires `avoid_speaking_avoidance`.

---

## 5. L1-Pattern Library

### 5.1 Vietnamese Interference Map

```typescript
interface VnL1Pattern {
  /** Stable pattern id */
  id: string;
  /** Vietnamese name (for learner-visible content) */
  nameVi: string;
  /** English name (for admin/analytics) */
  nameEn: string;
  /** Affected English skill areas */
  affectedSkills: Skill[];
  /** CEFR bands where this pattern is most prevalent */
  cefrBands: CEFRLevel[];
  /** Example English error produced */
  exampleErrorEn: string;
  /** Example correct English */
  exampleCorrectEn: string;
  /** Lesson ids known to drill this pattern */
  knownDrillLessonIds: string[];
}
```

### 5.2 Pattern List

| Pattern ID | Affected Skills | CEFR Bands | Example Error |
|-----------|----------------|------------|---------------|
| `tense_omission` | grammar, writing | A1-B1 | "Yesterday I go to school" |
| `article_drop` | grammar, writing | A1-B2 | "I saw dog in park" |
| `final_consonant` | pronunciation, speaking | A1-A2 | "I lie the boo" (like/book) |
| `tone_intonation` | speaking, listening | A1-B1 | Flat intonation on questions |
| `pronoun_avoidance` | speaking, writing | A1-A2 | "My mother she is teacher" |
| `plural_omission` | grammar, writing | A1-A2 | "I have two dog" |
| `preposition_misuse` | grammar, writing | A2-B2 | "I go to home" |
| `copula_drop` | grammar, speaking | A1 | "She very beautiful" |
| `word_order_inversion` | grammar, writing | A1-B1 | "The car red" (adjective after noun) |
| `classifier_interference` | vocabulary | A1-A2 | Overuse of "piece"/"item" for count nouns |

### 5.3 Pattern Matching Algorithm

```typescript
function matchL1Patterns(
  errorTags: string[],
  learnerCefr: CEFRLevel,
  l1: string,
): VnL1Pattern[] {
  if (l1 !== "vi") return [];
  return VN_L1_PATTERNS.filter((p) =>
    p.cefrBands.includes(learnerCefr) &&
    errorTags.some((tag) => p.affectedSkills.includes(tag as Skill)),
  );
}
```

The curriculum sequencer queries matched patterns to select known drill lessons. The intervention engine appends pattern-specific evidence to `inject_l1_drill` recommendations.

---

## 6. Integration Points

### 6.1 How Personalization Flows Through V4

```
Learner Events
    │
    ▼
aggregateEvents()          → AggregationSummary
    │
    ▼
summarizeLearnerState()    → LearnerStateSummary (V5 new)
    │
    ├──► classifyArchetype() → LearnerArchetype
    ├──► matchL1Patterns()   → VnL1Pattern[]
    │
    ▼
generateCurriculumPlan()   → curriculum plan (now archetype/goal-aware)
    │
    ▼
evaluateAdaptiveLoop()     → signals + plan + diagnostics
    │
    ▼
composeInterventionPlan()  → ranked recommendations with per-archetype thresholds
```

### 6.2 Backward Compatibility

All V5 personalization features are additive:
- `LearnerProfile` is an optional field — absent → V4 default behavior
- `GoalTemplate` is optional — absent → skill weighting is uniform
- Skill-specific decay defaults to 30-day half-life when skill not specified
- Archetype defaults to `unclassified` (V4-equivalent thresholds)
- L1 pattern library returns empty for non-Vietnamese L1

### 6.3 Determinism Guarantee

All personalization functions are pure:
- `classifyArchetype(summary)` — deterministic given `summary` (which is derived from event log)
- `matchL1Patterns(errorTags, cefr, l1)` — deterministic lookup
- `getSkillWeights(goal)` — deterministic lookup
- `computeSkillRecovery(skill, days, count)` — deterministic, no randomness

No `Date.now`, no `Math.random`, no external API calls. Replay-safe by construction.

---

## 7. Vietnamese-First Design

All learner-facing strings in personalization features are bilingual (VI/EN):
- Archetype labels: `Nhanh nhẹn` / "Fast learner", `Ổn định` / "Steady"
- Goal template labels: `Luyện thi IELTS` / "IELTS prep"
- L1 pattern names: `Thiếu thì` / "Tense omission"
- Intervention evidence: Vietnamese text first, English second

Non-judgmental language enforced by the existing `FORBIDDEN_VOCAB` guard in `LearnerDiagnosticsCard`.

---

**C4 STATUS: V5 INTELLIGENCE DISCOVERY READY**

**NEXT ROUTE: C2 CONTRACT REVIEW → C6 EVALUATION HARNESS ALIGNMENT**
