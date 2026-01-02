ChauDoanControl (Mercy Blade Control Map)

Version: MB-BLUE-100.8 — 2026-01-01 (+0700)

Purpose

One place to see “what file controls what”.

Prevent: fix A → break B.

Update this file whenever you change any “core UI control” behavior.

============================================================
GLOBAL UI CONTROLS (cross-page)

ZOOM (global text zoom for learning content)

Controller (source of truth):

src/components/audio/BottomMusicBar.tsx

Writes:

documentElement.setAttribute("data-mb-zoom", "<pct>")

localStorage["mb.ui.zoom"] = "<pct>"

(optional/legacy) --mb-essay-zoom

Consumers (who reads it):

src/components/room/RoomRenderer.tsx

Watches documentElement[data-mb-zoom] (MutationObserver)

Applies scaling inside BOX 4 content area only

src/pages/Home.tsx (MB-BLUE-100.8+)

Reads data-mb-zoom + localStorage fallback

Applies zoom to Home content only (NOT header, NOT fixed music bar)

Notes:

Zoom MUST NOT resize the fixed bottom bar. Only learning/home content.

BOTTOM MUSIC BAR (entertainment dock)

UI + logic component:

src/components/audio/BottomMusicBar.tsx

Layout ownership (IMPORTANT):

If BottomMusicBar contains position: fixed / left/right / 100vw
→ BottomMusicBar is the layout owner (and can cause “stick out” everywhere).

If BottomMusicBar is NOT fixed
→ The mounting page/layout owns fixed positioning + max-width alignment.

Mount points (where it is attached / positioned):

src/pages/Home.tsx

Fixed mount aligned to PAGE_MAX = 980 via wrapper:

outer: full width + pointer-events none

inner: maxWidth: 980, centered + pointer-events auto

src/pages/ChatHub.tsx (or shared app shell if you moved it)

Should mount the same way: fixed outer + inner aligned to 980.

If the bar sticks out on /room/*, this mount is missing/incorrect OR
BottomMusicBar is still fixed internally.

Rules (LOCKED):

Music bar is entertainment-only.

Learning audio lives inside rooms (TalkingFacePlayButton).

Avoid ambiguous icons: volume must look like volume (not heart).

Fast confirm (no nano needed):

Run:

rg -n "position:\\s*fixed|100vw|left:\\s*0|right:\\s*0" src/components/audio/BottomMusicBar.tsx

rg -n "BottomMusicBar" src/pages/ChatHub.tsx src/App.tsx src/router/AppRouter.tsx src/components/* -S

ROOM LOADING + PAGE SHELL

Room route controller:

src/pages/ChatHub.tsx

Loads room json, chooses UI, mounts room shell (and often mounts BottomMusicBar)

Room UI renderer:

src/components/room/RoomRenderer.tsx

5-box room spec, keyword UI, entry audio clamp, zoom consumer

ROOM ENTRY AUDIO UI (learning audio)

Component:

src/components/audio/TalkingFacePlayButton.tsx

Used by:

src/components/room/RoomRenderer.tsx (entry audio)

Must never overflow card:

RoomRenderer wraps it in .mb-audioClamp

HOME PAGE (marketing text-only + entertainment dock)

Page:

src/pages/Home.tsx

Rules:

Text-only (no learning audio players)

Uses hero image: /hero/hero_band.jpg

BottomMusicBar mounted fixed, aligned to PAGE_MAX

============================================================
LOCALSTORAGE KEYS (do not rename casually)

mb.ui.zoom -> zoom percent (60–140)

mb.music.tab -> music tab

mb.music.trackId -> selected track

mb.music.vol -> volume

mb.music.fav -> favorites

mb_admin -> owner flag for admin dot

============================================================
When debugging “Music bar sticks out”

Check whether BottomMusicBar is fixed internally:

search BottomMusicBar.tsx for position: fixed, 100vw, left: 0, right: 0.

If it is NOT fixed internally:

find the mount wrapper for /room/* (usually ChatHub or app shell)

ensure inner wrapper uses the same max width (980) as Home.

Confirm in DevTools:

select the bottom bar container → check computed width and left/right.

New thing to learn:
When UI “sticks out,” first identify layout owner vs component owner. Fixing the wrong owner creates “works on Home, breaks in rooms” loops.