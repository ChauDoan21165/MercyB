# RECON — Bundle Audit (A25)

- **Date:** 2026-05-19
- **Base:** `origin/main` @ `5cfa27e3f` (worktree `a25/bundle-audit-fresh`, isolated `npm ci`)
- **Build:** `MB_BUNDLE_VIZ=1 npm run build` — green, vite 11.9s. Treemap: `dist/bundle-stats.html` (not committed).
- **Scope:** recon only. No size reduction shipped. Operator artifact, no PR.

## TL;DR

- The parked **"split mercy-guide/speak-tab chunk"** lever is **STALE — already implemented.** `vite.config.ts` `manualChunks` already splits `mercy-speak-tab`, `mercy-teacher-tab`, `mercy-grammar-tab`, `mercy-logic-tab` into separate lazy chunks. They are **not** combined; speak-tab is its own 33.8 KB gz chunk and is **not** in the eager modulepreload set. Mark CLOSED, same disposition as opp #2 (#636).
- The **real, highest-impact win today**: the `mercy-guide` shell (**39.17 KB gzip**) is **eagerly modulepreloaded on every page including the homepage**, because `AppShell.tsx:13` statically imports `MercyGuide`, which statically imports the heavy `MercyGuidePanel` at `MercyGuide.tsx:15`. The panel only renders behind `isOpen` (starts `false`) — a textbook clean lazy boundary that is currently not taken.
- Sentry (155.83 KB gz) and charts (104.79 KB gz) are **correctly lazy** — not in the eager set. Do not re-dispatch "defer Sentry"; PR #720/#740/#655 are confirmed effective.

## Current chunk inventory

### Eagerly loaded (modulepreload in `dist/index.html` — paid on first paint, homepage included)

