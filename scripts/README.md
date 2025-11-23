# Room Analysis Scripts

## Generate Cross-Topic Recommendations

This script analyzes all 62 room files and automatically generates intelligent cross-room keyword mappings.

### What it does:
1. **Extracts keywords** from all room JSON files
2. **Finds overlaps** - discovers which keywords appear across multiple rooms
3. **Builds relationships** - creates a map showing related rooms for each keyword
4. **Generates recommendations** - outputs `cross_topic_recommendations.json` with smart room suggestions

### How to run:

```bash
# Using tsx (recommended)
npx tsx scripts/generate-cross-topic-recommendations.ts

# Or using node with TypeScript support
node --loader ts-node/esm scripts/generate-cross-topic-recommendations.ts
```

### Output:
- File: `src/data/system/cross_topic_recommendations.json`
- Contains: Keyword → Related Rooms mapping
- Used by: `keywordResponder.ts` to suggest related rooms to users

### Example output:
```json
{
  "keyword": "stress",
  "rooms": [
    {
      "roomId": "mental-health",
      "roomNameEn": "Mental Health",
      "roomNameVi": "Sức khỏe tâm thần",
      "relevance": "primary",
      "matchedTerms": ["stress", "anxiety", "mental_stress"]
    },
    {
      "roomId": "burnout",
      "roomNameEn": "Burnout",
      "roomNameVi": "Kiệt sức",
      "relevance": "primary",
      "matchedTerms": ["work_stress", "chronic_stress"]
    }
  ]
}
```

## Validate Room Integrity

Checks all room files for data quality and completeness.

```bash
npx tsx scripts/validate-room-integrity.ts
```

### What it checks:
- JSON syntax validity
- Required fields presence
- Bilingual content (EN/VI)
- Keyword completeness
- Entry structure
- Import/export consistency

## Room Health Check & Repair Scripts

### Validate Rooms (`validate-rooms.js`)

Comprehensive validation for Free and VIP tier rooms.

```bash
# Check all tiers
node scripts/validate-rooms.js

# Check specific tier
node scripts/validate-rooms.js free
node scripts/validate-rooms.js vip1
```

#### Features:
- ✅ Detects files with invalid characters
- ✅ Checks for missing JSON files
- ✅ **Detects HTML responses (404 pages) instead of JSON**
- ✅ Validates JSON syntax
- ✅ Checks for empty entries
- ✅ Validates audio file paths
- ✅ Identifies locked rooms
- ✅ Can run for specific tiers or all tiers

### Repair Rooms (`repair-rooms.js`)

Automatically repairs common JSON syntax errors.

```bash
# Repair all rooms
node scripts/repair-rooms.js

# Repair specific tier
node scripts/repair-rooms.js vip2
```

#### Features:
- ✅ **Detects and skips HTML files (missing files)**
- ✅ Auto-detects all room JSON files
- ✅ Removes BOM (Byte Order Mark)
- ✅ Fixes trailing commas
- ✅ Fixes missing commas between properties
- ✅ Fixes unescaped quotes in strings
- ✅ Validates required fields (`id`, `tier`, `title`, `content`, `entries`, `meta`)
- ✅ Validates bilingual structure (en/vi)
- ✅ Reformats with proper indentation

### Web-Based Repair

Both room health checks also include web-based repair buttons:
- Navigate to `/admin/health-dashboard`
- Click on any tier to view issues
- Click the download/repair button on fixable issues
- The system will attempt to repair and download the fixed JSON file
