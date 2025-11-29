# Empty Rooms Fix Plan

## Overview

Three rooms in the database have **no entries** (entries array is empty or null):

1. `homepage_v1`
2. `obesity`
3. `stoicism`

These rooms appear in the database but have no content, causing potential issues in the UI and room health checks.

---

## Room Analysis

### 1. homepage_v1

| Field | Value |
|-------|-------|
| **ID** | `homepage_v1` |
| **Tier** | `free` |
| **Title EN** | (check DB) |
| **Title VI** | (check DB) |
| **Entries** | 0 |
| **Issue** | Special system room for homepage content |
| **Recommended Action** | **DELETE** or **CONVERT TO METADATA** |

**Rationale:**
- This appears to be a metadata/system room, not a real content room
- Homepage content should not be stored as a regular room
- Users should not see this in room listings

**SQL to DELETE:**
```sql
DELETE FROM rooms WHERE id = 'homepage_v1';
```

**Alternative: Hide from listings**
```sql
UPDATE rooms 
SET is_demo = true, is_locked = true
WHERE id = 'homepage_v1';
```

**JSON File Action:**
- Remove `public/data/homepage_v1.json` if it exists
- Or move to `public/data/system/homepage_v1.json` (separate system folder)

---

### 2. obesity

| Field | Value |
|-------|-------|
| **ID** | `obesity` |
| **Tier** | (check DB) |
| **Title EN** | (check DB) |
| **Title VI** | (check DB) |
| **Entries** | 0 |
| **Issue** | Incomplete or draft room |
| **Recommended Action** | **DELETE** (if not planned) or **MARK AS DRAFT** |

**Rationale:**
- Room has no content entries
- Likely an abandoned or incomplete room
- Should not be visible to users

**SQL to DELETE:**
```sql
DELETE FROM rooms WHERE id = 'obesity';
```

**Alternative: Mark as draft/hidden**
```sql
UPDATE rooms 
SET is_locked = true
WHERE id = 'obesity';

-- Or add a custom "status" field if needed
-- ALTER TABLE rooms ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
-- UPDATE rooms SET status = 'draft' WHERE id = 'obesity';
```

**JSON File Action:**
- Remove `public/data/obesity.json` if it exists
- Or move to draft folder if you plan to complete it later

---

### 3. stoicism

| Field | Value |
|-------|-------|
| **ID** | `stoicism` |
| **Tier** | `free` |
| **Title EN** | Stoic Philosophy |
| **Title VI** | Triết Học Stoic |
| **Entries** | 0 |
| **Issue** | Metadata-only room (room_essay exists, but no entries) |
| **Recommended Action** | **DELETE** or **COMPLETE WITH ENTRIES** |

**Rationale:**
- Room has descriptive text (`room_essay`) but no actual content entries
- Users cannot interact with a room that has no entries
- Either complete the room or remove it

**SQL to DELETE:**
```sql
DELETE FROM rooms WHERE id = 'stoicism';
```

**Alternative: Complete the room**
- Add 6-8 entries to `public/data/stoicism.json`
- Sync to database using sync-rooms-from-json
- Verify entries display correctly

**JSON File Check:**
`public/data/stoicism.json` exists with:
```json
{
  "id": "stoicism",
  "tier": "free",
  "entries": [],  // ← EMPTY
  "room_essay": { "en": "...", "vi": "..." }
}
```

**Action:**
- Either delete the JSON file
- Or populate with entries and re-sync

---

## Safe Cleanup Procedure

Follow these steps to safely handle empty rooms:

### Step 1: Verify Current State

Run this query to confirm current entries count:

```sql
SELECT 
  id,
  tier,
  title_en,
  title_vi,
  COALESCE(jsonb_array_length(entries), 0) as entry_count,
  is_locked,
  is_demo
FROM rooms
WHERE id IN ('homepage_v1', 'obesity', 'stoicism');
```

### Step 2: Check JSON Files

Verify these files in `public/data/`:
- [ ] `homepage_v1.json` exists? → delete it
- [ ] `obesity.json` exists? → delete it
- [ ] `stoicism.json` exists? → delete or populate

### Step 3: Choose Action Per Room

| Room | Action | Reason |
|------|--------|--------|
| `homepage_v1` | **DELETE** | System metadata, not a real room |
| `obesity` | **DELETE** | Incomplete/abandoned room |
| `stoicism` | **DELETE** or **COMPLETE** | Has metadata but no entries |

### Step 4: Execute Deletions

**IMPORTANT:** Back up before deleting!

```sql
-- Backup empty rooms
CREATE TABLE IF NOT EXISTS rooms_backup_empty AS
SELECT * FROM rooms WHERE id IN ('homepage_v1', 'obesity', 'stoicism');

-- Delete empty rooms
DELETE FROM rooms WHERE id IN ('homepage_v1', 'obesity', 'stoicism');

-- Verify deletion
SELECT COUNT(*) FROM rooms WHERE id IN ('homepage_v1', 'obesity', 'stoicism');
-- Should return 0
```

### Step 5: Clean Up JSON Files

In GitHub or local repo:
```bash
# Delete JSON files for removed rooms
rm public/data/homepage_v1.json
rm public/data/obesity.json
rm public/data/stoicism.json  # or keep if you plan to complete it

# Commit changes
git add public/data/
git commit -m "Remove empty room JSON files"
git push
```

### Step 6: Verify Room Health

After cleanup:
- [ ] Run Room Health Check
- [ ] Verify 0 rooms with empty entries
- [ ] Check that deleted rooms don't appear in UI
- [ ] Confirm no broken links or 404s

---

## Alternative: Hide Instead of Delete

If you want to keep rooms but hide them from users:

```sql
-- Hide rooms from listings
UPDATE rooms 
SET is_locked = true
WHERE id IN ('homepage_v1', 'obesity', 'stoicism');

-- Or mark as demo/system rooms
UPDATE rooms 
SET is_demo = true, is_locked = true
WHERE id IN ('homepage_v1', 'obesity', 'stoicism');
```

This preserves the data but prevents user access.

---

## Recommended Action Summary

| Room | Action | Priority |
|------|--------|----------|
| `homepage_v1` | **DELETE** | High |
| `obesity` | **DELETE** | Medium |
| `stoicism` | **DELETE** or **COMPLETE** | Medium |

**Rationale for Deletion:**
- Empty rooms create confusion in health checks
- Users cannot interact with rooms that have no entries
- Cleaner database = easier maintenance
- No loss of actual content (these rooms are empty)

**Before Launch:**
- [ ] Execute safe cleanup procedure
- [ ] Verify 0 rooms with empty entries
- [ ] Confirm deletions in Room Health Check

---

## Post-Cleanup Validation

After executing cleanup:

```sql
-- Verify no rooms have 0 entries
SELECT 
  id,
  tier,
  title_en,
  COALESCE(jsonb_array_length(entries), 0) as entry_count
FROM rooms
WHERE COALESCE(jsonb_array_length(entries), 0) = 0;

-- Should return no rows
```

---

**Status:** ⏳ PENDING CLEANUP

**Blocking Launch?** NO (low priority, but recommended)

**Next Action:** Execute safe cleanup procedure and verify
