# MercyB Roadmap

## Long-term Vision — The Ladder

| Stage | Name | What it does |
|-------|------|-------------|
| 1 | **Lesson App** | Basic lessons and exercises. |
| 2 | **AI Tutor** | Teacher Mercy answers, corrects, and guides the learner. |
| 3 | **Study OS** | Controls the study path — what the learner knows, what they are weak at, what to study next, how to review. |
| 4 | **Learning Intelligence Platform** | Learns which teaching method works best for each learner, age, language background, and mistake pattern. |
| 5 | **Education Ecosystem** | Connects students, parents, teachers, classes, curriculum, and progress. |
| 6 | **Personal AI School** | A full personal school experience that adapts to each learner. |
| 7 | **AI Education Civilization Layer** | AI education infrastructure for many learners, families, teachers, and schools. |
| 8 | **AI Human Potential Infrastructure** | Helps learners grow beyond language: thinking, confidence, career, creativity, life skills. |
| 9 | **AI Civilization Partner** | Supports families, communities, schools, and larger systems with better learning and decisions. |
| 10 | **AI Co-Evolution System** | Humans improve the AI, and AI improves humans, continuously. |
| 11 | **AI Legacy System** | Preserves and transfers family wisdom, language, culture, and values across generations. |

## Current Build Path

1. Finish foundation.
2. Build Study OS.
3. Add Today's Lesson Planner.
4. Add Vietlish Logic Diagnosis Engine.
5. Add safe memory summary.
6. Add progress / mastery graph.
7. Add parent / teacher dashboard.
8. Expand to school ecosystem.

## Stage 3 Study OS Boundaries

Stage 3 Study OS is four related directions, not one vague analytics blob:

- What the learner knows.
- What the learner is weak at.
- What to study next.
- How to review.

Safe local event summaries, such as summaries derived from #1109 local learning events, are only the behavioral signal layer for Study OS. They may later inform progress, momentum, or next-focus UI, but they do not replace the four directions above.

Study OS event summaries must stay:

- local-only
- time-windowed
- behavioral/activity-based
- derived from safe counts, booleans, and timestamps only

Study OS event summaries must not include raw learner content, full transcripts, raw audio, corrected sentence text, PII, child identity, Placement result/status/writeback, Supabase sync, or external analytics.

`mercy_user_facts` / episodic memory is semantic person memory: what Mercy remembers about the learner/person. Study OS event summaries are not semantic memory: they describe what the learner has been doing recently in study flows. Do not read, write, merge, or sync Study OS event summaries with `mercy_user_facts` unless a later explicit reviewed design approves it.

## Rule

Big vision is allowed. Execution stays focused on the next brick.
