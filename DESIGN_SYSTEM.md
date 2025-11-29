# Mercy Blade Design System

**Version:** 1.1  
**Last Updated:** 2025-11-30  
**Purpose:** Enforce visual consistency, semantic token usage, and predictable component patterns across all Mercy Blade pages.

---

## Core Principles

1. **Semantic tokens only** — No hex colors, no Tailwind utility colors (text-white, bg-blue-500, etc.)
2. **Consistent grid layouts** — All room cards use the same responsive grid pattern
3. **Bilingual by default** — English first, Vietnamese second, max 2 lines per card
4. **JSON-driven content** — Never hardcode essays or audio; always consume from database/JSON
5. **Copy-paste-ability** — Each section includes a canonical example to copy

---

## 1. Color Tokens & Gradients

### Rule

All solid colors must be defined as HSL semantic tokens in `index.css` and used via `hsl(var(--token-name))`. All gradients must be defined as `--gradient-*` tokens and used via `var(--gradient-*)`. Components must never inline `linear-gradient(...)`.

**Allowed:** Semantic Tailwind utilities (`text-foreground`, `bg-background`, `text-muted-foreground`).  
**Forbidden:** Raw Tailwind palette (`bg-blue-500`, `text-gray-700`), hex colors in components, inline gradients.

### Contract

```css
/* index.css */
:root {
  /* Page backgrounds */
  --page-kids-bg: 210 100% 95%;
  --page-vip1-bg: 280 60% 96%;
  --page-vip2-bg: 200 65% 95%;
  --page-vip3-bg: 330 55% 96%;
  --page-vip3ii-bg: 260 50% 94%;
  --page-vip4-bg: 180 50% 96%;
  --page-vip5-bg: 40 70% 96%;
  --page-vip6-bg: 300 45% 95%;
  --page-vip9-bg: 220 15% 18%;

  /* Kids level colors */
  --kids-l1: 200 100% 85%;
  --kids-l2: 280 80% 85%;
  --kids-l3: 160 75% 85%;

  /* VIP badge and locked state */
  --vip-badge: 280 60% 50%;
  --vip-locked: 0 0% 70%;

  /* Gradients */
  --gradient-rainbow: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
  --gradient-kids-hero: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  --gradient-vip-hero: linear-gradient(135deg, #f093fb 0%, #4facfe 50%, #00f2fe 100%);
}

/* Dark mode variants */
.dark {
  --page-kids-bg: 210 20% 12%;
  --page-vip1-bg: 280 15% 10%;
  --page-vip2-bg: 200 20% 12%;
  --page-vip3-bg: 330 15% 10%;
  --page-vip3ii-bg: 260 15% 12%;
  --page-vip4-bg: 180 15% 12%;
  --page-vip5-bg: 40 20% 10%;
  --page-vip6-bg: 300 15% 10%;
  --page-vip9-bg: 220 10% 8%;

  --gradient-kids-hero: linear-gradient(135deg, #4c5fd7 0%, #5a3d7a 50%, #b656d9 100%);
  --gradient-vip-hero: linear-gradient(135deg, #b656d9 0%, #3a8bd3 50%, #00b8c4 100%);
}
```

**Dark Mode Testing:**
- [ ] Test kids and VIP hero gradients in dark mode on a real device
- [ ] Verify page backgrounds readable in dark mode
- [ ] Check text contrast meets WCAG AA in both modes

### Example

```tsx
// Page background
<div 
  className="min-h-screen"
  style={{ background: 'hsl(var(--page-vip3-bg))' }}
>

// Button with gradient
<Button
  className="rounded-full text-foreground"
  style={{ background: 'var(--gradient-kids-hero)' }}
>
  Start Learning / Bắt đầu học
</Button>

// Icon with semantic color
<Star className="h-10 w-10 text-foreground" />
```

---

## 2. Room Card Grid Pattern

### Rule

