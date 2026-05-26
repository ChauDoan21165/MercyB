## Tier 1 — image optimization (no reference/code changes)

Recompress/right-size in place via macOS `sips` (same filenames, same formats, no `<picture>`/path/code changes) + delete unreferenced Play Store assets.

| File | Before | After | Note |
|---|---|---|---|
| `public/images/mercy-kids/bear-face.jpg` | 3122 KB, 2048² | **124 KB, 1168²** | ⚠️ kids flashcard (loaded via `${key}.jpg`). Was a non-resized 2048² original — every sibling flashcard is ~784×1168 / 150–260 KB. Downscaled from the pristine source at JPEG q88 (high quality; downscale-from-2048 is perceptually clean). **Please eyeball on a device** (sacred-path bar) — if degraded, reverting just this one file is trivial. |
| `public/teacher-mercy.png` | 822 KB, 1024² | **380 KB, 640²** | Home serves this via `<picture>` → AVIF (10 KB) / WebP (12 KB); the PNG is the legacy fallback, so Home real-world impact is small. Kept PNG/filename per Tier 1. |
| `public/brand/teacher-mercy.png` | 822 KB, 1024² | **380 KB, 640²** | Used directly as the Mercy-guide host image (`MERCY_HOST_IMAGE_SRC`) — this copy does load as PNG. 640² is retina-safe for the avatar/card display. (Byte-identical to the `/` copy before & after; `/`↔`/brand` dedupe is Tier 3 — skipped, needs a code ref change.) |
| `public/brand/mercy-blade-header.png` | 1543 KB, 1536×1024 | **125 KB, 512×341** | Nav-bar brand logo (AppRouter) — displayed small; 512px wide is well beyond 2× nav size, no visible regression. |
| `public/brand/MercyBlade-feature-graphic.png` | 1981 KB | **deleted** | Unreferenced (verified across src/public/index.html; no dynamic `brand/` path). Standard Google Play feature-graphic (1024×500); product is web-only. |
| `public/brand/MercyB-feature-graphic.png` | 1981 KB | **deleted** | Same — exact-size duplicate of the above. |

**Total ≈ 9.26 MB removed** from `public/` (recompress ≈ 5.30 MB + deletes 3.96 MB).

### Scope notes (Principle #1 — surfaced, not silently absorbed)

- The original "~10 MB / a few files" framing was off: `public/` images are **48 MB / 1999 files**, dominated by ~115 `mercy-kids/*.jpg` (~21 MB) — the offline-sacred kids set. That set is **NOT touched here** — it's **Tier 2**, a separate follow-up PR gated on Chau approving a quality sample.
- The dispatch's "if unused, delete" rule would have **deleted `bear-face.jpg`** (literal grep says unreferenced) — but it's a live kids flashcard loaded via a constructed `${key}.jpg` path. It was **recompressed, never deleted**.
- Tier 3 (delete unreferenced brand originals, `/`↔`/brand` dedupe, WebP) **skipped** per dispatch.

### Gates

- `npm run typecheck:ci` ✅ · `npm run lint` ✅ · `npm run build` ✅ · `npx vitest run` ✅ **316 files / 6009 tests, all green** (the historical rlsContract 6 are resolved on main — clean run, no caveat). Build green also confirms no deleted asset was referenced.

Single PR off `origin/main`, not stacked. Auto-deploys via the Vercel GitHub App on merge. **Tier 2 (the ~21 MB → ~4 MB kids-set lever) follows as its own PR after you approve a sample.**
