# Repo Logic Inspection Protocol

Date: 2026-05-24

Purpose: give Inspector and future agents a repeatable way to read MercyB as one continuous product system and find wrong flows, duplicated UI, orphaned components, stale code, confusing CTAs, route mismatches, and safety boundary drift.

This is an audit protocol. Do not change product code while running it unless a separate task explicitly asks for fixes.

## 1. Read Product Source Of Truth

Read in this order:

1. [APP_LOGIC_FLOW.md](./APP_LOGIC_FLOW.md)
2. [CONTINUOUS_LOGIC_FLOW_MAP.md](./CONTINUOUS_LOGIC_FLOW_MAP.md)
3. [FLOW_COMPLIANCE_PLAYBOOK.md](./FLOW_COMPLIANCE_PLAYBOOK.md)
4. [FLOW_COMPLIANCE_AUDIT.md](./FLOW_COMPLIANCE_AUDIT.md)
5. [TEACHER_MERCY_LEARNING_OS.md](./TEACHER_MERCY_LEARNING_OS.md)
6. [STRATEGY.md](../../STRATEGY.md)
7. [ROADMAP.md](../../ROADMAP.md)

Before inspecting code, write down the expected product split:

- Mercy Kids = picture + speak only.
- AI Tutor Adult = guided study with Today’s Lesson, modes, memory, correction, speaking practice, logic diagnosis, and progress.
- Logic mode = English/Vietlish reasoning only, no TTS, mic, speaker, or fallback voice labels.
- Floating Mercy Helper = guidance/navigation only.
- Memory = local summary-only unless separately approved.

## 2. Build Route Inventory

For each learning route, record:

- route path
- target user
- first action
- owning component
- visible buttons
- visible tabs
- visible toggles
- visible voice controls
- memory/progress UI
- CTAs and where they route

Minimum routes to inspect:

| Route | Expected owner | Expected first action |
| --- | --- | --- |
| `/` | Home / route selection | Choose learning destination |
| `/kids/vi-english` | Mercy Kids | Choose picture |
| `/ai-tutor` | AI Tutor Adult | Today’s Lesson or choose mode |
| `/ai-tutor?target=fr` | AI Tutor Adult | Practice French target |
| `/ai-tutor?target=zh` | AI Tutor Adult | Practice Chinese target |
| `/languages/*` pages with AI Tutor CTA | Routes/CTA | Open target-aware AI Tutor |
| Floating `MercyGuide` surfaces | Floating Helper | Navigate to Kids or AI Tutor, or close/minimize |

Suggested commands:

```bash
rg -n "path=.*ai-tutor|kids/vi-english|AiTutor|ViKidsEnglishTutor|MercyGuide" src/router src/pages src/components -S
rg -n "Mở AI Tutor|Vào Mercy Kids|/ai-tutor|/kids/vi-english" src/pages src/components -S
```

## 3. Build Component Ownership Inventory

For each major component, record:

- product owner: Mercy Kids / AI Tutor / Floating Helper / Shared / Legacy / Unknown
- route owner
- user action supported
- allowed UI elements
- forbidden UI elements
- tests that protect it

Use this ownership table as the baseline:

| Product owner | Typical components | Allowed | Forbidden |
| --- | --- | --- | --- |
| Mercy Kids | `ViKidsEnglishTutor.tsx` | picture buttons, simple mic, short Mercy response, reward/next picture | Journey/Grammar/Speak/Logic tabs, textarea main flow, memory card, adult correction panel |
| AI Tutor | `AiTutor.tsx`, `CorrectionMode.tsx`, `ConversationMode.tsx`, `TutorMemoryCard.tsx` | Today’s Lesson, modes, correction, retry, memory summary, voice where allowed | Kids picture grid as main flow, unsafe memory sync, raw input spoken as correction |
| Logic mode | `ConversationMode.tsx` with `mode="logic"` | reasoning text, contrast examples, retry prompt | mic, speaker, TTS, voice fallback labels, "Mercy đọc" |
| Floating Helper | `MercyGuide.tsx`, `MercyGuidePanel.tsx` | Teacher Mercy identity, close/minimize, simple helper text, route CTAs | product selector, Kids workspace, AI Tutor mode tabs, level/support selector |
| Voice | `useTtsSpeaker.ts`, `voiceEngine.ts`, `mercyVoice.ts`, `supabase/functions/mercy-tts/*` | clean learner-facing speech | provider secrets client-side, raw input speech, Logic mode voice |
| Memory | `learningMemory.ts`, `TutorMemoryCard.tsx` | aggregate summary fields | raw learner text, full transcript, raw audio, Supabase sync |
| Tutor engines | `todayLessonPlanner.ts`, `vietlishLogicEngine.ts`, `tutorEngine.ts` | structured lesson/correction/logic outputs | storage side effects, provider/env changes, Placement writeback |

## 4. Scan For Forbidden UI

Search the repo for these terms:

```text
Mercy Kids
AI Tutor
Journey
Grammar
Speak
Logic
Mercy đọc
Device voice
Mercy voice
mic
microphone
textarea
memory
Mở AI Tutor
Vào Mercy Kids
/ai-tutor
/kids/vi-english
level
leaf
tree
support
explain
```

Suggested command:

