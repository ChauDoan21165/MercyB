-- Daily pronunciation challenges.
--
-- One bite-sized prompt per day. The 60 challenges themselves live in
-- `src/data/pronunciation-challenges` (hand-curated content, not LLM
-- generated) and are inserted as a static seed by this migration. We
-- store them in the database (rather than only in app code) so:
--   - Completions can FK to a stable challenge id without re-deploys.
--   - Future admin tooling can adjust difficulty / phoneme tags
--     without a code release.
--   - Server-side "today's challenge" picking can run in SQL via
--     `pick_todays_challenge`.
--
-- Privacy posture:
--   - daily_challenges: PUBLIC SELECT (content is not sensitive).
--   - user_challenge_completion: per-user RLS — each row is owned by
--     `user_id = auth.uid()`. Service role bypasses for admin reports.
--
-- Streak integration: completing a daily challenge writes a row into
-- `user_challenge_completion`. The existing streak trigger on
-- `user_room_progress` is the canonical study-event signal; we add an
-- AFTER-INSERT trigger on `user_challenge_completion` that mirrors a
-- minimal study-event row into `user_room_progress` so the existing
-- streak math counts challenge completion as a study day without
-- duplicating any logic.
--
-- Reversibility:
--   DROP TRIGGER IF EXISTS daily_challenge_streak_trigger ON public.user_challenge_completion;
--   DROP FUNCTION IF EXISTS public.touch_streak_on_challenge();
--   DROP FUNCTION IF EXISTS public.pick_todays_challenge(uuid);
--   DROP TABLE IF EXISTS public.user_challenge_completion;
--   DROP TABLE IF EXISTS public.daily_challenges;

-- ── daily_challenges ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id text PRIMARY KEY,
  type text NOT NULL,
  content_en text NOT NULL,
  content_vi_explanation text NOT NULL,
  target_phonemes text[] NOT NULL DEFAULT ARRAY[]::text[],
  difficulty text NOT NULL DEFAULT 'medium',
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (type IN ('tongue_twister', 'minimal_pair', 'phoneme_targeted')),
  CHECK (difficulty IN ('easy', 'medium', 'hard')),
  CHECK (length(content_en) > 0)
);

COMMENT ON TABLE public.daily_challenges IS
  'Daily pronunciation challenges. 60 entries seeded by migration 20260607. PUBLIC SELECT.';

CREATE INDEX IF NOT EXISTS daily_challenges_type_idx
  ON public.daily_challenges (type);
CREATE INDEX IF NOT EXISTS daily_challenges_phonemes_idx
  ON public.daily_challenges USING gin (target_phonemes);

ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS daily_challenges_select_all ON public.daily_challenges;
CREATE POLICY daily_challenges_select_all
  ON public.daily_challenges
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- ── user_challenge_completion ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_challenge_completion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  challenge_id text NOT NULL REFERENCES public.daily_challenges (id),
  completed_at timestamptz NOT NULL DEFAULT now(),
  -- Local YYYY-MM-DD for the user's calendar day. Lets us enforce
  -- "one challenge per local day" without recomputing zones at read.
  completed_local_date date NOT NULL,
  -- Score 0..100 from the existing pronunciation-scoring pipeline.
  score integer NOT NULL,
  -- Optional URL to the recorded audio (Supabase storage). May be null
  -- if the client opted out of upload.
  audio_url text,
  CHECK (score >= 0 AND score <= 100),
  -- One completion per user per local day. A user may RETAKE the same
  -- day's challenge but only the latest write counts; the upsert
  -- target is (user_id, completed_local_date).
  UNIQUE (user_id, completed_local_date)
);

COMMENT ON TABLE public.user_challenge_completion IS
  'One row per user per calendar day for the daily pronunciation challenge.';

CREATE INDEX IF NOT EXISTS user_challenge_completion_user_idx
  ON public.user_challenge_completion (user_id, completed_local_date DESC);

