# Audio Reference Standardization Guide

## Overview
This guide explains the standardized audio reference format for all room JSON files and provides tools to audit and fix inconsistencies.

## Standard Format

### Naming Convention
All audio files MUST follow this pattern:
```
{room_slug}_{tier}_{entry_slug}.mp3
```

**Examples:**
- `social_anxiety_free_small_talk.mp3`
- `addiction_support_vip3_recovery.mp3`
- `ai_vip1_curiosity_of_intelligence.mp3`

### Room Slug Rules
- Convert filename to lowercase
- Remove tier suffix (e.g., `_vip1.json`)
- Replace spaces with underscores
- Example: `Social_Anxiety_free.json` → `social_anxiety`

### Tier Values
- `free` - Free tier
- `vip1` - VIP1 tier
- `vip2` - VIP2 tier  
- `vip3` - VIP3 tier

### Entry Slug Rules
- Use the `slug` field from the entry
- Convert to lowercase
- Replace spaces/hyphens with underscores
- Example: `"slug": "small-talk"` → `small_talk`

## JSON Structure

### ✅ CORRECT - Simple String Format
```json
{
  "entries": [
    {
      "slug": "small-talk",
      "audio": "social_anxiety_free_small_talk.mp3"
    }
  ]
}
```

### ✅ CORRECT - Bilingual Object Format
```json
{
  "entries": [
    {
      "slug": "recovery",
      "audio": {
        "en": "addiction_support_vip3_recovery.mp3",
        "vi": "addiction_support_vip3_recovery_vi.mp3"
      }
    }
  ]
}
```

### ❌ WRONG - Inconsistent Tier
```json
{
  "entries": [
    {
      "slug": "recovery",
      "audio": "addiction_support_vip2_recovery.mp3"
    }
  ]
}
// File: Addiction_Support_vip3.json
// ERROR: Audio has vip2 but file is vip3
```

### ❌ WRONG - Root Level Audio
```json
{
  "audio": "some_audio.mp3",
  "entries": [...]
}
// ERROR: Audio should not be at root level (except for content.audio)
```

### ⚠️ ACCEPTABLE - Content Audio
```json
{
  "content": {
    "en": "Room introduction...",
    "audio": "room_name_tier_intro.mp3"
  },
  "entries": [...]
}
// OK: Content-level audio for room introduction
```

## Tools

### 1. Audit Script
**Purpose:** Scan all JSON files and report inconsistencies

**Usage:**
```bash
node scripts/audit-audio-references.js
```

**Output:**
- Console report with issue breakdown
- Detailed JSON report saved to `audio-audit-report.json`

**Issue Types:**
- 🔴 CRITICAL - File parsing errors or invalid structure
- 🟠 ERROR - Missing audio, wrong tier, invalid paths
- 🟡 WARNING - Root-level audio, formatting issues

### 2. Fix Script
**Purpose:** Automatically standardize all audio references

**Dry Run (Preview Changes):**
```bash
node scripts/fix-audio-references.js --dry-run
```

**Apply Fixes:**
```bash
node scripts/fix-audio-references.js
```

**What It Does:**
- Removes incorrect root-level audio fields
- Standardizes audio paths to `{room_slug}_{tier}_{entry_slug}.mp3`
- Fixes tier mismatches
- Adds missing audio fields
- Preserves bilingual object format when detected

### 3. Legacy Scripts (Deprecated)
- `standardize-audio-names.js` - Old script, use new ones instead
- `fix-audio-paths.js` - Old script, use new ones instead

## Workflow

### For New Rooms
1. Name JSON file: `{Room_Name}_{tier}.json`
2. Use `slug` field in each entry
3. Reference audio as: `{room_slug}_{tier}_{entry_slug}.mp3`
4. Run audit to verify: `node scripts/audit-audio-references.js`

### For Existing Rooms
1. Run audit: `node scripts/audit-audio-references.js`
2. Review the report
3. Preview fixes: `node scripts/fix-audio-references.js --dry-run`
4. Apply fixes: `node scripts/fix-audio-references.js`
5. Verify: Run audit again

### Before Deployment
```bash
# Full check
node scripts/audit-audio-references.js

# Should output: "✅ No issues found! All audio references are consistent."
```

## Common Issues & Solutions

### Issue: "Wrong tier in audio"
**Cause:** Audio filename has different tier than JSON filename
**Fix:** Run fix script or manually update audio reference

### Issue: "Missing audio field"
**Cause:** Entry has no audio property
**Fix:** Run fix script to auto-generate, or add manually

### Issue: "Root level audio"
**Cause:** Audio field at top level of JSON (deprecated pattern)
**Fix:** Run fix script to remove (it's usually incorrect)

### Issue: "Audio path doesn't match expected pattern"
**Cause:** Custom audio path not following convention
**Fix:** Rename audio file or update reference to follow standard

## Best Practices

1. **Always use slugs** - Every entry should have a `slug` field
2. **Consistent naming** - Follow the standard pattern exactly
3. **Run audit regularly** - Check for issues during development
4. **Version control** - Commit before running fix script
5. **Verify audio files exist** - Scripts check references, not actual files

## Migration Notes

If migrating from old format:
1. Backup your data: `cp -r public/data public/data.backup`
2. Run audit to see current state
3. Run fix script with --dry-run
4. Review changes carefully
5. Apply fixes
6. Test in application
7. Update audio filenames if needed to match references

## Questions?

Check the DebugRooms page (`/debug-rooms`) for live room health status.
