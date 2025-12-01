# Strict Room Loading - No Rescue Logic

## Summary

All emergency/rescue/fallback logic has been removed from VIP room loading. The system now uses **strict exact tier matching** based on canonical tier labels from `TIER_ID_TO_LABEL`.

## Changes Made

### 1. Replaced `useEmergencyVipRooms` with `useVipRooms`

**Before (Emergency):**
- Fetched rooms with fuzzy tier matching
- Had fallback logic to JSON files
- Used "emergency" naming suggesting temporary fix

**After (Strict):**
```typescript
// Simple, predictable contract:
// DB tier MUST exactly match TIER_ID_TO_LABEL[tierId]
const { data: rooms } = useVipRooms('vip1');
```

### 2. Database Query is Now Strict

```typescript
// ONLY acceptable tier value for VIP1:
.eq('tier', 'VIP1 / VIP1')  // exact match only

// ONLY acceptable tier value for VIP9:
.eq('tier', 'VIP9 / Cấp VIP9')  // exact match only
```

**No fuzzy matching. No case conversion. No normalization at query time.**

### 3. Updated All VIP Grid Pages

All pages now use strict loader:
- `src/pages/RoomGridVIP1.tsx` → `useVipRooms('vip1')`
- `src/pages/RoomGridVIP2.tsx` → `useVipRooms('vip2')`
- `src/pages/RoomGridVIP3.tsx` → `useVipRooms('vip3')`
- `src/pages/RoomGridVIP3II.tsx` → `useVipRooms('vip3ii')`
- `src/pages/RoomGridVIP4.tsx` → `useVipRooms('vip4')`
- `src/pages/RoomGridVIP5.tsx` → `useVipRooms('vip5')`
- `src/pages/RoomGridVIP6.tsx` → `useVipRooms('vip6')`
- `src/pages/RoomsVIP9.tsx` → `useVipRooms('vip9')`

## If Rooms Are Missing

**Do NOT add guessing logic to the loader.**

Instead, follow this checklist:

1. **Run the tier audit:**
   ```bash
   npx tsx scripts/audit-db-tiers.ts
   ```

2. **Check the output** - it will show rooms with non-canonical tier values:
   ```
   Room: some_room_vip2
     Current: "VIP2"
     Expected: "VIP2 / VIP2"
   ```

3. **Fix in Supabase UI:**
   - Open Lovable Cloud → Database
   - Find the room by ID
   - Set `tier` to exactly the Expected value
   - Save

4. **Verify the fix:**
   - Re-run audit script
   - Check the tier page in preview

## Benefits of Strict Loading

✅ **Predictable**: Room appears ⟺ DB tier exactly matches canonical label  
✅ **Debuggable**: Missing room? Check DB tier value (not 20 layers of fallback)  
✅ **Maintainable**: One query, one rule, zero guessing  
✅ **CI-friendly**: Validation scripts catch bad data before deploy  

## No More Emergency Mode

The "emergency" concept implied:
- Temporary workaround
- Data is messy, loader compensates
- Obscures root cause

Strict mode means:
- Data correctness is enforced
- Loader trusts the data
- Problems surface early (in CI, not production)

## Related Tools

- **Tier Audit**: `scripts/audit-db-tiers.ts` - finds non-canonical tier values
- **CI Validation**: `scripts/validate-rooms-ci.js` - validates JSON structure
- **Link Validation**: `scripts/validate-room-links.js` - checks for broken refs
- **JSON Resolver**: `src/lib/roomJsonResolver.ts` - strict path resolution

## Architecture Rule

**VIP grids show correct rooms because data is correct, not because loaders guess.**

If a room doesn't appear, the data is wrong. Fix the data.