All room listings (Kids + VIP) must use the canonical grid layout. Do not change column counts or gaps per breakpoint. Pages must not create custom grids; the grid class lives inside `KidsRoomGrid` or `VipRoomGrid`.

### Contract / API

```tsx
// Canonical grid class (MUST NOT CHANGE)
const ROOM_GRID_CLASS =
  "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4";

interface KidsRoomGridProps {
  rooms: KidsRoom[];
  onRoomClick: (room: KidsRoom) => void;
}

interface VipRoomGridProps {
  rooms: VipRoom[];
  onRoomClick: (room: VipRoom) => void;
}
```

**Performance:** If `rooms.length > 50`, apply virtualization or `loading="lazy"` on images.

### Example

```tsx
// Kids
<KidsRoomGrid
  rooms={rooms}
  onRoomClick={(room) => navigate(`/kids-chat/${room.id}`)}
/>

// VIP
<VipRoomGrid
  rooms={rooms}
  onRoomClick={(room) => navigate(`/room/${room.id}`)}
/>
```

---

## 3. Kids Room Card (KidsRoomCard)

### Rule

All Kids rooms must be rendered using `KidsRoomCard`. Pages must not override its layout or typography.

### Contract / API

```tsx
interface KidsRoom {
  id: string;
  title_en: string;
  title_vi: string;
  tier: "kids_level1" | "kids_level2" | "kids_level3";
  icon: string | null;
}

interface KidsRoomCardProps {
  room: KidsRoom;
  index: number;
  onClick: () => void;
}
```

### Example

```tsx
<KidsRoomCard
  room={room}
  index={index}
  onClick={() => navigate(`/kids-chat/${room.id}`)}
/>
```

---

## 4. VIP Room Pattern (Canonical Template)

### Rule

All VIP tier listing pages must be clones of the canonical VIP template. Only tier-specific text, filter, and background token may change. Do not change the grid layout, card component, routing pattern, or data loading pattern without updating this design system.

**Canonical template:** `src/pages/vip/VipTier1Rooms.tsx`

### Contract / API

```tsx
interface VipRoom {
  id: string;
  tier_id: "vip1" | "vip2" | "vip3" | "vip3ii" | "vip4" | "vip5" | "vip6" | "vip9";
  title_en: string;
  title_vi: string;
}

interface VipTierPageProps {
  tierId: VipRoom["tier_id"];
}
```

**Required components:**
- Must use `VipRoomCard`
- Must use `ROOM_GRID_CLASS`
- Must fetch via Supabase filtered by `tier_id`

### Example

```tsx
// src/pages/vip/VipTier3Rooms.tsx
export default function VipTier3Rooms() {
  const { data: rooms } = useQuery({
    queryKey: ['vip3-rooms'],
    queryFn: async () => {
      const { data } = await supabase
        .from('rooms')
        .select('*')
        .eq('tier_id', 'vip3')
        .order('display_order');
      return data;
    }
  });

  return (
    <div style={{ background: 'hsl(var(--page-vip3-bg))' }}>
      <div style={{ background: 'var(--gradient-vip-hero)' }}>
        <h1>VIP3 — Advanced English</h1>
      </div>
      <VipRoomGrid rooms={rooms} onRoomClick={...} />
    </div>
  );
}
```

---

## 5. Room Data Source of Truth

### Rule

All rooms (Kids + VIP) must use the Mercy Blade JSON Generator / `rooms` table schema. UI must never hardcode essays, audio filenames, or entry content.

### Contract / API

```tsx
interface RoomEntry {
  slug: string;               // kebab-case, unique within room
  keywords_en: string[];      // 3–5
  keywords_vi: string[];      // 3–5
  copy: {
    en: string;               // 50–150 words
    vi: string;               // 50–150 words
  };
  tags: string[];             // 2–4 tags
  audio: string;              // "meaning_of_life_vip3_01_en.mp3"
}

interface RoomJson {
  tier: string;               // e.g. "VIP3 / VIP3"
  title: { en: string; vi: string };
  content: { en: string; vi: string; audio?: string };
  entries: RoomEntry[];
}
```

