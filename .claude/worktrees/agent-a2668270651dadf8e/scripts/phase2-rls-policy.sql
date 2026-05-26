-- Phase 2: RLS policy for Supabase Storage bucket `room-audio`.
--
-- Apply this in the Supabase dashboard:
--   SQL Editor → New query → paste → Run
--
-- What it does:
--   * Allows any authenticated session (including anonymous sessions) to read
--     objects from the `room-audio` bucket. Reading here means the session can
--     call createSignedUrl() to get a short-lived playback URL.
--   * Blocks unauthenticated (no JWT) requests entirely.
--   * No write/update/delete policy — uploads happen via SUPABASE_SERVICE_ROLE_KEY
--     from the upload script, which bypasses RLS by design.
--
-- Before running this, make sure the bucket exists:
--   Dashboard → Storage → New bucket → name: room-audio → Public: OFF → Save
--   (or let the upload script create it via createBucket, which runs first.)

-- Enable RLS on storage.objects if not already on (safe to run repeatedly).
alter table storage.objects enable row level security;

-- Drop any older version of this policy so re-running is idempotent.
drop policy if exists "room_audio_authenticated_read" on storage.objects;

create policy "room_audio_authenticated_read"
  on storage.objects
  for select
  to authenticated
  using ( bucket_id = 'room-audio' );

-- Optional: if you want tier-gated access later (e.g. only VIP3+ users can read
-- VIP3 audio), replace the policy above with something like this (pseudocode):
--
-- create policy "room_audio_tier_gated_read"
--   on storage.objects
--   for select
--   to authenticated
--   using (
--     bucket_id = 'room-audio'
--     and (
--       -- free content: filenames containing "_free" are open to all auth users
--       name ~ '_free\.mp3$'
--       or exists (
--         select 1 from public.profiles p
--         where p.id = auth.uid()
--           and p.tier >= case
--             when name ~ 'vip1' then 1
--             when name ~ 'vip2' then 2
--             when name ~ 'vip3' then 3
--             when name ~ 'vip4' then 4
--             else 9
--           end
--       )
--     )
--   );
