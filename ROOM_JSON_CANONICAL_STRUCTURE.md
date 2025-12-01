# Room JSON Canonical Structure

**Last updated:** 2025-01-XX  
**Status:** ✅ Fully aligned across runtime, CI, and tooling

---

## Overview

This document defines the **single source of truth** for room JSON entry structure. All systems (runtime loaders, CI validation, registry generation, health checks) now enforce the same rules with identical validation logic.

---

## Canonical Entry Structure

Every room entry MUST follow this structure:

```json
{
  "slug": "entry-identifier",           // OR "id" OR "artifact_id" (at least one required)
  "audio": "filename.mp3",              // String filename only (no paths, no objects)
  "copy": {
    "en": "English content text...",    // English copy/essay
    "vi": "Vietnamese content text..."  // Vietnamese copy/essay
  },
  "keywords_en": ["keyword1", "keyword2"], // Array of English keywords
  "keywords_vi": ["từ khóa 1", "từ khóa 2"] // Array of Vietnamese keywords
}
```

---

## Field Requirements

### 1. **Identifier** (REQUIRED)
- **Canonical**: `slug` OR `id` OR `artifact_id`
- At least ONE of these fields must be present
- Used for entry navigation and URL routing

### 2. **Audio** (REQUIRED in strict mode)
- **Canonical**: `entry.audio` (string)
- Must be filename only (e.g., `"room_entry_01_en.mp3"`)
- NO paths (e.g., ~~`"audio/en/file.mp3"`~~)
- NO objects (e.g., ~~`{ en: "...", vi: "..." }`~~)
- **Legacy fallbacks** (deprecated, migrate to `audio`):
  - `audio_en`
  - `audioEn`

### 3. **Bilingual Copy** (REQUIRED in strict/preview modes)
- **Canonical**: `entry.copy.en` + `entry.copy.vi` (nested object)
- Both English and Vietnamese versions required
- **Legacy fallbacks** (deprecated, migrate to `copy.en/vi`):
  - `copy_en` + `copy_vi` (flat fields)
  - `essay.en` + `essay.vi`
  - `essay_en` + `essay_vi`

### 4. **Keywords** (OPTIONAL but recommended)
- **Canonical**: `keywords_en` (array) + `keywords_vi` (array)
- Used for keyword navigation menu in chat interface
- If missing, system falls back to entry title/slug

---

## Entry Count Rules

Entry count validation is **mode-aware**:

| Mode | Min Entries | Max Entries | Use Case |
|------|-------------|-------------|----------|
| **strict** | 2 | 8 | Production deployment (CI) |
| **preview** | 1 | 15 | Staging/preview environments |
| **wip** | 1 | 20 | Work-in-progress/development |

Mode is controlled by `VITE_MB_VALIDATION_MODE` environment variable.

---

## Systems Aligned

All of these now enforce the SAME structure:

### ✅ Runtime Loading
- **File**: `src/lib/roomLoaderHelpers.ts`
- **Functions**: `extractAudio()`, `extractContent()`, `processEntry()`
- **Behavior**: Prefers canonical fields, minimal legacy fallbacks

### ✅ Validation (Runtime)
- **File**: `src/lib/roomJsonResolver.ts`
- **Functions**: `validateRoomJson()`, `validateEntryAudio()`, `validateEntryBilingualCopy()`
- **Behavior**: Mode-aware validation, enforces canonical structure

### ✅ CI Validation
- **File**: `scripts/validate-rooms-ci.js`
- **Functions**: `validateEntryAudio()`, `validateEntryBilingualCopy()`
- **Behavior**: Blocks CI pipeline if validation fails

### ✅ Registry Generation
- **File**: `scripts/generate-room-registry.js`
- **Functions**: `extractNames()`, `scanRoomFiles()`
- **Behavior**: Validates all entries during manifest generation

---

## Legacy Field Support

Legacy fields are supported with **minimal fallbacks** to allow gradual migration:

