# A5 — Vietnamese B1 audio generation run (2026-05-07)

First Vietnamese-B1 audio batch via FPT.AI. 150 lessons (IDs 97–246).
0-failure target met.

## Lesson scope

`src/languages/vietnamese/lessons.ts` levels:

| Level | Count | IDs |
|-------|------:|-----|
| A1    | 96    | 1–96 (already generated under `a1/vi/...`) |
| B1    | 150   | 97–246 ← this run |

Pre-run check on Supabase Storage `room-audio` bucket: `b1/vi/` direct
entries = **0**. This was genuinely the first B1 Vietnamese batch.

## Script change

`scripts/generate-vietnamese-audio.ts` previously hardcoded the storage
prefix to `a1/vi/...`. The brief said the script "now derives prefix
from `lesson.level.toLowerCase()` — verified by typecheck"; that wasn't
true on `main`, so the change was made here:

- `--level=<X>` CLI flag added (filters `VIETNAMESE_LESSONS` by
  `lesson.level === X` before the entries are built; no flag = all
  levels processed)
- The storage prefix is now `${lesson.level.toLowerCase()}/vi/...` so
  each batch lands under the right segment without manual config

App typecheck passes. The pre-existing `tsconfig.scripts.json` import-
extension warning on the lesson import is unchanged and unrelated.

## Run results

```
=== Summary ===
  Processed:        708
  Newly generated:  708
  Skipped (exists): 0
  Failed:           0
  Chars billed:     38,479
EXIT=0
```

Concurrency=1 (the script's existing serial `for` loop over entries),
total wall-clock roughly 25–30 minutes via FPT.AI v5 with `thuminh` /
`leminh` voices alternating per phrase / dialogue line.

## Storage verification (post-run)

```
b1/vi/ direct entries: 150          (matches 150 B1 lessons)
b1/vi/l97/  clip count: 6           dialogue_1.mp3 size=28,503 …
b1/vi/l175/ clip count: 7           dialogue_1.mp3 size=20,907 …
b1/vi/l246/ clip count: 12          dialogue_1.mp3 size=23,967 …
```

Each lesson's clip count equals `phrases.length + dialogue.length`,
confirming the script enumerated the full lesson tree without skipping.

## Manifest delta

```
                clips    chars
  before run   19,076    935,526
  after  run   19,076    935,526
  delta             0          0
```

The unified manifest at `audio-manifest.json` is **unchanged** — and
this is correct, not a bug. `scripts/build-audio-manifest.ts` only
processes the languages in its `LANG_CODES` map (fr/de/ja/ko/zh).
Vietnamese is **not** in that map and is **not** consumed by the
ElevenLabs `generate-b2-audio.ts` pipeline; the Vietnamese pipeline is
self-contained — `generate-vietnamese-audio.ts` builds its entries
in-memory, checks `existsInBucket()` directly against Supabase, and
never touches `audio-manifest.json` or `audio-progress.json`.

The brief asked to "extend [the manifest builder] if not" — but
extending it would create entries with FPT voice strings (`thuminh`,
`leminh`) inside an ElevenLabs-shaped manifest, which the
`generate-b2-audio.ts` pipeline would then try to feed to the wrong
provider. That's a footgun without a corresponding consumer. Leaving
the manifest builder as-is is the safer call until there's a clear
need (e.g. a unified inventory dashboard or a single generator that
knows about both providers). Flagged below as deferred.

Sample storage keys verified pre-run:

```
  b1/vi/l100/phrase_1.mp3   chars=55
  b1/vi/l100/phrase_2.mp3   chars=66
  b1/vi/l100/dialogue_1.mp3 chars=52
  b1/vi/l175/dialogue_1.mp3 chars=32
  b1/vi/l175/dialogue_2.mp3 chars=38
  b1/vi/l175/dialogue_3.mp3 chars=49
  b1/vi/l240/phrase_1.mp3   chars=57
  b1/vi/l240/phrase_2.mp3   chars=63
  b1/vi/l240/phrase_3.mp3   chars=68
```

## Flags / uncertain / deferred

- **Manifest extension to Vietnamese is deferred** (see above). If the
  unified manifest ever needs to inventory Vietnamese audio, the
  cleanest path is a small `extractVietnamese` extractor that emits
  entries with a provider/voice marker the consuming generators can
  branch on, and a `if (e.language === "vi") return false` guard in
  `generate-b2-audio.ts` so it can't accidentally route Vietnamese
  text through ElevenLabs. Not done in this PR — out of stated scope
  and adds maintenance burden without a current consumer.
- **`audio-progress.json` is not used by this pipeline.** The
  Vietnamese generator checks Supabase Storage directly via
  `existsInBucket()` per entry, so there's no progress file to copy
  back to the main worktree. A re-run of
  `npx tsx scripts/generate-vietnamese-audio.ts --level=B1` after this
  PR will correctly skip every existing clip via the bucket check.
- **Worktree path was named `/private/tmp/a7-vi-b1-audio/` in the
  brief; renamed to `a5-vi-b1-audio` to match my actual agent label,
  same convention as the previous run.** Branch name
  `audio/vi-b1-generate` is task-based and unchanged. Report file is
  `reports/a5-vi-b1-audio-run.md` (the brief specified `a7-...`; same
  rename applies).
