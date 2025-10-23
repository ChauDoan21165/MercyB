# UI SPECIFICATION GUIDE
## Complete Visual Design System for Mercy Blade App Recreation

**CRITICAL**: This guide provides EXACT specifications for recreating the UI. Follow these specifications precisely to match the original design.

---

## 1. COLOR SYSTEM & DESIGN TOKENS

### 1.1 Base CSS Custom Properties (src/index.css)

**CRITICAL**: All colors MUST be in HSL format. Define these exact values in `:root`:

```css
:root {
  /* Base colors - Free/Page 1 theme (cyan to blue gradient) - DARK with BRIGHT text */
  --background: 210 70% 15%;
  --foreground: 190 40% 95%;

  --card: 210 60% 20%;
  --card-foreground: 190 40% 95%;

  --popover: 210 60% 20%;
  --popover-foreground: 190 40% 95%;

  --primary: 200 80% 50%;
  --primary-foreground: 0 0% 100%;
  --primary-glow: 200 70% 60%;

  --secondary: 190 60% 45%;
  --secondary-foreground: 0 0% 100%;

  --muted: 210 50% 25%;
  --muted-foreground: 190 30% 70%;

  --accent: 180 65% 55%;
  --accent-foreground: 0 0% 100%;

  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 100%;

  --border: 210 40% 30%;
  --input: 210 40% 30%;
  --ring: 200 80% 50%;

  --radius: 0.75rem;
  
  /* Gradients and Shadows */
  --gradient-hero: linear-gradient(135deg, hsl(200 80% 50%), hsl(200 70% 60%));
  --gradient-card: linear-gradient(135deg, hsl(210 60% 20%), hsl(210 50% 25%));
  --shadow-soft: 0 4px 20px -4px hsl(200 80% 50% / 0.25);
  --shadow-hover: 0 8px 30px -4px hsl(200 80% 50% / 0.35);
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Sidebar colors */
  --sidebar-background: 210 65% 18%;
  --sidebar-foreground: 190 40% 90%;
  --sidebar-primary: 200 80% 50%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 210 50% 25%;
  --sidebar-accent-foreground: 190 40% 90%;
  --sidebar-border: 210 40% 30%;
  --sidebar-ring: 200 80% 50%;
  
  /* Page-specific backgrounds - DARK */
  --page-welcome: 210 70% 18%;
  --page-allrooms: 200 65% 22%;
  --page-roomgrid: 210 60% 25%;
  
  /* VIP1 colors (turquoise to deep blue) - DARK */
  --page-vip1: 168 60% 22%;
  --vip1-primary: 168 80% 45%;
  --vip1-secondary: 196 75% 40%;
  --vip1-accent: 228 85% 55%;
  
  /* VIP2 colors (bright green to blue) - DARK */
  --page-vip2: 156 65% 20%;
  --vip2-primary: 156 85% 45%;
  --vip2-secondary: 186 80% 42%;
  --vip2-accent: 217 90% 55%;
  
  /* VIP3 colors (bright green to blue) - DARK */
  --page-vip3: 148 65% 18%;
  --vip3-primary: 148 85% 45%;
  --vip3-secondary: 177 80% 40%;
  --vip3-accent: 207 90% 55%;
  --vip3-gold: 46 90% 55%;
  
  /* Admin page colors (red-orange to lime gradient) - DARK */
  --admin-primary: 11 100% 43%;
  --admin-secondary: 41 100% 43%;
  --admin-accent: 71 100% 43%;
  --gradient-admin: linear-gradient(135deg, hsl(11 100% 43%), hsl(41 100% 43%), hsl(71 100% 43%));
}
```

### 1.2 Tailwind Color Configuration (tailwind.config.ts)

