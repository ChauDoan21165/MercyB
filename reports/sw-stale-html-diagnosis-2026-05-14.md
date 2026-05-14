# Service Worker — stale HTML after every deploy

**Date:** 2026-05-14
**Author:** A4
**Status:** Fix proposed in this PR.

## TL;DR

Every production deploy leaves returning users on the previous version. The Workbox-generated Service Worker precaches `index.html` and registers a NavigationRoute that serves the precached copy for every SPA navigation. With `skipWaiting: false / clientsClaim: false`, the new SW lands in `waiting` and never activates until the user closes all tabs. So the old SW keeps serving the old `index.html` forever — until a hard refresh or incognito visit.

PR #424's fix only kicks in when a code-split chunk 404s (because Vercel purged the file referenced in the stale shell). If old chunks still exist at the edge, the user just sees yesterday's app indefinitely with no recovery trigger.

## What PR #424 did and why it isn't enough

**PR #424 — "unregister stale SW before chunk recovery reload"**

- Added `src/lib/swRecovery.ts:unregisterAllServiceWorkers()`.
- Wired it into `scheduleOneTimeChunkReload` in `src/main.tsx` so when a `chunk-load-failure`/`preload-failure` triggers the one-shot reload, the SW is unregistered first. Reload then hits Vercel origin and picks up the fresh `index.html`.

**Why it doesn't cover the symptom Chau is hitting:**

The trigger is a *chunk 404*. That requires the deploy to have **removed** a JS chunk referenced in the cached shell. Vercel does eventually purge old immutable assets, but old chunks often remain reachable long enough that the user never gets a 404 — they just keep loading the previous app from the SW's precache.

So PR #424 closes a real failure mode (preload-failure-triggered recovery looping on the same stale shell) but does **not** address the upstream cause: the SW shouldn't be serving stale HTML for navigations in the first place.

## Why this is happening — current SW behavior

`vite.config.ts` workbox block (current state):

| Option | Value | Effect |
|---|---|---|
| `skipWaiting` | `false` | New SW stays in `waiting` until **all** tabs close. |
| `clientsClaim` | `false` | New SW doesn't claim existing pages even after it activates. |
| `navigateFallback` | `'index.html'` | Workbox registers a NavigationRoute that serves precached `index.html` for every navigation outside the denylist. |
| `globIgnores` | `['**/lessons-*.js']` | `index.html` IS in the auto-precache manifest. |

`vercel.json` correctly sends `Cache-Control: no-cache, must-revalidate` on `/` and `/index.html`, so the browser's HTTP cache is not the problem. The Service Worker layer sits *above* HTTP cache and short-circuits the network entirely.

Flow for a returning user after a deploy:

1. User opens a tab they had open yesterday (or revisits `mercyblade.com`).
2. Old SW (still in control) intercepts the navigation request.
3. Workbox's PrecacheRoute / NavigationRoute returns the precached `index.html` from yesterday's deploy.
4. The old `index.html` references old chunk hashes. If they still exist on Vercel's edge → app loads, old version. If they're 404 → PR #424's recovery kicks in.
5. main.tsx (the old version, since the old HTML is what loaded) calls `serviceWorker.register('/sw.js')`. Browser fetches `/sw.js`, finds a new SW, installs it. New SW goes into `waiting`.
6. `skipWaiting:false` → new SW just sits there. User stays on old version forever, until they close every tab.

`useVersionCheck` does detect the new version via `/version.json` polling and renders `UpdatePrompt`, but it requires the user to click "Reload" — and many users won't.

## What this PR changes

Three coordinated changes:

### 1) Workbox config (`vite.config.ts`)

