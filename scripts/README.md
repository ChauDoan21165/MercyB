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
