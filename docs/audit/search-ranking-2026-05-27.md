# Search ranking audit — `searchRooms.calculateScore()` hasData floor

**Status:** ✅ **SHIPPED IN THIS MR** — recommendation §6 (option a, remove `+0.5`) applied. See §6 and §7 for the diff reference.
**Author:** Agent C2, 2026-05-27.
**Subject file:** `src/lib/search/roomSearch.ts` (244 lines pre-fix, 240 post-fix).
**Origin:** Long-standing PR-#716 (A29) flag — intentionally deferred pending an explicit ranking-policy call. Memory entry: `[[project_room_search_findings]]`.

## §1 — The bug

`calculateScore()` (`roomSearch.ts:60-125` pre-fix) ended with:

```ts
// Prefer rooms with data
if (room.hasData) {
  score += 0.5;
}
```

`hasData` is set in `roomRegistry.ts:222` as `Boolean(roomData?.hasData ?? roomData?.has_data ?? true)` — i.e. **defaults to `true` when unset**. Of 487 room JSON files in `public/data/`, **zero have `hasData: false`**:

```
$ grep -l '"hasData": false\|"has_data": false' public/data/*.json | wc -l
0
```

So every room got `+0.5`, unconditionally, regardless of whether the query matched anything else.

The downstream consequence was at `roomSearch.ts:162`:

```ts
if (score > 0) {
  scoredRooms.push({ ...room, score });
}
```

This `score > 0` filter is meant to drop non-matches. The `+0.5` defeated it: every data-bearing room passed with `score = 0.5` even when title, ID, keyword, tag, and domain all failed to match the query. The filter was effectively dead code.

## §2 — Why the slice hid it

`searchRooms()` returns `scoredRooms.slice(0, limit)` (`roomSearch.ts:184`), default `limit = 30`. The live UI uses `limit: 20` (`RoomSearch.tsx:82`).

For real keyword queries (most user input), genuine matches score 5 (title prefix), 3 (title contains), 2 (id contains), or 1 (keyword/tag/domain). 30+ real matches sort above the `0.5` floor, the slice cuts before the floor surfaces, and the bug was invisible.

The bug only surfaced when the **count of genuine matches was less than the slice limit** — then the result tail was padded with alphabetically-sorted hasData-floor rooms scoring 0.5 each.

## §3 — Concrete failure cases (verified pre-fix)

**Case A — `searchRooms("__xyz__no_room_matches_this__")` pre-fix:**
- Title/id/keyword/tag/domain matches: zero across all 487 rooms.
- For every room: `score = 0 + 0.5 = 0.5` (hasData floor fires).
- Filter `score > 0` passes for all 487.
- Sort: scores all tied at 0.5 → tier tiebreaker (no `options.tier`) → alphabetic by `title_en`.
- Slice 30 (or UI 20). **Returned 20+ alphabetically-sorted data-bearing rooms for a gibberish query.** (Confirmed by failing test in `roomSearch.test.ts:193` against pre-fix code — top result was `writing_mastery_level2` with score 0.5.)

**Case B — `searchRooms("")`:**
- Early return at `roomSearch.ts:142-144` (`if (!trimmedQuery) return []`). +0.5 never fired. Empty query is safe (pre- and post-fix).

**Case C — query matching 100+ rooms (e.g., `"support"`):**
- 100+ rooms score ≥ 1 from keyword/title hits.
- Slice cuts at top 30. No 0.5-floor rooms surfaced. Bug invisible.

**Independent finding:** `hasSearchResults()` (`roomSearch.ts:219-243`) has its own match logic that does **not** consult `hasData` and **correctly returns `false`** for gibberish (test: `roomSearch.test.ts:239-241`). So pre-fix `hasSearchResults("__xyz__")` → `false`, but `searchRooms("__xyz__")` → 20+ rooms. The two functions disagreed on negative queries. **Post-fix, parity restored.**

## §4 — Consumers (no call-site change required by this MR)

- `src/components/RoomSearch.tsx:82` — the live UI surface. Calls `searchRooms(searchQuery, { limit: 20 })` on a 300ms-debounced input. Tail-padding behavior reached users here. Fixed upstream by this MR; UI code unchanged.
- `src/lib/search/searchDiagnostics.ts:31` — `searchRooms(query, { limit: 50 })` for debug-only output. Bug was visible here; fixed upstream.
- `src/__tests__/roomSearch.test.ts` — test suite, includes a regression comment at lines 171-174 about the "flat hasData floor" being defeated by enriched keyword/tag data. This MR adds two **new** tests (§7) that directly guard the floor's absence.
- `src/__tests__/roomRegistryCoverage.test.ts` — coverage assertions, not behavioral. Unaffected.

