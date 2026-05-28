# MercyGuidePanel vs UnifiedMercyChat — architecture audit

> **Date:** 2026-05-27
> **Trigger:** C5's noise-file flag in !95/!108 — "MercyGuidePanel.tsx body renders only the kids card; architecture question about whether UnifiedMercyChat is the actual host for non-kids tab content."
> **Status:** read-only audit. No code restructuring in this MR.

## What `MercyGuidePanel.tsx` actually renders

The component is 205 lines. Strip the chrome (header bar, avatar, close button, fullscreen toggle, drag handles) and the rendered body is **one card** (lines 99–115):

- Eyebrow "Mercy Kids"
- Heading "Vào không gian học của bé"
- A single CTA `<a href="/kids/vi-english">Vào Mercy Kids</a>`

There is no `children` prop. No conditional branch for adult vs kids mode. No tab system. No slot for tutor content. The panel **is** the kids landing card — the rest is presentational shell (avatar, gradient backdrop, header buttons).

## What `UnifiedMercyChat.tsx` actually renders

The component is 404 lines. Its own docstring (lines 1–18) is the most precise summary:

> One-pane Mercy chat. The new entry point that replaces the multi-tab drawer (Speak / Say / Teacher / Notebook) for users who haven't opted into 'classic' mode.

Concretely:

- Single-pane chat box with a textarea + send + mic + reset + settings buttons.
- Five **inline modes** (`pronunciation`, `grammar`, `lesson`, `encouragement`, `none`) driven by `detectIntent` and `chatReducer` — when a learner types something that smells like a pronunciation ask, a small inline panel appears next to the chat without a tab switch.
- VI-first placeholder, system prompts, and inline headings.
- Talks to `loadSession`/`patchContext`/`setSessionType` from `mercy/sessionClient` for adult-tutor session continuity.
- Renders the AI disclosure modal on first use.

This is the **adult** tutor surface. Nothing in it routes to `/kids/*`.

## Why the split exists

CLAUDE.md non-negotiable #2 — **"Kids mode is sacred. Offline-first, no login friction, no monetization CTAs, age-appropriate. Parents trust us."**

The cleanest enforcement of that invariant is two physically separate render trees, with no parent that branches on age/mode:

- `MercyGuidePanel` is mounted by routes / triggers that put a user in the kids space. It only ever shows the kids landing card. There is no code path that lets it render adult tutor copy.
- `UnifiedMercyChat` is mounted by the adult Mercy launcher. It only ever shows the adult tutor surface. There is no code path that lets it render kids copy.

A single component with a `mode={'kids' | 'adult'}` prop would technically work but adds runtime branching to the most-trusted invariant in the codebase. Two components is the safer shape.

## Should the split be cleaned up?

**Recommendation: rename, don't restructure.**

The split is correct. The **naming** is what makes a reader assume `MercyGuidePanel` is a general panel that should host all tab content. It's not — it's a kids-only landing.

A future MR could:

1. Rename `MercyGuidePanel.tsx` → `KidsGuidePanel.tsx` (or `MercyKidsLandingPanel.tsx`).
2. Update its docstring (today it has only a `// File: MercyGuidePanel.tsx` comment) to lead with the kids-only scope.
3. Update the `UnifiedMercyChat.tsx` docstring to drop the "replaces the multi-tab drawer (Speak / Say / Teacher / Notebook)" line if that legacy framing is no longer accurate — verify against current entry points first.

**Out of scope for any of those steps:** combining the two components, or introducing a shared parent that selects between them at runtime. The CLAUDE.md kids-isolation invariant ranks higher than DRY here.

## What this MR does NOT touch

Per dispatch, neither `MercyGuidePanel.tsx` nor `UnifiedMercyChat.tsx` is modified by this MR. The doc above is the deliverable; a follow-up MR (named-rename) is the natural next step.
