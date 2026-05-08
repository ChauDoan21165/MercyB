# A1 — TOEIC Listening audio generation + UI wire

**Date**: 2026-05-07
**Branch**: `audio/toeic-listening`
**Off**: `origin/main` @ `5ff78d61` (commit message: `audio(ielts-speaking): generate band 7 + band 5 clips for 30 topics (#337)`)

## Step 1 — Audio generation

| Metric | Value |
|--------|-------|
| Listening items in `practice-items.ts` | 15 |
| Voiced (uploaded) | 12 |
| Skipped — Part 1 photo-only | 3 |
| Failed | 0 |
| Quota hit | no |
| **Chars billed** | **5,181** |
| Primary voice (M / Q / monologue) | `hpp4J3VqNfWAUOO0d1Us` |
| Secondary voice (W) | `CwhRBWXzGAHq8TQ4Fs17` |
| Bucket | `room-audio` |
| Path scheme | `toeic-listening/{item.id}.mp3` |
| Model | `eleven_multilingual_v2` |
| Voice settings | `{ stability: 0.5, similarity_boost: 0.75 }` |

### Per-item plan

| Item id | Part | Mode | Turns | Speakers | Chars |
|---------|:---:|------|:----:|----------|------:|
| `toeic_listening_part1_office_interaction` | 1 | **SKIP** | 0 | — | — |
| `toeic_listening_part1_warehouse_loading` | 1 | **SKIP** | 0 | — | — |
| `toeic_listening_part1_outdoor_cafe` | 1 | **SKIP** | 0 | — | — |
| `toeic_listening_part2_meeting_reschedule` | 2 | SOLO | 1 | Q | 57 |
| `toeic_listening_part2_indirect_response` | 2 | SOLO | 1 | Q | 39 |
| `toeic_listening_part2_choice_question` | 2 | SOLO | 1 | Q | 48 |
| `toeic_listening_part3_hotel_checkin` | 3 | MULTI | 4 | M,W,M,W | 622 |
| `toeic_listening_part3_supplier_negotiation` | 3 | MULTI | 4 | M,W,M,W | 583 |
| `toeic_listening_part3_it_helpdesk` | 3 | MULTI | 5 | W,M,W,M,W | 472 |
| `toeic_listening_part4_office_announcement` | 4 | SOLO | 1 | S | 604 |
| `toeic_listening_part4_radio_advert` | 4 | SOLO | 1 | S | 516 |
| `toeic_listening_part4_voicemail_callback` | 4 | SOLO | 1 | S | 580 |
| `toeic_listening_extra_quarterly_review` | 4 | SOLO | 1 | S | 560 |
| `toeic_listening_extra_team_standup` | 3 | MULTI | 4 | M,W,M,W | 448 |
| `toeic_listening_extra_budget_disagreement` | 3 | MULTI | 4 | M,W,M,W | 652 |

### Cleaning rules applied

Per the brief, before sending to ElevenLabs:
1. Drop lines starting with `(A)`, `(B)`, `(C)`, `(D)` (multiple-choice options)
2. Drop lines starting with `(Photo:` (Part 1 photo description)
3. Strip speaker prefix `M:` / `W:` / `Q:` (keep the text after)
4. Strip `[bracket annotations]` anywhere in line
5. Collapse whitespace
6. Merge consecutive lines with the same speaker into one turn before render

### Multi-speaker concat

For Part 3 dialogues each turn is rendered separately with the per-speaker voice (`M` → primary, `W` → secondary), then the per-turn mp3 buffers are concatenated via ffmpeg's `concat` demuxer (ffmpeg 8.1) into a single output:

```
ffmpeg -y -loglevel error -f concat -safe 0 -i list.txt -c copy out.mp3
```

`-c copy` keeps stream copy (no re-encode) — same MP3 frame format from ElevenLabs survives concat without quality loss.

### Failures

None.

## Step 2 — UI wire

