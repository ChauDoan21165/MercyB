# Mercy Blade — App Build Log

> Purpose:  
> This document is the **living operational log** for building Mercy Blade.  
> It records *what changed*, *why it changed*, and *what is now considered stable*.  
>  
> This is **not a roadmap**, **not a brainstorm**, and **not marketing**.  
> It exists to prevent confusion, regression, and context loss.

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

_Last updated: YYYY-MM-DD_

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

## 2. Active Focus (Only These Are “In Progress”)

> If it’s not listed here, it is **not active work**.

- [ ] Stripe webhook hardening (tier upgrades)
- [ ] Audio UX containment (TalkingFacePlayButton)
- [ ] Tier-gated SQL views (read-only client)

---

## 3. Change Log (Chronological)

### YYYY-MM-DD — Short title of change
**Area:** (Payments / Audio / Tiers / Infra / UI)  
**Files touched:**  
- `path/to/file.ts`
- `path/to/function.ts`

**What changed:**
- Bullet list of *exact* changes (no narratives)

**Why:**
- One or two sentences max
- Must reference stability, UX clarity, or risk reduction

**Acceptance check:**
- Explicit condition that confirms success

**Status:**  
- ⏳ In progress / ✅ Stable / ⚠️ Revisit later

---

## 4. Decisions Log (Why We Chose X Over Y)

> Only log decisions that prevent future debate.

### Decision: YYYY-MM-DD — Title
**Context:**  
What problem existed.

**Options considered:**  
- Option A  
- Option B  

**Decision:**  
Chosen option.

**Reason:**  
Clear, short, irreversible logic.

**Cost:**  
What we knowingly gave up.

---

## 5. Rejected Ideas (Important)

> This section prevents bad ideas from resurfacing.

### Rejected: YYYY-MM-DD — Idea name
**Why it was tempting:**  
Short description.

**Why it was rejected:**  
- Increased complexity / platform risk / distraction / unclear ROI

**Rule reinforced:**  
Which core principle this protects.

---

## 6. Staff Notes / Handoff

> Use this when context must survive a break or new contributor.

### YYYY-MM-DD — Note
- What is safe to touch
- What must NOT be touched
- What the next person should do first

---

## 7. “Do Not Touch” List (Until Explicitly Reopened)

- Room registry generator logic
- Stable audio playback paths
- Tier definitions once locked
- Auth flow that is currently working

(Only remove items with a logged decision.)

---

## 8. External Research Log (Reference Only)

> This section records **validated external patterns** that inform decisions.  
> It does **not** authorize features, refactors, or scope changes.

### Status
- Total startup case studies logged: **29**
- Sources: Starter Story transcripts (human + Grok-assisted extraction)
- Purpose: Pattern recognition for **future adjacent apps**, not Mercy Blade core

### Repeated Validated Patterns
- Red-ocean products outperform novel ideas when UX or focus improves
- Revenue comes from **filtering noise → decisions**, not content creation
- Fast MVPs win when distribution is clear
- Community, feedback, and launch tools monetize earlier than complex platforms
- Lifetime deals, freemium, and simple subscriptions dominate early revenue

### Guardrail
- Insights here may inform **separate Mercy ecosystem apps**
- They must **never** destabilize Mercy Blade core

---

## 9. Next Review Trigger

This document must be reviewed when:
- A payment-related bug occurs
- Audio UX breaks or regresses
- A staff member proposes a new feature
- Context is at risk of being lost

---

_End of document_
