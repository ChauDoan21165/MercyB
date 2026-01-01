# ChauDoanControl (Mercy Blade Control Map)
Version: MB-BLUE-100.7 — 2026-01-01 (+0700)

Purpose
- One place to see “what file controls what”.
- Prevent: fix A → break B.
- Update this file whenever you change any “core UI control” behavior.

============================================================
GLOBAL UI CONTROLS (cross-page)
============================================================

ZOOM (global text zoom for learning content)
- Controller (source of truth):
  - src/components/audio/BottomMusicBar.tsx
    - Writes:
      - documentElement.style.setProperty("--mb-essay-zoom", "<pct>")
      - documentElement.setAttribute("data-mb-zoom", "<pct>")
      - localStorage key: "mb.ui.zoom"
- Consumers (who reads it):
  - src/components/room/RoomRenderer.tsx
    - Watches documentElement "data-mb-zoom" (MutationObserver)
    - Applies fontSize scaling inside BOX 4 content area only

Notes:
- Zoom SHOULD NOT resize the fixed bottom bar. Only content should scale.

------------------------------------------------------------

BOTTOM MUSIC BAR (entertainment dock)
- Component:
  - src/components/audio/BottomMusicBar.tsx
- Mount points (where it is attached):
  - src/pages/Home.tsx
    - Fixed mount aligned to PAGE_MAX (980) via wrapper
  - src/pages/ChatHub.tsx
    - Fixed mount aligned to content ruler (max-w-[980px] px-4 md:px-6)

Rules:
- Music bar is entertainment-only.
- Learning audio lives inside rooms (TalkingFacePlayButton).
- No extra text labels inside bar (icons are ok).

------------------------------------------------------------

ROOM LOADING + PAGE SHELL
- Room route controller:
  - src/pages/ChatHub.tsx
    - Loads room json, chooses UI, mounts BottomMusicBar
- Room UI renderer:
  - src/components/room/RoomRenderer.tsx
    - 5-box room spec, keyword UI, entry audio clamp, zoom consumer

------------------------------------------------------------

ROOM ENTRY AUDIO UI (learning audio)
- Component:
  - src/components/audio/TalkingFacePlayButton.tsx
- Used by:
  - src/components/room/RoomRenderer.tsx (entry audio)
- Must never overflow card:
  - RoomRenderer wraps it in .mb-audioClamp

------------------------------------------------------------

HOME PAGE (marketing text-only + entertainment dock)
- Page:
  - src/pages/Home.tsx
- Rules:
  - Text-only (no learning audio players)
  - Uses hero image: /hero/hero_band.jpg
  - BottomMusicBar mounted fixed, aligned to PAGE_MAX

============================================================
LOCALSTORAGE KEYS (do not rename casually)
============================================================
- "mb.ui.zoom"        -> zoom percent (60–140)
- "mb.music.tab"      -> music tab
- "mb.music.trackId"  -> selected track
- "mb.music.vol"      -> volume
- "mb.music.fav"      -> favorites
- "mb_admin"          -> owner flag for admin dot

============================================================
When debugging “Zoom not working”
============================================================
1) Check BottomMusicBar is mounted on that page.
2) Confirm in DevTools:
   - document.documentElement.getAttribute("data-mb-zoom")
   - getComputedStyle(document.documentElement).getPropertyValue("--mb-essay-zoom")
3) Confirm the page actually uses RoomRenderer (zoom affects learning content, not Home text).
BOTTOM MUSIC BAR (entertainment dock)
- Component (UI + logic only, NOT fixed):
  - src/components/audio/BottomMusicBar.tsx
- Mount points (who positions it fixed + aligns it):
  - src/pages/Home.tsx
    - fixed wrapper aligned to PAGE_MAX (980)
  - src/pages/ChatHub.tsx
    - fixed wrapper aligned to content ruler (max-w-[980px] px-4 md:px-6)

Rule:
- BottomMusicBar must NOT use position:fixed internally.
- Pages own alignment. Component owns controls + localStorage + zoom writes.
