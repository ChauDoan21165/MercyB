# Room Validation Results (Design System v1.1)

## Summary

- **Total Rooms**: [Generated after running script]
- **Clean Rooms**: [Generated after running script]
- **Rooms with Violations**: [Generated after running script]

---

## About This Report

This report is **automatically generated** by running:

```bash
npx tsx src/lib/scripts/validateRoomData.ts
```

The validation script:

1. **Fetches all rooms** from Supabase database (both `rooms` and `kids_rooms` tables)
2. **Validates each room** against Design System v1.1 rules:
   - Room ID must be kebab-case, lowercase
   - Tier must match canonical TIERS enum values
   - Each entry must have 3-5 keywords (both EN and VI)
   - Each entry must have 2-4 tags
   - Each entry copy must be 50-150 words (both EN and VI)
   - Audio paths must be filename only (no folder paths)
3. **Generates reports** in both JSON and Markdown formats

---

## Example Format

Below is an example of how violations would be displayed after running the script:

### Room: `meaning-of-life-vip3`
- **Tier**: VIP3 / VIP3

**Violations**

- **ID**: ✅ valid
- **Tier**: ✅ valid
- **Keywords**:
  - Entry `entry-01`: `keywords_en` has 2 items (needs 3-5 items)
  - Entry `entry-01`: `keywords_vi` has 2 items (needs 3-5 items)
  - **TODO**: Adjust keyword arrays to 3-5 items each
- **Tags**:
  - Entry `entry-01`: `tags` has 1 items (needs 2-4 items)
  - **TODO**: Adjust tags array to 2-4 items
- **Copy Length**:
  - Entry `entry-02`: `copy.en` is 180 words (must be 50-150 words)
  - Entry `entry-02`: `copy.vi` is 175 words (must be 50-150 words)
  - **TODO**: Edit text content to 50-150 words
- **Audio Paths**:
  - Entry `entry-03`: `audio` = "audio/meaning_of_life_vip3_01_en.mp3" (must be filename only)
  - **TODO**: Remove folder path, use filename only (e.g., "room_entry_01_en.mp3")

---

### Room: `Women_Health_Free`
- **Tier**: Free / Miễn phí

**Violations**

- **ID Issues**:
  - ❌ Must be kebab-case, lowercase, pattern /^[a-z0-9]+(-[a-z0-9]+)*$/
  - Current: `Women_Health_Free`
  - Expected: kebab-case lowercase (e.g., "my-room-name")
  - **TODO**: Rename to kebab-case, update JSON + DB
- **Tier**: ✅ valid

---

## How to Fix Violations

### ID Issues
- **Problem**: Room ID doesn't match kebab-case pattern (contains uppercase, underscores, etc.)
- **Solution**: Rename room ID to lowercase kebab-case
  - Example: `Women_Health_Free` → `women-health-free`
- **Steps**: 
  1. Rename JSON file from `Women_Health_Free.json` to `women-health-free.json`
  2. Update `id` field inside JSON to `"women-health-free"`
  3. Update database row: `UPDATE rooms SET id = 'women-health-free' WHERE id = 'Women_Health_Free'`

### Tier Issues
- **Problem**: Tier value doesn't match canonical TIERS enum
- **Solution**: Use exact tier value from `src/lib/constants/tiers.ts`
  - Valid values: `"Free / Miễn phí"`, `"VIP1 / VIP1"`, `"VIP2 / VIP2"`, etc.
- **Steps**: 
  1. Check current tier value in JSON
  2. Replace with canonical value from TIERS constant
  3. Update database row to match

### Keyword Count Issues
- **Problem**: Entry has fewer than 3 or more than 5 keywords
- **Solution**: Adjust `keywords_en` and `keywords_vi` arrays
  - Example: `["meaning", "purpose"]` → `["meaning", "purpose", "existence"]`
- **Steps**: 
  1. Open room JSON file
  2. Find entry with violation
  3. Edit `keywords_en` array to have 3-5 relevant keywords
  4. Edit `keywords_vi` array to have 3-5 matching Vietnamese keywords
  5. Update database entries field

### Tag Count Issues
- **Problem**: Entry has fewer than 2 or more than 4 tags
- **Solution**: Adjust `tags` array to categorize entry appropriately
  - Example: `["philosophy"]` → `["philosophy", "introspection"]`
- **Steps**: 
  1. Open room JSON file
  2. Find entry with violation
  3. Edit `tags` array to have 2-4 relevant categorization tags
  4. Update database entries field

### Copy Length Issues
- **Problem**: Entry text is shorter than 50 words or longer than 150 words
- **Solution**: Edit content to meet word count requirement
  - If too short: Add more explanation, examples, or context
  - If too long: Condense, remove redundancy, split into multiple entries
- **Steps**: 
  1. Open room JSON file
  2. Find entry with violation
  3. Count words in `copy.en` and `copy.vi` fields
  4. Edit to 50-150 words while maintaining quality and meaning
  5. Update database entries field

### Audio Path Issues
- **Problem**: Audio field contains folder path or subdirectory
- **Solution**: Use filename only, no paths
  - Wrong: `"audio/room_entry_01_en.mp3"` or `"sounds/file.mp3"`
  - Correct: `"room_entry_01_en.mp3"`
- **Steps**: 
  1. Open room JSON file
  2. Find entry with violation
  3. Remove path prefix from audio field, keep only filename
  4. Ensure audio file exists in Supabase storage bucket `room-audio`
  5. Update database entries field

---

## Running Validation

```bash
# Navigate to project root
cd /path/to/mercy-blade

# Run validation script
npx tsx src/lib/scripts/validateRoomData.ts

# Script will:
# 1. Fetch all rooms from Supabase database
# 2. Validate against Design System v1.1 rules
# 3. Generate ROOM_VALIDATION_REPORT.json (detailed JSON)
# 4. Generate ROOM_VALIDATION_RESULTS.md (this file, with actual results)
# 5. Exit with code 1 if violations found, 0 if all clean
```

**Integration with CI/CD:**

Add to GitHub Actions workflow:

```yaml
- name: Validate Room Data
  run: npx tsx src/lib/scripts/validateRoomData.ts
```

This will fail builds if any room violates Design System v1.1 rules.

---

## After Fixing Violations

1. **Fix issues** following the guidelines above
2. **Update both JSON files and database** - they must match
3. **Re-run validation** to confirm fixes:
   ```bash
   npx tsx src/lib/scripts/validateRoomData.ts
   ```
4. **Verify output**: Should show "✅ All rooms pass validation!"
5. **Commit changes** once all rooms are clean

---

## Current Status

**This file is a template.** 

Run the validation script to populate this report with actual violation data from your database:

```bash
npx tsx src/lib/scripts/validateRoomData.ts
```

The script will overwrite this file with real results.

---

*Report template for Design System v1.1 validation*
*Actual results generated by running: `npx tsx src/lib/scripts/validateRoomData.ts`*
