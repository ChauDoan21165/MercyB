// PATH: vite.config.ts

/**
 * File: vite.config.ts
 * Path: vite.config.ts
 */

// MB-BLUE-97.8 — 2026-04-01 (+0700)
//
// RULES (LOCKED):
// - No frontend dev-server port configuration here (port lives in package.json scripts)
// - No SWC (avoids native binding failures on Vercel / CI)
// - Keep alias @ → src
// - Stable, boring, deploy-safe config
//
// FIX 97.7:
// - Prevent "Circular chunk: vendor-react -> vendor -> vendor-react"
// - Use mutually-exclusive manualChunks buckets: react / supabase / ui / vendor
//
// PATCH 2026-01-29:
// - Force single React instance in prod
//
// PATCH 2026-03-21:
// - Add PWA support
//
// PATCH 2026-04-01:
// - Add dev proxy for Mercy grammar API so frontend uses /api/mercy/grammar
// - Avoid browser-side localhost fetch failures and fallback-only behavior
//
// PATCH 2026-04-11:
// - Add dev proxy for Supabase edge functions under /functions/v1
// - This restores local room opening when the frontend hits the fallback
//   /functions/v1/secure-room-loader path during dev

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import path from 'path';
import { fileURLToPath } from 'url';
import { OFFLINE_PRECACHE_LESSONS } from './src/lib/offline/precacheManifest';

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeId(id: string) {
  return id.replace(/\\/g, '/');
}

