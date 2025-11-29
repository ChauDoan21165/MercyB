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

### Rule: Solid Colors
**All solid colors must be defined as HSL semantic tokens in `index.css` and used via `hsl(var(--token-name))`.**

- No raw Tailwind palette utilities like `bg-blue-500`, `text-gray-700`.
- Only semantic utilities like `text-foreground`, `bg-background`, `text-muted-foreground` are allowed.
- All color values in CSS must use HSL format.

### Rule: Gradients
**All gradients must be defined as semantic tokens (`--gradient-*`) in CSS and used via `var(--gradient-*)`.** 

- It is **forbidden** to write `linear-gradient(...)` directly inside React components.
- Gradients may use hex colors *inside the CSS definition*, but never inline in JSX.

### Required Tokens

```css
/* index.css — Colors */
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
  --page-vip9-bg: 220 15% 18%; /* Dark slate for VIP9 */

  /* Kids level colors */
  --kids-l1: 200 100% 85%;
  --kids-l2: 280 80% 85%;
  --kids-l3: 160 75% 85%;

  /* VIP badge and locked state */
  --vip-badge: 280 60% 50%;
  --vip-locked: 0 0% 70%;

  /* Gradients (use in style={{ background: 'var(--gradient-name)' }}) */
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

### Dark Mode Testing
**Rule:** Every major token used on kids/VIP pages must have a `.dark` variant.

Test checklist:
- [ ] Test kids and VIP hero gradients in dark mode on a real device
- [ ] Verify all page backgrounds are readable in dark mode
- [ ] Check text contrast ratios meet WCAG AA standards in both modes

### Example (Kids Hero Button)

```tsx
// ❌ WRONG — inline gradient + literal 'white'
<Button
  className="rounded-full shadow-lg"
  style={{ 
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white'
  }}
>

// ✅ CORRECT — semantic tokens only
<Button
  className="rounded-full shadow-lg transition-all duration-300 hover:scale-105 text-foreground"
  style={{ 
    background: 'var(--gradient-kids-hero)'
  }}
>
  Start Learning / Bắt đầu học
</Button>
```

### Example (Page Background)

```tsx
// ❌ WRONG
<div className="min-h-screen bg-purple-50">

// ✅ CORRECT
<div 
  className="min-h-screen"
  style={{ background: 'hsl(var(--page-vip3-bg))' }}
>
```

### Example (Icon Colors)

```tsx
// ❌ WRONG
<Star className="h-10 w-10 text-white animate-bounce" />

// ✅ CORRECT
<Star className="h-10 w-10 text-foreground animate-bounce" />
```

---

## 2. Room Card Grid Pattern

### Rule
All room listing pages (Kids, VIP1-9) **MUST** use this exact responsive grid:

```tsx
className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
```

**No exceptions.** This ensures consistent card sizing across all tiers.

### KidsRoomGrid Component
Kids pages should use the `<KidsRoomGrid />` abstraction:

```tsx
<KidsRoomGrid
  rooms={rooms}
  onRoomClick={(room) => navigate(`/kids-chat/${room.id}`)}
/>
```

Inside this component, the grid class **must** be the canonical grid pattern above.

### Performance: Large Levels
If a level might have **> 50 rooms**, the implementation should consider:
- Virtualized grid (e.g. `react-window`), or
- At minimum, `loading="lazy"` on images/illustrations

Checklist:
- [ ] Levels > 50 rooms: use virtualization or lazy-loading

### Required Props
- Grid container: exact className above
- Gap: `gap-4` (no other gap values)
- Cards: use `KidsRoomCard` for Kids, `VipRoomCard` for VIP (or equivalent)

### Example (Kids Room Grid with Component)

```tsx
import { KidsRoomGrid } from "@/components/kids/KidsRoomGrid";

<KidsRoomGrid
  rooms={rooms}
  onRoomClick={(room) => navigate(`/kids-chat/${room.id}`)}
/>
```

### Example (Manual Grid for Reference)

```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
  {rooms.map((room, index) => (
    <KidsRoomCard
      key={room.id}
      room={room}
      index={index}
      onClick={() => navigate(`/kids-chat/${room.id}`)}
    />
  ))}
</div>
```

### Example (VIP Room Grid)

```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
  {rooms.map((room, index) => (
    <VipRoomCard
      key={room.id}
      room={room}
      index={index}
      onClick={() => navigate(`/room/${room.id}`)}
    />
  ))}
