# Supabase Storage Security

## Overview
This document describes the security policies for all Supabase storage buckets in the Mercy Blade application.

---

## Bucket Inventory

### 1. `room-audio` (Private)

**Purpose:** Store audio files for room entries (TTS-generated)

**Security Model:**
- **Public Read:** YES (audio files are publicly accessible)
- **Write Access:** Server-side only via edge functions
- **Delete Access:** Admin only

**RLS Policies:**
```sql
-- Allow public read access to audio files
CREATE POLICY "public_read_room_audio"
ON storage.objects
FOR SELECT
USING (bucket_id = 'room-audio');

-- Only admins and edge functions can upload
CREATE POLICY "admin_upload_room_audio"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'room-audio'
  AND has_role(auth.uid(), 'admin')
);

-- Only admins can delete
CREATE POLICY "admin_delete_room_audio"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'room-audio'
  AND has_role(auth.uid(), 'admin')
);
```

**Safety:** ⚠️ NEEDS REVIEW
- **Issue:** Audio files are public but should be tier-gated
- **Recommendation:** Consider moving to private bucket with signed URLs
- **Alternative:** Use CDN with authentication headers

---

### 2. `payment-proofs` (Private)

**Purpose:** Store screenshots of payment confirmations

**Security Model:**
- **Public Read:** NO
- **Write Access:** Authenticated users (own submissions only)
- **Admin Access:** Full access for verification

**RLS Policies:**
```sql
-- Users can upload their own payment proofs
CREATE POLICY "users_upload_own_proofs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'payment-proofs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own proofs
CREATE POLICY "users_view_own_proofs"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'payment-proofs'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR has_role(auth.uid(), 'admin')
  )
);

-- Only admins can delete
CREATE POLICY "admins_delete_proofs"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'payment-proofs'
  AND has_role(auth.uid(), 'admin')
);
```

**Safety:** ✅ SAFE
- Users can only upload to their own folder (`/{user_id}/filename.png`)
- Users can only see their own submissions
- Admins have full access for verification

---

### 3. `avatars` (Public)

**Purpose:** Store user profile pictures

**Security Model:**
- **Public Read:** YES (avatars are public)
- **Write Access:** Authenticated users (own avatar only)
- **Admin Access:** Full access

**RLS Policies:**
```sql
-- Anyone can view avatars
CREATE POLICY "public_read_avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- Users can upload their own avatar
CREATE POLICY "users_upload_own_avatar"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own avatar
CREATE POLICY "users_update_own_avatar"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own avatar
CREATE POLICY "users_delete_own_avatar"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'avatars'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR has_role(auth.uid(), 'admin')
  )
);
```

**Safety:** ✅ SAFE
- Avatars are public by design
- Users can only modify their own avatar
- Proper folder isolation using user ID

---

### 4. `user-music` (Private)

**Purpose:** Store user-uploaded music files

**Security Model:**
- **Public Read:** NO
- **Write Access:** Authenticated users (own uploads only)
- **Admin Access:** Full access for moderation

**RLS Policies:**
```sql
-- Users can view their own music
CREATE POLICY "users_view_own_music"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'user-music'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR has_role(auth.uid(), 'admin')
  )
);

-- Users can upload their own music
CREATE POLICY "users_upload_own_music"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'user-music'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own music
CREATE POLICY "users_delete_own_music"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'user-music'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR has_role(auth.uid(), 'admin')
  )
);
```

**Safety:** ✅ SAFE
- Users can only access their own music
- Admins have access for content moderation
- Private bucket prevents unauthorized access

---

### 5. `room-audio-uploads` (Private)

**Purpose:** Temporary storage for admin-uploaded room audio

**Security Model:**
- **Public Read:** NO
- **Write Access:** Admin only
- **Admin Access:** Full access

**RLS Policies:**
```sql
-- Only admins can access
CREATE POLICY "admin_full_access_audio_uploads"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'room-audio-uploads'
  AND has_role(auth.uid(), 'admin')
);
```

**Safety:** ✅ SAFE
- Admin-only bucket
- Used for staging audio before moving to `room-audio`

---

## Security Best Practices

### Folder Structure
All private buckets use user-scoped folders:
```
/{user_id}/filename.ext
```

This ensures:
- Path traversal is prevented
- Users cannot access other users' files
- Policies are simple and enforceable

### File Size Limits
Set appropriate limits on each bucket:
- `avatars`: 5MB max
- `payment-proofs`: 10MB max
- `user-music`: 50MB max
- `room-audio`: 10MB max per file

### Content Type Validation
Restrict allowed MIME types:
- `avatars`: `image/jpeg`, `image/png`, `image/webp`
- `payment-proofs`: `image/jpeg`, `image/png`
- `user-music`: `audio/mpeg`, `audio/wav`
- `room-audio`: `audio/mpeg`

---

## Required Actions

### High Priority

1. **Implement CDN/Signed URLs for room-audio**
   - Premium content should not be directly accessible
   - Use signed URLs with expiration
   - Validate tier before generating signed URL

2. **Add file size validation**
   - Currently no server-side enforcement
   - Add size checks in upload endpoints

3. **Add content type validation**
   - Prevent malicious file uploads
   - Validate MIME type server-side

### Example: Signed URL Generation

```typescript
// In edge function or server-side
export async function getSignedAudioUrl(
  roomId: string,
  audioFilename: string,
  userTier: string
): Promise<string> {
  // 1. Validate user has access to room tier
  const roomTier = await getRoomTier(roomId);
  if (!canAccessTier(userTier, roomTier)) {
    throw new Error('ACCESS_DENIED_INSUFFICIENT_TIER');
  }

  // 2. Generate signed URL with 1-hour expiration
  const { data, error } = await supabase
    .storage
    .from('room-audio')
    .createSignedUrl(`${roomId}/${audioFilename}`, 3600);

  if (error) throw error;
  return data.signedUrl;
}
```

---

## Monitoring & Audit

### Metrics to Track
- Unusual upload patterns (rate, size)
- Failed access attempts
- Admin access to user files
- Storage usage per user

### Alerts
- User exceeding upload quota
- Multiple failed access attempts
- Suspicious file types uploaded

---

## Review Checklist

When adding a new bucket or modifying policies:

- [ ] Is the bucket public or private?
- [ ] Are RLS policies restricting access properly?
- [ ] Are users isolated to their own folders?
- [ ] Are file size limits enforced?
- [ ] Are content types validated?
- [ ] Is admin access logged?
- [ ] Are signed URLs used for premium content?