Wired into `src/pages/exam-prep/toeic/Practice.tsx → PracticeItemDetail` (the component that already renders `practice-items.ts` data).

### Brief deviation (flagged for Chau, confirmed before wiring)

The brief named `TOEICTimedPractice.tsx` as the wire location, but that component consumes `sample-questions.json` (IDs `p1-001`, `p2-001`) — different ID scheme from `practice-items.ts` (IDs `toeic_listening_part1_*`). Wiring the audio there would have required a brittle ID mapping table.

Chau confirmed Option (a): wire the audio in `Practice.tsx` `PracticeItemDetail` instead, where `item.id` matches the storage path 1:1.

### What changed in `Practice.tsx`

- Added imports: `useEffect`, `useRef`, `Volume2`, `Square`, `RotateCcw`, `useAudioUrl`
- Added `isPart1Photo(item)` helper (pure, single-line — Part 1 has no audio)
- Added `<ListeningAudioPlayer itemId hasAudio />` component (~70 lines): single mounted `<audio>` element, two icon-buttons (play/stop toggle, replay), three states (Part 1 message · loading · errored · ready). Auto-plays when the URL becomes available (treated as user gesture since the detail panel was just expanded by click). Browser auto-play blocks fall through to manual click silently.
- `PracticeItemDetail` now renders the player above the existing passage `<pre>` for listening items.

### UX states

| Condition | Render |
|-----------|--------|
| Reading item | nothing (no player) |
| Part 1 listening item | info banner: "🖼️ Part 1 — yêu cầu ảnh thực tế. Bài tự luyện không kèm âm thanh; hãy đọc kỹ phần mô tả ảnh và 4 lựa chọn." |
| `useAudioUrl` still loading | "Đang tải âm thanh…" |
| Audio element fired `onError` | "Audio unavailable" (red banner) |
| Ready | play/stop button (Volume2 ↔ Square), replay button (RotateCcw), label "Phát lời thoại · Listen to the audio", hidden `<audio>` |

### Idempotency

Re-running the script with all 12 keys present should report `Skipped (exists): 12, Generated: 0, Chars: 0, Skipped (Part 1): 3`. The script lists the bucket directory before each render and skips on hit.

## Files changed

- `scripts/generate-toeic-listening-audio.ts` (new) — generator
- `src/pages/exam-prep/toeic/Practice.tsx` (edit) — adds `ListeningAudioPlayer`, wires into `PracticeItemDetail`
- `reports/a1-toeic-listening-audio-run.md` (new) — this report

Not committed (gitignored): `audio-manifest.json`, `audio-progress.json`. The script doesn't use them — it walks `TOEIC_LISTENING_ITEMS` directly and queries the bucket for existence.

## Gates

| Check | Result |
|-------|--------|
| `npm run typecheck` | ✓ clean |
| `npm run lint` | ✓ clean |
| `npm run build` | ✓ 10.2s, 320 PWA entries, 14 MiB |

## Conventions matched against the prior IELTS Speaking script

| Aspect | IELTS Speaking | TOEIC Listening | Match |
|--------|---------------|------------------|-------|
| ElevenLabs base URL | `https://api.elevenlabs.io/v1/text-to-speech` | same | ✓ |
| Model | `eleven_multilingual_v2` | same | ✓ |
| Voice settings | `{ stability: 0.5, similarity_boost: 0.75 }` | same | ✓ |
| Bucket | `room-audio` | same | ✓ |
| Concurrency | 4 | 4 | ✓ |
| Retries | 3 with exponential backoff | same | ✓ |
| Quota handling | graceful exit, log failure | same | ✓ |
| Idempotent | list-bucket-then-skip | same | ✓ |
| Bracket strip | `text.replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim()` | applied per-line | ✓ |

The new pieces unique to TOEIC: per-line speaker label parsing (`M:` / `W:` / `Q:`), per-turn render for multi-speaker items, and ffmpeg concat into one mp3 per item (since the brief specified one storage key per item, not per turn).