```typescript
colors: {
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
  },
  destructive: {
    DEFAULT: "hsl(var(--destructive))",
    foreground: "hsl(var(--destructive-foreground))",
  },
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  accent: {
    DEFAULT: "hsl(var(--accent))",
    foreground: "hsl(var(--accent-foreground))",
  },
  popover: {
    DEFAULT: "hsl(var(--popover))",
    foreground: "hsl(var(--popover-foreground))",
  },
  card: {
    DEFAULT: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
  },
  sidebar: {
    DEFAULT: "hsl(var(--sidebar-background))",
    foreground: "hsl(var(--sidebar-foreground))",
    primary: "hsl(var(--sidebar-primary))",
    "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
    accent: "hsl(var(--sidebar-accent))",
    "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
    border: "hsl(var(--sidebar-border))",
    ring: "hsl(var(--sidebar-ring))",
  },
}
```

---

## 2. TYPOGRAPHY SYSTEM

### 2.1 Hero/Main Headings
```tsx
className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
```
**Example**: "Mercy Blade" title on Welcome page

### 2.2 Section Headings
```tsx
className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
```
**Example**: "Choose Your Learning Room"

### 2.3 Sub Headings
```tsx
className="text-3xl font-bold text-foreground"
```
**Example**: "Choose Your Plan"

### 2.4 Card Titles
```tsx
className="text-2xl font-semibold leading-none tracking-tight"
```

### 2.5 Body Text
- Primary: `text-foreground/90` or `text-foreground`
- Secondary: `text-muted-foreground`
- Small: `text-sm`, Extra small: `text-xs`

### 2.6 Bilingual Text Pattern
**ALWAYS use this pattern for bilingual content**:
```tsx
<div className="space-y-2">
  <p className="text-xl font-semibold text-foreground/90">
    English text here
  </p>
  <p className="text-xl font-semibold text-foreground/90">
    Vietnamese text here
  </p>
</div>
```

Or inline:
```tsx
<span>English / Vietnamese</span>
```

---

## 3. CARD COMPONENTS

### 3.1 Standard Card
```tsx
<Card className="p-6 transition-all hover:shadow-hover hover:scale-105">
  {/* Content */}
</Card>
```

### 3.2 Room Card (Grid View)
```tsx
<Card
  className="relative p-3 transition-all duration-300 cursor-pointer group hover:scale-110 hover:shadow-hover hover:z-10"
  onClick={handleRoomClick}
>
  {/* Status Badge - Top Right */}
  <div className="absolute top-1 right-1 z-10">
    {hasData ? (
      <div className="bg-green-500 rounded-full p-1">
        <CheckCircle2 className="w-3 h-3 text-white" />
      </div>
    ) : (
      <div className="bg-gray-400 rounded-full p-1">
        <Lock className="w-3 h-3 text-white" />
      </div>
    )}
  </div>

  <div className="space-y-2">
    {/* Room Names */}
    <div className="space-y-1">
      <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
        English Name
      </p>
      <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
        Vietnamese Name
      </p>
    </div>
  </div>

  {/* Hover Effect */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
</Card>
```

### 3.3 Gradient Info Card
```tsx
<Card className="max-w-4xl mx-auto mt-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
  <div className="p-8 space-y-6">
    {/* Content */}
  </div>
</Card>
```

---

## 4. BUTTON VARIANTS

### 4.1 Primary Button
```tsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Button Text
</Button>
```

### 4.2 Outline Button
```tsx
<Button variant="outline" className="border-2 border-primary/50 hover:bg-primary/10">
  Button Text
</Button>
```

### 4.3 Gradient Button
```tsx
<Button className="bg-gradient-to-r from-primary to-accent">
  Button Text
</Button>
```

### 4.4 Golden Arrow Button (Subscription Tiers)
```tsx
<Button
  className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 hover:opacity-90"
  size="icon"
>
  <ArrowRight className="w-6 h-6 text-white" />
</Button>
```

**Variants for different tiers**:
- Free (index 0): `from-yellow-200 via-yellow-400 to-yellow-600`
- VIP1 (index 1): `from-yellow-300 via-yellow-500 to-yellow-700`
- VIP2 (index 2): `from-yellow-400 via-yellow-600 to-yellow-800`
- VIP3 (index 3): `from-yellow-500 via-yellow-700 to-yellow-900`