**UI must consume:**
- `room.entries[].copy.en` / `room.entries[].copy.vi`
- `room.entries[].audio`
- `room.room_essay_en` / `room.room_essay_vi`

### Example

```tsx
// ✅ CORRECT
<PairedHighlightedContent
  englishContent={room.room_essay_en}
  vietnameseContent={room.room_essay_vi}
/>
```

---

## 6. Routing Conventions

### Rule

All routes must follow these patterns only: `/kids-chat/:roomId`, `/room/:roomId`, `/vip/:tier`.

### Contract

| Tier | Route Pattern | Example |
|------|---------------|---------|
| Kids | `/kids-chat/:roomId` | `/kids-chat/alphabet-sounds-kids-l1` |
| Adult Free/VIP | `/room/:roomId` | `/room/nutrition-vip2` |
| VIP Tier Listing | `/vip/:tier` | `/vip/vip3` |

### Example

```tsx
// Kids
navigate(`/kids-chat/${room.id}`);

// Adult/VIP room
navigate(`/room/${room.id}`);

// VIP tier listing
<Link to="/vip/vip3">VIP3 Rooms</Link>
```

---

## 7. Bilingual Text Pattern

### Rule

Card titles must use a single line with `English / Vietnamese` and `line-clamp-2`. We do not separate into two physical lines with stacked `<p>` tags.

### Contract

- Display English first, Vietnamese second
- Use `line-clamp-2` for combined title
- Separator: ` / ` (space-slash-space)
- Max 2 lines total in cards

### Example

```tsx
<h3 className="font-bold text-sm line-clamp-2">
  {room.title_en} / {room.title_vi}
</h3>

// Gradient title bar
<div style={{ background: 'var(--gradient-rainbow)' }}>
  <h4 className="font-bold text-foreground text-xs line-clamp-2">
    {room.title_en} / {room.title_vi}
  </h4>
</div>
```

---

## 8. Animation Standards

### Rule

All room cards use staggered fade-in animations based on index.

### Contract

```tsx
// Staggered animation pattern
className="animate-fade-in cursor-pointer hover:scale-105 transition-all duration-300"
style={{ animationDelay: `${index * 0.05}s` }}
```

**Parameters:**
- Base delay: `0.05s` per card
- Index multiplier: `index * 0.05s`
- Hover: `scale-105` with `duration-300`

### Example

```tsx
{rooms.map((room, index) => (
  <Card
    key={room.id}
    className="animate-fade-in cursor-pointer hover:scale-105 transition-all duration-300"
    style={{ animationDelay: `${index * 0.05}s` }}
    onClick={() => navigate(`/room/${room.id}`)}
  >
    {/* Card content */}
  </Card>
))}
```

---

## 9. Constants & Magic Strings

### Rule

All shared literals (table names, level IDs, route prefixes) must come from constants files, not inline strings.

### Contract

```ts
// src/lib/constants/kids.ts
export const KIDS_TABLE = 'kids_rooms';
export const KIDS_ROUTE_PREFIX = '/kids-chat';
export const LEVEL_IDS = ['level1', 'level2', 'level3'] as const;

// src/lib/constants/rooms.ts
export const ROOMS_TABLE = 'rooms';
export const ADULT_ROUTE_PREFIX = '/room';
```

### Example

```tsx
import { KIDS_TABLE, KIDS_ROUTE_PREFIX, LEVEL_IDS } from '@/lib/constants/kids';

const { data } = await supabase
  .from(KIDS_TABLE)
  .select('*')
  .eq('level_id', LEVEL_IDS[0]);

navigate(`${KIDS_ROUTE_PREFIX}/${room.id}`);
```

---

