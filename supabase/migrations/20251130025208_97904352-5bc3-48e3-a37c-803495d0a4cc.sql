-- Drop existing policies if they exist
drop policy if exists "Admins can manage feature flags" on feature_flags;
drop policy if exists "Anyone can view feature flags" on feature_flags;

-- Recreate the policies
create policy "Admins can manage feature flags"
on feature_flags
for all
using (has_role(auth.uid(), 'admin'));

create policy "Anyone can view feature flags"
on feature_flags
for select
using (true);

-- Create room health view for monitoring
create or replace view room_health_view as
select
  r.id as room_id,
  r.id as slug,
  r.tier,
  r.title_en,
  r.title_vi,
  100 as health_score,
  0 as audio_coverage,
  false as is_low_health,
  false as has_zero_audio
from rooms r;