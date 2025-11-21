# Mercy Blade Kids Room Standards

This document defines the comprehensive standards for all Kids English rooms in Mercy Blade.

## 🎨 Design Standards

### Colors
- **Level 1 (Little Explorers)**: `#FFC1E3` (Pink)
- **Level 2 (Young Adventurers)**: `#A7E6FF` (Light Blue)  
- **Level 3 (Super Learners)**: `#FFD700` (Gold)

### Typography
All titles and headers use the Mercy Blade rainbow gradient:
```tsx
className="bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent"
```

### Card Styling
- Border width: `4px` for left accent
- Border style: `border-2` for all sides
- Border color: Room level color
- Example: `border-2 style={{ borderLeftColor: roomColor, borderLeftWidth: '4px' }}`

## 🎵 Audio System

### Audio Player
Use the standard `<AudioPlayer>` component with:
- Play/Pause button
- Skip backward/forward (10s)
- Progress bar with time display
- Volume control with mute
- Playback speed control (0.5x - 2x)
- Replay button
- Playlist support for multiple audio files

### Audio File Format
- Place all audio in `/public/audio/` directory
- Format: MP3
- Naming: `room_id_entry_slug_en.mp3` and `room_id_entry_slug_vi.mp3`
- Reference in JSON without `/audio/` prefix (automatically added)

## 📝 Content Structure

### Room JSON Format
```json
{
  "id": "room_id",
  "tier": "Kids Level 1 / Trẻ Em Cấp 1",
  "title": {
    "en": "English Title",
    "vi": "Tiêu Đề Tiếng Việt"
  },
  "content": {
    "en": "Room description in English...",
    "vi": "Mô tả phòng bằng tiếng Việt...",
    "audio": "room_intro.mp3"
  },
  "entries": [
    {
      "slug": "entry-slug",
      "keywords_en": ["keyword1", "keyword2"],
      "keywords_vi": ["từkhóa1", "từkhóa2"],
      "copy": {
        "en": "Entry content in English (~120 words)...",
        "vi": "Nội dung bằng tiếng Việt (đầy đủ dịch)..."
      },
      "tags": ["tag1", "tag2"],
      "audio": "entry_slug_en.mp3",
      "audio_vi": "entry_slug_vi.mp3"
    },
    {
      "slug": "all",
      "keywords_en": ["all", "full", "complete"],
      "keywords_vi": ["tất cả", "toàn bộ", "đầy đủ"],
      "copy": {
        "en": "All entries combined...",
        "vi": "Tất cả nội dung kết hợp..."
      },
      "tags": ["all", "full"],
      "audio": "room_all_en.mp3",
      "audio_vi": "room_all_vi.mp3"
    }
  ],
  "meta": {
    "age_range": "4-7",
    "level": "Kids Level 1",
    "entry_count": 6,
    "room_color": "#FFC1E3"
  }
}
```

### Content Rules
- **5 regular entries** + 1 "all" entry per room
- Each entry: ~120 words English
- Full Vietnamese translation (no summary)
- Keywords: 2-4 per entry (EN + VI)
- Tags: 2-3 descriptive tags
- Audio: Both EN and VI for every entry

## 🎯 UI Components

### Room Header
```tsx
<div>
  <h1 className="bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
    {room.title.en}
  </h1>
  <h2 className="bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
    {room.title.vi}
  </h2>
  <p className="text-muted-foreground">
    {room.tier} • Ages {room.meta.age_range} • {room.meta.entry_count} activities
  </p>
</div>
```

### Navigation Bar
Must include:
- ✅ Back button with arrow (`<ArrowLeft>`)
- ✅ Refresh button for room data (`<RefreshCw>`)
- ✅ Admin copy buttons (room ID, JSON filename) - only for admins

### Room Essay Display
**CRITICAL**: Use `<PairedHighlightedContentWithDictionary>` component (same as VIP rooms) for:
- Side-by-side EN/VI display with proper formatting
- Word hover dictionary functionality
- Interactive word highlighting
- Clickable keywords for audio playback
- Consistent with all other Mercy Blade room tiers

```tsx
<PairedHighlightedContentWithDictionary
  englishContent={roomData.content.en}
  vietnameseContent={roomData.content.vi}
  roomKeywords={roomData.entries.flatMap(e => e.keywords_en)}
  onWordClick={() => {/* trigger audio */}}
/>
```

