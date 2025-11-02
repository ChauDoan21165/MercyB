# System Support Files

This directory contains utility files that support the app's functionality but are NOT room data.

## Files

### Dictionary.json
- **Purpose**: Synonym mappings for better keyword matching
- **Usage**: Helps match user queries to room keywords even when they use different terms
- **Structure**: Maps canonical terms to synonyms in EN/VI

### cross_topic_recommendations.json
- **Purpose**: Cross-room navigation and recommendations
- **Usage**: Suggests related rooms when keywords don't match perfectly in current room
- **Structure**: Links keywords to related topics and entries across multiple rooms

## Important
⚠️ These files should NEVER be treated as room data or imported in `roomDataImports.ts`
