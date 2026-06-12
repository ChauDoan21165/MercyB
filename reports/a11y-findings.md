# Accessibility Findings - D2

Scope: placement v3 pages, Home cards, LanguageTrackHome, vocabulary library, listening library, login, and onboarding. `ai-tutor` surfaces were intentionally excluded per dispatch.

## Fixed

- Core interactive focus: added global `:focus-visible` treatment for native controls and role-based controls, plus stronger focus rings for inline-card buttons and chips.
- Placement v3: added `lang="en"` / `lang="vi"` in the shared `BilingualLabel`, clearer radio option accessible names, Vietnamese passage language tagging, recording-control grouping, writing word-count descriptions, and clearer submit/leave labels.
- Placement v3 entry: gave the who-for page a focusable `main` landmark and descriptive bilingual labels for adult and child choices.
- Home cards: added visible focus treatment and descriptive bilingual accessible names to Teacher Mercy, placement, library, exam-prep, parent, pronunciation, weakness, and language-discovery cards.
- LanguageTrackHome: exposed active language switcher state with `aria-pressed`, `aria-current`, and bilingual labels; added language tags to English hero and native-language CTA text.
- Vocabulary library: added loading status announcements, bilingual language tags, clearer search labeling, section headings with counts, and accessible due-date labels.
- Listening library: grouped category/level/accent filters, exposed selected chip state with `aria-pressed`, added live result-count announcements, and improved clip link labels including completion state.
- Login: hid decorative brand overlay from the accessibility tree, made auth notices `status`/`alert`, and exposed email/phone mode state with `aria-pressed` and descriptive labels.
- Onboarding: added focus classes, descriptive selected-state labels for radio/checkbox-style cards, hid decorative icons from speech output, and added a progress `aria-valuetext`.

## Residual Risk

- Inline-styled legacy surfaces still vary visually. The global focus rule covers keyboard visibility, but a future design-system pass should migrate repeated inline card patterns to shared components.
- This pass did not run manual VoiceOver because the dispatch work was completed in code and automated gates; the changes target the DOM semantics VoiceOver consumes.
- Contrast was improved indirectly for focus rings and selected states, but a full token-level color audit remains larger than this scoped foundation pass.
