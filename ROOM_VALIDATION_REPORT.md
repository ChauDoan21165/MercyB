# Room Data Hygiene Validation Report

Generated following **Mercy Blade Design System v1.1** standards.

## Summary

This report will be populated after running validation checks against room data.

## Validation Rules Applied

### Room-Level Rules

1. **ID Format**: Must be kebab-case, lowercase, pattern `/^[a-z0-9]+(-[a-z0-9]+)*$/`
2. **Tier**: Must be one of the canonical tier values from `TIERS` constant
3. **Entries**: Rooms with 0 entries must be marked as non-public or incomplete
4. **Duplicates**: No duplicate (title_en, tier) combinations

### Entry-Level Rules

1. **keywords_en**: Must have 3-5 items
2. **keywords_vi**: Must have 3-5 items
3. **tags**: Must have 2-4 items
4. **copy.en**: Must have 50-150 words
5. **copy.vi**: Must have 50-150 words
6. **audio**: Must be filename only (no folder path)

## How to Run Validation

To generate a validation report, import and use the validation utilities:

\`\`\`typescript
import { generateValidationReport, logValidationReport } from '@/lib/validation/roomDataHygiene';

// Fetch your room data as RoomJson[]
const rooms = await fetchAllRooms();

// Generate report
const report = generateValidationReport(rooms);

// Log to console
logValidationReport(report);

// Or export as JSON
const jsonReport = exportValidationReportAsJson(report);
console.log(jsonReport);
\`\`\`

## Violations Found

_This section will be populated after validation runs._

---

**Note**: This report is generated automatically by the Room Data Hygiene validation system. Fix all violations before deploying rooms to production.
