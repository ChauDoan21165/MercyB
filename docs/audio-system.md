# Mercy Blade Audio System Documentation v4.7

**Chief Automation Engineer: Audio System Documentation**

Self-healing, governed audio automation system for Mercy Blade.

---

## 🆕 What's New in v4.7 — Persistent Governance & Two-Way Integration

Phase 4.7 delivers **persistent governance database**, **two-way autopilot integration**, and **deep filtering** for production-grade reliability.

### Key Improvements in v4.7

1. **Persistent Governance DB**: Supabase table `audio_governance_reviews` replaces in-memory storage
2. **Two-Way Integration**: 
   - Autopilot sends pending reviews → Governance DB
   - Approved decisions → Autopilot applies them
3. **Deduplication**: Unique constraint prevents duplicate reviews by (room_id, before_filename, operation_type)
4. **Deep Filtering**: Filter by room, confidence, operation type
5. **Stale Cleanup**: Auto-cleanup of pending items older than 7 days
6. **API Endpoints**:
   - `GET /pending-reviews` with filters
   - `POST /approve-change` 
   - `POST /reject-change`
   - `GET /approved-ready` (for autopilot)
   - `POST /mark-applied` (after autopilot applies)
   - `POST /cleanup-stale`

### v4.6 Features (still active)

1. **Job-Level Mutex**: Concurrency control prevents parallel CI runs
2. **Artifact Validation**: JSON validation before upload
3. **Partial Cycle Modes**: `--fast`, `--normal`, `--deep`
4. **History Tracking**: Last 20 cycles stored
5. **99% Integrity Gate**: CI fails if integrity < 99%

### Autopilot Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTOPILOT CYCLE v4.5                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  SCAN    │───▶│  REPAIR  │───▶│ GENERATE │───▶│  ATTACH  │  │
│  │ GCE +    │    │ JSON +   │    │ TTS for  │    │ Semantic │  │
│  │ Integrity│    │ Rename   │    │ Missing  │    │ Orphans  │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       │                                               │         │
│       ▼                                               ▼         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ REBUILD  │◀───│  EVAL    │◀───│ GOVERN   │◀───│ APPLY    │  │
│  │ Manifest │    │ Integrity│    │ Decisions│    │ Approved │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       │                                               │         │
│       ▼                                               ▼         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    WRITE ARTIFACTS                       │   │
│  │  • autopilot-status.json   • autopilot-report.json      │   │
│  │  • autopilot-changeset.json                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Governance Flowchart

```
┌─────────────────┐
│  Change Request │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Evaluate with   │
│ GovernanceEngine│
└────────┬────────┘
         ▼
    ┌────────────┐
    │ Confidence │
    │   Score    │
    └────────┬───┘
         ▼
    ╔════════════════════╗
    ║   ≥92% HIGH CONF   ║──────▶ AUTO-APPROVE
    ╠════════════════════╣
    ║ 75-91% MEDIUM CONF ║──────▶ GOVERNANCE-APPROVE
    ╠════════════════════╣
    ║   <75% LOW CONF    ║──────▶ BLOCKED / HUMAN-REVIEW
    ╚════════════════════╝
```

### Exports from `src/lib/audio/index.ts`

```ts
// Autopilot Engine (Phase 4.5)
export {
  runAutopilotCycle,
  getAutopilotStatus,
  saveAutopilotStatus,
  generateAutopilotReport,
  generateMarkdownReport,
  serializeAutopilotReport,
  serializeChangeSet,
  getAutopilotStatusStore,
  updateAutopilotStatusStore,
} from './audioAutopilot';
```

---

## 🚀 Quickstart for Humans

**Step 1 – Check audio system locally:**
```bash
npm run audio:check
```

**Step 2 – Run full autopilot (dry-run):**
```bash
npx tsx scripts/run-audio-autopilot.ts --dry-run --verbose
```

**Step 3 – Apply autopilot fixes:**
```bash
npx tsx scripts/run-audio-autopilot.ts --apply --verbose
```

