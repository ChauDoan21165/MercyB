# Mercy AI Company Lessons Log

A living document for lessons learned while building and operating an AI-run company.

## Purpose

This file records decisions, mistakes, patterns, and operating rules that should guide future work.

## Core Principles

### 1. Restore before redesign

When something breaks, recover the last known good behavior before adding new ideas.

### 2. One owner per function

Each surface should have one clear responsibility.

* Product surface should not duplicate another surface.
* One feature should have one primary home.

### 3. Core path must survive optional failures

Nice features must fail softly.

* Chat
* audio
* reflection helpers
* speaking tools
* admin tools

None of them should make the main product look broken.

### 4. Small diffs over smart diffs

When a system is unstable, prefer the smallest safe change instead of broad “clever” changes.

### 5. Checkpoint every risky step

Create a commit before rollback work, before large edits, and before experimental fixes.

## Lessons from Real Debugging

### 6. Do not solve uncertainty with more code

If the real source of failure is unclear, added fallback logic can multiply confusion.

### 7. Central files are dangerous

Some files act like global choke points. Changes there can affect the whole product.
Examples:

* loaders
* render orchestrators
* access gates
* shared helpers

### 8. Separate layers before fixing

Always identify whether the failure belongs to:

* loading
* rendering
* permissions
* data shape
* feature ownership
* external service integration

### 9. Permissions are product logic

A feature is not “working” if the UI renders but permissions fail.
RLS, auth, and access checks are part of the product.

### 10. Optional tools should never hijack the core experience

A helpful tool can still be wrong in a certain surface if it confuses the user or overlaps another system.

## Product Design Rules

### 11. Remove overlap to reduce confusion

More features are not always better.
If one AI already owns a function, do not duplicate it elsewhere without a very strong reason.

### 12. Keep surface boundaries explicit

Example pattern:

* Room = content + reflection
* Teacher Mercy = deeper coaching and practice
* Chat = community
* Feedback = admin channel

### 13. Reflection is a growth asset

User reflections should be preserved as learning history, not treated as disposable input.

### 14. History matters

A system that worked for months is evidence.
When breakage is recent, compare against the older working path before inventing a new path.

## AI CEO Rules

### 15. Stop digging when drift increases

If each fix makes the product stranger, stop patching and switch to rollback analysis.

### 16. Demand narrow scope from agents

Agents should:

* edit one file at a time
* preserve unrelated logic
* return full files
* explain the role of the file before changing it

### 17. Source-of-truth hierarchy

Prefer this order:

1. last known good behavior
2. current production reality
3. minimal safe diff
4. only then new design ideas

### 18. Debug by narrowing, not expanding

Find the smallest set of files that can explain the failure.

### 19. Product clarity beats feature quantity

A cleaner, more understandable workflow is stronger than a crowded feature stack.

### 20. AI company leadership needs operational rules, not just intelligence

The company becomes stable when agents follow consistent discipline.

## Working Rules for Future Projects

* Protect the working core first.
* Keep one owner per function.
* Separate core-path failures from optional-feature failures.
* Roll back before rewriting.
* Prefer evidence over assumptions.
* Preserve checkpoints.
* Treat permissions and access as first-class product behavior.
* Avoid overlap between AI agents.
* Keep user experience simpler than the underlying system.

## Lessons Log

Add dated entries here over time.

### Entry Template

**Date:**
**Context:**
**What happened:**
**Root cause:**
**What made it worse:**
**What fixed it:**
**Rule to keep:**

---

### First recorded lesson

**Date:** 2026-04-12
**Context:** Room system debugging during app-wide access and rendering issues.
**What happened:** Fixes drifted across room loading, rendering, speaking, access, chat, and feedback. The more overlap added, the more inconsistent the product became.
**Root cause:** The system lost clear ownership boundaries and moved too far from the last known good behavior.
**What made it worse:** Broad fallback logic, layered patches, and overlapping responsibilities between room UI and Teacher Mercy.
**What fixed it:** Returning to ownership clarity, preserving checkpoints, and distinguishing between core room behavior and optional features.
**Rule to keep:** When an AI-run system becomes confusing, reduce overlap and restore the simplest clear ownership model first.
