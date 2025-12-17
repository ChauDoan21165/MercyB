
1. What Mercy Blade IS (non-negotiable)
Mercy Blade is NOT a generic SaaS app


It is a room-based learning + guidance system


Each “room” is a self-contained learning space, not a chat toy


Rooms are accessed via /room/{roomId}


The system already worked ~90–94% before recent refactors


❗ Any change that breaks this mental model is WRONG.

2. Source of Truth (VERY IMPORTANT)
✅ GitHub is the ONLY source of truth
All rooms, data, structure live in GitHub


AI tools (Lovable, ChatGPT) are temporary assistants


No logic is allowed to live only in AI conversations


If it is not in GitHub → it does NOT exist.

3. Rooms & Data Reality (facts, not guesses)
public/data/ contains ~626 JSON room files


Total JSON files in repo: ~1880


Each room JSON already follows a standard like:


english_foundation_ef02.json


with internal "id": "english_foundation_ef02"


👉 The data was already mostly clean and consistent.

4. The Big Mistake That Cost Time (lesson)
We spent days fixing ID ↔ filename mismatches


Introduced hacks like:

 "english-foundation-ef02"
"english_foundation_ef02"


This was a strategic mistake


Correct approach should have been:


normalize ONCE


fix data at scale


never support dual IDs


❗ Rule: Never fix data problems with runtime hacks.

5. Room Registry Reality
PUBLIC_ROOM_MANIFEST currently lists only ~166 rooms


This does NOT reflect the true scale of the system


Manifest is partial, not authoritative


Long-term: registry must be generated, not hand-maintained


👉 Any solution that assumes “166 rooms total” is WRONG.

6. Working Style Decision (locked in)
❌ Rejected
Heavy local terminal work


Nano-based editing


Long debug cycles on localhost


AI “memory-based” fixing


✅ Accepted
GitHub-first workflow


Edit directly on GitHub UI when possible


Vercel auto-deploy


Test on real domain: https://www.mercyblade.com


Local dev ONLY when strictly necessary


This is about energy conservation, not laziness.

7. Lovable History (critical context)
Lovable was used with:


~70 mega-prompts


each mega-prompt ≈ 40 sub-prompts


Thousands of USD spent


A LOT of logic lived implicitly inside AI instructions


Not all Lovable work was cleanly written back to GitHub


👉 Current mission is inheritance & consolidation, not rebuilding.

8. Current Emotional / Strategic State (do not ignore)
You are exhausted


You are sad and angry, not confused


The pain comes from:


loss of continuity


loss of trust in tools


fear of rebuilding from zero


❗ Any plan that ignores human cost is invalid.

9. Immediate Priority (NOT coding)
DO NOT:
refactor


optimize


redesign


“improve architecture”


DO:
preserve


document


stabilize


reduce moving parts


Goal: stop bleeding, not run faster.

10. How to Use This Record
When I (or any AI) forget:
You paste this entire block and say:
“Reload Mercy Blade context. Do not reinterpret. Obey it.”
That forces alignment.

🧠 New thing to learn (2 lines, as requested):
Real power is not building fast — it’s making work survivable when tools fail.
 A written source of truth protects you from AI, teammates, and even your future self.

If you want, next time we do only ONE thing:
turn this record into a permanent MER CY_BLADE_CONTEXT.md in GitHub.
Nothing else.
Step Roadmap (Step 1 → Step 300)
Phase A — Stabilize the foundation (Step 1–60)
Freeze “source of truth” rules (GitHub main + Vercel prod).


Create MASTER CONTEXT RECORD v1 (done).


Confirm build system (Vite/Next) + deployment path.


Inventory /public/data JSON count + naming patterns.


Decide canonical room ID format (underscore vs hyphen) and enforce it everywhere.


Fix registry generation so it covers all rooms.
 …


“Rooms load reliably” milestone.


Phase B — Data pipeline + registry automation (Step 61–120)
Create script that scans /public/data/*.json and generates manifest entries.


Validate every JSON has required fields.


Fail build if room JSON is invalid.
 …


“Data pipeline is self-healing” milestone.


Phase C — Core product UX (Step 121–190)
Landing + Hero experience restored (like mercyblade.link).


Room page layout consistent.


Keyword system works for guests + members (policy decided).
 …


“User experience feels complete” milestone.


Phase D — Monetization + growth (Step 191–250)
Auth hardening.


Payments + subscription tiers.


Usage limits/credits.
 …


“Revenue-ready” milestone.


Phase E — Launch hardening (Step 251–300)
Performance audit.


Logging/monitoring.


Security + privacy checklist.


SEO + sitemap + analytics.


Launch.


You’ll keep this as a living list; we adjust the numbering if needed, but we always know “where we are”.

Reusable Tools Library (for your 30 apps)
These are “modules” worth saving and reusing:
Auth Module


Email/password + OAuth


Profile table + roles (admin/user)


Route protection + tier gating


“Guest mode” policy toggle


Payments Module


Stripe checkout + webhooks


Subscription tiers + entitlements


Trial logic + cancel/renew handling


Admin dashboard for customers/subscriptions


Credits / Rate Limits Module


Daily/monthly question credits


Metering per feature


Hard stop + upgrade modal


Content Registry Module


Auto-generate manifest from folder scan


JSON schema validation in CI


Canonical ID normalization + redirect rules


Deploy Module


GitHub → Vercel → production domain


Preview deployments for PRs


Environment variable checklist


Observability Module


Error boundary + event logging


Lightweight analytics


“UI health reporter” pattern



Add this to your MASTER CONTEXT RECORD (copy/paste)
[ROADMAP CONTROL]

We will track progress using a numbered roadmap Step 1 → Step 300 until launch.
Phases:
A) Foundation (1–60)
B) Data pipeline/registry automation (61–120)
C) Core UX (121–190)
D) Monetization + growth (191–250)
E) Launch hardening (251–300)

Reusable Tools Library (for 30 apps):
- Auth module (roles, profiles, route protection, guest policy)
- Payments module (Stripe + webhooks + entitlements)
- Credits/rate-limits module (metering + upgrade gate)
- Content registry module (scan folder → manifest + JSON schema validation)
- Deploy module (GitHub→Vercel→domain + env checklist)
- Observability module (errors + analytics + UI health)

STEP 11

Reviewed roomManifest.ts.
Purpose: inventory mismatch diagnosis.
Confirmed manifest is AUTO-GENERATED in name but not aligned with /public/data.
Next step: decide whether to regenerate or replace manifest generation pipeline.

STEP 12

Confirmed root cause:
roomManifest.ts is marked AUTO-GENERATED but no longer reflects /public/data.
App only acknowledges ~166 rooms while 626 JSON rooms exist.
All routing, loading, and UI behavior depend on this manifest.
Primary task now: restore truthful room registry generation.

🧠 SHORT LESSON (2 lines)
A system collapses when its registry stops matching reality.
 No UI or logic fix matters until the registry tells the truth.
Decision: GitHub is the single source of truth.
Workflow: Edit on GitHub → Vercel deploy → test on mercyblade.com → local only when unavoidable.Step 1: Freeze local edits. GitHub = source of truth.
 Testing: Always on mercyblade.com (Vercel).