| Legacy Field | Canonical Replacement | Status |
|--------------|----------------------|--------|
| `audio_en` | `audio` | Deprecated - migrate |
| `audioEn` | `audio` | Deprecated - migrate |
| `copy_en` + `copy_vi` | `copy.en` + `copy.vi` | Deprecated - migrate |
| `essay.en` + `essay.vi` | `copy.en` + `copy.vi` | Deprecated - migrate |
| `essay_en` + `essay_vi` | `copy.en` + `copy.vi` | Deprecated - migrate |

**Migration path**: Update your room JSON files to use canonical fields. Legacy fallbacks will be removed in future versions.

---

## Validation Modes

Set mode via environment variable:

```bash
# Strict (production)
VITE_MB_VALIDATION_MODE=strict node scripts/validate-rooms-ci.js

# Preview (staging)
VITE_MB_VALIDATION_MODE=preview npm run build

# WIP (development)
VITE_MB_VALIDATION_MODE=wip npm run dev
```

**Default behavior**:
- Production (`MODE=production`): **strict**
- Development (`MODE=development`): **wip**

---

## Example: Valid Room Entry

```json
{
  "id": "room_001",
  "slug": "introduction",
  "audio": "intro_en.mp3",
  "copy": {
    "en": "Welcome to this room. This is the English version of the content...",
    "vi": "Chào mừng đến với căn phòng này. Đây là phiên bản tiếng Việt..."
  },
  "keywords_en": ["welcome", "introduction", "basics"],
  "keywords_vi": ["chào mừng", "giới thiệu", "cơ bản"]
}
```

---

## Example: Invalid Entries (Will Fail Validation)

### ❌ Missing audio
```json
{
  "slug": "entry-1",
  "copy": { "en": "...", "vi": "..." }
  // ❌ No audio field
}
```

### ❌ Audio as object (wrong format)
```json
{
  "slug": "entry-1",
  "audio": { "en": "file_en.mp3", "vi": "file_vi.mp3" }, // ❌ Must be string
  "copy": { "en": "...", "vi": "..." }
}
```

### ❌ Audio with path (wrong format)
```json
{
  "slug": "entry-1",
  "audio": "audio/en/file.mp3", // ❌ Must be filename only
  "copy": { "en": "...", "vi": "..." }
}
```

### ❌ Missing Vietnamese copy
```json
{
  "slug": "entry-1",
  "audio": "file.mp3",
  "copy": { "en": "English only..." }
  // ❌ Missing copy.vi
}
```

### ❌ No identifier
```json
{
  "audio": "file.mp3",
  "copy": { "en": "...", "vi": "..." }
  // ❌ No slug, id, or artifact_id
}
```

---

## Benefits of Alignment

1. **No silent failures**: CI catches the same issues runtime would encounter
2. **Consistent behavior**: Room loads predictably across all environments
3. **Clear error messages**: Validation failures specify exact field and location
4. **Easy debugging**: Single source of truth for "what is a valid entry?"
5. **Migration clarity**: Legacy fields clearly marked and minimal

---

## Troubleshooting

### "Entry X missing audio field"
- Add `"audio": "filename.mp3"` to the entry
- Legacy: `"audio_en": "filename.mp3"` still works but is deprecated

### "Entry X missing bilingual copy"
- Add `"copy": { "en": "...", "vi": "..." }` to the entry
- Legacy: `"copy_en"` + `"copy_vi"` still works but is deprecated

### "Entry X missing identifier"
- Add at least one of: `"slug"`, `"id"`, or `"artifact_id"`

### "Entry count outside allowed range"
- Check your validation mode (strict=2-8, preview=1-15, wip=1-20)
- Adjust entry count or change validation mode

---

## Related Files

- `src/lib/validation/roomJsonValidation.ts` - Mode-aware validation config
- `src/lib/roomJsonResolver.ts` - Canonical JSON resolver
- `src/lib/roomLoaderHelpers.ts` - Runtime entry processing
- `scripts/validate-rooms-ci.js` - CI validation script
- `scripts/generate-room-registry.js` - Registry generation with validation

---

**Status**: All systems aligned ✅  
**Version**: 1.0 (2025-01-XX)