---

## 5. BADGE COMPONENTS

### 5.1 Standard Badge
```tsx
<Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
  Badge Text
</Badge>
```

### 5.2 Tier Badges
```tsx
// Free
<Badge className="bg-primary/10 text-primary border-primary/20">FREE</Badge>

// VIP1
<Badge className="bg-secondary/10 text-secondary border-secondary/20">VIP1</Badge>

// VIP2
<Badge className="bg-accent/10 text-accent border-accent/20">VIP2</Badge>

// VIP3
<Badge className="bg-gradient-to-r from-accent to-primary text-white border-accent">VIP3</Badge>
```

### 5.3 Status Badge
```tsx
<Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
  <CheckCircle2 className="w-3 h-3 mr-1" />
  Ready / Sẵn Sàng
</Badge>
```

---

## 6. LAYOUT PATTERNS

### 6.1 Page Container
```tsx
<div className="min-h-screen" style={{ background: 'hsl(var(--page-welcome))' }}>
  <div className="container mx-auto px-4 py-8 max-w-7xl">
    {/* Content */}
  </div>
</div>
```

**Background colors by page type**:
- Welcome: `hsl(var(--page-welcome))`
- All Rooms: `hsl(var(--page-allrooms))`
- Room Grid: `hsl(var(--page-roomgrid))`
- VIP1 Rooms: `hsl(var(--page-vip1))`
- VIP2 Rooms: `hsl(var(--page-vip2))`
- VIP3 Rooms: `hsl(var(--page-vip3))`
- Chat Hub: Dynamic based on room tier

### 6.2 Hero Section
```tsx
<div className="text-center mb-16 space-y-6">
  <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
    Mercy Blade
  </h1>
  
  <div className="space-y-2 max-w-3xl mx-auto">
    <p className="text-xl font-semibold text-foreground/90">
      English description
    </p>
    <p className="text-xl font-semibold text-foreground/90">
      Vietnamese description
    </p>
  </div>
</div>
```

### 6.3 Grid Layout (Room Cards)
```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
  {rooms.map((room) => (
    <Card key={room.id} className="...">
      {/* Room card content */}
    </Card>
  ))}
</div>
```

### 6.4 Subscription Tiers Grid
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
  {tiers.map((tier) => (
    <Card key={tier.name} className="relative p-6 transition-all hover:shadow-hover hover:scale-105 flex flex-col">
      {/* Tier content */}
    </Card>
  ))}
</div>
```

---

## 7. CHAT INTERFACE

### 7.1 Message Bubble (User)
```tsx
<div className="flex justify-end mb-4">
  <div className="max-w-[80%] group">
    <div className="rounded-2xl px-4 py-3 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
      <span className="text-xs opacity-70 mt-1 block">
        {message.timestamp.toLocaleTimeString()}
      </span>
    </div>
  </div>
</div>
```

### 7.2 Message Bubble (AI/System)
```tsx
<div className="flex justify-start mb-4">
  <div className="max-w-[80%] group">
    <div className="rounded-2xl px-4 py-3 bg-card border shadow-sm">
      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
    </div>
    
    {/* Message Actions Component Below */}
    <MessageActions text={message.text} roomId={roomId} />
    
    {/* Related Rooms if applicable */}
    {message.relatedRooms && message.relatedRooms.length > 0 && (
      <RelatedRooms roomNames={message.relatedRooms} />
    )}
  </div>
</div>
```

### 7.3 Chat Input Area
```tsx
<div className="p-4 bg-card rounded-lg border shadow-sm">
  <div className="flex gap-2">
    <Input
      placeholder="Type your message / Nhập tin nhắn..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      className="flex-1"
    />
    <Button 
      onClick={sendMessage}
      disabled={!input.trim() || isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Send className="w-4 h-4" />
      )}
    </Button>
  </div>
