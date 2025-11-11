# Room Update & Validation Guide

## Quick Validation After Room Updates

After updating any room file, use this command to verify everything is working:

```bash
node scripts/validate-room-after-update.js <filename>
```

**Example:**
```bash
node scripts/validate-room-after-update.js Mens_Mental_Health_free.json
```

This automated script will:
- ✅ Validate JSON structure
- ✅ Check if room is registered in manifest
- ✅ Verify edge function data sync
- ✅ Confirm all audio files exist
- 🔄 **Auto-fix** manifest issues by regenerating registry

## What the Script Checks

### 1. **JSON Validity**
- Ensures the JSON file can be parsed
- Checks for syntax errors

### 2. **Required Fields**
- Validates presence of `entries` field
- Checks entry structure (slug, copy, etc.)

### 3. **Manifest Registration**
- Confirms room is registered in `src/lib/roomManifest.ts`
- Verifies correct room ID format (kebab-case with tier)

### 4. **Edge Function Sync**
- Checks if `supabase/functions/room-chat/data/` has matching file
- Validates data consistency between main and edge function files

### 5. **Audio Files**
- Verifies all referenced audio files exist in `public/audio/`
- Reports missing audio with specific entry references

## Common Issues & Solutions

### Issue: "Room not found in manifest"

**Cause:** The room manifest hasn't been regenerated after adding/updating the file.

**Solution:** The script will automatically run `npm run registry:generate` to fix this.

**Manual fix:**
```bash
npm run registry:generate
```

### Issue: "Edge function data differs from main file"

**Cause:** The edge function copy is out of sync with the main data file.

**Solution:** Manually copy the updated file:
```bash
cp public/data/Your_Room_file.json supabase/functions/room-chat/data/
```

### Issue: "Missing audio file"

**Cause:** Audio file referenced in JSON doesn't exist in `public/audio/`.

**Solution:** 
1. Check the audio filename in the JSON matches the actual file
2. Ensure audio file is in `public/audio/` directory
3. Copy missing audio files to the correct location

### Issue: "Room doesn't appear in app"

**Possible causes:**
1. ❌ Room file not in `public/data/` directory
2. ❌ Manifest not regenerated (run validation script)
3. ❌ Incorrect filename format (must end with `_free.json`, `_vip1.json`, etc.)
4. ❌ Invalid JSON structure
5. ❌ Browser cache (hard refresh with Ctrl+Shift+R or Cmd+Shift+R)

**Solution:** Run the validation script to diagnose:
```bash
node scripts/validate-room-after-update.js <your-file.json>
```

## Workflow: Adding or Updating a Room

### Step 1: Update Room Files

1. **Main data file**: Update `public/data/Your_Room_free.json`
2. **Audio files**: Place in `public/audio/`
3. **Edge function**: Update `supabase/functions/room-chat/data/Your_Room_free.json`

### Step 2: Validate

```bash
node scripts/validate-room-after-update.js Your_Room_free.json
```

### Step 3: Review Results

The script will show:
- ✅ Green checkmarks for passing checks
- ⚠️  Yellow warnings for non-critical issues (missing audio, etc.)
- ❌ Red errors for critical failures

### Step 4: Auto-Fix

If the script detects manifest issues, it will automatically:
1. Regenerate the room registry
2. Re-validate to confirm fixes

## Other Validation Commands

### Validate All Rooms
```bash
npm run validate:rooms
```
Runs comprehensive validation on all room files in `public/data/`.

### Check Missing Rooms
```bash
npm run registry:validate
```
Compares manifest against actual files, identifies orphaned files.

### Find Missing Audio
```bash
npm run registry:missing-audio
```
Scans all rooms for missing audio file references.

### Regenerate Registry Manually
```bash
npm run registry:generate
```
Rebuilds `roomManifest.ts` and `roomDataImports.ts` from scratch.

## File Locations

| File Type | Location | Purpose |
|-----------|----------|---------|
| Room Data (main) | `public/data/*.json` | Primary room content |
| Edge Function Data | `supabase/functions/room-chat/data/*.json` | Backend copy for AI chat |
| Audio Files | `public/audio/*.mp3` | Audio narration files |
| Room Manifest | `src/lib/roomManifest.ts` | Registry of all rooms (auto-generated) |
| Room Data Map | `src/lib/roomDataImports.ts` | Room metadata (auto-generated) |

## Best Practices

1. **Always validate after updates** - Catch issues before deployment
2. **Keep files in sync** - Main data and edge function data should match
3. **Use consistent naming** - Follow the `Room_Name_tier.json` convention
4. **Test audio paths** - Use Audio Test Page (`/audio-test`) to verify playback
5. **Commit together** - Update main file, edge file, and audio in same commit

## Troubleshooting Checklist

When a room doesn't appear:

- [ ] File is in `public/data/` directory
- [ ] Filename ends with `_free.json`, `_vip1.json`, etc.
- [ ] JSON is valid (run validation script)
- [ ] Manifest has been regenerated
- [ ] Edge function data is synced
- [ ] Browser cache cleared (hard refresh)
- [ ] Check console for errors (F12 → Console tab)

## Quick Reference

**Most common command:**
```bash
# After updating Mens_Mental_Health_free.json
node scripts/validate-room-after-update.js Mens_Mental_Health_free.json
```

**If room still not showing:**
```bash
# Force regenerate everything
npm run registry:generate

# Validate all rooms
npm run validate:rooms

# Check for errors in browser console (F12)
```

## Getting Help

If validation passes but room still doesn't appear:
1. Check browser console (F12) for JavaScript errors
2. Verify you're looking in correct tier section (Free/VIP1/VIP2/VIP3)
3. Clear browser cache completely
4. Check room ID in URL matches expected format: `/free/mens-mental-health-free`
