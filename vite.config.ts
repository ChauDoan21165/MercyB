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

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/icon-maskable-512.png',
      ],
      workbox: {
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
          {
            // Step 8 — API responses. Network-first with a 5s timeout so users
            // on flaky connections still see the cached body, valid for 7 days.
            urlPattern: /\/api\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
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
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const s = normalizeId(id);

          if (isReactPath(s)) return 'react';
          if (s.includes('/node_modules/@supabase/')) return 'supabase';

          if (
            s.includes('/node_modules/@radix-ui/') ||
            s.includes('/node_modules/lucide-react/') ||
            s.includes('/node_modules/class-variance-authority/') ||
            s.includes('/node_modules/clsx/') ||
            s.includes('/node_modules/tailwind-merge/')
          ) {
            return 'ui';
          }

          if (s.includes('/node_modules/')) return 'vendor';

          // Kids data files — split into separate chunk
          if (s.includes('/mercy-guide/kids/kidPage')) return 'kids-data';

          // MercyGuide components — split from main
          if (s.includes('/mercy-guide/') || s.includes('/MercyGuide')) return 'mercy-guide';

          return undefined;
        },
      },
    },
  },
});