</div>
```

---

## 8. HEADER & NAVIGATION

### 8.1 Page Header with Back Button
```tsx
<div className="flex items-center justify-between bg-card rounded-lg p-4 shadow-soft">
  <div className="flex gap-2">
    <Button
      variant="ghost"
      onClick={() => navigate("/rooms")}
      className="gap-2"
    >
      <ArrowLeft className="w-4 h-4" />
      Back / Quay Lại
    </Button>
  </div>
  
  <div className="text-center space-y-2">
    <h2 className="text-xl font-bold text-foreground">Room Name EN</h2>
    <p className="text-sm text-muted-foreground">Room Name VI</p>
  </div>
  
  <div className="flex gap-2">
    {/* Right side buttons */}
  </div>
</div>
```

### 8.2 Welcome Page Header
```tsx
<div className="flex justify-between items-center mb-4">
  <Button 
    variant="outline"
    onClick={() => navigate("/")}
    className="border-2 border-primary/50 hover:bg-primary/10"
  >
    Home Page / Trang Chủ
  </Button>
  
  <div className="flex items-center gap-3">
    <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
      <User className="h-4 w-4 text-primary" />
      <span className="font-medium">{username}</span>
    </div>
    <Button variant="outline" onClick={handleLogout} size="sm">
      <LogOut className="h-4 w-4 mr-2" />
      Logout / Đăng xuất
    </Button>
  </div>
</div>
```

---

## 9. PROGRESS & STATUS INDICATORS

### 9.1 Credits Display
```tsx
<Badge variant="outline" className="text-primary border-current">
  <div className="flex items-center gap-1">
    <Infinity className="h-3 w-3" />
    <span>Unlimited / Không giới hạn</span>
  </div>
</Badge>

// Or with counts
<Badge variant="outline" className="text-primary border-current">
  <div className="flex items-center gap-1">
    <AlertCircle className="h-3 w-3" />
    <span>{used}/{limit} questions (Today)</span>
  </div>
</Badge>
```

### 9.2 Room Progress
```tsx
<div className="flex items-center gap-4 px-4 py-2 bg-accent/20 rounded-lg border border-accent/30">
  <div className="flex items-center gap-2">
    <Target className="w-4 h-4 text-primary" />
    <span className="text-sm font-medium">
      {totalRooms} topics explored
    </span>
  </div>
  
  {streak > 1 && (
    <div className="flex items-center gap-2">
      <TrendingUp className="w-4 w-4 text-primary" />
      <Badge variant="secondary" className="text-xs">
        {streak} day streak! 🔥
      </Badge>
    </div>
  )}
</div>
```

---

## 10. INTERACTIVE ELEMENTS

### 10.1 Toggle Group (Content Mode Selector)
```tsx
<ToggleGroup 
  type="single" 
  value={contentMode} 
  onValueChange={(value) => setContentMode(value)}
  className="bg-card p-1 rounded-lg"
>
  <ToggleGroupItem value="keyword" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
    📚 Keyword
  </ToggleGroupItem>
  <ToggleGroupItem value="ai" className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
    🤖 AI
  </ToggleGroupItem>
</ToggleGroup>
```

### 10.2 Tooltip Wrapper
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button disabled={!hasAccess}>
        VIP1 Rooms
      </Button>
    </TooltipTrigger>
    {!hasAccess && (
      <TooltipContent>
        <p>Only for VIP1</p>
      </TooltipContent>
    )}
  </Tooltip>
</TooltipProvider>
```

### 10.3 Scroll Area
```tsx
<ScrollArea className="h-[600px] rounded-md">
  {/* Content */}
</ScrollArea>
```

---

## 11. DISCLAIMERS & INFO CARDS

### 11.1 Common Disclaimer
```tsx
<Card className="max-w-4xl mx-auto mt-12 p-3 bg-primary/5 dark:bg-primary/10 border-primary/20">
  <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
    <p>
      This app provides general wellness guidance and educational content. 
      It is NOT a substitute for professional medical, psychological, or financial advice.
    </p>
    <p>
      [Vietnamese translation]
    </p>
  </div>
</Card>
```

