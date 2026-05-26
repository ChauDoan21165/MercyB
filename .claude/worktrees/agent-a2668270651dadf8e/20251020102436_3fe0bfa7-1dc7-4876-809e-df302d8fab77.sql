-- Create profiles table for user information
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create user behavior tracking table
CREATE TABLE public.user_behavior_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  room_id text NOT NULL,
  interaction_type text NOT NULL, -- 'visited', 'completed', 'message_sent', 'keyword_triggered'
  interaction_data jsonb, -- stores additional context like keywords, message count, etc.
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.user_behavior_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own behavior"
  ON public.user_behavior_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own behavior"
  ON public.user_behavior_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX idx_user_behavior_user_id ON public.user_behavior_tracking(user_id);
CREATE INDEX idx_user_behavior_room_id ON public.user_behavior_tracking(room_id);

-- Create user knowledge profile table
CREATE TABLE public.user_knowledge_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  interests jsonb DEFAULT '[]'::jsonb, -- array of topics/rooms user is interested in
  completed_topics jsonb DEFAULT '[]'::jsonb, -- array of completed room IDs
  knowledge_areas jsonb DEFAULT '{}'::jsonb, -- map of topic -> proficiency level
  traits jsonb DEFAULT '{}'::jsonb, -- personality/relationship traits from matchmaker data
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.user_knowledge_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own knowledge profile"
  ON public.user_knowledge_profile FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own knowledge profile"
  ON public.user_knowledge_profile FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own knowledge profile"
  ON public.user_knowledge_profile FOR UPDATE
  USING (auth.uid() = user_id);

-- VIP3 users can view other VIP3 users' profiles for matchmaking
CREATE POLICY "VIP3 users can view other VIP3 profiles"
  ON public.user_knowledge_profile FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_subscriptions us
      JOIN subscription_tiers st ON us.tier_id = st.id
      WHERE us.user_id = auth.uid()
      AND st.name = 'VIP3'
      AND us.status = 'active'
    )
  );

-- Create matchmaking preferences table
CREATE TABLE public.matchmaking_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  looking_for text[], -- array of traits/interests they're looking for
  availability jsonb, -- when they're available for connections
  communication_style text, -- preferred communication style
  goals jsonb, -- what they want to achieve through matchmaking
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.matchmaking_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences"
  ON public.matchmaking_preferences FOR ALL
  USING (auth.uid() = user_id);

-- Create matchmaking suggestions table
CREATE TABLE public.matchmaking_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  suggested_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  match_score numeric(3,2), -- 0.00 to 1.00
  match_reason jsonb, -- explanation of why they match
  common_interests text[],
  complementary_traits text[],
  status text DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'expired'
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '7 days')
);

ALTER TABLE public.matchmaking_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view suggestions made for them"
  ON public.matchmaking_suggestions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their suggestion status"
  ON public.matchmaking_suggestions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX idx_matchmaking_user_id ON public.matchmaking_suggestions(user_id);
CREATE INDEX idx_matchmaking_status ON public.matchmaking_suggestions(status);