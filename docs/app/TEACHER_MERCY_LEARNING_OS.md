# Teacher Mercy Learning OS

This document is the master implementation spec for the Teacher Mercy smart study architecture. It defines the product boundaries, adult learning flow, core engines, data rules, and phased delivery plan.

The system must be built in safe layers. Do not build this as one giant PR. Each phase should be small, focused, tested, and reversible.

## Product Split

Teacher Mercy has two separate learning products.

```text
Home
|-- Mercy Kids
|   `-- Picture + speak only
|
`-- AI Tutor Adult
    `-- Guided learning system
```

### Mercy Kids

Mercy Kids is for very young learners.

Rules:

- Picture + speak only.
- No adult dashboard.
- No Journey / Grammar / Speak / Logic mode tabs.
- No textarea-centered correction workflow.
- No complex memory card.
- No advanced logic diagnosis.
- No AI Tutor CTA inside the Mercy Kids card.
- No raw audio storage.
- No full transcript storage.

Expected Mercy Kids loop:

```text
Choose picture
-> tap speak
-> child says a word or short phrase
-> Mercy responds simply
-> reward / next picture
```

Mercy Kids can use repetition, simple encouragement, and kid-safe reward feedback. It must not become the adult AI Tutor interface.

### AI Tutor Adult

AI Tutor Adult is the guided Teacher Mercy study system for older learners and adults.

Rules:

- Includes Today's Lesson, modes, memory summary, logic diagnosis, progress, and next focus.
- Uses guided practice instead of one-off correction only.
- Keeps Logic mode text-only: no TTS, mic, speaker controls, or voice fallback labels.
- Uses summary-only local memory unless a later PR explicitly approves sync.
- Can use cloud voice only through server-side providers.
- Must never expose provider keys in the client.

Supported entry routes:

```text
/ai-tutor
/ai-tutor?target=fr
/ai-tutor?target=zh
/ai-tutor?target=<language-code>
```

## Adult AI Tutor Flow

The adult flow should feel like a guided study session, not a blank tool.

```text
Home / AI Tutor
-> Continue Today's Lesson
-> 5-minute practice
-> correction
-> retry
-> one logic explanation
-> memory summary update
-> next recommended lesson
```

### Session Shape

A normal session should fit into a short daily practice loop.

```text
1. Start
   `-- Show Today's Lesson and the reason it was recommended.

2. Practice
   `-- Give one focused prompt or micro-task.

3. Correction
   `-- Show the corrected learner-facing sentence.

4. Retry
   `-- Ask learner to try the same pattern again.

5. Logic
   `-- Show one concise Vietlish/English reasoning explanation.

6. Memory Summary
   `-- Update safe aggregate summary fields only.

7. Next Lesson
   `-- Recommend the next small practice target.
```

### Adult Modes

The adult tutor can keep modes, but Today's Lesson should guide which mode is most useful.

- Journey: guided conversation practice.
- Grammar: correction and retry.
- Speak: pronunciation or spoken response practice.
- Logic: English/Vietlish reasoning only.

Logic mode is not a voice mode. It must not show TTS, mic, speaker UI, "Mercy voice", or "Device voice fallback".

## Core Engines

The Learning OS should be implemented as composable engines before major UI expansion.