</div>
```

---

## 3. Kids Room Card (KidsRoomCard)

### Rule
All Kids tier room cards **MUST** use the `KidsRoomCard` component with no local style overrides.

### Required Props
```tsx
interface KidsRoomCardProps {
  room: KidsRoom;
  index: number;
  onClick: () => void;
}
```

### API Contract
- `room.title_en` — English title
- `room.title_vi` — Vietnamese title
- `room.icon` — Icon name (e.g., "Star", "Heart")
- `index` — Used for staggered animations

### Example (Complete)

```tsx
import { KidsRoomCard } from "@/components/KidsRoomCard";

<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
  {rooms.map((room, index) => (
    <KidsRoomCard
      key={room.id}
      room={room}
      index={index}
      onClick={() => navigate(`/kids-chat/${room.id}`)}
    />
  ))}
</div>
```

### Visual Spec
- Card border: thin, subtle shadow
- Title: bilingual, `line-clamp-2` for both English and Vietnamese
- Icon: centered, animated bounce on hover
- Gradient title bar: uses `var(--gradient-rainbow)`
- Click feedback: scale-105 hover

---

## 4. VIP Room Pattern (Canonical Template)

### Rule
All VIP tier pages **MUST** follow the structure of **`src/pages/vip/VipTier1Rooms.tsx`** as the base template.

When adding new VIP pages, copy this file and only change:
1. Title and subtitle text
2. Supabase query filter (`tier_id = 'vip1'` → `tier_id = 'vip3'`, etc.)
3. Page background token (`--page-vip1-bg` → `--page-vip3-bg`, etc.)
4. Hero icon (optional)

**Do NOT change the grid layout, card component, routing pattern, or data loading pattern in the VIP template without updating this design system.**

### Required Structure
```tsx
// 1. Hero section with gradient background
<div style={{ background: 'var(--gradient-vip-hero)' }}>
  <h1>VIP Tier Name</h1>
  <p>Subtitle / Phụ đề</p>
</div>

// 2. Room grid (exact same pattern as Kids)
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
  {rooms.map((room, index) => (
    <VipRoomCard
      key={room.id}
      room={room}
      index={index}
      onClick={() => navigate(`/room/${room.id}`)}
    />
  ))}
