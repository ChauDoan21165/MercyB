## Description
<!-- What changed and why. Link to issue / dispatch brief / RECON report if any. -->

## Type of Change
<!-- Mark the relevant option(s) with an "x" -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update only (no runtime code touched)
- [ ] 🎨 UI/UX improvement
- [ ] 📊 Data file changes (JSON content updates)
- [ ] 🔧 Tooling / CI / build config only

## Real-Device Verification Gate

<!--
PRINCIPLES.md §3: "Real-device testing is Chau's job. No agent (and no Claude) ships
code without Chau verifying it on actual hardware where it matters (browser, iOS, Android)."

If this PR touches runtime code (anything that ships to a user's device — src/**, public/**,
api/**, supabase/functions/**, vercel.json, vite/capacitor config), one of the boxes
under "Verified by Chau" MUST be checked before merge.

Docs-only / CI-only / migration-SQL-only PRs may check "Not applicable" with a one-line reason.
-->

**Surface(s) this PR ships to** (check all that apply):

- [ ] Web (mercyblade.com)
- [ ] iOS Capacitor build
- [ ] Android Capacitor build
- [ ] Supabase edge function / RPC
- [ ] Vercel function (`api/**`)
- [ ] CI / build tooling only — runtime unaffected
- [ ] Docs / reports / memory only — runtime unaffected

**Verified by Chau** (exactly one required for runtime-affecting PRs):

- [ ] ✅ Tested on real device(s) — describe below
- [ ] ⏸️ Not yet — merge is gated on Chau's device test
- [ ] N/A — non-runtime change (docs / CI / tombstoned migration). Reason: ________

**If tested, what was verified:**
<!-- e.g. "iPhone 14 Safari: opened /room/family_breakfast, audio plays, no console errors"
     e.g. "Web Chrome desktop: signup → onboarding → first room, full happy path"
     e.g. "Pixel 7 Chrome: PWA install + offline replay works after first play" -->

## Automated Gates

- [ ] `npm run typecheck:ci` green locally (CI runs this too — pre-push catches it sooner)
- [ ] `npm run lint` green
- [ ] `npm test` green (or N/A — no test surface changed)
- [ ] `npm run build` green (or N/A — non-build change)
- [ ] Data validation passes if JSON touched (`npm run rooms:check` / `npm run validate-rooms`)

## Diagnose-Before-Patching (PRINCIPLES §5)

<!-- Required for bug fixes. Skip for features / docs / refactors. -->

- **Symptom:** <!-- what the user / log / Sentry saw -->
- **Root cause:** <!-- with evidence: log line, sourcemap frame, RECON quote, etc. -->
- **Fix:** <!-- one-sentence summary of the minimal change -->
- **Why this is the smallest safe diff:** <!-- per CLAUDE.md "small diffs over smart diffs" -->

## Scope Hygiene (PRINCIPLES §1, §3)

- [ ] One concern per PR — no bundled bug-fix + feature + refactor
- [ ] Dead code surfaced by this work is deleted in this PR, not deferred
- [ ] No file outside the stated surface was touched (no drive-by edits)

## Five Non-Negotiables (CLAUDE.md)

If your change touches user-facing copy, audio, UI, billing, or kids mode, confirm:

- [ ] Vietnamese-first preserved (no English-only flows added)
- [ ] Kids mode invariants preserved (offline-first, no login friction, no monetization)
- [ ] Works at mobile widths 375–414 px
- [ ] No dark gamification / streak-shaming patterns added
- [ ] No `'vip'` / `'all_vip'` audience strings introduced (legacy — use tier 0..N)

## Screenshots / Recordings
<!-- For UI changes. Paste before/after at mobile width if visual. -->

## Additional Notes
<!-- Migration notes, follow-ups, known limitations, related PRs. -->
