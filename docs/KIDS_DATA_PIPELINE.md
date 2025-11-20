# Kids English Data Pipeline

## Overview

Clean data import pipeline for Kids English rooms following unified content rules. No guessing, no auto-generation—just validation and registration.

---

## Content Standards

### Per Room:
- **Exactly 5 entries**
- Bilingual EN–VI content
- ~120 words English (100-150 range enforced)
- Full Vietnamese translation
- Audio file mapping

### Audio Naming Convention:
```
<roomId>_<entryNumber>_en.mp3

Examples:
level1-alphabet-adventure_1_en.mp3
level1-alphabet-adventure_2_en.mp3
level2-weather-seasons_1_en.mp3
```

---

## JSON Structure

### Room JSON Format:
```json
{
  "id": "level1-alphabet-adventure",
  "level_id": "level1",
  "title_en": "Alphabet Adventure",
  "title_vi": "Phiêu Lưu Bảng Chữ Cái",
  "description_en": "Optional description",
  "description_vi": "Mô tả tùy chọn",
  "icon": "🔤",
  "entries": [
    {
      "display_order": 1,
      "content_en": "English content here (~120 words). Must include 'Try this!' action line...",
      "content_vi": "Nội dung tiếng Việt đầy đủ...",
      "audio_filename": "level1-alphabet-adventure_1_en.mp3",
      "includes_try_this": true
    },
    // ... 4 more entries (display_order 2-5)
  ],
  "meta": {
    "tier": "level1",
    "age_range": "4-7",
    "room_color": "#FFB4E5"
  }
}
```

---

## Validation Rules

### ✅ Automatic Checks:

1. **Room ID Format**: `level1-room-name`
2. **Level ID**: Must be `level1`, `level2`, or `level3`
3. **Entry Count**: Exactly 5 entries
4. **Display Order**: Sequential 1-5
5. **Word Count**: English content 100-150 words
6. **Audio Format**: `<roomId>_<entryNumber>_en.mp3`
7. **Bilingual**: Both EN and VI titles/content required

### ❌ Validation Failures:

- Missing required fields
- Incorrect entry count
- Word count out of range
- Invalid audio filename format
- Missing translations
- Duplicate display_order values

---

## Import Process

### Step 1: Prepare JSON File
Create JSON following the structure above. Validate locally if needed.

### Step 2: Access Admin Import Page
Navigate to: `/admin/kids-import`

### Step 3: Upload & Validate
1. Paste JSON or upload `.json` file
2. Click **"Validate JSON"**
3. Review validation results
4. Fix any errors shown

### Step 4: Import to Database
1. Click **"Import to Database"** (only enabled after successful validation)
2. System automatically:
   - Inserts/updates room metadata
   - Registers all 5 entries
   - Maps audio URLs
   - Sets display order

---

## Audio File Management

### Upload Audio Files:
Audio files should be uploaded to Supabase Storage:
- Bucket: `room-audio` or `room-audio-uploads`
- Path: `/audio/kids/<filename>`

### Audio Mapping:
System automatically maps audio URLs:
```typescript
Entry 1 → /audio/kids/level1-alphabet-adventure_1_en.mp3
Entry 2 → /audio/kids/level1-alphabet-adventure_2_en.mp3
...
```

### Validation:
- Filename format is validated during JSON import
- Actual file existence is NOT checked during import
- Upload audio files separately after JSON import

---

## Database Tables

### `kids_rooms`
Stores room metadata (title, level, descriptions)

### `kids_entries`
Stores entry content (EN, VI, audio URLs, display order)

---

## Isolation from Adult Rooms

✅ **Complete Separation:**
- Different database tables (`kids_rooms`, `kids_entries`)
- Separate audio path (`/audio/kids/`)
- Independent validation schemas
- No interference with existing adult content

---

## Error Handling

### Common Errors:

**Invalid JSON Format:**
- Fix: Check for syntax errors (missing commas, quotes)

**Word Count Out of Range:**
- Fix: Adjust English content to 100-150 words

**Audio Filename Mismatch:**
- Fix: Use exact format `<roomId>_<entryNumber>_en.mp3`

**Missing Translation:**
- Fix: Add complete Vietnamese translation

**Duplicate Display Order:**
- Fix: Ensure entries use unique values 1-5

---

## API Endpoints

### Edge Function: `process-kids-room`
**POST** `/functions/v1/process-kids-room`

**Request Body:**
```json
{
  "roomData": { /* room JSON */ },
  "mode": "insert" | "update" | "upsert"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Room processed successfully",
  "room_id": "level1-alphabet-adventure",
  "entries_count": 5
}
```

---

## Utilities

### `kidsDataValidation.ts`
- Zod schemas for validation
- Error formatting
- Audio filename validation

### `kidsAudioMapping.ts`
- Audio URL generation
- Filename parsing
- Validation helpers

---

## Quick Reference

| Field | Required | Format |
|-------|----------|--------|
| id | Yes | `level1-room-name` |
| level_id | Yes | `level1/2/3` |
| title_en | Yes | String (3-100 chars) |
| title_vi | Yes | String (3-100 chars) |
| entries | Yes | Array[5] |
| content_en | Yes | 100-150 words |
| content_vi | Yes | String |
| audio_filename | Optional | `<roomId>_<n>_en.mp3` |

---

## Next Steps

1. ✅ Pipeline ready
2. ⏳ Provide JSON files for import
3. ⏳ Upload audio files
4. ⏳ Test room viewer interface

---

**No content generation. No guessing. Just clean data processing.**
