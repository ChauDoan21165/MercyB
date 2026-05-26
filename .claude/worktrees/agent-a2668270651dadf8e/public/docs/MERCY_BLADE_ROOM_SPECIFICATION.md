# Mercy Blade Room Specification Standard
**Version 1.0 - Master Design System**

This document defines the EXACT standards for building ANY room, level, or feature in the Mercy Blade app. All implementations MUST follow these patterns precisely to maintain consistency.

---

## 🎨 Core Design System

### Color System (MANDATORY)
**CRITICAL:** ALL colors MUST use HSL semantic tokens from `index.css` and `tailwind.config.ts`. NEVER use direct hex colors or Tailwind color classes like `text-white`, `bg-blue-500`, etc.

#### Semantic Tokens to Use:
```css
/* Backgrounds */
--background          /* Main page background */
--card                /* Card backgrounds */
--muted               /* Muted/secondary backgrounds */

/* Text */
--foreground          /* Primary text color */
--muted-foreground    /* Secondary text color */
--primary             /* Primary accent text/elements */
--accent              /* Accent elements */

/* Kids-Specific */
--kids-rainbow-bg     /* Kids level backgrounds */
--gradient-rainbow    /* Rainbow gradient for kids features */
--kids-card-shadow    /* Card shadow for kids cards */
--kids-hover-glow     /* Hover glow effect */

/* Effects */
--shadow-soft         /* Soft shadow */
--shadow-elegant      /* Elegant shadow */
```

#### Usage Examples:
```tsx
// ✅ CORRECT
<div style={{ background: 'var(--kids-rainbow-bg)' }}>
<p className="text-foreground">Text</p>
<div className="bg-card">Card</div>

// ❌ WRONG - Never do this
<div className="bg-blue-100">
<p className="text-white">Text</p>
<div style={{ background: '#ffffff' }}>Card</div>
```

---

## 📐 Component Patterns

### 1. Shared Room Card Component
**Location:** `src/components/kids/KidsRoomCard.tsx`

**When to Use:** ALL Kids Level rooms (Level 1, 2, 3+) MUST use this shared component.

**Implementation:**
```tsx
import { KidsRoomCard } from "@/components/kids/KidsRoomCard";

// In your room grid
{rooms.map((room, index) => (
  <KidsRoomCard
    key={room.id}
    room={room}
    index={index}
    onClick={() => navigate(`/kids-chat/${room.id}`)}
  />
))}
```

**Features Included:**
- ✅ Rainbow gradient borders and text
- ✅ Animated hover effects
- ✅ Status badges
- ✅ Icon handling with fallbacks
- ✅ Bilingual text (English + Vietnamese)
- ✅ Semantic color tokens
- ✅ Shine effect on hover

**DO NOT recreate this component in individual pages!**

---

## 🏗️ Page Structure Standards

### Standard Kids Level Page Structure

```tsx
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { [LevelIcon], RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserAccess } from "@/hooks/useUserAccess";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { KidsRoomCard } from "@/components/kids/KidsRoomCard";

interface KidsRoom {
  id: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi: string;
  icon: string | null;
  display_order: number;
}

const KidsLevel[X] = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useUserAccess();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<KidsRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('kids_rooms')
        .select('*')
        .eq('level_id', 'level[X]')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load rooms",
        variant: "destructive",
      });
    } finally {
      setRoomsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRooms();
    toast({
      title: "Refreshed! 🌈",
      description: "Rooms updated successfully",
    });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading || roomsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--kids-rainbow-bg)' }}>
      <ColorfulMercyBladeHeader
        subtitle="Kids Level [X] - Ages [Y-Z]"
        showBackButton={true}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Header with Gradient */}
        <div className="mb-12 space-y-6 text-center">
          <div 
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-3xl shadow-lg animate-fade-in" 
            style={{ background: 'var(--gradient-rainbow)' }}
          >
            <[LevelIcon] className="h-10 w-10 animate-bounce text-white" />
            <div className="text-left text-white">
              <h1 className="text-4xl font-bold tracking-tight">
                Kids Level [X]
              </h1>
              <p className="text-sm opacity-90">
                Cấp [X] - Độ tuổi [Y-Z]
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div 
              className="inline-block bg-card/80 backdrop-blur-sm px-6 py-2 rounded-full" 
              style={{ boxShadow: 'var(--shadow-soft)' }}
            >
              <p className="text-sm font-medium text-foreground">
                🎯 {rooms.length} exciting rooms to explore! / {rooms.length} phòng thú vị để khám phá!
              </p>
            </div>
            
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-full shadow-lg transition-all duration-300 hover:scale-105"
              style={{ 
                background: 'var(--gradient-rainbow)',
                color: 'white'
              }}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
          {rooms.map((room, index) => (
            <KidsRoomCard
              key={room.id}
              room={room}
              index={index}
              onClick={() => navigate(`/kids-chat/${room.id}`)}
            />
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="fixed bottom-8 right-8 opacity-20 pointer-events-none">
          <[LevelIcon] className="w-32 h-32 text-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default KidsLevel[X];
```

