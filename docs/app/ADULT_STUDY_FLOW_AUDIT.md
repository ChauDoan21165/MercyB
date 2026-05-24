# Adult AI Tutor Study Flow Audit

Date: 2026-05-24
Branch: `a7-adult-study-flow-audit`

## Overall Verdict

**Mostly good but missing guided path.**

The adult AI Tutor has strong building blocks for a Duolingo-style study flow: a clear Teacher Mercy frame, separate Journey / Grammar / Speak / Logic modes, safe local memory summaries, grammar correction, retry practice, and clean learner-facing TTS behavior. The current first-open experience is still closer to an advanced learning workspace than a guided lesson. The learner sees memory status, four equal mode choices, and the selected mode before seeing one primary next action.

The next implementation should keep the advanced modes, but put a simple guided path above them: **Continue today's lesson** or **Start 5-minute lesson**.

## Checklist

| Area | Current behavior | Duolingo-like ideal | Status | Evidence files/components |
| --- | --- | --- | --- | --- |
| First-time adult learner flow | AI Tutor opens with the Teacher Mercy shell, memory/reminder content, four mode tabs, and default Grammar mode. | A single obvious action such as "Continue today's lesson" or "Start 5-minute lesson", with optional mode choices below. | Gap | `src/pages/AiTutor.tsx`, `src/components/teacher-mercy/TeacherMercyLearningShell.tsx`, `src/components/teacher-mercy/TeacherMercyModeTabs.tsx` |
| One clear next action | All four modes are shown as equal choices. Grammar is selected by default, but the user still has to infer what to do next. | One recommended lesson CTA based on target language and memory. | Gap | `src/pages/AiTutor.tsx`, `TeacherMercyModeTabs.tsx` |
| Short lessons | There is no visible lesson length, session goal, or completion loop. | A short framed activity, such as 5 minutes or 3-5 prompts. | Gap | `src/pages/AiTutor.tsx` |
| Learn by doing | Grammar and conversation modes ask the learner to type or speak. | Learner answers first, then receives targeted correction and next prompt. | Mostly good | `CorrectionMode.tsx`, `ConversationMode.tsx` |
| Immediate feedback | Grammar gives correction, explanation, tip, practice prompt, and feedback. Conversation modes respond after submit. | Prompt -> answer -> correction -> retry -> next step. | Good for Grammar, partial for other modes | `CorrectionMode.tsx`, `ConversationMode.tsx` |
| Retry mistakes | Grammar has a practice answer and "Try another" loop. Journey, Speak, and Logic do not have explicit retry-mistake structure. | Every mistake creates a focused retry before moving on. | Partial | `CorrectionMode.tsx`, `ConversationMode.tsx` |
| Gradual difficulty | Target language is routed and mode-specific copy exists, but no visible difficulty ladder or adaptive sequence exists. | Difficulty should increase from easy repair to free response to speaking and logic. | Gap | `src/pages/AiTutor.tsx`, `src/lib/tutor/productConfigs.ts` |
| Mode clarity | Docs define modes clearly. UI labels and descriptions exist. Logic is intended as English thinking / Vietlish reasoning. | Journey = conversation, Grammar = repair, Speak = speaking practice, Logic = reasoning with no audio UI. | Partial | `docs/app/APP_LOGIC_FLOW.md`, `ConversationMode.tsx`, `CorrectionMode.tsx` |
| Logic mode audio boundary | TTS buttons are hidden in Logic messages, but the shared conversation input still renders mic controls. | Logic must not show speaker, TTS, mic, or fallback voice labels. | Gap | `docs/app/APP_LOGIC_FLOW.md`, `ConversationMode.tsx` |
| Memory and review | Memory card shows correction count, practiced count, strongest topic, topic needing review, last practiced, and suggested next focus. | Memory should directly create a "Today's recommended lesson" feeling. | Partial | `TutorMemoryCard.tsx`, `src/lib/ai-tutor/learningMemory.ts` |
| Motivation and progress | The learner can see counts and topics after practice. There is no daily streak, lesson completion, daily goal, or mastery progress. | Streak, daily goal, completed lesson state, topic mastery, and next goal. | Gap | `TutorMemoryCard.tsx`, `src/pages/AiTutor.tsx` |
| Cognitive load | Header, memory state, mode tabs, voice controls, and selected mode appear before the learner has started. | Keep first open focused: one CTA, one recommended lesson, optional modes below. | Gap | `TeacherMercyLearningShell.tsx`, `TeacherMercyModeTabs.tsx`, `CorrectionMode.tsx` |
| Safety | Audited flow uses local summary memory and clean speakable output. No raw audio storage, full transcript storage, Supabase memory sync, Placement writeback, or provider/env changes were found in the inspected flow. | Safe summary-only memory and no client-side provider secrets. | Good | `docs/app/APP_LOGIC_FLOW.md`, `src/pages/AiTutor.tsx`, `src/lib/ai-tutor/learningMemory.ts` |

## Audit Answers

### 1. First-time adult learner flow

The next action is not obvious enough. Grammar is selected by default, but the page still asks the learner to understand the Teacher Mercy header, memory state, four mode tabs, mic controls, and a correction textarea. This is usable for a motivated adult, but it is not yet a simple guided study path.

Ideal first open:

