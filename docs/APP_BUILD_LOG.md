# Mercy Blade — App Build Log

> Purpose:  
> This document is the **living operational log** for building Mercy Blade.  
> It records *what changed*, *why it changed*, and *what is now considered stable*.  
>  
> This is **not a roadmap**, **not a brainstorm**, and **not marketing**.  
> It exists to prevent confusion, regression, and context loss.  
>
> Secondary Purpose (Controlled):  
> This log also serves as a **source of truth for public storytelling**, showcasing real engineering rigor, stability work, and production hardening.

---

## 0. Core Principles (DO NOT EDIT LIGHTLY)

- Mercy Blade is the **core product and single source of truth**
- Stability > speed > features
- Payments, audio UX, tier access come before everything else
- No large refactors
- Patch-style changes only
- One problem at a time
- The client is read-only; Supabase is the system of record
- Anything that increases novelty, dependency, or fragility is rejected

---

## 1. Current System Snapshot

_Last updated: 2025-12-03_

### Stack
- Frontend: React + TypeScript
- Backend: Supabase (Auth, DB, Edge Functions)
- Payments: Stripe Checkout + Webhooks
- Content model: JSON-defined rooms
- UX focus: Audio-first (TalkingFacePlayButton)

### Known Stable Areas
- Room registry generation
- Room rendering flow
- Audio playback entry points
- Tier visibility (where data exists)

### Known Fragile Areas
- Stripe webhook → tier upgrade timing
- Audio progress bar containment
- Tier logic split between client and DB

---

## 2. Active Focus

- [ ] Stripe webhook hardening (tier upgrades)
- [ ] Audio UX containment (TalkingFacePlayButton)
- [ ] Tier-gated SQL views (read-only client)

---

## 3. Change Log (Chronological)

---

### 2025-12-03 — Build Diagnosis & Deployment Fix
**Area:** Infra / Deployment  

**Files touched:**
- `netlify.toml`
- `public/data/companion_lines_friend_en.json`

**What changed:**
- Fixed Netlify config from Next.js → Vite (`.next` → `dist`)
- Removed invalid Next.js plugin
- Corrected redirect paths (`/public/data/* → /data/*`)
- Added missing `voiceQuiet` key in EN companion JSON

**Why:**
Prevent deployment failure and runtime crashes for EN users.

**Acceptance check:**
- Netlify build succeeds
- Companion system works for both EN + VI

**Status:** ✅ Stable

---

### 2025-12-03 — MercyBlade Blue (Stability & Test Overhaul)
**Area:** Infra / Access / Data / Security  

**Files touched:**
- `useUserAccess.ts`
- `roomLoader.ts`
- `AdminDashboard.tsx`
- `ResetPasswordPage.tsx`
- test files (multiple)

---

#### What changed

**Supabase Mocking**
- Created shared `createSupabaseMock()`
- Added `auth.getSession`, `rpc`
- Standardized `.from()` chain behavior
- Fixed Vitest hoisting via async mock pattern

**Test Architecture**
- Unified structure across all core tests
- Deterministic mocks
- Clean reset with `beforeEach`

**Access Logic Coverage**
- Admin override enforced
- Premium logic validated
- Malformed entitlements → safe fallback
- Corrupted profile rows → defaults
- String `admin_level` parsed safely
- Auth loading states handled

**Room Loader Resilience**
- DB empty → JSON fallback
- DB malformed → JSON fallback
- DB stale + JSON broken → safe failure
- Corrupted JSON → safe error (`ROOM_NOT_FOUND`)
- Mixed bad data → normalized output

**NaN Elimination**
- Removed unsafe:
  - `Number(x ?? 0)`
  - `value ?? 0`
- Introduced:
```ts
function safeNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}