# PLAN: Migrate Lesson Data from TS Files → Supabase Table

**Status:** Planned — not started  
**Priority:** High (bundle size, scalability)  
**Estimated effort:** 2–3 focused days  
**Do not start while:** any agent branch is open / mid-sprint

---

## Problem

Lesson content is hardcoded as TypeScript objects inside `src/languages/<lang>/lessons-<level>.ts`.
Vite compiles all of it into JS chunks that ship to every user on first load:

| Chunk | Size (gzip) |
|---|---|
| lessons-chinese-b2 | 314 KB |
| lessons-french-c1 | 239 KB |
| lessons-german-b2 | 228 KB |
| lessons-chinese-c1 | 261 KB |

169,000+ lines of lesson data in the JS bundle. Users on Vietnamese mobile networks
download all of it before seeing a single lesson.

---

## Goal

- Lesson data lives in Supabase (`lessons` table), fetched one lesson at a time
- JS bundle contains zero lesson content
- Git remains the source of truth (TS files → seed data → sync script)
- Lessons cached by service worker after first fetch (offline works for visited lessons)

---

## Schema

```sql
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  language text not null,           -- 'german', 'chinese', 'french', etc.
  level text not null,              -- 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'
  lesson_index integer not null,    -- 0-based position in the original array
  content jsonb not null,           -- full lesson object (title, sentences, vocab, etc.)
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (language, level, lesson_index)
);

-- Read-only for authenticated users (lesson content is not secret,
-- but we don't want anonymous scraping)
alter table public.lessons enable row level security;

create policy "Authenticated users can read lessons"
  on public.lessons for select
  to authenticated
  using (true);

-- Service role only for inserts/updates (sync script uses service role key)
```

---

## Sync Script

Location: `scripts/sync-lessons-to-supabase.ts`

Behaviour:
- Reads every `src/languages/<lang>/lessons-<level>.ts` file
- Parses the exported array
- Upserts into `public.lessons` on `(language, level, lesson_index)`
- Reports: X inserted, Y updated, Z unchanged
- Dry-run flag: `--dry-run` prints what would change without writing

Usage:
```bash
# Full sync
npx tsx scripts/sync-lessons-to-supabase.ts

# Single language
npx tsx scripts/sync-lessons-to-supabase.ts --language=german

# Single level
npx tsx scripts/sync-lessons-to-supabase.ts --language=german --level=b2

# Dry run
npx tsx scripts/sync-lessons-to-supabase.ts --dry-run
```

Env vars needed (add to `.env.local` and `.env.example`):
```
SUPABASE_SERVICE_ROLE_KEY=   # never VITE_ prefix
VITE_SUPABASE_URL=           # already in .env.local presumably
```

---

## Frontend Changes

### Before
```ts
import lessons from '@/languages/german/lessons-b2'
const lesson = lessons[lessonIndex]
```

### After
```ts
// Fetch a single lesson from Supabase
const { data } = await supabase
  .from('lessons')
  .select('content')
  .eq('language', 'german')
  .eq('level', 'b2')
  .eq('lesson_index', lessonIndex)
  .single()

const lesson = data?.content
```

Add a `useLessonData(language, level, index)` hook that:
- Returns `{ lesson, loading, error }`
- Caches fetched lessons in a module-level Map (no re-fetch within session)
- Service worker caches the Supabase REST response via workbox NetworkFirst strategy

---

## Service Worker / Offline

Add a workbox route to cache lesson fetches:

```ts
// In vite.config.ts PWA config
{
  urlPattern: ({ url }) =>
    url.pathname.includes('/rest/v1/lessons'),
  handler: 'NetworkFirst',
  options: {
    cacheName: 'lessons-cache',
    expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 days
  }
}
```

Result: visited lessons work offline. Unvisited lessons require a connection.

---

## Migration Steps (in order)

### Phase 1 — Database (no frontend change)
1. [ ] Create `lessons` table in Supabase (SQL above)
2. [ ] Write `scripts/sync-lessons-to-supabase.ts`
3. [ ] Run sync script dry-run, verify counts match source files
4. [ ] Run sync script for real, spot-check 5–10 lessons across languages/levels
5. [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.example`

### Phase 2 — Frontend (parallel bundle still exists as fallback)
6. [ ] Write `useLessonData(language, level, index)` hook
7. [ ] Update lesson page to use hook instead of static import
8. [ ] Verify lesson loads correctly for each language (manual QA, 5 min per language)
9. [ ] Add workbox route for lesson cache

### Phase 3 — Remove static imports
10. [ ] Delete static imports from lesson pages
11. [ ] Run `npm run build` and confirm chunk size warnings are gone
12. [ ] Run full test suite
13. [ ] Deploy to preview, QA on mobile (Vietnamese network conditions if possible)
14. [ ] Merge to main, deploy to production

### Phase 4 — Cleanup (after 1 week stable in prod)
15. [ ] Decide whether to keep TS files as seed data or archive them
16. [ ] If keeping: add a CI check that sync script runs on lesson file changes
17. [ ] If archiving: move to `archive/lessons-source/` and remove from `src/`

---

## Risks

| Risk | Mitigation |
|---|---|
| Lesson fetch latency on slow connections | Skeleton loader on lesson page, prefetch next lesson |
| Service role key leaks | Never prefix VITE_, script runs locally only |
| Sync script misparses a TS file | Dry-run first, spot-check counts, keep TS files as backup |
| RLS blocks lesson reads | Test with a real authenticated user before removing static imports |
| Bundle still large after change | Confirm no other large static data files lurking in src/ |

---

## Success Criteria

- [ ] Largest lesson chunk < 50 KB gzipped (down from 314 KB)
- [ ] Total precache size < 3 MB (down from 5.7 MB)
- [ ] Lesson load time on 3G < 2 seconds (measure with Chrome DevTools throttle)
- [ ] All language/level combos load correctly
- [ ] Previously visited lessons work offline

---

## Do NOT start this refactor while

- Any agent branch is open and unmerged
- A sprint is in progress
- You are tired

Start fresh, on a Monday morning, with a clean `main` and full energy.