## §5 — Three policy options (considered)

**(a) Remove `+0.5` entirely.** Delete the `if (room.hasData)` block. Non-matching rooms then score 0 and the `score > 0` filter drops them. Clean. 3-line change.

**(b) Make `+0.5` conditional on at least one positive match score.** Hoist a `let matched = false` and set `matched = true` inside each existing scoring branch; then `if (room.hasData && matched) score += 0.5`. Preserves the "rich rooms float on tie-break" intent for rooms with `hasData: false` — should that ever materialize. ~10-line change.

**(c) Replace the score system with a threshold gate.** Instead of trusting the slice to hide weak matches, set an explicit minimum score `X` and filter `score >= X` before slice. Below the threshold = no match, regardless of slice capacity. Independent of whether `+0.5` stays or goes. ~3-line change plus a threshold-value decision.

*Sub-variant of (a):* replace the unconditional `+0.5` with a much smaller bias (e.g. `+0.05`) that biases-but-doesn't-dominate on genuine ties. Not adopted — adds tunable noise for zero benefit on today's `hasData: true`-everywhere data.

## §6 — Recommendation: option (a), remove `+0.5` entirely → ✅ **Applied in this MR**

**Picked (a).** Reasoning:

1. **The `+0.5` had zero discriminating power.** With 487/487 rooms at `hasData: true`, it was a constant added to every room. It did not differentiate anything. It was functionally equivalent to not being there — *except* that it defeated the `score > 0` filter, which was the only negative-query gate `calculateScore` would otherwise have.

2. **The intent the floor allegedly preserved wasn't preserved.** "Rich rooms float on ambiguous match" requires some rooms to be `hasData: false`. None are, and there is no commit or content roadmap that introduces them. The floor was a vestigial check for a state that doesn't exist.

3. **Smallest blast radius.** Delete a 3-line `if` block. No threshold to pick, no conditional bookkeeping, no callers to update. The two regression tests in §7 guard the floor's absence.

4. **Reversible.** If a future content batch introduces `hasData: false` rooms and someone wants ranking-aware behavior for them, re-add as option (b) — at *that* point, with explicit intent, not as a quietly-defeated guard.

**Why not (b):** correct but premature. Adds bookkeeping (`let matched`) for a benefit that materializes only if `hasData: false` rooms exist. They don't. Pay the complexity when there's something to differentiate.

**Why not (c):** conflates two issues. The `+0.5` bug is a quiet correctness fix; a minimum-score threshold is a separate UX policy ("should a single tag-match still surface?") that affects every query, not just zero-match ones. (c) is fine work but should ship on its own merits after (a), not as an alternative to fixing the floor.

## §7 — Implementation → ✅ **Applied in this MR**

**Fix:** `src/lib/search/roomSearch.ts:118-122` (pre-fix). Removed the `if (room.hasData) score += 0.5;` block plus the surrounding comment + blank line. Net diff: 5 lines removed, 0 added.

**Regression tests:** added to `src/__tests__/roomSearch.test.ts` inside the `describe("searchRooms (mocked dataset)", ...)` block:

```ts
it("should return empty for a query that matches no room", () => {
  expect(searchRooms("__xyz__no_room_matches_this__")).toEqual([]);
});

it("should agree with hasSearchResults() on negative queries", () => {
  const q = "__xyz__no_room_matches_this__";
  expect(searchRooms(q).length === 0).toBe(hasSearchResults(q) === false);
});
```

**Verification:**
- Pre-fix: both new tests **FAIL** (verified: top "match" for the gibberish query was `writing_mastery_level2` with `score: 0.5`).
- Post-fix: both new tests **PASS**. `npx vitest run src/__tests__/roomSearch.test.ts` → 23/23 green (21 existing + 2 new).
- Full vitest suite, typecheck:ci, lint, !92 drift — all green (see MR description).

**Out of scope of this MR:** revisiting the `keywords_en` and `keywords_vi` weight (currently both `+1`, which means a room matching only on VI keywords ranks the same as one matching only on EN keywords; defensible but worth a separate look if Chau wants language-preference ranking).
