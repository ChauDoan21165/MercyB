# Search & Rooms — Deep Dive

> **Sibling of** [system-overview.md §2](../system-overview.md#2-room-content-pipeline).
>
> Two adjacent systems documented in one doc because they're tightly
> coupled: the **room registry** (~488 JSON files normalized into a
> single in-memory `RoomMeta[]` index) and the **search engine** that
> ranks those rooms against a user query. Together they power the
> primary discovery surface for the adult-side corpus.
>
> The room rendering / audio pipeline (`roomLoader*.ts`,
> `RoomRenderer.tsx`, `roomAudioResolver.ts`) is one layer below and
> covered in `CLAUDE.md` "Architecture" → "Room content pipeline"
> + "Audio resolution pipeline". This doc focuses on the
> **discovery + ranking** layer, not the render layer.
>
> **Read first:**
> - `src/lib/rooms/roomRegistry.ts` — the canonical room index.
> - `src/lib/search/roomSearch.ts` — search engine
>   (`searchRooms`, `calculateScore`, `getSearchSuggestions`,
>   `hasSearchResults`). **Contains a known ranking issue at
>   line 119–122 documented in §5 below.**
> - `src/lib/search/searchDiagnostics.ts` — admin-only debug helpers.
> - `src/components/RoomSearch.tsx` — UI surface (the search input +
>   results list).
> - `src/lib/roomFetcher.ts` — async loader that the registry wraps.
> - `src/lib/teacher-mercy/domainMap.ts` — `DomainCategory` discriminator.
>
> Cross-refs of context: `ROOM_GUIDE.md` (canonical room-system
> reference), `docs/MERCY_BLADE_ROOM_SPECIFICATION.md` (the room JSON
> shape), `CLAUDE.md` → "Room content pipeline".

---

## 1. What it does, and why it matters strategically

A learner opens the top-level search input. They type "anxiety" (EN)
or "lo âu" (VI) or "phòng phỏng vấn" (VI). They expect to see the
relevant rooms — ranked, deduplicated, language-aware — fast enough
to feel instant.

The pipeline behind that single keystroke is:

1. **Registry bootstrap.** On first idle moment (or on first user
   keystroke), `getAllRoomsAsync()` fetches all room JSON via
   `roomFetcher`, normalizes shape (multiple title-field conventions,
   keyword field variants, hyphen-vs-underscore IDs), classifies
   by tier and domain, and caches the result as `RoomMeta[]`.
2. **Pre-warm hook.** `RoomSearch.tsx`'s `prewarmRoomRegistry`
   schedules the bootstrap via `requestIdleCallback` so the first
   keystroke searches a populated index, not a cold-start fetch.
3. **Query normalization.** `normalizeQuery` lowercases, trims,
   decomposes Vietnamese diacritics (NFD + diacritic-strip), folds
   `đ` → `d`, normalizes spaces. The same normalization runs on
   every searchable field.
4. **Per-room scoring.** `calculateScore` returns a numeric score
   per room (title prefix > title contains > id match > keyword/tag
   > domain > tier boost, plus an **unconditional `+0.5 hasData`
   bonus** — see §5 known issue).
5. **Filter + sort.** Rooms with `score > 0` are kept. Sort by
   score descending, with tier-tiebreaker if `tier` was passed,
   final tiebreaker on `title_en` alphabetical.
6. **Limit.** Default 30 results, configurable.
7. **Suggestions.** `getSearchSuggestions(prefix, limit)` returns
   up to N title prefixes for autocomplete-style UI.

Why it matters strategically:

- **Discovery is the bottleneck.** ~488 rooms (and growing). Without
  search, the learner has to browse tier indices and topic pages —
  high friction. Search lets a learner go from "I'm anxious about
  speaking at work" to the right room in two keystrokes.
- **Vietnamese-first.** Both query and indexed fields handle VI
  diacritic normalization. A learner typing without tones ("toi muon
  hoc") still matches "tôi muốn học". This is non-negotiable per
  `voice-guidelines-vn.md` + CLAUDE.md non-negotiable #1.
- **`CLAUDE.md` non-negotiable #2 (Kids mode is sacred).** This
  search is for the **adult corpus only**. Kids rooms live at
  `kids/*` routes and use a separate browsing model (illustrated
  page-by-page picker). The adult search never returns kids rooms;
  the registry's adult subset is what `getAllRooms()` returns.
- **Discoverability is part of monetization.** A user who can't
  find what they paid for churns. The search behavior is a billing
  surface in everything but name — see `./billing-entitlement.md`
  for what tier-gating reads but does not enforce in the search
  layer.

---

## 2. The two systems and how they fit

### Registry — the in-memory index

`src/lib/rooms/roomRegistry.ts` (~360 lines) is the **single source
of truth** for room metadata at runtime. The contract:

- One canonical `RoomMeta` per room, with normalized titles + keywords
  + tags + tier + domain + a `hasData: boolean` flag.
- ID normalization: hyphens → underscores, double-underscore collapse.
  Inputs from URLs/navigation might be hyphenated; the registry
  always stores underscored.
- Hybrid bootstrap: tests mock `fetchAllRooms` directly; runtime
  uses the async path (`getAllRoomsAsync`) which caches the
  `RoomMeta[]` + an in-flight Promise to dedupe concurrent calls.
- Sync accessor `getAllRooms()` returns the cache; returns `[]`
  before the async bootstrap completes (callers handle this).

Tolerant title parsing: `pickTitles` accepts five field-name
conventions (`title.en` / `title_en` / `titleEn` / `nameEn` / `name`)
because room JSON evolved over time and not every file was migrated.
A new room JSON can use any of these and the registry handles it.

Tier inference: `tierFromRoomId` collapses room-ID patterns like
`vip3ii` → Level 3 (per project_room_tier_db_corruption memory note
— DB `rooms.tier` is unreliable for token-less ids; registry uses
the ID pattern).

### Search — the ranker

`src/lib/search/roomSearch.ts` (~245 lines) ranks the registry
against a query. The contract:

- Empty query → `[]` (early return at `searchRooms` line 142).
- Non-empty query → score every room via `calculateScore`, keep
  `score > 0`, sort by score desc with tiebreakers, return up to
  `limit`.
- `getSearchSuggestions(prefix, limit)` returns title prefixes
  matching the input for autocomplete UIs.
- `hasSearchResults(query)` is a fast-path predicate that mirrors
  `calculateScore`'s match surface (the file head note documents
  why: a divergence here once made keyword-only queries report "no
  results").

### Diagnostics

`src/lib/search/searchDiagnostics.ts` (~100 lines) — admin/debug
helpers. `debugSearch(query, limit)`, `validateKnownRooms(queries)`,
`getSearchCoverageStats()`. Not wired into the user-facing
`RoomSearch` component; surfaces under admin debug routes for
search-quality investigations.

### UI

`src/components/RoomSearch.tsx` — the search input, dropdown, and
result rendering. Calls `useAllRooms` (registry hydration), runs
`searchRooms` on every keystroke (debounced via React state). Idle
prewarm via `prewarmRoomRegistry`.

---

## 3. Key files and their roles

### Registry

- **`src/lib/rooms/roomRegistry.ts`** (~360 lines) — the canonical
  index. Exports: `RoomMeta`, `getAllRooms()`, `getAllRoomsAsync()`,
  `getRoomsByTier(tierId)`, `getRoomsByDomain(domain)`,
  `getRoomById(id)`, `getRoomCountsByTier()`,
  `getRoomCountsByDomain()`, `refreshRegistry()`,
  `getTotalRoomCount()`.
- **`src/lib/roomFetcher.ts`** (~520 lines) — the async loader the
  registry wraps. Exports: `RoomMeta` (parallel shape — note name
  collision; the registry's `RoomMeta` is the one most callers
  import), `RoomSummary`, `RoomAccessErrorCode`,
  `roomJsonToSummary(roomId, json)`. Reads `public/data/*.json` via
  `fetch`, handles 404s + parse failures, returns a normalized
  summary shape.
- **`src/lib/teacher-mercy/domainMap.ts`** — `DomainCategory`
  discriminator. Domain classification feeds the registry's
  `domain` field via `getDomainCategory`.
- **`src/lib/constants/tiers.ts`** — `TierId`, `normalizeTier`,
  `ALL_TIER_IDS`. Tier discriminator the registry uses.
- **`src/lib/tierFromRoomId.ts`** — `tierFromRoomId` ID → tier
  inferrer (the room ID is the source of truth for tier, per memory
  [[project_room_tier_db_corruption]] — DB `rooms.tier` is unreliable).

### Loader (the layer below the registry)

- **`src/lib/roomLoader.ts`** (~300+ lines) — the merge-load entry
  for a SINGLE room (DB + JSON candidates, salvage on partial data).
  Exports: `loadMergedRoom`, `RoomCopy`, `RoomMeta` (this file's
  shape, not the registry's), `LoadSource`, `CandidateKind`,
  `LoadMergedRoomResult`. Used by the room renderer, NOT by the
  search/registry layer (search reads the registry, which reads
  `roomFetcher`'s bulk path).
- **`src/lib/roomLoaderNormalize.ts`** + **`roomLoaderHelpers.ts`** +
  **`roomLoaderSource.ts`** + **`roomLoaderCache.ts`** — supporting
  modules for the per-room loader.

### Search

- **`src/lib/search/roomSearch.ts`** (~245 lines) — search engine.
  Exports: `RoomSearchResult`, `SearchOptions`, `searchRooms`,
  `getSearchSuggestions`, `hasSearchResults`. **`calculateScore` is
  internal** — not exported, but its scoring rules ARE the public
  ranking contract.
- **`src/lib/search/searchDiagnostics.ts`** (~100 lines) — admin
  debug. Exports: `SearchDebugResult`, `debugSearch`,
  `validateKnownRooms`, `getSearchCoverageStats`.

### UI

- **`src/components/RoomSearch.tsx`** — the search input + result
  list. Idle prewarm of the registry, debounced query, navigation
  on result click. Used in the top-level navigation surface.
- **`src/hooks/useRooms.ts`** — React hook wrapper around the
  registry. `useAllRooms()` returns the cached `RoomMeta[]` +
  loading state.

---

## 4. Public API / surface contracts

### `RoomMeta` (the registry's shape)

```ts
interface RoomMeta {
  id: string;                  // canonical underscore form, never hyphen
  tier: TierId;                // inferred from id, NOT DB rooms.tier
  domain: DomainCategory;      // from teacher-mercy/domainMap
  title_en: string;            // normalized, may be empty if JSON omits
  title_vi: string;            // normalized, may be empty if JSON omits
  keywords_en: string[];       // lowercased, deduped, trimmed, non-empty
  keywords_vi: string[];       // lowercased, deduped, trimmed, non-empty
  tags: string[];              // lowercased, deduped, trimmed, non-empty
  hasData: boolean;            // does the room have authored content?
}
```

### `SearchOptions`

```ts
interface SearchOptions {
  tier?: TierId;               // boost rooms from this tier (NOT a filter)
  domain?: DomainCategory;     // filter to this domain (IS a filter)
  limit?: number;              // max results, default 30
  language?: 'en' | 'vi';      // preferred language (currently UNUSED in
                               //   ranking — accepted for forward
                               //   compatibility)
}
```

`tier` boosts a matched room +1; `domain` filters the candidate set
before scoring.

### `RoomSearchResult`

```ts
interface RoomSearchResult extends RoomMeta {
  score: number;               // sum of the calculateScore parts
}
```

### `calculateScore` ranking weights (internal)

| Match type | Weight |
|---|---|
| Title prefix (EN or VI) | +5 |
| Title contains (EN) | +3 |
| Title contains (VI) | +3 |
| ID contains | +2 |
| Keyword match (EN) | +1 |
| Keyword match (VI) | +1 |
| Tag match | +1 |
| Domain label contains query | +1 |
| Tier boost (if `options.tier` matches) | +1 |
| `room.hasData === true` | +0.5 (**unconditional** — see §5 known issue) |

A room scoring `> 0` is included. Max realistic score for a strong
match is ~14 (prefix + contains in both languages + id + keyword in
both languages + tag + tier + hasData).

### Sort tiebreakers (in order)

1. Score descending (primary).
2. If `options.tier` provided, prefer `room.tier === options.tier`.
3. `title_en.localeCompare` alphabetical (deterministic final tie).

### `getSearchSuggestions(prefix, limit = 5)`

Returns up to N **room titles** (not full results) whose normalized
title prefix matches. Used for autocomplete chips in the search input.

### `hasSearchResults(query)` — predicate

Returns `true` if at least one room would score > 0. The match
surface here MUST mirror `calculateScore`'s match surface (per the
explanatory comment at `roomSearch.ts:230`); a divergence in the
past caused keyword/tag-only queries to silently report "no
results".

### Registry accessors

```ts
getAllRooms(): RoomMeta[]                       // sync, [] before bootstrap
getAllRoomsAsync(): Promise<RoomMeta[]>         // async, dedupes in-flight
getRoomsByTier(tierId): RoomMeta[]
getRoomsByDomain(domain): RoomMeta[]
getRoomById(id): RoomMeta | undefined           // accepts hyphen or underscore
getRoomCountsByTier(): Record<TierId, number>
getRoomCountsByDomain(): Record<DomainCategory, number>
getTotalRoomCount(): number
refreshRegistry(): void                         // clears cache; next call re-fetches
```

`refreshRegistry()` is for admin / debug only. Production never
calls it (the registry is a session-long cache).

---

## 5. Invariants

### Vietnamese diacritic-folding is symmetric

Both query and indexed fields run through the same normalizer
(`normalizeQuery` for queries, `normalizeText` for fields). A
regression that normalizes only one side silently breaks all
diacritic-folded searches.

### ID format is underscore-canonical

Hyphenated IDs (from URLs / nav) normalize to underscore via
`normalizeRoomId`. Callers must NEVER store the hyphen form in the
registry. Mixed-form IDs in the cache would let `getRoomById('foo-bar')`
and `getRoomById('foo_bar')` return different rooms.

### Tier comes from ID, not DB

Per memory [[project_room_tier_db_corruption]] — the DB column
`rooms.tier` is corrupted for token-less ids (the english_* spine
took the wrong tier). The registry uses `tierFromRoomId` instead.
Do NOT re-introduce DB tier reads in the registry.

### Registry is session-cached, not per-render

The cache is module-level (`roomRegistryCache`). React rerenders do
NOT re-fetch. The cache is only invalidated by `refreshRegistry()`.
A regression that puts the registry in a React provider with
per-render fresh fetches re-introduces the bundle-loading problem
the cache exists to solve.

### Empty query returns `[]` (early return)

`searchRooms('')` and `searchRooms('   ')` return `[]`. The UI
relies on this — an empty input must show no dropdown, not the
entire corpus.

### `domain` filters, `tier` boosts (asymmetric)

`SearchOptions.domain` removes rooms; `SearchOptions.tier` only
re-weights. This asymmetry is documented in the SearchOptions
comment. Swapping the semantics would break the navigation surface
that uses tier as a default-context boost without wanting to hide
other-tier results.

### `hasSearchResults` match surface mirrors `calculateScore`

Per the inline comment at `roomSearch.ts:230`. If you add a
match dimension to `calculateScore` (e.g. "match against learning
goal"), you MUST mirror it in `hasSearchResults` or queries against
the new field will show results in `searchRooms()` but report "no
results" in any consumer that pre-flights via `hasSearchResults`.

### Kids rooms are NOT in this index

The registry is the adult corpus only. The kids surface uses
`kidsDataLoader.ts` + `kids/kidPage*Data.ts` directly, not the
registry. A regression that merges kids data into `getAllRooms()`
would surface kids content in the adult search — a CLAUDE.md
non-negotiable #2 violation.

### `getAllRoomsAsync` dedupes concurrent in-flight requests

The module-level `roomRegistryPromise` cache prevents a thundering
herd on first load (e.g. the prewarm hook + a user keystroke
racing). Removing the in-flight Promise cache reintroduces the
herd; under network failure, every concurrent caller observes the
failure independently.

### Tolerant title parsing tolerates SIX shapes

`pickTitles` accepts `title.{en|vi}`, `title_{en|vi}`,
`title{En|Vi}`, `name`+`name_vi`, `name{En|Vi}`. Authoring
guidance is "use `title_en` / `title_vi`", but the registry tolerates
historical variants because the room corpus accumulated over
years. Removing tolerance breaks historical rooms.

---

## 6. Known gotchas / pitfalls

### `+0.5 hasData` is unconditional — KNOWN RANKING ISSUE

**Location:** `src/lib/search/roomSearch.ts:119–122`.

```ts
// Prefer rooms with data
if (room.hasData) {
  score += 0.5;
}
```

This bonus fires regardless of whether the query matched anything
else in the room. Combined with the filter at line 162 (`if (score
> 0)`), this means **any room with `hasData: true` is admitted to
results for any non-empty query**, even when the query matches
nothing — title, keyword, tag, domain, or id — about that room.

Concrete failure mode: a query for `"xyzzy"` against a corpus where
N rooms have `hasData: true` returns N rooms ranked at 0.5 each,
sorted alphabetically (the title-tiebreaker). Each of those rooms
is, from the user's perspective, an irrelevant "result".

The intent of the `hasData` bonus is to break ties — given two
rooms that both match the query, prefer the one with authored
content. But the implementation makes the bonus an **admission
mechanism**, not just a tiebreaker.

**KNOWN ISSUE — fix requires a ranking-policy decision.** This
doc deliberately does NOT propose a fix. The options that have
come up in past discussions all change result sets for live users:

- Gate the +0.5 on at-least-one-other-match. Cleanest fix, but
  changes ranking for queries that today benefit from the bonus
  pushing two-keyword-only matches above one-keyword matches.
- Raise the filter threshold above 0.5. Same end-effect for the
  no-match case; different secondary effects on edge-case rankings.
- Drop the bonus entirely. Removes the tiebreaker the bonus was
  intended to provide.

The right move is a deliberate ranking-policy review with the
product team — not a defect-class hotfix. **Do not "fix" this in
a passing PR.** Any change here is a strategy edit.

### Title prefix wins by 5 points — high specificity beats everything

A user typing `"phá"` matches "phát âm" (prefix +5) ahead of "phỏng
vấn" (prefix +5, alphabetical tie) ahead of any room containing
"phá" only in keywords (+1). The 5-point gap is what gives the
search its "type a few letters, get the obvious room" feel.
Changing this without a strategy decision changes the feel of the
search across all queries.

### Both EN and VI title prefix add separately

`if EN-prefix → +5; else if VI-prefix → +5`. A room titled "Stress"
(EN) / "Căng thẳng" (VI) matched by "str" (EN prefix) gets +5;
matched by "căng" (VI prefix) gets +5. There is no +10 double-prefix
case because the conditional is `else if`. The contains-match adders
(+3 each) ARE independent and DO stack.

### `language: 'en' | 'vi'` in `SearchOptions` is currently a no-op

The field is accepted but doesn't affect ranking today. It's
reserved for a future "boost in preferred language" rule. Don't
build behavior on the assumption that it works.

### `RoomMeta` name collision (registry vs roomFetcher vs roomLoader)

THREE files export `RoomMeta`. The registry's shape is the one the
search consumes. The `roomFetcher` `RoomMeta` is its internal
intermediate shape; the `roomLoader` `RoomMeta` is for the per-room
merge-load path. Be deliberate about which import you take —
`@/lib/rooms/roomRegistry` is the answer for search-related code.

### `useAllRooms()` is React-flavored; `getAllRooms()` is not

A React component should use `useAllRooms()` for the loading-state
contract. A non-React caller (e.g. an analytics hook) should call
`getAllRooms()` after `getAllRoomsAsync()` resolves. Mixing them
can result in stale snapshots in a React tree.

### `searchDiagnostics.ts` is admin-only

`debugSearch`, `validateKnownRooms`, `getSearchCoverageStats` are
not bundled with the user-facing search component. They're for
admin debug routes. Surfacing them in a learner-facing UI bypasses
the production search performance characteristics (they're not
debounced or limited).

### `prewarmRoomRegistry` uses `requestIdleCallback`

Browser support is good but not 100% (Safari implementation has
quirks). The fallback is `setTimeout(200ms)`. The cancel function
returned by `prewarm` must be called on unmount; not cancelling
leaves the timer pending and could fire after navigation.

### Empty `title_en` is allowed by the registry

`pickTitles` returns `{ en: '', vi: '' }` if the JSON omits both.
A title-prefix-against-empty query is undefined behavior; the
search treats `''.startsWith(normalizedQuery)` as `false` for any
non-empty query, so the room contributes no prefix score — but
the room still scores if its keywords/tags/id match. A
title-empty room CAN appear in results; treat the count of
title-empty rooms as a corpus-cleanliness signal, not a search
issue.

### Tier inference relies on the ID pattern

`tierFromRoomId('vip3ii_xyz')` → Level 3 (the `vip3ii` token
collapses to Level 3 per the historical naming). A room with a
non-conventional ID would fall back to a default and show up under
the wrong tier. The fix is the room-ID convention, not the
inferrer.

---

## 7. Cross-references

- **`./mercy-guide.md`** — the in-context Mercy Guide can SUGGEST a
  next room via the `learning_path` mode. That recommendation is
  independent of the search ranking; it consults the registry but
  scores by a different (Mercy-curated) heuristic.
- **`./placement-v3.md`** — the placement recommender consumes
  `LESSON_INDEX` (compile-time built) and `cefrToRoom.ts`, NOT the
  runtime registry. The two indexes can drift; the prebuild hook
  `rooms:check` validates that `cefrToRoom`-referenced rooms exist
  in `public/data/*.json`.
- **`./billing-entitlement.md`** — the search returns rooms
  regardless of the user's entitlement. Tier-gating is the room's
  own gate (the renderer reads entitlement), not the search's.
  Showing locked rooms in search results is a deliberate
  discoverability choice — the gate lives on the click-through.
- **`./study-os-stage-3.md`** — Stage 3A's local weakness map does
  not currently feed the search ranking. A future "boost rooms
  that address my flagged weaknesses" rule would change `calculateScore`
  + would require the ranking-policy review referenced in §6.
- **`../system-overview.md` §2** — high-level summary of the room
  content pipeline.
- **`ROOM_GUIDE.md`** — canonical room-system reference (authoring
  conventions, JSON shape, audio).
- **`docs/MERCY_BLADE_ROOM_SPECIFICATION.md`** — the room JSON
  specification.
- **`CLAUDE.md`** → "Room content pipeline" + "Audio resolution
  pipeline" — the short reference for the layer below this doc.

---

## 8. How to extend this — checklist

### Adding a new searchable field to `RoomMeta`

1. Update the `RoomMeta` interface in `src/lib/rooms/roomRegistry.ts`.
2. Update the normalization logic in the same file to populate the
   field from the room JSON.
3. Update `calculateScore` in `src/lib/search/roomSearch.ts` to
   match against the new field. Decide weight via a ranking-policy
   review.
4. **Update `hasSearchResults` to mirror the new match dimension**
   (per the invariant comment at `roomSearch.ts:230`).
5. Add unit tests under `src/lib/__tests__/`. Cover: query matches
   new field only, query matches new field + title, language
   variants, diacritic variants.

### Adding a new ranking weight or modifying existing weights

1. **This is a strategy edit, not a refactor.** Pair with a
   product-team ranking-policy discussion.
2. Edit `calculateScore` in `src/lib/search/roomSearch.ts`.
3. Update the §4 ranking weights table in this doc to match.
4. Run `searchDiagnostics.getSearchCoverageStats()` before + after
   to estimate result-set changes.
5. Add unit tests with deliberately constructed fixtures
   (single-match, multi-match, no-match-but-hasData).

### Adding a new domain

1. Add the literal to `DomainCategory` in
   `src/lib/teacher-mercy/domainMap.ts`.
2. Update `getDomainCategory` to assign rooms to the new domain.
3. Update the search UI's domain filter (if any) — the registry +
   search automatically pick up the new category via the
   discriminator.

### Adding a new tier

1. Tier additions are rare. Pair with strategy review +
   `src/lib/constants/tiers.ts` edit.
2. Update `tierFromRoomId` to recognize the new tier's ID pattern.
3. The registry + search pick up the new tier automatically via
   `ALL_TIER_IDS`.

### Migrating from the runtime registry to a precomputed index

(Deferred work — `project_bundle_size_deferred` memory note: moving
`public/data/*.json` to Supabase is ready but deferred until
post-Android-launch + analytics drive a "top-N bundled" allowlist.)

1. The current registry is bundled JSON loaded async. A
   precomputed/server-side index would mean changing
   `getAllRoomsAsync` to query a Postgres FTS index instead of
   fetching JSON.
2. Pair with bundle-size strategy review (`project_bundle_size_deferred`).

### Removing the +0.5 `hasData` issue (§5)

**Do NOT do this in a passing PR.** Ranking-policy decision
required. Process:

1. Get product-team alignment on the desired ranking semantics
   (tiebreaker vs admission gate, or drop the bonus).
2. Run `searchDiagnostics.getSearchCoverageStats()` before to
   capture the baseline.
3. Implement the agreed change in `calculateScore`.
4. Run stats again, diff the result sets for a query suite
   (use `searchDiagnostics.validateKnownRooms`).
5. Update §5 in this doc to reflect the new behavior.

### Adding a kid-aware search (currently NOT supported)

**This is a strategy edit.** Kids browse via illustrated pages,
not search. Adding a "kids search" surface would change
[CLAUDE.md] non-negotiable #2 (Kids mode is sacred — no extra
surfaces without explicit strategy approval). Out of scope here.

---

## 9. The two-line summary

The room registry is a session-cached normalization layer over ~488
adult-corpus JSON files; the search engine ranks the registry
against a Vietnamese-diacritic-folded query via a per-field weighted
sum (title prefix +5, contains +3, id +2, keyword +1, tag +1, domain
+1, tier boost +1, `hasData` +0.5). The hard rails are the
underscore-canonical ID form, the symmetric diacritic-folding, the
session-long cache, the adult-only corpus boundary, and the §6
known `+0.5 hasData` ranking issue at `roomSearch.ts:119–122` that
requires a ranking-policy decision (not a passing-PR fix).
