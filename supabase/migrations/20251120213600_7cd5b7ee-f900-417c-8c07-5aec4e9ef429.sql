-- Create kids levels table
CREATE TABLE IF NOT EXISTS public.kids_levels (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_vi TEXT NOT NULL,
  age_range TEXT NOT NULL,
  description_en TEXT,
  description_vi TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  display_order INTEGER NOT NULL,
  color_theme TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create kids rooms table
CREATE TABLE IF NOT EXISTS public.kids_rooms (
  id TEXT PRIMARY KEY,
  level_id TEXT NOT NULL REFERENCES public.kids_levels(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  description_en TEXT,
  description_vi TEXT,
  icon TEXT,
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create kids entries table
CREATE TABLE IF NOT EXISTS public.kids_entries (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES public.kids_rooms(id) ON DELETE CASCADE,
  content_en TEXT NOT NULL,
  content_vi TEXT NOT NULL,
  audio_url TEXT,
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create kids subscriptions table
CREATE TABLE IF NOT EXISTS public.kids_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  level_id TEXT NOT NULL REFERENCES public.kids_levels(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.kids_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kids_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kids_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kids_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for kids_levels (public read)
CREATE POLICY "Anyone can view active kids levels"
  ON public.kids_levels FOR SELECT
  USING (is_active = true);

-- Policies for kids_rooms (public read)
CREATE POLICY "Anyone can view active kids rooms"
  ON public.kids_rooms FOR SELECT
  USING (is_active = true);

-- Policies for kids_entries (public read)
CREATE POLICY "Anyone can view active kids entries"
  ON public.kids_entries FOR SELECT
  USING (is_active = true);

-- Policies for kids_subscriptions
CREATE POLICY "Users can view their own kids subscriptions"
  ON public.kids_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own kids subscriptions"
  ON public.kids_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insert default levels
INSERT INTO public.kids_levels (id, name_en, name_vi, age_range, description_en, description_vi, price_monthly, display_order, color_theme) VALUES
  ('level1', 'Little Explorers', 'Nhà Thám Hiểm Nhỏ', '4-7 years', 'Perfect for beginning English learners', 'Hoàn hảo cho trẻ mới bắt đầu học tiếng Anh', 199000, 1, 'from-pink-400 to-purple-400'),
  ('level2', 'Young Adventurers', 'Nhà Phiêu Lưu Trẻ', '7-10 years', 'Build confidence and vocabulary', 'Xây dựng sự tự tin và vốn từ vựng', 199000, 2, 'from-blue-400 to-cyan-400'),
  ('level3', 'Super Learners', 'Học Sinh Siêu Đẳng', '10-13 years', 'Advanced English for pre-teens', 'Tiếng Anh nâng cao cho lứa tuổi thiếu niên', 199000, 3, 'from-green-400 to-emerald-400')
ON CONFLICT (id) DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_kids_rooms_level_id ON public.kids_rooms(level_id);
CREATE INDEX IF NOT EXISTS idx_kids_entries_room_id ON public.kids_entries(room_id);
CREATE INDEX IF NOT EXISTS idx_kids_subscriptions_user_id ON public.kids_subscriptions(user_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_kids_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kids_levels_updated_at BEFORE UPDATE ON public.kids_levels
  FOR EACH ROW EXECUTE FUNCTION update_kids_updated_at_column();

CREATE TRIGGER update_kids_rooms_updated_at BEFORE UPDATE ON public.kids_rooms
  FOR EACH ROW EXECUTE FUNCTION update_kids_updated_at_column();

CREATE TRIGGER update_kids_entries_updated_at BEFORE UPDATE ON public.kids_entries
  FOR EACH ROW EXECUTE FUNCTION update_kids_updated_at_column();

CREATE TRIGGER update_kids_subscriptions_updated_at BEFORE UPDATE ON public.kids_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_kids_updated_at_column();