---

## 🎯 Grid System Standards

### Room Grid Layout
**ALWAYS use this exact grid configuration:**

```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
  {/* room cards here */}
</div>
```

**Breakpoints:**
- Mobile: 2 columns
- Small (sm): 3 columns  
- Medium (md): 4 columns
- Large (lg): 5 columns
- Extra Large (xl): 6 columns

**Gap:** Always `gap-4`

---

## ✨ Animation Standards

### Standard Animations to Use

```tsx
// Fade in animation for main containers
className="animate-fade-in"

// Staggered card animations
style={{ animationDelay: `${index * 0.05}s` }}

// Hover scale
className="hover:scale-110 transition-all duration-500"

// Hover shadow
className="hover:shadow-2xl hover:z-10"

// Bounce for icons
className="animate-bounce"

// Pulse for badges
className="animate-pulse"

// Spin for refresh
className={`${isRefreshing ? 'animate-spin' : ''}`}
```

---

## 🌈 Kids-Specific Standards

### Rainbow Gradient Text Pattern
**For ALL Kids Level room titles:**

```tsx
<p 
  className="text-xs font-bold leading-tight line-clamp-2 text-center transition-all duration-300"
  style={{
    background: 'var(--gradient-rainbow)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }}
>
  {room.title_en}
</p>
```

### Background Pattern
**For ALL Kids Level pages:**

```tsx
<div className="min-h-screen" style={{ background: 'var(--kids-rainbow-bg)' }}>
```

### Button Pattern
**For ALL Kids Level action buttons:**

```tsx
<Button
  className="rounded-full shadow-lg transition-all duration-300 hover:scale-105"
  style={{ 
    background: 'var(--gradient-rainbow)',
    color: 'white'
  }}
>
```

---

## 📱 Responsive Design Standards

### Container Structure
```tsx
<div className="container mx-auto px-4 py-8 max-w-7xl">
```

**Always use:**
- `container mx-auto` - Centers content
- `px-4` - Horizontal padding
- `py-8` - Vertical padding
- `max-w-7xl` - Maximum width constraint

### Card Sizing
```tsx
className="p-4"  // Standard card padding
```

### Icon Sizing
```tsx
// Hero icons
className="h-10 w-10"

// Card icons
className="w-8 h-8"

// Badge icons
className="w-3 h-3"

// Decorative icons
className="w-32 h-32"
```

---

## 🔤 Bilingual Text Pattern

### ALWAYS use this order:
1. **English first**
2. **Vietnamese second**

```tsx
<p className="text-xs font-bold">{room.title_en}</p>
<p className="text-[10px]">{room.title_vi}</p>
```

### Text Sizing Standards
- English title: `text-xs font-bold`
- Vietnamese title: `text-[10px]`
- Hero title: `text-4xl font-bold`
- Hero subtitle: `text-sm opacity-90`

---

## 🎪 VIP Room Standards

### VIP Room Pattern (To be copied exactly)
```tsx
// Use similar structure as Kids levels but with VIP-specific:
// - Color schemes from roomColors.ts
// - VIP tier badges
// - Premium indicators
// - Locked state handling
```

**VIP rooms MUST:**
- Use semantic tokens from design system
- Follow same grid layout (2-3-4-5-6 columns)
- Use shared components where possible
- Maintain bilingual text pattern
- Include proper authentication checks

---

## 🔐 Authentication Pattern

### Standard Auth Check
```tsx
const { isAuthenticated, loading } = useUserAccess();

if (loading || roomsLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
```

---

## 📊 Database Query Pattern

### Standard Supabase Query
```tsx
const { data, error } = await supabase
  .from('kids_rooms')
  .select('*')
  .eq('level_id', 'level1')
  .eq('is_active', true)
  .order('display_order');
```

**Always:**
- Filter by `is_active = true`
- Order by `display_order`
- Handle errors properly with toast notifications

---

## 🚨 Critical Rules

### NEVER:
1. ❌ Use direct hex colors (`#ffffff`, `#000000`)
2. ❌ Use Tailwind color classes (`text-white`, `bg-blue-500`)
3. ❌ Create inline card implementations (use shared components)
4. ❌ Skip bilingual text
5. ❌ Hardcode animations without semantic tokens
6. ❌ Mix different grid patterns
7. ❌ Use different button styles for same contexts

### ALWAYS:
1. ✅ Use semantic tokens from `index.css`
2. ✅ Use shared components (`KidsRoomCard`, etc.)
3. ✅ Follow grid system (2-3-4-5-6 columns)
4. ✅ Include both English and Vietnamese
5. ✅ Use standard animation patterns
6. ✅ Include proper loading states
7. ✅ Handle errors with toast notifications
8. ✅ Test in light and dark mode