**Step 4 – Visit the admin dashboard:**
```
/admin/audio-autopilot
```

---

## Autopilot CLI Usage (v4.6)

```bash
# Dry-run (preview changes, no modifications)
npx tsx scripts/run-audio-autopilot.ts --dry-run

# Apply approved fixes
npx tsx scripts/run-audio-autopilot.ts --apply

# Filter to specific rooms
npx tsx scripts/run-audio-autopilot.ts --apply --rooms "vip1"

# Include TTS generation for missing audio
npx tsx scripts/run-audio-autopilot.ts --apply --with-tts

# Verbose output
npx tsx scripts/run-audio-autopilot.ts --dry-run --verbose

# Limit rooms processed
npx tsx scripts/run-audio-autopilot.ts --apply --max-rooms 50

# Phase 4.6: Quick validation (skip TTS + semantic)
npx tsx scripts/run-audio-autopilot.ts --dry-run --fast

# Phase 4.6: Full deep scan
npx tsx scripts/run-audio-autopilot.ts --dry-run --deep

# Phase 4.6: Custom governance mode
npx tsx scripts/run-audio-autopilot.ts --apply --governance-mode assisted

# Phase 4.6: Named cycle for tracking
npx tsx scripts/run-audio-autopilot.ts --apply --cycle-label "nightly-fix"

# Phase 4.6: Custom artifact output directory
npx tsx scripts/run-audio-autopilot.ts --apply --save-artifacts "./artifacts"

# Phase 4.6: Combined options
npx tsx scripts/run-audio-autopilot.ts --apply --fast --max-changes 100 --verbose
```

### Cycle Modes (v4.6)

| Mode | Flag | TTS | Semantic | Max Rooms | Use Case |
|------|------|-----|----------|-----------|----------|
| Fast | `--fast` | ❌ | ❌ | 50 | Quick validation |
| Normal | (default) | Optional | ✅ | 100 | Standard operation |
| Deep | `--deep` | ✅ | ✅ | 999 | Thorough repair |

### CLI Output Artifacts

After each run, the CLI writes:

| Artifact | Location | Purpose |
|----------|----------|---------|
| Status | `public/audio/autopilot-status.json` | Persistent state store |
| Report | `public/audio/autopilot-report.json` | Full run details |
| ChangeSet | `public/audio/autopilot-changeset.json` | Categorized changes |
| History | `public/audio/autopilot-history.json` | Last 20 cycles (v4.6) |

---

## Unified ChangeSet Schema

All components use this single schema:

```typescript
interface AudioChangeSet {
  criticalFixes: AudioChange[];   // Cross-room, EN/VI parity
  autoFixes: AudioChange[];       // High confidence (≥85%)
  lowConfidence: AudioChange[];   // Medium confidence (50-84%)
  blocked: AudioChange[];         // Below threshold or critical violation
  cosmetic: AudioChange[];        // Formatting only
}

interface AudioChange {
  id: string;
  roomId: string;
  type: 'rename' | 'attach-orphan' | 'generate-tts' | 'fix-json-ref' | 'delete-orphan';
  before?: string;
  after?: string;
  confidence: number;
  governanceDecision: 'auto-approve' | 'governance-approve' | 'requires-review' | 'blocked';
  notes?: string;
}
```

---

## CI Workflow v4.6

The GitHub Actions workflow (`audio-auto-repair.yml`) runs the full autopilot cycle with v4.6 stability features.

### v4.6 Stability Features

1. **Job-Level Mutex**: Only one autopilot run at a time per branch
2. **Artifact Validation**: JSON syntax check before upload
3. **Read from Artifacts**: Metrics pulled from JSON files, not console parsing
4. **Log Compression**: Logs gzipped before upload
5. **Cycle Mode Support**: Fast/Normal/Deep modes via `cycle_mode` input

### Triggers

- **Push to main**: Changes to `public/audio/**` or `public/data/**/*.json`
- **Manual dispatch**: With inputs for `apply_fixes`, `rooms`, `run_autopilot`, `cycle_mode`

