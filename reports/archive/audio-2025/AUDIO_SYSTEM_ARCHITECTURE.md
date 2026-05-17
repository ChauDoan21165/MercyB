# Audio System Architecture

**Last updated:** 2025-01-XX  
**Status:** ✅ Production-ready with full error handling

---

## Overview

The Mercy Blade audio system provides resilient, user-friendly audio playback with robust error handling, loading states, and clear console warnings for missing content.

---

## Audio Path Construction

### Canonical Path Format

All audio files follow this strict format:

```
/audio/{filename}.mp3
```

**Examples:**
- `/audio/room_entry_01_en.mp3` ✅
- `/audio/strategic_foundations_1_en.mp3` ✅

**NEVER:**
- `public/audio/file.mp3` ❌ (no "public/" prefix)
- `audio/file.mp3` ❌ (missing leading slash)
- `/rooms/audio/file.mp3` ❌ (wrong base path)

### Path Normalization Pipeline

Audio paths are normalized through this flow:

```
Entry JSON → extractAudio() → processAudioField() → normalizeAudioPath() → AudioPlayer
```

1. **Entry JSON** (`entry.audio`):
   ```json
   {
     "audio": "filename.mp3"
   }
   ```

2. **extractAudio()** (`roomLoaderHelpers.ts`):
   - Reads `entry.audio` (canonical) or legacy fields
   - Returns raw filename string or null
   - Logs warning if audio is missing

3. **processAudioField()** (`roomLoaderHelpers.ts`):
   - Accepts raw audio string
   - Splits playlists (space-separated filenames)
   - Calls normalizeAudioPath() for each file

4. **normalizeAudioPath()** (`roomLoaderHelpers.ts`):
   - Strips invalid "public/" prefix
   - Strips redundant "audio/" prefix
   - Ensures leading "/" for absolute URL
   - Returns: `/audio/{filename}`

5. **AudioPlayer** (`AudioPlayer.tsx`):
   - Receives final path: `/audio/filename.mp3`
   - Adds cache-busting: `?v={timestamp}`
   - Loads audio element with full URL

### Constants

All audio paths use these constants:

```typescript
// src/lib/constants/rooms.ts
export const AUDIO_FOLDER = "audio"; // Never "public/audio"
export const ROOM_AUDIO_BUCKET = "room-audio";

// src/lib/roomLoader.ts
const AUDIO_BASE_PATH = `${AUDIO_FOLDER}/`; // "audio/"
```

---

## Error Handling & Resilience

### Loading States

**Before audio ready** (`isAudioReady: false`):
```
┌─────────────────────────────────┐
│ ⟳  Loading audio...             │
└─────────────────────────────────┘
```
- Shows spinner + "Loading audio..." text
- Play button disabled
- User sees clear loading indicator

**After audio ready** (`isAudioReady: true`):
- Full audio controls enabled
- Play/pause, skip, volume, speed controls
- Progress bar interactive

### Error States

**Audio load failure** (`hasError: true`):
```
┌─────────────────────────────────────┐
│ ⚠️ Audio not available right now   │
│                           [Retry]   │
└─────────────────────────────────────┘
```
- Shows specific error message based on MediaError code
- Retry button reloads audio element
- No silent failures

**Error Types & Messages:**

| Error Code | User Message |
|------------|-------------|
| `MEDIA_ERR_ABORTED` | "Audio playback aborted" |
| `MEDIA_ERR_NETWORK` | "Network error loading audio" |
| `MEDIA_ERR_DECODE` | "Audio file is corrupted or unplayable" |
| `MEDIA_ERR_SRC_NOT_SUPPORTED` | "Audio format not supported" |
| Default | "Audio not available right now" |

### Console Warnings

**Missing audio in entry:**
```javascript
⚠️ Missing audio: Room "writing-deepdive-part12" → Entry "introduction"
   Add "audio" field to entry in JSON file
```

**Audio load failure:**
```javascript
❌ Audio failed to load: /audio/missing_file.mp3
Error details: MediaError { code: 4, message: "..." }
```

**Audio load success:**
```javascript
✅ Audio loaded successfully: /audio/file.mp3 Duration: 180.5
✅ Audio can play: /audio/file.mp3
```

---

## User Experience Features

### 1. Automatic Position Resume

Audio player saves position per track and resumes on return:

```javascript
// Saved to sessionStorage
"audio-pos:/audio/file.mp3" → "45.2" (seconds)
```

- Position saved on pause and time updates
- Restored when same track loads again
- Cleared when track ends naturally

### 2. Playlist Support

Multiple audio files in one entry create playlists:

```json
{
  "audio": "file1.mp3 file2.mp3 file3.mp3"
}
```

- Auto-plays next track on completion
- Shows track counter: "2/3"
- Previous/Next buttons for navigation
- Each track has independent position memory

### 3. Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space** | Play/Pause |
| **←** | Skip backward 5s |
| **→** | Skip forward 5s |
| **↑** | Volume up |
| **↓** | Volume down |

### 4. Playback Controls