---

## 📋 Checklist for New Rooms/Levels

Before creating any new room or level, verify:

- [ ] Using semantic tokens (no hex colors)
- [ ] Using shared components where applicable
- [ ] Following standard grid layout
- [ ] Bilingual text (EN + VI) in correct order
- [ ] Standard animations applied
- [ ] Authentication checks in place
- [ ] Loading states handled
- [ ] Error handling with toasts
- [ ] Responsive design working
- [ ] Dark mode compatibility checked
- [ ] Database queries optimized
- [ ] Component properly exported

---

## 🔄 Updating This Standard

When making improvements to the design system:

1. Update this document FIRST
2. Update shared components
3. Apply to all existing implementations
4. Test thoroughly
5. Document any new patterns

**This is the single source of truth. When in doubt, refer to this document.**

---

## 🎵 KidsChat Content Layout Standards

### Audio Bar Positioning
**MANDATORY:** For ALL KidsChat rooms with audio, the audio player MUST be positioned between the English and Vietnamese content.

**Standard Layout Order:**
1. English content (`content_en`)
2. **Audio Player with shadowing reminder** ← ALWAYS HERE
3. Vietnamese content (`content_vi`)

**Implementation Pattern:**
```tsx
<div className="w-full">
  <div className="rounded-2xl px-6 py-4 bg-card border shadow-sm">
    {/* 1. English content with highlighting */}
    <div className="mb-3">
      <div className="text-sm leading-relaxed">
        <HighlightedContent content={selectedEntry.content_en} />
      </div>
    </div>

    {/* 2. Audio Player - MUST be in the middle */}
    {selectedEntry.audio_url && (
      <div className="my-3">
        <p className="text-xs text-muted-foreground italic mb-2 text-center">
          💡 Try shadowing: Listen and repeat along with the audio to improve your pronunciation and fluency. / 
          💡 Hãy thử bóng: Nghe và lặp lại cùng với âm thanh để cải thiện phát âm và sự trôi chảy của bạn.
        </p>
        <div className="flex items-center gap-2">
          <AudioPlayer
            audioPath={selectedEntry.audio_url}
            isPlaying={currentAudio === selectedEntry.audio_url && isPlaying}
            onPlayPause={handleAudioToggle}
            onEnded={() => {
              setIsPlaying(false);
              setCurrentAudio(null);
            }}
          />
        </div>
      </div>
    )}

    {/* 3. Vietnamese content with highlighting */}
    <div className="mt-3 pt-3 border-t border-border/40">
      <div className="text-sm leading-relaxed">
        <HighlightedContent content={selectedEntry.content_vi} />
      </div>
    </div>
  </div>
</div>
```

**Critical Rules:**
- ✅ Audio player MUST be centered between English and Vietnamese
- ✅ Include shadowing reminder text above audio player
- ✅ Use `my-3` spacing for audio section
- ✅ Vietnamese content MUST have top border (`border-t`) for visual separation
- ✅ Center-align the shadowing reminder text
- ❌ NEVER place audio at the top or bottom of content
- ❌ NEVER place audio after Vietnamese content

**Spacing Standards:**
- English content: `mb-3` (margin bottom)
- Audio section: `my-3` (margin top and bottom)
- Vietnamese content: `mt-3 pt-3` (margin top, padding top)

**Visual Hierarchy:**
```
┌─────────────────────────────┐
│ English Content             │  ← mb-3
├─────────────────────────────┤
│ 💡 Shadowing Reminder       │  ← my-3 (centered text)
│ [Audio Player Controls]     │  
├─────────────────────────────┤
│ ─────────────────────────── │  ← border-t separator
│ Vietnamese Content          │  ← mt-3 pt-3
└─────────────────────────────┘
```

---

## 📚 Reference Files

- **Design System:** `src/index.css`, `tailwind.config.ts`
- **Shared Components:** `src/components/kids/KidsRoomCard.tsx`
- **Example Implementations:** 
  - `src/pages/KidsLevel1.tsx`
  - `src/pages/KidsLevel2.tsx`
  - `src/pages/KidsLevel3.tsx`
- **Color Utilities:** `src/lib/roomColors.ts`

---

## 🎓 Quick Reference

**Need to create a new Kids Level?**
→ Copy `src/pages/KidsLevel1.tsx`, change level number, update database query

**Need to modify room card design?**
→ Edit ONLY `src/components/kids/KidsRoomCard.tsx`

**Need new colors?**
→ Add to `index.css` as HSL semantic tokens first

**Need new VIP tier?**
→ Follow Kids Level pattern, adapt colors from `roomColors.ts`

---

**Last Updated:** [Current Date]  
**Maintained By:** Mercy Blade Development Team  
**Version:** 1.0
