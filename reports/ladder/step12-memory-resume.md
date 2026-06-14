# Ladder Step 12: Memory Resume Proof

## Persisted memory shape

The AI tutor memory layer persists one safe aggregate record per tutor product and target language in IndexedDB:

- Database: `mb-ai-tutor`
- Store: `memorySummaries`
- Key: `memoryKey`, for example `ai-tutor:en`
- Stored fields: product/language namespace, safe topic tags, aggregate counts, confidence trend, timestamps, and generated correction IDs for practice bookkeeping.

The persisted test record contains aggregate fields such as:

- `memoryKey: "ai-tutor:en"`
- `totalCorrections: 3`
- `practicedCount: 2`
- `strongestTopic: "past tense"`
- `topicCounts: { "past tense": 3 }`

It does not persist raw learner text, raw audio, transcripts, full conversation history, PII, JWTs, provider output, or learner/user IDs.

## Privacy assertions

The step 12 tests assert that persisted memory and next-session planning output do not contain:

- Raw learner text: `I send money yesterday to my sister.`
- Raw audio marker: `raw learner audio bytes`
- Transcript marker: `full transcript from session one`
- Full conversation history marker
- Email addresses
- UUID-like user identifiers
- JWT-like tokens
- Privacy-sensitive words such as `audio`, `transcript`, `conversation history`, and `raw learner`

The memory tag sanitizer was tightened so sentence-like tags, JWT/Bearer tokens, and privacy-sensitive labels collapse to the safe aggregate tag `general` instead of being stored verbatim.

## Resume test result

Added `src/lib/tutor/tests/memoryResume.e2e.test.ts`.

The test simulates two sessions:

1. Session one starts with empty memory and gets the starter lesson plan.
2. Session one writes three safe aggregate correction events for `past tense`, while attempted raw learner text/audio/transcript/PII/JWT/full-history fields are attached to the input object.
3. The test reads the actual IndexedDB record and asserts only safe aggregate memory persisted.
4. Session two loads `getMemorySummary("ai-tutor", "en")` and passes it to `planTodayLesson`.
5. The next-session plan changes from the starter focus to `past tense`, proving persisted cross-session learner memory affects tutor planning.

Verification command:

```bash
npx vitest run src/lib/ai-tutor/__tests__/learningMemory.test.ts src/lib/tutor/tests/memoryResume.e2e.test.ts src/lib/tutor/tests/todayLessonPlanner.test.ts
```

Result: 3 test files passed, 18 tests passed.