</div>
```

### Example (VIP3 Page)

```tsx
// src/pages/vip/VipTier3Rooms.tsx
export default function VipTier3Rooms() {
  const { data: rooms } = useQuery({
    queryKey: ['vip3-rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('tier_id', 'vip3')
        .order('display_order');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div 
      className="min-h-screen p-8"
      style={{ background: 'hsl(var(--page-vip3-bg))' }}
    >
      {/* Hero */}
      <div 
        className="text-center mb-8 p-8 rounded-lg"
        style={{ background: 'var(--gradient-vip-hero)' }}
      >
        <h1 className="text-4xl font-bold text-foreground mb-2">
          VIP3 — Advanced English
        </h1>
        <p className="text-lg text-foreground/90">
          Master fluency with deeper patterns / Làm chủ sự trôi chảy với các mẫu sâu hơn
        </p>
      </div>

      {/* Room grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {rooms?.map((room, index) => (
          <VipRoomCard
            key={room.id}
            room={room}
            index={index}
            onClick={() => navigate(`/room/${room.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 5. Room Data Source of Truth

### Rule
All rooms (Kids + VIP) **MUST** use the Mercy Blade JSON standard / `rooms` table schema.

UI must **NEVER** hardcode:
- Essays or descriptions
- Audio filenames
- Entry content

### Required Data Fields
```tsx
// From database/JSON
room.entries[].copy.en       // English essay
room.entries[].copy.vi       // Vietnamese essay
room.entries[].audio         // Audio filename (e.g., "ef01_1_en.mp3")
room.room_essay_en           // Room-level intro (English)
room.room_essay_vi           // Room-level intro (Vietnamese)
```

### Example (Correct Data Consumption)

```tsx
// ❌ WRONG — hardcoded essay
<p>This room teaches you about writing skills...</p>

// ✅ CORRECT — consumed from database
<PairedHighlightedContent
  englishContent={room.room_essay_en}
  vietnameseContent={room.room_essay_vi}
/>
```

### See Also
- Full JSON schema: `docs/mercyblade-json-standard.md`
- Room registration: `docs/room-registration-workflow.md`

---

## 6. Routing Conventions

### Rule
**All routes must follow these exact patterns:**

| Tier | Route Pattern | Example |
|------|---------------|---------|
| Kids | `/kids-chat/:roomId` | `/kids-chat/alphabet-sounds-kids-l1` |
| Adult Free/VIP | `/room/:roomId` | `/room/nutrition-vip2` |
| VIP Tier Listing | `/vip/:tier` | `/vip/vip3` |

**No other route formats permitted.** This prevents `/vip3chat`, `/chat-kids`, etc.

### Entry Points
- Kids rooms: `KidsLevel1Page.tsx`, `KidsLevel2Page.tsx`, `KidsLevel3Page.tsx`
- Adult rooms: `ChatHub.tsx` (single entry point for all adult rooms)
- VIP tier pages: `VipTier1Rooms.tsx`, `VipTier3Rooms.tsx`, etc.

---

## 7. Bilingual Text Pattern

### Rule
Card titles **must** use a **single line** with `English / Vietnamese` and `line-clamp-2`.

We do **NOT** separate into two physical lines with stacked `<p>` tags.

All room cards and titles must:
1. Display **English first, Vietnamese second**
2. Use **`line-clamp-2`** for the combined title to prevent overflow
3. Separate with ` / ` (space-slash-space)
4. English and Vietnamese titles should not exceed 2 lines in cards

### Example (Card Title)

```tsx
// ❌ WRONG — no line clamp, inconsistent separator
<h3 className="font-bold">
  {room.title_en} | {room.title_vi}
</h3>

// ✅ CORRECT — line clamp, consistent separator
<h3 className="font-bold text-sm line-clamp-2">
  {room.title_en} / {room.title_vi}
</h3>
```

### Example (Gradient Title Bar)

```tsx
<div 
  className="p-2 text-center rounded-t-lg"
  style={{ background: 'var(--gradient-rainbow)' }}
>
  <h4 className="font-bold text-foreground text-xs line-clamp-2">
    {room.title_en} / {room.title_vi}
  </h4>
</div>
```

---

## 8. Animation Standards

### Rule
All room cards use **staggered fade-in animations** based on index.

### Required Pattern

```tsx
<Card
  className="cursor-pointer hover:scale-105 transition-all duration-300"
  style={{
    animationDelay: `${index * 0.05}s`
  }}
>
```

- Base delay: `0.05s` per card
- Index-based: each card delays by `index * 0.05s`
- Hover: `scale-105` with `duration-300`

### Example (Complete Animation)

```tsx
{rooms.map((room, index) => (
  <Card
    key={room.id}
    className="cursor-pointer hover:scale-105 transition-all duration-300 animate-fade-in"
    style={{
      animationDelay: `${index * 0.05}s`
    }}
    onClick={() => navigate(`/room/${room.id}`)}
  >
    {/* Card content */}
  </Card>
))}
```

---

## 8. Constants & Magic Strings

### Rule
All shared literals (table names, level IDs, route prefixes) must come from a constants file, not inline strings.

### Example (Constants File)

```ts
// src/lib/constants/kids.ts
export const KIDS_TABLE = 'kids_rooms';
export const KIDS_ROUTE_PREFIX = '/kids-chat';
export const LEVEL_IDS = ['level1', 'level2', 'level3'] as const;
```

### Example (Usage)

```tsx
// ❌ WRONG — hardcoded strings
const { data } = await supabase
  .from('kids_rooms')
  .select('*')
  .eq('level_id', 'level1');

navigate(`/kids-chat/${room.id}`);

// ✅ CORRECT — imported constants
import { KIDS_TABLE, KIDS_ROUTE_PREFIX, LEVEL_IDS } from '@/lib/constants/kids';

const { data } = await supabase
  .from(KIDS_TABLE)
  .select('*')
  .eq('level_id', LEVEL_IDS[0]);

navigate(`${KIDS_ROUTE_PREFIX}/${room.id}`);
```

---

## 9. Data Hooks

### useKidsRooms(levelId)
All Kids level pages must use a shared `useKidsRooms(levelId: string)` hook instead of custom Supabase queries.

### Required Return Shape

```ts
const { rooms, loading, error, refresh } = useKidsRooms(levelId);
```

### Example (Level Page)

```tsx
import { useKidsRooms } from '@/hooks/useKidsRooms';
import { LEVEL_IDS } from '@/lib/constants/kids';

export default function KidsLevel1() {
  const { rooms, loading, error, refresh } = useKidsRooms(LEVEL_IDS[0]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="min-h-screen p-8">
      <KidsRoomGrid
        rooms={rooms}
        onRoomClick={(room) => navigate(`${KIDS_ROUTE_PREFIX}/${room.id}`)}
      />
    </div>
  );
}
```

---

## 10. Bilingual Entry Component

### Rule
Pages **must not** hand-roll the order of EN/VI text and audio.

Always use `<BilingualEntryWithAudio />` wrapper that enforces:
1. English content
2. Vietnamese content
3. Audio player

### API Contract

```tsx
interface BilingualEntryProps {
  entry: {
    copy: {
      en: string;
      vi: string;
    };
    audio: string;
  };
}
```

### Example

```tsx
import { BilingualEntryWithAudio } from '@/components/BilingualEntryWithAudio';

// ❌ WRONG — custom layout
<div>
  <p>{entry.copy.en}</p>
  <p>{entry.copy.vi}</p>
  <AudioPlayer src={entry.audio} />
</div>

// ✅ CORRECT — consistent wrapper
<BilingualEntryWithAudio entry={entry} />
```

---

## 11. Types & Supabase

### Rule
The Kids rooms type must come from a generated Supabase type file, not manual interfaces.

### Example (Type Import)

```ts
// types/supabase.ts (generated via `npx supabase gen types typescript`)
export type KidsRoom = Database['public']['Tables']['kids_rooms']['Row'];
```

### Example (Usage)

```tsx
// ❌ WRONG — manual interface
interface KidsRoom {
  id: string;
  title_en: string;
  title_vi: string;
  // ...
}

// ✅ CORRECT — generated types
import type { KidsRoom } from '@/types/supabase';

const rooms: KidsRoom[] = await fetchKidsRooms();
```

### Checklist
- [ ] Run `npx supabase gen types typescript` after database changes
- [ ] Import all room types from generated file

---

## 12. Accessibility

### Rule
- All interactive icons/buttons must have `aria-label` if their meaning isn't obvious from text
- Pure decorative icons must use `aria-hidden="true"`

### Example

```tsx
// ❌ WRONG — no accessibility attributes
<Button onClick={handleRefresh}>
  <RefreshCw className="w-4 h-4" />
</Button>

// ✅ CORRECT — descriptive label, hidden icon
<Button aria-label="Refresh rooms" onClick={handleRefresh}>
  <RefreshCw className="w-4 h-4" aria-hidden="true" />
</Button>

// ✅ CORRECT — decorative background icon
<Star className="absolute top-4 right-4 opacity-20" aria-hidden="true" />
```

---

## 13. Automation Ideas (Future)

To enforce this design system automatically:

### ESLint Rule
- Forbid `text-white`, `bg-blue-500`, hex colors in className or style
- Require all colors use `hsl(var(--token-name))` or semantic Tailwind tokens

### Grid Layout Linter
- Script to scan `src/pages` for grid classes
- Fail if grid doesn't match: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`

### KidsRoomCard Snapshot Test
- Jest snapshot test to prevent local style overrides in KidsRoomCard component

### Pre-commit Hook
- Block commits with hardcoded essays, audio filenames, or hex colors
- Validate all new room pages follow VIP template structure

---

## 14. Component Checklist

Before shipping any new Kids or VIP page, verify:

- [ ] Page background uses semantic token (`hsl(var(--page-*-bg))`)
- [ ] Grid uses exact responsive pattern (2/3/4/5/6 cols)
- [ ] Cards use `KidsRoomCard` or `VipRoomCard` (no local overrides)
- [ ] No `text-white`, `bg-blue-500`, or hex colors anywhere
- [ ] Gradients use named tokens (`var(--gradient-*)`)
- [ ] No `linear-gradient(...)` strings inside components (all gradients via `var(--gradient-*)`)
- [ ] All shared strings (table names, route prefixes, level IDs) come from constants files
- [ ] Kids pages use `useKidsRooms(levelId)` and `<KidsRoomGrid />`
- [ ] Bilingual entries use `<BilingualEntryWithAudio />`
- [ ] Room data consumed from database/JSON (no hardcoded content)
- [ ] Route follows conventions (`/kids-chat/:id` or `/room/:id`)
- [ ] Bilingual titles use single line with `line-clamp-2` and ` / ` separator
- [ ] Staggered animations use `index * 0.05s` delay
- [ ] Supabase types are imported from a single generated file
- [ ] Basic accessibility: `aria-label` on interactive icons, `aria-hidden` on decorative ones
- [ ] For large levels (>50 rooms), we apply lazy-loading or virtualization
- [ ] Dark mode: test all page backgrounds and gradients in dark mode

---

## Questions?

If a pattern isn't covered in this doc, check:
1. Existing Kids Level 1 page (`KidsLevel1Page.tsx`)
2. VIP tier template (`VipTier1Rooms.tsx`)
3. KidsRoomCard component source

If still unclear, ask in team chat before implementing — don't guess.

**End of Design System v1.1**
