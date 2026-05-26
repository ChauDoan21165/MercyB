# Cleanup Manifest - November 6, 2025

## Summary
This document records all root-level *.json and *.mp3 files that were archived and deleted as part of the project cleanup.

## Context
- All active room data has been moved to `public/data/` 
- All active audio has been moved to `public/audio/`
- The roomManifest.ts references only files in `public/data/`
- Root-level files are no longer used and were causing project bloat

## Files Deleted

### JSON Files in Root (excluding config files)
All *.json files in project root except:
- package.json
- package-lock.json
- tsconfig.json
- tsconfig.app.json
- tsconfig.node.json
- components.json

Approximately 70+ room JSON files including:
- Anxiety_Relief_Free.json
- confidence_vip1.json, confidence_vip2.json, etc.
- God With Us_VIP3.json
- And many more tier-based room JSONs

### MP3 Files in Root
All 593+ *.mp3 audio files in project root including:
- addiction_support_free_recovery.mp3
- And all other room audio files

## Current Active Structure
```
public/
├── data/           # All active JSON files (referenced in roomManifest.ts)
│   ├── AI_free.json
│   ├── AI_vip1.json
│   ├── Sexuality & Curiosity_free.json
│   └── ... (all other active room JSONs)
└── audio/          # All active audio files
    └── ... (audio files as needed)
```

## Verification
After cleanup, the app should:
1. Load all rooms correctly from public/data/
2. Access audio files from public/audio/
3. Have a cleaner, more maintainable project structure

## Date of Cleanup
November 6, 2025

## Notes
- This was a safe cleanup - all files were confirmed as duplicates or unused
- Active room data remains in public/data/ directory
- roomManifest.ts continues to reference the correct files
