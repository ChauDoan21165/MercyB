# Development Setup Guide

## Getting Started

After cloning this repository, follow these steps to set up your development environment:

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Git Hooks (Required)

**IMPORTANT:** All developers must run this command after cloning:

```bash
npm run setup:hooks
```

Or directly:

```bash
bash scripts/setup-hooks.sh
```

This installs pre-commit hooks that:
- ✅ Validate kids room JSON files
- ✅ Prevent commits with invalid filename characters
- ✅ Auto-generate room registry
- ✅ Ensure data integrity

### 3. Configure Environment

The project uses Lovable Cloud (Supabase) for backend. Environment variables are automatically configured.

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
# Validate all kids rooms
npm run validate:rooms

# Generate room registry manually
npm run registry:generate

# Check for missing audio files
npm run registry:missing-audio
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

- Check `ROOM_MANAGEMENT.md` for detailed room management documentation
- Review `scripts/validate-kids-rooms.js` for validation logic
- See `.husky/pre-commit` for hook implementation
