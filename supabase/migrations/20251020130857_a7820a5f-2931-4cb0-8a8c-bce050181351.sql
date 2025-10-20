-- Create user_points table to track total points per user
CREATE TABLE public.user_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own points"
ON public.user_points
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points"
ON public.user_points
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own points"
ON public.user_points
FOR UPDATE
USING (auth.uid() = user_id);

-- Create point_transactions table for detailed history
CREATE TABLE public.point_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  description TEXT,
  room_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own transactions"
ON public.point_transactions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
ON public.point_transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create function to award points
CREATE OR REPLACE FUNCTION public.award_points(
  _user_id UUID,
  _points INTEGER,
  _transaction_type TEXT,
  _description TEXT DEFAULT NULL,
  _room_id TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert transaction record
  INSERT INTO public.point_transactions (user_id, points, transaction_type, description, room_id)
  VALUES (_user_id, _points, _transaction_type, _description, _room_id);
  
  -- Update total points (create record if doesn't exist)
  INSERT INTO public.user_points (user_id, total_points, updated_at)
  VALUES (_user_id, _points, now())
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_points = user_points.total_points + _points,
    updated_at = now();
END;
$$;

-- Create trigger to update updated_at on user_points
CREATE TRIGGER update_user_points_updated_at
BEFORE UPDATE ON public.user_points
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create initial points for existing users
INSERT INTO public.user_points (user_id, total_points)
SELECT id, 0
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;