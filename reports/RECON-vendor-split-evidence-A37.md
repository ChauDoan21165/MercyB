# RECON — Vendor Split Evidence: zod / sonner / date-fns (A37)

- **Date:** 2026-05-19
- **Base:** `origin/main` @ `4fbc3a41f` (worktree `a37/vendor-split-measure`, isolated `npm ci`)
- **Upstream:** A25 Lever 2 (`reports/RECON-bundle-audit-A25.md`, `origin/a25/bundle-audit-fresh`) — "peel zod/to-json-schema/sonner/date-fns out of the eager `vendor` chunk, est. 10–18 KB gz, evidence-first."
- **Method:** measure-then-decide. Two `MB_BUNDLE_VIZ=1 npm run build` runs (baseline + experimental 3-way split), compared via Rollup's own modulepreload graph. Experimental `vite.config.ts` change reverted — **recon only, no code shipped**. Operator artifact, no PR.

## TL;DR — SHIP THE SPLIT (full 3-way)

All three libraries are **proven lazy-only**: when isolated into their own chunks, Rollup placed **none** of them in `dist/index.html`'s eager `modulepreload` set. They are reachable only via async/route-split boundaries — not the `AppShell → main → AppRouter` eager shell.

**Splitting removes ~31.4 KB gzip from every first paint (homepage included).** This is a real gain, not byte-shuffling. The "ghost task" doubt is resolved: **the gain is real and larger than A25's 10–18 KB estimate.**

| Library | Isolated chunk (raw / **gzip**) | In eager modulepreload? | Verdict |
|---|---:|---|---|
| `zod` | 60.65 KB / **16.48 KB** | ❌ NO | split → −16.48 KB first paint |
| `sonner` | 33.83 KB / **9.57 KB** | ❌ NO | split → −9.57 KB first paint |
| `date-fns` | 20.37 KB / **5.76 KB** | ❌ NO | split → −5.76 KB first paint |
| **Total deferred off critical path** | | | **~31.4 KB gzip** |

## Decisive evidence — the modulepreload graph

A chunk appears in `<link rel="modulepreload">` in `dist/index.html` **only if Rollup's static import-graph finds it reachable from an eager entry.** This is Rollup's own analysis, not manual grep — it is authoritative for the eager-vs-lazy question.

**Baseline build** (`vendor` catch-all, A25 config):
- Eager modulepreload set: `mercy-guide`, `react`, `supabase`, `ui`, **`vendor`** + entry `index`
- `vendor` = 283.03 KB raw / **85.44 KB gzip** (eager — contains @remix-run/router, @floating-ui, @capacitor/core, query-core **and** the lumped-in zod/sonner/date-fns)

**Experimental build** (zod/sonner/date-fns isolated into `vendor-zod` / `vendor-sonner` / `vendor-datefns` before the `node_modules → vendor` catch-all):
- Eager modulepreload set: `mercy-guide`, `react`, `supabase`, `ui`, **`vendor`** + entry `index`
- `vendor-zod`, `vendor-sonner`, `vendor-datefns` → **ABSENT from modulepreload** = Rollup found no static eager path to any of them
- `vendor` (remaining, still eager) = 167.48 KB raw / **54.06 KB gzip**

**First-paint gzip delta: 85.44 → 54.06 KB = −31.38 KB gzip** on the universal critical path. Sum of split-off chunks = 16.48 + 9.57 + 5.76 = 31.81 KB (deferred to on-demand). Total app bytes essentially unchanged (+0.43 KB chunk-boundary overhead — negligible). Bytes are **moved off the homepage path, not duplicated.**

Build health: both builds green; the split introduced **zero new circular-chunk or rollup warnings** (the lone pre-existing `slos.ts` dynamic+static `(!)` is in baseline too, admin-only, unrelated).

## Per-library import-graph corroboration (matches the build proof)

