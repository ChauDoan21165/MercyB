# Design Replication Prompt for Mercy Blade App

## Color System (HSL Format Only)

### Base Colors
```css
--background: 220 15% 6%
--foreground: 210 40% 98%
--primary: 262 83% 58%
--primary-foreground: 210 40% 98%
--secondary: 220 14% 14%
--secondary-foreground: 210 40% 98%
--accent: 220 14% 20%
--accent-foreground: 210 40% 98%
--muted: 220 14% 14%
--muted-foreground: 215 20% 65%
--border: 220 13% 18%
--input: 220 13% 18%
--card: 220 15% 9%
--card-foreground: 210 40% 98%
```

### VIP Tier Colors
- **VIP1**: `262 83% 58%` (purple)
- **VIP2**: `291 64% 42%` (deep purple)
- **VIP3**: `43 96% 56%` (gold)

### Gradients
- Primary gradient: `linear-gradient(135deg, hsl(262 83% 58%), hsl(291 64% 42%))`
- VIP3 gradient: `linear-gradient(135deg, hsl(43 96% 56%), hsl(38 92% 50%))`

## Typography

### Font Sizes
- **Hero Title**: `text-4xl md:text-5xl lg:text-6xl` (36-60px)
- **Page Title**: `text-3xl md:text-4xl` (30-36px)
- **Section Title**: `text-2xl md:text-3xl` (24-30px)
- **Card Title**: `text-xl md:text-2xl` (20-24px)
- **Body Text**: `text-base` (16px)
- **Small Text**: `text-sm` (14px)
- **Badge/Caption**: `text-xs` (12px)

### Font Weights
- Headings: `font-bold` (700)
- Subheadings: `font-semibold` (600)
- Body: `font-normal` (400)

### Bilingual Text Pattern
Always show Vietnamese first, English second:
```tsx
<h1>Vietnamese Text / English Text</h1>
```

## Layout & Spacing

### Container
```tsx
<div className="min-h-screen bg-background p-4 md:p-8">
```

### Page Structure
```tsx
{/* Header with navigation */}
<div className="flex items-center justify-between mb-6 md:mb-8">
  {/* Back button, title, actions */}
</div>

{/* Content area */}
<div className="max-w-7xl mx-auto">
  {/* Main content */}
</div>
```

### Grid Layouts
- **Room Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6`
- **Card Grid**: `grid gap-4 md:gap-6`

### Spacing Scale
- Extra small: `gap-2` (8px)
- Small: `gap-4` (16px)
- Medium: `gap-6` (24px)
- Large: `gap-8` (32px)

## Component Styling

### Cards (Room/Feature Cards)
```tsx
<Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm">
  <CardHeader className="space-y-2">
    <CardTitle className="text-xl md:text-2xl text-foreground">
      Title Text
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Content */}
  </CardContent>
</Card>
```

### Badges (Status/Tier Indicators)
```tsx
{/* Free tier */}
<Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
  FREE
</Badge>

{/* VIP1 */}
<Badge className="bg-gradient-to-r from-purple-500 to-purple-700 text-white border-0">
  VIP1
</Badge>

{/* VIP3 */}
<Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-0">
  VIP3
</Badge>
```

### Buttons
```tsx
{/* Primary */}
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Text
</Button>

{/* Outline */}
<Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10">
  Text
</Button>

{/* Icon Button */}
<Button size="icon" variant="outline" className="h-10 w-10">
  <Icon />
</Button>
```

### Icons
- Size: `className="w-5 h-5"` (20px) for buttons
- Size: `className="w-6 h-6"` (24px) for headers
- Always use Lucide React icons

## Positioning Rules

### Header Navigation
```tsx
<div className="flex items-center gap-2 md:gap-4">
  {/* Back button on left */}
  <Button variant="outline" size="icon">
    <ChevronLeft className="w-5 h-5" />
  </Button>
  
  {/* Actions on right */}
  <div className="ml-auto flex gap-2">
    <Button>Action</Button>
  </div>
</div>
```

### Centered Content
```tsx
<div className="flex flex-col items-center justify-center text-center space-y-4">
  {/* Hero content */}
</div>
```

### Status Indicators
Position: Top-right of cards
```tsx
<div className="absolute top-4 right-4">
  <Badge>Status</Badge>
</div>
```

## Responsive Breakpoints

- Mobile: Default (< 768px)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)
- Wide: `xl:` (1280px+)

### Responsive Patterns
- Padding: `p-4 md:p-6 lg:p-8`
- Text: `text-base md:text-lg lg:text-xl`
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Flex direction: `flex-col md:flex-row`

## Animation & Transitions

### Hover Effects
```tsx
className="transition-all duration-300 hover:scale-105 hover:shadow-xl"
```

### Card Hover
```tsx
className="hover:border-primary/50 hover:bg-card/80 transition-all duration-300"
```

### Button Hover
```tsx
className="transition-colors duration-200 hover:bg-primary/90"
```

## Critical Design Rules

1. **Always use HSL colors** - Never use hex or rgb
2. **Use semantic tokens** - Reference CSS variables from index.css
3. **Bilingual text** - Vietnamese / English format
4. **Consistent spacing** - Use Tailwind spacing scale
5. **Card-based layout** - Most content in Card components
6. **Backdrop blur** - Use `backdrop-blur-sm` for glass effects
7. **Border transparency** - Use `border-border/50` for subtle borders
8. **Gradient text** - Use `bg-gradient-to-r from-X to-Y bg-clip-text text-transparent`
9. **Responsive by default** - Always include md: and lg: breakpoints
10. **Dark theme first** - Design for dark mode as primary

## Example: Complete Room Card

```tsx
<Card className="relative group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm">
  {/* Status Badge */}
  <div className="absolute top-4 right-4 z-10">
    <Badge className="bg-gradient-to-r from-purple-500 to-purple-700 text-white border-0">
      VIP1
    </Badge>
  </div>
  
  <CardHeader className="space-y-3">
    {/* Icon */}
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
      <BookOpen className="w-6 h-6 text-primary" />
    </div>
    
    {/* Title */}
    <CardTitle className="text-xl md:text-2xl text-foreground">
      Tiêu đề Việt / English Title
    </CardTitle>
  </CardHeader>
  
  <CardContent className="space-y-4">
    {/* Status Indicator */}
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <CheckCircle2 className="w-4 h-4 text-green-500" />
      <span>Sẵn sàng / Ready</span>
    </div>
  </CardContent>
</Card>
```
