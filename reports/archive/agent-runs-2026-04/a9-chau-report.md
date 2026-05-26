# Chau Report from A9

## Scope

A9 completed a text-only Vietnamese wording pass across MercyB. The work focused on user-facing UI first, then lesson/practice surfaces, support/error/help copy, and account/admin-adjacent settings copy.

Rules followed:

- No code refactors.
- No logic changes.
- No variable or function renames.
- Vietnamese wording/content only.
- Small, safe edits by file area.
- TypeScript/build stability preserved.

## Commits

- `6a9c0030 fix: improve Vietnamese wording in placement`
- `ab244327 fix: improve Vietnamese wording in home`
- `31c39282 fix: improve Vietnamese wording in writing`
- `3c5e69fa fix: improve Vietnamese wording in professions`
- `9fd2a284 fix: improve Vietnamese wording in pronunciation`
- `4344f518 fix: improve Vietnamese wording in support`
- `3e456108 fix: improve Vietnamese wording in account security`

## Files Edited

### Placement

- `src/pages/placement/WelcomePage.tsx`
- `src/pages/placement/WhoForPage.tsx`
- `src/components/placement/SkipModal.tsx`
- `src/pages/placement/ResultsPage.tsx`
- `src/lib/placement/cefrToRoom.ts`

### Home

- `src/pages/Home.tsx`
- `src/components/home/RecommendedDrillCard.tsx`
- `src/components/home/StoryPromptCard.tsx`
- `src/components/home/DailyChallengeCard.tsx`
- `src/components/home/FocusAreasCard.tsx`
- `src/components/home/ListeningSuggestionCard.tsx`

### Writing

- `src/components/writing/EssayFeedbackPanel.tsx`
- `src/components/writing/WritingFeedbackVN.tsx`
- `src/components/writing/writingFeedbackCopy.ts`
- `src/pages/writing/WritingPracticePage.tsx`
- `src/pages/writing/WritingPracticeSessionPage.tsx`

### Professions

- `src/pages/professions/ProfessionsIndexPage.tsx`
- `src/pages/professions/HealthcareLessonsPage.tsx`
- `src/pages/professions/HospitalityLessonsPage.tsx`
- `src/pages/professions/CustomerServiceLessonsPage.tsx`
- `src/pages/professions/DriversLessonsPage.tsx`
- `src/pages/professions/NailTechLessonsPage.tsx`
- `src/pages/professions/RestaurantLessonsPage.tsx`
- `src/pages/professions/TechWorkerLessonsPage.tsx`

### Pronunciation, Vocabulary, and Notebook

- `src/pages/practice/PhonemeDrillPage.tsx`
- `src/components/speech/SpeechDrill.tsx`
- `src/components/pronunciation/PronunciationSRSCard.tsx`
- `src/pages/vocabulary/ReviewSession.tsx`
- `src/components/notebook/SaveWordPopup.tsx`

### Support and Billing

- `src/pages/Support.tsx`
- `src/pages/Billing.tsx`
- `src/pages/BillingSuccess.tsx`
- `src/pages/BillingSuccessPage.tsx`

### Account Security and Preferences

- `src/pages/auth/RecoverWith2FA.tsx`
- `src/pages/account/SecuritySettings.tsx`
- `src/pages/account/PushPreferences.tsx`
- `src/pages/auth/Enable2FA.tsx`

## Wording Improvements

- Made Vietnamese UI copy more natural, calm, and practical.
- Improved consistency in CTA wording, placement labels, result labels, and support instructions.
- Replaced robotic or mixed-language phrases with clearer Vietnamese equivalents where safe.
- Softened security and recovery language so it stays supportive without losing precision.
- Cleaned up writing-feedback terms such as rubric, estimated band, structure, coherence, and vocabulary suggestions.
- Normalized profession-page copy around Vietnamese learner context, workplace English, and practical role-specific lessons.
- Improved pronunciation and speech-drill messages for permission, retry, scoring, and practice feedback states.

## Verification

- `npm run typecheck`: passed.
- `npm run build`: passed.

Build note: the first build attempt was blocked by sandbox IPC permissions during sitemap generation. The same command passed when rerun with approved permissions. Build completed with existing Vite warnings for large chunks and mixed static/dynamic import usage.

## Final State

- Working tree was clean after the A9 wording commits.
- Changes were limited to Vietnamese text/content and this report.
