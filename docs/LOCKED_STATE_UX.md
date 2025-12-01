# Locked State UX System - Mercy Blade Edition

## Overview

This document defines the canonical locked-state UX system that respects the Mercy Blade aesthetic across all room grids and lists.

## Principles

1. **Mercy Blade First**: Locked styling preserves the brand's gradient backgrounds and elegant aesthetic
2. **Frosted Effect**: Locked rooms use a subtle white overlay with backdrop blur - like looking through frosted glass
3. **Still Readable**: Text remains visible and readable through the frosted effect
4. **Minimal**: No yellow, no dashed borders, no color pollution - just elegant dimming

## Design System

### Visual Treatment

**Accessible Rooms:**
- Normal Mercy Blade styling (gradients, shadows, colors)
- Full interaction (hover effects, scale animations)
- Green checkmark or status badge
- Click to enter

**Locked Rooms:**
- Subtle frosted glass overlay (`bg-white/40 backdrop-blur-[1px]` in color mode)
- Reduced opacity (60% in color mode, 65% with grayscale in B&W mode)
- Muted gray lock badge
- Full text visibility (slightly dimmed)
- No hover effects
- Cursor: not-allowed
- Not clickable

### Color Modes

**Color Mode:**
- Container: `opacity-60`
- Overlay: `bg-white/40 backdrop-blur-[1px]`
- Badge: `bg-gray-400/80 text-white`
- Preserves Mercy Blade gradients underneath

**Black & White Mode:**
- Container: `opacity-65 grayscale`
- No overlay (grayscale handles the effect)
- Badge: `bg-gray-500 text-white`

## Components

### Core Utilities

**`src/components/room/LockedRoomStyles.ts`**
- `getLockedRoomClassNames(isColor)` - Returns container, overlay, title, subtitle class names
- Frosted effect that respects Mercy Blade aesthetic
- No yellow, no dashed borders

**`src/components/room/LockedBadge.tsx`**
- `<LockedBadge />` - Minimal gray lock icon badge
- Subtle, elegant, matches Mercy Blade minimalism

### Usage Examples

#### VirtualizedRoomGrid

```tsx
const lockedStyles = getLockedRoomClassNames(isColor);

<Card className={room.hasData ? 'cursor-pointer' : lockedStyles.container}>
  {/* Frosted overlay */}
  {!room.hasData && lockedStyles.overlay && (
    <div className={lockedStyles.overlay} aria-hidden="true" />
  )}
  
  {/* Badge */}
  {room.hasData ? <CheckCircle2 /> : <LockedBadge isColor={isColor} />}
  
  {/* Title - still readable */}
  <p className={lockedStyles.title}>{room.nameEn}</p>
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

## Implementation Checklist

✅ **VirtualizedRoomGrid** - Uses frosted overlay approach
✅ **RoomCard** (design-system) - Supports `isLocked` prop with frosted effect
✅ **KidsRoomCard** - Supports `isLocked` prop with frosted effect
✅ **RoomsVIP9** - Uses frosted overlay for non-accessible rooms
✅ **All VIP grid pages** - Use VirtualizedRoomGrid with Mercy Blade locked styling

## Accessibility

- `aria-disabled={true}` on locked elements
- `aria-label` includes "Locked" prefix
- `role="button"` only on accessible rooms
- `tabIndex={-1}` on locked elements
- `data-locked="true"` attribute for dev/QA inspection
- Text remains readable with WCAG compliant contrast

## Mercy Blade Aesthetic Rules

### ✅ DO

- Use frosted glass overlay effect
- Preserve underlying gradients
- Use subtle gray lock badges
- Maintain elegant opacity reduction
- Keep Mercy Blade color palette intact

### ❌ DON'T

- Use yellow backgrounds
- Use dashed borders
- Use bright outlines
- Override the theme system
- Introduce non-Mercy-Blade colors
- Make text unreadable
- Use heavy blur or grayscale on accessible content

## Testing

### Manual Testing
1. View VIP tier pages with lower-tier access
2. Locked rooms should:
   - Show frosted overlay (color mode) or grayscale (B&W mode)
   - Display subtle gray lock badge
   - Have readable (slightly dimmed) text
   - Preserve Mercy Blade gradients underneath
   - Not respond to hover/click
   - Look elegant and professional

### Dev Helper

In development mode, locked cards have `data-locked="true"` attribute:

```javascript
// Count locked cards on current page
document.querySelectorAll('[data-locked="true"]').length
```

## Migration from Previous Implementation

**Removed (Old Approach):**
- ❌ `border-yellow-400/80 bg-yellow-50/70` (yellow color pollution)
- ❌ `border-dashed` (not Mercy Blade aesthetic)
- ❌ High contrast borders (too harsh)

**New (Mercy Blade Approach):**
- ✅ `opacity-60` with frosted overlay (color mode)
- ✅ `opacity-65 grayscale` (B&W mode)
- ✅ `bg-white/40 backdrop-blur-[1px]` (elegant frosted effect)
- ✅ Subtle gray lock badge
- ✅ Preserves brand identity