### 11.2 VIP Info Banner
```tsx
<div className="text-center mt-8 p-4 max-w-2xl mx-auto">
  <p className="text-sm text-muted-foreground">
    🌟 VIP members can request custom topics tailored to their needs
  </p>
  <p className="text-xs text-muted-foreground">
    Thành viên VIP có thể yêu cầu chủ đề tùy chỉnh theo nhu cầu
  </p>
</div>
```

---

## 12. ANIMATION & TRANSITION PATTERNS

### 12.1 Hover Animations
```tsx
className="transition-all duration-300 hover:scale-110 hover:shadow-hover hover:z-10"
```

### 12.2 Loading Spinner
```tsx
{isLoading && (
  <Loader2 className="w-4 h-4 animate-spin" />
)}
```

### 12.3 Fade-in Effect
```tsx
className="opacity-0 group-hover:opacity-100 transition-opacity"
```

---

## 13. RESPONSIVE DESIGN BREAKPOINTS

### 13.1 Grid Responsiveness
```tsx
className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
```

### 13.2 Subscription Tiers Responsiveness
```tsx
className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
```

### 13.3 Button Group Responsiveness
```tsx
className="flex justify-center items-center gap-4 pt-8 flex-wrap"
```

---

## 14. ICON USAGE

### 14.1 Common Icons (from lucide-react)
- **Navigation**: `ArrowLeft`, `ArrowRight`, `Home`
- **Status**: `CheckCircle2`, `Lock`, `AlertCircle`
- **Features**: `Sparkles`, `MessageCircle`, `Users`, `Mail`
- **Actions**: `Send`, `LogOut`, `User`, `Loader2`
- **Progress**: `Target`, `TrendingUp`, `BarChart3`
- **Misc**: `Infinity`, `Shield`

### 14.2 Icon Sizing
- Small: `w-3 h-3` or `w-4 h-4`
- Medium: `w-5 h-5` or `w-6 h-6`
- Large: `w-8 h-8`

---

## 15. SHADOW & DEPTH SYSTEM

### 15.1 Soft Shadow (Default Cards)
```tsx
className="shadow-sm"
// Or use CSS custom property
style={{ boxShadow: 'var(--shadow-soft)' }}
```

### 15.2 Hover Shadow (Interactive Cards)
```tsx
className="hover:shadow-hover"
// Or use CSS custom property
style={{ boxShadow: 'var(--shadow-hover)' }}
```

---

## 16. SPACING SYSTEM

### 16.1 Container Padding
```tsx
className="px-4 py-8"  // Standard page padding
className="p-6"         // Card padding
className="p-3"         // Compact card padding
```

### 16.2 Section Spacing
```tsx
className="space-y-6"   // Standard section spacing
className="space-y-2"   // Tight spacing
className="space-y-8"   // Large spacing
className="gap-3"       // Grid gap
```

---

## 17. CRITICAL STYLING RULES

### ❌ NEVER DO:
1. **DO NOT** use direct color values like `text-white`, `bg-blue-500`, `text-black`
2. **DO NOT** use RGB colors - only HSL
3. **DO NOT** hardcode colors outside the design token system
4. **DO NOT** skip the gradient text for main headings
5. **DO NOT** forget bilingual text patterns

### ✅ ALWAYS DO:
1. **ALWAYS** use semantic tokens: `text-foreground`, `bg-primary`, `text-muted-foreground`
2. **ALWAYS** use HSL format: `hsl(var(--primary))`
3. **ALWAYS** include both English and Vietnamese text
4. **ALWAYS** use the exact gradient patterns specified
5. **ALWAYS** include proper hover states and transitions
6. **ALWAYS** use the page-specific background colors
7. **ALWAYS** maintain the exact spacing and sizing

---

## 18. COMPONENT-SPECIFIC PATTERNS

