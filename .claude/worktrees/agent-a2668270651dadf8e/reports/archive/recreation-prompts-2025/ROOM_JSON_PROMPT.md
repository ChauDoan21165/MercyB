# AI Prompt for Generating Room JSON Files

Use this prompt when asking AI to create new room content for your app:

---

## PROMPT TEMPLATE

Create a JSON file for a wellness/self-improvement room with the following **exact structure**:

```json
{
  "name": "Room Name in English",
  "name_vi": "Tên phòng bằng tiếng Việt",
  "description": "Brief description of the room's purpose",
  "keywords_en": ["keyword1", "keyword2", "keyword3"],
  "keywords_vi": ["từ_khóa_1", "từ khóa 2", "từ_khóa_3"],
  "entries": [
    {
      "slug": "unique-entry-id",
      "keywords_en": ["specific", "topic", "keywords"],
      "keywords_vi": ["từ_khóa", "chủ đề", "cụ thể"],
      "copy": {
        "en": "Detailed English content for this entry. This should be 150-300 words of helpful, actionable advice.",
        "vi": "Nội dung tiếng Việt chi tiết cho mục này. Nên có 150-300 từ."
      },
      "tags": ["tag1", "tag2"],
      "audio": "/audio_filename.mp3"
    }
  ],
  "meta": {
    "created_at": "2025-10-27T00:00:00+00:00",
    "updated_at": "2025-10-27T00:00:00+00:00",
    "entry_count": 1,
    "tier": "free",
    "room_color": "#4A90E2"
  }
}
```

## CRITICAL REQUIREMENTS

1. **Top-Level Keywords (REQUIRED)**:
   - `keywords_en`: Array of English keywords
   - `keywords_vi`: Array of Vietnamese keywords
   - MUST have both, even if Vietnamese duplicates English

2. **Room Names (REQUIRED)**:
   - `name`: English room name
   - `name_vi`: Vietnamese room name

3. **Audio Field Format**:
   - Simple string: `"audio": "/filename.mp3"` OR `"audio": "filename.mp3"`
   - Object format: `"audio": { "en": "/filename.mp3" }`
   - Always start with `/` or just filename (no subfolders like `/audio/en/`)

4. **Entry Keywords**:
   - Each entry MUST have `keywords_en` and `keywords_vi` arrays
   - These can differ from top-level keywords

5. **Content Field**:
   - Use `copy` object with `en` and `vi` properties
   - Alternatives: `reply_en`/`reply_vi`, `essay`, `content`, `body`
   - Vietnamese content is REQUIRED

6. **Slug/ID**:
   - Each entry needs a unique `slug` field
   - Use kebab-case (lowercase-with-hyphens)

## EXAMPLE FOR TIER VARIATIONS

**Free tier**: Basic content, 3-6 entries
**VIP1**: Intermediate depth, 4-8 entries  
**VIP2**: Advanced content, 6-10 entries
**VIP3**: Expert level, 8-12 entries

## NAMING CONVENTIONS

Files should be named:
- `roomname_free.json`
- `roomname_vip1.json`
- `roomname_vip2.json`
- `roomname_vip3.json`

Audio files should match the pattern:
- `{topic}_{tier}.mp3`
- Example: `stress_management_vip1.mp3`

## VALIDATION CHECKLIST

Before generating, ensure:
- ✅ `keywords_en` exists at top level with at least 3-5 keywords
- ✅ `keywords_vi` exists at top level with at least 3-5 keywords
- ✅ `name` and `name_vi` are both present
- ✅ Every entry has `keywords_en` and `keywords_vi` arrays
- ✅ Every entry has content in both English and Vietnamese
- ✅ Audio paths start with `/` or are plain filenames
- ✅ All slugs are unique within the file
- ✅ `meta` object includes tier and entry_count

## TOPIC SUGGESTIONS

Generate content for topics like:
- Mental health & wellness
- Physical fitness & nutrition
- Relationships & communication
- Career & productivity
- Spirituality & mindfulness
- Personal growth & confidence
- Stress management
- Sleep improvement
- Financial wellness
- Creative expression

---

## HOW TO USE THIS PROMPT

1. Copy everything from "Create a JSON file..." onwards
2. Replace the topic/theme with your specific need
3. Specify the tier level (free/vip1/vip2/vip3)
4. Ask AI to generate 4-8 entries with real, helpful content
5. Validate the output against the checklist above

## EXAMPLE REQUEST

"Using the structure above, create a VIP2 JSON file for a room about 'Time Management Mastery'. Include 6 entries covering topics like prioritization, calendar blocking, saying no, delegation, batch processing, and energy management. Each entry should have 200-250 words of actionable advice in both English and Vietnamese."