### Entry Cards
Use the same pattern as room introduction with `PairedHighlightedContentWithDictionary`:

```tsx
<Card className="border-2" style={{ borderLeftColor: roomColor, borderLeftWidth: '4px' }}>
  <CardHeader className="bg-muted/50">
    <CardTitle className="bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
      Activity {index + 1}: {title}
    </CardTitle>
    <div>
      {tags.map(tag => <Badge variant="secondary">{tag}</Badge>)}
    </div>
  </CardHeader>
  <CardContent>
    <PairedHighlightedContentWithDictionary
      englishContent={entry.copy.en}
      vietnameseContent={entry.copy.vi}
      roomKeywords={entry.keywords_en}
      onWordClick={() => {/* trigger audio */}}
    />
    
    <div className="text-sm text-muted-foreground">
      <strong>Keywords:</strong> {keywords_en.join(', ')}
      <strong>Từ khóa:</strong> {keywords_vi.join(', ')}
    </div>
    
    <AudioPlayer audioPath={audio_en} />
    <AudioPlayer audioPath={audio_vi} />
  </CardContent>
</Card>
```

### Message Actions
Integrated within `PairedHighlightedContentWithDictionary` component:
- Copy functionality built into the component
- Word clicking triggers audio playback
- Hover dictionary for vocabulary learning
- Consistent with VIP room patterns

## 🔧 Admin Features

### Admin-Only Buttons
Visible only when `isAdmin === true`:
- 🔵 Room ID copy button (blue circle)
- 🔴 JSON filename copy button (red circle)
- 🐛 Debug mode toggle
- 🔄 Refresh room data

### Admin Tools Access
- Kids Admin button (Pink "K") - Bottom right, above Admin Dashboard button
- Links to `/admin/kids-standardizer`
- One-click standardization of all rooms

### Standardizer Features
- Apply room colors automatically (L1/L2/L3)
- Set rainbow gradients on all titles
- Ensure consistent card styling
- Validate audio file references
- Check bilingual content completeness

## 📱 Responsive Design

### Mobile
- Stack EN/VI content vertically
- Full-width audio player
- Collapsible entry cards
- Touch-friendly buttons (min 44px)

### Desktop
- Side-by-side EN/VI when space allows
- Inline audio controls
- Hover effects on all interactive elements
- Keyboard shortcuts (Space = play/pause, arrows = seek)

## ♿ Accessibility

- All images have `alt` text
- Audio player has keyboard controls
- Color contrast meets WCAG AA
- Focus indicators visible
- ARIA labels on all buttons

## 🚀 Performance

- Lazy load audio files
- Preload metadata only
- Cache audio position in sessionStorage
- Bundle splitting for large files
- Image optimization (WebP with fallback)

## 📦 File Structure

```
src/
├── components/kids/
│   ├── KidsRoomLayout.tsx      # Main layout wrapper
│   ├── KidsRoomContent.tsx     # Entry display
│   ├── KidsRoomViewer.tsx      # Complete room viewer
│   ├── KidsAdminButton.tsx     # Admin tools button
│   └── README.md               # Usage documentation
├── contexts/
│   └── KidsRoomContext.tsx     # State management
├── hooks/
│   └── useKidsRoom.ts          # Data loading hook
└── pages/
    ├── AdminKidsImport.tsx     # JSON import tool
    └── AdminKidsStandardizer.tsx # Auto-standardization

public/
├── data/
│   └── *.json                  # Room data files
└── audio/
    └── *.mp3                   # Audio files
```

## ✅ Quality Checklist

Before publishing a Kids room:
- [ ] All 5 entries + "all" entry present
- [ ] Both EN and VI audio files exist
- [ ] Room color set correctly (L1/L2/L3)
- [ ] Rainbow gradients on all titles
- [ ] Copy buttons work for messages
- [ ] Audio player has all controls
- [ ] Back button navigates correctly
- [ ] Refresh reloads room data
- [ ] Keywords clickable
- [ ] Tags displayed
- [ ] Admin features hidden from users
- [ ] Mobile responsive
- [ ] Accessible (keyboard + screen reader)

## 📚 Related Documentation

- [Main Kids README](./README.md)
- [Audio Player Component](../AudioPlayer.tsx)
- [Message Actions Component](../MessageActions.tsx)
- [Room Loader System](../../lib/roomLoader.ts)
