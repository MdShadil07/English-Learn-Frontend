-- Add user roles table for admin functionality
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add new columns to speaking_sessions for better tracking
ALTER TABLE public.speaking_sessions
ADD COLUMN IF NOT EXISTS corrections_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS words_learned TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS exchanges_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS learning_summary TEXT;

-- Add coins and streak tracking to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS correction_coins INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_practice_date DATE;

-- Update tasks table for better tracking
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 10;

-- Create function to update streak
CREATE OR REPLACE FUNCTION public.update_practice_streak()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  last_date DATE;
  today_date DATE;
BEGIN
  today_date := CURRENT_DATE;
  
  SELECT last_practice_date INTO last_date
  FROM public.profiles
  WHERE id = NEW.user_id;
  
  -- If first practice or practiced today, don't update
  IF last_date IS NULL THEN
    UPDATE public.profiles
    SET current_streak = 1,
        longest_streak = 1,
        last_practice_date = today_date
    WHERE id = NEW.user_id;
  ELSIF last_date = today_date THEN
    -- Already practiced today, don't update streak
    RETURN NEW;
  ELSIF last_date = today_date - INTERVAL '1 day' THEN
    -- Consecutive day
    UPDATE public.profiles
    SET current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        last_practice_date = today_date
    WHERE id = NEW.user_id;
  ELSE
    -- Streak broken
    UPDATE public.profiles
    SET current_streak = 1,
        last_practice_date = today_date
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to update streak on session creation
DROP TRIGGER IF EXISTS update_streak_trigger ON public.speaking_sessions;
CREATE TRIGGER update_streak_trigger
AFTER INSERT ON public.speaking_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_practice_streak();