```bash
rg -n "Mercy Kids|AI Tutor|Journey|Grammar|Speak|Logic|Mercy đọc|Device voice|Mercy voice|mic|microphone|textarea|memory|Mở AI Tutor|Vào Mercy Kids|/ai-tutor|/kids/vi-english|level|leaf|tree|support|explain" src docs/app -S
```

Interpretation rule: a term is not automatically a bug. Flag it only when it appears in the wrong owner, route, mode, or user flow.

## 5. Detect Wrong Flow

Flag as FAIL if:

- Mercy Kids route shows AI Tutor modes.
- AI Tutor route shows Kids as the main workflow.
- Logic mode shows mic/speaker/TTS.
- Floating helper acts as product selector.
- CTA label and route do not match.
- Memory shows raw learner text.
- Voice reads raw learner text.
- Unused/legacy component still appears reachable.
- Component has no clear route/product owner.

Use the continuous map as the expected behavior, not local component naming.

## 6. Detect Duplication

Flag duplicated logic if:

- two components implement the same product flow
- old Kids panel and new Kids flow both exist and are both reachable
- old AI Tutor TTS path and new sanitized path both exist but one is not used
- multiple CTAs route to different places with the same label
- duplicate mode config exists in separate files without clear source of truth

For every duplicate candidate, record whether it is:

- `REACHABLE_DUPLICATE`
- `STATIC_DUPLICATE_NEEDS_REVIEW`
- `TEST_ONLY_DUPLICATE`
- `DOCS_ONLY_REFERENCE`

Do not delete duplicate candidates in an audit PR. Report them.

## 7. Detect Orphaned Code

Mark a component as `ORPHAN_CANDIDATE` if:

- no route imports it
- no tests reference it
- no doc mentions it
- it has old product naming
- it conflicts with the current logic map

Suggested commands:

```bash
rg -n "ComponentName|function ComponentName|export default ComponentName" src docs -S
rg -n "from ['\"].*ComponentName|import .*ComponentName" src -S
```

Do not delete orphaned code in this audit. Only report it.

## 8. Evidence Format

Every finding must use this format:

- Finding ID
- Severity: P0 / P1 / P2
- Route
- File/component
- Observed behavior/code
- Expected behavior from logic map
- Why it matters
- Recommended action
- Safe owner to fix

Table format:

| Finding ID | Severity | Route | File/component | Observed behavior/code | Expected behavior from logic map | Why it matters | Recommended action | Safe owner to fix |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F-001 | P1 | `/example` | `src/path/File.tsx` | What was found | What should happen | User/product risk | Specific next step | A builder/fixer agent |

## 9. Severity Definitions

P0:

- Kids and AI Tutor mixed in a live route.
- Client-side secret exposure.
- Raw audio/transcript storage.
- Wrong CTA sending children to advanced AI Tutor.
- Logic mode reintroduces mic/TTS.
- Production flow breaks.

P1:

- Confusing copy or button route mismatch.
- Duplicated reachable UI.
- Old mode control visible.
- Memory/voice status confusing.
- Flow has too many choices before first action.

P2:

- Copy polish.
- Layout clarity.
- Missing tests.
- Stale docs.
- Orphan candidate not reachable.

## 10. Inspector Output

Inspector final report should include:

- overall verdict:
  - `FLOW ALIGNED`
  - `MOSTLY ALIGNED`
  - `NOT ALIGNED`
  - `BLOCKED`
- top P0/P1 issues
- duplicate/redundant code candidates
- orphan candidates
- PRs required
- what not to touch
- production verification notes

The report must separate confirmed findings from needs-review candidates. Do not speculate without file/component evidence.

## 11. Minimal Command Set

For a docs-only inspection PR:

```bash
git status --short
rg -n "Mercy Kids|AI Tutor|Journey|Grammar|Speak|Logic|Mercy đọc|Device voice|Mercy voice|mic|microphone|textarea|memory|Mở AI Tutor|Vào Mercy Kids|/ai-tutor|/kids/vi-english|level|leaf|tree|support|explain" src docs/app -S
rg -n "path=.*ai-tutor|kids/vi-english|AiTutor|ViKidsEnglishTutor|MercyGuide" src/router src/pages src/components -S
rg -n "speak\\(|speechSynthesis|Audio\\(|fetchCloudTtsUrl|mercy-tts|localStorage|indexedDB|supabase|placement" src/components src/lib src/pages supabase/functions -S
git diff --check
```

If product code changes accidentally, revert those code changes before committing. If pre-commit hooks run, report their result. A full build is not required for docs-only PRs unless the repo or reviewer requires it.

## 12. Safety Guardrails

During inspection:

- Do not change product code.
- Do not delete files.
- Do not rename components.
- Do not touch Placement.
- Do not change provider/env/secrets/access behavior.
- Do not add raw audio storage.
- Do not add transcript storage.
- Do not add Supabase memory sync.
- Do not alter tests unless only docs links require it.

During fix PRs spawned from inspection:

- Keep each PR small and tied to one finding.
- Prefer tests around product boundaries: Kids no tabs, Logic no voice, voice no raw input, memory no raw text, CTAs route correctly.
- Keep Mercy Kids, AI Tutor, and Floating Helper ownership separate.