```text
Adult AI Tutor UI
|-- Today's Lesson Planner
|-- Vietlish Logic Diagnosis Engine
|-- Mistake-to-Mastery Graph
|-- Memory Summary Engine
|-- Voice Orchestrator
`-- Progress Engine
```

### Today's Lesson Planner

Purpose:

- Choose the next small lesson for the learner.
- Convert memory summary and mastery state into one focused daily target.
- Keep sessions short and actionable.

Inputs:

- target language
- safe memory summary
- topic mastery
- weak pattern
- last practiced
- practice count

Outputs:

- lesson id
- title
- target pattern
- 5-minute practice prompt
- retry prompt
- suggested mode
- next recommended lesson

Non-goals:

- Do not store raw learner text.
- Do not call Placement.
- Do not write to Supabase memory.

### Vietlish Logic Diagnosis Engine

Purpose:

- Explain why a learner's sentence sounds Vietlish or unnatural.
- Compare Vietnamese thinking with natural English structure.
- Produce one clear logic explanation per session step.

Inputs:

- corrected learner-facing sentence
- target pattern
- optional safe weak-pattern tag
- target language context

Outputs:

- diagnosis type
- English logic explanation
- Vietlish trap
- better pattern
- short examples

Rules:

- Logic is text-only.
- No TTS, mic, speaker controls, or fallback labels in Logic mode.
- Do not read Logic explanations aloud unless a later approved PR explicitly adds non-Logic voice support.

### Mistake-to-Mastery Graph

Purpose:

- Track learning progress by topic and mistake pattern.
- Convert repeated weak patterns into recommended lessons.
- Keep the graph summary-only and safe.

Nodes may include:

- topic
- weak pattern
- mastered pattern
- lesson
- retry prompt

Edges may include:

- weak pattern belongs to topic
- lesson trains weak pattern
- retry improves mastery
- mastery unlocks next focus

Allowed state:

- topic mastery
- weak pattern
- practice count
- last practiced
- suggested next focus

Not allowed:

- raw learner text in graph nodes
- full transcript storage
- raw audio storage

### Memory Summary Engine

Purpose:

- Maintain a local safe summary of learning progress.
- Feed the Today's Lesson Planner without retaining sensitive raw content.

Allowed fields:

- safe summary
- topic mastery
- weak pattern
- practice count
- last practiced
- suggested next focus

Storage rule:

- Local summary-only memory is allowed.
- Supabase memory sync is not allowed unless explicitly approved in a later task.

The memory card must not show or store raw learner text. It should summarize patterns, not quote learner mistakes.

### Voice Orchestrator

Purpose:

- Centralize voice decisions for adult Journey/Speak/Grammar flows.
- Keep cloud provider keys server-side.
- Keep clear UI labels for cloud voice versus fallback.

Rules:

- Journey and Speak may use voice where appropriate.
- Grammar may read corrected learner-facing text only.
- Logic must not show voice UI.
- No autoplay.
- No raw audio storage.
- No full transcript storage.
- No provider secrets in client code.
- "Mercy voice" appears only when cloud audio succeeds.
- "Device voice fallback" appears only when browser/device speech is used after cloud is unavailable.

### Progress Engine

Purpose:

- Track lightweight learning activity.
- Support streaks, daily practice count, and completion feedback.
- Feed Today's Lesson and the adult dashboard.

Allowed fields:

- practice count
- last practiced
- streak count
- completed lesson ids
- topic mastery
- suggested next focus

Rules:

- Do not store raw learner text.
- Do not store full transcripts.
- Do not write Placement results or Placement state.

## Data Boundaries

### Allowed

The Learning OS may store or display these safe summary fields:

- safe summary
- topic mastery
- weak pattern
- practice count
- last practiced
- suggested next focus

Examples:

```text
Safe:
- "Needs review: past tense after yesterday."
- "Strongest topic: present simple."
- "Practice count: 4 today."
- "Suggested next focus: third-person singular."
```

### Not Allowed

The Learning OS must not store or expose:

- raw audio storage
- full transcript storage
- raw learner text in memory card
- Supabase memory sync
- Placement writeback
- client-side provider secrets
- full conversation history as memory
- raw learner mistakes inside graph state

Examples:

```text
Not safe:
- "I buy a hat yesterday" stored in a memory card.
- Full speech transcript saved for later.
- Audio blob cached in Supabase Storage.
- GOOGLE_TTS_API_KEY exposed in frontend code.
- Placement score updated from AI Tutor practice.
```

## Implementation Phases

Build phases must stay small and independently reviewable.

### P1: Today's Lesson Planner

Deliverables:

- planner types
- deterministic planner function
- starter lesson list
- tests for lesson selection
- no UI rewrite

Validation:

- unit tests for planner outputs
- no storage expansion
- no provider/env changes

### P2: Vietlish Logic Diagnosis

Deliverables:

- diagnosis types
- rule-based diagnosis function
- examples for common Vietnamese-to-English patterns
- Logic mode integration only after engine tests pass

Validation:

- unit tests for diagnosis shape
- guardrail test that Logic mode has no TTS/mic/speaker UI

### P3: Mastery Graph

Deliverables:

- graph types
- summary-only graph state
- pattern-to-lesson mapping
- mastery update function

Validation:

- no raw text persisted in graph
- tests for weak pattern to next focus

### P4: Adult Dashboard

Deliverables:

- Today's Lesson card
- continue lesson action
- safe memory summary card
- next recommended lesson card
- mode entry points

Validation:

- dashboard route tests
- no Mercy Kids UI regression
- no Placement changes

### P5: Progress / Reward Loop

Deliverables:

- practice count
- streak display
- completion state
- lightweight reward feedback

Validation:

- local-only summary updates
- no full transcript storage
- no Supabase memory sync

### P6: Realtime Voice Later

Deliverables:

- design doc first
- Journey/Speak only
- server-side provider access only
- fallback labels

Validation:

- no Logic voice UI
- no raw audio storage
- no client-side secrets

P6 is explicitly later. Do not add realtime voice while building P1-P5 unless separately approved.

## PR Rules

Every PR must state:

- phase
- files changed
- data boundary impact
- tests run
- safety confirmation

Every PR must confirm:

- no raw audio storage
- no full transcript storage
- no client-side provider secrets
- no Supabase memory sync
- no Placement writeback

Docs-only PRs are allowed and preferred before engine or UI changes.

## Production QA Checklist

Before production acceptance for any Learning OS UI phase:

- Mercy Kids remains picture + speak only.
- AI Tutor Adult shows guided study flow.
- Today's Lesson starts a 5-minute practice path.
- Correction uses clean learner-facing text.
- Retry is available after correction.
- Logic shows one reasoning explanation and no voice UI.
- Memory card shows summary only.
- Progress reflects safe counts/streaks only.
- Voice labels are correct when voice is used.
- No raw audio is stored.
- No full transcript is stored.
- No provider key appears in frontend bundles or network payloads.
- No Supabase memory sync occurs.
- No Placement writeback occurs.

## Final Architecture Rule

Teacher Mercy Learning OS should feel smart because it remembers safe patterns, recommends the next useful lesson, and explains English logic clearly. It must stay safe because it stores only summary learning state, keeps provider secrets server-side, and keeps Kids, Adult, Logic, Memory, Voice, and Placement boundaries separate.