```text
AI Tutor
-> Continue today's lesson
-> Start 5-minute lesson
-> Optional mode choices below
```

### 2. Lesson loop

Grammar has the strongest loop:

```text
Learner enters sentence
-> Mercy corrects
-> Mercy explains
-> learner retries with a practice prompt
-> Mercy gives feedback
-> Try another
```

Journey, Speak, and Logic share the conversation component. They support prompt -> learner answer -> Mercy response, but they do not yet enforce a retry step or a short lesson sequence. Speak is not distinct enough from Journey, and Logic should be a text-only reasoning mode without mic UI.

### 3. Mode clarity

The mode definitions are clear in `APP_LOGIC_FLOW.md` and mostly clear in UI copy:

- Journey = conversation practice.
- Grammar = sentence correction and repair.
- Speak = speaking practice.
- Logic = English thinking / Vietlish reasoning.

The main clarity issue is hierarchy. The modes are all presented at the same level before a guided lesson starts. Logic also inherits conversation input controls, including mic controls, which conflicts with the intended no-audio Logic boundary.

### 4. Memory and review

Memory is safe and useful, but it is not yet the driver of the study path. The current memory card displays summary fields, including strongest topic, topic needing review, and suggested next focus. That should become the source for a recommended lesson CTA.

No raw audio storage, full transcript storage, Supabase memory sync, or Placement writeback was found in the audited AI Tutor study flow.

### 5. Motivation and progress

The current flow has basic progress signals: correction count, practiced count, strongest topic, topic needing review, and suggested next focus. It does not yet have a daily streak, daily practice goal, completed lesson state, topic mastery, or a visible next goal.

### 6. Cognitive load

The first-open screen is too complex for a Duolingo-like experience. It is appropriate for an advanced tutor workspace, but adult learners should first see one recommended action. Advanced mode selection should remain available below the recommended lesson path.

## Top 5 Gaps

1. No primary "Continue today" or "Start 5-minute lesson" action.
2. Memory is displayed but does not choose or label the recommended next lesson.
3. Four modes are presented as equal choices before the learner starts.
4. Speak and Logic do not have distinct enough loops; Logic still shows mic UI through the shared conversation component.
5. Progress and motivation are limited to summary counts and topics; there is no streak, daily goal, completion state, or mastery signal.

## Recommended Fixes

### P0 Blocking

- Add a guided lesson card above the mode tabs with **Continue today's lesson** or **Start 5-minute lesson**.
- Use memory summary fields to choose the recommended focus: target language, topic needing review, strongest topic, and suggested next focus.
- Remove mic controls from Logic mode and keep Logic text-only.
- Add a short mixed-practice orchestrator:

```text
Grammar repair
-> retry the mistake
-> one Journey response
-> one Speak prompt
-> one Logic explanation
-> memory summary
-> next recommended lesson
```

### P1 Important

- Give each mode a tighter loop:
  - Journey: one conversation prompt, correction, next question.
  - Grammar: keep current correction and retry flow.
  - Speak: spoken/typed answer, pronunciation or naturalness feedback, retry.
  - Logic: one Vietlish contrast, one natural English pattern, one short rewrite.
- Add a session completion state for the guided 5-minute lesson.
- Add daily practice count or daily goal progress.
- Label the recommended lesson with memory context, such as "Review articles in English" or "Continue French correction practice."

### P2 Polish

- Add a streak or lightweight consistency indicator.
- Add topic mastery chips after multiple successful practices.
- Reduce status labels and helper copy before the learner starts.
- Add "Why this lesson" copy based on safe memory summaries.

## Proposed Adult AI Tutor Study-Flow Map

```text
AI Tutor
-> Today card
   -> Continue today's lesson
   -> Start 5-minute lesson
-> 5-minute mixed practice
   -> Grammar correction
   -> Retry mistake
   -> Journey conversation turn
   -> Speak practice line
   -> Logic explanation for one Vietlish pattern
   -> Memory summary updates locally
   -> Next recommended lesson
-> Optional advanced modes
   -> Journey
   -> Grammar
   -> Speak
   -> Logic
```

## What Not To Copy From Duolingo

- Do not add pressure mechanics that make adults feel punished.
- Do not use fake scarcity, dark patterns, or excessive interruption loops.
- Do not over-gamify the tutor so correction quality becomes secondary.
- Do not force every learner into a childish tone or mascot-heavy flow.
- Do not hide useful adult controls once the learner wants focused practice.

## What MercyB Should Do Better Than Duolingo

- Teach Vietlish logic directly, especially why a Vietnamese structure sounds unnatural in English.
- Use Teacher Mercy voice and personality where it helps learning, while keeping Logic text-only.
- Keep memory safe: local, summary-only, and free of raw transcripts or raw audio.
- Personalize correction by target language, topic needing review, and suggested next focus.
- Respect adult learners with clear explanations, concise motivation, and optional advanced modes.

## Recommended Next Implementation PRs

1. `feat(ai-tutor): add guided daily lesson entry`
2. `fix(ai-tutor): remove audio controls from logic mode`
3. `feat(ai-tutor): use memory for recommended lesson focus`
4. `feat(ai-tutor): add adult lesson completion and daily goal state`
5. `feat(ai-tutor): separate speak and logic practice loops`
