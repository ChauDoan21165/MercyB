# Audio Addressability Check

Branch: `c42/audio-addressability`

Consumer: audio-address mapping decision; Strategy v2.7 world-model replay claim.

## Finding

Finalized Azure TTS cache keys are deterministic over provider, Azure voice name, normalized language, and exact trimmed spoken text. The persisted object path is deterministic:

```text
room-audio/tts-cache/{sha256("azure|{azureVoice.name}|{language}|{text}")}.mp3
```

For the Vietnamese A1 inventory cells sampled here, the spoken cell text is `address.Sentence`, the runtime language is `vi`, and the Azure voice is `vi-VN-HoaiMyNeural`.

## Code Evidence

From `supabase/functions/mercy-tts/core.ts`:

```ts
async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
```

```ts
const TTS_CACHE_BUCKET = "room-audio";
const TTS_CACHE_PREFIX = "tts-cache";
```

```ts
function cachePathFor(hash: string): string {
  return `${TTS_CACHE_PREFIX}/${hash}.mp3`;
}
```

```ts
const text = String(body?.text ?? "").trim();
const language = normalizeLanguage(body?.language);
```

```ts
const azureVoice = azureVoiceFor(language);
azureCacheHash = await sha256Hex(`azure|${azureVoice.name}|${language}|${text}`);
```

```ts
textHash = await sha256Hex(`azure|${azureVoice.name}|${language}|${text}`);
```

```ts
await bucket.upload(cachePathFor(hash), bytes, {
  contentType: "audio/mpeg",
  upsert: true,
});
```

From `supabase/functions/mercy-tts/azureProvider.ts`:

```ts
vi: { locale: "vi-VN", name: "vi-VN-HoaiMyNeural" },
```

```ts
export function azureVoiceFor(language: string): AzureVoice {
  const base = String(language || "en").trim().toLowerCase().split("-")[0];
  return AZURE_VOICE_BY_LANGUAGE[base] ?? AZURE_VOICE_BY_LANGUAGE.en;
}
```

## Public URL Formula

```text
https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/{hash}.mp3
```

## 10-Sample Probe

Command shape:

```bash
curl -sS -I -L -o /dev/null -w '%{http_code}\t%{content_type}' "$url"
```

| Cell | Spoken text | Hash | HTTP | Result |
| --- | --- | --- | ---: | --- |
| `vi-en:A1:lesson-001:vocabulary-001` | `Xin chào` | `07e7e214d1da7153702bbfa45db5d4a21f0cdf706bc87fc4cb3e3c54fd602121` | 200 `audio/mpeg` | hit |
| `vi-en:A1:lesson-001:vocabulary-002` | `Chào buổi sáng` | `32fdb965c3ff543a173acfb5b1e624848a13ccfaa0d61b1d44140d0fc3da4103` | 400 `application/json; charset=utf-8` | miss |
| `vi-en:A1:lesson-001:vocabulary-003` | `Bạn khỏe không?` | `10bb574903d397905f2fb0b7d15c7504eb2c788a56e04a2ed89600ae4494b091` | 400 `application/json; charset=utf-8` | miss |
| `vi-en:A1:lesson-001:vocabulary-004` | `Tạm biệt` | `13656bd78e2339b3884139d8c93888bb9ead6025fdd7e3a355e9d0b9e106dc52` | 400 `application/json; charset=utf-8` | miss |
| `vi-en:A1:lesson-002:vocabulary-001` | `Cho tôi một cà phê sữa đá.` | `c28187a2587de4824f918ae6ac6eaa065dda3e94ee70c5d74d85538933e9a534` | 400 `application/json; charset=utf-8` | miss |
| `vi-en:A1:lesson-002:vocabulary-002` | `Tôi muốn ăn phở.` | `e97fa0077d3569cffbbd5f23543107e38cb06097c0d5f7de21f4ef29f1e5a5be` | 400 `application/json; charset=utf-8` | miss |
| `vi-en:A1:lesson-002:vocabulary-003` | `Không cay, làm ơn.` | `9c6d00eb7e1bcf086419d0cd765df27ab1765a3f6ba3172a67785b4d536590b4` | 400 `application/json; charset=utf-8` | miss |
| `vi-en:A1:lesson-002:vocabulary-004` | `Tính tiền giúp tôi.` | `eb157e310c62bb1c789ac605e61255011c0ef8aacbe13f1d82f648c6a986c603` | 400 `application/json; charset=utf-8` | miss |
| `vi-en:A1:lesson-003:vocabulary-001` | `Cho tôi đến địa chỉ này.` | `5b881e833042a527db0759f495989d84e3d614b43f1fecbf65d4e615f9286c57` | 400 `application/json; charset=utf-8` | miss |
| `vi-en:A1:lesson-003:vocabulary-002` | `Rẽ trái.` | `64f48f1a4345a445106aabaae7000cb1eb4916fff63f9c1e1b70bac9bb379002` | 400 `application/json; charset=utf-8` | miss |

Hit rate in sample: 1 / 10.

## Verdict

`viable-after-warmup`.

A mapping table is viable because the cache address is deterministic from exact runtime TTS inputs and the public `room-audio` object URL is addressable without credentials when an object exists. It is not complete today: nine of ten sampled cells have no cached object yet. The replay claim should therefore be phrased as: runtime TTS has deterministic cache-addressability after a cell has been spoken once through the Azure path; full cell replay requires a warmup/backfill pass or a mapping build that invokes the same runtime TTS path for every cell.
