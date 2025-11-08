# VIP4 JSON Files Validation

This guide explains how to validate VIP4 JSON files to ensure they have correct structure, tier values, and audio file references.

## Quick Start

Run the validation script:

```bash
node scripts/validate-vip4-files.js
```

## What It Checks

### 1. **File Structure**
- ✅ File exists in `public/data/`
- ✅ Valid JSON syntax
- ✅ Required `meta` section present
- ✅ Required `entries` array present

### 2. **Tier Validation**
- ✅ `meta.tier` field is set to `"vip4"`
- ✅ `artifact_version_id` doesn't contain "vip3"
- ✅ `summary_of` doesn't contain "vip3" (if present)

### 3. **Audio References**
- ✅ No audio paths contain "vip3"
- ✅ Audio files end with `.mp3`
- ✅ Audio files exist in `public/audio/rooms/`

### 4. **Entry Structure**
- ✅ Each entry has a `slug` field
- ✅ Audio references are properly formatted

## Files Validated

The script checks these VIP4 files:
- `Discover_Self_vip4_career_1.json`
- `Explore_World_vip4_career_I_2.json`
- `Explore_World_vip4_career_II_2.json`
- `Launch_Career_vip4_career_4_II.json`

## Output Explanation

### ✓ Green Messages
- All checks passed successfully

### ❌ Red Messages (ISSUES)
- Critical errors that must be fixed
- Examples:
  - Wrong tier value
  - Audio paths containing "vip3"
  - Missing required fields
  - Invalid JSON structure

### ⚠️ Yellow Messages (WARNINGS)
- Non-critical issues to review
- Examples:
  - Missing optional fields
  - Audio files not found (may not be uploaded yet)
  - Naming convention suggestions

## Exit Codes

- `0` - All validations passed (or only warnings)
- `1` - Critical issues found (must be fixed)

## Example Output

```
🔍 VIP4 JSON Files Validation
══════════════════════════════════════════════════════════════════════

══════════════════════════════════════════════════════════════════════
Validating: Discover_Self_vip4_career_1.json
══════════════════════════════════════════════════════════════════════

❌ ISSUES (2):
  • Entry 1 (interest-quiz-start): Audio [en] contains "vip3": self_vip3_01_en.mp3
  • Entry 1 (interest-quiz-start): Audio [vi] contains "vip3": self_vip3_01_vi.mp3

⚠️  WARNINGS (1):
  • Entry 1 (interest-quiz-start) [en]: Audio file not found: self_vip4_01_en.mp3

══════════════════════════════════════════════════════════════════════
SUMMARY
══════════════════════════════════════════════════════════════════════

Files validated: 4
✓ Passed: 3
✗ Failed: 1

❌ Total issues: 2
⚠️  Total warnings: 1

❌ Validation failed. Please fix the issues above.
```

## Common Fixes

### Issue: Audio contains "vip3"
**Solution:** Run the finalization script:
```bash
node scripts/finalize-vip4-conversion.js
```

### Issue: Wrong tier value
**Solution:** Update the `meta.tier` field in the JSON file to `"vip4"`

### Issue: artifact_version_id contains "vip3"
**Solution:** Update the field to replace "vip3" with "vip4"

## Integration with CI/CD

You can add this to your GitHub Actions workflow:

```yaml
- name: Validate VIP4 Files
  run: node scripts/validate-vip4-files.js
```

This will automatically check all VIP4 files on every commit.