### zod — route/feature-level only
Importers: `src/lib/validation.ts`, `src/lib/inputValidation.ts`, `src/lib/security/inputValidator.ts`, `src/lib/api/validation.ts`, `src/data/bilingualSentencesSchema.ts`, `src/data/speechSentencesSchema.ts`, `src/data/cultural-packs/vn/culturalPackSchema.ts`, `src/types/paths.ts`.
- `src/types/paths.ts` (the only schema-y one near hooks) is consumed by `usePaths.ts` / `services/paths.ts` via **`import type`** (type-only, erased at build — no runtime zod pull).
- The rest are form/security/data-schema validation surfaces, not the eager shell. Rollup confirms: no static eager path.

### sonner — eager Toaster is NOT sonner; sonner path is lazy
- `main.tsx:636 <Toaster />` resolves to `@/components/ui/toaster`, which is **radix-based** (`@/hooks/use-toast` + `@/components/ui/toast`) — **not** sonner — and is itself **lazy** via `lazyWithRetry` (`main.tsx:89`). Comment at `main.tsx:86`: "Toasters are passive surfaces that only paint once a toast actually fires."
- `AccessibleToaster` (`a11y/AccessibleToast.tsx`, a sonner importer) is also lazy via `lazyWithRetry` (`main.tsx:92`).
- `src/lib/guardedCall.ts` (a sonner importer) has **zero consumers** in `src/` — orphan; its sonner import reaches no graph.
- Remaining sonner importers are admin/modal/feature components (CreditLimitModal, MercyGuideProfileSettings, AuditCodeViewer, MercyStyleSelector, RoomSpecificationManager, AiControlPanel, useAIReasoning, AdminAccessCodes) — all route-level.

### date-fns — chat + admin + analytics, all lazy
Importers: `ChatMessage.tsx` (lazy chat surface), `admin/AdminAuditLog.tsx`, `pages/admin/AdminPaymentsPage.tsx`, `pages/admin/AdminAccessCodes.tsx`, `analytics/FeedbackTrendsChart.tsx` (already in the lazy `charts` chunk). No eager-shell importer.

## Recommended action — **SHIP, full 3-way split**

Single isolated `vite.config.ts` PR (small-diffs discipline). Insert **before** the `if (s.includes('/node_modules/')) return 'vendor';` catch-all (currently `vite.config.ts:582`):

```ts
if (s.includes('/node_modules/zod/')) return 'vendor-zod';
if (s.includes('/node_modules/sonner/')) return 'vendor-sonner';
if (s.includes('/node_modules/date-fns/')) return 'vendor-datefns';
```

- **Behavior change:** none — pure chunk-routing config. No source change.
- **Gain:** ~31.4 KB gzip off **every** first paint, including the homepage and login (the universal `vendor` shell).
- **Independent of A25 Lever 1** (MercyGuidePanel lazy — different file). Can ship in parallel; do not bundle into one PR.

### Trade-offs / caveats (none blocking)
- Routes that use zod (validation-heavy forms/admin) now fetch one extra ~16.5 KB chunk on first navigation **to those routes** — not the homepage. Same for sonner (~9.6 KB on first toast-bearing route) and date-fns (~5.8 KB on admin/chat). Acceptable: the cost moves off the universal critical path onto the specific surfaces that need it.
- 3 extra small chunks among 294 existing JS files — negligible under HTTP/2 multiplexing; still SW-runtime-cacheable on first use.
- Partial split is **not** recommended — all three are individually proven lazy, so splitting all three captures the full 31.4 KB; dropping any one only forfeits its share for no benefit.

## Disposition for future agents

A25 Lever 2 is **CONFIRMED — ship the 3-way `vendor` split.** This is not a ghost task: evidence shows a ~31.4 KB gzip first-paint win (above A25's 10–18 KB estimate, because A25 hadn't yet measured `zod` at its true isolated 16.5 KB). Next step is a 3-line `vite.config.ts` PR; no further recon needed.
