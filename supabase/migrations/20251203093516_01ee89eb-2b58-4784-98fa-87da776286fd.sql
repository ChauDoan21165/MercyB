-- Create paths table
CREATE TABLE public.paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_vi TEXT NOT NULL,
  total_days INTEGER NOT NULL DEFAULT 7,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create path_days table
CREATE TABLE public.path_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id UUID REFERENCES public.paths(id) ON DELETE CASCADE NOT NULL,
  day_index INTEGER NOT NULL,
  title_en TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_vi TEXT NOT NULL,
  reflection_en TEXT NOT NULL,
  reflection_vi TEXT NOT NULL,
  dare_en TEXT NOT NULL,
  dare_vi TEXT NOT NULL,
  audio_intro_en TEXT,
  audio_intro_vi TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(path_id, day_index)
);

-- Create user_path_progress table
CREATE TABLE public.user_path_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  path_id UUID REFERENCES public.paths(id) ON DELETE CASCADE NOT NULL,
  current_day INTEGER NOT NULL DEFAULT 1,
  completed_days JSONB NOT NULL DEFAULT '[]'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, path_id)
);

-- Enable RLS
ALTER TABLE public.paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.path_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_path_progress ENABLE ROW LEVEL SECURITY;

-- Paths RLS: Anyone can read, only admin can write
CREATE POLICY "Anyone can read paths" ON public.paths
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage paths" ON public.paths
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Path days RLS: Anyone can read, only admin can write
CREATE POLICY "Anyone can read path_days" ON public.path_days
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage path_days" ON public.path_days
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- User progress RLS: Users can manage their own progress
CREATE POLICY "Users can read own progress" ON public.user_path_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_path_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_path_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress" ON public.user_path_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_path_days_path_id ON public.path_days(path_id);
CREATE INDEX idx_user_path_progress_user_id ON public.user_path_progress(user_id);
CREATE INDEX idx_user_path_progress_path_id ON public.user_path_progress(path_id);

-- Update trigger for paths
CREATE TRIGGER update_paths_updated_at
  BEFORE UPDATE ON public.paths
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Update trigger for path_days
CREATE TRIGGER update_path_days_updated_at
  BEFORE UPDATE ON public.path_days
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Update trigger for user_path_progress
CREATE TRIGGER update_user_path_progress_updated_at
  BEFORE UPDATE ON public.user_path_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Seed the 7-Day Calm Mind path
INSERT INTO public.paths (slug, title_en, title_vi, description_en, description_vi, total_days, cover_image)
VALUES (
  'calm-mind-7-day',
  '7-Day Calm Mind',
  '7 Ngày Tâm Tĩnh',
  'A gentle journey to find peace within. Each day brings a small practice, a quiet reflection, and a tiny dare to step outside your comfort zone.',
  'Một hành trình nhẹ nhàng để tìm sự bình yên bên trong. Mỗi ngày mang đến một bài tập nhỏ, một suy ngẫm yên tĩnh, và một thử thách nhỏ để bước ra khỏi vùng an toàn.',
  7,
  NULL
);

-- Insert the 7 days
INSERT INTO public.path_days (path_id, day_index, title_en, title_vi, content_en, content_vi, reflection_en, reflection_vi, dare_en, dare_vi, audio_intro_en, audio_intro_vi)
SELECT 
  p.id,
  d.day_index,
  d.title_en,
  d.title_vi,
  d.content_en,
  d.content_vi,
  d.reflection_en,
  d.reflection_vi,
  d.dare_en,
  d.dare_vi,
  d.audio_intro_en,
  d.audio_intro_vi