- **Speed**: 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x
- **Volume**: Slider + mute toggle
- **Skip**: ±10s buttons
- **Replay**: Jump to start
- **Progress bar**: Click to seek

---

## Integration Guide

### For Room JSON Authors

**Canonical entry structure:**

```json
{
  "slug": "entry-01",
  "audio": "room_entry_01_en.mp3",
  "copy": {
    "en": "English content...",
    "vi": "Vietnamese content..."
  }
}
```

**Rules:**
1. Use `"audio"` field (not `audio_en` or other variants)
2. Provide filename only (no paths)
3. File must exist in `public/audio/` directory
4. Use `.mp3` format for best compatibility

**Playlists (multiple files):**

```json
{
  "audio": "intro.mp3 main.mp3 outro.mp3"
}
```

Separate filenames with spaces.

### For Developers

**Loading a room with audio:**

```typescript
import { loadMergedRoom } from '@/lib/roomLoader';

const room = await loadMergedRoom(roomId);
// room.merged[0].audio === "/audio/filename.mp3"
// room.merged[0].audioPlaylist === ["/audio/file1.mp3", "/audio/file2.mp3"]
```

**Using AudioPlayer component:**

```tsx
import { AudioPlayer } from '@/components/AudioPlayer';

<AudioPlayer
  audioPath={entry.audio}
  playlist={entry.audioPlaylist}
  isPlaying={isPlaying}
  onPlayPause={() => setIsPlaying(!isPlaying)}
  onEnded={() => handleTrackEnd()}
  preload="metadata"
/>
```

**Props:**
- `audioPath`: Full path like `/audio/file.mp3`
- `playlist`: Optional array of full paths
- `isPlaying`: External play/pause state
- `onPlayPause`: Callback for play/pause button
- `onEnded`: Callback when track completes
- `preload`: "none" | "metadata" | "auto"

---

## File Organization

```
public/
  audio/                    # All audio files stored here
    room_entry_01_en.mp3
    room_entry_02_en.mp3
    ...

src/
  lib/
    constants/
      rooms.ts              # AUDIO_FOLDER constant
    roomLoader.ts           # Calls processEntriesOptimized
    roomLoaderHelpers.ts    # Audio extraction & normalization
  components/
    AudioPlayer.tsx         # Audio playback UI with error handling
```

---

## Troubleshooting

### "Audio not available right now"

**Possible causes:**
1. File doesn't exist at `/audio/{filename}`
2. Incorrect filename in JSON
3. Network error loading file
4. File format unsupported

**How to fix:**
1. Check console for "❌ Audio failed to load" message
2. Verify file exists in `public/audio/` directory
3. Check `entry.audio` field in room JSON
4. Click "Retry" button to reload
5. Check browser console for MediaError details

### "⚠️ Missing audio" console warning

**Cause:** Entry has no `audio` field in JSON

**How to fix:**
```json
{
  "slug": "entry-01",
  "audio": "filename.mp3",  // ← Add this field
  "copy": { ... }
}
```

### Audio path construction issues

**Check these files:**
1. `roomLoaderHelpers.ts` → `normalizeAudioPath()`
2. `roomLoader.ts` → `AUDIO_BASE_PATH`
3. Room JSON → `entry.audio` field

**Common mistakes:**
- Adding "public/" prefix ❌
- Missing leading "/" ❌
- Using full URL instead of relative path ❌

---

## Testing Checklist

- [ ] Audio loads and plays successfully
- [ ] Loading spinner shows while buffering
- [ ] Error message + retry button appears on load failure
- [ ] Position resumes when returning to same track
- [ ] Playlists auto-advance to next track
- [ ] Keyboard shortcuts work (Space, arrows)
- [ ] Volume and speed controls work
- [ ] Progress bar seeking works
- [ ] Missing audio logs console warning
- [ ] Audio files use correct `/audio/` path format

---

## Migration Notes

### Legacy Field Support

Old room JSONs may use deprecated fields:

```json
// ❌ DEPRECATED (still works but migrate to canonical)
{
  "audio_en": "file.mp3",
  "audioEn": "file.mp3"
}

// ✅ CANONICAL
{
  "audio": "file.mp3"
}
```

The system supports legacy fields but logs should help identify files to migrate.

### Path Migration

If you see console warnings about "public/audio/" paths:

1. Update room JSON to use filename only
2. System will strip "public/" prefix automatically
3. No immediate action required, but canonical format is preferred

---

## Performance Notes

- **Preload strategy**: `metadata` by default (loads duration/metadata only)
- **Cache busting**: Adds `?v={timestamp}` to force reload on track change
- **Session storage**: Position saved per track, cleared on completion
- **Single-pass processing**: `processEntriesOptimized()` extracts audio in one pass

---

## Related Documentation

- `ROOM_JSON_CANONICAL_STRUCTURE.md` - Room entry structure requirements
- `src/lib/validation/roomJsonValidation.ts` - Audio field validation
- `src/components/AudioPlayer.tsx` - Audio player implementation

---

**Status**: Fully operational ✅  
**Version**: 2.0 (2025-01-XX)
