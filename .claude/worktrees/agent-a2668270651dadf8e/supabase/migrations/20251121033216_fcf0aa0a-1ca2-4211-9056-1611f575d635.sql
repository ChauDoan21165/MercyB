-- supabase/migrations/20251121033216_fcf0aa0a-1ca2-4211-9056-1611f575d635.sql
-- MB-BLUE-KIDS-SEED-20251121033216 v2
--
-- Kids seed (replay-safe):
-- - Runs ONLY if kids tables exist
-- - Uses dynamic SQL so we can "skip" cleanly (DO block RETURN)
-- - TRUNCATE + INSERT are inside the guarded block, so missing tables never crash reset

DO $$
BEGIN
  -- Guard: skip kids seed if kids tables are not present in this schema
  IF to_regclass('public.kids_levels') IS NULL
     OR to_regclass('public.kids_rooms') IS NULL
     OR to_regclass('public.kids_entries') IS NULL THEN
    RAISE NOTICE 'Kids tables missing; skipping kids seed in this migration.';
    RETURN;
  END IF;

  -- Clear existing kids data
  EXECUTE 'TRUNCATE TABLE public.kids_entries CASCADE';
  EXECUTE 'TRUNCATE TABLE public.kids_rooms CASCADE';
  EXECUTE 'TRUNCATE TABLE public.kids_levels CASCADE';

  -- Insert 3 Kids Levels with VIP-style theming
  EXECUTE $seed$
    INSERT INTO public.kids_levels (
      id, name_en, name_vi, age_range,
      description_en, description_vi,
      display_order, price_monthly,
      color_theme, is_active
    ) VALUES
    ('level1', 'Level 1', 'Cấp 1', '4-7', 'Foundation English for young learners', 'Tiếng Anh nền tảng cho trẻ nhỏ', 1, 99000, 'hsl(142, 76%, 36%)', true),
    ('level2', 'Level 2', 'Cấp 2', '7-10', 'Building confidence and skills', 'Xây dựng sự tự tin và kỹ năng', 2, 149000, 'hsl(221, 83%, 53%)', true),
    ('level3', 'Level 3', 'Cấp 3', '10-13', 'Advanced learning and expression', 'Học tập và diễn đạt nâng cao', 3, 199000, 'hsl(271, 91%, 65%)', true);
  $seed$;

  -- Insert Kids Rooms (LEVEL 1)
  EXECUTE $seed$
    INSERT INTO public.kids_rooms (
      id, level_id, title_en, title_vi,
      description_en, description_vi,
      display_order, icon, is_active
    ) VALUES
    ('alphabet-adventure', 'level1', 'Alphabet Adventure', 'Phiêu Lưu Bảng Chữ Cái', 'Learn letters through fun adventures', 'Học chữ cái qua các cuộc phiêu lưu vui nhộn', 1, 'BookOpen', true),
    ('colors-shapes', 'level1', 'Colors & Shapes', 'Màu Sắc & Hình Dạng', 'Explore colors and shapes', 'Khám phá màu sắc và hình dạng', 2, 'Palette', true),
    ('numbers-counting', 'level1', 'Numbers & Counting', 'Số Đếm', 'Count and learn numbers', 'Đếm và học số', 3, 'Hash', true),
    ('opposites-matching', 'level1', 'Opposites & Matching', 'Trái Nghĩa & Ghép Đôi', 'Learn opposites and matching', 'Học từ trái nghĩa và ghép đôi', 4, 'Shuffle', true),
    ('body-parts-movement', 'level1', 'Body Parts & Movement', 'Bộ Phận Cơ Thể & Chuyển Động', 'Learn about body and movement', 'Học về cơ thể và chuyển động', 5, 'User', true),
    ('feelings-emotions', 'level1', 'Feelings & Emotions', 'Cảm Xúc', 'Express feelings and emotions', 'Diễn đạt cảm xúc', 6, 'Heart', true),
    ('first-action-verbs', 'level1', 'First Action Verbs', 'Động Từ Hành Động Đầu Tiên', 'Learn basic action words', 'Học từ hành động cơ bản', 7, 'Zap', true),
    ('size-comparison', 'level1', 'Size & Comparison', 'Kích Thước & So Sánh', 'Compare sizes and learn big/small', 'So sánh kích thước và học to/nhỏ', 8, 'Maximize2', true),
    ('simple-questions', 'level1', 'Simple Questions (What/Who)', 'Câu Hỏi Đơn Giản', 'Ask and answer simple questions', 'Hỏi và trả lời câu hỏi đơn giản', 9, 'HelpCircle', true),
    ('early-phonics', 'level1', 'Early Phonics Sounds', 'Âm Thanh Đầu Tiên', 'Learn letter sounds', 'Học âm thanh của chữ cái', 10, 'Volume2', true),
    ('family-home', 'level1', 'Family & Home Words', 'Gia Đình & Nhà Cửa', 'Learn family and home vocabulary', 'Học từ vựng về gia đình và nhà', 11, 'Home', true),
    ('rooms-house', 'level1', 'Rooms in the House', 'Các Phòng Trong Nhà', 'Explore rooms in your home', 'Khám phá các phòng trong nhà', 12, 'Building', true),
    ('clothes-dressing', 'level1', 'Clothes & Dressing', 'Quần Áo & Mặc', 'Learn about clothes', 'Học về quần áo', 13, 'Shirt', true),
    ('food-snacks', 'level1', 'Food & Snacks', 'Đồ Ăn & Đồ Ăn Vặt', 'Learn food vocabulary', 'Học từ vựng về đồ ăn', 14, 'Apple', true),
    ('drinks-treats', 'level1', 'Drinks & Treats', 'Đồ Uống & Món Ngon', 'Learn about drinks and treats', 'Học về đồ uống và món ngon', 15, 'Coffee', true),
    ('daily-routines', 'level1', 'Daily Routines', 'Thói Quen Hàng Ngày', 'Learn daily routine words', 'Học từ về thói quen hàng ngày', 16, 'Clock', true),
    ('bedtime-words', 'level1', 'Bedtime Words', 'Từ Vựng Giờ Đi Ngủ', 'Learn bedtime vocabulary', 'Học từ vựng về giờ đi ngủ', 17, 'Moon', true),
    ('bathroom-hygiene', 'level1', 'Bathroom & Hygiene', 'Phòng Tắm & Vệ Sinh', 'Learn hygiene words', 'Học từ về vệ sinh', 18, 'Droplets', true),
    ('school-objects', 'level1', 'School Objects', 'Đồ Dùng Học Tập', 'Learn school items', 'Học đồ dùng học tập', 19, 'Backpack', true),
    ('playground-words', 'level1', 'Playground Words', 'Từ Vựng Sân Chơi', 'Learn playground vocabulary', 'Học từ vựng về sân chơi', 20, 'Smile', true),
    ('toys-playtime', 'level1', 'Toys & Playtime', 'Đồ Chơi & Giờ Chơi', 'Learn about toys', 'Học về đồ chơi', 21, 'Gamepad2', true),
    ('animals-sounds', 'level1', 'Animals & Sounds', 'Động Vật & Âm Thanh', 'Learn animal sounds', 'Học âm thanh động vật', 22, 'Dog', true),
    ('farm-animals', 'level1', 'Farm Animals', 'Động Vật Trang Trại', 'Learn farm animals', 'Học động vật trang trại', 23, 'Beef', true),
    ('wild-animals', 'level1', 'Wild Animals', 'Động Vật Hoang Dã', 'Learn wild animals', 'Học động vật hoang dã', 24, 'Bird', true),
    ('pets-caring', 'level1', 'Pets & Caring', 'Thú Cưng & Chăm Sóc', 'Learn about pets', 'Học về thú cưng', 25, 'Heart', true),
    ('nature-explorers', 'level1', 'Nature Explorers', 'Khám Phá Thiên Nhiên', 'Explore nature words', 'Khám phá từ về thiên nhiên', 26, 'Trees', true),
    ('weather-kids', 'level1', 'Weather for Kids', 'Thời Tiết Cho Trẻ', 'Learn weather words', 'Học từ về thời tiết', 27, 'CloudRain', true),
    ('colors-nature', 'level1', 'Colors in Nature', 'Màu Sắc Trong Thiên Nhiên', 'Find colors in nature', 'Tìm màu sắc trong thiên nhiên', 28, 'Flower', true),
    ('magic-story', 'level1', 'Magic Story Words', 'Từ Vựng Câu Chuyện Kỳ Diệu', 'Learn storytelling words', 'Học từ kể chuyện', 29, 'Sparkles', true),
    ('make-believe', 'level1', 'Make-Believe & Imagination', 'Tưởng Tượng', 'Use your imagination', 'Dùng trí tưởng tượng', 30, 'Wand2', true);
  $seed$;

  -- NOTE:
  -- If you later add Level 2 + Level 3 here, keep them inside this DO block
  -- and wrap each INSERT in EXECUTE $seed$ ... $seed$;

END $$;
