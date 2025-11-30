# Room Health Summary API

## Endpoint
Edge Function: `room-health-summary`

## Authentication
Requires JWT: `verify_jwt = true`

## Request Methods
- **POST**: Pass parameters in request body
- **GET**: Pass parameters as query params

## Request Parameters
```typescript
{
  tier?: string;  // Optional. Filter by specific tier (e.g., "vip5", "free")
  mode?: string;  // Optional. Reserved for future use
}
```

## Response Structure

```typescript
{
  global: {
    total_rooms: number;          // Total rooms across all tiers
    rooms_zero_audio: number;     // Rooms with 0% audio coverage
    rooms_low_health: number;     // Rooms with health score < 50
    rooms_missing_json: number;   // Rooms with missing or invalid raw_json
  };
  
  byTier: {
    [tier: string]: {             // Keyed by lowercase tier name
      total_rooms: number;
      rooms_zero_audio: number;
      rooms_low_health: number;
      rooms_missing_json: number;
    };
  };
  
  vip_track_gaps: Array<{
    tier: string;                 // Tier ID (e.g., "vip5")
    title: string;                // Display title (e.g., "VIP5")
    total_rooms: number;          // Should be 0 if gap detected
    min_required: number;         // Minimum rooms expected (usually 1)
    issue: string;                // Issue description (e.g., "no_rooms_found")
  }>;
  
  tier_counts: Record<string, number>;  // Total room count per tier
}
```

## Missing JSON Detection

Rooms are classified as having missing JSON if:
1. `raw_json` is NULL, or
2. `raw_json` exists but has no `entries` array, or
3. `raw_json.entries` is an empty array

## Health Metrics Source

- Audio coverage and health scores come from `room_health_view` database view
- JSON validation uses `rooms.raw_json` column directly
- Tier counts aggregate from `rooms.tier` column

## Example Usage

### Frontend (React/TypeScript)
```typescript
const { data, error } = await supabase.functions.invoke('room-health-summary', {
  body: { tier: 'vip5' }  // Optional: filter by tier
});

if (error) {
  console.error('Failed to fetch health summary:', error);
  return;
}

// Access global metrics
console.log(`Total rooms: ${data.global.total_rooms}`);
console.log(`Rooms with 0% audio: ${data.global.rooms_zero_audio}`);

// Access tier-specific metrics (with null guards)
const vip5Data = data.byTier?.vip5;
if (vip5Data) {
  console.log(`VIP5 total rooms: ${vip5Data.total_rooms}`);
  console.log(`VIP5 missing JSON: ${vip5Data.rooms_missing_json}`);
} else {
  console.log('No data available for VIP5 tier');
}

// Check VIP track gaps
if (data.vip_track_gaps.length > 0) {
  console.log('VIP tiers with 0 rooms:', data.vip_track_gaps);
}
```

### No Tier Filter (All Tiers)
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/room-health-summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### With Tier Filter
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/room-health-summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tier":"vip5"}'
```

## Error Handling

The function returns a 500 error with JSON body on failure:
```json
{
  "error": "Error message describing what went wrong"
}
```

## Frontend Safety Guidelines

1. **Always check for null/undefined before accessing nested properties:**
   ```typescript
   const tierData = data.byTier?.[selectedTier.toLowerCase()];
   const roomCount = tierData?.total_rooms ?? 0;
   ```

2. **Use optional chaining and nullish coalescing:**
   ```typescript
   healthSummary?.global?.total_rooms ?? 0
   ```

3. **Guard array access:**
   ```typescript
   if (data.vip_track_gaps && data.vip_track_gaps.length > 0) {
     // Safe to map
   }
   ```

4. **Display fallback messages for missing tier data:**
   ```typescript
   if (!data.byTier[selectedTier]) {
     return <p>No data available for this tier yet</p>;
   }
   ```

5. **Never crash on missing tier keys—show graceful messages instead**

## Validation Rules

- Tier names are normalized to lowercase before processing
- VIP tier gaps only check VIP1-VIP9 (not kids or free tiers)
- Missing JSON includes both NULL and structurally invalid JSON
- Health metrics use the existing `room_health_view` calculations