### Workflow Inputs (v4.6)

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `apply_fixes` | boolean | false | Apply changes or dry-run |
| `rooms` | string | "" | Room filter pattern |
| `run_autopilot` | boolean | false | Run full cycle |
| `cycle_mode` | choice | normal | fast/normal/deep |

### Workflow Behavior

| Input | Mode | Commits |
|-------|------|---------|
| `apply_fixes=false` | Dry-run | No |
| `apply_fixes=true` | Apply | Yes (if changes) |
| `run_autopilot=true` | Full cycle | Yes (if changes) |

### Integrity Gate

The workflow **fails** if:
1. Integrity after < 99%
2. Critical changes were blocked by governance
3. Artifacts are missing or invalid JSON (v4.6)

### Artifacts Uploaded

- `autopilot-artifacts/` — Status, report, changeset JSONs
- `autopilot-logs/` — CLI output and test results

### Manual Trigger

**Via GitHub CLI:**
```bash
# Dry-run
gh workflow run "Audio Auto-Repair v4.5"

# Apply fixes
gh workflow run "Audio Auto-Repair v4.5" -f apply_fixes=true

# Full autopilot
gh workflow run "Audio Auto-Repair v4.5" -f run_autopilot=true
```

---

## Admin Dashboard

### `/admin/audio-autopilot`

The Autopilot Dashboard shows:

1. **Status Cards**: Last run time, integrity before/after, fixes applied/blocked
2. **Governance Flags**: Any warnings from the governance engine
3. **Commands Tab**: Copy-paste CLI commands
4. **ChangeSet Tab**: Categorized changes with counts
5. **Governance Log Tab**: Individual decisions with reasons
6. **Report Tab**: Download full report JSON

### `/admin/audio-coverage`

The Coverage Dashboard shows:

1. **Summary Cards**: Total rooms, files, missing audio counts
2. **Lowest Integrity Rooms**: Quick access to problem rooms
3. **Room Table**: Coverage percentages with drill-down
4. **CSV Export**: Full audit data

---

## Table of Contents

