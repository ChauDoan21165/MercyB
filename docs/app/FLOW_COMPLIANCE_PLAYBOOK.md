# Flow Compliance Playbook

Source of truth: [APP_LOGIC_FLOW.md](./APP_LOGIC_FLOW.md)

Use this protocol to inspect whether Teacher Mercy, Mercy Kids, AI Tutor, language CTAs, voice UI, and memory UI follow the intended app logic. This playbook is for audit work only. Do not fix UI inside a compliance scan PR unless the task explicitly asks for fixes.

## Core Rule

Mercy Kids and AI Tutor are separate products for different learners.

- Mercy Kids: picture + speak only.
- AI Tutor Adult: guided study with target language, modes, correction, speaking practice, logic reasoning, progress, and safe memory summary.
- Logic mode: English/Vietlish reasoning only, with no TTS, mic, speaker, or voice fallback UI.
- Memory: local summary-only aggregate state.

## Inspection Formula

### 1. Route Inventory

Inventory every user-facing learning route related to Teacher Mercy:

- `/`
- `/ai-tutor`
- `/ai-tutor?target=fr`
- `/ai-tutor?target=zh`
- `/kids/vi-english`
- language CTA routes such as `/languages`, `/languages/french`, `/languages/chinese`, and other language pages that render AI Tutor CTAs
- Mercy Guide / Teacher Mercy entry points such as `/mercy`, `/mercy/chat`, the Home Teacher Mercy card, and the floating Mercy Guide panel

For each route, record:

- target user
- first action
- visible buttons
- visible tabs
- visible toggles
- voice/mic controls
- memory/progress UI
- each CTA route/action

### 2. Product Identity Check

Every screen must clearly belong to exactly one product:

- Mercy Kids
- AI Tutor Adult
- Teacher Mercy Guide / CTA
- Admin/dev/internal

Fail the screen if:

- Mercy Kids shows AI Tutor advanced modes.
- AI Tutor adult flow appears inside Kids.
- Logic mode appears like Speak mode.
- CTA text says one product but routes to another.

### 3. Button And CTA Check

Scan labels, buttons, links, and route actions for mismatches.

Required search terms:

```text
AI Tutor
Mercy Kids
Mở AI Tutor
Vào Mercy Kids
Journey
Grammar
Speak
Logic
Mercy đọc
Device voice fallback
Mercy voice
mic
microphone
memory
textarea
/ai-tutor
/kids/vi-english
```

Suggested commands:

```bash
rg -n "AI Tutor|Mercy Kids|Mở AI Tutor|Vào Mercy Kids|Journey|Grammar|Speak|Logic|Mercy đọc|Device voice fallback|Mercy voice|mic|microphone|memory|textarea|/ai-tutor|/kids/vi-english" src docs/app -S
rg -n "path=|/ai-tutor|kids/vi-english|TeacherMercy|MercyGuide|mercy-guide|language" src/router src/pages src/components -S
rg -n "speak\\(|speechSynthesis|Audio\\(|fetchCloudTtsUrl|mercy-tts|localStorage|indexedDB|supabase|placement" src/components src/lib src/pages -S
```

For every button/CTA, record:

- visible label
- route/action
- expected route/action
- pass/fail

### 4. Mercy Kids Compliance

Expected:

- Route: `/kids/vi-english`
- Two main columns only:
  - choose picture
  - speak
- No Journey / Grammar / Speak / Logic tabs.
- No textarea as the main flow.
- No advanced correction panel as the main flow.
- No memory card as the main child flow.
- No AI Tutor CTA inside Kids main card.
- Simple enough for a 2-year-old.

### 5. AI Tutor Adult Compliance

Expected:

- Adult/older learner flow.
- Modes are clearly separated:
  - Journey = conversation
  - Grammar = correction
  - Speak = speaking practice
  - Logic = English/Vietlish reasoning
- Target-language routing works:
  - `/ai-tutor`
  - `/ai-tutor?target=fr`
  - `/ai-tutor?target=zh`
  - `/ai-tutor?target=<language-code>`
- Kids-only picture+speak UI is not the main adult flow.

### 6. Logic Mode Compliance

Expected:

- No speaker/TTS button.
- No `Mercy đọc`.
- No mic/audio UI.
- No voice fallback labels.
- No morning starter conversation.
- Explains English logic / Vietlish reasoning only.

### 7. Voice Compliance

Expected:

- Speaker reads only clean learner-facing text.
- Speaker never reads raw learner input.
- Speaker never reads labels, headings, metadata, hidden copy, or internal formatting text.
- Fallback label appears only when cloud voice fails and device voice is actually used.
- No client-side provider secrets.

### 8. Memory Compliance

Expected:

- Local summary-only memory.
- Safe aggregate summary only.
- No raw learner text in memory card.
- No raw audio.
- No full transcripts.
- No Supabase memory sync.

### 9. Evidence Format

Every finding must use this format:

| Route | Component/file | Observed UI/action | Expected behavior from logic map | Status | Severity | Recommended fix |
| --- | --- | --- | --- | --- | --- | --- |
| `/example` | `src/path/File.tsx` | What is visible or triggered | What `APP_LOGIC_FLOW.md` requires | PASS / FAIL / NEEDS REVIEW | P0 / P1 / P2 | Specific next step |

### 10. Severity Levels

P0:

- Child flow mixed with adult AI Tutor.
- Client-side secret risk.
- Raw audio/transcript storage.
- Wrong route that sends kids to AI Tutor.

P1:

- Wrong button label.
- Wrong mode control.
- Logic mode has voice/mic.
- Confusing first action.

P2:

- Copy polish.
- Layout clarity.
- Motivation/progress improvements.

## Required Audit Sections

Each audit file should include:

- Scope and date.
- Commands run.
- Route inventory.
- Product identity findings.
- Button and CTA findings.
- Mercy Kids findings.
- AI Tutor Adult findings.
- Logic mode findings.
- Voice findings.
- Memory findings.
- Safety boundary findings.
- Remaining risks.

## Guardrails

- Audit/docs-only PRs must not change product code.
- Do not change Placement files.
- Do not change provider, env, secrets, or access behavior.
- Do not add raw audio storage.
- Do not add transcript storage.
- Do not add Supabase memory sync.
- Do not add Placement writeback.
- Do not wire learning events into product flows in docs-only PRs.
- If Placement CTAs are inspected, confirm Home, AI Tutor, and `/placement` route guards use the shared availability helper and do not point users to unavailable `/placement`.
- Run `git diff --check`.
- If product code changes accidentally, revert those code changes before committing.
