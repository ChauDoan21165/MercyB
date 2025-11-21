# Mercy Blade Universal Room Standard

**CRITICAL**: Kids rooms now use the EXACT same system as VIP6/ChatHub.  
There is NO separate Kids layout—Kids is just a themed variation of the universal room pattern.

## Universal Pattern (Used by ALL rooms: VIP1-6, Kids)

### Component Reuse
Kids rooms reuse these exact components:
- `PairedHighlightedContentWithDictionary` - For all text display
- `AudioPlayer` - For all audio playback
- `loadRoomKeywords()` / `setCustomKeywordMappings()` - For keyword coloring
- Same header structure, admin buttons, keyword menu as VIP rooms

### Structure (Identical Across All Rooms)

```tsx
// 1. Navigation Bar
<Button variant="ghost" onClick={handleBack}>
  <ArrowLeft /> Back to {Area}
</Button>
{isAdmin && <Button onClick={refresh}><RefreshCw /> Refresh</Button>}

// 2. Room Header
<div className="flex items-center gap-3">
  {isAdmin && (
    <>
      <button /* JSON filename */ className="w-[1em] h-[1em] rounded-full bg-primary" />
      <button /* Room ID */ className="w-[1em] h-[1em] rounded-full bg-blue-600" />
    </>
  )}
  <h2 style={{ background: 'var(--gradient-rainbow)', WebkitBackgroundClip: 'text', ... }}>
    {title.en === title.vi ? title.en : `${title.en} / ${title.vi}`}
  </h2>
  <Badge>{tier}</Badge>
</div>

// 3. Welcome + Essay + Keywords Card
<Card className="p-4 shadow-soft bg-card border border-border">
  {/* Welcome message */}
  <p className="text-sm text-foreground leading-tight">
    Welcome to {room.title.en} Room, please click the keyword of the topic you want to discover / 
    Chào mừng bạn đến với phòng {room.title.vi}, vui lòng nhấp vào từ khóa của chủ đề bạn muốn khám phá
  </p>

  {/* Room Essay with Dictionary */}
  <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border/50">
    <PairedHighlightedContentWithDictionary
      englishContent={room.content.en}
      vietnameseContent={room.content.vi}
      roomKeywords={keywordMenu.en}
      onWordClick={() => handleAudioToggle(room.content.audio)}
    />
  </div>

  {/* Clickable Keyword Menu */}
  <div className="flex flex-wrap gap-2 justify-center">
    {keywordMenu.en.map((kw, idx) => (
      <Button
        variant={clicked === kw ? "default" : "outline"}
        size="sm"
        onClick={() => handleKeywordClick(kw)}
      >
        {isAdmin && <span /* audio copy button */ />}
        {kw} / {keywordMenu.vi[idx]}
      </Button>
    ))}
  </div>

  {/* Introduction Audio */}
  <AudioPlayer audioPath={`/audio/${room.content.audio}`} {...audioProps} />
</Card>

// 4. Activities/Entries Section
{entries.filter(e => e.slug !== 'all').map((entry, idx) => (
  <Card 
    className="border-2" 
    style={{ borderLeftColor: room.meta.room_color, borderLeftWidth: '4px' }}
  >
    <div className="bg-muted/50 p-4">
      <h3 className="bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
        Activity {idx + 1}: {entry.title}
      </h3>
      {entry.tags.map(tag => <Badge variant="secondary">{tag}</Badge>)}
    </div>
    
    <div className="p-6">
      <PairedHighlightedContentWithDictionary
        englishContent={entry.copy.en}
        vietnameseContent={entry.copy.vi}
        roomKeywords={entry.keywords_en}
        onWordClick={() => handleAudioToggle(entry.audio)}
      />
      
      <div className="text-sm text-muted-foreground">
        <strong>Keywords:</strong> {entry.keywords_en.join(', ')}
        <strong>Từ khóa:</strong> {entry.keywords_vi.join(', ')}
      </div>
      
      <AudioPlayer audioPath={`/audio/${entry.audio}`} />
      <AudioPlayer audioPath={`/audio/${entry.audio_vi}`} />
    </div>
  </Card>
))}
```

## Kids-Specific Only

The ONLY differences for Kids:
1. **Room colors**: `#FFC1E3` (L1), `#A7E6FF` (L2), `#FFD700` (L3)
2. **Content focus**: Age-appropriate topics (alphabet, animals, etc.)
3. **Back button text**: "Back to Kids Area" instead of tier name

Everything else is IDENTICAL to VIP rooms.

## Implementation Rule

**When building any new Kids room:**
1. Create JSON file in `/public/data/` with room content
2. Reuse `KidsRoomViewer.tsx` (which is built on VIP pattern)
3. Change only the `roomId` constant to load different content
4. DO NOT create custom layout components—reuse the universal pattern

## Future-Proof Standard

From now on:
- VIP7, VIP8, etc. → Use this exact same pattern
- Kids Level 2, 3, etc. → Use this exact same pattern  
- Any new room tier → Use this exact same pattern

If you find yourself creating "custom Kids layout" or "special VIP layout", STOP and reuse the universal pattern instead.


## Standard Recorded: `/admin/mercy-blade-standards`

The complete universal room standard is now documented at `/admin/mercy-blade-standards` (★ button).

**Key principle**: Kids rooms are NOT a separate system—they're just VIP rooms with kid-themed content.

### What Changed

**Deleted** (old, drifting custom Kids code):
- `KidsRoomLayout.tsx` - Custom layout that kept diverging from VIP
- `KidsRoomContent.tsx` - Separate entry display logic  
- `KidsRoomViewer.tsx` - Old viewer with parallel patterns
- `KidsRoomContext.tsx` - Separate state management
- `useKidsRoom.ts` - Custom hook

**Created** (new, VIP-based code):
- `KidsRoomViewer.tsx` - Built directly on VIP6/ChatHub pattern
  - Reuses same header, essay, keyword menu, audio logic
  - Only difference: loads Kids JSON, uses Kids colors
  - NO separate layout patterns

### Universal Pattern (Used by ALL Rooms)

```tsx
1. Navigation: Back button + Refresh (admin)
2. Header: Rainbow title + admin buttons + tier badge
3. Welcome Card:
   - "Click keyword to discover" message
   - PairedHighlightedContentWithDictionary essay
   - Clickable keyword buttons (EN / VI pairs)
   - Introduction AudioPlayer
4. Activities: Entry cards with dictionary, keywords, dual audio
```

### How to Build Future Rooms

**VIP 7, 8, 9... or Kids Level 2, 3, 4...**

1. Create JSON in `/public/data/{room_id}.json`
2. Add audio files to `/public/audio/`
3. For VIP: Add route pointing to ChatHub with room ID
4. For Kids: Change `roomId` constant in `KidsRoomViewer.tsx`

NO new layout components needed—reuse the universal pattern.

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
