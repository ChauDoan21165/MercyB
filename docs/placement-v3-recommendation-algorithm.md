# Placement V3 Recommendation Algorithm

The placement v3 recommender turns a `CEFRAssessment` into concrete next lessons from MercyBlade's existing lesson catalog. It is pure TypeScript: no Supabase calls, no user mutation, and no UI assumptions.

## Lesson Index

`src/lib/placement/v3/lessonIndex.ts` builds a unified `IndexedLesson[]` from:

- daily lesson cards
- rich L1 micro-lessons
- profession packs
- VSTEP reading, listening, speaking, and writing prep
- pronunciation challenges
- real-world listening clips
- mock interview scenarios
- room JSON metadata from `public/data/*.json`

Each source is normalized into a stable lesson id, English/Vietnamese title, source, best-effort CEFR level, category, subskills, tags, and Vietnamese L1 interference coverage. The L1 coverage is heuristic: explicit `vi_l1_*` rule ids are preserved, and common wording such as `articles`, `past tense`, `final consonants`, or `subjunctive` is mapped to the closest known Vietnamese-transfer rule.

## Ranking Weights

Priority is computed on a 0..1 scale before diversity adjustment:

- **CEFR alignment: 40%**. The scorer finds the learner's lowest skill CEFR and rewards lessons at that level most strongly. Adjacent levels still score well; far-away levels are heavily discounted.
- **Gap targeting: 30%**. `assessment.gaps` strings are normalized and matched against lesson title, category, subskills, tags, and L1 coverage. Direct phrase matches and useful keyword matches both count.
- **L1 remediation: 20%**. `assessment.l1InterferenceFlags` are matched against `lesson.l1InterferenceCoverage`. Severe/high flags carry more weight than low flags.
- **Catalog nudge: +3%**. Daily, rich, and room lessons get a small nudge because they are MercyBlade's direct learning path, not just auxiliary practice.
- **User preferences: small multiplier**. `focusOnGrammar` multiplies grammar lessons by `1.2`. `focusOnPronunciation` multiplies pronunciation lessons by `1.2`. `avoidExamPrep` filters VSTEP lessons out completely.

## Diversity

After initial sorting, the recommender applies a duplicate-category penalty of 5% per repeated category, capped so good matches are not destroyed. This prevents a learner with a broad profile from receiving only grammar cards when listening or pronunciation lessons also match.

## History Exclusion

`recentLessonHistory` is treated as a set of completed lesson ids. Those lessons are removed before scoring, so the top recommendation never repeats a lesson the caller says the learner has already done recently.

## Output

`recommendLessons(ctx)` returns the top 6-12 recommendations, sorted by final priority descending. Each recommendation includes a one-sentence reason and diagnostics for CEFR alignment, matched gaps, and matched L1 patterns so the results screen can explain why MercyBlade is recommending the lesson.

