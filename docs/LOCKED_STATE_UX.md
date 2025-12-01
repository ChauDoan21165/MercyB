# Locked State UX System

## Overview

This document defines the canonical locked-state UX system used consistently across all room grids and lists in the Mercy Blade application.

## Principles

1. **Readable**: Locked content has full text contrast - users can read all titles and descriptions clearly
2. **Distinct**: Locked rooms are visually different from accessible rooms using subtle styling cues
3. **Accessible**: All styling meets WCAG AA contrast requirements
4. **Consistent**: Same locked styling everywhere (VIP grids, Kids rooms, admin lists)

## Design System

### Visual Treatment

**Accessible Rooms:**
- Normal background and border
- Full interaction (hover effects, scale animations)
- Green checkmark badge
- Click to enter

**Locked Rooms:**
- Dashed yellow/gray border (color mode dependent)
- Subtle yellow/gray background tint
- Lock badge with "Locked" label
- Full text contrast (no opacity reduction)
- No hover effects
- Cursor: not-allowed
- Not clickable

### Color Modes

**Color Mode:**
- Container: `border-yellow-400/80 bg-yellow-50/70`
- Badge: `bg-yellow-500 text-white`

**Black & White Mode:**
- Container: `border-gray-400 bg-gray-50/70`
- Badge: `bg-gray-600 text-white`

## Components

### Core Utilities

**`src/components/room/LockedRoomStyles.ts`**
- `getLockedRoomClassNames(isColor)` - Returns container, title, subtitle class names
- `getLockedRoomStyles(isColor)` - Returns inline styles when needed

**`src/components/room/LockedBadge.tsx`**
- `<LockedBadge />` - Standard lock icon badge
- `<BilingualLockedBadge />` - Lock badge with "Locked / Đã khoá" text

### Usage Examples

#### VirtualizedRoomGrid

```tsx
const lockedStyles = getLockedRoomClassNames(isColor);

<Card
  className={`... ${room.hasData ? 'cursor-pointer' : `cursor-not-allowed ${lockedStyles.container}`}`}
  data-locked={!room.hasData ? "true" : undefined}
>
  {/* Badge */}
  {room.hasData ? (
    <CheckCircle2 />
  ) : (
    <LockedBadge isColor={isColor} />
  )}
  
  {/* Title - always full contrast */}
  <p className={lockedStyles.title}>
    {room.nameEn}
  </p>
</Card>
```

#### RoomCard Component

```tsx
<RoomCard
  title="Room Title"
  isLocked={!hasAccess}
  isColor={isColor}
  onClick={hasAccess ? handleClick : undefined}
/>
```

#### KidsRoomCard

```tsx
<KidsRoomCard
  room={room}
  index={index}
  onClick={onClick}
  useColorTheme={isColor}
  isLocked={!hasKidsAccess}
/>
```

## Implementation Checklist

✅ **VirtualizedRoomGrid** - Uses canonical locked styles
✅ **RoomCard** (design-system) - Supports `isLocked` prop
✅ **KidsRoomCard** - Supports `isLocked` prop
✅ **RoomsVIP9** - Uses canonical locked styles for non-accessible rooms
✅ **All VIP grid pages** - Use VirtualizedRoomGrid with locked support

## Accessibility

- `aria-disabled={true}` on locked elements
- `aria-label` includes "Locked" prefix
- `role="button"` only on accessible rooms
- `tabIndex={-1}` on locked elements
- `data-locked="true"` attribute for dev/QA inspection

## Testing

### Manual Testing
1. View VIP tier pages with lower-tier access
2. Locked rooms should:
   - Show dashed border and subtle background
   - Display lock badge
   - Have full-contrast readable text
   - Not respond to hover/click
   - Show "Locked" in tooltip/aria-label

### Dev Helper

In development mode, locked cards have `data-locked="true"` attribute for easy inspection:

```javascript
// Count locked cards on current page
document.querySelectorAll('[data-locked="true"]').length
```

## Migration Notes

**Removed Patterns:**
- ❌ `opacity-30` / `opacity-40` (makes text unreadable)
- ❌ `blur` (inaccessible)
- ❌ `grayscale` (not sufficient distinction)
- ❌ Heavy opacity on text (fails WCAG)

**New Patterns:**
- ✅ Dashed border + subtle background tint
- ✅ Full contrast text
- ✅ Clear lock badge
- ✅ data-locked attribute

## Future Considerations

- May add tier-specific lock colors (e.g., gold for VIP9)
- Could add unlock animations when user upgrades
- Potential for preview/teaser on locked rooms (first paragraph visible)
