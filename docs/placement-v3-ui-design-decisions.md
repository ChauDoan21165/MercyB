# Placement v3 UI Design Decisions

Date: 2026-05-20

## 1. Modality Switching UX

Choice: seamless inline transition with a persistent modality-aware progress strip.

Rationale: the approved wireframes keep the user inside one focused test surface. V3 adds modalities, but an interstitial after every modality would make a 6-9 minute assessment feel heavier. The progress strip now shows both task progress and the active modality, with a small five-segment modality rail.

Wireframe divergence: the wireframe only has question count. V3 needs modality context, so the strip adds a modality label while preserving the no-running-level rule.

## 2. Audio Capture Without Backend Support

Choice: primary browser MediaRecorder capture, fallback typed answer.

Rationale: recording a Blob now matches the future orchestrator contract without touching Supabase functions. Browser SpeechRecognition is not reliable across Safari/iOS and would introduce language/permission confusion. If mic permission is denied or recording is unavailable, the same speaking card accepts typed text as "what you would say."

## 3. Bilingual Content Authoring

Choice: bilingual labels visible inline everywhere.

Rationale: wireframes explicitly choose English on top and Vietnamese below. This is the most Vietnamese-first option because learners never have to find a language toggle while under assessment pressure.

## 4. Results Page Hierarchy

Choice: first viewport shows "Here's what we found," overall CEFR/confidence, and the top recommended lesson. Deeper skill profile, Vietnamese L1 flags, strengths, and gaps follow.

Rationale: users need the answer first: "What level am I and where do I start?" The more diagnostic material is valuable, but secondary.

## 5. Loading And Error States

Choice: centered bilingual loading placeholder for page-level async work; inline alert with retry for submit failures; modal for expired sessions.

Rationale: page-level operations should not look broken during stub delays. Submit failures need a next action in place, not a navigation away.

## 6. Mobile Vs Desktop

Choice: mobile is a single column at 375-414 px. Desktop keeps the same task focus but uses two columns only for branch cards and results.

Rationale: assessment tasks should not become stretched wide reading surfaces. Results benefit from desktop columns because the top lesson and diagnostic profile can be scanned side by side.

## 7. Session Resume Detection

Choice: always prompt resume if an in_progress session exists and has not expired.

Rationale: placement answers are a coherent attempt. Starting a new session by accident risks less reliable results. Expired sessions route to a start-new path.

## 8. Accessibility

Choice: semantic buttons for all tappable cards, `role="progressbar"` for progress, radio roles for MCQ answers, modal focus via Radix Dialog, and submit errors as `role="alert"`.

Rationale: keyboard users can complete welcome -> who -> writing -> submit. The sticky submit button has one accessible name containing both languages.

## Needs Native Speaker Review

Vietnamese strings are authored for a formal assessment tone. Suggested review items:

- "Âm cuối" and "mạo từ" are correct technical terms, but Chau may prefer more conversational wording in results.
- "Độ tin cậy" for confidence is accurate; "mức chắc chắn" may feel warmer if the product voice wants less technical language.
