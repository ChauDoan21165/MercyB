# Kids Room System - Universal VIP Pattern

**IMPORTANT**: Kids rooms now use the EXACT same system as VIP6/ChatHub.  
There is NO separate Kids architecture—Kids is just themed content using the universal pattern.

## How It Works Now

Kids rooms reuse the complete VIP room pattern:
- Same header structure (rainbow title, admin buttons, tier badge)
- Same welcome message ("click the keyword to discover")
- Same `PairedHighlightedContentWithDictionary` for all text
- Same clickable keyword menu (EN / VI pairs)
- Same `AudioPlayer` components
- Same keyword coloring system (`loadRoomKeywords`, `setCustomKeywordMappings`)

**The ONLY differences**:
1. Room colors: `#FFC1E3` (L1), `#A7E6FF` (L2), `#FFD700` (L3)
2. Content: Kid-appropriate topics (alphabet, animals, etc.)
3. Back button: "Back to Kids Area" instead of tier name

## Creating New Kids Rooms

### 1. Create JSON file in `/public/data/`

Example: `/public/data/colors_shapes_kids_l2.json`

```json
{
  "id": "colors_shapes_kids_l2",
  "tier": "Kids Level 2 / Trẻ Em Cấp 2",
  "title": {
    "en": "Colors and Shapes",
    "vi": "Màu Sắc và Hình Khối"
  },
  "content": {
    "en": "Room essay in English...",
    "vi": "Bài viết phòng bằng tiếng Việt...",
    "audio": "colors_shapes_intro_kids_l2.mp3"
  },
  "entries": [
    {
      "slug": "red-circle-game",
      "keywords_en": ["red", "circle", "game"],
      "keywords_vi": ["đỏ", "hình tròn", "trò chơi"],
      "copy": {
        "en": "English content...",
        "vi": "Nội dung tiếng Việt..."
      },
      "tags": ["colors", "shapes"],
      "audio": "colors_shapes_kids_l2_e1_en.mp3",
      "audio_vi": "colors_shapes_kids_l2_e1_vi.mp3"
    }
    // ... 4 more entries + "all" entry
  ],
  "meta": {
    "age_range": "8-11",
    "level": "Kids Level 2",
    "entry_count": 6,
    "room_color": "#A7E6FF"
  }
}
```

### 2. Add audio files to `/public/audio/`

- Introduction: `{room_id}_intro.mp3`
- Entries: `{room_id}_e{n}_en.mp3` and `{room_id}_e{n}_vi.mp3`
- All entry: `{room_id}_all_en.mp3` and `{room_id}_all_vi.mp3`

### 3. Update `KidsRoomViewer.tsx` constant

Change the `roomId` constant to load your new room:

```tsx
const roomId = 'colors_shapes_kids_l2'; // Change this line only
```

That's it! The universal VIP pattern handles everything else.

## Architecture

```
KidsRoomViewer.tsx (built on VIP6 pattern)
├── Navigation (Back + Refresh)
├── Header (Rainbow title + Admin buttons + Badge)
├── Welcome Card
│   ├── Welcome message with "click keyword" guide
│   ├── PairedHighlightedContentWithDictionary (room essay)
│   ├── Clickable keyword buttons (loads keyword colors)
│   └── Introduction AudioPlayer
└── Activities Section
    └── Entry Cards (same structure as VIP entries)
        ├── PairedHighlightedContentWithDictionary
        ├── Keywords display
        └── Dual AudioPlayers (EN + VI)
```

## Standards Reference

Complete universal standards: `/admin/mercy-blade-standards` (★ button)

## No More Custom Components

DO NOT create:
- ❌ Custom Kids layouts
- ❌ Separate Kids contexts
- ❌ Kids-specific hooks
- ❌ Parallel component systems

INSTEAD reuse:
- ✅ VIP room patterns
- ✅ Universal components
- ✅ Shared hooks and utilities

## Future Rooms

VIP7, VIP8, Kids L2, Kids L3, etc. all use this exact same pattern.  
Change only the JSON content—reuse the architecture.
