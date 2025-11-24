# Room Validation Rules

## Canonical Filename Convention (NON-NEGOTIABLE)

**Rule:** `public/data/{room_id}.json`

Where:
- `room_id` **EXACTLY** equals `JSON.id` field
- **all lowercase**
- **snake_case** or **kebab-case** (depending on id)
- **NO** Title_Case
- **NO** PascalCase
- **NO** mixed casing
- **NO** extra variations

### Valid Examples
```
public/data/strategic_foundations_vip9.json  ✅
public/data/strategic-foundations-vip9.json  ✅ (if id uses kebab-case)
public/data/finding_gods_peace_free.json     ✅
```

### Invalid Examples
```
public/data/Strategic_Foundations_vip9.json  ❌ (Title_Case)
public/data/Strategic_Foundations_VIP9.json  ❌ (mixed case)
public/data/strategic_foundations.json       ❌ (missing tier)
public/data/StrategicFoundations_vip9.json   ❌ (PascalCase)
```

## JSON Structure Requirements

### Required Top-Level Fields

1. **Bilingual Title** (one of):
   - `title.en` + `title.vi`
   - `name` + `name_vi`

2. **Entries Array**
   - Must contain 2-8 entries
   - Each entry MUST have:
     - Identifier: `slug` OR `artifact_id` OR `id`
     - Audio: `audio` OR `audio_en` OR `audioEn`
     - Bilingual copy: `copy.en` + `copy.vi` OR `copy_en` + `copy_vi`
     - Title (bilingual preferred)

3. **Tier Field** (recommended)
   - Valid values: `free`, `vip1`, `vip2`, `vip3`, `vip3_ii`, `vip4`, `vip5`, `vip6`, `vip7`, `vip8`, `vip9`, `kidslevel1`, `kidslevel2`, `kidslevel3`

### Example Valid JSON Structure

```json
{
  "id": "strategic_foundations_vip9",
  "name": "Foundations of Strategic Thinking",
  "name_vi": "Nền tảng tư duy chiến lược",
  "tier": "VIP9",
  "domain": "Individual Strategic Mastery",
  "title": {
    "en": "Foundations of Strategic Thinking",
    "vi": "Nền tảng tư duy chiến lược"
  },
  "content": {
    "en": "Introduction in English (80-140 words)...",
    "vi": "Giới thiệu bằng tiếng Việt (80-140 từ)..."
  },
  "entries": [
    {
      "slug": "strategic-mindset-basics",
      "title": {
        "en": "Strategic Mindset Basics",
        "vi": "Cơ bản về tư duy chiến lược"
      },
      "keywords_en": ["strategic", "mindset", "thinking"],
      "keywords_vi": ["chiến lược", "tư duy", "suy nghĩ"],
      "copy": {
        "en": "350-word content in English...",
        "vi": "Nội dung 350 từ bằng tiếng Việt..."
      },
      "audio": "strategic_foundations_vip9_entry1.mp3",
      "tags": ["strategy", "mindset"]
    }
    // ... 7 more entries (total 8)
  ]
}
```

## Validation Scripts

### Pre-Publish Validation
```bash
node scripts/validate-room-files.js
```

This script enforces:
- ✅ Canonical filename rules
- ✅ JSON structure requirements
- ✅ Entry count (2-8)
- ✅ Bilingual field presence
- ✅ Audio field presence
- ✅ Identifier field presence
- ✅ JSON.id matches filename

**BLOCKS DEPLOYMENT** if any errors found.

### Registry Generation
```bash
node scripts/generate-room-registry.js
```

Auto-generates:
- `src/lib/roomManifest.ts`
- `src/lib/roomDataImports.ts`

This script now **REJECTS** files that don't follow canonical naming.

## Error Handling

### Hard Failures (No Silent Skips)

When JSON cannot be loaded, the system will:
- ❌ **REJECT** the import
- ❌ **NOT** register the room
- ❌ **NOT** skip silently
- ✅ **SHOW** detailed error with:
  - Room ID
  - Expected path
  - Reason for failure
  - Additional details

### Example Error Output

```
❌ ERROR: JSON file not found or invalid
room: strategic_foundations_vip9
expected: public/data/strategic_foundations_vip9.json
reason: File not found after trying all paths
detail: Tried: manifest, canonical (data/strategic_foundations_vip9.json), and backwards-compatible variants
```

## System-Wide Resolver

All JSON loading throughout the application uses **ONE** canonical resolver:

**File:** `src/lib/roomJsonResolver.ts`

**Used by:**
- Chat system (`src/lib/roomLoader.ts`)
- Health Check (`src/pages/admin/UnifiedHealthCheck.tsx`)
- Registry Generation (`scripts/generate-room-registry.js`)
- All future room data consumers

**Functions:**
- `resolveRoomJsonPath(roomId)`: Finds JSON file path
- `loadRoomJson(roomId)`: Loads and validates JSON
- `validateRoomJson(data, roomId, filename)`: Strict validation
- `validateAllRooms(roomIds)`: Bulk validation

## CI/CD Integration

### GitHub Actions Workflow

The workflow (`validate-and-update-registry.yml`) now includes:

1. **Strict Validation Step** (NEW)
   ```yaml
   - name: Strict validation of room files
     run: node scripts/validate-room-files.js
   ```

2. **Registry Generation**
   - Only runs if validation passes
   - Auto-commits changes

3. **Integrity Checks**
   - Verifies all paths
   - Confirms file existence

**Deployment is BLOCKED** if validation fails.

## Migration Path

### For Existing Non-Compliant Files

If you have files that don't follow the canonical naming:

1. **Rename files** to match canonical rule:
   ```bash
   # Example
   mv Strategic_Foundations_vip9.json strategic_foundations_vip9.json
   ```

2. **Update JSON.id** to match filename:
   ```json
   {
     "id": "strategic_foundations_vip9"
   }
   ```

3. **Run validation**:
   ```bash
   node scripts/validate-room-files.js
   ```

4. **Regenerate registry**:
   ```bash
   node scripts/generate-room-registry.js
   ```

### Backwards Compatibility

The resolver includes **limited** backwards compatibility:
- Tries lowercase variants
- Tries snake_case/kebab-case conversions
- **Logs deprecation warnings**

⚠️ **Deprecated paths will be removed in future versions**

## Best Practices

1. ✅ **Always** validate before commit
2. ✅ **Use** lowercase only
3. ✅ **Match** JSON.id to filename
4. ✅ **Include** all bilingual fields
5. ✅ **Maintain** 2-8 entries per room
6. ✅ **Test** locally before pushing
7. ✅ **Review** validation errors carefully
8. ✅ **Fix** issues immediately (don't skip)

## Automated Tests

Future test suite will include:
- Filename matching tests
- Manifest alignment tests
- JSON presence tests
- No text/html response tests
- Bilingual field tests
- Tier resolver tests (including VIP9)

**Deployment will block** if tests fail.

## Support

For validation issues:
1. Check error message details
2. Verify filename matches `JSON.id`
3. Confirm lowercase and correct casing
4. Run `node scripts/validate-room-files.js`
5. Check CI/CD logs for detailed failures

---

**Last Updated:** 2025-11-24
**Enforcement:** Mandatory for all room files
**Deployment:** Blocked on validation failure
