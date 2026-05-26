# Kids Room Profile Design Pattern

## Compact Profile Design (VIP3 Style)

When building new Kids Levels or VIP rooms, use this compact profile pattern instead of large card-based profiles.

### Design Pattern

```tsx
{/* User Profile Info - Compact VIP3 Style */}
{userProfile && (
  <div className="flex items-center justify-center gap-2 text-xs font-medium text-primary">
    <ProfileAvatarUpload
      currentAvatarUrl={userProfile.avatar_url}
      onUploadSuccess={(url) => setUserProfile({ ...userProfile, avatar_url: url })}
    />
    <span>{userProfile.full_name || userProfile.username || 'Student'}</span>
    {userSubscription && (
      <span className="font-semibold">{userSubscription.kids_levels.name_en}</span>
    )}
    <span>•</span>
    <span>{roomsExplored} {roomsExplored === 1 ? 'room' : 'rooms'} explored 🎨</span>
  </div>
)}
```

### Key Features

1. **Single Line Layout**: All info inline, no vertical stacking
2. **Small Text**: Uses `text-xs` for compact display
3. **Centered**: `justify-center` keeps it balanced
4. **Minimal Gap**: `gap-2` spacing between elements
5. **Bullet Separator**: `•` character separates sections
6. **Icon Enhancement**: Emoji at end adds personality without clutter

### Benefits

- **Space Efficient**: Takes minimal vertical space
- **Clean Look**: Doesn't overwhelm the page
- **Mobile Friendly**: Wraps gracefully on small screens
- **Consistent**: Matches VIP3 room design pattern

### When to Use

- Kids Level 1, 2, 3+ rooms
- VIP room redesigns
- Any room where screen space is valuable
- Mobile-first designs

### Example References

- **Good**: `src/pages/ChatHub.tsx` (lines 783-794)
- **Good**: `src/pages/KidsChat.tsx` (after refactor)
- **Old Pattern** (avoid): Large Card with two-column layout

### Avoid

❌ Large Card components for profiles
❌ Two-column layouts (avatar left, stats right)
❌ Multiple lines of text taking vertical space
❌ Verbose text like "0 rooms explored" → Use numbers with singular/plural

✅ Inline, single-row design
✅ Compact text with icons
✅ Centered alignment
✅ Smart singular/plural handling