## 10. Data Hooks & Types

### Rule

All Kids level pages must use `useKidsRooms(levelId)`; no inline Supabase queries in pages.

### Contract

```tsx
type KidsLevelId = "level1" | "level2" | "level3";

interface UseKidsRoomsResult {
  rooms: KidsRoom[];
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

declare function useKidsRooms(levelId: KidsLevelId): UseKidsRoomsResult;
```

### Example

```tsx
const { rooms, loading, error, refresh } = useKidsRooms("level1");

if (loading) return <LoadingSpinner />;

return <KidsRoomGrid rooms={rooms} onRoomClick={...} />;
```

---

## 11. Bilingual Entry Component

### Rule

Entry pages must use `BilingualEntryWithAudio` to enforce EN/VI order and audio position. Pages must not hand-roll the order of EN/VI text and audio.

### Contract

```tsx
interface BilingualEntryWithAudioProps {
  entry: {
    copy: { en: string; vi: string };
    audio: string;
  };
}
```

Component must render: (1) `entry.copy.en`, (2) `entry.copy.vi`, (3) Audio player using `entry.audio`.

### Example

```tsx
<BilingualEntryWithAudio entry={entry} />
```

---

## 12. Types & Supabase

### Rule

All room types must come from generated Supabase type file, not manual interfaces.

### Contract

```tsx
// types/supabase.ts (generated via `npx supabase gen types typescript`)
export type KidsRoom = Database['public']['Tables']['kids_rooms']['Row'];
export type VipRoom = Database['public']['Tables']['rooms']['Row'];
```

### Example

```tsx
import type { KidsRoom } from '@/types/supabase';
const rooms: KidsRoom[] = await fetchKidsRooms();
```

---

## 13. Accessibility

### Rule

All non-text buttons must have `aria-label`; decorative icons must use `aria-hidden="true"`.

### Contract

- Interactive icon without text → `aria-label`
- Decorative icon → `aria-hidden="true"`

### Example

```tsx
<Button aria-label="Refresh rooms" onClick={handleRefresh}>
  <RefreshCw className="w-4 h-4" aria-hidden="true" />
</Button>
```

---

## 14. Performance

### Rule

Any level with >50 rooms must apply lazy-loading or virtualization.

### Contract

```tsx
if (rooms.length > 50) {
  // Use virtualised list OR lazy-loading
}
```

### Example

```tsx
<img src={room.image} loading="lazy" alt={room.title_en} />
```

---

## 15. Component Checklist

Before shipping any new Kids or VIP page, verify:

- [ ] Colors: all solids via `hsl(var(--token))`; gradients via `var(--gradient-*)`; no inline `linear-gradient(` in components
- [ ] Grid: all room listings use `ROOM_GRID_CLASS` via `KidsRoomGrid` or `VipRoomGrid`
- [ ] Rooms: all UI consumes `RoomJson` structure; no hardcoded essays/audio
- [ ] Hooks: Kids pages use `useKidsRooms(levelId)`
- [ ] Entries: use `BilingualEntryWithAudio` for EN/VI + audio
- [ ] Routing: only `/kids-chat/:roomId`, `/room/:roomId`, `/vip/:tier`
- [ ] Types: `KidsRoom`, `VipRoom`, `RoomEntry` imported from shared types/Supabase
- [ ] Accessibility: `aria-label` and `aria-hidden` applied correctly
- [ ] Performance: lazy-loading or virtualization used when `rooms.length > 50`
- [ ] Constants: all shared strings (table names, route prefixes, level IDs) come from constants files
- [ ] No `text-white`, `bg-blue-500`, or hex colors anywhere
- [ ] Bilingual titles use single line with `line-clamp-2` and ` / ` separator
- [ ] Staggered animations use `index * 0.05s` delay
- [ ] Dark mode: test all page backgrounds and gradients in dark mode

---

**End of Design System v1.1**
