# Mercy Blade Audio System Documentation v4.0

**Chief Automation Engineer: Audio System Documentation**

This document describes the self-healing audio automation system for Mercy Blade.

---

## Table of Contents

1. [Naming Standard](#naming-standard)
2. [Validator Rules](#validator-rules)
3. [Manifest Generation](#manifest-generation)
4. [Admin Dashboard](#admin-dashboard)
5. [Running Scripts](#running-scripts)
6. [GitHub Automation](#github-automation)
7. [Troubleshooting](#troubleshooting)

---

## Naming Standard

All audio files MUST follow this canonical format:

```
{roomId}-{entrySlug}-{lang}.mp3
```

### Rules

| Rule | Example | Invalid Example |
|------|---------|-----------------|
| All lowercase | `room-entry-en.mp3` | `Room-Entry-EN.mp3` |
| Hyphen-separated | `my-room-entry-en.mp3` | `my_room_entry_en.mp3` |
| No spaces | `room-entry-en.mp3` | `room entry en.mp3` |
| Language suffix | `-en.mp3` or `-vi.mp3` | `room-entry.mp3` |
| Starts with roomId | `anxiety-relief-entry-1-en.mp3` | `entry-1-en.mp3` |

### Canonical Example

For room `english_foundation_ef01` with entry `alphabet`:

- **EN**: `english-foundation-ef01-alphabet-en.mp3`
- **VI**: `english-foundation-ef01-alphabet-vi.mp3`

---

## Validator Rules

The `filenameValidator.ts` enforces three critical rules:

### Rule 1: RoomId Prefix (CRITICAL)

Every filename MUST start with the room ID followed by a hyphen:

```typescript
filename.startsWith(normalizedRoomId + '-')
```

**Why?** Prevents audio files from being orphaned or misassigned across rooms.

### Rule 2: Entry Match (CRITICAL)

Every filename MUST correspond to an actual entry in the room JSON:

```typescript
validateWithRoomContext(filename, roomId, entrySlugs)
```

**Why?** Ensures audio files are never referenced without corresponding content.

### Rule 3: No Duplicates (CRITICAL)

No two files should normalize to the same canonical name:

```typescript
detectDuplicates(filenames)
// anger-entry-1-en.mp3 + anger_entry_1_en.mp3 → DUPLICATE
```

**Why?** Prevents confusion and ensures consistent references.

---

## Manifest Generation

The manifest (`public/audio/manifest.json`) is the source of truth for available audio files.

### Structure

```json
{
  "generated": "2024-01-01T00:00:00.000Z",
  "totalFiles": 1234,
  "files": [
    "anxiety-relief-breathing-en.mp3",
    "anxiety-relief-breathing-vi.mp3"
  ]
}
```

### Generation Command

```bash
node scripts/generate-audio-manifest.js
```

The manifest is automatically regenerated:
- During build (`npm run build`)
- After rename operations
- Via GitHub Actions on push

---

## Admin Dashboard

Access the Audio Coverage Dashboard at:

```
/admin/audio-coverage
```

### Features

1. **Summary Cards**: Total rooms, files, missing EN/VI, orphans, naming issues
2. **Room Table**: Sortable by coverage, with missing file details
3. **CSV Export**: Full audit data for TTS workflows
4. **Fix Commands**: Copy-paste commands for repair scripts

### Integrity Score

Each room receives a score 0-100 based on:

| Component | Points | Criteria |
|-----------|--------|----------|
| Audio Coverage | 40 | % of expected EN+VI files present |
| Naming Correctness | 30 | No naming violations |
| JSON Consistency | 20 | Valid audio references |
| No Orphans | 10 | No unreferenced files |

---

## Running Scripts

### Dry-Run Checks (Safe)

```bash
# Check JSON audio references
npx tsx scripts/refresh-json-audio.ts --dry-run --verbose

# Check orphan files
npx tsx scripts/cleanup-orphans.ts --dry-run

# Check naming violations
npx tsx scripts/rename-audio-storage.ts --dry-run --verbose
```

### Apply Fixes (Modifies Files)

```bash
# Fix JSON references
npx tsx scripts/refresh-json-audio.ts --verbose

# Fix file names
npx tsx scripts/rename-audio-storage.ts --verbose

# Handle orphans (with auto-fix for high confidence matches)
npx tsx scripts/cleanup-orphans.ts --auto-fix

# Regenerate manifest
node scripts/generate-audio-manifest.js
```

### Full Repair Sequence

```bash
npx tsx scripts/refresh-json-audio.ts --verbose
npx tsx scripts/rename-audio-storage.ts --verbose
npx tsx scripts/cleanup-orphans.ts --auto-fix
node scripts/generate-audio-manifest.js
```

---

## GitHub Automation

### Workflow: `audio-auto-repair.yml`

Triggered on:
- Push to `main` with changes to `public/audio/**` or `public/data/**`
- Manual dispatch with `apply_fixes` input

### Steps

1. Generate manifest
2. Dry-run refresh-json-audio
3. Dry-run cleanup-orphans
4. Dry-run rename-audio-storage
5. (Conditional) Apply fixes if `apply_fixes=true` or issues detected
6. Commit changes with `[skip ci]`
7. Generate summary report

### Triggering Manually

Via GitHub CLI:

```bash
gh workflow run "Audio Auto-Repair" -f apply_fixes=true
```

Via GitHub UI:
1. Go to Actions → Audio Auto-Repair
2. Click "Run workflow"
3. Set `apply_fixes` to `true`
4. Click "Run workflow"

---

## Troubleshooting

### "Missing audio" but file exists

**Cause**: Filename doesn't match canonical format

**Fix**: Run rename script
```bash
npx tsx scripts/rename-audio-storage.ts --verbose
```

### Duplicate warnings

**Cause**: Two files normalize to same name (e.g., underscore vs hyphen)

**Fix**: Duplicates are moved to `_duplicates/` automatically
```bash
npx tsx scripts/rename-audio-storage.ts --verbose
```

### Orphan files detected

**Cause**: Audio file exists but isn't referenced in any room JSON

**Fix**: 
```bash
# Check potential matches
npx tsx scripts/cleanup-orphans.ts --dry-run

# Auto-fix high-confidence matches (>85%)
npx tsx scripts/cleanup-orphans.ts --auto-fix
```

### JSON references incorrect

**Cause**: Entry audio field has wrong filename or format

**Fix**:
```bash
npx tsx scripts/refresh-json-audio.ts --verbose
```

---

## Architecture

```
src/lib/audio/
├── filenameValidator.ts    # Core validation rules
├── autoRepair.ts           # Repair operation generator
├── globalConsistencyEngine.ts  # Single source of truth
├── integrityMap.ts         # Room integrity scoring
├── semanticMatcher.ts      # Fuzzy matching for orphans
├── types.ts                # TypeScript interfaces
└── index.ts                # Barrel export

scripts/
├── generate-audio-manifest.js   # Manifest generator
├── refresh-json-audio.ts        # JSON reference fixer
├── rename-audio-storage.ts      # File renamer
└── cleanup-orphans.ts           # Orphan handler

.github/workflows/
└── audio-auto-repair.yml        # CI/CD automation
```

---

## Safety Guarantees

1. **Never delete without backup**: Orphans moved to `_orphans/` folder
2. **Dry-run first**: All scripts support `--dry-run` flag
3. **Reports generated**: Every operation writes a JSON report
4. **[skip ci] commits**: Automation commits don't trigger infinite loops
5. **Confidence scoring**: Only high-confidence (>85%) auto-fixes applied

---

## Contact

For issues with the audio system, check the admin dashboard first, then review the generated reports in `public/`.