### 18.1 Subscription Tier Card Complete Pattern
```tsx
<Card className="relative p-6 transition-all hover:shadow-hover hover:scale-105 flex flex-col">
  <div className="space-y-4 flex flex-col flex-grow">
    <div className="space-y-1">
      <h3 className="text-xl font-bold text-foreground">{tier.name.en}</h3>
      <p className="text-sm text-muted-foreground">{tier.name.vi}</p>
    </div>

    <div className="flex items-baseline gap-1">
      <span className="text-4xl font-bold text-primary">{tier.price}</span>
      {tier.period && (
        <span className="text-muted-foreground">{tier.period.vi}</span>
      )}
    </div>

    <div className="space-y-3 pt-4 flex-grow">
      {tier.features.en.map((feature, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-foreground">{feature}</span>
          </div>
          <div className="pl-7 text-xs text-muted-foreground">
            {tier.features.vi[idx]}
          </div>
        </div>
      ))}
    </div>

    <div className="mt-auto pt-4 flex justify-center">
      <Button className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 hover:opacity-90" size="icon">
        <ArrowRight className="w-6 h-6 text-white" />
      </Button>
    </div>
  </div>
</Card>
```

---

## 19. ALERT DIALOGS

### 19.1 Access Denied Dialog
```tsx
<AlertDialog open={showAccessDenied} onOpenChange={setShowAccessDenied}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>VIP Only / Chỉ Dành Cho VIP</AlertDialogTitle>
      <AlertDialogDescription className="space-y-2">
        <p>This room is for VIP members only. Please upgrade your subscription.</p>
        <p className="text-sm">Phòng này chỉ dành cho thành viên VIP...</p>
        <p className="font-semibold mt-4">Required tier: {tier}</p>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction onClick={handleClose}>
        Go Back / Quay Lại
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## 20. FINAL CHECKLIST

When implementing the UI, verify:

- [ ] All colors are defined as HSL in CSS custom properties
- [ ] No hardcoded color values (no `text-white`, `bg-blue-500`, etc.)
- [ ] All main headings use the gradient text effect
- [ ] Page backgrounds use the correct page-specific colors
- [ ] Bilingual text is present for all user-facing content
- [ ] Hover effects and transitions are smooth (300ms ease)
- [ ] Cards have proper shadow-soft and shadow-hover
- [ ] Icons are from lucide-react with proper sizing
- [ ] Spacing follows the spacing system
- [ ] Buttons use the correct variants
- [ ] Badges have proper styling based on tier/type
- [ ] Tooltips are wrapped in TooltipProvider
- [ ] Responsive grid layouts work across breakpoints
- [ ] Message bubbles have correct rounded corners and gradients
- [ ] Status indicators (checkmarks, locks) are positioned correctly

---

## 21. EXAMPLE: COMPLETE ROOM GRID PAGE STRUCTURE

```tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RoomGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--page-roomgrid))' }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              ← Back / Quay Lại
            </Button>
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Choose Your Learning Room
            </h1>
            <p className="text-lg text-muted-foreground">
              Chọn Phòng Học Của Bạn
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Ready / Sẵn Sàng
            </Badge>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="relative p-3 transition-all duration-300 cursor-pointer group hover:scale-110 hover:shadow-hover hover:z-10"
              onClick={() => handleRoomClick(room)}
            >
              {/* Status Badge */}
              <div className="absolute top-1 right-1 z-10">
                <div className="bg-green-500 rounded-full p-1">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
                    {room.nameEn}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                    {room.nameVi}
                  </p>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 space-y-1">
          <p className="text-sm text-muted-foreground">
            Rooms with ✓ are ready for learning
          </p>
          <p className="text-xs text-muted-foreground">
            Các Phòng Có ✓ Đã Sẵn Sàng Để Học
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomGrid;
```

---

**END OF UI SPECIFICATION GUIDE**

Use this guide as a reference to recreate the exact visual appearance of the Mercy Blade application. Every component, color, spacing, and interaction pattern is documented here for precise replication.