FROM public.paths p
CROSS JOIN (VALUES
  (1, 'Breath Anchor', 'Neo Hơi Thở',
   'Today, we begin with the simplest gift: your breath. Find a quiet moment. Sit comfortably. Close your eyes and take three slow breaths. Feel the air enter your body, pause, then release. This is your anchor—always available, always with you.',
   'Hôm nay, chúng ta bắt đầu với món quà đơn giản nhất: hơi thở của bạn. Tìm một khoảnh khắc yên tĩnh. Ngồi thoải mái. Nhắm mắt và hít thở chậm ba lần. Cảm nhận không khí vào cơ thể, dừng lại, rồi thả ra. Đây là neo của bạn—luôn sẵn có, luôn ở bên bạn.',
   'When did you last feel truly at peace? What was happening around you?',
   'Lần cuối bạn cảm thấy thực sự bình yên là khi nào? Lúc đó xung quanh bạn có gì đang xảy ra?',
   'Take three deep breaths before checking your phone this morning.',
   'Hít thở sâu ba lần trước khi xem điện thoại sáng nay.',
   'calm_mind_day1_en.mp3', 'calm_mind_day1_vi.mp3'),
  (2, 'Body Scan', 'Quét Cơ Thể',
   'Your body holds wisdom your mind often ignores. Today, spend 5 minutes scanning from head to toe. Notice tension. Notice ease. Do not judge—just notice. Where does your body ask for attention?',
   'Cơ thể bạn chứa đựng trí tuệ mà tâm trí thường bỏ qua. Hôm nay, dành 5 phút quét từ đầu đến chân. Nhận ra căng thẳng. Nhận ra sự thoải mái. Đừng phán xét—chỉ nhận ra. Nơi nào cơ thể bạn cần được chú ý?',
   'What part of your body feels most alive right now? Most tired?',
   'Phần nào của cơ thể bạn cảm thấy sống động nhất lúc này? Mệt mỏi nhất?',
   'Stretch your shoulders and neck for 30 seconds right now.',
   'Kéo giãn vai và cổ trong 30 giây ngay bây giờ.',
   'calm_mind_day2_en.mp3', 'calm_mind_day2_vi.mp3'),
  (3, 'Thought Clouds', 'Mây Suy Nghĩ',
   'Thoughts come and go like clouds in the sky. Today, when a worry appears, imagine placing it on a cloud and watching it drift away. You are not your thoughts. You are the sky.',
   'Suy nghĩ đến và đi như những đám mây trên bầu trời. Hôm nay, khi một lo lắng xuất hiện, hãy tưởng tượng đặt nó lên một đám mây và nhìn nó trôi đi. Bạn không phải là suy nghĩ của bạn. Bạn là bầu trời.',
   'What thought keeps returning to you? What would happen if you let it float away?',
   'Suy nghĩ nào cứ quay lại với bạn? Điều gì sẽ xảy ra nếu bạn để nó trôi đi?',
   'When you notice a negative thought today, say quietly: "Cloud."',
   'Khi bạn nhận ra một suy nghĩ tiêu cực hôm nay, hãy nói nhẹ: "Mây."',
   'calm_mind_day3_en.mp3', 'calm_mind_day3_vi.mp3'),
  (4, 'Gratitude Drop', 'Giọt Biết Ơn',
   'Gratitude is a small revolution. Today, pause three times and name one thing you are grateful for. It can be tiny: warm water, a kind word, the color of the sky.',
   'Lòng biết ơn là một cuộc cách mạng nhỏ. Hôm nay, dừng lại ba lần và nêu một điều bạn biết ơn. Nó có thể rất nhỏ: nước ấm, một lời tử tế, màu của bầu trời.',
   'What small thing brought you unexpected joy recently?',
   'Điều nhỏ bé nào gần đây mang đến cho bạn niềm vui bất ngờ?',
   'Tell someone today one thing you appreciate about them.',
   'Hôm nay hãy nói với ai đó một điều bạn trân trọng ở họ.',
   'calm_mind_day4_en.mp3', 'calm_mind_day4_vi.mp3'),
  (5, 'Sound Bath', 'Tắm Âm Thanh',
   'Close your eyes and listen. Not to words, but to sounds. The hum of the world. Birds, traffic, wind, silence itself. For 3 minutes, let sound wash over you without naming or judging.',
   'Nhắm mắt và lắng nghe. Không phải lời, mà là âm thanh. Tiếng ngân của thế giới. Chim, xe cộ, gió, chính sự im lặng. Trong 3 phút, để âm thanh tràn qua bạn mà không đặt tên hay phán xét.',
   'What is the most peaceful sound you can remember hearing?',
   'Âm thanh yên bình nhất mà bạn có thể nhớ được là gì?',
   'Find a quiet spot outside and listen for 2 minutes.',
   'Tìm một nơi yên tĩnh bên ngoài và lắng nghe trong 2 phút.',
   'calm_mind_day5_en.mp3', 'calm_mind_day5_vi.mp3'),
  (6, 'Kind Words', 'Lời Tử Tế',
   'Today, speak kindly to yourself. When you make a mistake, instead of criticism, try: "I am learning." When you feel inadequate, try: "I am enough, exactly as I am."',
   'Hôm nay, hãy nói tử tế với chính mình. Khi bạn mắc lỗi, thay vì chỉ trích, hãy thử: "Tôi đang học." Khi bạn cảm thấy không đủ, hãy thử: "Tôi đủ rồi, đúng như tôi đang là."',
   'What harsh words do you say to yourself that you would never say to a friend?',
   'Những lời khắc nghiệt nào bạn nói với mình mà bạn sẽ không bao giờ nói với bạn bè?',
   'Write one kind sentence about yourself and read it aloud.',
   'Viết một câu tử tế về bản thân và đọc to lên.',
   'calm_mind_day6_en.mp3', 'calm_mind_day6_vi.mp3'),
  (7, 'Stillness', 'Sự Tĩnh Lặng',
   'You have arrived. Today, simply be still for 5 minutes. No task. No goal. No fixing. Just presence. This is not wasted time. This is the most important work: being here, now, complete.',
   'Bạn đã đến nơi. Hôm nay, chỉ đơn giản là tĩnh lặng trong 5 phút. Không nhiệm vụ. Không mục tiêu. Không sửa chữa. Chỉ là hiện diện. Đây không phải là thời gian lãng phí. Đây là công việc quan trọng nhất: ở đây, bây giờ, trọn vẹn.',
   'How does it feel to give yourself permission to do nothing?',
   'Bạn cảm thấy thế nào khi cho phép mình không làm gì?',
   'Sit in complete stillness for 5 minutes without any device.',
   'Ngồi hoàn toàn tĩnh lặng trong 5 phút không có thiết bị nào.',
   'calm_mind_day7_en.mp3', 'calm_mind_day7_vi.mp3')
) AS d(day_index, title_en, title_vi, content_en, content_vi, reflection_en, reflection_vi, dare_en, dare_vi, audio_intro_en, audio_intro_vi)
WHERE p.slug = 'calm-mind-7-day';