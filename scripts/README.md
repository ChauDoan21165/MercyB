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

## Room Validation & Repair Scripts

This directory contains Node.js scripts for validating and repairing room JSON files across all tiers.

### Kids Rooms

#### `validate-kids-rooms.js`
Validates all kids room JSON files and database entries.

```bash
node scripts/validate-kids-rooms.js
```

#### `repair-kids-json.js`
Automatically repairs common JSON syntax errors in kids room files.

```bash
# Repair all kids room files
node scripts/repair-kids-json.js
```

### Main Tiers (Free, VIP1-7)

#### `validate-rooms.js`
Validates room JSON files and database entries for main tiers.

```bash
# Validate all tiers
node scripts/validate-rooms.js

# Validate specific tier
node scripts/validate-rooms.js free
node scripts/validate-rooms.js vip1
```

#### `repair-rooms.js`
Automatically repairs common JSON syntax errors in room files.

```bash
# Repair all room files
node scripts/repair-rooms.js

# Repair specific tier
node scripts/repair-rooms.js vip3
```

### Common JSON Errors Fixed

The repair scripts automatically fix:

- **BOM (Byte Order Mark)**: Removes invisible Unicode characters
- **Trailing commas**: Removes commas before closing brackets/braces
- **Missing commas**: Adds commas between object properties
- **Unescaped quotes**: Escapes quotes inside string values
- **Comments**: Removes // comments (not valid in JSON)
- **Single quotes**: Converts single quotes to double quotes

### Web-Based Repair

Both validation systems also have web interfaces:

- **Kids Rooms**: `/admin/kids-room-health`
- **Main Tiers**: `/admin/health-dashboard`

The web interfaces allow you to:
1. Run health checks
2. Download repaired JSON files with one click
3. View detailed error messages
4. See changes made during repair

### Workflow

1. **Run validation**: Identifies issues in room files
2. **Repair files**: Uses repair scripts or web interface
3. **Download repaired**: Get the fixed JSON file
4. **Replace original**: Update the file in `/public/data/`
5. **Re-validate**: Confirm the fix worked