ALTER TABLE public.user_challenge_completion ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_challenge_completion_select_own ON public.user_challenge_completion;
CREATE POLICY user_challenge_completion_select_own
  ON public.user_challenge_completion
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS user_challenge_completion_insert_own ON public.user_challenge_completion;
CREATE POLICY user_challenge_completion_insert_own
  ON public.user_challenge_completion
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS user_challenge_completion_update_own ON public.user_challenge_completion;
CREATE POLICY user_challenge_completion_update_own
  ON public.user_challenge_completion
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── pick_todays_challenge(user_id) ──────────────────────────────────
--
-- Returns one row matching the user's weakest phoneme (from the
-- last 30 days of speech_attempts), or a deterministic rotation seed
-- if the user has no usable signal. The function is SECURITY DEFINER
-- so it can read across both speech_attempts and daily_challenges
-- under one query, while gating the result to the calling user via
-- the function argument.
--
-- Contract:
--   - Caller passes their own auth.uid() (or a service role passes
--     any user_id).
--   - Returns 1 row OR 0 rows (if seed list is empty).
--   - Same user + same UTC date → same challenge id (consistent day
--     within a session).
--   - User who already completed today gets THE SAME challenge id
--     back so the page can show the completed state (rather than
--     resurfacing a different one).

CREATE OR REPLACE FUNCTION public.pick_todays_challenge(p_user_id uuid)
RETURNS TABLE (
  id text,
  type text,
  content_en text,
  content_vi_explanation text,
  target_phonemes text[],
  difficulty text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today date := (now() AT TIME ZONE 'UTC')::date;
  v_completed_id text;
  v_weakest_phoneme text;
  v_seed bigint;
  v_count bigint;
  v_offset bigint;
BEGIN
  -- 1. Already completed today? Return that exact challenge.
  SELECT challenge_id INTO v_completed_id
  FROM public.user_challenge_completion
  WHERE user_id = p_user_id
    AND completed_local_date = v_today
  LIMIT 1;

  IF v_completed_id IS NOT NULL THEN
    RETURN QUERY
    SELECT c.id, c.type, c.content_en, c.content_vi_explanation,
           c.target_phonemes, c.difficulty
      FROM public.daily_challenges c
      WHERE c.id = v_completed_id;
    RETURN;
  END IF;

  -- 2. Pick a weakest phoneme from the last 30 days of attempts that
  --    has at least one matching challenge. Skips phonemes the user
  --    has scored well on.
  --
  --    `speech_attempts` may not exist in dev seeds; wrap in an
  --    exception block so the picker degrades to deterministic
  --    rotation rather than failing.
  BEGIN
    SELECT phoneme INTO v_weakest_phoneme
      FROM (
        SELECT lower(p->>'phoneme') AS phoneme,
               avg(((p->>'score')::numeric)) AS avg_score,
               count(*) AS n
        FROM public.speech_attempts sa,
             jsonb_array_elements(coalesce(sa.phoneme_breakdown, '[]'::jsonb)) p
        WHERE sa.user_id = p_user_id
          AND sa.created_at >= now() - interval '30 days'
          AND p ? 'phoneme'
          AND p ? 'score'
        GROUP BY 1
        HAVING count(*) >= 3
           AND avg(((p->>'score')::numeric)) < 70
      ) weak
      WHERE phoneme IN (
        SELECT DISTINCT lower(unnest(target_phonemes))
          FROM public.daily_challenges
      )
      ORDER BY avg_score ASC, n DESC
      LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    v_weakest_phoneme := NULL;
  END;

  -- 3. If we got a weak phoneme, return one challenge tagged with it,
  --    rotating across days using a date-derived offset so the same
  --    user does not see the same challenge two days running unless
  --    the corpus only has one match.
  IF v_weakest_phoneme IS NOT NULL THEN
    SELECT count(*) INTO v_count
      FROM public.daily_challenges c
      WHERE v_weakest_phoneme = ANY (lower(c.target_phonemes::text)::text[])
         OR v_weakest_phoneme = ANY (c.target_phonemes);

    IF v_count > 0 THEN
      v_seed := abs(hashtext(p_user_id::text || v_today::text));
      v_offset := v_seed % v_count;

      RETURN QUERY
      SELECT c.id, c.type, c.content_en, c.content_vi_explanation,
             c.target_phonemes, c.difficulty
        FROM public.daily_challenges c
        WHERE v_weakest_phoneme = ANY (lower(c.target_phonemes::text)::text[])
           OR v_weakest_phoneme = ANY (c.target_phonemes)
        ORDER BY c.id
        OFFSET v_offset
        LIMIT 1;
      RETURN;
    END IF;
  END IF;

  -- 4. Fallback: deterministic rotation across the full corpus.
  SELECT count(*) INTO v_count FROM public.daily_challenges;

  IF v_count = 0 THEN
    RETURN; -- empty corpus, nothing to surface
  END IF;

  v_seed := abs(hashtext(p_user_id::text || v_today::text));
  v_offset := v_seed % v_count;

  RETURN QUERY
  SELECT c.id, c.type, c.content_en, c.content_vi_explanation,
         c.target_phonemes, c.difficulty
    FROM public.daily_challenges c
    ORDER BY c.id
    OFFSET v_offset
    LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.pick_todays_challenge(uuid) TO authenticated;

-- ── streak hook ─────────────────────────────────────────────────────
--
-- Mirror an inserted completion into `user_room_progress` so the
-- existing study-event trigger advances the streak. The mirrored row
-- uses a synthetic room id ("daily_challenge") and a tier of "level0"
-- to avoid colliding with real curriculum rows. If user_room_progress
-- is missing in this environment, the trigger is a no-op.

CREATE OR REPLACE FUNCTION public.touch_streak_on_challenge()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    INSERT INTO public.user_room_progress
      (user_id, room_id, last_visited_at)
    VALUES
      (NEW.user_id, 'daily_challenge', NEW.completed_at)
    ON CONFLICT (user_id, room_id) DO UPDATE
      SET last_visited_at = EXCLUDED.last_visited_at;
  EXCEPTION WHEN undefined_table THEN
    -- user_room_progress not present in this env — degrade silently.
    RETURN NEW;
  WHEN OTHERS THEN
    -- Unexpected error; log to PG diagnostics but do not block the
    -- completion write itself. The user-facing flow must always succeed.
    RAISE NOTICE 'touch_streak_on_challenge swallowed error: %', SQLERRM;
  END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS daily_challenge_streak_trigger
  ON public.user_challenge_completion;

CREATE TRIGGER daily_challenge_streak_trigger
  AFTER INSERT OR UPDATE
  ON public.user_challenge_completion
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_streak_on_challenge();

-- ── Seed the 60 challenges ──────────────────────────────────────────
--
-- Hand-curated content. See src/data/pronunciation-challenges/index.ts
-- for the canonical TypeScript copy used by tests and offline tooling;
-- the rows below match it 1:1.
--
-- ON CONFLICT DO UPDATE so re-running the migration in dev never
-- diverges the seed from the canonical TS file.

INSERT INTO public.daily_challenges
  (id, type, content_en, content_vi_explanation, target_phonemes, difficulty)
VALUES
  -- ── 20 classic tongue twisters ────────────────────────────────────
  ('tt_seashells', 'tongue_twister',
   'She sells seashells by the seashore.',
   'Tập trung vào âm /s/ và /ʃ/ — tiếng Việt không phân biệt rõ. Đặt lưỡi gần răng cho /s/, đẩy hơi ra cho /ʃ/.',
   ARRAY['s', 'sh'], 'medium'),
  ('tt_peter_piper', 'tongue_twister',
   'Peter Piper picked a peck of pickled peppers.',
   'Luyện /p/ bật hơi rõ ở đầu từ. Người Việt thường thiếu hơi — đặt tay trước miệng để cảm.',
   ARRAY['p'], 'medium'),
  ('tt_woodchuck', 'tongue_twister',
   'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
   'Tập /w/ — môi tròn rõ, không nhầm với /v/ (răng cắn môi).',
   ARRAY['w'], 'hard'),
  ('tt_red_lorry', 'tongue_twister',
   'Red lorry, yellow lorry.',
   'Bài kinh điển cho /r/ và /l/. Lưỡi không chạm cho /r/, lưỡi chạm răng trên cho /l/.',
   ARRAY['r', 'l'], 'easy'),
  ('tt_betty_butter', 'tongue_twister',
   'Betty bought a bit of butter, but the butter was bitter.',
   'Phân biệt /b/ và /t/ giữa từ — đừng nuốt /t/ ở cuối từ.',
   ARRAY['b', 't'], 'medium'),
  ('tt_unique_new_york', 'tongue_twister',
   'You know New York, you need New York, you know you need unique New York.',
   '/n/ và /j/ liên tục — giữ lưỡi linh hoạt, không trộn âm.',
   ARRAY['n', 'y'], 'hard'),
  ('tt_irish_wristwatch', 'tongue_twister',
   'Irish wristwatch, Swiss wristwatch.',
   'Cụm phụ âm /st/-/w/ — đừng thêm nguyên âm vào giữa.',
   ARRAY['s', 'w', 'r'], 'hard'),
  ('tt_six_sticks', 'tongue_twister',
   'Six slick slim sycamore saplings.',
   'Cụm /sl/ ở đầu nhiều từ — luyện kéo dài /s/ trước /l/.',
   ARRAY['s', 'l'], 'hard'),
  ('tt_fresh_fish', 'tongue_twister',
   'Fresh fried fish, fish fresh fried, fried fish fresh.',
   'Phân biệt /f/ (răng cắn môi) và /ʃ/ (môi tròn).',
   ARRAY['f', 'sh'], 'medium'),
  ('tt_toy_boat', 'tongue_twister',
   'Toy boat, toy boat, toy boat.',
   'Lặp lại nhanh — đừng để /t/ thành /d/ và /b/ thành /p/.',
   ARRAY['t', 'b'], 'easy'),
  ('tt_rubber_buggy', 'tongue_twister',
   'Rubber baby buggy bumpers.',
   '/b/ liên tục — môi đóng kín rồi bật ra.',
   ARRAY['b', 'r'], 'medium'),
  ('tt_silly_sally', 'tongue_twister',
   'Silly Sally swiftly shooed seven silly sheep.',
   '/s/ và /ʃ/ xen kẽ — chú ý không trộn lẫn.',
   ARRAY['s', 'sh'], 'medium'),
  ('tt_thirty_three', 'tongue_twister',
   'Thirty-three thieves thought that they thrilled the throne throughout Thursday.',
   'Bài cực khó cho /θ/ — lưỡi giữa hai răng, đẩy hơi.',
   ARRAY['th'], 'hard'),
  ('tt_baker_bread', 'tongue_twister',
   'Black bread, brown bread, blue bread.',
   'Cụm /br/ và /bl/ — phân biệt /r/ (lưỡi không chạm) và /l/ (lưỡi chạm).',
   ARRAY['b', 'r', 'l'], 'medium'),
  ('tt_can_can_canner', 'tongue_twister',
   'A canner can can anything that he can can, but a canner cannot can a can.',
   'Lặp /k/ liên tục — gốc lưỡi chạm vòm họng.',
   ARRAY['k', 'n'], 'medium'),
  ('tt_eleven_benevolent', 'tongue_twister',
   'Eleven benevolent elephants.',
   '/v/ răng cắn môi — không thay bằng /w/ (môi tròn).',
   ARRAY['v', 'l'], 'medium'),
  ('tt_seventy_seven', 'tongue_twister',
   'Seventy-seven benevolent elephants.',
   'Số đếm và /v/ — luyện đọc nhanh số dài.',
   ARRAY['v', 's'], 'hard'),
  ('tt_truly_rural', 'tongue_twister',
   'Truly rural, truly rural, truly rural.',
   '/r/ và /l/ liên tiếp — bài tốt nhất để cảm khác biệt.',
   ARRAY['r', 'l'], 'hard'),
  ('tt_fuzzy_wuzzy', 'tongue_twister',
   'Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair.',
   '/f/, /w/, /h/ xen kẽ — chú ý /w/ môi tròn không nhầm /v/.',
   ARRAY['f', 'w', 'h'], 'easy'),
  ('tt_chip_shop', 'tongue_twister',
   'Six thick thistle sticks. Six thick thistles stick.',
   '/θ/ ở giữa cụm phụ âm — bài khó top 3.',
   ARRAY['th', 's', 'k'], 'hard'),

  -- ── 20 minimal pair drills ────────────────────────────────────────
  ('mp_ship_sheep', 'minimal_pair',
   'I see a ship and a sheep on the ship.',
   '/ɪ/ ngắn (ship) vs /iː/ dài (sheep). Người Việt thường nói /iː/ cho cả hai — kéo dài cho sheep.',
   ARRAY['ih', 'iy'], 'medium'),
  ('mp_pen_pan', 'minimal_pair',
   'The pen is in the pan, but the pan is not a pen.',
   '/ɛ/ (pen) vs /æ/ (pan). Mở miệng rộng hơn cho /æ/.',
   ARRAY['eh', 'ae'], 'medium'),
  ('mp_light_right', 'minimal_pair',
   'Turn the light to the right, then go right past the light.',
   '/l/ lưỡi chạm vs /r/ lưỡi cong không chạm.',
   ARRAY['l', 'r'], 'medium'),
  ('mp_thin_sin', 'minimal_pair',
   'It is a thin sin to think you can sin without thinking.',
   '/θ/ (thin) — lưỡi giữa răng. /s/ (sin) — lưỡi sau răng.',
   ARRAY['th', 's'], 'hard'),
  ('mp_very_berry', 'minimal_pair',
   'A very berry is very, very rare.',
   '/v/ (răng cắn môi) vs /b/ (hai môi đóng).',
   ARRAY['v', 'b'], 'easy'),
  ('mp_west_vest', 'minimal_pair',
   'I wear my vest going west.',
   '/w/ (môi tròn) vs /v/ (răng cắn môi). Người Việt rất hay trộn.',
   ARRAY['w', 'v'], 'hard'),
  ('mp_full_fool', 'minimal_pair',
   'A full fool is full of foolish thoughts.',
   '/ʊ/ ngắn (full) vs /uː/ dài (fool). Kéo dài rõ cho fool.',
   ARRAY['uh', 'uw'], 'medium'),
  ('mp_cat_cut', 'minimal_pair',
   'The cat cut the cake on the mat.',
   '/æ/ (cat — mở miệng) vs /ʌ/ (cut — miệng nhỏ thoải mái).',
   ARRAY['ae', 'ah'], 'medium'),
  ('mp_walk_work', 'minimal_pair',
   'I walk to work and I work after I walk.',
   '/ɔː/ (walk) vs /ɝ/ (work). /ɝ/ có /r/ ẩn, môi tròn.',
   ARRAY['ao', 'er'], 'hard'),
  ('mp_bat_bet', 'minimal_pair',
   'The bat is on the bed, and the bed is for the bat.',
   '/æ/ (bat) vs /ɛ/ (bet). Kéo miệng rộng cho /æ/.',
   ARRAY['ae', 'eh'], 'easy'),
  ('mp_glass_grass', 'minimal_pair',
   'Pour the glass on the grass, but watch the glass and the grass.',
   '/l/ (glass) vs /r/ (grass). Trong cụm phụ âm /gl/-/gr/.',
   ARRAY['l', 'r'], 'medium'),
  ('mp_bowl_bull', 'minimal_pair',
   'Put the bowl by the bull, then pull the bull from the bowl.',
   '/oʊ/ (bowl — kéo dài có đuôi w) vs /ʊ/ (bull — ngắn).',
   ARRAY['ow', 'uh'], 'hard'),
  ('mp_pat_bat', 'minimal_pair',
   'Pat the bat, do not bat at Pat.',
   '/p/ bật hơi mạnh vs /b/ rung dây thanh.',
   ARRAY['p', 'b'], 'easy'),
  ('mp_cap_cab', 'minimal_pair',
   'Put the cap in the cab, and pay the cab for the cap.',
   '/p/ và /b/ ở cuối từ — đừng nuốt phụ âm cuối.',
   ARRAY['p', 'b'], 'medium'),
  ('mp_fan_van', 'minimal_pair',
   'The fan in the van blows like a van fan.',
   '/f/ (răng cắn môi vô thanh) vs /v/ (răng cắn môi hữu thanh).',
   ARRAY['f', 'v'], 'easy'),
  ('mp_chair_share', 'minimal_pair',
   'Share the chair, please share the chair fairly.',
   '/tʃ/ (chair — bật + xát) vs /ʃ/ (share — chỉ xát).',
   ARRAY['ch', 'sh'], 'medium'),
  ('mp_jeep_zip', 'minimal_pair',
   'The jeep can zip, but the zip is not the jeep.',
   '/dʒ/ (jeep) vs /z/ (zip). Người Việt thường thay /z/ bằng /s/.',
   ARRAY['jh', 'z'], 'medium'),
  ('mp_thigh_die', 'minimal_pair',
   'My thigh is sore — I think I will die laughing.',
   '/θ/ (thigh — lưỡi giữa răng) vs /d/ (die — lưỡi chạm vòm).',
   ARRAY['th', 'd'], 'hard'),
  ('mp_sit_seat', 'minimal_pair',
   'Take a seat and sit; do not sit on the seat sideways.',
   '/ɪ/ (sit) vs /iː/ (seat). Kéo dài rõ cho seat.',
   ARRAY['ih', 'iy'], 'easy'),
  ('mp_bag_back', 'minimal_pair',
   'Bring the bag back, and put the back in the bag.',
   '/g/ (bag — hữu thanh) vs /k/ (back — vô thanh) ở cuối từ.',
   ARRAY['g', 'k'], 'medium'),

  -- ── 20 phoneme-targeted sentences (VN problem phonemes) ──────────
  ('pt_th_thursday', 'phoneme_targeted',
   'I think Thursday is the third day this month.',
   'Bốn /θ/ trong câu — lưỡi giữa hai răng, đẩy hơi ra. Tiếng Việt không có âm này.',
   ARRAY['th'], 'medium'),
  ('pt_th_brother', 'phoneme_targeted',
   'My brother and mother bother me on Sundays.',
   '/ð/ hữu thanh — như /θ/ nhưng có rung dây thanh. Đặt tay vào cổ để cảm.',
   ARRAY['dh'], 'medium'),
  ('pt_th_thirsty', 'phoneme_targeted',
   'I am thirsty after thirty-three thrilling thoughts.',
   '/θ/ ở đầu từ liên tục — bài khó nhất cho người Việt.',
   ARRAY['th'], 'hard'),
  ('pt_r_around', 'phoneme_targeted',
   'The river runs around the rocks and through the trees.',
   '/r/ Mỹ — lưỡi cong vào trong nhưng không chạm vòm. Tiếng Việt /r/ rung — sai cách.',
   ARRAY['r'], 'medium'),
  ('pt_r_corner', 'phoneme_targeted',
   'There is a car at the corner of Park Road.',
   '/r/ giữa và cuối từ — môi tròn nhẹ, lưỡi co lại.',
   ARRAY['r'], 'hard'),
  ('pt_r_difficult', 'phoneme_targeted',
   'It is difficult to remember every Friday morning routine.',
   '/r/ trong cụm phụ âm — đừng bỏ qua, đừng thêm nguyên âm.',
   ARRAY['r'], 'medium'),
  ('pt_v_w_visiting', 'phoneme_targeted',
   'We are visiting Victor in Wisconsin in November.',
   '/v/ và /w/ xen kẽ. /v/ răng cắn môi; /w/ môi tròn không chạm răng.',
   ARRAY['v', 'w'], 'hard'),
  ('pt_v_very', 'phoneme_targeted',
   'I have a very heavy violet vase from Victoria.',
   '/v/ liên tục — răng trên cắn nhẹ môi dưới, dây thanh rung.',
   ARRAY['v'], 'medium'),
  ('pt_w_water', 'phoneme_targeted',
   'I want one warm cup of water from the well.',
   '/w/ liên tục — môi tròn, không cắn môi.',
   ARRAY['w'], 'easy'),
  ('pt_finals_friends', 'phoneme_targeted',
   'My friends sometimes make plans for weekends.',
   '/-s/ và /-z/ cuối từ — đừng nuốt. Người Việt rất hay bỏ phụ âm cuối.',
   ARRAY['s', 'z'], 'medium'),
  ('pt_finals_apples', 'phoneme_targeted',
   'The students like apples, oranges, and grapes.',
   'Phụ âm cuối /-s/, /-z/, /-əz/ — kéo nhẹ ở cuối từ.',
   ARRAY['s', 'z'], 'medium'),
  ('pt_finals_cats', 'phoneme_targeted',
   'The cats sit on the mats and watch the bats.',
   '/-ts/ cụm cuối từ — bật /t/ rồi xát /s/ liền.',
   ARRAY['t', 's'], 'medium'),
  ('pt_finals_dogs', 'phoneme_targeted',
   'The dogs barked and the birds flew away.',
   '/-d/ và /-z/ cuối từ ở past tense — đừng làm rơi.',
   ARRAY['d', 'z'], 'medium'),
  ('pt_finals_rocks', 'phoneme_targeted',
   'I picked six big rocks from the beach last weekend.',
   '/-ks/ và /-st/ cuối từ — luyện cụm phụ âm cuối.',
   ARRAY['k', 's', 't'], 'hard'),
  ('pt_th_initial', 'phoneme_targeted',
   'Thank you for thinking of me through these tough times.',
   '/θ/ và /ð/ ở đầu từ — phân biệt vô thanh và hữu thanh.',
   ARRAY['th', 'dh'], 'hard'),
  ('pt_r_dark', 'phoneme_targeted',
   'The dark park near the harbor is far from the airport.',
   '/r/ tối, /r/ sau nguyên âm — vẫn cong lưỡi nhưng nhẹ.',
   ARRAY['r'], 'hard'),
  ('pt_l_yellow', 'phoneme_targeted',
   'A yellow ball fell on the floor of the small hall.',
   '/l/ ở đầu vs cuối từ — cuối từ /l/ nghe tối hơn.',
   ARRAY['l'], 'medium'),
  ('pt_z_zoo', 'phoneme_targeted',
   'The zoo has zebras, lizards, and lazy lions.',
   '/z/ — như /s/ nhưng dây thanh rung. Người Việt thường thay bằng /s/.',
   ARRAY['z'], 'medium'),
  ('pt_sh_shopping', 'phoneme_targeted',
   'She is shopping for shoes at the special shop.',
   '/ʃ/ — môi tròn, lưỡi gần vòm nhưng không chạm.',
   ARRAY['sh'], 'easy'),
  ('pt_ng_singing', 'phoneme_targeted',
   'They are singing and dancing in the morning sun.',
   '/ŋ/ — gốc lưỡi lên vòm mềm, không phát /n/+/g/ riêng.',
   ARRAY['ng'], 'medium')
ON CONFLICT (id) DO UPDATE
  SET type = EXCLUDED.type,
      content_en = EXCLUDED.content_en,
      content_vi_explanation = EXCLUDED.content_vi_explanation,
      target_phonemes = EXCLUDED.target_phonemes,
      difficulty = EXCLUDED.difficulty;

-- ── Feature flag (default OFF) ──────────────────────────────────────
--
-- Routes are wired in the app, but the Home `DailyChallengeCard` is
-- gated by this flag so we can dark-launch and ramp.
INSERT INTO public.feature_flags
  (flag_key, is_enabled, enabled_user_ids, description)
VALUES (
  'daily_challenge_enabled',
  false,
  ARRAY[]::uuid[],
  'Show the daily pronunciation challenge card on Home + open /challenge.'
)
ON CONFLICT (flag_key) DO NOTHING;
