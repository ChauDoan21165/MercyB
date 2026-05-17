# Room Upload Checklist

## Professional Workflow for Adding New Rooms

This checklist ensures rooms work perfectly on first upload to GitHub with zero frustration.

---

## Pre-Upload Validation (MANDATORY)

### Step 1: Run Single Room Validation

```bash
node scripts/validate-single-room.js <your-room-filename>.json
```

**Example:**
```bash
node scripts/validate-single-room.js corporate_conflict_navigation_vip9.json
```

### Step 2: Fix All Errors

The validation script will tell you EXACTLY what to fix:

#### Common Errors and Fixes:

1. **JSON.id doesn't match filename**
   - ERROR: `JSON.id (conflict_navigation_vip9) does NOT match filename (corporate_conflict_navigation_vip9)`
   - FIX: Change `"id": "conflict_navigation_vip9"` to `"id": "corporate_conflict_navigation_vip9"` in JSON

2. **Wrong filename format**
   - ERROR: `Filename must use snake_case only`
   - FIX: Rename `Corporate-Conflict-Navigation-vip9.json` to `corporate_conflict_navigation_vip9.json`

3. **Missing audio file**
   - ERROR: `Audio file not found: corporate_conflict_1_en.mp3`
   - FIX: Upload audio file to `public/audio/` folder first

4. **Entry count violation**
   - ERROR: `Too many entries: 10 (maximum 8)`
   - FIX: Reduce entries to exactly 8

5. **Missing bilingual content**
   - ERROR: `Entry 3: Missing bilingual copy`
   - FIX: Add both `copy.en` and `copy.vi` fields

### Step 3: Re-validate Until Clean

Keep running validation and fixing errors until you see:

```
✅ VALIDATION PASSED - READY FOR GITHUB UPLOAD
```

---

## Canonical Naming Rules (STRICT)

### Filename Format
```
public/data/{room_id}.json
```

Where `room_id`:
- **MUST** be lowercase
- **MUST** use snake_case only (no hyphens except in tier suffix)
- **MUST** end with tier suffix: `_vip9`, `_free`, `_kidslevel1`, etc.
- **MUST** exactly match `JSON.id` field

### Examples:

✅ **CORRECT:**
- `corporate_conflict_navigation_vip9.json` → `"id": "corporate_conflict_navigation_vip9"`
- `strategic_foundations_vip9.json` → `"id": "strategic_foundations_vip9"`
- `kids_phonics_kidslevel1.json` → `"id": "kids_phonics_kidslevel1"`

❌ **WRONG:**
- `Corporate_Conflict_Navigation_vip9.json` (Title_Case)
- `corporate-conflict-navigation-vip9.json` (kebab-case)
- `conflict_navigation_vip9.json` (doesn't match JSON.id)

---

## JSON Structure Requirements

### Required Fields (Root Level):
```json
{
  "id": "corporate_conflict_navigation_vip9",  // MUST match filename
  "tier": "VIP9 / Cấp VIP9",                   // Tier designation
  "domain": "Corporate",                        // Domain category
  "title": {
    "en": "Corporate Conflict Navigation",
    "vi": "Điều Hướng Xung Đột Doanh Nghiệp"
  },
  "content": {
    "en": "80-140 word introduction...",
    "vi": "80-140 word introduction..."
  },
  "entries": [ /* 2-8 entries */ ]
}
```

### Entry Requirements (Each Entry):
```json
{
  "slug": "entry-identifier",                   // Required: kebab-case
  "keywords_en": ["keyword1", "keyword2"],      // Required
  "keywords_vi": ["từ khóa 1", "từ khóa 2"],   // Required
  "copy": {
    "en": "Exactly 350 words...",               // Required
    "vi": "Exactly 350 words..."                // Required
  },
  "tags": ["tag1", "tag2"],                     // Required
  "audio": "filename_1_en.mp3"                  // Required: must exist in public/audio/
}
```

### Entry Count:
- **Minimum:** 2 entries
- **Maximum:** 8 entries
- **VIP9 Standard:** Exactly 8 entries

---

## Audio File Checklist

### Audio File Naming:
```
public/audio/{room_identifier}_{entry_number}_en.mp3
```

**Example:**
```
corporate_conflict_navigation_1_en.mp3
corporate_conflict_navigation_2_en.mp3
...
corporate_conflict_navigation_8_en.mp3
```

### Audio Validation:
- [ ] All audio files exist in `public/audio/`
- [ ] Filenames match exactly what's in `"audio"` field
- [ ] File sizes are reasonable (typically 100KB - 5MB)

---

## Upload Process

### 1. Prepare Files Locally:
```
public/
├── data/
│   └── corporate_conflict_navigation_vip9.json
└── audio/
    ├── corporate_conflict_navigation_1_en.mp3
    ├── corporate_conflict_navigation_2_en.mp3
    └── ... (up to 8 audio files)
```

### 2. Validate:
```bash
node scripts/validate-single-room.js corporate_conflict_navigation_vip9.json
```

### 3. Upload to GitHub:
- Commit both JSON and audio files
- Push to repository
- GitHub Actions will:
  - Re-validate all files
  - Auto-generate registry
  - Deploy if validation passes

### 4. Verify After Upload:
- Check GitHub Actions workflow (should be ✅ green)
- Navigate to Admin Health Check in app
- Run Deep Scan for your tier
- Confirm room appears and loads correctly

---

## Automated Registry System

**You don't need to manually register rooms!**

The system automatically:
1. Detects new JSON files in `public/data/`
2. Validates structure and naming
3. Generates `roomManifest.ts` with all rooms
4. Updates `roomDataImports.ts` with metadata
5. Deploys updated registry

**Pre-commit hook ensures:**
- Registry stays in sync with JSON files
- Invalid files are rejected before commit

---

## Troubleshooting

### "Validation failed" on GitHub Actions
1. Check workflow logs for exact error
2. Run `node scripts/validate-single-room.js <filename>` locally
3. Fix errors shown in report
4. Re-validate until clean
5. Commit and push again

### "Room not showing in app"
1. Check room ID matches filename exactly
2. Verify tier suffix is correct (`_vip9`, not `-vip9`)
3. Run Health Check Deep Scan
4. Check console logs for loading errors

### "Audio not playing"
1. Verify audio files are in `public/audio/`
2. Check filename matches JSON `"audio"` field exactly
3. Confirm file size is reasonable (not corrupted)
4. Test audio file plays locally

---

## Quick Reference

### Validate Single Room:
```bash
node scripts/validate-single-room.js <filename>
```

### Validate All Rooms:
```bash
node scripts/validate-room-files.js
```

### Regenerate Registry:
```bash
node scripts/generate-room-registry.js
```

### Check GitHub Workflows:
- Go to repository → Actions tab
- Look for green checkmarks on latest push
- Click workflow for detailed logs

---

## Support

If validation passes but room still doesn't work:
1. Check browser console logs
2. Run Admin Health Check → Deep Scan
3. Review error details in scan report
4. Share validation report and console errors for debugging
