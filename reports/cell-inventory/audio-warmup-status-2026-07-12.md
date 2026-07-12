# Vietnamese->English A1 Audio Warmup Status

Started: 2026-07-12T18:18:48.472Z

Finished: 2026-07-12T18:19:29.517Z

Source map: `reports/cell-inventory/audio-map-vn-en-a1.json`

## Runtime Tuple Finding

English target replay is mapped to finalized Azure TTS cache entries using `language=en`, `voice=en-US-AvaMultilingualNeural`, and the English source text field for each cell type: `phrase.english` for Vocabulary Item cells and `dialogue.english` for Dialogue Turn cells.

Vietnamese lesson audio is not emitted as a `tts-cache` tuple in this run. The current Vietnamese A1 lesson UI plays pre-generated `room-audio` lesson bundle keys through `LessonAudioButton` / `useAudioUrl`, and the voice config says no production surface calls `fetchCloudTtsUrl({ language: 'vi' })` today.

## Code Path Quotes

`src/lib/pronunciation/tts.ts`:

```ts
const cloud = await fetchCloudTtsUrl({ text, language: 'en' });
```

`src/lib/mercyVoice.ts`:

```ts
supabase.functions.invoke("mercy-tts", {
  body: { text, voice_id, language },
});
```

`src/config/mercyVoices.ts`:

```ts
export const ENGLISH_VOICE_ID = ENGLISH_VOICE_IDS.us;
us: "hpp4J3VqNfWAUOO0d1Us"
```

`supabase/functions/mercy-tts/core.ts`:

```ts
azureCacheHash = await sha256Hex(`azure|${azureVoice.name}|${language}|${text}`);
```

`supabase/functions/mercy-tts/azureProvider.ts`:

```ts
en: { locale: "en-US", name: "en-US-AvaMultilingualNeural" }
```

`src/languages/vietnamese/normalize.ts`:

```ts
sentences: (lesson.phrases ?? []).map((phrase) => ({
  native: phrase.vietnamese,
  en: phrase.english,
}))
```

`src/components/languages/LessonRenderer.tsx`:

```tsx
lessonAudioKey(lesson.audioBase, {
  kind: "vocab",
  index: vi + 1,
})
```

## Coverage

| Probe | Count |
| --- | ---: |
| Total mapped cells | 627 |
| Total mapped tuples | 627 |
| English target tuples | 627 |
| Vietnamese TTS-cache tuples | 0 |
| Addressable before warmup | 2 |
| Missing before warmup | 625 |
| Addressable after warmup | 2 |
| Missing after warmup | 625 |
| Failures | 0 |

Warmup skipped/stopped reason: Missing SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY; HEAD probes ran, but invoking the production mercy-tts endpoint requires the same anon auth the app sends.

Post-run English-audio coverage replacing `0/627 addressable`: 2/627.

## Failures

_None._
