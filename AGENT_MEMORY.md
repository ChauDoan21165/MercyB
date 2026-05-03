# Agent Memory File - MercyB Project

## Project Overview
- Name: Mercy Blade
- Type: React/TypeScript/Capacitor web app (iOS + Android)
- Purpose: Vietnamese users learning foreign languages
- Main path: /Users/admin/mercyB

## Completed Features
- ✅ English language module (5 lessons, 50 vocab)
- ✅ French language module (5 lessons, 50 vocab)
- ✅ German language module (5 lessons, 50 vocab)
- ✅ Japanese language module (5 lessons, 50 vocab)
- ✅ Chinese language module (5 lessons, 50 vocab)
- ✅ Korean language module (5 lessons, 50 vocab)
- ✅ LanguageSwitcher UI (2-column grid, European/Asian categories)
- ✅ Language progress store (React Context, localStorage)
- ✅ Integrated into Home.tsx and main.tsx
- ✅ README.md and LESSONS.md documentation
- ✅ Apple OAuth fix (iOS blank page - code exchange added)

## File Structure
- src/languages/[language]/vocabulary.ts
- src/languages/[language]/lessons.ts
- src/components/LanguageSwitcher.tsx
- src/store/languageProgress.ts

## My Preferences
1. ALWAYS start with `clawcodex --permission-mode bypassPermissions`
2. Do NOT ask permission for file operations
3. Do NOT over-explain - be direct
4. Update AGENT_MEMORY.md after completing significant work
5. Web-first development (mobile later)
6. Before starting any task, check AGENT_MEMORY.md "Recently Completed" and "Pending" sections — do NOT repeat work already marked as done

### Critical Rule (ALWAYS follow)
After ANY code change:
1. Run `npm run build`
2. If build fails, read the error message carefully
3. Fix the ACTUAL syntax error shown (don't guess file extension issues)
4. Run `npm run build` AGAIN to confirm
5. Only say "done" when build exits with 0

NEVER assume build passes without verifying twice.

## What to NEVER do
- Break existing English module
- Change authentication flow
- Ask unnecessary permission questions
- Overcomplicate simple tasks
- Push code without running npm run build first
- Assume build passes without verifying
- Say "done" when Vercel is still failing

## Agent-Specific Rules

**C1 (European Languages):**
- Always include Vietnamese pronunciation hints
- Always add cultural notes for Vietnamese learners

**C2 (Asian Languages):**
- Include writing system breakdown (hiragana/hanzi/hangul)
- Include romanization for all vocabulary

**C3 (UI & Integration):**
- MUST run `npm run build` before pushing ANY commit
- MUST run `npm run typecheck` before pushing
- If build fails, fix it BEFORE saying "done"

**C4 (Documentation):**
- Update AGENT_MEMORY.md after every major change
- Keep "Last Updated" date current

**C10 (Sentry Error Handler):**

Responsibilities:
1. Monitor Sentry for new errors (polling every 10 minutes)
2. Auto-fix known error patterns:
   - `this.o.at is not a function` → add polyfill
   - `Cannot read property X of undefined` → add null check
   - `Failed to fetch` → add retry logic
3. For unknown errors: extract stack trace, identify file, suggest fix
4. Update AGENT_MEMORY.md "Error Log" section after each fix

Auto-Fix Templates:
- Error Pattern: `at is not a function` → Add polyfill to `src/main.tsx`
- Error Pattern: `Cannot read property 'X'` → Add optional chaining `?.`
- Error Pattern: `Failed to fetch /api/` → Check API endpoint, add fallback

When to Alert Chau:
- Error recurs after 2 fix attempts
- Error affects >1% of users
- Error in authentication flow
- Unknown error pattern

Integration:
- Use Sentry API: `curl -H "Authorization: Bearer <sentry-token>" https://sentry.io/api/0/projects/.../issues/`
- Simulate fix locally before pushing
- After fix, push and confirm error stops

## PRE-PUSH CHECKLIST (for all agents)
Before any git push:
- [ ] npm run build passes
- [ ] npm run typecheck passes
- [ ] npm run lint passes
- [ ] No console.log statements left
- [ ] Routes are registered in AppRouter.tsx
- [ ] Imports point to existing files

## STOP CONDITIONS (if any, report immediately)
- Build fails after 2 fix attempts
- Need to change more than 5 files
- Need to modify authentication system
- Missing file that another agent was supposed to create

## LESSONS LEARNED (from past failures)
2026-05-03: C3 pushed without building → Vercel failed
   Fix: Added mandatory build step to checklist

2026-05-03: C3 assumed file rename fixed syntax error
   Fix: Added "run build again after fix" rule

2026-05-03: Missing LanguagesIndexPage import broke Vercel
   Fix: Added "verify imports exist" to checklist

2026-05-03: Duplicate .ts file caused Rollup error
   Fix: Check git tracking after rename, remove old file

## VERIFICATION RULE
After C1, C2, or C3 reports "done", C4 must verify:
1. The files they claim to exist actually exist
2. The build passes
3. No broken imports
4. AGENT_MEMORY.md is updated

If anything is wrong, tell them to fix it before accepting "done".

## Last Updated
May 3, 2026 - C3 completed and pushed LanguageSwitcher + progress store. Commit hash: 5f9a1df4

## Recently Added (C4 - May 3, 2026)
- ✅ README.md updated with Language Modules section
- ✅ LESSONS.md created (6 languages, 5 lessons, 50 vocab each)
- ✅ AGENT_MEMORY.md updated

## Bugs Fixed (May 3, 2026)
- ✅ Added English back to LanguageSwitcher (was missing)
- ✅ Fixed routing: "Start learning" now opens correct language module instead of English

## Pending
- ⏳ Register language modules in loader
- ⏳ Add tabs to MercyGuidePanel

## 2026-05-03T22:36:00.530Z
- **Error:** TypeError: at is not a function
- **Fix applied:** NEEDS HUMAN HELP — Polyfill already present

## 2026-05-03T17:XX — TypedArray.prototype.at polyfill
- **Error:** Potential "at is not a function" on TypedArrays (Uint8Array, Float32Array, etc.) in Chrome < 92 / iOS < 15.4
- **Fix:** Added TypedArray.prototype.at polyfill to src/main.tsx (all 9 typed array constructors)
- **Status:** Committed and pushed (6a75a5aa)
- **Build:** Passed

## C10 Auto-Fix Infrastructure (2026-05-03)

### GitHub Actions Workflow: `sentry-auto-fix.yml`
- **Runs:** Every hour + manual trigger (`workflow_dispatch`)
- **Fetches:** Unresolved Sentry issues from `mercy-blade` / `mercyblade-web`
- **Patterns detected:**
  - `at is not a function` → auto-applies full polyfill (Array, String, TypedArray)
  - `Cannot read property` → flags for human (needs source location)
  - `Failed to fetch` → flags for human (needs network context)
- **On match:** Creates fix PR via `peter-evans/create-pull-request@v6`, marks Sentry issue as resolved
- **Secret:** `SENTRY_AUTH_TOKEN` (GitHub Secret) — never echoed in logs

### Vercel Deployment: `preview-deployment.yml`
- **Deploy-vercel job:** Now active (uncommented)
- **Needs secrets:** `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- **Alias domain:** `pr-{number}.mercy-blade.vercel.app`

### Security
- All secrets masked with `::add-mask::` before any curl commands
- Tokens never appear in step summaries or logs
- Dependabot PRs skip Vercel deploy (no wasted previews)