1. [Quickstart](#-quickstart-for-humans)
2. [Autopilot CLI](#autopilot-cli-usage)
3. [ChangeSet Schema](#unified-changeset-schema)
4. [CI Workflow](#ci-workflow-v45)
5. [Admin Dashboard](#admin-dashboard)
6. [Naming Standard](#naming-standard)
7. [Validator Rules](#validator-rules)
8. [GCE (Global Consistency Engine)](#gce-global-consistency-engine)
9. [Integrity Scoring](#integrity-scoring)
10. [npm Scripts](#npm-scripts)
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

Every filename MUST start with the room ID followed by a hyphen.

### Rule 2: Entry Match (CRITICAL)

Every filename MUST correspond to an actual entry in the room JSON.

### Rule 3: No Duplicates (CRITICAL)

No two files should normalize to the same canonical name.

---

## GCE (Global Consistency Engine)

The GCE (`globalConsistencyEngine.ts`) is **THE SINGLE SOURCE OF TRUTH** for canonical audio naming.

### Key Functions

| Function | Purpose |
|----------|---------|
| `getCanonicalAudioForRoom(roomId, entrySlug)` | Generate canonical EN/VI pair |
| `normalizeRoomId(id)` | Normalize room ID |
| `normalizeEntrySlug(slug)` | Normalize entry slug |
| `extractLanguage(filename)` | Extract 'en' or 'vi' from filename |
| `validateWithGCE(filename, roomId, entrySlug)` | Full validation |

### MIN_CONFIDENCE_FOR_AUTO_FIX

```typescript
export const MIN_CONFIDENCE_FOR_AUTO_FIX = 0.85;
```

Only matches at or above this threshold are auto-fixed.

---

## Integrity Scoring

Each room receives an integrity score 0-100 based on:

| Component | Points |
|-----------|--------|
| Audio Coverage | 60 |
| Naming Violations | -3 per issue |
| Orphan Files | -2 per orphan |
| Duplicates | -1 per dup |
| EN/VI Reversals | -2 per reversal |

**Score Interpretation:**
- 90-100%: Healthy
- 70-89%: Minor issues
- 50-69%: Needs attention
- <50%: Critical

---

## npm Scripts

```json
{
  "scripts": {
    "audio:check": "npx tsx scripts/refresh-json-audio.ts --dry-run --verbose && npx tsx scripts/cleanup-orphans.ts --dry-run && npx tsx scripts/rename-audio-storage.ts --dry-run --verbose",
    "audio:fix": "npx tsx scripts/refresh-json-audio.ts --apply --verbose && npx tsx scripts/rename-audio-storage.ts --verbose && npx tsx scripts/cleanup-orphans.ts --auto-fix && node scripts/generate-audio-manifest.js",
    "audio:autopilot": "npx tsx scripts/run-audio-autopilot.ts",
    "test:audio": "vitest run src/lib/audio"
  }
}
```

| Command | Description |
|---------|-------------|
| `npm run audio:check` | Dry-run all checks |
| `npm run audio:fix` | Apply all fixes |
| `npm run audio:autopilot -- --dry-run` | Run autopilot dry-run |
| `npm run audio:autopilot -- --apply` | Run autopilot apply |
| `npm run test:audio` | Run audio tests |

---

## Troubleshooting

### "Missing audio" but file exists

**Fix**: Run rename script
```bash
npx tsx scripts/rename-audio-storage.ts --verbose
```

### Duplicate warnings

**Fix**: Duplicates moved to `_duplicates/` automatically

### Orphan files detected

**Fix**: 
```bash
npx tsx scripts/cleanup-orphans.ts --auto-fix
```

### JSON references incorrect

**Fix**:
```bash
npx tsx scripts/refresh-json-audio.ts --apply --verbose
```

---

## Architecture

```
src/lib/audio/
├── audioAutopilot.ts          # Autopilot orchestrator (v4.5)
├── audioGovernanceEngine.ts   # Governance rules
├── audioLifecycle.ts          # Lifecycle tracking
├── filenameValidator.ts       # Core validation
├── globalConsistencyEngine.ts # GCE - single source of truth
├── integrityMap.ts            # Room scoring
├── semanticMatcher.ts         # Fuzzy matching
├── ttsGenerator.ts            # TTS for missing audio
├── autoRepair.ts              # Repair operations
├── types.ts                   # TypeScript interfaces
└── index.ts                   # Barrel export

scripts/
├── run-audio-autopilot.ts     # Autopilot CLI (v4.5)
├── generate-audio-manifest.js # Manifest generator
├── refresh-json-audio.ts      # JSON fixer
├── rename-audio-storage.ts    # File renamer
└── cleanup-orphans.ts         # Orphan handler

.github/workflows/
└── audio-auto-repair.yml      # CI/CD (v4.5)

public/audio/
├── autopilot-status.json      # Persistent status
├── autopilot-report.json      # Last run report
├── autopilot-changeset.json   # Categorized changes
└── manifest.json              # File inventory
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
   Autopilot Cycle
        ↓
   Governance Engine
        ↓
   Apply/Block Decisions
        ↓
   Write Artifacts
        ↓
   Admin Dashboard
```

---

## Safety Guarantees

1. **Never delete without backup**: Orphans → `_orphans/`, duplicates → `_duplicates/`
2. **Dry-run first**: All scripts support `--dry-run`
3. **Reports generated**: Every run writes artifacts
4. **[skip ci] commits**: No infinite CI loops
5. **Confidence scoring**: Only ≥85% auto-fixed
6. **No-noise CI**: No commits for dry-run or zero changes
7. **Governance gate**: Critical changes require approval
8. **99% integrity floor**: CI fails below threshold

---

## Contact

For issues with the audio system:
1. Check `/admin/audio-autopilot` dashboard
2. Run `npm run audio:autopilot -- --dry-run` locally
3. Review generated artifacts
4. Trigger GitHub workflow if needed