- **Exclude `index.html` from precache.** With `index.html` out of the precache manifest, PrecacheRoute and `navigateFallback` can no longer serve a stale shell.
- **Drop `navigateFallback` + `navigateFallbackDenylist`.** Replaced by a runtime caching rule (below).
- **Add a runtime NetworkFirst rule for navigations.** `urlPattern: ({request}) => request.mode === 'navigate'`, 3s network timeout, cached in a `pages` cache. Online → always fresh HTML. Offline + previously-visited → cached HTML.
- **Flip `skipWaiting: true` and `clientsClaim: true`.** New SW takes over immediately when it activates, instead of waiting for all tabs to close.

### 2) Boot SW registration (`src/main.tsx`)

- On `updatefound`, when a new SW finishes installing AND there's already a controller (i.e. an old SW is active), `postMessage({type: 'SKIP_WAITING'})` to the installing worker. Combined with `skipWaiting:true` in workbox config, this forces the new SW to activate without waiting for tabs to close.
- Listen for `controllerchange` and reload the page exactly once (only when there was a prior controller — first-time installs don't reload). Ensures the page itself runs the new bundle, not just future fetches.

### 3) `useVersionCheck.applyUpdate`

- After `postMessage({type:'SKIP_WAITING'})`, also call `unregisterAllServiceWorkers()` before `window.location.reload()`. Belt-and-suspenders: even if the waiting SW message doesn't fire (e.g. the new SW never reached `waiting` state because the old SW is intercepting `/sw.js`), the reload hits origin and re-registers a fresh SW.

## Tradeoffs

| Tradeoff | Old behavior | New behavior |
|---|---|---|
| Mid-session SW swap | New SW stays `waiting`; old SW serves stale assets until all tabs close. | New SW activates immediately. Existing page reloads once. Brief disruption — but no more multi-day staleness. |
| Offline support for deep-URL refresh | Precached `index.html` served via navigateFallback for any deep URL. | Only works for URLs in the runtime `pages` cache (i.e. URLs the user has visited refresh-style while online). React Router client-side navigation is unaffected. |
| Network-first cost | Cache-first (instant from SW). | NetworkFirst with 3s timeout. Typical Vercel edge response is <300ms, so user-visible latency is unchanged on healthy networks. Slow network → falls back to cache. |

These are explicitly accepted in Chau's brief: "HTML must be network-first... fall back to cache only when offline" and "skipWaiting() and clients.claim() so a new SW takes over immediately".

## Will current stuck users self-recover after deploy?

Partially. The user's currently-running old SW has no knowledge of these changes — it's still cache-first for HTML. To get the new SW + new HTML, the user needs **one** of:

- A code-split chunk 404 to trigger PR #424's recovery (unchanged).
- A natural tab close + reopen, which lets the new SW activate normally.
- A click on the `UpdatePrompt` "Reload" button. After this PR's change to `applyUpdate`, that path now also unregisters all SWs, so the resulting reload definitely hits origin.

For all subsequent deploys (the bug is *every* deploy, per Chau), the new SW behavior takes over automatically — users see new versions within seconds of revisiting the tab.

## Verification

- `npm run typecheck` — must pass.
- `npm run build` — must pass; inspect `dist/sw.js` afterward to confirm no `index.html` precache entry and presence of the navigation NetworkFirst route.
- `npm test` — must pass; no test changes expected from the workbox config edit (jsdom doesn't exercise the SW lifecycle).

Manual smoke (after Preview deploys this branch and then a second time):

1. Open a tab on the current production. Confirm the old SW is registered. Deploy this PR to Preview.
2. Hard-refresh the Preview URL once to seed the new SW. Confirm DevTools → Application shows the new SW with `clientsClaim: true` semantics.
3. Deploy a trivial follow-up change to Preview. Without hard-refreshing, return to the tab. New SW should activate within seconds, and the page should reload automatically via `controllerchange`. The new content should be visible.
4. Repeat step 3 — second deploy should propagate identically.
5. Go offline (DevTools → Network → Offline) and refresh `/`. The cached `/` from the `pages` cache should still load. Deep-URL refresh that was never visited online while offline will fail — accepted tradeoff.
