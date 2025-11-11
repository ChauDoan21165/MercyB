# Room Management Guide

## Overview

This guide explains how to add new rooms and ensure they're properly registered in the application.

## Adding a New Room

### 1. File Naming Convention

Room JSON files must follow this naming pattern:
```
{Room_Name}_{tier}.json
```

**Examples:**
- `Finding_Gods_Peace_free.json`
- `Anxiety_Relief_vip1.json`
- `Career_Consultant_vip3.json`

**Tier suffixes:**
- `free` - Free tier
- `vip1` - VIP tier 1
- `vip2` - VIP tier 2
- `vip3` - VIP tier 3
- `vip4` - VIP tier 4

### 2. File Location

All room JSON files must be placed in:
```
public/data/
```

**❌ Wrong locations:**
- `supabase/functions/room-chat/data/` (edge function only)
- `user-uploads://` (temporary uploads)
- `src/data/rooms/` (old location)

**✅ Correct location:**
- `public/data/Finding_Gods_Peace_free.json`

### 3. Required JSON Structure

```json
{
  "name": "Finding_Gods_Peace_free.json",
  "tier": "Free / Miễn phí",
  "title": {
    "en": "Finding God's Peace",
    "vi": "Tìm Bình An Của Thiên Chúa"
  },
  "content": {
    "en": "English description...",
    "vi": "Vietnamese description..."
  },
  "entries": [
    {
      "slug": "prayer-basics",
      "title": {
        "en": "Prayer Basics",
        "vi": "Cơ Bản Về Cầu Nguyện"
      },
      "copy": {
        "en": "English content...",
        "vi": "Vietnamese content..."
      },
      "audio": {
        "en": "prayer_basics_en.mp3",
        "vi": "prayer_basics_vi.mp3"
      }
    }
  ]
}
```

## Automatic Registry Updates

### GitHub Actions (Recommended)

The room registry is automatically updated when you:

1. **Push to main/develop** with changes to `public/data/*.json`
2. **Create a pull request** with room file changes
3. **Manually trigger** the workflow from GitHub Actions tab

The workflow will:
- ✅ Validate all JSON syntax
- ✅ Check file naming conventions
- ✅ Generate `roomManifest.ts` and `roomDataImports.ts`
- ✅ Verify all paths have `data/` prefix
- ✅ Commit changes automatically

### Pre-commit Hook (Local Development)

When you commit changes to room files, a pre-commit hook automatically:
1. Detects modified JSON files in `public/data/`
2. Regenerates the room registry
3. Stages the updated registry files

**Setup:**
```bash
npm install  # Installs husky hooks automatically
```

### Manual Registry Update

If needed, you can manually regenerate the registry:

```bash
npm run registry:generate
```

Or:
```bash
node scripts/generate-room-registry.js
```

## Troubleshooting

### Room Not Appearing in App

**Check these in order:**

1. **File Location**
   ```bash
   # Verify file exists in correct location
   ls -la public/data/Finding_Gods_Peace_free.json
   ```

2. **Registry Entries**
   ```bash
   # Check if room is registered
   grep "finding-gods-peace-free" src/lib/roomManifest.ts
   ```

3. **Path Prefix**
   ```bash
   # Verify path has data/ prefix
   grep "finding-gods-peace-free" src/lib/roomManifest.ts
   # Should show: "finding-gods-peace-free": "data/Finding_Gods_Peace_free.json"
   ```

4. **Regenerate Registry**
   ```bash
   npm run registry:generate
   ```

5. **Check GitHub Actions**
   - Go to repository → Actions tab
   - Look for "Validate and Update Room Registry"
   - Check if workflow passed

### Common Issues

#### Issue: Room path missing `data/` prefix

**Symptom:** Room registered but shows `"room-id": "Room_Name_free.json"` instead of `"room-id": "data/Room_Name_free.json"`

**Fix:**
```bash
# Delete old registry files
rm src/lib/roomManifest.ts src/lib/roomDataImports.ts

# Regenerate from scratch
npm run registry:generate
```

#### Issue: File in wrong location

**Symptom:** File exists but not detected by registry script

**Fix:**
```bash
# Move file to correct location
mv supabase/functions/room-chat/data/Room_Name_free.json public/data/

# Regenerate registry
npm run registry:generate
```

#### Issue: Invalid JSON syntax

**Symptom:** GitHub Actions workflow fails with "Invalid JSON" error

**Fix:**
```bash
# Validate JSON syntax
jq empty public/data/Finding_Gods_Peace_free.json

# If errors found, fix JSON and try again
```

## Validation Scripts

### Validate All Room Files

```bash
npm run validate:rooms
```

### Check Registry Integrity

```bash
npm run registry:validate
```

### Generate Missing Audio List

```bash
npm run registry:missing-audio
```

## Audio File Management

Audio files should be placed in:
```
public/audio/{room-name}/
```

**Example:**
```
public/audio/finding-gods-peace/
├── prayer_basics_en.mp3
├── prayer_basics_vi.mp3
├── gratitude_practice_en.mp3
└── gratitude_practice_vi.mp3
```

**Reference in JSON:**
```json
{
  "audio": {
    "en": "finding-gods-peace/prayer_basics_en.mp3",
    "vi": "finding-gods-peace/prayer_basics_vi.mp3"
  }
}
```

## Best Practices

1. **Always place JSON files in `public/data/`** - No exceptions
2. **Use consistent naming** - Follow the `{Name}_{tier}.json` pattern
3. **Commit JSON and registry together** - Let pre-commit hook handle it
4. **Validate before pushing** - Run `npm run validate:rooms` locally
5. **Check GitHub Actions** - Ensure workflow passes after push
6. **Test in staging** - Verify room appears before production deploy

## npm Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run registry:generate` | Regenerate room registry manually |
| `npm run registry:validate` | Validate registry integrity |
| `npm run registry:missing-audio` | List missing audio files |
| `npm run validate:rooms` | Validate all room JSON files |
| `npm run validate:data` | Run data validation script |

## Summary

✅ **To add a new room:**
1. Create properly named JSON file: `{Name}_{tier}.json`
2. Place in `public/data/`
3. Commit changes
4. Pre-commit hook or GitHub Actions will update registry automatically
5. Verify room appears in app

❌ **Don't:**
- Put files in edge function folders
- Manually edit `roomManifest.ts` or `roomDataImports.ts`
- Skip validation scripts
- Forget to include audio files
