# Kids Room System

This is a systematic, reusable component system for all Kids English rooms. It provides:
- **Consistent rainbow gradient styling** (Mercy Blade theme)
- **Back navigation arrow** to previous page
- **Refresh functionality** to reload room data
- **Bilingual layout** (English + Vietnamese)
- **Uniform card styling** with room color borders

## How to Create a New Kids Room

### 1. Create your room component

```tsx
import { KidsRoomProvider } from '@/contexts/KidsRoomContext';
import { KidsRoomLayout } from './KidsRoomLayout';
import { KidsRoomContent } from './KidsRoomContent';
import { useKidsRoom } from '@/hooks/useKidsRoom';

const YourRoomContent = () => {
  // Load your room JSON file
  useKidsRoom('your_room_id');

  return (
    <KidsRoomLayout backPath="/kids-design-pack" showRefresh={true}>
      <KidsRoomContent />
    </KidsRoomLayout>
  );
};

export const YourRoomViewer = () => {
  return (
    <KidsRoomProvider>
      <YourRoomContent />
    </KidsRoomProvider>
  );
};
```

### 2. Place your room JSON file in `/public/data/`

Example: `/public/data/your_room_id.json`

### 3. Add to routing

Update your routing to include the new room component.

## Components

### KidsRoomProvider
Context provider that manages room state, loading, and errors.

### KidsRoomLayout
Main layout wrapper that provides:
- Back button with arrow
- Refresh button
- Rainbow gradient titles
- Room header with bilingual content
- Room color border styling

### KidsRoomContent
Displays all room activities with:
- Rainbow gradient activity titles
- Bilingual content (EN + VI)
- Keywords and tags
- Audio file references

### useKidsRoom Hook
Custom hook for loading room data. Pass the room ID to automatically fetch and load the room.

## Styling

All styling uses:
- `bg-[image:var(--gradient-rainbow)]` for rainbow gradients
- `bg-clip-text text-transparent` for gradient text
- Room color from JSON for card borders
- Consistent spacing and layout

## Features

- ✅ Automatic room data loading
- ✅ Loading and error states
- ✅ Refresh functionality
- ✅ Back navigation
- ✅ Rainbow gradient styling
- ✅ Bilingual support
- ✅ Responsive layout