function isReactPath(s: string) {
  return (
    s.includes('/node_modules/react/') ||
    s.includes('/node_modules/react-dom/') ||
    s.includes('/node_modules/react-is/') ||
    s.includes('/node_modules/scheduler/') ||
    s.includes('/node_modules/react/jsx-runtime') ||
    s.includes('/node_modules/react/jsx-dev-runtime') ||
    s.includes('/node_modules/react-dom/client') ||
    s.includes('/node_modules/react-dom/server') ||
    s.includes('/node_modules/react-dom/index') ||
    s.includes('/node_modules/react/index')
  );
}

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),

    // Bundle treemap report — only enabled when explicitly requested via
    // `MB_BUNDLE_VIZ=1 npm run build`. Off by default so production builds
    // in CI/Vercel don't generate or ship dist/bundle-stats.html. Used
    // for the bundle audit (reports/a7-bundle-audit.md).
    ...(process.env.MB_BUNDLE_VIZ === '1'
      ? [
          visualizer({
            filename: 'dist/bundle-stats.html',
            template: 'treemap',
            gzipSize: true,
            brotliSize: false,
            emitFile: false,
            open: false,
            sourcemap: false,
          }) as never,
        ]
      : []),

    // Sentry source-map upload — only active when SENTRY_AUTH_TOKEN +
    // SENTRY_ORG + SENTRY_PROJECT are present (i.e. real production
    // builds on Vercel). On laptop builds with no token the plugin is a
    // no-op, so dev builds never reach out to Sentry. The plugin sets
    // `build.sourcemap = "hidden"` automatically: source maps are
    // generated, uploaded, and then NOT referenced by the JS bundle, so
    // browser DevTools never sees them but Sentry can still de-mangle
    // stack traces server-side. This satisfies the brief's "DO NOT
    // include source maps in client bundle" requirement.
    ...(process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT
      ? [
          sentryVitePlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            // Opt out of plugin telemetry; the sourcemap upload itself
            // still goes through. No data leaves the build host except
            // the sourcemaps.
            telemetry: false,
            // Per @sentry/vite-plugin v4.x API, sourcemap-related
            // options nest under `sourcemaps:`. A bare top-level
            // `filesToDeleteAfterUpload` was the v2.x shape, removed in
            // v3+; 4.9.1's `Options` type rejects it (TS2353), which is
            // what broke CI's bare `tsc --noEmit`. Deleting the .map
            // files once upload completes keeps them out of the client
            // deploy artifact; the glob is intentionally rooted at the
            // project so dist outputs match cleanly regardless of how
            // outDir resolves.
            sourcemaps: {
              filesToDeleteAfterUpload: ['**/*.map'],
            },
          }),
        ]
      : []),

    VitePWA({
      // Returning users were stuck on the prior deploy because the SW
      // ran with skipWaiting:false / clientsClaim:false AND served the
      // precached index.html for every navigation. New SWs sat in
      // `waiting` until all tabs closed, so old HTML kept coming back.
      // The fix below (network-first HTML, immediate SW takeover) is
      // documented in reports/sw-stale-html-diagnosis-2026-05-14.md.
      registerType: 'autoUpdate',
      // Disable the plugin's auto-injected registerSW.js. The default
      // ('auto') ships a tiny script that calls navigator.serviceWorker
      // .register('/sw.js') with NO `.catch`, so any rejection (private
      // mode, security/policy block, file:// origin, transient network
      // failure, etc.) surfaces in Sentry as an unhandled "Error: Rejected"
      // pointing at registerSW.js. main.tsx already does the registration
      // manually with a `.catch(devLog)` swallow, so this duplicate auto-
      // registration is both redundant and the source of the noise.
      injectRegister: false,
      includeAssets: [
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/icon-maskable-512.png',
      ],
      workbox: {
        // Bumped from the 2 MiB default because the mercy-guide chunk is
        // ~2.12 MB and growing as content lands; chunk-splitting is
        // separate tech debt.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // Perf fix #3 — exclude code-split lesson chunks from precache.
        // 36 lessons-{lang}-{level}.js chunks (~9.5 MB) were precached
        // on every first visit, even for languages the user never opens.
        // Moved to runtime CacheFirst — only cached after first actual
        // lesson load.
        //
        // Also exclude index.html. If it sits in precache, Workbox's
        // PrecacheRoute / NavigationRoute serves the cached copy for
        // every navigation, which is exactly the stale-HTML bug we are
        // fixing. The runtime NetworkFirst rule below handles `/` and
        // every other navigation request, with its own `pages` cache
        // for offline fallback.
        globIgnores: ['**/lessons-*.js', 'index.html'],
        // PR #392 — precache JS allowlist.
        //
        // Before: 276 JS chunks (~5.8 MB) precached on first launch,
        // including admin pages, blog posts, every exam-prep variant,
        // every language lesson page, certificates, leaderboards, and
        // dozens of rarely-visited routes that are already React.lazy.
        // Service-worker install hammered the network on first load,
        // defeating the whole point of code-splitting.
        //
        // After: only the chunks every user needs in the first ~10s of
        // arriving at the site. Everything else is fetched on demand
        // when the user navigates to the route, served from the
        // browser HTTP cache on repeat visits (the assets are hashed
        // and immutable, so browser caching is durable and correct).
        //
        // Allowlist:
        //   index     — app shell entry
        //   react     — React core
        //   ui        — UI primitives (shadcn/radix)
        //   vendor    — common vendor bundle
        //   supabase  — supabase-js client (used by auth on landing)
        //   Home      — landing route
        //   LoginPage — auth route reached from landing
        //
        // NOT precached — `sentry` (removed PR: SW precache fix): the
        // @sentry/react SDK is deliberately lazy-loaded at runtime
        // (`await import("@sentry/react")` inside initSentry's async IIFE,
        // src/lib/monitoring/sentryInit.ts) and carved into its own chunk
        // so it never modulepreloads. Precaching it silently undid that —
        // the SW fetched the single largest JS chunk (~462 KB raw /
        // ~152 KB gzip) in the background on every first visit, racing the
        // eager critical graph on the exact constrained-3G mobile networks
        // STRATEGY §4 targets. The runtime dynamic import (already deferred
        // off first paint) still fetches it once and the browser
        // HTTP-caches it (hashed/immutable), so error reporting is
        // unaffected. See reports/RECON-bundle-perf-audit.md §1.
        //
        // The list is intentionally tiny. The acceptance bar is < 30
        // precached JS chunks; everything beyond the seven above is
        // a route the median user may never visit. If a chunk turns
        // out to be hot enough that runtime-fetching it hurts a real
        // user flow, add it here (one line, one rebuild) — don't
        // expand the list pre-emptively.
        manifestTransforms: [
          async (manifest) => {
            const PRECACHE_JS_STEMS = new Set([
              "index",
              "react",
              "ui",
              "vendor",
              "supabase",
              "Home",
              "LoginPage",
            ]);
            const HASHED_JS = /assets\/([^/]+?)-[A-Za-z0-9_-]{8,}\.js$/;
            const filtered = manifest.filter((entry) => {
              // Keep every non-JS asset (html, css, json, icons, fonts,
              // theme-loader.js at the dist root, the room JSON files
              // injected via additionalManifestEntries, etc).
              if (!entry.url.endsWith(".js")) return true;
              // Keep root-level JS (theme-loader.js) — the regex only
              // matches hashed bundles under /assets/.
              const m = entry.url.match(HASHED_JS);
              if (!m) return true;
              return PRECACHE_JS_STEMS.has(m[1]);
            });
            return { manifest: filtered, warnings: [] };
          },
        ],
        // Explicit null — vite-plugin-pwa defaults navigateFallback
        // to 'index.html', which would register a NavigationRoute that
        // takes priority over runtime caching rules. We want the
        // NetworkFirst navigation rule below to own all page loads
        // instead, so the SW can't ever serve a stale precached shell.
        // index.html is also excluded from precache (see globIgnores).
        // Tradeoff: an offline refresh of a deep URL that was never
        // visited online has no shell to fall back to — accepted per
        // reports/sw-stale-html-diagnosis-2026-05-14.md. The runtime
        // `pages` cache (filled by NetworkFirst on every online visit)
        // still serves cached HTML for offline refresh of `/` and any
        // URL the user previously reloaded.
        navigateFallback: null,

        // Take over immediately on deploy. With these flipped, the new
        // SW activates as soon as it installs and claims the open page,
        // instead of sitting in `waiting` until every tab closes. The
        // accompanying main.tsx changes message SKIP_WAITING + reload
        // once on controllerchange so the page itself runs the new
        // bundle, not just future fetches.
        skipWaiting: true,
        clientsClaim: true,
        // Step 8 — pre-cache the core 50 room JSON files so first-time
        // offline visitors can still open a familiar lesson. Audio files
        // are intentionally NOT precached (size budget); they ride the
        // runtime caches below on first play.
        additionalManifestEntries: OFFLINE_PRECACHE_LESSONS.map((roomId) => ({
          url: `/data/${roomId}.json`,
          revision: null,
        })),
        runtimeCaching: [
          {
            // Network-first for every HTML navigation. This is the
            // single most important rule in the file: it stops the SW
            // from ever serving a stale `index.html` for `/`, `/room/x`,
            // `/account`, etc. Online users always get the latest shell
            // from Vercel; offline users fall back to the `pages` cache
            // (populated from prior online visits). Must be registered
            // before any other rule that could match navigations.
            //
            // /assets/, /api/, /functions/v1/, /storage/v1/ are matched
            // by their own request types (script/fetch/etc, not navigate),
            // so this matcher only catches actual page-load navigations.
            urlPattern: ({ request }: { request: Request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              networkTimeoutSeconds: 3,
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            urlPattern: /\/audio\/kids\/.*\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'kids-audio',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /\/audio\/music\/.*\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'music',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /\/images\/mercy-kids.*\.png$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'kids-images',
              expiration: { maxEntries: 2000, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // Bucket is public today; regex kept forward-compatible for future flip to signed URLs.
            urlPattern: /\/storage\/v1\/object\/(sign|public)\/room-audio\/.*\.mp3/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'room-audio',
              matchOptions: { ignoreSearch: true },
              expiration: { maxEntries: 2000, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Step 8 — generic adult-room audio (any /assets/audio/* or /audio/*.mp3)
            // routed through cache-first with the 200-entry / 30-day budget the
            // brief calls out. Sits below the kids/music/images patterns above so
            // those keep their dedicated caches.
            urlPattern: /\/(?:assets\/)?audio\/(?!kids\/|music\/).*\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'lesson-audio',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Offline Lite v2 — the previous `/api/.*` NetworkFirst rule
          // was removed here. AI chat (e.g. /api/mercy/grammar) and
          // any other dynamic API responses must NOT be cached:
          // - they're personalized / non-idempotent
          // - serving a stale chat reply offline would mislead the
          //   learner about what Teacher Mercy "said"
          // If a specific /api/* endpoint ever needs offline tolerance,
          // add it back as a narrowly-scoped rule, not a catch-all.
          {
            // Phase 3 — cache lesson data fetched from Supabase (public.lessons).
            // NetworkFirst so offline users still get cached lessons after
            // their first visit to a language page.
            urlPattern: /\/rest\/v1\/lessons/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'lessons-cache',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Perf fix #3 — code-split lesson JS chunks. CacheFirst so
            // previously-visited language levels load instantly from
            // cache. Not precached — first lesson visit pays the network
            // cost once, then served from cache for 30 days.
            urlPattern: /\/assets\/lessons-.*\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'lesson-js',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Step 8 — lesson content (room JSON + auxiliary lesson assets).
            // Stale-while-revalidate so the page paints instantly from cache
            // and quietly refreshes in the background when online.
            urlPattern: /\/(?:lessons|data)\/.*\.json$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'lessons',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 14 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Mobile-audit CAT5 G2-a — Google Fonts were not runtime-cached,
            // so every slow-network / offline-after-first-visit load re-paid
            // the font fetch with a fallback-font flash. The font CSS is
            // loaded route-scoped via src/lib/loadGoogleFont.ts (room +
            // tier-map surfaces); these two rules give it the standard
            // Workbox Google-Fonts treatment.
            //
            // 1) The stylesheet from fonts.googleapis.com — SWR: served
            //    instantly from cache, refreshed in the background (Google
            //    periodically rotates the woff2 URLs inside the CSS).
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // 2) The actual woff2 files from fonts.gstatic.com — CacheFirst
            //    with a 1-year budget (Google content-hashes them, so they
            //    are effectively immutable). statuses [0,200] keeps an
            //    opaque cross-origin response storable, per the audit's
            //    G2-c forward-safety note.
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: 'MercyBlade',
        short_name: 'Mercy',
        lang: 'vi',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0a0a0a',
        theme_color: '#0a0a0a',
        description: 'Học tiếng Anh dành cho người Việt — MercyBlade',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],

  // Inline Vercel's deploy SHA so the runtime Sentry init can tag every event
  // with a release. Vercel sets VERCEL_GIT_COMMIT_SHA on production builds;
  // local builds without it inline an empty string and Sentry falls back to
  // its own release detection (none, in our case).
  define: {
    'import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA': JSON.stringify(
      process.env.VERCEL_GIT_COMMIT_SHA ?? '',
    ),
    'import.meta.env.VITE_PLACEMENT_TEST_ENABLED': JSON.stringify(
      process.env.VITE_PLACEMENT_TEST_ENABLED ?? '',
    ),
    'import.meta.env.VITE_PLACEMENT_V3_UI_ENABLED': JSON.stringify(
      process.env.VITE_PLACEMENT_V3_UI_ENABLED ?? '',
    ),
    'import.meta.env.VITE_E2E_AUTH_BYPASS': JSON.stringify(
      process.env.VITE_E2E_AUTH_BYPASS ?? '',
    ),
  },

  resolve: {
    dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
      },

      '/functions/v1': {
        target: 'https://buemdfxyhxunzpgdoqin.supabase.co',
        changeOrigin: true,
        secure: true,
      },
    },
  },

  build: {
    // Perf fix #5 — stop modulepreloading MercyGuide tab chunks on the
    // homepage (344 KB combined: speak, teacher, grammar, logic tabs).
    // These chunks are React.lazy-loaded inside MercyGuidePanel and only
    // needed when the user opens a tab — they shouldn't compete for
    // initial homepage bandwidth. The manualChunks above still names them
    // for stable chunk hashes; this filter just removes the preload hints.
    modulePreload: {
      resolveDependencies(_filename, deps) {
        return deps.filter(
          (dep) =>
            !dep.includes('mercy-guide-panel') &&
            !dep.includes('mercy-speak-tab') &&
            !dep.includes('mercy-teacher-tab') &&
            !dep.includes('mercy-grammar-tab') &&
            !dep.includes('mercy-logic-tab') &&
            !dep.includes('mercy-french-tab') &&
            !dep.includes('mercy-german-tab'),
        );
      },
    },
    // Source maps are generated as "hidden" only when Sentry upload is
    // configured — this writes .map files to dist for upload, but the
    // emitted JS bundle has no //# sourceMappingURL= comment, so the
    // client never fetches them. The plugin then deletes the .map files
    // after upload (sourcemaps.filesToDeleteAfterUpload above). Without the token,
    // we keep the historical no-sourcemap behavior for laptop builds.
    sourcemap:
      process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT
        ? ('hidden' as const)
        : false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const s = normalizeId(id);

          if (isReactPath(s)) return 'react';
          if (s.includes('/node_modules/@supabase/')) return 'supabase';

          // Sentry: @sentry/* packages (react, browser, core, replay,
          // tracing, feedback, capacitor wrapper, internal helpers).
          //
          // Why a dedicated bucket:
          //   src/lib/monitoring/sentryInit.ts uses `await import("@sentry/react")`
          //   so Rollup would naturally split it into a lazy chunk. Without
          //   this rule, the `node_modules → vendor` catch-all below
          //   re-merges the whole SDK back into vendor.js — which loads on
          //   every page render, including the homepage with no DSN
          //   configured. That dragged ~83 KiB gzip of Session Replay code
          //   into the initial bundle even though Replay is currently OFF
          //   (see sentryInit.ts header). Splitting here restores the
          //   intended behavior: Sentry only ships when initSentry() runs.
          //
          // Stays a separate chunk even if Replay is later re-enabled —
          // the integration is still loaded after the first paint.
          //
          // @sentry-internal/* are sibling packages (replay, replay-canvas,
          // feedback, browser-utils) that @sentry/react pulls in. Without
          // matching them here, they fall into `vendor` and create a
          // `sentry -> vendor -> sentry` circular chunk warning.
          if (
            s.includes('/node_modules/@sentry/') ||
            s.includes('/node_modules/@sentry-internal/')
          ) {
            return 'sentry';
          }

          // Charts: recharts + transitive d3/decimal/immer/redux that
          // recharts hauls in. Keeping these out of `vendor` saves ~210 KB
          // gzip on the home/landing critical path — these libs are only
          // imported by admin analytics pages today.
          if (
            s.includes('/node_modules/recharts/') ||
            s.includes('/node_modules/d3-scale/') ||
            s.includes('/node_modules/d3-shape/') ||
            s.includes('/node_modules/d3-array/') ||
            s.includes('/node_modules/d3-color/') ||
            s.includes('/node_modules/d3-format/') ||
            s.includes('/node_modules/d3-interpolate/') ||
            s.includes('/node_modules/d3-path/') ||
            s.includes('/node_modules/d3-time/') ||
            s.includes('/node_modules/d3-time-format/') ||
            s.includes('/node_modules/internmap/') ||
            s.includes('/node_modules/decimal.js-light/') ||
            s.includes('/node_modules/victory-vendor/') ||
            s.includes('/node_modules/immer/') ||
            s.includes('/node_modules/@reduxjs/') ||
            s.includes('/node_modules/redux/') ||
            s.includes('/node_modules/reselect/')
          ) {
            return 'charts';
          }

          if (
            s.includes('/node_modules/@radix-ui/') ||
            s.includes('/node_modules/lucide-react/') ||
            s.includes('/node_modules/class-variance-authority/') ||
            s.includes('/node_modules/clsx/') ||
            s.includes('/node_modules/tailwind-merge/')
          ) {
            return 'ui';
          }

          if (s.includes('/node_modules/zod/')) return 'vendor-zod';
          if (s.includes('/node_modules/sonner/')) return 'vendor-sonner';
          if (s.includes('/node_modules/date-fns/')) return 'vendor-datefns';
          if (s.includes('/node_modules/')) return 'vendor';

          // Kids data files — split into separate chunk
          if (s.includes('/mercy-guide/kids/kidPage')) return 'kids-data';

          // Per-tab chunks inside the Mercy guide. Each is reached only via
          // React.lazy in MercyGuidePanel, so naming them explicitly keeps
          // the chunks stable across builds and prevents the catch-all
          // 'mercy-guide' rule below from re-merging them. See
          // src/components/mercy-guide/MercyGuidePanel.tsx for the lazy
          // boundaries.
          if (s.includes('/mercy-guide/MercyTeacherTab')) {
            return 'mercy-teacher-tab';
          }
          if (s.includes('/mercy-guide/MercySpeakTab')) {
            return 'mercy-speak-tab';
          }
          if (s.includes('/mercy-guide/tabs/grammar-writing/')) {
            return 'mercy-grammar-tab';
          }
          if (s.includes('/mercy-guide/tabs/EnglishLogicTab')) {
            return 'mercy-logic-tab';
          }
          // Per-level lesson data lives in its own chunk per language ×
          // level so opening A1 doesn't pull C1+C2 etc. The registry file
          // (`lessons.ts`) and small helpers stay in the tab/page chunk;
          // only the bulky `lessons-{level}.ts` data files are split out.
          if (s.includes('/languages/french/lessons-')) {
            const m = s.match(/lessons-(a1|a2|b1|b2|c1|c2)/);
            return m ? `lessons-french-${m[1]}` : undefined;
          }
          if (s.includes('/languages/german/lessons-')) {
            const m = s.match(/lessons-(a1|a2|b1|b2|c1|c2)/);
            return m ? `lessons-german-${m[1]}` : undefined;
          }
          if (s.includes('/languages/chinese/lessons-')) {
            const m = s.match(/lessons-(a1|a2|b1|b2|c1|c2)/);
            return m ? `lessons-chinese-${m[1]}` : undefined;
          }
          if (s.includes('/languages/japanese/lessons-')) {
            const m = s.match(/lessons-(a1|a2|b1|b2|c1|c2)/);
            return m ? `lessons-japanese-${m[1]}` : undefined;
          }
          if (s.includes('/languages/korean/lessons-')) {
            const m = s.match(/lessons-(a1|a2|b1|b2|c1|c2)/);
            return m ? `lessons-korean-${m[1]}` : undefined;
          }

          if (
            s.includes('/mercy-guide/tabs/FrenchLessonsTab') ||
            s.includes('/languages/french/')
          ) {
            return 'mercy-french-tab';
          }
          if (
            s.includes('/mercy-guide/tabs/GermanLessonsTab') ||
            s.includes('/languages/german/')
          ) {
            return 'mercy-german-tab';
          }

          // The guide panel is React.lazy-loaded inside MercyGuide.tsx and
          // only mounts when the bubble is opened (isOpen, default false).
          // Name it explicitly BEFORE the catch-all so that rule can't
          // re-merge it back into the eager 'mercy-guide' bubble chunk —
          // same pattern as the per-tab rules above. See
          // src/components/MercyGuide.tsx (Suspense boundary) and
          // reports/RECON-bundle-audit-A25.md (Lever 1).
          if (s.includes('/mercy-guide/MercyGuidePanel')) {
            return 'mercy-guide-panel';
          }

          // MercyGuide bubble shell + shared utilities — eager (the bubble
          // is always visible). Keep in the original chunk.
          if (s.includes('/mercy-guide/') || s.includes('/MercyGuide')) return 'mercy-guide';

          return undefined;
        },
      },
    },
  },
});
