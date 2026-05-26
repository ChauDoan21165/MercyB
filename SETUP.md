# Development Setup Guide

## Getting Started

After cloning this repository, follow these steps to set up your development environment:

### Prerequisites

- **Node 22+** — CI and the Capacitor 8 toolchain target Node 22. (The Vercel
  production build runtime is Node 24; a local Node 22+ is fine.)
- **npm** — this repo uses npm; there is no pnpm/yarn lockfile.
- **Supabase CLI** *(optional)* — only for edge-function / migration work.
  Invoke via `npx supabase ...` (no global install required).
- **Vercel CLI** *(optional)* — only for manual deploys / env pulls
  (`npx vercel ...`).
- **Capacitor 8** *(iOS/Android only)* — Xcode (iOS) / Android Studio. Sync
  with `npx cap sync ios` / `npx cap sync android` after a build.
- **Sentry** — error monitoring is wired via `@sentry/react`; the DSN is an
  environment variable (see *Configure Environment* below), not committed.

### 1. Install Dependencies

```bash
npm install
```

### 2. Git Hooks

The pre-commit hooks install **automatically** during `npm install` — the
`prepare` script runs `scripts/setup-hooks.sh` for you. No separate command is
required.

To (re)install them manually, run the script directly:

```bash
bash scripts/setup-hooks.sh
```

This installs pre-commit hooks that:
- ✅ Validate kids room JSON files
- ✅ Prevent commits with invalid filename characters
- ✅ Auto-generate room registry
- ✅ Ensure data integrity

### 3. Configure Environment

Environment variables are **not** auto-configured. They are managed in the
Vercel project dashboard (build + runtime env) and in Supabase project
settings; see `docs/SECURITY_HARDENING_2025.md` for the canonical list. For
local development, create a `.env.local` at the repo root (gitignored) with
the variables you need. If Supabase is unreachable, audio degrades silently
to a local `/audio/{key}` path.

### 4. Start Development

```bash
npm run dev
```

## Git Workflow

### Pre-Commit Validation

Every commit automatically:

1. **Validates Kids Rooms** - Checks all JSON files in `public/data/`
2. **Filename Check** - Blocks commits if filenames contain `"`, `'`, or `` ` ``
3. **Registry Generation** - Updates `src/lib/roomManifest.ts` and `src/lib/roomDataImports.ts`

If validation fails, the commit is blocked. Fix the issues and try again.

### Manual Commands

```bash
# Validate all rooms (full integrity check)
npm run validate-rooms

# Generate the room registry manually
npm run generate:room-registry

# Registry regen + core room validation (the prebuild hook)
npm run rooms:check

# Other room checks
npm run check:empty-rooms
npm run check:kw-coverage
```

## Adding Kids Room Content

### File Naming Convention

✅ **CORRECT:**
```
public/data/colors_nature_kids_l1.json
public/data/travel_transport_kids_l2.json
```

❌ **INCORRECT:**
```
public/data/colors_nature_kids_l1".json  ← Extra quote
public/data/travel transport.json        ← Spaces
public/data/colors'nature.json           ← Single quote
```

### JSON Structure

```json
{
  "name": {
    "en": "Room Name",
    "vi": "Tên Phòng"
  },
  "description": {
    "en": "Room description",
    "vi": "Mô tả phòng"
  },
  "entries": [
    {
      "slug": "entry-1",
      "copy": {
        "en": "English content",
        "vi": "Vietnamese content"
      },
      "audio_url": "/audio/file.mp3",
      "keywords_en": ["keyword1", "keyword2"],
      "keywords_vi": ["từkhóa1", "từkhóa2"]
    }
  ]
}
```

## Troubleshooting

### Hook Not Running

If the pre-commit hook isn't executing:

```bash
# Re-run setup
bash scripts/setup-hooks.sh

# Verify hook is executable
chmod +x .husky/pre-commit

# Check hook content
cat .husky/pre-commit
```

### Validation Failures

Check the validation output for specific errors:

```bash
npm run validate:rooms
```

Common issues:
- Missing JSON files
- Invalid JSON syntax
- Files with quotes in names
- Missing audio files

### Bypassing Hooks (Not Recommended)

Only for emergency situations:

```bash
git commit --no-verify -m "Emergency fix"
```

**Note:** This bypasses validation and may introduce data integrity issues.

## CI/CD

The repository includes GitHub Actions that run on push to `main` and `develop` branches:

- `.github/workflows/validate-and-update-registry.yml`

This ensures validation runs even if developers bypass local hooks.

## Questions?

- Check `ROOM_GUIDE.md` for the canonical room-system documentation
  (it supersedes the old `ROOM_MANAGEMENT.md`)
- Review `scripts/validate-kids-rooms.js` for validation logic
- See `.husky/pre-commit` for hook implementation