| Chunk | raw | **gzip** | What it is |
|---|---:|---:|---|
| `vendor` | 283.0 KB | **85.4 KB** | catch-all node_modules (sonner, @remix-run/router, zod, @floating-ui, date-fns, @capacitor/core, query-core) |
| `supabase` | 191.6 KB | **50.5 KB** | `@supabase/*` — boot singleton client |
| `react` | 145.7 KB | **46.8 KB** | react + react-dom + react-router-dom |
| `ui` | 153.7 KB | **42.8 KB** | tailwind-merge (16 KB), @radix-ui/* (select, scroll-area, toast, tooltip, popper, dialog), lucide-react, clsx, cva |
| `mercy-guide` | 121.3 KB | **39.2 KB** | MercyGuidePanel shell + MercyGuide bubble + UnifiedMercyChat + sentryInit.ts + hooks |
| `index` (entry) | 107.7 KB | **31.5 KB** | AppRouter, main.tsx, sidebar, ErrorBoundary, mfaClient, support button |
| **TOTAL EAGER** | **~1,003 KB** | **~296 KB gz** | |

### Largest lazy chunks (loaded on route/interaction — NOT on critical path)

| Chunk | gzip | Trigger | Justified? |
|---|---:|---|---|
| `sentry` | 155.8 KB | boot-error / verified-auth / explicit capture (route-gated) | ✅ correctly deferred (#720/#740/#655) |
| `charts` | 104.8 KB | admin analytics pages only | ✅ correctly deferred |
| `mercy-guide` data tabs | 19–39 KB ea | React.lazy in MercyGuidePanel | ✅ already split per-tab |
| `mercy-speak-tab` | 33.8 KB | open Speak tab | ✅ **already split — the "parked lever" is done** |
| `mercy-grammar-tab` | 20.4 KB | open Grammar tab | ✅ already split |
| `mercy-teacher-tab` | 19.4 KB | open Teacher tab | ✅ already split |
| `professional-scenarios` / `reading-passages` / `listening-items` / `speaking-topics` | 19–38 KB ea | per-surface lesson data | ✅ route-split |
| per-language `lessons-{lang}-{level}` | varies | open a level | ✅ split per language × level |

Total dist: **5.6 MB raw across 294 JS files**. Eager first-paint cost: **~296 KB gzip**.

## Verdict on the parked "split mercy-guide/speak-tab" lever

**CLOSED — already shipped.** `vite.config.ts` (lines ~575–610) contains explicit `manualChunks` rules:

```
if (s.includes('/mercy-guide/MercyTeacherTab')) return 'mercy-teacher-tab';
if (s.includes('/mercy-guide/MercySpeakTab'))   return 'mercy-speak-tab';
if (s.includes('/mercy-guide/tabs/grammar-writing/')) return 'mercy-grammar-tab';
if (s.includes('/mercy-guide/tabs/EnglishLogicTab'))  return 'mercy-logic-tab';
```

Each tab is reached only via `React.lazy` in `MercyGuidePanel.tsx`. The chunks exist in the build output, sized separately, and are absent from the eager modulepreload set. There is **no remaining "combined mercy-guide/speak-tab chunk"** to split. This memory item should be retired (same pattern as the stale opp #2 / PR #636 entry the dispatch flagged).

## Top 3 highest-impact reductions available today

### 1. Lazy-load `MercyGuidePanel` behind the bubble-open state — ~33–39 KB gzip off **every** first paint (incl. homepage). HIGH impact, LOW risk.
- **Root cause:** `src/components/layout/AppShell.tsx:13` → `import { MercyGuide } from "@/components/MercyGuide"` (static, universal layout) → `src/components/MercyGuide.tsx:15` → `import { MercyGuidePanel } from './mercy-guide/MercyGuidePanel'` (static).
- **Why it's safe:** `MercyGuide.tsx:340` `const [isOpen,setIsOpen]=useState(false)`; the panel is rendered only inside `{isOpen && (… <MercyGuidePanelResolved/> …)}` at line 1235. The bubble (`{!isOpen && …}` at 1174) never needs the panel code. The 4 tab chunks are already lazy, so this defers the *shell* (MercyGuidePanel.tsx 10.2 KB + UnifiedMercyChat 3.4 KB + hooks + the eagerly-pulled `sentryInit.ts` 4.6 KB).
- **Recommended change (do NOT ship yet):** in `MercyGuide.tsx`, replace the static import with `const MercyGuidePanel = React.lazy(() => import('./mercy-guide/MercyGuidePanel'))` and wrap the `{isOpen && …}` block in `<Suspense fallback={…}>`. Restore-before-redesign: keep bubble behavior byte-identical; only the panel gains a one-time load on first open.
- **Side note:** `sentryInit.ts` (4.6 KB) currently lands in the `mercy-guide` chunk — worth confirming during implementation that it isn't an unintended eager Sentry pull-in; if so this lever also trims a Sentry sliver off first paint.

### 2. Peel `zod` + `to-json-schema` (and re-check `sonner`/`date-fns`) out of the eager `vendor` chunk — est. 10–18 KB gzip. MEDIUM impact, LOW–MEDIUM risk.
- `vendor` (85.4 KB gz eager) top offenders: `sonner` 13 KB, `@remix-run/router`+`react-router` ~14 KB (genuinely eager — router), `zod/v4/core/schemas` + `zod/v4/classic/schemas` + `zod/v4/core/to-json-schema` ≈ 15 KB, `@floating-ui/{dom,core}` ≈ 13 KB, `date-fns/format` ≈ 9 KB, `@capacitor/core` 5.8 KB.
- `zod` + `to-json-schema` on the **eager** path is suspicious — schema validation is typically forms / AI-builder, not the homepage. Recon next step before any change: `grep -rn "from 'zod'\|from \"zod\"" src` and confirm no static importer is in the `AppShell → main → AppRouter` graph; if all importers are route-level, add a `vendor-schema` manualChunks bucket. Same check for `sonner` (toaster mount point) and `date-fns`.
- Risk: misclassifying a genuinely-eager importer would add a round-trip. This is an evidence-first lever — recon the import graph before splitting.

### 3. Audit `tailwind-merge` size + split rarely-used Radix out of the eager `ui` chunk — est. 8–15 KB gzip. MEDIUM impact, MEDIUM risk (central files).
- `tailwind-merge/dist/bundle-mjs.mjs` is the single biggest `ui` module at **16.0 KB gz**. tailwind-merge v2+ is normally ~7–8 KB gz — verify the installed version (`package.json`) and whether `cn()` in `src/lib/utils.ts` pulls the full config; a version bump or a slimmer `cn` is a free win since `cn` is eager everywhere.
- `@radix-ui/react-select` (9.5 KB) + `react-scroll-area` (5.5 KB) sit in the eager `ui` chunk but are used by specific surfaces, not the homepage shell. Candidate: a `ui-heavy` manualChunks bucket for select/scroll-area so the homepage doesn't pay ~15 KB it never renders.
- Risk: `cn()`/`ui` is a central file (CLAUDE.md operating discipline: *central files are dangerous*). Smallest-safe-change bar; verify each Radix component's actual usage surface before moving it.

## Recommended dispatch order if Chau wants to act

1. **Lever 1 first** — biggest, cleanest, lowest-risk, single-file (`MercyGuide.tsx`), already behind `isOpen`. One small PR, behavior-identical, Suspense fallback. ~33–39 KB gz off homepage first paint.
2. **Lever 2 second** — but **recon the zod/sonner/date-fns import graph before coding** (evidence-first; the gain is real only if importers are route-level). manualChunks-only change, no behavior change.
3. **Lever 3 last** — start with the cheap half (verify/upgrade tailwind-merge version); treat the Radix split as a separate, carefully-scoped follow-up because `ui`/`cn` is central.

Do not bundle these into one PR — Lever 1 is a component change, Levers 2–3 are `vite.config.ts` chunking changes; keep them isolated per the small-diffs discipline.

## Non-issues — do not re-dispatch

- "Split mercy-guide/speak-tab chunk" — done (this report).
- "Defer Sentry" / "mercy-guide 39 KB eager leak (#636/opp #2)" — Sentry is route-gated and absent from the eager set; the `mercy-guide` 39 KB eager cost is real but its cause is the **MercyGuidePanel static import** (Lever 1), not Sentry.
- charts / per-tab / per-language-level splits — all correctly lazy.
