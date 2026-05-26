
-- Create admin_users table with hierarchy levels 1-10
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email text NOT NULL,
  level integer NOT NULL CHECK (level >= 1 AND level <= 10),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create admin_logs table for audit trail
CREATE TABLE public.admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_admin_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  target_admin_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action IN ('create', 'promote', 'demote', 'delete', 'login', 'system_edit')),
  old_level integer,
  new_level integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Create function to get admin level
CREATE OR REPLACE FUNCTION public.get_admin_level(_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT level FROM public.admin_users WHERE user_id = _user_id),
    0
  );
$$;

-- Create function to check if user can manage another admin
CREATE OR REPLACE FUNCTION public.can_manage_admin(_requestor_id uuid, _target_level integer)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_admin_level(_requestor_id) > _target_level;
$$;

-- Create function to check if user can edit system
CREATE OR REPLACE FUNCTION public.can_edit_system(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_admin_level(_user_id) >= 9;
$$;

-- RLS Policies for admin_users

-- Admins can view themselves and lower level admins
CREATE POLICY "Admins can view lower level admins"
ON public.admin_users
FOR SELECT
USING (
  public.get_admin_level(auth.uid()) > 0 AND (
    user_id = auth.uid() OR 
    level < public.get_admin_level(auth.uid())
  )
);

-- Only level 9+ can insert new admins
CREATE POLICY "Level 9+ can create admins"
ON public.admin_users
FOR INSERT
WITH CHECK (
  public.get_admin_level(auth.uid()) >= 9
);

-- Higher level admins can update lower level admins
CREATE POLICY "Higher level admins can update lower level admins"
ON public.admin_users
FOR UPDATE
USING (
  public.get_admin_level(auth.uid()) > level AND level < 10
);

-- Higher level admins can delete lower level admins
CREATE POLICY "Higher level admins can delete lower level admins"
ON public.admin_users
FOR DELETE
USING (
  public.get_admin_level(auth.uid()) > level AND level < 10
);

-- RLS Policies for admin_logs

-- Admins can view logs for actions they performed or on admins they can see
CREATE POLICY "Admins can view relevant logs"
ON public.admin_logs
FOR SELECT
USING (
  public.get_admin_level(auth.uid()) > 0
);

-- Admins can insert their own logs
CREATE POLICY "Admins can insert logs"
ON public.admin_logs
FOR INSERT
WITH CHECK (
  public.get_admin_level(auth.uid()) > 0
);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_admin_users_timestamp
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_admin_users_updated_at();

-- Seed Admin Master (cd12536@gmail.com) as level 10
INSERT INTO public.admin_users (user_id, email, level)
SELECT id, email, 10
FROM auth.users
WHERE email = 'cd12536@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET level = 10;
