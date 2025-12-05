# Mercy Blade Audio System Documentation v4.2

**Chief Automation Engineer: Audio System Documentation**

Self-healing audio automation system for Mercy Blade.

---

## 🚀 Quickstart for Humans

**Step 1 – Check audio system locally:**
```bash
npm run audio:check
```

**Step 2 – Fix all audio issues:**
```bash
npm run audio:fix
```

**Step 3 – Run tests:**
```bash
npm run test:audio
```

**Step 4 – Visit the admin dashboard:**
```
/admin/audio-coverage
```

---

## Table of Contents

1. [Quickstart](#-quickstart-for-humans)
2. [Naming Standard](#naming-standard)
3. [Validator Rules](#validator-rules)
4. [GCE (Global Consistency Engine)](#gce-global-consistency-engine)
5. [Integrity Scoring](#integrity-scoring)
6. [Manifest Generation](#manifest-generation)
7. [npm Scripts](#npm-scripts)
8. [Running Scripts Manually](#running-scripts-manually)
9. [Admin Dashboard](#admin-dashboard)
10. [GitHub Automation](#github-automation)
11. [Troubleshooting](#troubleshooting)
12. [Architecture](#architecture)
13. [Safety Guarantees](#safety-guarantees)

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

## GCE (Global Consistency Engine)

The GCE (`globalConsistencyEngine.ts`) is **THE SINGLE SOURCE OF TRUTH** for canonical audio naming.

### Key Functions

| Function | Purpose |
|----------|---------|
| `getCanonicalAudioForRoom(roomId, entrySlug)` | Generate canonical EN/VI pair |
| `normalizeRoomId(id)` | Normalize room ID (lowercase, hyphens) |
| `normalizeEntrySlug(slug)` | Normalize entry slug |
| `extractLanguage(filename)` | Extract 'en' or 'vi' from filename |
| `validateWithGCE(filename, roomId, entrySlug)` | Full validation with GCE rules |

### MIN_CONFIDENCE_FOR_AUTO_FIX

The system uses a confidence threshold of **0.85 (85%)** for automatic repairs.

```typescript
export const MIN_CONFIDENCE_FOR_AUTO_FIX = 0.85;
```

Only matches at or above this threshold are auto-fixed. Lower confidence matches require manual review.

---

## Integrity Scoring

Each room receives an integrity score 0-100 based on:

| Component | Points | Criteria |
|-----------|--------|----------|
| Audio Coverage | 60 | % of expected EN+VI files present |
| Naming Correctness | -3 per issue | No naming violations |
| Orphan Penalty | -2 per orphan | No unreferenced files |
| Duplicate Penalty | -1 per dup | No duplicate files |
| Reversal Penalty | -2 per reversal | No swapped EN/VI |

**Score Interpretation:**
- 90-100%: Healthy
- 70-89%: Minor issues
- 50-69%: Needs attention
- <50%: Critical

---

## Manifest Generation

The manifest (`public/audio/manifest.json`) is the source of truth for available audio files.

### Structure

```json
{
  "generated": "2024-01-01T00:00:00.000Z",
  "totalFiles": 1234,
  "validFiles": 1200,
  "invalidFiles": 34,
  "files": [
    "anxiety-relief-breathing-en.mp3",
    "anxiety-relief-breathing-vi.mp3"
  ],
  "errors": ["file_with_underscore.mp3"]
}
```

### Generation Commands

```bash
# Normal mode (updates timestamp)
node scripts/generate-audio-manifest.js

# CI dry-run mode (no timestamp noise)
node scripts/generate-audio-manifest.js --no-timestamp

# Verbose mode
node scripts/generate-audio-manifest.js --verbose
```

---

## npm Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "audio:check": "npx tsx scripts/refresh-json-audio.ts --dry-run --verbose && npx tsx scripts/cleanup-orphans.ts --dry-run && npx tsx scripts/rename-audio-storage.ts --dry-run --verbose",
    "audio:fix": "npx tsx scripts/refresh-json-audio.ts --apply --verbose && npx tsx scripts/rename-audio-storage.ts --verbose && npx tsx scripts/cleanup-orphans.ts --auto-fix && node scripts/generate-audio-manifest.js",
    "test:audio": "vitest run src/lib/audio"
  }
}
```

### Usage

| Command | Description |
|---------|-------------|
| `npm run audio:check` | Dry-run all checks (no modifications) |
| `npm run audio:fix` | Apply all fixes + regenerate manifest |
| `npm run test:audio` | Run audio unit tests |

---

## Running Scripts Manually

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
npx tsx scripts/refresh-json-audio.ts --apply --verbose

# Fix file names
npx tsx scripts/rename-audio-storage.ts --verbose

# Handle orphans (with auto-fix for high confidence matches)
npx tsx scripts/cleanup-orphans.ts --auto-fix

# Regenerate manifest
node scripts/generate-audio-manifest.js
```

### Script Options

| Script | Flags |
|--------|-------|
| `refresh-json-audio.ts` | `--dry-run`, `--apply`, `--verbose`, `--rooms "<pattern>"` |
| `cleanup-orphans.ts` | `--dry-run`, `--auto-fix` |
| `rename-audio-storage.ts` | `--dry-run`, `--verbose` |
| `generate-audio-manifest.js` | `--no-timestamp`, `--verbose` |

---

## Admin Dashboard

Access the Audio Coverage Dashboard at:

```
/admin/audio-coverage
```

### Features

1. **Integrity Summary**: Average score, healthy rooms, issues count
2. **Lowest Integrity Rooms**: Quick access to worst-performing rooms
3. **Room Table**: Sortable by coverage, with missing file details
4. **Dry-Run Modal**: Copy-paste commands for local checks
5. **Fix Modal**: Commands for local fixes + GitHub Actions trigger
6. **CSV Export**: Full audit data for TTS workflows

### Using the Dashboard

1. **Check System Health**: Review the summary cards at the top
2. **Find Problem Rooms**: Click on rooms in "Lowest Integrity" section
3. **Run Dry-Run**: Click "Dry-Run Check" and copy commands to terminal
4. **Apply Fixes**: Click "Fix Entire System" for fix commands or GitHub CLI

---

## GitHub Automation

### Workflow: `Audio Auto-Repair v4.2`

**Triggers:**
- Push to `main` with changes to `public/audio/**` or `public/data/**/*.json`
- Manual dispatch with `apply_fixes` input

### Behavior

| Scenario | Result |
|----------|--------|
| Dry-run with 0 issues | No commit (no noise) |
| Dry-run with issues + push | Auto-apply + commit |
| Manual trigger `apply_fixes=true` | Force apply + commit |

### Steps

1. Run audio tests (`vitest run src/lib/audio`)
2. Generate manifest (no-timestamp mode for dry-run)
3. Dry-run: refresh-json-audio, cleanup-orphans, rename-audio-storage
4. Check if fixes needed
5. (Conditional) Apply fixes if issues detected or `apply_fixes=true`
6. Commit changes with `[skip ci]`
7. Generate summary report

### Triggering Manually

**Via GitHub CLI:**
```bash
gh workflow run "Audio Auto-Repair v4.2" -f apply_fixes=true
```

**Via GitHub UI:**
1. Go to Actions → Audio Auto-Repair v4.2
2. Click "Run workflow"
3. Set `apply_fixes` to `true`
4. Click "Run workflow"

---

## Troubleshooting

### "Missing audio" but file exists

**Cause**: Filename doesn't match canonical format

**Fix**: 
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
npx tsx scripts/refresh-json-audio.ts --apply --verbose
```

### CI keeps committing with no real changes

**Cause**: Manifest timestamp being updated on every run

**Fix**: The v4.2 workflow uses `--no-timestamp` flag to prevent timestamp-only commits

---

## Architecture

```
src/lib/audio/
├── filenameValidator.ts       # Core validation rules
├── globalConsistencyEngine.ts # THE single source of truth (GCE)
├── integrityMap.ts            # Room integrity scoring
├── semanticMatcher.ts         # Fuzzy matching for orphans
├── autoRepair.ts              # Repair operation generator
├── types.ts                   # TypeScript interfaces
└── index.ts                   # Barrel export

scripts/
├── generate-audio-manifest.js # Manifest generator (v4.2)
├── refresh-json-audio.ts      # JSON reference fixer
├── rename-audio-storage.ts    # File renamer
├── cleanup-orphans.ts         # Orphan handler
└── propose-audio-fix-from-csv.ts  # Optional AI-assisted fix (manual only)

.github/workflows/
└── audio-auto-repair.yml      # CI/CD automation (v4.2)
```

### Data Flow

```
Room JSON (public/data/*.json)
        ↓
   GCE validates
        ↓
Manifest (public/audio/manifest.json) ← Storage files (public/audio/*.mp3)
        ↓
   Integrity Map
        ↓
   Admin Dashboard
```

---

## Safety Guarantees

1. **Never delete without backup**: Orphans moved to `_orphans/` folder, duplicates to `_duplicates/`
2. **Dry-run first**: All scripts support `--dry-run` flag
3. **Reports generated**: Every operation writes logs
4. **[skip ci] commits**: Automation commits don't trigger infinite loops
5. **Confidence scoring**: Only high-confidence (≥85%) auto-fixes applied
6. **No-noise CI**: Dry-run-only workflows produce no commits when 0 issues
7. **Recursive git add**: All nested audio/JSON files are captured

---

## Optional: AI-Assisted Fixes

The `propose-audio-fix-from-csv.ts` script uses OpenAI to propose fixes for large-scale issues.

**⚠️ Important:**
- This is a **manual, cost-bearing** tool
- Requires `OPENAI_API_KEY` environment variable
- NOT part of automated CI/CD
- Use only for bulk planning

```bash
# Dry-run proposal (does not apply)
npx tsx scripts/propose-audio-fix-from-csv.ts --dry-run --limit 50

# Generate full proposal
npx tsx scripts/propose-audio-fix-from-csv.ts
```

---

## Contact

For issues with the audio system:
1. Check `/admin/audio-coverage` dashboard
2. Run `npm run audio:check` locally
3. Review generated logs
4. Trigger GitHub workflow if needed
