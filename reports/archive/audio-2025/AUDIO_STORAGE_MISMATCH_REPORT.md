# Audio Storage Mismatch Report

## Overview

This report tracks audio file integrity across the Mercy Blade application. Audio files are referenced in the database (rooms.entries and kids_entries) and must exist in the Supabase Storage `room-audio` bucket.

---

## Database Metrics

**Total Unique Audio Files Referenced in DB:** 3,229

**Sources:**
- rooms.entries (JSON field containing audio references)
- kids_entries.audio_url (direct audio file references)

---

## Manual Storage Scan Instructions

Since automated storage scanning has limitations, follow these steps to verify audio integrity:

### Step 1: Export Database Audio References

Run this SQL query in Supabase SQL Editor:

```sql
-- Export all audio references from rooms
WITH room_audio AS (
  SELECT DISTINCT
    jsonb_array_elements(entries)->>'audio' as audio_file
  FROM rooms
  WHERE entries IS NOT NULL
  AND jsonb_array_elements(entries)->>'audio' IS NOT NULL
  AND jsonb_array_elements(entries)->>'audio' != ''
),
kids_audio AS (
  SELECT DISTINCT audio_url as audio_file
  FROM kids_entries
  WHERE audio_url IS NOT NULL
  AND audio_url != ''
)
SELECT audio_file
FROM room_audio
UNION
SELECT audio_file
FROM kids_audio
ORDER BY audio_file;
```

Export results as CSV: `db_audio_references.csv`

### Step 2: Export Storage Bucket Contents

1. Navigate to Lovable Cloud → Storage → `room-audio` bucket
2. Use the bucket file list export feature or download the bucket contents list
3. Save as: `storage_audio_files.csv`

### Step 3: Compare Lists

Use a spreadsheet or script to identify:
- Files in DB but not in storage (missing audio)
- Files in storage but not in DB (unused/orphaned audio)

---

## Audit Table

| Metric | Count | Status |
|--------|-------|--------|
| **Total audio references in DB** | 3,229 | ✅ Known |
| **Total audio files in storage** | _[TO FILL]_ | ⏳ Pending manual scan |
| **Missing in storage** | _[TO FILL]_ | ⚠️ BLOCKER if > 0 for critical tiers |
| **Unused in DB** | _[TO FILL]_ | ℹ️ Optional cleanup |
| **Coverage %** | _[TO CALCULATE]_ | Target: 100% for VIP3/4/5 |

---

## Missing Audio Checklist

Use this checklist to track and resolve missing audio files:

### Priority 1: Critical Tiers (VIP3, VIP4, VIP5, Free Core)

- [ ] Identify all missing audio files for VIP3 rooms
- [ ] Identify all missing audio files for VIP4 rooms
- [ ] Identify all missing audio files for VIP5 rooms
- [ ] Identify all missing audio files for Free core rooms
- [ ] **If ANY missing audio in critical tiers → LAUNCH BLOCKER**

### Priority 2: Other Tiers (VIP1, VIP2, VIP6-VIP9)

- [ ] Identify all missing audio files for VIP1 rooms
- [ ] Identify all missing audio files for VIP2 rooms
- [ ] Identify all missing audio files for VIP6+ rooms
- [ ] Plan audio generation or upload for missing files

### Resolution Actions

- [ ] Upload missing audio files to `room-audio` bucket
- [ ] Verify uploaded files are accessible via signed URLs
- [ ] Test audio playback in app for affected rooms
- [ ] Re-run audio integrity scan to confirm 100% coverage

---

## Unused Audio Cleanup (Optional)

Files in storage but not referenced in DB can be safely deleted to reduce storage costs:

1. Generate list of unused audio files
2. Review list to ensure no false positives
3. Archive unused files (download backup)
4. Delete from storage bucket
5. Document cleanup in system logs

---

## Recommended Actions Before Launch

### MANDATORY

1. **Complete manual storage scan** (Step 1-3 above)
2. **Fill in Audit Table** with actual counts
3. **Verify 0 missing audio files** for VIP3, VIP4, VIP5, Free core
4. **If missing audio found:**
   - Upload missing files immediately
   - Test playback in app
   - Re-verify integrity

### OPTIONAL (Post-Launch)

1. Clean up unused audio files (low priority)
2. Implement automated storage scanning script
3. Add audio integrity monitoring to admin dashboard
4. Schedule monthly audio audits

---

## Edge Cases to Check

- **Audio file naming inconsistencies** (e.g., `file.mp3` vs `file_en.mp3`)
- **Case sensitivity issues** (e.g., `File.mp3` vs `file.mp3`)
- **Empty or null audio references** in entries (acceptable if intentional)
- **Multilingual audio** (some rooms may have `audio_en` + `audio_vi`)

---

## Final Verification

Before marking this report COMPLETE:

- [ ] Manual storage scan executed
- [ ] Audit table filled with actual counts
- [ ] Missing audio = 0 for critical tiers
- [ ] Test playback works for sample rooms in each tier
- [ ] Audio integrity confirmed for launch

---

**Status:** ⏳ PENDING MANUAL SCAN

**Blocking Launch?** YES (if missing audio in VIP3/4/5/Free)

**Next Action:** Execute manual storage scan and fill audit table
